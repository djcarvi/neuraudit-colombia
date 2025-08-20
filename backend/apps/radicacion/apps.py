from django.apps import AppConfig


class RadicacionConfig(AppConfig):
    default_auto_field = 'django_mongodb_backend.fields.ObjectIdAutoField'
    name = 'apps.radicacion'
    verbose_name = 'Radicación de Cuentas Médicas'