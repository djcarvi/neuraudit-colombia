# -*- coding: utf-8 -*-
# apps/radicacion/views_rips.py

"""
ViewSets para APIs REST de RIPS - NeurAudit Colombia
Manejo de transacciones RIPS con servicios MongoDB nativos
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from bson import ObjectId
import logging

from .models_rips_oficial import RIPSTransaccionOficial as RIPSTransaccion
from .serializers_rips import (
    RIPSTransaccionSerializer, RIPSTransaccionListSerializer,
    RIPSProcesarRequestSerializer, RIPSBusquedaRequestSerializer,
    RIPSValidacionBDUARequestSerializer, RIPSPreAuditoriaRequestSerializer,
    RIPSAsignacionRequestSerializer, RIPSEstadisticasResponseSerializer
)
from .services_rips import rips_service
from apps.core.services.mongodb_service import mongodb_service
from apps.catalogs.services import catalogs_service

logger = logging.getLogger(__name__)


class RIPSTransaccionViewSet(viewsets.ModelViewSet):
    """
    ViewSet principal para transacciones RIPS
    
    Endpoints:
    - GET /api/rips/transacciones/ - Lista paginada (solo metadatos)
    - GET /api/rips/transacciones/{id}/ - Detalle completo con subdocumentos
    - POST /api/rips/transacciones/procesar/ - Procesar archivo RIPS
    - POST /api/rips/transacciones/buscar/ - Búsqueda avanzada
    - POST /api/rips/transacciones/{id}/validar_bdua/ - Validar BDUA
    - POST /api/rips/transacciones/{id}/pre_auditoria/ - Ejecutar pre-auditoría
    - GET /api/rips/transacciones/estadisticas/ - Estadísticas agregadas
    """
    queryset = RIPSTransaccion.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estadoProcesamiento', 'prestadorNit']
    search_fields = ['numFactura', 'prestadorRazonSocial']
    ordering_fields = ['fechaRadicacion', 'created_at']
    ordering = ['-fechaRadicacion']
    
    def get_serializer_class(self):
        """
        Usar serializer optimizado para listados
        """
        if self.action == 'list':
            return RIPSTransaccionListSerializer
        return RIPSTransaccionSerializer
    
    def get_queryset(self):
        """
        Filtros personalizados por query params
        """
        queryset = super().get_queryset()
        
        # Filtro por usuario (PSS solo ve sus propias transacciones)
        user = self.request.user
        if hasattr(user, 'is_pss_user') and user.is_pss_user:
            queryset = queryset.filter(prestadorNit=user.nit)
        
        # Filtros por fecha
        fecha_desde = self.request.query_params.get('fecha_desde')
        if fecha_desde:
            try:
                from datetime import datetime
                fecha = datetime.strptime(fecha_desde, '%Y-%m-%d')
                queryset = queryset.filter(fechaRadicacion__gte=fecha)
            except ValueError:
                pass
        
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        if fecha_hasta:
            try:
                from datetime import datetime
                fecha = datetime.strptime(fecha_hasta, '%Y-%m-%d')
                queryset = queryset.filter(fechaRadicacion__lte=fecha)
            except ValueError:
                pass
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def procesar(self, request):
        """
        Procesar archivo RIPS completo con validaciones
        """
        serializer = RIPSProcesarRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        try:
            # Obtener información del prestador
            prestador_info = catalogs_service._verificar_prestador_red(data['prestador_nit'])
            if not prestador_info:
                return Response(
                    {"error": "Prestador no encontrado o no activo"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Información básica del prestador
            prestador_data = {
                'nit': data['prestador_nit'],
                'razon_social': f"Prestador {data['prestador_nit']}"  # Se puede mejorar
            }
            
            # Procesar con servicio nativo
            resultado = rips_service.procesar_transaccion_rips(
                archivo_rips=data['archivo_rips'],
                prestador_info=prestador_data
            )
            
            if not resultado.get('success'):
                return Response(
                    {"error": resultado.get('error', 'Error desconocido')},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Registrar en trazabilidad
            if resultado.get('transaccion_id'):
                mongodb_service.db.rips_transacciones.update_one(
                    {"_id": ObjectId(resultado['transaccion_id'])},
                    {
                        "$push": {
                            "trazabilidad": {
                                "evento": "PROCESAMIENTO_RIPS",
                                "fecha": datetime.now(),
                                "usuario": request.user.username,
                                "descripcion": f"Archivo RIPS procesado exitosamente"
                            }
                        }
                    }
                )
            
            return Response({
                "success": True,
                "transaccion_id": resultado['transaccion_id'],
                "mensaje": "Archivo RIPS procesado exitosamente",
                "estadisticas": {
                    "total_usuarios": resultado['total_usuarios'],
                    "total_servicios": resultado['total_servicios'],
                    "valor_total": resultado['valor_total']
                },
                "pre_auditoria": resultado.get('pre_auditoria', {})
            })
            
        except Exception as e:
            logger.error(f"Error procesando RIPS: {e}")
            return Response(
                {"error": "Error interno procesando RIPS"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def buscar(self, request):
        """
        Búsqueda avanzada de transacciones RIPS
        """
        serializer = RIPSBusquedaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Construir filtros para servicio
        filtros = {}
        if data.get('prestador_nit'):
            filtros['prestadorNit'] = data['prestador_nit']
        if data.get('estado'):
            filtros['estadoProcesamiento'] = data['estado']
        if data.get('num_factura'):
            filtros['numFactura'] = data['num_factura']
        
        # Usar servicio nativo para búsqueda
        if data.get('prestador_nit'):
            transacciones = rips_service.obtener_transacciones_prestador(
                prestador_nit=data['prestador_nit'],
                filtros={
                    'estado': data.get('estado'),
                    'fecha_desde': data.get('fecha_desde').strftime('%Y-%m-%d') if data.get('fecha_desde') else None,
                    'fecha_hasta': data.get('fecha_hasta').strftime('%Y-%m-%d') if data.get('fecha_hasta') else None
                }
            )
            
            # Limitar resultados
            transacciones = transacciones[:data.get('limit', 50)]
            
            return Response({
                'count': len(transacciones),
                'results': transacciones
            })
        else:
            # Fallback a QuerySet Django
            queryset = self.get_queryset()
            
            # Aplicar filtros adicionales
            for campo, valor in filtros.items():
                kwargs = {campo: valor}
                queryset = queryset.filter(**kwargs)
            
            # Paginación manual
            limit = data.get('limit', 50)
            transacciones = list(queryset[:limit])
            
            # Serializar
            serializer = RIPSTransaccionListSerializer(transacciones, many=True)
            
            return Response({
                'count': len(transacciones),
                'results': serializer.data
            })
    
    @action(detail=True, methods=['post'])
    def validar_bdua(self, request, pk=None):
        """
        Validar/revalidar BDUA para todos los usuarios de una transacción
        """
        serializer = RIPSValidacionBDUARequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        transaccion_id = pk
        forzar = serializer.validated_data.get('forzar_revalidacion', False)
        
        try:
            # Obtener transacción
            transaccion = RIPSTransaccion.objects.get(id=ObjectId(transaccion_id))
            
            resultados_validacion = []
            usuarios_sin_derechos = 0
            
            if transaccion.usuarios:
                for usuario in transaccion.usuarios:
                    # Validar BDUA
                    validacion = catalogs_service.validar_usuario_integral(
                        tipo_doc=usuario.tipoDocumento,
                        num_doc=usuario.numeroDocumento,
                        fecha_atencion=datetime.now().strftime('%Y-%m-%d')  # Simplificado
                    )
                    
                    resultados_validacion.append({
                        'usuario': f"{usuario.tipoDocumento}-{usuario.numeroDocumento}",
                        'tiene_derechos': validacion.get('tiene_derechos', False),
                        'regimen': validacion.get('regimen'),
                        'mensaje': validacion.get('mensaje')
                    })
                    
                    if not validacion.get('tiene_derechos'):
                        usuarios_sin_derechos += 1
            
            # Actualizar transacción si hay problemas
            if usuarios_sin_derechos > 0:
                transaccion.estadoProcesamiento = 'VALIDANDO'
                transaccion.save()
            
            # Registrar trazabilidad
            transaccion.agregar_trazabilidad(
                evento="VALIDACION_BDUA",
                usuario=request.user.username,
                descripcion=f"Validación BDUA: {usuarios_sin_derechos} usuarios sin derechos"
            )
            
            return Response({
                'transaccion_id': transaccion_id,
                'usuarios_validados': len(resultados_validacion),
                'usuarios_sin_derechos': usuarios_sin_derechos,
                'requiere_devolucion': usuarios_sin_derechos > 0,
                'resultados': resultados_validacion
            })
            
        except RIPSTransaccion.DoesNotExist:
            return Response(
                {"error": "Transacción no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error validación BDUA {transaccion_id}: {e}")
            return Response(
                {"error": "Error interno en validación BDUA"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def pre_auditoria(self, request, pk=None):
        """
        Ejecutar pre-auditoría automática
        """
        serializer = RIPSPreAuditoriaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        transaccion_id = pk
        
        try:
            # Ejecutar pre-auditoría con servicio
            resultado = rips_service.ejecutar_preauditoria_automatica(transaccion_id)
            
            if resultado.get('error'):
                return Response(
                    {"error": resultado['error']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Registrar trazabilidad
            mongodb_service.db.rips_transacciones.update_one(
                {"_id": ObjectId(transaccion_id)},
                {
                    "$push": {
                        "trazabilidad": {
                            "evento": "PRE_AUDITORIA",
                            "fecha": datetime.now(),
                            "usuario": request.user.username,
                            "descripcion": f"Pre-auditoría ejecutada: {resultado.get('estado_final')}"
                        }
                    }
                }
            )
            
            return Response({
                'transaccion_id': transaccion_id,
                'estado_final': resultado.get('estado_final'),
                'requiere_auditoria': resultado.get('requiere_auditoria'),
                'devoluciones': resultado.get('devoluciones', {}),
                'pre_glosas': resultado.get('preglosas', {}),
                'mensaje': 'Pre-auditoría ejecutada exitosamente'
            })
            
        except Exception as e:
            logger.error(f"Error pre-auditoría {transaccion_id}: {e}")
            return Response(
                {"error": "Error interno en pre-auditoría"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def asignar_auditoria(self, request):
        """
        Asignar transacciones a auditoría (automática o manual)
        """
        serializer = RIPSAsignacionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        transacciones_ids = data['transacciones_ids']
        auditor_username = data.get('auditor_username')
        
        resultados = []
        
        for transaccion_id in transacciones_ids:
            try:
                if auditor_username:
                    # Asignación manual
                    resultado = {
                        "success": True,
                        "auditor_asignado": auditor_username,
                        "transaccion_id": transaccion_id,
                        "tipo_asignacion": "MANUAL"
                    }
                    
                    # Actualizar transacción
                    mongodb_service.db.rips_transacciones.update_one(
                        {"_id": ObjectId(transaccion_id)},
                        {
                            "$set": {
                                "preAuditoria.asignacion": {
                                    "auditor_username": auditor_username,
                                    "fecha_asignacion": datetime.now(),
                                    "tipo_asignacion": "MANUAL",
                                    "asignado_por": request.user.username
                                },
                                "estadoProcesamiento": "ASIGNADO_AUDITORIA"
                            }
                        }
                    )
                else:
                    # Asignación automática
                    resultado = mongodb_service.asignar_auditoria_automatica(
                        transaccion_id,
                        criterios=data.get('criterios_especiales', {})
                    )
                
                resultados.append({
                    'transaccion_id': transaccion_id,
                    'resultado': resultado
                })
                
            except Exception as e:
                logger.error(f"Error asignación {transaccion_id}: {e}")
                resultados.append({
                    'transaccion_id': transaccion_id,
                    'resultado': {"error": str(e)}
                })
        
        return Response({
            'total_procesadas': len(transacciones_ids),
            'resultados': resultados
        })
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Estadísticas agregadas de transacciones RIPS
        """
        # Filtros opcionales
        filtros = {}
        
        prestador_nit = request.query_params.get('prestador_nit')
        if prestador_nit:
            filtros['prestadorNit'] = prestador_nit
        
        estado = request.query_params.get('estado')
        if estado:
            filtros['estadoProcesamiento'] = estado
        
        # Obtener dashboard
        dashboard = rips_service.obtener_dashboard_auditoria(filtros)
        
        # Preparar respuesta
        response_data = {
            'periodo': {
                'desde': request.query_params.get('fecha_desde'),
                'hasta': request.query_params.get('fecha_hasta')
            },
            'total_transacciones': sum(
                est.get('total_transacciones', 0) 
                for est in dashboard.get('estadisticas_por_estado', [])
            ),
            'valor_total_facturado': sum(
                est.get('valor_total', 0) 
                for est in dashboard.get('estadisticas_por_estado', [])
            ),
            'distribucion_estados': dashboard.get('estadisticas_por_estado', []),
            'top_prestadores': [],  # Se puede implementar
            'metricas_auditoria': {
                'balance_auditores': dashboard.get('balance_auditores', [])
            }
        }
        
        serializer = RIPSEstadisticasResponseSerializer(response_data)
        return Response(serializer.data)
    
    @method_decorator(cache_page(60 * 5))  # Cache 5 minutos
    def list(self, request, *args, **kwargs):
        """Lista optimizada con cache"""
        return super().list(request, *args, **kwargs)