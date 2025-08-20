from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets_facturas import FacturaRadicadaViewSet, ServicioFacturadoViewSet

router = DefaultRouter()
router.register(r'facturas', FacturaRadicadaViewSet, basename='factura')
router.register(r'servicios', ServicioFacturadoViewSet, basename='servicio')

urlpatterns = [
    path('', include(router.urls)),
]