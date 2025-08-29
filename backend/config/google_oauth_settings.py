# -*- coding: utf-8 -*-
"""
Configuración de Google OAuth para NeurAudit Colombia
"""

import os
from django.conf import settings

# Configuración de Google OAuth
GOOGLE_OAUTH_CONFIG = {
    # Cliente ID de Google (debe ser configurado en Google Cloud Console)
    'CLIENT_ID': os.environ.get('GOOGLE_OAUTH_CLIENT_ID', '752507273440-pfjhqtppisu39krpbdqpr2eb2sh0ps49.apps.googleusercontent.com'),
    
    # Cliente Secret (NO DEBE estar en el código, usar variables de entorno)
    'CLIENT_SECRET': os.environ.get('GOOGLE_OAUTH_CLIENT_SECRET', ''),
    
    # URLs de redirección autorizadas
    'REDIRECT_URIS': [
        'http://localhost:3000/auth/google/callback',
        'http://localhost:8003/api/auth/google/callback',
    ],
    
    # Scopes requeridos
    'SCOPES': [
        'openid',
        'email',
        'profile'
    ],
    
    # Configuración adicional
    'ALLOWED_DOMAINS': [
        'epsfamiliar.com.co',  # Dominio corporativo de EPS Familiar
        'analiticaneuronal.com',  # Dominio del desarrollador
    ],
    
    # Permitir cualquier dominio en desarrollo
    'ALLOW_ANY_DOMAIN': settings.DEBUG,
    
    # Rol por defecto para usuarios de Google
    'DEFAULT_ROLE': 'AUDITOR_MEDICO',
    
    # Tipo de usuario por defecto
    'DEFAULT_USER_TYPE': 'EPS',
}

# Validación de configuración
def validate_google_config():
    """Valida que la configuración de Google OAuth esté completa"""
    if not GOOGLE_OAUTH_CONFIG['CLIENT_ID']:
        raise ValueError('GOOGLE_OAUTH_CLIENT_ID no está configurado')
    
    return True