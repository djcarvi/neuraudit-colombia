from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django_mongodb_backend.fields.ObjectIdAutoField'
    name = 'apps.authentication'
    verbose_name = 'Authentication NeurAudit'