from django.urls import path, include
from .urls_glosas import urlpatterns as glosas_urls
from .urls_facturas import urlpatterns as facturas_urls
from .urls_conciliacion import urlpatterns as conciliacion_urls

urlpatterns = [
    # Incluir URLs de facturas
    path('', include(facturas_urls)),
    # Incluir URLs de glosas
    path('', include(glosas_urls)),
    # Incluir URLs de conciliación
    path('', include(conciliacion_urls)),
]
