# -*- coding: utf-8 -*-
# apps/core/apps.py

"""
Configuración de la app core para Sistema de Asignación Automática
"""

from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django_mongodb_backend.models.ObjectIdAutoField'
    name = 'apps.core'
    verbose_name = 'Sistema de Asignación Automática'
    
    def ready(self):
        """Inicialización cuando la app esté lista"""
        # Importar signals si los hay
        # import apps.core.signals
        pass