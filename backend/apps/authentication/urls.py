"""
URLs para Autenticación - NeurAudit Colombia
Sistema NoSQL puro con alta seguridad
"""

from django.urls import path
from . import views_nosql

app_name = 'authentication'

urlpatterns = [
    # Autenticación principal
    path('login/', views_nosql.login_view, name='login'),
    path('google-login/', views_nosql.google_login_view, name='google_login'),
    path('logout/', views_nosql.logout_view, name='logout'),
    path('refresh/', views_nosql.refresh_token_view, name='refresh_token'),
    path('validate/', views_nosql.validate_token_view, name='validate_token'),
    
    # Gestión de perfil
    path('perfil/', views_nosql.perfil_usuario_view, name='perfil'),
    path('perfil/actualizar/', views_nosql.actualizar_perfil_view, name='actualizar_perfil'),
    path('cambiar-password/', views_nosql.cambiar_password_view, name='cambiar_password'),
    
    # Sesiones
    path('sesiones/', views_nosql.sesiones_activas_view, name='sesiones_activas'),
    path('sesiones/cerrar-todas/', views_nosql.cerrar_todas_sesiones_view, name='cerrar_todas_sesiones'),
    
    # Información del sistema
    path('perfiles/', views_nosql.perfiles_disponibles_view, name='perfiles_disponibles'),
    
    # Solo desarrollo
    path('crear-usuarios-prueba/', views_nosql.crear_usuarios_prueba_view, name='crear_usuarios_prueba'),
]