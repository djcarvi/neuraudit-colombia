"""
URLs para Autenticación - NeurAudit Colombia
Sistema JWT para PSS/PTS + EPS según Resolución 2284 de 2023
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'authentication'

urlpatterns = [
    # Autenticación JWT
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('refresh/', views.refresh_token_view, name='refresh_token'),
    path('validate/', views.validate_token_view, name='validate_token'),
    
    # Perfil de usuario
    path('profile/', views.user_profile_view, name='user_profile'),
    path('change-password/', views.change_password_view, name='change_password'),
]