# -*- coding: utf-8 -*-
# apps/radicacion/views_mongodb_radicacion_contrato.py
"""
Vistas NoSQL puras para radicación con contratos asociados
Sin Django ORM - MongoDB directo
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
import logging

from .services_mongodb_radicacion_contrato import radicacion_contrato_service

logger = logging.getLogger('neuraudit.radicacion')


class RadicacionesMongoDBStatsAPIView(APIView):
    """
    API para obtener estadísticas de radicaciones desde MongoDB
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        GET /api/radicacion/mongodb/stats/
        """
        try:
            stats = radicacion_contrato_service.obtener_estadisticas_radicaciones()
            
            return Response({
                'success': True,
                'total_radicaciones': stats.get('total_radicaciones', 0),
                'stats_by_estado': stats.get('stats_by_estado', []),
                'radicaciones_ultimo_mes': stats.get('radicaciones_ultimo_mes', 0),
                'proximas_vencer': stats.get('proximas_vencer', 0),
                'vencidas': stats.get('vencidas', 0),
                'valor_total': stats.get('valor_total', 0),
                'fecha_consulta': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas MongoDB: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RadicacionesMongoDBListAPIView(APIView):
    """
    API para listar radicaciones desde MongoDB
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        GET /api/radicacion/mongodb/list/
        
        Query params:
        - search: Buscar por número radicado, factura, prestador
        - estado: Filtrar por estado
        - prestador_nit: Filtrar por prestador (si es PSS se aplica automáticamente)
        - fecha_desde, fecha_hasta: Rango de fechas
        - page: Página (default: 1)
        - page_size: Tamaño página (default: 10)
        """
        try:
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 10))
            
            # Construir filtros
            filtros = {}
            
            # Filtro por prestador según rol
            prestador_nit = request.query_params.get('prestador_nit')
            if hasattr(request.user, 'pss_user') and request.user.pss_user:
                # PSS solo ve sus propias radicaciones
                filtros['prestador_nit'] = request.user.pss_user.nit
            elif prestador_nit:
                filtros['prestador_nit'] = prestador_nit
            
            # Filtro por estado
            estado = request.query_params.get('estado')
            if estado:
                filtros['estado'] = estado
            
            # Filtros de fecha
            fecha_desde = request.query_params.get('fecha_desde')
            fecha_hasta = request.query_params.get('fecha_hasta')
            if fecha_desde or fecha_hasta:
                fecha_filter = {}
                if fecha_desde:
                    fecha_filter['$gte'] = datetime.strptime(fecha_desde, '%Y-%m-%d')
                if fecha_hasta:
                    fecha_filter['$lte'] = datetime.strptime(fecha_hasta, '%Y-%m-%d')
                filtros['fecha_radicacion'] = fecha_filter
            
            # Búsqueda por texto
            search = request.query_params.get('search')
            if search:
                filtros['$or'] = [
                    {'numero_radicado': {'$regex': search, '$options': 'i'}},
                    {'numero_factura': {'$regex': search, '$options': 'i'}},
                    {'prestador_razon_social': {'$regex': search, '$options': 'i'}},
                ]
            
            # Obtener radicaciones desde MongoDB
            radicaciones_data = radicacion_contrato_service.listar_radicaciones(
                filtros=filtros,
                page=page,
                page_size=page_size
            )
            
            return Response({
                'success': True,
                'results': radicaciones_data['results'],
                'count': radicaciones_data['total'],
                'page': page,
                'page_size': page_size,
                'total_pages': (radicaciones_data['total'] + page_size - 1) // page_size
            })
            
        except Exception as e:
            logger.error(f"Error listando radicaciones MongoDB: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContratosActivosPrestadorAPIView(APIView):
    """
    API para obtener contratos activos de un prestador
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        GET /api/radicacion/mongodb/contratos-activos/
        
        Query params:
        - prestador_nit: NIT del prestador (requerido)
        - fecha_servicio: Fecha para validar vigencia (opcional, formato YYYY-MM-DD)
        """
        prestador_nit = request.query_params.get('prestador_nit')
        if not prestador_nit:
            # Si el usuario es PSS, usar su propio NIT
            if hasattr(request.user, 'pss_user') and request.user.pss_user:
                prestador_nit = request.user.pss_user.nit
            else:
                return Response({
                    'success': False,
                    'error': 'prestador_nit es requerido'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        fecha_servicio = request.query_params.get('fecha_servicio')
        if fecha_servicio:
            try:
                fecha_servicio = datetime.strptime(fecha_servicio, '%Y-%m-%d').date()
            except ValueError:
                return Response({
                    'success': False,
                    'error': 'Formato de fecha inválido. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        contratos = radicacion_contrato_service.obtener_contratos_activos_prestador(
            prestador_nit=prestador_nit,
            fecha_servicio=fecha_servicio
        )
        
        return Response({
            'success': True,
            'count': len(contratos),
            'contratos': contratos,
            'prestador_nit': prestador_nit
        })


class RadicacionConContratoAPIView(APIView):
    """
    API para crear radicación asociada a contrato
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        POST /api/radicacion/mongodb/radicar-con-contrato/
        
        Body:
        {
            "contrato_id": "xxx",  // OBLIGATORIO
            "prestador_nit": "xxx",
            "numero_factura": "xxx",
            "fecha_expedicion": "YYYY-MM-DD",
            "fecha_inicio_periodo": "YYYY-MM-DD",
            "fecha_fin_periodo": "YYYY-MM-DD",
            "valor_factura": 0,  // Puede ser 0
            "valor_copago": 0,
            "valor_cuota_moderadora": 0,
            "rips_id": "xxx",  // ID de transacción RIPS si existe
            "total_usuarios": 0,
            "total_servicios": 0,
            "documentos": []
        }
        """
        try:
            # Agregar información del usuario
            datos = request.data.copy()
            datos['usuario_id'] = str(request.user.id)
            datos['ip_address'] = request.META.get('REMOTE_ADDR', '')
            
            # Validar contrato_id obligatorio
            if not datos.get('contrato_id'):
                return Response({
                    'success': False,
                    'error': 'contrato_id es obligatorio para radicar',
                    'codigo_devolucion': 'DE9001'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Si el usuario es PSS, usar su NIT
            if hasattr(request.user, 'pss_user') and request.user.pss_user:
                datos['prestador_nit'] = request.user.pss_user.nit
            elif not datos.get('prestador_nit'):
                return Response({
                    'success': False,
                    'error': 'prestador_nit es requerido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Convertir fechas de string a date
            for campo_fecha in ['fecha_expedicion', 'fecha_inicio_periodo', 'fecha_fin_periodo']:
                if campo_fecha in datos and isinstance(datos[campo_fecha], str):
                    try:
                        datos[campo_fecha] = datetime.strptime(datos[campo_fecha], '%Y-%m-%d').date()
                    except ValueError:
                        return Response({
                            'success': False,
                            'error': f'Formato inválido en {campo_fecha}. Use YYYY-MM-DD'
                        }, status=status.HTTP_400_BAD_REQUEST)
            
            # Crear radicación con contrato
            resultado = radicacion_contrato_service.crear_radicacion_con_contrato(datos)
            
            if resultado['success']:
                return Response(resultado, status=status.HTTP_201_CREATED)
            else:
                # Determinar código de estado según el error
                if 'DE' in resultado.get('codigo_devolucion', ''):
                    status_code = status.HTTP_400_BAD_REQUEST
                else:
                    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
                
                return Response(resultado, status=status_code)
                
        except Exception as e:
            logger.error(f"Error en radicación con contrato: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ValidarTarifasRadicacionAPIView(APIView):
    """
    API para validar tarifas de una radicación contra su contrato
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, radicacion_id):
        """
        POST /api/radicacion/mongodb/validar-tarifas/{radicacion_id}/
        """
        try:
            resultado = radicacion_contrato_service.validar_tarifas_radicacion(radicacion_id)
            
            if resultado['success']:
                return Response(resultado)
            else:
                return Response(resultado, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error validando tarifas: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RadicacionesPorContratoAPIView(APIView):
    """
    API para obtener radicaciones de un contrato específico
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, contrato_id):
        """
        GET /api/radicacion/mongodb/radicaciones-contrato/{contrato_id}/
        
        Query params:
        - estado: Filtrar por estado
        - fecha_desde: Fecha inicio (YYYY-MM-DD)
        - fecha_hasta: Fecha fin (YYYY-MM-DD)
        """
        filtros = {}
        
        if request.query_params.get('estado'):
            filtros['estado'] = request.query_params.get('estado')
        
        if request.query_params.get('fecha_desde'):
            try:
                filtros['fecha_desde'] = datetime.strptime(
                    request.query_params.get('fecha_desde'), 
                    '%Y-%m-%d'
                ).date()
            except ValueError:
                pass
        
        if request.query_params.get('fecha_hasta'):
            try:
                filtros['fecha_hasta'] = datetime.strptime(
                    request.query_params.get('fecha_hasta'), 
                    '%Y-%m-%d'
                ).date()
            except ValueError:
                pass
        
        radicaciones = radicacion_contrato_service.buscar_radicaciones_por_contrato(
            contrato_id=contrato_id,
            filtros=filtros
        )
        
        # Calcular estadísticas
        total_radicado = sum(r['valor_factura'] for r in radicaciones)
        con_glosas = sum(1 for r in radicaciones 
                        if r.get('validaciones', {}).get('tarifas', {}).get('resumen', {}).get('total_glosas', 0) > 0)
        
        return Response({
            'success': True,
            'contrato_id': contrato_id,
            'count': len(radicaciones),
            'estadisticas': {
                'total_radicaciones': len(radicaciones),
                'valor_total_radicado': total_radicado,
                'radicaciones_con_glosas': con_glosas,
                'facturas_valor_cero': sum(1 for r in radicaciones if r.get('es_factura_valor_cero'))
            },
            'radicaciones': radicaciones
        })