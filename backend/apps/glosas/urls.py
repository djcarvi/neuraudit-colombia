# -*- coding: utf-8 -*-
"""
URLs para el sistema de glosas según Resolución 2284
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GlosaViewSet, RespuestaGlosaViewSet, RatificacionGlosaViewSet

# Router para las APIs REST
router = DefaultRouter()
router.register(r'glosas', GlosaViewSet, basename='glosas')
router.register(r'respuestas', RespuestaGlosaViewSet, basename='respuestas-glosas')
router.register(r'ratificaciones', RatificacionGlosaViewSet, basename='ratificaciones-glosas')

urlpatterns = [
    path('api/glosas/', include(router.urls)),
]
