# -*- coding: utf-8 -*-
# apps/catalogs/management/commands/importar_tarifarios_oficiales.py

import json
import os
from datetime import datetime
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand, CommandError
from apps.catalogs.models import TarifarioISS2001, TarifarioSOAT2025

class Command(BaseCommand):
    help = 'Importar tarifarios oficiales ISS 2001 y SOAT 2025 desde archivos JSON extraídos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--archivo-iss',
            type=str,
            help='Ruta al archivo JSON de ISS 2001',
            default='scripts/output/iss_2001_completo_20250826_171708.json'
        )
        parser.add_argument(
            '--archivo-soat', 
            type=str,
            help='Ruta al archivo JSON de SOAT 2025',
            default='scripts/output/soat_2025_completo_20250826_172855.json'
        )
        parser.add_argument(
            '--limpiar',
            action='store_true',
            help='Limpiar tarifarios existentes antes de importar'
        )
        parser.add_argument(
            '--solo-iss',
            action='store_true', 
            help='Importar solo ISS 2001'
        )
        parser.add_argument(
            '--solo-soat',
            action='store_true',
            help='Importar solo SOAT 2025'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🏥 INICIANDO IMPORTACIÓN TARIFARIOS OFICIALES NoSQL'))
        
        # Limpiar si es solicitado
        if options['limpiar']:
            self._limpiar_tarifarios(options)
        
        # Importar ISS 2001
        if not options['solo_soat']:
            self._importar_iss_2001(options['archivo_iss'])
        
        # Importar SOAT 2025
        if not options['solo_iss']:
            self._importar_soat_2025(options['archivo_soat'])
        
        # Calcular agregaciones contractuales
        self._calcular_agregaciones_contractuales()
        
        self.stdout.write(self.style.SUCCESS('✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE'))

    def _limpiar_tarifarios(self, options):
        """Limpiar tarifarios existentes"""
        self.stdout.write('🗑️  Limpiando tarifarios existentes...')
        
        if not options['solo_soat']:
            count_iss = TarifarioISS2001.objects.all().delete()[0]
            self.stdout.write(f'   - ISS 2001: {count_iss} registros eliminados')
        
        if not options['solo_iss']:
            count_soat = TarifarioSOAT2025.objects.all().delete()[0]
            self.stdout.write(f'   - SOAT 2025: {count_soat} registros eliminados')

    def _importar_iss_2001(self, archivo_path):
        """Importar tarifario ISS 2001"""
        self.stdout.write('📋 Importando ISS 2001...')
        
        # Verificar archivo
        if not os.path.exists(archivo_path):
            raise CommandError(f'Archivo ISS 2001 no encontrado: {archivo_path}')
        
        # Cargar datos
        with open(archivo_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Contadores
        total_procesados = 0
        total_creados = 0
        total_errores = 0
        fecha_extraccion = datetime.now()
        
        # Procesar por categoría
        for categoria, registros in data.items():
            self.stdout.write(f'   • Procesando {categoria}: {len(registros)} registros')
            
            for registro in registros:
                try:
                    # Mapear tipo según categoría
                    tipo = self._mapear_tipo_iss(categoria)
                    
                    # Convertir valores decimales
                    uvr = self._convertir_decimal(registro.get('uvr'))
                    valor_calculado = self._convertir_decimal(registro.get('valor_calculado'))
                    
                    # IMPORTANTE: Para TODOS los códigos con valores fijos, usar campo 'valor'
                    # Esto incluye consultas, habitaciones, algunos diagnósticos, etc.
                    if registro.get('valor') is not None:
                        valor_fijo = self._convertir_decimal(registro.get('valor'))
                        if valor_fijo:
                            # Si hay un valor fijo, usarlo como valor_calculado
                            valor_calculado = valor_fijo
                    
                    # Calcular valor UVR 2001 (UVR x $1,270) - SOLO para códigos con UVR
                    valor_uvr_2001 = None
                    if uvr:
                        valor_uvr_2001 = uvr * Decimal('1270')
                    
                    # Crear registro
                    tarifario, created = TarifarioISS2001.objects.get_or_create(
                        codigo=registro['codigo'],
                        defaults={
                            'descripcion': registro.get('descripcion', ''),
                            'tipo': tipo,
                            'uvr': uvr,
                            'valor_uvr_2001': valor_uvr_2001,
                            'valor_calculado': valor_calculado,
                            'seccion_manual': registro.get('seccion', ''),
                            'capitulo': registro.get('capitulo', ''),
                            'grupo_quirurgico': registro.get('grupo_quirurgico'),
                            'restricciones': registro.get('restricciones', {}),
                            'manual_version': '2001',
                            'fecha_extraccion': fecha_extraccion
                        }
                    )
                    
                    if created:
                        total_creados += 1
                    
                    total_procesados += 1
                    
                except Exception as e:
                    total_errores += 1
                    self.stdout.write(
                        self.style.WARNING(f'     ⚠️  Error en código {registro.get("codigo", "N/A")}: {str(e)}')
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f'   ✅ ISS 2001: {total_creados} creados, {total_procesados - total_creados} actualizados, {total_errores} errores')
        )

    def _importar_soat_2025(self, archivo_path):
        """Importar tarifario SOAT 2025"""
        self.stdout.write('🛡️  Importando SOAT 2025...')
        
        # Verificar archivo
        if not os.path.exists(archivo_path):
            raise CommandError(f'Archivo SOAT 2025 no encontrado: {archivo_path}')
        
        # Cargar datos
        with open(archivo_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Contadores
        total_procesados = 0
        total_creados = 0
        total_errores = 0
        fecha_extraccion = datetime.now()
        
        # Procesar por categoría
        for categoria, registros in data.items():
            self.stdout.write(f'   • Procesando {categoria}: {len(registros)} registros')
            
            for registro in registros:
                try:
                    # Mapear tipo según categoría
                    tipo = self._mapear_tipo_soat(categoria)
                    
                    # Convertir valores decimales
                    uvb = self._convertir_decimal(registro.get('uvb'))
                    valor_2025_uvb = self._convertir_decimal(registro.get('valor_2025_uvb'))
                    valor_calculado = self._convertir_decimal(registro.get('valor_calculado'))
                    
                    # Para SOAT, usar valor_2025_uvb como valor_calculado si no existe
                    if not valor_calculado and valor_2025_uvb:
                        valor_calculado = valor_2025_uvb
                    
                    # Crear registro
                    tarifario, created = TarifarioSOAT2025.objects.get_or_create(
                        codigo=registro['codigo'],
                        defaults={
                            'descripcion': registro.get('descripcion', ''),
                            'tipo': tipo,
                            'grupo_quirurgico': registro.get('grupo_quirurgico'),
                            'uvb': uvb,
                            'valor_2025_uvb': valor_2025_uvb,
                            'valor_calculado': valor_calculado,
                            'seccion_manual': registro.get('seccion', ''),
                            'tabla_origen': registro.get('tabla_origen'),
                            'capitulo': registro.get('capitulo', ''),
                            'estructura_tabla': registro.get('estructura_tabla'),
                            'restricciones': registro.get('restricciones', {}),
                            'manual_version': '2025',
                            'fecha_extraccion': fecha_extraccion
                        }
                    )
                    
                    if created:
                        total_creados += 1
                    
                    total_procesados += 1
                    
                except Exception as e:
                    total_errores += 1
                    self.stdout.write(
                        self.style.WARNING(f'     ⚠️  Error en código {registro.get("codigo", "N/A")}: {str(e)}')
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f'   ✅ SOAT 2025: {total_creados} creados, {total_procesados - total_creados} actualizados, {total_errores} errores')
        )

    def _calcular_agregaciones_contractuales(self):
        """Calcular campos agregados con lookups a contratos"""
        self.stdout.write('🔗 Calculando agregaciones contractuales...')
        
        # TODO: Implementar agregaciones MongoDB cuando existan contratos
        # Aquí se ejecutarían pipelines como:
        # db.tarifario_iss_2001.aggregate([
        #   {
        #     $lookup: {
        #       from: "contratos", 
        #       localField: "codigo",
        #       foreignField: "tarifas_negociadas.codigo_oficial",
        #       as: "contratos"
        #     }
        #   },
        #   {
        #     $addFields: {
        #       contratos_activos: { $size: "$contratos" },
        #       uso_frecuente: { $gte: [{ $size: "$contratos" }, 5] }
        #     }
        #   }
        # ])
        
        self.stdout.write('   📊 Agregaciones contractuales pendientes (requieren contratos existentes)')

    def _mapear_tipo_iss(self, categoria):
        """Mapear categoría ISS a tipo del modelo"""
        mapeo = {
            'procedimientos_quirurgicos': 'quirurgico',
            'examenes_diagnosticos': 'diagnostico',
            'consultas': 'consulta', 
            'internacion': 'internacion',
            'servicios_profesionales': 'servicio_profesional',
            'derechos_sala': 'derecho_sala',
            'conjuntos_integrales': 'conjunto_integral',
            'otros_servicios': 'otro_servicio'
        }
        return mapeo.get(categoria, 'otro_servicio')

    def _mapear_tipo_soat(self, categoria):
        """Mapear categoría SOAT a tipo del modelo"""
        mapeo = {
            'procedimientos_quirurgicos': 'procedimientos_quirurgicos',
            'examenes_diagnosticos': 'examenes_diagnosticos',
            'consultas': 'consultas',
            'estancias': 'estancias',
            'laboratorio_clinico': 'laboratorio_clinico',
            'conjuntos_integrales': 'conjuntos_integrales',
            'otros_servicios': 'otros_servicios'
        }
        return mapeo.get(categoria, 'otros_servicios')

    def _convertir_decimal(self, valor):
        """Convertir valor a Decimal de forma segura"""
        if valor is None or valor == '':
            return None
        
        try:
            # Limpiar strings (remover caracteres no numéricos excepto punto y coma)
            if isinstance(valor, str):
                valor = valor.replace(',', '').replace('$', '').replace(' ', '')
                if not valor:
                    return None
            
            return Decimal(str(valor))
        except (InvalidOperation, ValueError, TypeError):
            return None