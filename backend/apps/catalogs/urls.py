# -*- coding: utf-8 -*-
# apps/catalogs/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'cups', views.CatalogoCUPSOficialViewSet, basename='cups')
router.register(r'cum', views.CatalogoCUMOficialViewSet, basename='cum')
router.register(r'ium', views.CatalogoIUMOficialViewSet, basename='ium')
router.register(r'dispositivos', views.CatalogoDispositivosOficialViewSet, basename='dispositivos')
router.register(r'bdua', views.BDUAAfiliadosViewSet, basename='bdua')
router.register(r'prestadores', views.PrestadoresViewSet, basename='prestadores')
router.register(r'contratos', views.ContratosViewSet, basename='contratos')
router.register(r'validation', views.ValidationEngineViewSet, basename='validation')

app_name = 'catalogs'

urlpatterns = [
    path('api/catalogs/', include(router.urls)),
]
