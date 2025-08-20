from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CasoConciliacionViewSet

# Router para ViewSet NoSQL
router = DefaultRouter()
router.register(r'casos', CasoConciliacionViewSet, basename='caso-conciliacion')

urlpatterns = [
    path('', include(router.urls)),
]

# URLs disponibles para pruebas:
# GET /api/conciliacion/casos/ - Listar casos
# GET /api/conciliacion/casos/{id}/ - Detalle caso específico
# GET /api/conciliacion/casos/obtener_o_crear_caso/?numero_radicacion=XXX - Crear automático
# GET /api/conciliacion/casos/estadisticas/ - Estadísticas agregadas
# GET /api/conciliacion/casos/dashboard_data/ - Datos para dashboard
# GET /api/conciliacion/casos/{id}/detalle_glosas/ - Detalle de glosas embebidas
# GET /api/conciliacion/casos/{id}/trazabilidad/ - Historial completo
# POST /api/conciliacion/casos/{id}/responder_glosa/ - Respuesta del prestador
# POST /api/conciliacion/casos/{id}/procesar_decision/ - Ratificar/levantar glosa
# POST /api/conciliacion/casos/{id}/generar_acta/ - Generar acta final