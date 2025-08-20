# -*- coding: utf-8 -*-
# apps/core/mongodb_settings.py

"""
Configuración MongoDB con Django MongoDB Backend Oficial
NeurAudit Colombia - Siguiendo documentación oficial
"""

import django_mongodb_backend
from django.conf import settings
import os

# Configuración de conexión MongoDB según documentación oficial
MONGODB_URI = getattr(settings, 'MONGODB_URI', 'mongodb://localhost:27017/')
MONGODB_DATABASE = getattr(settings, 'MONGODB_DATABASE', 'neuraudit_colombia_db')

# Función oficial parse_uri para configuración automática
def get_mongodb_config():
    """
    Configuración MongoDB usando parse_uri oficial del Django MongoDB Backend
    """
    return django_mongodb_backend.parse_uri(
        MONGODB_URI,
        db_name=MONGODB_DATABASE,
        test={
            'NAME': 'test_neuraudit_colombia_db',
        }
    )

# Configuración de DATABASES para settings.py
MONGODB_DATABASE_CONFIG = {
    "default": {
        "ENGINE": "django_mongodb_backend",
        "HOST": MONGODB_URI,
        "NAME": MONGODB_DATABASE,
        "OPTIONS": {
            "retryWrites": True,
            "w": "majority",
            "maxPoolSize": 50,
            "minPoolSize": 10,
            "maxIdleTimeMS": 30000,
            "serverSelectionTimeoutMS": 5000,
            "connectTimeoutMS": 10000,
            "socketTimeoutMS": 20000,
        },
    }
}