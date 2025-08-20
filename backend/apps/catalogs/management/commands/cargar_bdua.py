# -*- coding: utf-8 -*-
# apps/catalogs/management/commands/cargar_bdua.py

"""
Comando para cargar archivos BDUA (Base de Datos Única de Afiliados)
- MS: Régimen subsidiado
- MC: Régimen contributivo

Estructura unificada con campo 'regimen' según requerimientos del cliente.

Uso: python manage.py cargar_bdua --archivo /ruta/archivo.txt --regimen MS
"""

import csv
import logging
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.catalogs.models import BDUAAfiliados

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Carga archivos BDUA (MS subsidiado y MC contributivo) en estructura unificada'

    def add_arguments(self, parser):
        parser.add_argument(
            '--archivo',
            type=str,
            required=True,
            help='Ruta completa al archivo BDUA'
        )
        parser.add_argument(
            '--regimen',
            type=str,
            required=True,
            choices=['MS', 'MC'],
            help='Tipo de régimen: MS (subsidiado) o MC (contributivo)'
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
            help='Limpiar BDUA antes de cargar'
        )
        parser.add_argument(
            '--limpiar-regimen',
            action='store_true',
            help='Limpiar solo el régimen específico antes de cargar'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Solo analizar sin guardar en base de datos'
        )

    def handle(self, *args, **options):
        archivo_path = options['archivo']
        regimen = options['regimen']
        encoding = options['encoding']
        separador = options['separador']
        chunk_size = options['chunk_size']
        limpiar = options['limpiar']
        limpiar_regimen = options['limpiar_regimen']
        dry_run = options['dry_run']

        self.stdout.write(
            self.style.SUCCESS(f'🚀 Iniciando carga BDUA {regimen}: {archivo_path}')
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
            self._procesar_bdua(
                archivo_path, regimen, encoding, separador, 
                chunk_size, limpiar, limpiar_regimen, dry_run
            )
            
        except Exception as e:
            logger.error(f'Error procesando BDUA {regimen}: {str(e)}')
            raise CommandError(f'❌ Error: {str(e)}')

        self.stdout.write(
            self.style.SUCCESS(f'✅ Carga BDUA {regimen} completada exitosamente')
        )

    def _analizar_archivo(self, archivo_path, encoding, separador):
        """
        Analiza estructura del archivo BDUA y muestra estadísticas
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
        
        # Mostrar muestra (ocultando datos sensibles)
        self.stdout.write('\n📋 MUESTRA ESTRUCTURA (datos ocultos por privacidad):')
        for i, row in enumerate(muestra_lineas):
            campos_muestra = []
            for j, campo in enumerate(row[:5]):  # Solo primeros 5 campos
                if j in [0, 1]:  # Ocultar documento/nombres
                    campos_muestra.append('***OCULTO***')
                else:
                    campos_muestra.append(campo)
            self.stdout.write(f'  Línea {i+1}: {campos_muestra}')
        
        return total_lineas

    def _procesar_bdua(self, archivo_path, regimen, encoding, separador, 
                      chunk_size, limpiar, limpiar_regimen, dry_run):
        """
        Procesa archivo BDUA según régimen (MS o MC)
        """
        self.stdout.write(f'👥 Procesando BDUA régimen {regimen}')
        
        total_lineas = self._analizar_archivo(archivo_path, encoding, separador)
        
        if dry_run:
            return

        # Limpiar si se solicita
        if limpiar:
            self.stdout.write('🗑️ Limpiando toda la BDUA...')
            BDUAAfiliados.objects.all().delete()
        elif limpiar_regimen:
            self.stdout.write(f'🗑️ Limpiando BDUA régimen {regimen}...')
            BDUAAfiliados.objects.filter(regimen=regimen).delete()

        registros_chunk = []
        procesados = 0
        errores = 0
        
        with transaction.atomic():
            with open(archivo_path, 'r', encoding=encoding) as f:
                reader = csv.reader(f, delimiter=separador)
                
                for i, row in enumerate(reader):
                    if len(row) < 5:  # Mínimo campos requeridos
                        errores += 1
                        continue
                    
                    try:
                        # Mapear campos según régimen
                        if regimen == 'MS':
                            registro = self._procesar_fila_ms(row, regimen)
                        else:  # MC
                            registro = self._procesar_fila_mc(row, regimen)
                        
                        if registro:
                            registros_chunk.append(registro)
                        
                        # Bulk insert por chunks
                        if len(registros_chunk) >= chunk_size:
                            BDUAAfiliados.objects.bulk_create(
                                registros_chunk, 
                                ignore_conflicts=True  # Evitar duplicados
                            )
                            procesados += len(registros_chunk)
                            registros_chunk = []
                            
                            self.stdout.write(
                                f'📦 Procesados: {procesados:,}/{total_lineas:,} '
                                f'(Errores: {errores:,})'
                            )
                    
                    except Exception as e:
                        errores += 1
                        if errores <= 10:  # Solo mostrar primeros 10 errores
                            self.stdout.write(
                                self.style.WARNING(f'⚠️ Error línea {i+1}: {str(e)}')
                            )
                        continue

                # Insertar último chunk
                if registros_chunk:
                    BDUAAfiliados.objects.bulk_create(
                        registros_chunk,
                        ignore_conflicts=True
                    )
                    procesados += len(registros_chunk)

        self.stdout.write(f'✅ BDUA {regimen} procesados: {procesados:,}')
        self.stdout.write(f'⚠️ Errores encontrados: {errores:,}')

    def _procesar_fila_ms(self, row, regimen):
        """
        Procesa fila de régimen subsidiado (MS)
        Estructura típica MS: TIPO_DOC|NUM_DOC|APELLIDO1|APELLIDO2|NOMBRE1|NOMBRE2|FECHA_NAC|SEXO|MUNICIPIO|ESTADO|FECHA_AFILIACION|...
        """
        try:
            # Validar campos mínimos
            if len(row) < 11:
                return None

            tipo_documento = row[0].strip()
            numero_documento = row[1].strip()
            
            # Validaciones básicas
            if not numero_documento or not tipo_documento:
                return None

            # Construir nombres completos
            primer_apellido = row[2].strip() if len(row) > 2 else ''
            segundo_apellido = row[3].strip() if len(row) > 3 else ''
            primer_nombre = row[4].strip() if len(row) > 4 else ''
            segundo_nombre = row[5].strip() if len(row) > 5 else ''
            
            nombres_completos = f"{primer_nombre} {segundo_nombre}".strip()
            apellidos_completos = f"{primer_apellido} {segundo_apellido}".strip()

            # Parsear fecha de nacimiento
            fecha_nacimiento = self._parsear_fecha(row[6]) if len(row) > 6 else None
            
            # Otros campos
            sexo = row[7].strip() if len(row) > 7 else ''
            codigo_municipio = row[8].strip() if len(row) > 8 else ''
            estado_afiliacion = row[9].strip() if len(row) > 9 else 'ACTIVO'
            fecha_afiliacion = self._parsear_fecha(row[10]) if len(row) > 10 else None

            registro = BDUAAfiliados(
                regimen=regimen,
                tipo_documento_identificacion=tipo_documento,
                numero_documento_identificacion=numero_documento,
                primer_apellido=primer_apellido,
                segundo_apellido=segundo_apellido,
                primer_nombre=primer_nombre,
                segundo_nombre=segundo_nombre,
                nombres_completos=nombres_completos,
                apellidos_completos=apellidos_completos,
                fecha_nacimiento=fecha_nacimiento,
                sexo=sexo,
                codigo_municipio_residencia=codigo_municipio,
                estado_afiliacion=estado_afiliacion,
                fecha_afiliacion=fecha_afiliacion,
                eps_codigo='',  # Se completa después con datos EPS
                
                # Campos específicos MS
                nivel_sisben=row[11].strip() if len(row) > 11 else '',
                puntaje_sisben=self._safe_float(row[12]) if len(row) > 12 else 0.0,
                poblacion_especial=row[13].strip() if len(row) > 13 else '',
                
                # Metadatos
                archivo_origen=f"MS_{datetime.now().strftime('%Y%m%d')}",
                fecha_carga=datetime.now()
            )
            
            return registro

        except Exception as e:
            logger.warning(f'Error procesando fila MS: {str(e)}')
            return None

    def _procesar_fila_mc(self, row, regimen):
        """
        Procesa fila de régimen contributivo (MC)
        Estructura típica MC: TIPO_DOC|NUM_DOC|APELLIDO1|APELLIDO2|NOMBRE1|NOMBRE2|FECHA_NAC|SEXO|MUNICIPIO|ESTADO|EPS|IBC|...
        """
        try:
            # Validar campos mínimos
            if len(row) < 12:
                return None

            tipo_documento = row[0].strip()
            numero_documento = row[1].strip()
            
            if not numero_documento or not tipo_documento:
                return None

            # Construir nombres
            primer_apellido = row[2].strip() if len(row) > 2 else ''
            segundo_apellido = row[3].strip() if len(row) > 3 else ''
            primer_nombre = row[4].strip() if len(row) > 4 else ''
            segundo_nombre = row[5].strip() if len(row) > 5 else ''
            
            nombres_completos = f"{primer_nombre} {segundo_nombre}".strip()
            apellidos_completos = f"{primer_apellido} {segundo_apellido}".strip()

            fecha_nacimiento = self._parsear_fecha(row[6]) if len(row) > 6 else None
            sexo = row[7].strip() if len(row) > 7 else ''
            codigo_municipio = row[8].strip() if len(row) > 8 else ''
            estado_afiliacion = row[9].strip() if len(row) > 9 else 'ACTIVO'
            eps_codigo = row[10].strip() if len(row) > 10 else ''
            ibc = self._safe_float(row[11]) if len(row) > 11 else 0.0

            registro = BDUAAfiliados(
                regimen=regimen,
                tipo_documento_identificacion=tipo_documento,
                numero_documento_identificacion=numero_documento,
                primer_apellido=primer_apellido,
                segundo_apellido=segundo_apellido,
                primer_nombre=primer_nombre,
                segundo_nombre=segundo_nombre,
                nombres_completos=nombres_completos,
                apellidos_completos=apellidos_completos,
                fecha_nacimiento=fecha_nacimiento,
                sexo=sexo,
                codigo_municipio_residencia=codigo_municipio,
                estado_afiliacion=estado_afiliacion,
                eps_codigo=eps_codigo,
                
                # Campos específicos MC
                ibc_cotizacion=ibc,
                categoria_cotizante=row[12].strip() if len(row) > 12 else '',
                tipo_cotizante=row[13].strip() if len(row) > 13 else '',
                
                # Metadatos
                archivo_origen=f"MC_{datetime.now().strftime('%Y%m%d')}",
                fecha_carga=datetime.now()
            )
            
            return registro

        except Exception as e:
            logger.warning(f'Error procesando fila MC: {str(e)}')
            return None

    def _parsear_fecha(self, fecha_str):
        """
        Parsea fecha desde string en múltiples formatos
        """
        if not fecha_str or fecha_str.strip() == '':
            return None
            
        fecha_str = fecha_str.strip()
        
        # Formatos comunes BDUA
        formatos = [
            '%Y-%m-%d',      # 2023-12-31
            '%d/%m/%Y',      # 31/12/2023
            '%d-%m-%Y',      # 31-12-2023
            '%Y%m%d',        # 20231231
            '%d%m%Y'         # 31122023
        ]
        
        for formato in formatos:
            try:
                return datetime.strptime(fecha_str, formato).date()
            except ValueError:
                continue
        
        logger.warning(f'Formato fecha no reconocido: {fecha_str}')
        return None

    def _safe_float(self, value):
        """
        Convierte string a float de forma segura
        """
        try:
            if not value or str(value).strip() == '':
                return 0.0
            return float(str(value).replace(',', '.'))
        except (ValueError, TypeError):
            return 0.0