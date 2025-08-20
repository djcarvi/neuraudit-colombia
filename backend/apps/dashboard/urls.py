# URLs del módulo dashboard - NeurAudit Colombia
from django.urls import path
from .views import dashboard_general

urlpatterns = [
    path('general/', dashboard_general, name='dashboard-general'),
]
