# -*- coding: utf-8 -*-
"""
Comando para importar tarifarios masivamente desde archivos Excel
Soporta formatos estándar ISS, SOAT y tarifarios personalizados
"""

import pandas as pd
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.contratacion.models import (
    Prestador, TarifarioCups, TarifarioMedicamentos, TarifarioDispositivos
)
from apps.catalogs.models import Cups, Medicamento, DispositivoMedico
from decimal import Decimal
from datetime import datetime
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Importa tarifarios masivamente desde archivos Excel'

    def add_arguments(self, parser):
        parser.add_argument(
            '--archivo',
            type=str,
            required=True,
            help='Ruta del archivo Excel a importar',
        )
        parser.add_argument(
            '--tipo',
            type=str,
            choices=['cups', 'medicamentos', 'dispositivos'],
            required=True,
            help='Tipo de tarifario: cups, medicamentos, dispositivos',
        )
        parser.add_argument(
            '--prestador-nit',
            type=str,
            required=True,
            help='NIT del prestador para asociar el tarifario',
        )
        parser.add_argument(
            '--hoja',
            type=str,
            default='Sheet1',
            help='Nombre de la hoja de Excel (default: Sheet1)',
        )
        parser.add_argument(
            '--vigencia-inicio',
            type=str,
            help='Fecha inicio vigencia (YYYY-MM-DD)',
        )
        parser.add_argument(
            '--vigencia-fin',
            type=str,
            help='Fecha fin vigencia (YYYY-MM-DD)',
        )
        parser.add_argument(
            '--skip-rows',
            type=int,
            default=0,
            help='Número de filas a saltar al inicio (default: 0)',
        )

    def handle(self, *args, **options):
        archivo = options['archivo']
        tipo = options['tipo']
        prestador_nit = options['prestador_nit']
        hoja = options['hoja']
        skip_rows = options['skip_rows']

        # Validar archivo
        if not os.path.exists(archivo):
            self.stdout.write(
                self.style.ERROR(f'Archivo no encontrado: {archivo}')
            )
            return

        # Validar prestador
        try:
            prestador = Prestador.objects.get(nit=prestador_nit)
        except Prestador.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Prestador con NIT {prestador_nit} no encontrado')
            )
            return

        # Obtener usuario
        try:
            usuario = User.objects.get(username='admin')
        except User.DoesNotExist:
            # Usar el primer usuario disponible
            usuario = User.objects.first()
            if not usuario:
                self.stdout.write(
                    self.style.ERROR('No hay usuarios disponibles en el sistema')
                )
                return

        # Procesar fechas de vigencia
        fecha_inicio = None
        fecha_fin = None
        
        if options['vigencia_inicio']:
            try:
                fecha_inicio = datetime.strptime(options['vigencia_inicio'], '%Y-%m-%d').date()
            except ValueError:
                self.stdout.write(
                    self.style.ERROR('Formato de fecha inicio inválido (usar YYYY-MM-DD)')
                )
                return

        if options['vigencia_fin']:
            try:
                fecha_fin = datetime.strptime(options['vigencia_fin'], '%Y-%m-%d').date()
            except ValueError:
                self.stdout.write(
                    self.style.ERROR('Formato de fecha fin inválido (usar YYYY-MM-DD)')
                )
                return

        self.stdout.write(
            self.style.SUCCESS(f'Iniciando importación de tarifario {tipo} desde {archivo}...')
        )

        try:
            # Leer archivo Excel
            df = pd.read_excel(archivo, sheet_name=hoja, skiprows=skip_rows)
            
            self.stdout.write(f'Archivo leído: {len(df)} filas encontradas')
            
            # Procesar según el tipo
            if tipo == 'cups':
                exitosos, errores = self._importar_cups(df, prestador, usuario, fecha_inicio, fecha_fin)
            elif tipo == 'medicamentos':
                exitosos, errores = self._importar_medicamentos(df, prestador, usuario, fecha_inicio, fecha_fin)
            elif tipo == 'dispositivos':
                exitosos, errores = self._importar_dispositivos(df, prestador, usuario, fecha_inicio, fecha_fin)

            # Reporte final
            self.stdout.write(
                self.style.SUCCESS(f'\n✅ IMPORTACIÓN COMPLETADA:')
            )
            self.stdout.write(f'  - Registros procesados exitosamente: {exitosos}')
            self.stdout.write(f'  - Errores encontrados: {errores}')
            
            if errores > 0:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  Revise los errores mostrados arriba')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error leyendo archivo Excel: {str(e)}')
            )

    def _importar_cups(self, df, prestador, usuario, fecha_inicio, fecha_fin):
        """Importar tarifario CUPS"""
        exitosos = 0
        errores = 0

        # Mapear columnas esperadas (flexible)
        columnas_cups = self._detectar_columnas_cups(df.columns)
        
        if not columnas_cups:
            self.stdout.write(
                self.style.ERROR('No se pudieron detectar las columnas requeridas para CUPS')
            )
            return 0, len(df)

        self.stdout.write(f'Columnas detectadas: {columnas_cups}')

        for index, row in df.iterrows():
            try:
                codigo_cups = str(row[columnas_cups['codigo']]).strip()
                descripcion = str(row[columnas_cups['descripcion']]).strip()
                
                # Obtener valores monetarios
                valor_iss = self._limpiar_valor(row.get(columnas_cups.get('valor_iss'), 0))
                valor_soat = self._limpiar_valor(row.get(columnas_cups.get('valor_soat'), 0))
                valor_particular = self._limpiar_valor(row.get(columnas_cups.get('valor_particular'), 0))

                # Buscar o crear código CUPS
                cups, created = Cups.objects.get_or_create(
                    codigo=codigo_cups,
                    defaults={
                        'descripcion': descripcion,
                        'activo': True,
                        'created_by': usuario
                    }
                )

                # Crear tarifario
                TarifarioCups.objects.update_or_create(
                    prestador=prestador,
                    codigo_cups=cups,
                    defaults={
                        'valor_iss': valor_iss,
                        'valor_soat': valor_soat,
                        'valor_particular': valor_particular,
                        'activo': True,
                        'fecha_inicio_vigencia': fecha_inicio,
                        'fecha_fin_vigencia': fecha_fin,
                        'created_by': usuario
                    }
                )

                exitosos += 1
                
                if exitosos % 100 == 0:
                    self.stdout.write(f'Procesados {exitosos} registros CUPS...')

            except Exception as e:
                errores += 1
                self.stdout.write(
                    self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                )

        return exitosos, errores

    def _importar_medicamentos(self, df, prestador, usuario, fecha_inicio, fecha_fin):
        """Importar tarifario de medicamentos"""
        exitosos = 0
        errores = 0

        columnas_med = self._detectar_columnas_medicamentos(df.columns)
        
        if not columnas_med:
            self.stdout.write(
                self.style.ERROR('No se pudieron detectar las columnas requeridas para medicamentos')
            )
            return 0, len(df)

        for index, row in df.iterrows():
            try:
                codigo_cum = str(row[columnas_med['codigo']]).strip()
                nombre_generico = str(row[columnas_med['nombre']]).strip()
                
                # Valores
                valor_compra = self._limpiar_valor(row.get(columnas_med.get('valor_compra'), 0))
                valor_venta = self._limpiar_valor(row.get(columnas_med.get('valor_venta'), 0))

                # Buscar o crear medicamento
                medicamento, created = Medicamento.objects.get_or_create(
                    codigo_cum=codigo_cum,
                    defaults={
                        'nombre_generico': nombre_generico,
                        'activo': True,
                        'created_by': usuario
                    }
                )

                # Crear tarifario
                TarifarioMedicamentos.objects.update_or_create(
                    prestador=prestador,
                    medicamento=medicamento,
                    defaults={
                        'valor_compra': valor_compra,
                        'valor_venta': valor_venta,
                        'activo': True,
                        'fecha_inicio_vigencia': fecha_inicio,
                        'fecha_fin_vigencia': fecha_fin,
                        'created_by': usuario
                    }
                )

                exitosos += 1
                
                if exitosos % 100 == 0:
                    self.stdout.write(f'Procesados {exitosos} medicamentos...')

            except Exception as e:
                errores += 1
                self.stdout.write(
                    self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                )

        return exitosos, errores

    def _importar_dispositivos(self, df, prestador, usuario, fecha_inicio, fecha_fin):
        """Importar tarifario de dispositivos médicos"""
        exitosos = 0
        errores = 0

        columnas_dev = self._detectar_columnas_dispositivos(df.columns)
        
        if not columnas_dev:
            self.stdout.write(
                self.style.ERROR('No se pudieron detectar las columnas requeridas para dispositivos')
            )
            return 0, len(df)

        for index, row in df.iterrows():
            try:
                codigo_invima = str(row[columnas_dev['codigo']]).strip()
                nombre_comercial = str(row[columnas_dev['nombre']]).strip()
                
                # Valores
                valor_compra = self._limpiar_valor(row.get(columnas_dev.get('valor_compra'), 0))
                valor_venta = self._limpiar_valor(row.get(columnas_dev.get('valor_venta'), 0))

                # Buscar o crear dispositivo
                dispositivo, created = DispositivoMedico.objects.get_or_create(
                    codigo_invima=codigo_invima,
                    defaults={
                        'nombre_comercial': nombre_comercial,
                        'activo': True,
                        'created_by': usuario
                    }
                )

                # Crear tarifario
                TarifarioDispositivos.objects.update_or_create(
                    prestador=prestador,
                    dispositivo=dispositivo,
                    defaults={
                        'valor_compra': valor_compra,
                        'valor_venta': valor_venta,
                        'activo': True,
                        'fecha_inicio_vigencia': fecha_inicio,
                        'fecha_fin_vigencia': fecha_fin,
                        'created_by': usuario
                    }
                )

                exitosos += 1
                
                if exitosos % 100 == 0:
                    self.stdout.write(f'Procesados {exitosos} dispositivos...')

            except Exception as e:
                errores += 1
                self.stdout.write(
                    self.style.ERROR(f'Error en fila {index + 1}: {str(e)}')
                )

        return exitosos, errores

    def _detectar_columnas_cups(self, columnas):
        """Detectar automáticamente las columnas para CUPS"""
        columnas_lower = [col.lower() for col in columnas]
        
        mapeo = {}
        
        # Detectar código CUPS
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['codigo', 'cups', 'cod']):
                mapeo['codigo'] = columnas[i]
                break
        
        # Detectar descripción
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['descripcion', 'desc', 'nombre', 'procedimiento']):
                mapeo['descripcion'] = columnas[i]
                break
        
        # Detectar valores
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['iss', 'valor_iss']):
                mapeo['valor_iss'] = columnas[i]
            elif any(word in col for word in ['soat', 'valor_soat']):
                mapeo['valor_soat'] = columnas[i]
            elif any(word in col for word in ['particular', 'valor_particular', 'privado']):
                mapeo['valor_particular'] = columnas[i]

        return mapeo if 'codigo' in mapeo and 'descripcion' in mapeo else None

    def _detectar_columnas_medicamentos(self, columnas):
        """Detectar automáticamente las columnas para medicamentos"""
        columnas_lower = [col.lower() for col in columnas]
        
        mapeo = {}
        
        # Detectar código CUM
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['cum', 'codigo']):
                mapeo['codigo'] = columnas[i]
                break
        
        # Detectar nombre
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['nombre', 'generico', 'medicamento']):
                mapeo['nombre'] = columnas[i]
                break
        
        # Detectar valores
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['compra', 'costo']):
                mapeo['valor_compra'] = columnas[i]
            elif any(word in col for word in ['venta', 'precio', 'valor']):
                mapeo['valor_venta'] = columnas[i]

        return mapeo if 'codigo' in mapeo and 'nombre' in mapeo else None

    def _detectar_columnas_dispositivos(self, columnas):
        """Detectar automáticamente las columnas para dispositivos"""
        columnas_lower = [col.lower() for col in columnas]
        
        mapeo = {}
        
        # Detectar código INVIMA
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['invima', 'codigo', 'registro']):
                mapeo['codigo'] = columnas[i]
                break
        
        # Detectar nombre
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['nombre', 'comercial', 'dispositivo']):
                mapeo['nombre'] = columnas[i]
                break
        
        # Detectar valores
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['compra', 'costo']):
                mapeo['valor_compra'] = columnas[i]
            elif any(word in col for word in ['venta', 'precio', 'valor']):
                mapeo['valor_venta'] = columnas[i]

        return mapeo if 'codigo' in mapeo and 'nombre' in mapeo else None

    def _limpiar_valor(self, valor):
        """Limpiar y convertir valores monetarios"""
        if pd.isna(valor) or valor == '':
            return Decimal('0')
        
        # Convertir a string y limpiar
        valor_str = str(valor).replace(',', '').replace('$', '').replace(' ', '')
        
        try:
            return Decimal(valor_str)
        except:
            return Decimal('0')