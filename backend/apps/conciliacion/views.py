from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
from bson import ObjectId
import logging

from .models import CasoConciliacion
from .serializers import (
    CasoConciliacionSerializer, CasoConciliacionListSerializer,
    RespuestaPrestadorSerializer, DecisionConciliacionSerializer,
    ActaConciliacionSerializer, EstadisticasConciliacionSerializer,
    GlosaDetalleSerializer, DocumentoConciliacionSerializer,
    TrazabilidadSerializer
)
from .services import ConciliacionService

logger = logging.getLogger(__name__)

class CasoConciliacionViewSet(viewsets.ModelViewSet):
    """
    ViewSet NoSQL para casos de conciliación
    Manejo completo de estructura embebida MongoDB
    """
    queryset = CasoConciliacion.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Usar serializer optimizado para listado"""
        if self.action == 'list':
            return CasoConciliacionListSerializer
        return CasoConciliacionSerializer
    
    def get_queryset(self):
        """Filtros dinámicos NoSQL"""
        queryset = CasoConciliacion.objects.all()
        
        # Filtro por estado
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Filtro por conciliador
        conciliador = self.request.query_params.get('conciliador')
        if conciliador:
            # Filtro NoSQL en campo embebido
            queryset = [
                caso for caso in queryset 
                if caso.conciliador_asignado.get('user_id') == conciliador
            ]
        
        # Filtro por prestador (NoSQL)
        prestador_nit = self.request.query_params.get('prestador_nit')
        if prestador_nit:
            queryset = [
                caso for caso in queryset 
                if caso.prestador_info.get('nit') == prestador_nit
            ]
        
        # Filtro por fecha
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        if fecha_desde:
            queryset = queryset.filter(fecha_creacion__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_creacion__lte=fecha_hasta)
        
        return queryset.order_by('-fecha_creacion')
    
    @action(detail=False, methods=['get'])
    def obtener_o_crear_caso(self, request):
        """
        Obtener caso existente o crear automáticamente al ver detalle
        Endpoint: GET /api/conciliacion/casos/obtener_o_crear_caso/?numero_radicacion=XXX
        
        FLUJO AUTOMÁTICO:
        1. Usuario hace clic en "Ver Detalle" en tabla de conciliación
        2. Frontend llama este endpoint con numero_radicacion
        3. Si existe caso → devuelve datos
        4. Si NO existe → crea automáticamente usando datos reales de auditoría
        5. Redirige a DetalleConciliacion.vue con todos los datos
        """
        try:
            numero_radicacion = request.query_params.get('numero_radicacion')
            
            if not numero_radicacion:
                return Response(
                    {'error': 'numero_radicacion es requerido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Buscar caso existente
            try:
                caso = CasoConciliacion.objects.get(numero_radicacion=numero_radicacion)
                serializer = CasoConciliacionSerializer(caso)
                return Response({
                    'caso_existente': True,
                    'caso': serializer.data
                })
            except CasoConciliacion.MultipleObjectsReturned:
                # Si hay múltiples casos, tomar el más reciente
                caso = CasoConciliacion.objects.filter(numero_radicacion=numero_radicacion).order_by('-fecha_creacion').first()
                serializer = CasoConciliacionSerializer(caso)
                return Response({
                    'caso_existente': True,
                    'caso': serializer.data,
                    'mensaje': f'Se encontraron múltiples casos para {numero_radicacion}, se devolvió el más reciente'
                })
            except CasoConciliacion.DoesNotExist:
                # Crear automáticamente si no existe - SIN TOCAR AUDITORÍA
                conciliador_asignado = {
                    'user_id': str(request.user.id),
                    'username': request.user.username,
                    'nombre_completo': f"{request.user.first_name} {request.user.last_name}".strip(),
                    'email': request.user.email
                }
                
                # Este servicio LEE datos de auditoría pero NO los modifica
                caso = ConciliacionService.crear_caso_desde_radicacion(
                    numero_radicacion, conciliador_asignado
                )
                
                serializer = CasoConciliacionSerializer(caso)
                return Response({
                    'caso_existente': False,
                    'caso_creado': True,
                    'mensaje': f'Caso de conciliación creado automáticamente para {numero_radicacion}',
                    'caso': serializer.data
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            logger.error(f"Error obteniendo o creando caso: {str(e)}")
            return Response(
                {'error': f'No se pudo obtener o crear el caso de conciliación: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def responder_glosa(self, request, pk=None):
        """
        Permitir respuesta del prestador a glosa específica
        Endpoint: POST /api/conciliacion/casos/{id}/responder_glosa/
        """
        try:
            caso = self.get_object()
            glosa_id = request.data.get('glosa_id')
            
            if not glosa_id:
                return Response(
                    {'error': 'glosa_id es requerido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar datos de respuesta
            serializer = RespuestaPrestadorSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            usuario_prestador = {
                'user_id': str(request.user.id),
                'username': request.user.username,
                'nombre': f"{request.user.first_name} {request.user.last_name}".strip()
            }
            
            caso_actualizado = ConciliacionService.responder_glosa(
                str(caso.id), glosa_id, serializer.validated_data, usuario_prestador
            )
            
            response_serializer = CasoConciliacionSerializer(caso_actualizado)
            return Response(response_serializer.data)
            
        except Exception as e:
            logger.error(f"Error respondiendo glosa: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def procesar_decision(self, request, pk=None):
        """
        Ratificar o levantar glosa
        Endpoint: POST /api/conciliacion/casos/{id}/procesar_decision/
        """
        try:
            caso = self.get_object()
            glosa_id = request.data.get('glosa_id')
            
            if not glosa_id:
                return Response(
                    {'error': 'glosa_id es requerido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar datos de decisión
            serializer = DecisionConciliacionSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            usuario_conciliador = {
                'user_id': str(request.user.id),
                'username': request.user.username,
                'nombre_completo': f"{request.user.first_name} {request.user.last_name}".strip()
            }
            
            caso_actualizado = ConciliacionService.procesar_decision_conciliacion(
                str(caso.id),
                glosa_id,
                serializer.validated_data['decision'],
                usuario_conciliador,
                serializer.validated_data.get('justificacion')
            )
            
            response_serializer = CasoConciliacionSerializer(caso_actualizado)
            return Response(response_serializer.data)
            
        except Exception as e:
            logger.error(f"Error procesando decisión: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def generar_acta(self, request, pk=None):
        """
        Generar acta final de conciliación
        Endpoint: POST /api/conciliacion/casos/{id}/generar_acta/
        """
        try:
            caso = self.get_object()
            
            # Validar datos del acta
            serializer = ActaConciliacionSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            usuario_generador = {
                'user_id': str(request.user.id),
                'username': request.user.username,
                'nombre_completo': f"{request.user.first_name} {request.user.last_name}".strip()
            }
            
            resultado = ConciliacionService.generar_acta_conciliacion(
                str(caso.id),
                serializer.validated_data['participantes'],
                serializer.validated_data['acuerdos'],
                usuario_generador
            )
            
            return Response({
                'mensaje': 'Acta generada exitosamente',
                'numero_acta': resultado['numero_acta'],
                'acta_data': resultado['acta_data']
            })
            
        except Exception as e:
            logger.error(f"Error generando acta: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def detalle_glosas(self, request, pk=None):
        """
        Obtener detalle de todas las glosas del caso
        Endpoint: GET /api/conciliacion/casos/{id}/detalle_glosas/
        """
        try:
            caso = self.get_object()
            glosas_detalle = []
            
            for factura in caso.facturas:
                for servicio in factura.get('servicios', []):
                    for glosa in servicio.get('glosas_aplicadas', []):
                        glosa_data = {
                            **glosa,
                            'servicio_info': {
                                'codigo_cups': servicio.get('codigo_cups'),
                                'descripcion': servicio.get('descripcion'),
                                'valor_servicio': servicio.get('valor_servicio')
                            },
                            'factura_info': {
                                'numero_factura': factura.get('numero_factura'),
                                'fecha_factura': factura.get('fecha_factura')
                            }
                        }
                        glosas_detalle.append(glosa_data)
            
            return Response(glosas_detalle)
            
        except Exception as e:
            logger.error(f"Error obteniendo detalle de glosas: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def trazabilidad(self, request, pk=None):
        """
        Obtener trazabilidad completa del caso
        Endpoint: GET /api/conciliacion/casos/{id}/trazabilidad/
        """
        try:
            caso = self.get_object()
            return Response(caso.trazabilidad or [])
            
        except Exception as e:
            logger.error(f"Error obteniendo trazabilidad: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Obtener estadísticas generales de conciliación
        Endpoint: GET /api/conciliacion/casos/estadisticas/
        """
        try:
            estadisticas = ConciliacionService.obtener_estadisticas_conciliacion()
            serializer = EstadisticasConciliacionSerializer(estadisticas)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def dashboard_data(self, request):
        """
        Datos agregados para dashboard de conciliación con Chart.js
        Endpoint: GET /api/conciliacion/casos/dashboard_data/
        """
        try:
            # Obtener estadísticas base
            estadisticas = ConciliacionService.obtener_estadisticas_conciliacion()
            
            # Datos adicionales para gráficos
            casos_recientes = list(CasoConciliacion.objects.filter(
                fecha_creacion__gte=timezone.now() - timezone.timedelta(days=30)
            ).order_by('-fecha_creacion')[:10])
            
            casos_urgentes = []
            for caso in CasoConciliacion.objects.filter(
                estado__in=['INICIADA', 'EN_RESPUESTA']
            ).order_by('fecha_limite_respuesta')[:5]:
                if caso.fecha_limite_respuesta and caso.fecha_limite_respuesta <= timezone.now() + timezone.timedelta(days=3):
                    casos_urgentes.append(caso)
            
            dashboard_data = {
                **estadisticas,
                'casos_recientes': CasoConciliacionListSerializer(casos_recientes, many=True).data,
                'casos_urgentes': CasoConciliacionListSerializer(casos_urgentes, many=True).data,
                'indicadores_clave': {
                    'tiempo_promedio_respuesta': 12,  # Días promedio
                    'efectividad_conciliacion': 78.5,  # Porcentaje
                    'casos_vencidos': len([
                        caso for caso in CasoConciliacion.objects.all()
                        if caso.fecha_limite_respuesta and caso.fecha_limite_respuesta < timezone.now()
                        and caso.estado in ['INICIADA', 'EN_RESPUESTA']
                    ])
                }
            }
            
            return Response(dashboard_data)
            
        except Exception as e:
            logger.error(f"Error obteniendo datos de dashboard: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )