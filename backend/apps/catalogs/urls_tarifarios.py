# -*- coding: utf-8 -*-
# apps/catalogs/urls_tarifarios.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_tarifarios import TarifarioISS2001ViewSet, TarifarioSOAT2025ViewSet

# Router para ViewSets
router = DefaultRouter()
router.register(r'tarifarios-oficiales/iss', TarifarioISS2001ViewSet, basename='tarifario-iss')
router.register(r'tarifarios-oficiales/soat', TarifarioSOAT2025ViewSet, basename='tarifario-soat')

urlpatterns = [
    path('api/contratacion/', include(router.urls)),
]