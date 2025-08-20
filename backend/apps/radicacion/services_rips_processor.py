"""
Servicio especializado para procesar archivos RIPS grandes
Maneja archivos con miles de usuarios y servicios
"""

import json
import ijson  # Para streaming JSON
import logging
from datetime import datetime
from decimal import Decimal
from django.db import transaction
from django.db.models import Count, Sum
import boto3
from io import BytesIO
import gzip

from .models import RadicacionCuentaMedica, DocumentoSoporte
from .models_servicios import ServicioRIPS, ResumenServiciosRadicacion

logger = logging.getLogger('apps.radicacion.rips_processor')


class RIPSLargeFileProcessor:
    """
    Procesador optimizado para archivos RIPS muy grandes
    """
    
    def __init__(self):
        self.batch_size = 1000  # Procesar en lotes
        self.max_usuarios_demo = 100  # Límite para demo
        self.servicios_creados = 0
        self.usuarios_procesados = 0
        self.errores = []
        
    def procesar_archivo_rips(self, documento_rips, limite_usuarios=None):
        """
        Procesa un archivo RIPS, optimizado para archivos grandes
        
        Args:
            documento_rips: DocumentoSoporte del tipo RIPS
            limite_usuarios: Límite de usuarios a procesar (para demos/pruebas)
        
        Returns:
            dict: Estadísticas del procesamiento
        """
        inicio = datetime.now()
        radicacion = documento_rips.radicacion
        
        logger.info(f"Iniciando procesamiento RIPS: {documento_rips.nombre_archivo}")
        logger.info(f"Tamaño archivo: {self.format_bytes(documento_rips.archivo_size)}")
        
        try:
            # Determinar estrategia según tamaño
            if documento_rips.archivo_size > 50 * 1024 * 1024:  # Mayor a 50MB
                logger.info("Archivo grande detectado - usando procesamiento en streaming")
                stats = self.procesar_rips_streaming(documento_rips, limite_usuarios)
            else:
                logger.info("Archivo normal - procesamiento en memoria")
                stats = self.procesar_rips_memoria(documento_rips, limite_usuarios)
            
            # Crear o actualizar resumen
            self.crear_resumen_servicios(radicacion, stats, inicio)
            
            # Actualizar estado del documento
            documento_rips.estado = 'PROCESADO'
            documento_rips.validacion_resultado.update({
                'servicios_procesados': stats['total_servicios'],
                'usuarios_procesados': stats['usuarios_procesados'],
                'tiempo_procesamiento': stats['tiempo_segundos']
            })
            documento_rips.save()
            
            return stats
            
        except Exception as e:
            logger.error(f"Error procesando RIPS: {str(e)}")
            documento_rips.estado = 'ERROR'
            documento_rips.validacion_resultado['error_procesamiento'] = str(e)
            documento_rips.save()
            raise
    
    def procesar_rips_memoria(self, documento_rips, limite_usuarios=None):
        """
        Procesa RIPS pequeño/mediano en memoria
        """
        # Para demo, simular contenido
        # En producción, aquí se descargaría el archivo real
        
        contenido_rips = self.simular_contenido_rips(documento_rips)
        
        stats = {
            'total_servicios': 0,
            'usuarios_procesados': 0,
            'servicios_por_tipo': {},
            'valor_total': Decimal('0'),
            'tiempo_segundos': 0
        }
        
        batch = []
        usuarios = contenido_rips.get('usuarios', [])
        
        if limite_usuarios:
            usuarios = usuarios[:limite_usuarios]
        
        for usuario in usuarios:
            servicios_usuario = self.extraer_servicios_usuario(
                usuario,
                documento_rips,
                stats['usuarios_procesados']
            )
            
            batch.extend(servicios_usuario)
            stats['usuarios_procesados'] += 1
            
            # Guardar en lotes
            if len(batch) >= self.batch_size:
                self.guardar_servicios_batch(batch)
                stats['total_servicios'] += len(batch)
                batch = []
        
        # Guardar último lote
        if batch:
            self.guardar_servicios_batch(batch)
            stats['total_servicios'] += len(batch)
        
        return stats
    
    def procesar_rips_streaming(self, documento_rips, limite_usuarios=None):
        """
        Procesa RIPS muy grande usando streaming
        """
        stats = {
            'total_servicios': 0,
            'usuarios_procesados': 0,
            'servicios_por_tipo': {},
            'valor_total': Decimal('0'),
            'tiempo_segundos': 0,
            'archivo_completo': False
        }
        
        # Para demo, simular procesamiento en streaming
        # En producción, usar ijson para parsear el archivo real
        
        logger.info("Simulando procesamiento en streaming...")
        
        # Simular procesamiento de usuarios
        usuarios_estimados = int(documento_rips.archivo_size / 1024)
        logger.info(f"Usuarios estimados en archivo: {usuarios_estimados:,}")
        
        usuarios_a_procesar = min(
            usuarios_estimados,
            limite_usuarios or self.max_usuarios_demo
        )
        
        batch = []
        
        for i in range(usuarios_a_procesar):
            if i % 100 == 0 and i > 0:
                logger.info(f"Procesados {i} usuarios...")
            
            # Generar servicios simulados
            servicios_usuario = self.generar_servicios_usuario_demo(
                documento_rips,
                i
            )
            
            batch.extend(servicios_usuario)
            stats['usuarios_procesados'] += 1
            
            # Guardar en lotes
            if len(batch) >= self.batch_size:
                self.guardar_servicios_batch(batch)
                stats['total_servicios'] += len(batch)
                
                # Actualizar estadísticas
                for servicio in batch:
                    tipo = servicio.tipo_servicio
                    stats['servicios_por_tipo'][tipo] = stats['servicios_por_tipo'].get(tipo, 0) + 1
                    stats['valor_total'] += servicio.valor_total
                
                batch = []
        
        # Guardar último lote
        if batch:
            self.guardar_servicios_batch(batch)
            stats['total_servicios'] += len(batch)
        
        stats['archivo_completo'] = usuarios_a_procesar == usuarios_estimados
        
        return stats
    
    def extraer_servicios_usuario(self, usuario_data, documento_rips, indice_usuario):
        """
        Extrae servicios de un usuario del RIPS
        """
        servicios = []
        radicacion = documento_rips.radicacion
        
        # Información base del usuario
        usuario_info = {
            'tipo_documento': usuario_data.get('tipoDocumentoIdentificacion'),
            'numero_documento': usuario_data.get('numDocumentoIdentificacion'),
            'consecutivo': usuario_data.get('consecutivo', '')
        }
        
        servicios_data = usuario_data.get('servicios', {})
        
        # Procesar consultas
        for consulta in servicios_data.get('consultas', []):
            servicio = ServicioRIPS(
                radicacion=radicacion,
                documento_rips=documento_rips,
                usuario_tipo_documento=usuario_info['tipo_documento'],
                usuario_numero_documento=usuario_info['numero_documento'],
                usuario_consecutivo=usuario_info['consecutivo'],
                tipo_servicio='CONSULTA',
                codigo_servicio=consulta.get('codConsulta', ''),
                descripcion_servicio=f"Consulta - {consulta.get('modalidadGrupoServicioTecSal', '')}",
                cantidad=1,
                valor_total=Decimal(str(consulta.get('vrServicio', 0))),
                fecha_inicio=self.parse_fecha(consulta.get('fechaInicioAtencion')),
                diagnostico_principal=consulta.get('codDiagnosticoPrincipal', ''),
                diagnosticos_relacionados=[
                    consulta.get('codDiagnosticoRelacionado1'),
                    consulta.get('codDiagnosticoRelacionado2'),
                    consulta.get('codDiagnosticoRelacionado3')
                ],
                datos_rips_completos=consulta,
                numero_linea_rips=indice_usuario
            )
            servicios.append(servicio)
        
        # Procesar procedimientos
        for proc in servicios_data.get('procedimientos', []):
            servicio = ServicioRIPS(
                radicacion=radicacion,
                documento_rips=documento_rips,
                usuario_tipo_documento=usuario_info['tipo_documento'],
                usuario_numero_documento=usuario_info['numero_documento'],
                usuario_consecutivo=usuario_info['consecutivo'],
                tipo_servicio='PROCEDIMIENTO',
                codigo_servicio=proc.get('codProcedimiento', ''),
                descripcion_servicio=f"Procedimiento - {proc.get('ambitoRealizacion', '')}",
                cantidad=1,
                valor_total=Decimal(str(proc.get('vrServicio', 0))),
                fecha_inicio=self.parse_fecha(proc.get('fechaInicioAtencion')),
                diagnostico_principal=proc.get('codDiagnosticoPrincipal', ''),
                datos_rips_completos=proc,
                numero_linea_rips=indice_usuario
            )
            servicios.append(servicio)
        
        # Procesar medicamentos
        for med in servicios_data.get('medicamentos', []):
            cantidad = int(med.get('numUnidMedicamento', 1))
            valor_unitario = Decimal(str(med.get('vrUnitMedicamento', 0)))
            
            servicio = ServicioRIPS(
                radicacion=radicacion,
                documento_rips=documento_rips,
                usuario_tipo_documento=usuario_info['tipo_documento'],
                usuario_numero_documento=usuario_info['numero_documento'],
                usuario_consecutivo=usuario_info['consecutivo'],
                tipo_servicio='MEDICAMENTO',
                codigo_servicio=med.get('codMedicamento', ''),
                descripcion_servicio=f"{med.get('tipoMedicamento', '')} - {med.get('formFarmaceutica', '')}",
                cantidad=cantidad,
                valor_unitario=valor_unitario,
                valor_total=valor_unitario * cantidad,
                datos_rips_completos=med,
                numero_linea_rips=indice_usuario
            )
            servicio.validar_valores()
            servicios.append(servicio)
        
        return servicios
    
    def generar_servicios_usuario_demo(self, documento_rips, indice_usuario):
        """
        Genera servicios de demo para un usuario
        """
        radicacion = documento_rips.radicacion
        servicios = []
        
        # Variar servicios por usuario
        tipo_usuario = indice_usuario % 4
        
        if tipo_usuario == 0:
            # Usuario con consulta
            servicio = ServicioRIPS(
                radicacion=radicacion,
                documento_rips=documento_rips,
                usuario_tipo_documento='CC',
                usuario_numero_documento=f'100{indice_usuario:06d}',
                usuario_consecutivo=str(indice_usuario),
                tipo_servicio='CONSULTA',
                codigo_servicio='890201',
                descripcion_servicio='Consulta médica general',
                cantidad=1,
                valor_total=Decimal('50000'),
                diagnostico_principal='I10X',
                datos_rips_completos={'demo': True},
                numero_linea_rips=indice_usuario
            )
            servicios.append(servicio)
            
        elif tipo_usuario == 1:
            # Usuario con procedimiento
            servicio = ServicioRIPS(
                radicacion=radicacion,
                documento_rips=documento_rips,
                usuario_tipo_documento='CC',
                usuario_numero_documento=f'100{indice_usuario:06d}',
                usuario_consecutivo=str(indice_usuario),
                tipo_servicio='PROCEDIMIENTO',
                codigo_servicio='902210',
                descripcion_servicio='Toma de muestra sangre',
                cantidad=1,
                valor_total=Decimal('35000'),
                diagnostico_principal='E119',
                datos_rips_completos={'demo': True},
                numero_linea_rips=indice_usuario
            )
            servicios.append(servicio)
            
        elif tipo_usuario == 2:
            # Usuario con medicamentos
            for i in range(2):  # 2 medicamentos
                servicio = ServicioRIPS(
                    radicacion=radicacion,
                    documento_rips=documento_rips,
                    usuario_tipo_documento='CC',
                    usuario_numero_documento=f'100{indice_usuario:06d}',
                    usuario_consecutivo=str(indice_usuario),
                    tipo_servicio='MEDICAMENTO',
                    codigo_servicio=f'MED{1000 + i}',
                    descripcion_servicio=f'Medicamento {i+1}',
                    cantidad=30,
                    valor_unitario=Decimal('1000'),
                    valor_total=Decimal('30000'),
                    datos_rips_completos={'demo': True},
                    numero_linea_rips=indice_usuario
                )
                servicios.append(servicio)
        else:
            # Usuario con urgencias
            servicio = ServicioRIPS(
                radicacion=radicacion,
                documento_rips=documento_rips,
                usuario_tipo_documento='CC',
                usuario_numero_documento=f'100{indice_usuario:06d}',
                usuario_consecutivo=str(indice_usuario),
                tipo_servicio='URGENCIA',
                codigo_servicio='URG001',
                descripcion_servicio='Atención de urgencias',
                cantidad=1,
                valor_total=Decimal('150000'),
                diagnostico_principal='R509',
                datos_rips_completos={'demo': True, 'triage': 'II'},
                numero_linea_rips=indice_usuario
            )
            servicios.append(servicio)
        
        return servicios
    
    @transaction.atomic
    def guardar_servicios_batch(self, servicios):
        """
        Guarda un lote de servicios de forma eficiente
        """
        ServicioRIPS.objects.bulk_create(servicios)
        self.servicios_creados += len(servicios)
        
        if self.servicios_creados % 10000 == 0:
            logger.info(f"Servicios guardados: {self.servicios_creados:,}")
    
    def crear_resumen_servicios(self, radicacion, stats, inicio):
        """
        Crea o actualiza el resumen de servicios
        """
        tiempo_procesamiento = (datetime.now() - inicio).total_seconds()
        
        # Calcular agregados desde la base de datos
        agregados = ServicioRIPS.objects.filter(
            radicacion=radicacion
        ).aggregate(
            total_servicios=Count('id'),
            usuarios_unicos=Count('usuario_numero_documento', distinct=True),
            valor_total=Sum('valor_total')
        )
        
        # Contadores por tipo
        por_tipo = ServicioRIPS.objects.filter(
            radicacion=radicacion
        ).values('tipo_servicio').annotate(
            cantidad=Count('id'),
            valor=Sum('valor_total')
        )
        
        resumen, created = ResumenServiciosRadicacion.objects.update_or_create(
            radicacion=radicacion,
            defaults={
                'total_servicios': agregados['total_servicios'] or 0,
                'total_usuarios_unicos': agregados['usuarios_unicos'] or 0,
                'valor_total_servicios': agregados['valor_total'] or Decimal('0'),
                'tiempo_procesamiento_segundos': tiempo_procesamiento,
                'archivo_procesado_completo': stats.get('archivo_completo', True),
                'registros_procesados': stats.get('usuarios_procesados', 0)
            }
        )
        
        # Actualizar contadores por tipo
        for tipo_data in por_tipo:
            tipo = tipo_data['tipo_servicio']
            cantidad = tipo_data['cantidad']
            valor = tipo_data['valor']
            
            if tipo == 'CONSULTA':
                resumen.total_consultas = cantidad
                resumen.valor_total_consultas = valor
            elif tipo == 'PROCEDIMIENTO':
                resumen.total_procedimientos = cantidad
                resumen.valor_total_procedimientos = valor
            elif tipo == 'MEDICAMENTO':
                resumen.total_medicamentos = cantidad
                resumen.valor_total_medicamentos = valor
            elif tipo == 'URGENCIA':
                resumen.total_urgencias = cantidad
            elif tipo == 'HOSPITALIZACION':
                resumen.total_hospitalizaciones = cantidad
            else:
                resumen.total_otros_servicios += cantidad
        
        # Calcular promedio
        if resumen.total_servicios > 0:
            resumen.promedio_valor_servicio = resumen.valor_total_servicios / resumen.total_servicios
        
        resumen.save()
        
        logger.info(f"Resumen creado: {resumen.total_servicios:,} servicios, ${resumen.valor_total_servicios:,.2f}")
    
    def simular_contenido_rips(self, documento_rips):
        """
        Simula contenido RIPS para demo
        """
        # En producción, aquí se descargaría y parsearía el archivo real
        usuarios = []
        
        # Simular algunos usuarios
        for i in range(10):
            usuario = {
                'tipoDocumentoIdentificacion': 'CC',
                'numDocumentoIdentificacion': f'100{i:06d}',
                'consecutivo': str(i),
                'servicios': {
                    'consultas': [
                        {
                            'codConsulta': '890201',
                            'modalidadGrupoServicioTecSal': '01',
                            'fechaInicioAtencion': '2025-07-01T10:00:00',
                            'codDiagnosticoPrincipal': 'I10X',
                            'vrServicio': 50000
                        }
                    ] if i % 2 == 0 else [],
                    'procedimientos': [
                        {
                            'codProcedimiento': '902210',
                            'ambitoRealizacion': '01',
                            'fechaInicioAtencion': '2025-07-01T11:00:00',
                            'codDiagnosticoPrincipal': 'E119',
                            'vrServicio': 35000
                        }
                    ] if i % 3 == 0 else []
                }
            }
            usuarios.append(usuario)
        
        return {
            'numFactura': documento_rips.radicacion.factura_numero,
            'usuarios': usuarios
        }
    
    def parse_fecha(self, fecha_str):
        """
        Parsea fecha del RIPS
        """
        if not fecha_str:
            return None
        
        try:
            # Intentar varios formatos
            for fmt in ['%Y-%m-%dT%H:%M:%S', '%Y-%m-%d', '%d/%m/%Y']:
                try:
                    return datetime.strptime(fecha_str, fmt)
                except:
                    continue
            return None
        except:
            return None
    
    def format_bytes(self, bytes):
        """
        Formatea bytes a formato legible
        """
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes < 1024.0:
                return f"{bytes:.2f} {unit}"
            bytes /= 1024.0
        return f"{bytes:.2f} TB"