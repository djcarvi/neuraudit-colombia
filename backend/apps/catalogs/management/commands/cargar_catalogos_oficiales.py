# -*- coding: utf-8 -*-
# apps/catalogs/management/commands/cargar_catalogos_oficiales.py

"""
Comando para cargar catálogos oficiales del MinSalud
- CUPS (Clasificación Única de Procedimientos en Salud)
- CUM (Código Único de Medicamentos) 
- IUM (Identificación Única de Medicamentos)
- Dispositivos Médicos

Uso: python manage.py cargar_catalogos_oficiales --tipo cups --archivo /ruta/archivo.txt
"""

import csv
import logging
from decimal import Decimal
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.catalogs.models import (
    CatalogoCUPSOficial,
    CatalogoCUMOficial,
    CatalogoIUMOficial,
    CatalogoDispositivosOficial
)

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Carga catálogos oficiales del MinSalud desde archivos TXT/CSV'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tipo',
            type=str,
            required=True,
            choices=['cups', 'cum', 'ium', 'dispositivos'],
            help='Tipo de catálogo a cargar'
        )
        parser.add_argument(
            '--archivo',
            type=str,
            required=True,
            help='Ruta completa al archivo del catálogo'
        )
        parser.add_argument(
            '--encoding',
            type=str,
            default='utf-8',
            help='Codificación del archivo (default: utf-8)'
        )
        parser.add_argument(
            '--separador',
            type=str,
            default='|',
            help='Separador de campos (default: |)'
        )
        parser.add_argument(
            '--chunk-size',
            type=int,
            default=1000,
            help='Tamaño del chunk para bulk insert (default: 1000)'
        )
        parser.add_argument(
            '--limpiar',
            action='store_true',
            help='Limpiar catálogo antes de cargar'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Solo analizar sin guardar en base de datos'
        )

    def handle(self, *args, **options):
        tipo = options['tipo']
        archivo_path = options['archivo']
        encoding = options['encoding']
        separador = options['separador']
        chunk_size = options['chunk_size']
        limpiar = options['limpiar']
        dry_run = options['dry_run']

        self.stdout.write(
            self.style.SUCCESS(f'🚀 Iniciando carga catálogo {tipo.upper()}: {archivo_path}')
        )

        try:
            # Verificar archivo
            with open(archivo_path, 'r', encoding=encoding) as f:
                pass
        except FileNotFoundError:
            raise CommandError(f'❌ Archivo no encontrado: {archivo_path}')
        except UnicodeDecodeError:
            self.stdout.write(
                self.style.WARNING(f'⚠️ Error UTF-8, intentando con latin-1')
            )
            encoding = 'latin-1'

        # Analizar tamaño
        import os
        tamaño_mb = os.path.getsize(archivo_path) / (1024 * 1024)
        self.stdout.write(f'📊 Tamaño archivo: {tamaño_mb:.2f} MB')

        if dry_run:
            self.stdout.write(self.style.WARNING('🔍 MODO DRY-RUN: Solo análisis'))

        try:
            # Seleccionar procesador según tipo
            procesadores = {
                'cups': self._procesar_cups,
                'cum': self._procesar_cum,
                'ium': self._procesar_ium,
                'dispositivos': self._procesar_dispositivos
            }
            
            procesador = procesadores[tipo]
            procesador(archivo_path, encoding, separador, chunk_size, limpiar, dry_run)
            
        except Exception as e:
            logger.error(f'Error procesando catálogo {tipo}: {str(e)}')
            raise CommandError(f'❌ Error: {str(e)}')

        self.stdout.write(
            self.style.SUCCESS(f'✅ Carga catálogo {tipo.upper()} completada exitosamente')
        )

    def _analizar_archivo(self, archivo_path, encoding, separador):
        """
        Analiza estructura del archivo y muestra estadísticas
        """
        total_lineas = 0
        muestra_lineas = []
        
        with open(archivo_path, 'r', encoding=encoding) as f:
            reader = csv.reader(f, delimiter=separador)
            
            for i, row in enumerate(reader):
                total_lineas += 1
                
                # Guardar muestra de primeras 5 líneas
                if i < 5:
                    muestra_lineas.append(row)

        self.stdout.write(f'📋 Total líneas: {total_lineas:,}')
        self.stdout.write(f'📋 Campos por línea: {len(muestra_lineas[0]) if muestra_lineas else 0}')
        
        # Mostrar muestra
        self.stdout.write('\n📋 MUESTRA PRIMERAS LÍNEAS:')
        for i, row in enumerate(muestra_lineas):
            self.stdout.write(f'  Línea {i+1}: {row[:3]}...') # Solo primeros 3 campos
        
        return total_lineas

    def _procesar_cups(self, archivo_path, encoding, separador, chunk_size, limpiar, dry_run):
        """
        Procesa catálogo CUPS oficial
        Estructura esperada: CODIGO|DESCRIPCION|TARIFAISS|TARIFASOAT|ESTADO
        """
        self.stdout.write('🩺 Procesando catálogo CUPS oficial')
        
        total_lineas = self._analizar_archivo(archivo_path, encoding, separador)
        
        if dry_run:
            return

        if limpiar:
            self.stdout.write('🗑️ Limpiando catálogo CUPS existente...')
            CatalogoCUPSOficial.objects.all().delete()

        registros_chunk = []
        procesados = 0
        
        with transaction.atomic():
            with open(archivo_path, 'r', encoding=encoding) as f:
                reader = csv.reader(f, delimiter=separador)
                
                for row in reader:
                    if len(row) < 2:  # Saltar líneas vacías
                        continue
                    
                    try:
                        # Mapear campos CUPS
                        codigo = row[0].strip()
                        descripcion = row[1].strip() if len(row) > 1 else ''
                        tarifa_iss = self._safe_decimal(row[2]) if len(row) > 2 else Decimal('0')
                        tarifa_soat = self._safe_decimal(row[3]) if len(row) > 3 else Decimal('0')
                        estado = row[4].strip() if len(row) > 4 else 'ACTIVO'
                        
                        registro = CatalogoCUPSOficial(
                            codigo_cups=codigo,
                            descripcion=descripcion,
                            seccion=self._extraer_seccion_cups(codigo),
                            categoria=self._extraer_categoria_cups(codigo),
                            tarifa_iss_2001=tarifa_iss,
                            tarifa_soat_vigente=tarifa_soat,
                            estado=estado,
                            complejidad=self._determinar_complejidad_cups(codigo, descripcion),
                            requiere_autorizacion=self._requiere_autorizacion_cups(codigo)
                        )
                        
                        registros_chunk.append(registro)
                        
                        # Bulk insert por chunks
                        if len(registros_chunk) >= chunk_size:
                            CatalogoCUPSOficial.objects.bulk_create(registros_chunk)
                            procesados += len(registros_chunk)
                            registros_chunk = []
                            
                            self.stdout.write(f'📦 Procesados: {procesados:,}/{total_lineas:,}')
                    
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(f'⚠️ Error línea {procesados + 1}: {str(e)}')
                        )
                        continue

                # Insertar último chunk
                if registros_chunk:
                    CatalogoCUPSOficial.objects.bulk_create(registros_chunk)
                    procesados += len(registros_chunk)

        self.stdout.write(f'✅ CUPS procesados: {procesados:,}')

    def _procesar_cum(self, archivo_path, encoding, separador, chunk_size, limpiar, dry_run):
        """
        Procesa catálogo CUM oficial
        Estructura esperada: CODIGO_CUM|NOMBRE_MEDICAMENTO|CONCENTRACION|FORMA_FARMACEUTICA|ESTADO
        """
        self.stdout.write('💊 Procesando catálogo CUM oficial')
        
        total_lineas = self._analizar_archivo(archivo_path, encoding, separador)
        
        if dry_run:
            return

        if limpiar:
            self.stdout.write('🗑️ Limpiando catálogo CUM existente...')
            CatalogoCUMOficial.objects.all().delete()

        registros_chunk = []
        procesados = 0
        
        with transaction.atomic():
            with open(archivo_path, 'r', encoding=encoding) as f:
                reader = csv.reader(f, delimiter=separador)
                
                for row in reader:
                    if len(row) < 2:
                        continue
                    
                    try:
                        codigo_cum = row[0].strip()
                        nombre = row[1].strip() if len(row) > 1 else ''
                        concentracion = row[2].strip() if len(row) > 2 else ''
                        forma_farmaceutica = row[3].strip() if len(row) > 3 else ''
                        estado = row[4].strip() if len(row) > 4 else 'ACTIVO'
                        
                        registro = CatalogoCUMOficial(
                            codigo_cum=codigo_cum,
                            nombre_medicamento=nombre,
                            concentracion=concentracion,
                            forma_farmaceutica=forma_farmaceutica,
                            estado=estado,
                            categoria_terapeutica=self._determinar_categoria_terapeutica(nombre),
                            requiere_prescripcion=self._requiere_prescripcion_cum(codigo_cum),
                            controlado=self._es_medicamento_controlado(nombre),
                            pos_no_pos=self._determinar_pos_cum(codigo_cum)
                        )
                        
                        registros_chunk.append(registro)
                        
                        if len(registros_chunk) >= chunk_size:
                            CatalogoCUMOficial.objects.bulk_create(registros_chunk)
                            procesados += len(registros_chunk)
                            registros_chunk = []
                            
                            self.stdout.write(f'📦 Procesados: {procesados:,}/{total_lineas:,}')
                    
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(f'⚠️ Error línea {procesados + 1}: {str(e)}')
                        )
                        continue

                if registros_chunk:
                    CatalogoCUMOficial.objects.bulk_create(registros_chunk)
                    procesados += len(registros_chunk)

        self.stdout.write(f'✅ CUM procesados: {procesados:,}')

    def _procesar_ium(self, archivo_path, encoding, separador, chunk_size, limpiar, dry_run):
        """
        Procesa catálogo IUM oficial
        """
        self.stdout.write('🔬 Procesando catálogo IUM oficial')
        
        total_lineas = self._analizar_archivo(archivo_path, encoding, separador)
        
        if dry_run:
            return

        if limpiar:
            self.stdout.write('🗑️ Limpiando catálogo IUM existente...')
            CatalogoIUMOficial.objects.all().delete()

        registros_chunk = []
        procesados = 0
        
        with transaction.atomic():
            with open(archivo_path, 'r', encoding=encoding) as f:
                reader = csv.reader(f, delimiter=separador)
                
                for row in reader:
                    if len(row) < 2:
                        continue
                    
                    try:
                        codigo_ium = row[0].strip()
                        nombre = row[1].strip() if len(row) > 1 else ''
                        descripcion = row[2].strip() if len(row) > 2 else ''
                        estado = row[3].strip() if len(row) > 3 else 'ACTIVO'
                        
                        registro = CatalogoIUMOficial(
                            codigo_ium=codigo_ium,
                            nombre_insumo=nombre,
                            descripcion=descripcion,
                            estado=estado,
                            categoria=self._determinar_categoria_ium(nombre),
                            unidad_medida=self._extraer_unidad_medida_ium(descripcion)
                        )
                        
                        registros_chunk.append(registro)
                        
                        if len(registros_chunk) >= chunk_size:
                            CatalogoIUMOficial.objects.bulk_create(registros_chunk)
                            procesados += len(registros_chunk)
                            registros_chunk = []
                            
                            self.stdout.write(f'📦 Procesados: {procesados:,}/{total_lineas:,}')
                    
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(f'⚠️ Error línea {procesados + 1}: {str(e)}')
                        )
                        continue

                if registros_chunk:
                    CatalogoIUMOficial.objects.bulk_create(registros_chunk)
                    procesados += len(registros_chunk)

        self.stdout.write(f'✅ IUM procesados: {procesados:,}')

    def _procesar_dispositivos(self, archivo_path, encoding, separador, chunk_size, limpiar, dry_run):
        """
        Procesa catálogo de dispositivos médicos oficial
        """
        self.stdout.write('🔧 Procesando catálogo Dispositivos Médicos oficial')
        
        total_lineas = self._analizar_archivo(archivo_path, encoding, separador)
        
        if dry_run:
            return

        if limpiar:
            self.stdout.write('🗑️ Limpiando catálogo Dispositivos existente...')
            CatalogoDispositivosOficial.objects.all().delete()

        registros_chunk = []
        procesados = 0
        
        with transaction.atomic():
            with open(archivo_path, 'r', encoding=encoding) as f:
                reader = csv.reader(f, delimiter=separador)
                
                for row in reader:
                    if len(row) < 2:
                        continue
                    
                    try:
                        codigo = row[0].strip()
                        nombre = row[1].strip() if len(row) > 1 else ''
                        descripcion = row[2].strip() if len(row) > 2 else ''
                        clasificacion = row[3].strip() if len(row) > 3 else ''
                        estado = row[4].strip() if len(row) > 4 else 'ACTIVO'
                        
                        registro = CatalogoDispositivosOficial(
                            codigo_dispositivo=codigo,
                            nombre_dispositivo=nombre,
                            descripcion=descripcion,
                            clasificacion_riesgo=clasificacion,
                            estado=estado,
                            categoria=self._determinar_categoria_dispositivo(nombre),
                            requiere_autorizacion=self._requiere_autorizacion_dispositivo(clasificacion)
                        )
                        
                        registros_chunk.append(registro)
                        
                        if len(registros_chunk) >= chunk_size:
                            CatalogoDispositivosOficial.objects.bulk_create(registros_chunk)
                            procesados += len(registros_chunk)
                            registros_chunk = []
                            
                            self.stdout.write(f'📦 Procesados: {procesados:,}/{total_lineas:,}')
                    
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(f'⚠️ Error línea {procesados + 1}: {str(e)}')
                        )
                        continue

                if registros_chunk:
                    CatalogoDispositivosOficial.objects.bulk_create(registros_chunk)
                    procesados += len(registros_chunk)

        self.stdout.write(f'✅ Dispositivos procesados: {procesados:,}')

    # Métodos auxiliares para lógica de negocio

    def _safe_decimal(self, value):
        """Convierte string a Decimal de forma segura"""
        try:
            return Decimal(str(value).replace(',', '').replace('$', ''))
        except:
            return Decimal('0')

    def _extraer_seccion_cups(self, codigo):
        """Extrae sección del código CUPS"""
        if not codigo:
            return 'NO_CLASIFICADO'
        
        # Primeros 2 dígitos definen sección
        seccion = codigo[:2]
        secciones = {
            '01': 'CONSULTA_MEDICINA_GENERAL',
            '02': 'CONSULTA_ESPECIALIZADA',
            '03': 'URGENCIAS',
            '04': 'HOSPITALIZACION',
            '05': 'QUIRURGICO',
            '06': 'ANESTESIA',
            '07': 'AYUDAS_DIAGNOSTICAS',
            '08': 'TERAPIAS',
            '09': 'TRANSPORTE',
            '89': 'PAQUETES'
        }
        return secciones.get(seccion, 'OTROS')

    def _extraer_categoria_cups(self, codigo):
        """Extrae categoría del código CUPS"""
        return codigo[:4] if codigo else 'XXXX'

    def _determinar_complejidad_cups(self, codigo, descripcion):
        """Determina complejidad del procedimiento CUPS"""
        if any(word in descripcion.upper() for word in ['ALTA COMPLEJIDAD', 'ESPECIALIZADA']):
            return 'ALTA'
        elif any(word in descripcion.upper() for word in ['MEDIA COMPLEJIDAD']):
            return 'MEDIA'
        else:
            return 'BAJA'

    def _requiere_autorizacion_cups(self, codigo):
        """Determina si código CUPS requiere autorización"""
        # Códigos que típicamente requieren autorización
        codigos_autorizacion = ['05', '06', '07', '08', '89']  # Cirugía, anestesia, etc.
        return codigo[:2] in codigos_autorizacion if codigo else False

    def _determinar_categoria_terapeutica(self, nombre):
        """Determina categoría terapéutica del medicamento"""
        nombre_upper = nombre.upper()
        
        if any(word in nombre_upper for word in ['ANTIBIOTIC', 'PENICILINA', 'CEFALEXINA']):
            return 'ANTIBIOTICOS'
        elif any(word in nombre_upper for word in ['ANALGESIC', 'IBUPROFENO', 'ACETAMINOFEN']):
            return 'ANALGESICOS'
        elif any(word in nombre_upper for word in ['ANTIHIPERTENSIV', 'ENALAPRIL', 'LOSARTAN']):
            return 'CARDIOVASCULAR'
        else:
            return 'OTROS'

    def _requiere_prescripcion_cum(self, codigo):
        """Determina si medicamento CUM requiere prescripción"""
        # Lógica simplificada - en producción sería más compleja
        return True  # Por defecto requiere prescripción

    def _es_medicamento_controlado(self, nombre):
        """Determina si es medicamento controlado"""
        nombre_upper = nombre.upper()
        controlados = ['MORFINA', 'CODEINA', 'TRAMADOL', 'LORAZEPAM', 'DIAZEPAM']
        return any(controlado in nombre_upper for controlado in controlados)

    def _determinar_pos_cum(self, codigo):
        """Determina si está en POS o NO POS"""
        # Lógica simplificada - en producción consultaría base de datos oficial
        return 'POS'  # Por defecto POS

    def _determinar_categoria_ium(self, nombre):
        """Determina categoría de insumo IUM"""
        nombre_upper = nombre.upper()
        
        if any(word in nombre_upper for word in ['SUTURA', 'HILO']):
            return 'SUTURAS'
        elif any(word in nombre_upper for word in ['CATETER', 'SONDA']):
            return 'CATETERES'
        elif any(word in nombre_upper for word in ['JERINGA', 'AGUJA']):
            return 'INSTRUMENTAL'
        else:
            return 'OTROS'

    def _extraer_unidad_medida_ium(self, descripcion):
        """Extrae unidad de medida del insumo"""
        desc_upper = descripcion.upper()
        
        if 'UNIDAD' in desc_upper:
            return 'UNIDAD'
        elif 'METRO' in desc_upper:
            return 'METRO'
        elif 'ML' in desc_upper or 'MILILITRO' in desc_upper:
            return 'ML'
        else:
            return 'UNIDAD'

    def _determinar_categoria_dispositivo(self, nombre):
        """Determina categoría de dispositivo médico"""
        nombre_upper = nombre.upper()
        
        if any(word in nombre_upper for word in ['MARCAPASO', 'PROTESIS']):
            return 'IMPLANTABLES'
        elif any(word in nombre_upper for word in ['MONITOR', 'VENTILADOR']):
            return 'EQUIPOS_BIOMEDICOS'
        elif any(word in nombre_upper for word in ['LENTE', 'GAFA']):
            return 'OPTICOS'
        else:
            return 'OTROS'

    def _requiere_autorizacion_dispositivo(self, clasificacion):
        """Determina si dispositivo requiere autorización"""
        # Dispositivos clase III y algunos clase II requieren autorización
        return clasificacion in ['III', 'IIB'] if clasificacion else False