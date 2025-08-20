from django.db import connection
from django.utils import timezone
from datetime import timedelta
from bson import ObjectId
from .models import CasoConciliacion
from ..auditoria.models_glosas import GlosaAplicada
from ..auditoria.models_facturas import FacturaRadicada, ServicioFacturado
import logging

logger = logging.getLogger(__name__)

class ConciliacionService:
    """
    Servicio para crear casos de conciliación usando datos reales de auditoría
    Mantiene independencia total del módulo de auditoría
    """
    
    @staticmethod
    def crear_caso_desde_radicacion(numero_radicacion, conciliador_asignado):
        """
        Crea un caso de conciliación desde una radicación auditada
        Usa datos reales de MongoDB sin afectar auditoría
        """
        try:
            # Buscar glosas aplicadas para esta radicación
            glosas_aplicadas = list(GlosaAplicada.objects.filter(
                numero_radicacion=numero_radicacion,
                estado__in=['APLICADA', 'RESPONDIDA', 'EN_CONCILIACION']
            ))
            
            if not glosas_aplicadas:
                raise ValueError(f"No se encontraron glosas aplicadas para la radicación {numero_radicacion}")
            
            # Obtener información de la primera glosa para datos base
            primera_glosa = glosas_aplicadas[0]
            
            # Obtener facturas relacionadas
            facturas_ids = list(set([glosa.factura_id for glosa in glosas_aplicadas]))
            facturas_data = []
            
            for factura_id in facturas_ids:
                try:
                    # Buscar factura en auditoría
                    factura = FacturaRadicada.objects.get(id=ObjectId(factura_id))
                    
                    # Obtener servicios de esta factura
                    servicios_factura = list(ServicioFacturado.objects.filter(
                        factura_id=factura_id
                    ))
                    
                    servicios_data = []
                    for servicio in servicios_factura:
                        # Buscar glosas aplicadas a este servicio
                        glosas_servicio = [
                            g for g in glosas_aplicadas 
                            if g.servicio_id == str(servicio.id)
                        ]
                        
                        glosas_aplicadas_data = []
                        for glosa in glosas_servicio:
                            glosa_data = {
                                'glosa_id': str(glosa.id),
                                'codigo_glosa': glosa.codigo_glosa,
                                'descripcion_glosa': glosa.descripcion_glosa,
                                'valor_glosado': float(glosa.valor_glosado),
                                'auditor_info': glosa.auditor_info,
                                'fecha_aplicacion': glosa.fecha_aplicacion.isoformat(),
                                'observaciones_auditor': glosa.observaciones,
                                'estado_conciliacion': 'PENDIENTE',
                                'respuesta_prestador': {},  # Se llenará cuando respondan
                            }
                            glosas_aplicadas_data.append(glosa_data)
                        
                        servicio_data = {
                            'servicio_id': str(servicio.id),
                            'codigo_cups': servicio.servicio_info.get('codigo_cups', ''),
                            'descripcion': servicio.servicio_info.get('descripcion', ''),
                            'tipo_servicio': servicio.tipo_servicio,
                            'valor_servicio': float(servicio.valor_servicio),
                            'glosas_aplicadas': glosas_aplicadas_data
                        }
                        servicios_data.append(servicio_data)
                    
                    factura_data = {
                        'factura_id': str(factura.id),
                        'numero_factura': factura.numero_factura,
                        'fecha_factura': factura.fecha_factura.isoformat(),
                        'valor_factura': float(factura.valor_total),
                        'servicios': servicios_data
                    }
                    facturas_data.append(factura_data)
                    
                except Exception as e:
                    logger.error(f"Error procesando factura {factura_id}: {str(e)}")
                    continue
            
            # Crear el caso de conciliación
            caso = CasoConciliacion(
                radicacion_id=primera_glosa.radicacion_id,
                numero_radicacion=numero_radicacion,
                prestador_info=primera_glosa.prestador_info,
                facturas=facturas_data,
                estado='INICIADA',
                conciliador_asignado=conciliador_asignado,
                fecha_limite_respuesta=timezone.now() + timedelta(days=15),
                configuracion_plazos={
                    'dias_respuesta_pss': 15,
                    'dias_conciliacion': 30,
                    'dias_notificacion_previa': 3,
                    'prorroga_solicitada': False
                }
            )
            
            # Registrar creación en trazabilidad
            caso.registrar_accion_trazabilidad(
                'CREACION',
                f'Caso de conciliación creado para {numero_radicacion}',
                f'Caso creado desde {len(glosas_aplicadas)} glosas aplicadas',
                conciliador_asignado
            )
            
            caso.save()
            
            logger.info(f"Caso de conciliación creado exitosamente: {caso.id}")
            return caso
            
        except Exception as e:
            logger.error(f"Error creando caso de conciliación: {str(e)}")
            raise
    
    @staticmethod  
    def obtener_casos_pendientes():
        """Retorna casos que requieren acción"""
        return CasoConciliacion.objects.filter(
            estado__in=['INICIADA', 'EN_RESPUESTA', 'EN_CONCILIACION']
        ).order_by('-fecha_creacion')
    
    @staticmethod
    def obtener_estadisticas_conciliacion():
        """Calcula estadísticas generales de conciliación"""
        try:
            # Usar aggregation de MongoDB para estadísticas
            from django.db import connection
            
            casos = list(CasoConciliacion.objects.all())
            
            total_casos = len(casos)
            total_valor_radicado = sum(
                caso.resumen_financiero.get('valor_total_radicado', 0) 
                for caso in casos
            )
            total_valor_glosado = sum(
                caso.resumen_financiero.get('valor_total_glosado', 0) 
                for caso in casos
            )
            total_valor_ratificado = sum(
                caso.resumen_financiero.get('valor_total_ratificado', 0) 
                for caso in casos
            )
            total_valor_levantado = sum(
                caso.resumen_financiero.get('valor_total_levantado', 0) 
                for caso in casos
            )
            
            casos_por_estado = {}
            for caso in casos:
                estado = caso.estado
                if estado not in casos_por_estado:
                    casos_por_estado[estado] = 0
                casos_por_estado[estado] += 1
            
            return {
                'total_casos': total_casos,
                'total_valor_radicado': total_valor_radicado,
                'total_valor_glosado': total_valor_glosado,
                'total_valor_ratificado': total_valor_ratificado,
                'total_valor_levantado': total_valor_levantado,
                'valor_en_disputa': total_valor_glosado - total_valor_ratificado - total_valor_levantado,
                'porcentaje_glosado': (total_valor_glosado / total_valor_radicado * 100) if total_valor_radicado > 0 else 0,
                'porcentaje_ratificado': (total_valor_ratificado / total_valor_glosado * 100) if total_valor_glosado > 0 else 0,
                'casos_por_estado': casos_por_estado
            }
            
        except Exception as e:
            logger.error(f"Error calculando estadísticas: {str(e)}")
            return {
                'total_casos': 0,
                'total_valor_radicado': 0,
                'total_valor_glosado': 0,
                'total_valor_ratificado': 0,
                'total_valor_levantado': 0,
                'valor_en_disputa': 0,
                'porcentaje_glosado': 0,
                'porcentaje_ratificado': 0,
                'casos_por_estado': {}
            }
    
    @staticmethod
    def responder_glosa(caso_id, glosa_id, respuesta_data, usuario_prestador):
        """Permite al prestador responder a una glosa específica"""
        try:
            caso = CasoConciliacion.objects.get(id=ObjectId(caso_id))
            
            respuesta_completa = {
                'tipo_respuesta': respuesta_data.get('tipo_respuesta'),
                'valor_aceptado': respuesta_data.get('valor_aceptado', 0),
                'valor_rechazado': respuesta_data.get('valor_rechazado', 0),
                'justificacion': respuesta_data.get('justificacion', ''),
                'usuario_prestador': usuario_prestador,
                'soportes': respuesta_data.get('soportes', [])
            }
            
            caso.agregar_respuesta_prestador(glosa_id, respuesta_completa)
            
            # Cambiar estado del caso si es necesario
            if caso.estado == 'INICIADA':
                caso.estado = 'EN_RESPUESTA'
                caso.save()
            
            return caso
            
        except Exception as e:
            logger.error(f"Error respondiendo glosa: {str(e)}")
            raise
    
    @staticmethod
    def procesar_decision_conciliacion(caso_id, glosa_id, decision, usuario_conciliador, justificacion=None):
        """Permite ratificar o levantar una glosa"""
        try:
            caso = CasoConciliacion.objects.get(id=ObjectId(caso_id))
            
            if decision == 'RATIFICAR':
                caso.ratificar_glosa(glosa_id, usuario_conciliador)
            elif decision == 'LEVANTAR':
                if not justificacion:
                    raise ValueError("Se requiere justificación para levantar una glosa")
                caso.levantar_glosa(glosa_id, usuario_conciliador, justificacion)
            else:
                raise ValueError("Decisión debe ser 'RATIFICAR' o 'LEVANTAR'")
            
            # Verificar si todas las glosas han sido procesadas
            todas_procesadas = True
            for factura in caso.facturas:
                for servicio in factura.get('servicios', []):
                    for glosa in servicio.get('glosas_aplicadas', []):
                        if glosa.get('estado_conciliacion') == 'PENDIENTE':
                            todas_procesadas = False
                            break
            
            if todas_procesadas and caso.estado != 'CONCILIADA':
                caso.estado = 'EN_CONCILIACION'
                caso.save()
            
            return caso
            
        except Exception as e:
            logger.error(f"Error procesando decisión de conciliación: {str(e)}")
            raise
    
    @staticmethod
    def generar_acta_conciliacion(caso_id, participantes, acuerdos, usuario_generador):
        """Genera el acta final de conciliación"""
        try:
            caso = CasoConciliacion.objects.get(id=ObjectId(caso_id))
            numero_acta = caso.generar_acta_final(participantes, acuerdos, usuario_generador)
            
            return {
                'numero_acta': numero_acta,
                'caso': caso,
                'acta_data': caso.acta_final
            }
            
        except Exception as e:
            logger.error(f"Error generando acta: {str(e)}")
            raise