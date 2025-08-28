# -*- coding: utf-8 -*-
# apps/core/views.py

"""
ViewSets API REST para Sistema de Asignación Automática
Expone endpoints para frontend React + MongoDB NoSQL
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # Temporal para desarrollo
from django.utils import timezone
from bson import ObjectId
import json
import logging

# No usar modelos Django - NoSQL puro con PyMongo
from .services.asignacion_service import AsignacionService

logger = logging.getLogger(__name__)

# =====================================
# 1. VIEWSET PRINCIPAL DE ASIGNACIÓN
# =====================================

class AsignacionViewSet(viewsets.ViewSet):
    """
    ViewSet principal para gestión de asignaciones automáticas
    """
    
    permission_classes = [AllowAny]  # Temporal para desarrollo
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.asignacion_service = AsignacionService()
    
    @action(detail=False, methods=['get'], url_path='dashboard/estadisticas')
    def estadisticas_dashboard(self, request):
        """
        GET /api/asignacion/dashboard/estadisticas/
        
        Obtiene estadísticas generales para el dashboard
        """
        try:
            estadisticas = self.asignacion_service.obtener_estadisticas_dashboard()
            return Response(estadisticas, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas dashboard: {str(e)}")
            return Response(
                {'error': 'Error obteniendo estadísticas del dashboard'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='auditores/carga')
    def carga_auditores(self, request):
        """
        GET /api/asignacion/auditores/carga/
        
        Obtiene carga de trabajo actual de todos los auditores
        """
        try:
            auditores = self.asignacion_service.obtener_carga_auditores()
            
            # Asegurar que no haya ObjectIds en la respuesta
            for auditor in auditores:
                if '_id' in auditor:
                    if not auditor.get('id'):
                        auditor['id'] = str(auditor['_id'])
                    del auditor['_id']
            
            return Response(auditores, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error obteniendo carga auditores: {str(e)}")
            return Response(
                {'error': 'Error obteniendo carga de auditores'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], url_path='propuestas/generar')
    def generar_propuesta(self, request):
        """
        POST /api/asignacion/propuestas/generar/
        
        Body: {
            "coordinador_username": "admin.user"
        }
        
        Genera nueva propuesta de asignación automática
        """
        try:
            coordinador_username = request.data.get('coordinador_username')
            
            if not coordinador_username:
                return Response(
                    {'error': 'coordinador_username es requerido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            propuesta_id = self.asignacion_service.generar_propuesta_asignacion(
                coordinador_username
            )
            
            if propuesta_id:
                return Response(
                    {'propuesta_id': str(propuesta_id)},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {'message': 'No hay radicaciones pendientes para asignar'},
                    status=status.HTTP_204_NO_CONTENT
                )
                
        except Exception as e:
            logger.error(f"Error generando propuesta: {str(e)}")
            return Response(
                {'error': 'Error generando propuesta de asignación'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='propuestas/actual')
    def propuesta_actual(self, request):
        """
        GET /api/asignacion/propuestas/actual/
        
        Obtiene la propuesta de asignación pendiente más reciente
        """
        try:
            propuesta = self.asignacion_service.obtener_propuesta_actual()
            
            if propuesta:
                # Convertir ObjectId a string para JSON
                propuesta['id'] = str(propuesta['_id'])
                del propuesta['_id']
                if 'coordinador_id' in propuesta and propuesta['coordinador_id']:
                    propuesta['coordinador_id'] = str(propuesta['coordinador_id'])
                
                return Response(propuesta, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'detail': 'No hay propuestas pendientes'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Error obteniendo propuesta actual: {str(e)}")
            return Response(
                {'error': 'Error obteniendo propuesta actual'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def detalle_propuesta(self, request, pk=None):
        """
        GET /api/asignacion/propuestas/{id}/
        
        Obtiene detalles de una propuesta específica
        """
        try:
            propuesta_id = ObjectId(pk)
            propuesta = self.asignacion_service.asignaciones_automaticas.find_one(
                {'_id': propuesta_id}
            )
            
            if propuesta:
                # Convertir ObjectId a string
                propuesta['_id'] = str(propuesta['_id'])
                if 'coordinador_id' in propuesta and propuesta['coordinador_id']:
                    propuesta['coordinador_id'] = str(propuesta['coordinador_id'])
                
                # Convertir ObjectIds en asignaciones individuales
                for asignacion in propuesta.get('asignaciones_individuales', []):
                    if 'radicacion_id' in asignacion:
                        asignacion['radicacion_id'] = str(asignacion['radicacion_id'])
                
                return Response(propuesta, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Propuesta no encontrada'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Error obteniendo propuesta {pk}: {str(e)}")
            return Response(
                {'error': 'Error obteniendo detalles de la propuesta'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], url_path='procesar_decision')
    def procesar_decision(self, request, pk=None):
        """
        POST /api/asignacion/propuestas/{id}/procesar_decision/
        
        Body: {
            "accion": "APROBAR_MASIVO|RECHAZAR_MASIVO|APROBAR_INDIVIDUAL|REASIGNAR",
            "radicaciones_ids": [...], // Para APROBAR_INDIVIDUAL
            "justificacion": "...",     // Para RECHAZAR_MASIVO
            "reasignaciones": [...]     // Para REASIGNAR
        }
        
        Procesa decisión del coordinador sobre propuesta
        """
        try:
            propuesta_id = ObjectId(pk)
            decision = request.data
            coordinador_username = request.user.username if request.user.is_authenticated else 'sistema'
            
            # Validar acción requerida
            accion = decision.get('accion')
            if not accion:
                return Response(
                    {'error': 'accion es requerida'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Procesar decisión
            resultado = self.asignacion_service.procesar_decision_coordinador(
                propuesta_id, decision, coordinador_username
            )
            
            if resultado:
                return Response(
                    {'success': True, 'message': 'Decisión procesada exitosamente'},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Error procesando decisión'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Error procesando decisión para propuesta {pk}: {str(e)}")
            return Response(
                {'error': 'Error procesando decisión del coordinador'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'], url_path='trazabilidad')
    def trazabilidad_propuesta(self, request, pk=None):
        """
        GET /api/asignacion/propuestas/{id}/trazabilidad/
        
        Obtiene historial de trazabilidad para una propuesta
        """
        try:
            propuesta_id = ObjectId(pk)
            
            trazabilidad = list(
                self.asignacion_service.trazabilidad_asignaciones.find(
                    {'asignacion_id': propuesta_id}
                ).sort('timestamp', -1)
            )
            
            # Convertir ObjectIds a string
            for evento in trazabilidad:
                evento['_id'] = str(evento['_id'])
                evento['asignacion_id'] = str(evento['asignacion_id'])
            
            return Response(trazabilidad, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error obteniendo trazabilidad {pk}: {str(e)}")
            return Response(
                {'error': 'Error obteniendo trazabilidad'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='kanban')
    def asignaciones_kanban(self, request):
        """
        GET /api/asignacion/kanban/
        
        Obtiene asignaciones para vista Kanban organizadas por estado
        """
        try:
            # Consultar asignaciones por estado
            pipeline = [
                {
                    '$group': {
                        '_id': '$estado',
                        'asignaciones': {'$push': '$$ROOT'}
                    }
                }
            ]
            
            result = list(
                self.asignacion_service.db.asignaciones_auditoria.aggregate(pipeline)
            )
            
            # Organizar por estados
            estados = {
                'pendientes': [],
                'asignadas': [],
                'en_proceso': [],
                'completadas': []
            }
            
            for grupo in result:
                estado_key = {
                    'ASIGNADA': 'asignadas',
                    'EN_PROCESO': 'en_proceso', 
                    'COMPLETADA': 'completadas'
                }.get(grupo['_id'], 'pendientes')
                
                # Convertir ObjectIds
                for asignacion in grupo['asignaciones']:
                    asignacion['_id'] = str(asignacion['_id'])
                    asignacion['radicacion_id'] = str(asignacion['radicacion_id'])
                    if 'propuesta_id' in asignacion:
                        asignacion['propuesta_id'] = str(asignacion['propuesta_id'])
                
                estados[estado_key] = grupo['asignaciones']
            
            return Response(estados, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error obteniendo asignaciones Kanban: {str(e)}")
            return Response(
                {'error': 'Error obteniendo asignaciones Kanban'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], url_path='manual')
    def asignacion_manual(self, request):
        """
        POST /api/asignacion/manual/
        
        Body: {
            "radicacion_id": "...",
            "auditor_username": "...",
            "tipo_auditoria": "AMBULATORIO|HOSPITALARIO",
            "prioridad": "ALTA|MEDIA|BAJA"
        }
        
        Realiza asignación manual de radicación a auditor
        """
        try:
            data = request.data
            required_fields = ['radicacion_id', 'auditor_username', 'tipo_auditoria', 'prioridad']
            
            # Validar campos requeridos
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {'error': f'{field} es requerido'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Crear asignación manual
            asignacion_doc = {
                'radicacion_id': ObjectId(data['radicacion_id']),
                'auditor_username': data['auditor_username'],
                'tipo_auditoria': data['tipo_auditoria'],
                'estado': 'ASIGNADA',
                'fecha_asignacion': timezone.now(),
                'prioridad': data['prioridad'],
                'valor_auditoria': data.get('valor_auditoria', 0),
                'metadatos': {
                    'asignacion_manual': True,
                    'usuario_asignador': request.user.username if request.user.is_authenticated else 'sistema'
                }
            }
            
            resultado = self.asignacion_service.db.asignaciones_auditoria.insert_one(asignacion_doc)
            
            # Actualizar estado de radicación
            self.asignacion_service.radicaciones.update_one(
                {'_id': ObjectId(data['radicacion_id'])},
                {
                    '$set': {
                        'estado_procesamiento': 'ASIGNADA',
                        'asignacion_auditoria': {
                            'asignacion_id': resultado.inserted_id,
                            'fecha_asignacion': timezone.now(),
                            'tipo': 'MANUAL'
                        }
                    }
                }
            )
            
            return Response(
                {'asignacion_id': str(resultado.inserted_id)},
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error en asignación manual: {str(e)}")
            return Response(
                {'error': 'Error realizando asignación manual'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='reportes/rendimiento')
    def reporte_rendimiento(self, request):
        """
        GET /api/asignacion/reportes/rendimiento/?fecha_inicio=...&fecha_fin=...
        
        Genera reporte de rendimiento del algoritmo
        """
        try:
            fecha_inicio = request.query_params.get('fecha_inicio')
            fecha_fin = request.query_params.get('fecha_fin')
            
            if not fecha_inicio or not fecha_fin:
                return Response(
                    {'error': 'fecha_inicio y fecha_fin son requeridas'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Pipeline de agregación para métricas
            pipeline = [
                {
                    '$match': {
                        'fecha_propuesta': {
                            '$gte': fecha_inicio,
                            '$lte': fecha_fin
                        },
                        'estado': 'APROBADA'
                    }
                },
                {
                    '$group': {
                        '_id': None,
                        'total_propuestas': {'$sum': 1},
                        'promedio_balance': {'$avg': '$metricas_distribucion.balance_score'},
                        'total_radicaciones': {'$sum': '$metricas_distribucion.total_radicaciones'},
                        'promedio_auditores': {'$avg': '$metricas_distribucion.auditores_involucrados'}
                    }
                }
            ]
            
            metricas = list(
                self.asignacion_service.asignaciones_automaticas.aggregate(pipeline)
            )
            
            reporte = metricas[0] if metricas else {
                'total_propuestas': 0,
                'promedio_balance': 0,
                'total_radicaciones': 0,
                'promedio_auditores': 0
            }
            
            # Remover _id del grupo
            if '_id' in reporte:
                del reporte['_id']
            
            return Response(reporte, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error generando reporte: {str(e)}")
            return Response(
                {'error': 'Error generando reporte de rendimiento'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def obtener_propuesta_pendiente(self, request):
        """
        Obtiene la propuesta de asignación pendiente actual
        """
        try:
            propuesta = self.asignacion_service.obtener_propuesta_actual()
            if propuesta:
                return Response({
                    'success': True,
                    'propuesta': propuesta
                })
            else:
                return Response({
                    'success': False,
                    'message': 'No hay propuestas pendientes'
                }, status=404)
                
        except Exception as e:
            logger.error(f"Error obteniendo propuesta pendiente: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)
    
    @action(detail=False, methods=['get'])
    def tendencias(self, request):
        """
        Obtiene tendencias de asignaciones por período
        """
        try:
            periodo = request.query_params.get('periodo', 'mes')
            tendencias = self.asignacion_service.obtener_tendencias_asignacion(periodo)
            
            return Response({
                'success': True,
                'tendencias': tendencias
            })
            
        except Exception as e:
            logger.error(f"Error obteniendo tendencias: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)
    
    @action(detail=False, methods=['get'])
    def metricas_algoritmo(self, request):
        """
        Obtiene métricas de rendimiento del algoritmo
        """
        try:
            metricas = self.asignacion_service.obtener_metricas_algoritmo()
            
            return Response({
                'success': True,
                'metricas': metricas
            })
            
        except Exception as e:
            logger.error(f"Error obteniendo métricas del algoritmo: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)

# =====================================
# 2. VIEWSET AUDITORES (NoSQL Puro)
# =====================================

class AuditorPerfilViewSet(viewsets.ViewSet):
    """
    Gestión de perfiles de auditores con MongoDB puro
    """
    
    permission_classes = [AllowAny]  # Temporal para desarrollo
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.asignacion_service = AsignacionService()
    
    def list(self, request):
        """
        GET /api/asignacion/auditores/
        Lista todos los auditores con filtros opcionales
        """
        try:
            # Filtros
            query = {}
            activo = request.query_params.get('activo')
            perfil = request.query_params.get('perfil')
            
            if activo is not None:
                query['activo'] = activo.lower() == 'true'
            
            if perfil:
                query['perfil'] = perfil.upper()
            
            # Consultar MongoDB
            auditores = list(self.asignacion_service.auditores_perfiles.find(query))
            
            # Convertir ObjectIds
            for auditor in auditores:
                auditor['_id'] = str(auditor['_id'])
            
            return Response(auditores, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error listando auditores: {str(e)}")
            return Response(
                {'error': 'Error obteniendo lista de auditores'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, pk=None):
        """
        GET /api/asignacion/auditores/{id}/
        Obtiene un auditor específico
        """
        try:
            auditor = self.asignacion_service.auditores_perfiles.find_one(
                {'_id': ObjectId(pk)}
            )
            
            if not auditor:
                return Response(
                    {'error': 'Auditor no encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            auditor['_id'] = str(auditor['_id'])
            return Response(auditor, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error obteniendo auditor {pk}: {str(e)}")
            return Response(
                {'error': 'Error obteniendo auditor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], url_path='cambiar_disponibilidad')
    def cambiar_disponibilidad(self, request, pk=None):
        """
        POST /api/asignacion/auditores/{id}/cambiar_disponibilidad/
        
        Body: {
            "activo": true,
            "vacaciones": false,
            "justificacion": "..."
        }
        """
        try:
            data = request.data
            
            # Actualizar en MongoDB
            resultado = self.asignacion_service.auditores_perfiles.update_one(
                {'_id': ObjectId(pk)},
                {
                    '$set': {
                        'disponibilidad.activo': data.get('activo', True),
                        'disponibilidad.vacaciones': data.get('vacaciones', False),
                        'disponibilidad.fecha_actualizacion': timezone.now()
                    }
                }
            )
            
            if resultado.modified_count == 0:
                return Response(
                    {'error': 'Auditor no encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Registrar trazabilidad
            self.asignacion_service.trazabilidad_asignaciones.insert_one({
                'timestamp': timezone.now(),
                'usuario': request.user.username if request.user.is_authenticated else 'sistema',
                'evento': 'CAMBIO_DISPONIBILIDAD',
                'auditor_id': ObjectId(pk),
                'detalles': data
            })
            
            return Response(
                {'message': 'Disponibilidad actualizada exitosamente'},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Error cambiando disponibilidad: {str(e)}")
            return Response(
                {'error': 'Error actualizando disponibilidad'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )