"""
Django settings for NeurAudit Colombia.

Sistema de Auditoría Médica para EPS Familiar de Colombia
Desarrollado por Analítica Neuronal
Cumplimiento: Resolución 2284 de 2023 - Ministerio de Salud y Protección Social
"""

from pathlib import Path
import os
from dotenv import load_dotenv
import django_mongodb_backend

# Load environment variables
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-neuraudit-colombia-dev-key-2025')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'neuraudit.epsfamiliar.com.co']

# Application definition
INSTALLED_APPS = [
    # Django apps that work with MongoDB
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    # 'django.contrib.staticfiles',  # No necesario para API pura
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_extensions',
    
    # NeurAudit Colombia apps
    'apps.authentication',     # Sistema de autenticación MongoDB (PSS + EPS)
    'apps.dashboard',          # Dashboard ejecutivo con KPIs monetarios
    'apps.radicacion',         # Radicación de cuentas médicas + RIPS + Soportes
    'apps.devoluciones',       # Sistema automático devoluciones según norma
    'apps.auditoria',          # Asignación automática y auditoría médica/administrativa
    'apps.glosas',             # Gestión glosas con codificación estándar Res. 2284
    'apps.conciliacion',       # Conciliación entre PSS y EPS
    'apps.pagos',              # Autorización y registro de pagos
    'apps.trazabilidad',       # Sistema trazabilidad transaccional
    'apps.alertas',            # Gestión alertas automáticas por plazos
    'apps.reportes',           # Reportes contables/financieros/analytics
    'apps.catalogs',           # Catálogos oficiales CUPS, CUM, IUM, Dispositivos, BDUA
    'apps.contratacion',       # Tarifarios contractuales y validaciones
]

# MongoDB-specific settings
MONGODB_FIELD_MAPPING = {
    'ObjectIdField': 'django_mongodb_backend.fields.ObjectIdField',
    'ArrayField': 'django_mongodb_backend.fields.ArrayField',
    'EmbeddedModelField': 'django_mongodb_backend.fields.EmbeddedModelField',
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'apps.authentication.security_middleware.NeurAuditSecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database - MongoDB for production using Django MongoDB Backend oficial
# IMPERATIVO: Solo MongoDB, NUNCA SQLite o SQL
from apps.core.mongodb_settings import MONGODB_DATABASE_CONFIG

DATABASES = MONGODB_DATABASE_CONFIG

# Variables de entorno MongoDB
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE', 'neuraudit_colombia_db')

# Configuración alternativa usando parse_uri oficial
# DATABASES = {
#     'default': django_mongodb_backend.parse_uri(
#         MONGODB_URI,
#         db_name=MONGODB_DATABASE
#     )
# }

# MongoDB Primary Key Field
DEFAULT_AUTO_FIELD = 'django_mongodb_backend.fields.ObjectIdAutoField'

# Custom User Model
AUTH_USER_MODEL = 'authentication.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'apps.authentication.robust_authentication.RobustNeurAuditAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FileUploadParser',
    ],
}

# JWT Configuration
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),  # 8 horas jornada laboral
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # 7 días para refresh
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': 'neuraudit-colombia',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(hours=8),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=7),
}

# CORS settings for frontend
# En desarrollo permitir cualquier localhost
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = [
        'https://neuraudit.epsfamiliar.com.co',
    ]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Cache configuration para sistema de seguridad
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'neuraudit-security-cache',
        'OPTIONS': {
            'MAX_ENTRIES': 10000,
        },
        'TIMEOUT': 300,  # 5 minutos por defecto
    }
}

# Internationalization
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Media files (uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Logging configuration para sistema de seguridad robusto
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'security': {
            'format': 'SECURITY {levelname} {asctime} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file_security': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'security.log',
            'formatter': 'security',
        },
        'file_audit': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'audit.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'apps.authentication': {
            'handlers': ['file_security', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'security': {
            'handlers': ['file_security'],
            'level': 'WARNING',
            'propagate': False,
        },
        'audit': {
            'handlers': ['file_audit'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Crear directorio de logs si no existe
import os
os.makedirs(BASE_DIR / 'logs', exist_ok=True)

# Digital Ocean Spaces Configuration (for document storage)
# IMPORTANTE: Este bucket es compartido con otros proyectos
# SOLO usar la carpeta neuraudit/
from .digital_ocean_config import (
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME,
    AWS_S3_ENDPOINT_URL, AWS_S3_REGION_NAME, AWS_DEFAULT_ACL,
    AWS_S3_OBJECT_PARAMETERS, AWS_QUERYSTRING_AUTH, AWS_QUERYSTRING_EXPIRE,
    STORAGES_CONFIG
)

# Configurar storage backend
DEFAULT_FILE_STORAGE = 'apps.radicacion.storage_config.RadicacionStorage'

# Configuración de STORAGES para Django 4.2+
STORAGES = STORAGES_CONFIG

# Celery Configuration (for async tasks and alerts)
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'America/Bogota'

# Email configuration for notifications
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'neuraudit@epsfamiliar.com.co')

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Session configuration
SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# CSRF configuration
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'

# File upload settings (según Resolución 2284)
FILE_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 1024  # 1GB máximo por transacción
DATA_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 1024   # 1GB máximo por request

# NeurAudit specific settings
NEURAUDIT_SETTINGS = {
    'RIPS_VALIDATION_URL': os.getenv('RIPS_VALIDATION_URL', 'http://localhost:8080/validate-rips'),
    'DIAN_VALIDATION_URL': os.getenv('DIAN_VALIDATION_URL'),
    'MAX_RADICACION_DAYS': 22,  # Días hábiles para radicación según norma
    'MAX_GLOSA_RESPONSE_DAYS': 5,  # Días hábiles para respuesta glosas
    'MAX_DEVOLUCION_DAYS': 5,  # Días hábiles para devoluciones
    'AUTO_ASSIGNMENT_ENABLED': True,  # Asignación automática equitativa
    'NOTIFICATION_ENABLED': True,  # Notificaciones automáticas
    'AUDIT_LOG_ENABLED': True,  # Auditoría detallada
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'neuraudit.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'neuraudit': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'apps.auditoria': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'apps.radicacion': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# Create logs directory if it doesn't exist
LOGS_DIR = BASE_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)

# Import Digital Ocean Spaces configuration
from .digital_ocean_config import *

# Add DO_SPACES variables for backwards compatibility
DO_SPACES_ACCESS_KEY = AWS_ACCESS_KEY_ID
DO_SPACES_SECRET_KEY = AWS_SECRET_ACCESS_KEY
DO_SPACES_ENDPOINT_URL = AWS_S3_ENDPOINT_URL
DO_SPACES_REGION = AWS_S3_REGION_NAME
DO_SPACES_BUCKET_NAME = AWS_STORAGE_BUCKET_NAME