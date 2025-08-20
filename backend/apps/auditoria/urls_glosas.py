from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets_glosas import GlosaAplicadaViewSet

router = DefaultRouter()
router.register(r'glosas', GlosaAplicadaViewSet, basename='glosa')

urlpatterns = [
    path('', include(router.urls)),
]