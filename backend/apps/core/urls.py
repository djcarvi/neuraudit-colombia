# -*- coding: utf-8 -*-
# apps/core/urls.py

"""
URLs para Sistema de Asignación Automática
Endpoints REST para frontend React
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para ViewSets
router = DefaultRouter()

# Registrar ViewSets con rutas específicas
router.register(r'auditores', views.AuditorPerfilViewSet, basename='auditores')

app_name = 'core'

urlpatterns = [
    # Endpoints específicos de asignación (sin DRF router para tener control total)
    path('dashboard/estadisticas/', views.AsignacionViewSet.as_view({'get': 'estadisticas_dashboard'}), name='estadisticas-dashboard'),
    path('auditores/carga/', views.AsignacionViewSet.as_view({'get': 'carga_auditores'}), name='carga-auditores'),
    path('propuestas/generar/', views.AsignacionViewSet.as_view({'post': 'generar_propuesta'}), name='generar-propuesta'),
    path('propuestas/actual/', views.AsignacionViewSet.as_view({'get': 'propuesta_actual'}), name='propuesta-actual'),
    path('propuestas/<str:pk>/', views.AsignacionViewSet.as_view({'get': 'detalle_propuesta'}), name='detalle-propuesta'),
    path('propuestas/<str:pk>/procesar_decision/', views.AsignacionViewSet.as_view({'post': 'procesar_decision'}), name='procesar-decision'),
    path('propuestas/<str:pk>/trazabilidad/', views.AsignacionViewSet.as_view({'get': 'trazabilidad_propuesta'}), name='trazabilidad-propuesta'),
    path('kanban/', views.AsignacionViewSet.as_view({'get': 'asignaciones_kanban'}), name='asignaciones-kanban'),
    path('manual/', views.AsignacionViewSet.as_view({'post': 'asignacion_manual'}), name='asignacion-manual'),
    path('reportes/rendimiento/', views.AsignacionViewSet.as_view({'get': 'reporte_rendimiento'}), name='reporte-rendimiento'),
    path('obtener-propuesta-pendiente/', views.AsignacionViewSet.as_view({'get': 'obtener_propuesta_pendiente'}), name='obtener-propuesta-pendiente'),
    path('tendencias/', views.AsignacionViewSet.as_view({'get': 'tendencias'}), name='tendencias'),
    path('metricas-algoritmo/', views.AsignacionViewSet.as_view({'get': 'metricas_algoritmo'}), name='metricas-algoritmo'),
    
    # ViewSets del router para auditores
    path('', include(router.urls)),
]

# URLs adicionales si se necesitan endpoints personalizados
urlpatterns += [
    # Endpoints de salud del sistema
    # path('api/health/', views.health_check, name='health_check'),
    
    # Endpoints de configuración
    # path('api/config/', views.ConfigurationView.as_view(), name='configuration'),
]