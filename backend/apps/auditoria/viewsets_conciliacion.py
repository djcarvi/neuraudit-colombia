"""
ViewSets para el módulo de conciliación
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q, Sum, Count, F
from django.utils import timezone
from datetime import timedelta

from .models_glosas import GlosaAplicada
from .serializers_glosas import GlosaAplicadaSerializer


class ConciliacionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para gestión de casos de conciliación
    """
    queryset = GlosaAplicada.objects.all()
    serializer_class = GlosaAplicadaSerializer
    permission_classes = [AllowAny]  # Por ahora para desarrollo
    
    def get_queryset(self):
        """
        Filtra solo glosas que requieren conciliación
        """
        queryset = super().get_queryset()
        
        # Solo glosas con respuestas que requieren conciliación
        queryset = queryset.filter(
            Q(estado='EN_CONCILIACION') |
            Q(estadisticas__requiere_conciliacion=True)
        )
        
        # Aplicar filtros de búsqueda
        numero_radicacion = self.request.query_params.get('numero_radicacion', None)
        if numero_radicacion:
            queryset = queryset.filter(numero_radicacion__icontains=numero_radicacion)
        
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        prestador = self.request.query_params.get('prestador', None)
        if prestador:
            queryset = queryset.filter(prestador_info__razon_social__icontains=prestador)
        
        fecha_desde = self.request.query_params.get('fecha_desde', None)
        if fecha_desde:
            queryset = queryset.filter(fecha_aplicacion__gte=fecha_desde)
        
        return queryset.order_by('-fecha_aplicacion')
    
    @action(detail=False, methods=['get'])
    def casos_agrupados(self, request):
        """
        Agrupa las glosas por radicación para mostrar casos de conciliación
        """
        # Obtener glosas que requieren conciliación
        glosas = self.get_queryset()
        
        # Agrupar por radicación
        casos = {}
        for glosa in glosas:
            rad_id = glosa.numero_radicacion
            if rad_id not in casos:
                casos[rad_id] = {
                    'id': str(glosa.id),
                    'radicacion_id': glosa.radicacion_id,
                    'numero_radicacion': glosa.numero_radicacion,
                    'numero_factura': glosa.numero_factura,
                    'prestador_info': glosa.prestador_info,
                    'total_glosas': 0,
                    'valor_disputa': 0,
                    'fecha_glosa': glosa.fecha_aplicacion,
                    'estado': glosa.estado,
                    'glosas': []
                }
            
            casos[rad_id]['total_glosas'] += 1
            
            # Calcular valor en disputa (valor rechazado por el prestador)
            valor_rechazado = 0
            if glosa.estadisticas:
                valor_rechazado = glosa.estadisticas.get('valor_total_rechazado', 0)
            
            casos[rad_id]['valor_disputa'] += valor_rechazado
            casos[rad_id]['glosas'].append({
                'id': str(glosa.id),
                'codigo_glosa': glosa.codigo_glosa,
                'descripcion': glosa.descripcion_glosa,
                'valor_glosado': float(glosa.valor_glosado),
                'valor_aceptado': glosa.estadisticas.get('valor_total_aceptado', 0) if glosa.estadisticas else 0,
                'valor_rechazado': valor_rechazado
            })
        
        # Convertir a lista
        casos_lista = list(casos.values())
        
        # Simular conciliadores (temporal)
        conciliadores = [
            {'id': 1, 'nombre': 'Dr. Patricia Ruiz', 'avatar': '4.jpg'},
            {'id': 2, 'nombre': 'Dra. Carmen López', 'avatar': '5.jpg'},
            {'id': 3, 'nombre': 'Dr. Miguel Torres', 'avatar': '6.jpg'},
        ]
        
        # Asignar conciliador aleatorio
        import random
        for caso in casos_lista:
            caso['conciliador'] = random.choice(conciliadores)
        
        return Response({
            'count': len(casos_lista),
            'results': casos_lista
        })
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Retorna estadísticas para el dashboard de conciliación
        """
        glosas = self.get_queryset()
        
        # Calcular estadísticas
        casos_pendientes = glosas.filter(estado='EN_CONCILIACION').values('numero_radicacion').distinct().count()
        
        # Conciliadas exitosamente este mes
        inicio_mes = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        conciliadas_mes = glosas.filter(
            estado='ACEPTADA',
            fecha_ultima_actualizacion__gte=inicio_mes
        ).values('numero_radicacion').distinct().count()
        
        # Valor total en conciliación
        valor_conciliacion = glosas.filter(estado='EN_CONCILIACION').aggregate(
            total=Sum('estadisticas__valor_total_rechazado')
        )['total'] or 0
        
        # Reuniones programadas (simulado)
        reuniones = 3
        
        return Response({
            'casos_pendientes': casos_pendientes,
            'conciliadas_exitosamente': conciliadas_mes,
            'valor_en_conciliacion': valor_conciliacion,
            'reuniones_programadas': reuniones,
            'tasa_exito': 85,  # Simulado
            'promedio_dias': 12  # Simulado
        })
    
    @action(detail=True, methods=['post'])
    def agendar_reunion(self, request, pk=None):
        """
        Agenda una reunión de conciliación
        """
        glosa = self.get_object()
        
        # Aquí se implementaría la lógica para agendar reunión
        # Por ahora solo retornamos success
        
        return Response({
            'success': True,
            'message': 'Reunión agendada exitosamente',
            'fecha_reunion': (timezone.now() + timedelta(days=3)).isoformat()
        })
    
    @action(detail=False, methods=['get'])
    def proximas_reuniones(self, request):
        """
        Retorna las próximas reuniones de conciliación
        """
        # Simulación de reuniones próximas
        reuniones = [
            {
                'id': 'CON-2025-0011',
                'radicacion': 'RAD-2025-001234',
                'prestador': 'CLÍNICA ESPECIALIZADA',
                'eps': 'EPS FAMILIAR',
                'valor': 4250000,
                'modalidad': 'Presencial',
                'fecha': (timezone.now() + timedelta(days=1, hours=2)).isoformat(),
                'estado': 'PROGRAMADA'
            },
            {
                'id': 'CON-2025-0013',
                'radicacion': 'RAD-2025-001235',
                'prestador': 'HOSPITAL GENERAL',
                'eps': 'EPS FAMILIAR',
                'valor': 7800000,
                'modalidad': 'Virtual',
                'fecha': (timezone.now() + timedelta(days=3, hours=6)).isoformat(),
                'estado': 'PROGRAMADA'
            },
            {
                'id': 'CON-2025-0014',
                'radicacion': 'RAD-2025-001236',
                'prestador': 'CENTRO MÉDICO',
                'eps': 'EPS FAMILIAR',
                'valor': 2150000,
                'modalidad': 'Telefónica',
                'fecha': (timezone.now() + timedelta(days=4, hours=1)).isoformat(),
                'estado': 'PROGRAMADA'
            }
        ]
        
        return Response({
            'count': len(reuniones),
            'results': reuniones
        })