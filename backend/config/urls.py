"""
URL configuration for NeurAudit Colombia.

Sistema de Auditoría Médica para EPS Familiar de Colombia
Desarrollado por Analítica Neuronal
Cumplimiento: Resolución 2284 de 2023 - Ministerio de Salud y Protección Social
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # API endpoints
    path('api/auth/', include('apps.authentication.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
    path('api/radicacion/', include('apps.radicacion.urls')),
    path('api/devoluciones/', include('apps.devoluciones.urls')),
    path('api/auditoria/', include('apps.auditoria.urls')),
    path('api/glosas/', include('apps.glosas.urls')),
    path('api/conciliacion/', include('apps.conciliacion.urls')),
    path('api/pagos/', include('apps.pagos.urls')),
    path('api/trazabilidad/', include('apps.trazabilidad.urls')),
    path('api/alertas/', include('apps.alertas.urls')),
    path('api/reportes/', include('apps.reportes.urls')),
    path('api/catalogs/', include('apps.catalogs.urls')),
    path('api/contratacion/', include('apps.contratacion.urls')),
    path('api/asignacion/', include('apps.core.urls')),
    path('', include('apps.catalogs.urls_tarifarios')),  # Tarifarios oficiales transversales
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
