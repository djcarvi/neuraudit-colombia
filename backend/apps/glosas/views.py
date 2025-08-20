# -*- coding: utf-8 -*-
"""
Vistas para el sistema de glosas según Resolución 2284
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum, Count, Avg
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
from decimal import Decimal

from .models import Glosa, RespuestaGlosa, RatificacionGlosa
from .serializers import (
    GlosaSerializer, GlosaListSerializer,
    RespuestaGlosaSerializer, RatificacionGlosaSerializer,
    EstadisticasGlosasSerializer
)


class GlosaViewSet(viewsets.ModelViewSet):
    """
    ViewSet principal para gestión de glosas
    """
    queryset = Glosa.objects.all()
    serializer_class = GlosaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Usar serializer optimizado para listas"""
        if self.action == 'list':
            return GlosaListSerializer
        return GlosaSerializer
    
    def get_queryset(self):
        """Filtrar glosas según parámetros de consulta"""
        queryset = super().get_queryset()
        
        # Filtros básicos
        prestador_nit = self.request.query_params.get('prestador_nit')
        if prestador_nit:
            queryset = queryset.filter(prestador_nit=prestador_nit)
        
        numero_radicado = self.request.query_params.get('numero_radicado')
        if numero_radicado:
            queryset = queryset.filter(numero_radicado__icontains=numero_radicado)
        
        factura_numero = self.request.query_params.get('factura_numero')
        if factura_numero:
            queryset = queryset.filter(factura_numero__icontains=factura_numero)
        
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria_glosa=categoria)
        
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Filtros por fechas
        fecha_desde = self.request.query_params.get('fecha_desde')
        if fecha_desde:
            queryset = queryset.filter(fecha_formulacion__gte=fecha_desde)
        
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        if fecha_hasta:
            queryset = queryset.filter(fecha_formulacion__lte=fecha_hasta)
        
        # Filtros especiales
        solo_vencidas = self.request.query_params.get('solo_vencidas')
        if solo_vencidas == 'true':
            now = datetime.now()
            queryset = queryset.filter(
                Q(fecha_limite_respuesta__lt=now, fecha_respuesta_prestador__isnull=True) |
                Q(fecha_limite_ratificacion__lt=now, fecha_ratificacion_eps__isnull=True)
            )
        
        solo_por_vencer = self.request.query_params.get('solo_por_vencer')
        if solo_por_vencer == 'true':
            tomorrow = datetime.now() + timedelta(days=1)
            queryset = queryset.filter(
                Q(fecha_limite_respuesta__lte=tomorrow, fecha_respuesta_prestador__isnull=True) |
                Q(fecha_limite_ratificacion__lte=tomorrow, fecha_ratificacion_eps__isnull=True)
            )
        
        return queryset.select_related('created_by')
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Endpoint para estadísticas generales de glosas"""
        queryset = self.get_queryset()
        
        # Estadísticas básicas
        total_glosas = queryset.count()
        total_respondidas = queryset.filter(estado='RESPONDIDA_1').count()
        total_ratificadas = queryset.filter(estado='RATIFICADA').count()
        total_aceptadas = queryset.filter(estado__in=['ACEPTADA_TOTAL', 'ACEPTADA_PARCIAL']).count()
        total_objetadas = queryset.filter(estado='OBJETADA').count()
        total_conciliacion = queryset.filter(estado='CONCILIACION').count()
        
        # Valores monetarios
        valores = queryset.aggregate(
            total_glosado=Sum('valor_glosado') or Decimal('0'),
            total_aceptado=Sum('valor_aceptado') or Decimal('0'),
            total_objetado=Sum('valor_objetado') or Decimal('0')
        )
        
        # Porcentajes
        porcentaje_respuesta = (total_respondidas / total_glosas * 100) if total_glosas > 0 else 0
        porcentaje_aceptacion = (valores['total_aceptado'] / valores['total_glosado'] * 100) if valores['total_glosado'] > 0 else 0
        porcentaje_objecion = (valores['total_objetado'] / valores['total_glosado'] * 100) if valores['total_glosado'] > 0 else 0
        
        # Estadísticas por categoría
        stats_categoria = {}
        for categoria, nombre in Glosa.CATEGORIA_GLOSA_CHOICES:
            cat_queryset = queryset.filter(categoria_glosa=categoria)
            cat_count = cat_queryset.count()
            cat_valor = cat_queryset.aggregate(total=Sum('valor_glosado'))['total'] or Decimal('0')
            
            stats_categoria[categoria] = {
                'nombre': nombre,
                'cantidad': cat_count,
                'valor_total': float(cat_valor),
                'porcentaje_cantidad': (cat_count / total_glosas * 100) if total_glosas > 0 else 0,
                'porcentaje_valor': (cat_valor / valores['total_glosado'] * 100) if valores['total_glosado'] > 0 else 0
            }
        
        # Top prestadores con más glosas
        top_prestadores = (queryset
                          .values('prestador_nit', 'prestador_nombre')
                          .annotate(
                              total_glosas=Count('id'),
                              total_valor=Sum('valor_glosado')
                          )
                          .order_by('-total_valor')[:10])
        
        data = {
            'total_glosas': total_glosas,
            'total_respondidas': total_respondidas,
            'total_ratificadas': total_ratificadas,
            'total_aceptadas': total_aceptadas,
            'total_objetadas': total_objetadas,
            'total_conciliacion': total_conciliacion,
            'valor_total_glosado': float(valores['total_glosado']),
            'valor_total_aceptado': float(valores['total_aceptado']),
            'valor_total_objetado': float(valores['total_objetado']),
            'porcentaje_respuesta': round(porcentaje_respuesta, 2),
            'porcentaje_aceptacion': round(porcentaje_aceptacion, 2),
            'porcentaje_objecion': round(porcentaje_objecion, 2),
            'estadisticas_por_categoria': stats_categoria,
            'top_prestadores_glosados': list(top_prestadores)
        }
        
        serializer = EstadisticasGlosasSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_vencer(self, request):
        """Glosas próximas a vencer (en las próximas 24 horas)"""
        tomorrow = datetime.now() + timedelta(days=1)
        
        queryset = self.get_queryset().filter(
            Q(fecha_limite_respuesta__lte=tomorrow, fecha_respuesta_prestador__isnull=True) |
            Q(fecha_limite_ratificacion__lte=tomorrow, fecha_ratificacion_eps__isnull=True)
        )
        
        serializer = GlosaListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def vencidas(self, request):
        """Glosas vencidas (pasaron los plazos sin respuesta)"""
        now = datetime.now()
        
        queryset = self.get_queryset().filter(
            Q(fecha_limite_respuesta__lt=now, fecha_respuesta_prestador__isnull=True) |
            Q(fecha_limite_ratificacion__lt=now, fecha_ratificacion_eps__isnull=True)
        )
        
        serializer = GlosaListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def notificar(self, request, pk=None):
        """Notificar glosa al prestador"""
        glosa = self.get_object()
        
        if glosa.estado != 'FORMULADA':
            return Response(
                {'error': 'Solo se pueden notificar glosas en estado FORMULADA'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar estado y fechas
        glosa.estado = 'NOTIFICADA'
        glosa.fecha_notificacion = datetime.now()
        glosa.fecha_limite_respuesta = glosa.fecha_notificacion + timedelta(days=5)
        glosa.save()
        
        serializer = self.get_serializer(glosa)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verificar_plazos(self, request, pk=None):
        """Verificar y aplicar aceptaciones tácitas por vencimiento de plazos"""
        glosa = self.get_object()
        
        cambio_aplicado = glosa.verificar_aceptacion_tacita()
        
        if cambio_aplicado:
            serializer = self.get_serializer(glosa)
            return Response({
                'mensaje': 'Se aplicó aceptación tácita por vencimiento de plazo',
                'glosa': serializer.data
            })
        else:
            return Response({
                'mensaje': 'No se aplicaron cambios, los plazos están vigentes',
                'glosa': self.get_serializer(glosa).data
            })


class RespuestaGlosaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para respuestas a glosas
    """
    queryset = RespuestaGlosa.objects.all()
    serializer_class = RespuestaGlosaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar por glosa si se especifica"""
        queryset = super().get_queryset()
        
        glosa_id = self.request.query_params.get('glosa_id')
        if glosa_id:
            queryset = queryset.filter(glosa_id=glosa_id)
        
        return queryset.select_related('glosa', 'respondido_por')


class RatificacionGlosaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para ratificaciones de glosas
    """
    queryset = RatificacionGlosa.objects.all()
    serializer_class = RatificacionGlosaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar por glosa si se especifica"""
        queryset = super().get_queryset()
        
        glosa_id = self.request.query_params.get('glosa_id')
        if glosa_id:
            queryset = queryset.filter(glosa_id=glosa_id)
        
        return queryset.select_related('glosa', 'respuesta_glosa', 'ratificado_por')