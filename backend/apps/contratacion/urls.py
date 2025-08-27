# -*- coding: utf-8 -*-
# apps/contratacion/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views_importacion import ImportacionTarifariosViewSet
from .views_mongodb_cups import (
    ServiciosCUPSContractualesAPIView,
    ValidacionTarifaCUPSAPIView,
    EstadisticasContratoAPIView,
    ImportarServiciosCUPSAPIView,
    ExportarTarifarioAPIView
)

router = DefaultRouter()
router.register(r'tarifarios-cups', views.TarifariosCUPSViewSet, basename='tarifarios-cups')
router.register(r'tarifarios-medicamentos', views.TarifariosMedicamentosViewSet, basename='tarifarios-medicamentos')
router.register(r'tarifarios-dispositivos', views.TarifariosDispositivosViewSet, basename='tarifarios-dispositivos')
router.register(r'prestadores', views.PrestadorViewSet, basename='prestadores')
router.register(r'modalidades-pago', views.ModalidadPagoViewSet, basename='modalidades-pago')
router.register(r'contratos', views.ContratoViewSet, basename='contratos')
router.register(r'catalogo-cups', views.CatalogoCUPSViewSet, basename='catalogo-cups')
router.register(r'catalogo-cum', views.CatalogoCUMViewSet, basename='catalogo-cum')
router.register(r'importacion', ImportacionTarifariosViewSet, basename='importacion-tarifarios')

app_name = 'contratacion'

urlpatterns = [
    path('', include(router.urls)),
    
    # NoSQL MongoDB endpoints para gestión de servicios CUPS
    path('mongodb/servicios-cups/', ServiciosCUPSContractualesAPIView.as_view(), name='mongodb-servicios-cups'),
    path('mongodb/validar-tarifa-cups/', ValidacionTarifaCUPSAPIView.as_view(), name='mongodb-validar-tarifa'),
    path('mongodb/estadisticas-contrato/<str:contrato_id>/', EstadisticasContratoAPIView.as_view(), name='mongodb-estadisticas'),
    path('mongodb/importar-servicios-cups/', ImportarServiciosCUPSAPIView.as_view(), name='mongodb-importar-cups'),
    path('mongodb/exportar-tarifario/<str:contrato_id>/', ExportarTarifarioAPIView.as_view(), name='mongodb-exportar-tarifario'),
]