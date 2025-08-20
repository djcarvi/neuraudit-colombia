from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum, Count
from django.utils import timezone
from bson import ObjectId
import json

from .models_glosas import GlosaAplicada
from .serializers_glosas import (
    GlosaAplicadaSerializer,
    RespuestaGlosaSerializer,
    GlosaPorRadicacionSerializer,
    GlosaPorPrestadorSerializer
)
from apps.contratacion.renderers import MongoJSONRenderer


class GlosaAplicadaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las glosas aplicadas por los auditores
    """
    queryset = GlosaAplicada.objects.all()
    serializer_class = GlosaAplicadaSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [MongoJSONRenderer]
    
    def get_queryset(self):
        """Filtrar glosas según parámetros de consulta"""
        queryset = super().get_queryset()
        
        # Filtro por radicación
        radicacion_id = self.request.query_params.get('radicacion_id')
        if radicacion_id:
            queryset = queryset.filter(radicacion_id=radicacion_id)
        
        # Filtro por factura
        factura_id = self.request.query_params.get('factura_id')
        if factura_id:
            queryset = queryset.filter(factura_id=factura_id)
        
        # Filtro por servicio
        servicio_id = self.request.query_params.get('servicio_id')
        if servicio_id:
            queryset = queryset.filter(servicio_id=servicio_id)
        
        # Filtro por estado
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Filtro por prestador (búsqueda en JSON)
        prestador_nit = self.request.query_params.get('prestador_nit')
        if prestador_nit:
            queryset = queryset.filter(prestador_info__nit=prestador_nit)
        
        # Filtro por tipo de glosa
        tipo_glosa = self.request.query_params.get('tipo_glosa')
        if tipo_glosa:
            queryset = queryset.filter(tipo_glosa=tipo_glosa)
        
        # Filtro por fecha
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        if fecha_desde:
            queryset = queryset.filter(fecha_aplicacion__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_aplicacion__lte=fecha_hasta)
        
        return queryset.order_by('-fecha_aplicacion')
    
    def create(self, request, *args, **kwargs):
        """Crear nueva glosa con validaciones adicionales"""
        # Validar que el usuario sea auditor
        if not hasattr(request.user, 'rol') or request.user.rol != 'AUDITOR':
            return Response(
                {'error': 'Solo los auditores pueden aplicar glosas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validar que no exista ya una glosa del mismo tipo para el servicio
        servicio_id = request.data.get('servicio_id')
        codigo_glosa = request.data.get('codigo_glosa')
        
        glosa_existente = GlosaAplicada.objects.filter(
            servicio_id=servicio_id,
            codigo_glosa=codigo_glosa,
            estado__in=['APLICADA', 'EN_CONCILIACION']
        ).first()
        
        if glosa_existente:
            return Response(
                {'error': f'Ya existe una glosa activa con el código {codigo_glosa} para este servicio'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def responder(self, request, pk=None):
        """Endpoint para que el prestador responda a una glosa"""
        glosa = self.get_object()
        
        # Validar que el usuario sea prestador
        if not hasattr(request.user, 'rol') or request.user.rol != 'PRESTADOR':
            return Response(
                {'error': 'Solo los prestadores pueden responder a glosas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validar los datos de la respuesta
        serializer = RespuestaGlosaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        respuesta_data = serializer.validated_data
        
        # Validar que la suma no exceda el valor glosado
        total_respuesta = respuesta_data['valor_aceptado'] + respuesta_data['valor_rechazado']
        if total_respuesta > glosa.valor_glosado:
            return Response(
                {'error': 'La suma de valores aceptado y rechazado no puede exceder el valor glosado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Agregar información del usuario prestador
        respuesta_data['usuario_prestador'] = {
            'user_id': str(request.user.id),
            'username': request.user.username,
            'nombre': getattr(request.user, 'get_full_name', lambda: request.user.username)()
        }
        
        # Agregar la respuesta
        glosa.agregar_respuesta(respuesta_data)
        
        # Serializar y devolver la glosa actualizada
        serializer = self.get_serializer(glosa)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estadisticas_radicacion(self, request):
        """Obtener estadísticas de glosas por radicación"""
        radicacion_id = request.query_params.get('radicacion_id')
        if not radicacion_id:
            return Response(
                {'error': 'Se requiere el parámetro radicacion_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        glosas = GlosaAplicada.objects.filter(radicacion_id=radicacion_id)
        
        # Calcular estadísticas
        estadisticas = {
            'numero_radicacion': '',
            'total_glosas': 0,
            'valor_total_glosado': 0,
            'valor_total_aceptado': 0,
            'valor_total_rechazado': 0,
            'estado_general': 'SIN_GLOSAS',
            'requiere_conciliacion': False
        }
        
        if glosas.exists():
            primera_glosa = glosas.first()
            estadisticas['numero_radicacion'] = primera_glosa.numero_radicacion
            estadisticas['total_glosas'] = glosas.count()
            
            # Sumar valores
            for glosa in glosas:
                estadisticas['valor_total_glosado'] += float(glosa.valor_glosado)
                if glosa.estadisticas:
                    estadisticas['valor_total_aceptado'] += glosa.estadisticas.get('valor_total_aceptado', 0)
                    estadisticas['valor_total_rechazado'] += glosa.estadisticas.get('valor_total_rechazado', 0)
                    if glosa.estadisticas.get('requiere_conciliacion'):
                        estadisticas['requiere_conciliacion'] = True
            
            # Determinar estado general
            estados = glosas.values_list('estado', flat=True).distinct()
            if 'EN_CONCILIACION' in estados:
                estadisticas['estado_general'] = 'EN_CONCILIACION'
            elif 'RESPONDIDA' in estados:
                estadisticas['estado_general'] = 'PARCIALMENTE_RESPONDIDA'
            elif all(estado == 'ACEPTADA' for estado in estados):
                estadisticas['estado_general'] = 'TOTALMENTE_ACEPTADA'
            else:
                estadisticas['estado_general'] = 'APLICADA'
        
        serializer = GlosaPorRadicacionSerializer(estadisticas)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estadisticas_prestador(self, request):
        """Obtener estadísticas de glosas por prestador"""
        prestador_nit = request.query_params.get('prestador_nit')
        if not prestador_nit:
            return Response(
                {'error': 'Se requiere el parámetro prestador_nit'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        glosas = GlosaAplicada.objects.filter(prestador_info__nit=prestador_nit)
        
        if not glosas.exists():
            return Response(
                {'error': 'No se encontraron glosas para este prestador'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Calcular estadísticas
        primera_glosa = glosas.first()
        total_glosas = glosas.count()
        valor_total_glosado = sum(float(g.valor_glosado) for g in glosas)
        
        # Calcular porcentaje de aceptación
        total_aceptado = 0
        glosas_pendientes = 0
        glosas_en_conciliacion = 0
        
        for glosa in glosas:
            if glosa.estado == 'APLICADA':
                glosas_pendientes += 1
            elif glosa.estado == 'EN_CONCILIACION':
                glosas_en_conciliacion += 1
            
            if glosa.estadisticas:
                total_aceptado += glosa.estadisticas.get('valor_total_aceptado', 0)
        
        porcentaje_aceptacion = 0
        if valor_total_glosado > 0:
            porcentaje_aceptacion = (total_aceptado / valor_total_glosado) * 100
        
        estadisticas = {
            'prestador_nit': prestador_nit,
            'prestador_nombre': primera_glosa.prestador_info.get('razon_social', ''),
            'total_glosas': total_glosas,
            'valor_total_glosado': valor_total_glosado,
            'porcentaje_aceptacion': round(porcentaje_aceptacion, 2),
            'glosas_pendientes': glosas_pendientes,
            'glosas_en_conciliacion': glosas_en_conciliacion
        }
        
        serializer = GlosaPorPrestadorSerializer(estadisticas)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de una glosa (solo auditores)"""
        glosa = self.get_object()
        
        # Validar que el usuario sea auditor
        if not hasattr(request.user, 'rol') or request.user.rol != 'AUDITOR':
            return Response(
                {'error': 'Solo los auditores pueden cambiar el estado de las glosas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        nuevo_estado = request.data.get('estado')
        observacion = request.data.get('observacion', '')
        
        estados_validos = ['APLICADA', 'EN_REVISION', 'EN_CONCILIACION', 'ACEPTADA', 'RECHAZADA', 'ANULADA']
        if nuevo_estado not in estados_validos:
            return Response(
                {'error': f'Estado inválido. Estados válidos: {", ".join(estados_validos)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Guardar estado anterior para el historial
        glosa._estado_anterior = glosa.estado
        glosa._observacion_cambio = observacion
        
        # Cambiar estado
        glosa.estado = nuevo_estado
        glosa.save()
        
        serializer = self.get_serializer(glosa)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def codigos_glosa(self, request):
        """Obtener todos los códigos de glosa disponibles según la Resolución 2284"""
        # Este endpoint devuelve la estructura de códigos para el frontend
        codigos = {
            'FA': {
                'nombre': 'Facturación',
                'codigos': [
                    {'codigo': 'FA0101', 'descripcion': 'Diferencia en cantidades de estancia/observación facturadas'},
                    {'codigo': 'FA0102', 'descripcion': 'Consultas incluidas en estancia/observación de urgencias'},
                    # ... agregar todos los códigos FA
                ]
            },
            'TA': {
                'nombre': 'Tarifas',
                'codigos': [
                    {'codigo': 'TA0101', 'descripcion': 'Tarifa de estancia superior a la pactada'},
                    {'codigo': 'TA0102', 'descripcion': 'Tarifa de observación superior a la pactada'},
                    # ... agregar todos los códigos TA
                ]
            },
            # ... agregar todos los tipos de glosa
        }
        
        return Response(codigos)