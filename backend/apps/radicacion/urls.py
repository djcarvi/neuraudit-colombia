# -*- coding: utf-8 -*-
# apps/radicacion/urls.py

"""
URLs para APIs de radicación y RIPS - NeurAudit Colombia
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RadicacionCuentaMedicaViewSet, DocumentoSoporteViewSet
from .views_rips import RIPSTransaccionViewSet

# Router para ViewSets
router = DefaultRouter()
router.register(r'', RadicacionCuentaMedicaViewSet, basename='radicacion')
router.register(r'documentos', DocumentoSoporteViewSet, basename='documentos')
router.register(r'rips/transacciones', RIPSTransaccionViewSet, basename='rips-transacciones')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]

"""
Endpoints generados:

RADICACIÓN DE CUENTAS:
- GET    /api/radicacion/cuentas/                     # Listar radicaciones
- POST   /api/radicacion/cuentas/                     # Crear radicación (borrador)
- GET    /api/radicacion/cuentas/{id}/                # Detalle radicación
- PUT    /api/radicacion/cuentas/{id}/                # Actualizar radicación
- PATCH  /api/radicacion/cuentas/{id}/                # Actualizar parcial
- DELETE /api/radicacion/cuentas/{id}/                # Eliminar radicación (borrador)

ACCIONES ESPECIALES:
- POST   /api/radicacion/cuentas/{id}/upload_document/    # Subir documento
- POST   /api/radicacion/cuentas/{id}/radicate/           # Ejecutar radicación
- GET    /api/radicacion/cuentas/{id}/documents/          # Listar documentos
- GET    /api/radicacion/cuentas/{id}/validation_summary/ # Resumen validaciones
- GET    /api/radicacion/cuentas/dashboard_stats/         # Estadísticas dashboard

DOCUMENTOS SOPORTE:
- GET    /api/radicacion/documentos/                      # Listar documentos
- GET    /api/radicacion/documentos/{id}/                 # Detalle documento
- GET    /api/radicacion/documentos/{id}/validation_detail/ # Detalle validación

VALIDACIONES RIPS:
- GET    /api/radicacion/validaciones-rips/              # Listar validaciones
- GET    /api/radicacion/validaciones-rips/{id}/         # Detalle validación
- POST   /api/radicacion/validaciones-rips/{id}/revalidate/ # Revalidar RIPS

FILTROS DISPONIBLES:
- ?estado=BORRADOR,RADICADA,EN_AUDITORIA,etc
- ?modalidad_pago=EVENTO,CAPITACION,etc
- ?tipo_servicio=AMBULATORIO,URGENCIAS,etc
- ?pss_nit=123456789
- ?fecha_desde=2025-01-01
- ?fecha_hasta=2025-12-31
- ?search=texto_busqueda

PERMISOS:
- PSS/RADICADOR: CRUD de sus propias radicaciones, upload documentos, radicar
- EPS/AUDITOR: Solo lectura, asignación posterior en auditoría
- EPS/COORDINADOR: Lectura completa, estadísticas
- ADMIN: Acceso completo
"""