"""
URLs para el módulo de conciliación
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets_conciliacion import ConciliacionViewSet

router = DefaultRouter()
router.register(r'conciliacion', ConciliacionViewSet, basename='conciliacion')

urlpatterns = [
    path('', include(router.urls)),
]