"""
Configuración de Digital Ocean Spaces para NeurAudit Colombia
IMPORTANTE: Este bucket contiene múltiples proyectos en producción
SOLO usar la carpeta neuraudit/

⚠️ ADVERTENCIA CRÍTICA: 
- NUNCA escribir fuera de la carpeta neuraudit/
- NUNCA eliminar archivos fuera de neuraudit/
- NUNCA listar contenido fuera de neuraudit/

Autor: Analítica Neuronal
Fecha: 21 Agosto 2025
"""

import os
from django.conf import settings

# Configuración de Digital Ocean Spaces
DO_SPACES_CONFIG = {
    'ACCESS_KEY_ID': os.getenv('DO_SPACES_ACCESS_KEY_ID', 'DO00ZQP9KAQLRG7UXNZH'),
    'SECRET_ACCESS_KEY': os.getenv('DO_SPACES_SECRET_ACCESS_KEY', 'Txlct66j8M1vRxDLlsh5xCF2wgsumi3a7LtxS8EWQPM'),
    'BUCKET_NAME': os.getenv('DO_SPACES_BUCKET_NAME', 'neuralytic'),
    'ENDPOINT_URL': os.getenv('DO_SPACES_ENDPOINT_URL', 'https://neuralytic.nyc3.digitaloceanspaces.com'),
    'REGION': os.getenv('DO_SPACES_REGION', 'nyc3'),
    
    # Configuración de seguridad crítica
    'BASE_LOCATION': 'neuraudit',  # NUNCA cambiar esto
    'ALLOWED_PREFIXES': ['neuraudit/'],  # Solo permitir escritura en estas rutas
    'FORBIDDEN_PREFIXES': [  # Nunca tocar estas carpetas
        'medispensa/',
        'production/',
        'otros_proyectos/',
        # Agregar aquí otras carpetas de producción si es necesario
    ]
}

def validate_path_safety(path: str) -> bool:
    """
    Valida que un path sea seguro para usar en el bucket compartido
    
    Args:
        path: Ruta a validar
        
    Returns:
        True si el path es seguro (dentro de neuraudit/)
        
    Raises:
        ValueError si el path intenta salir de neuraudit/
    """
    # Normalizar path
    path = path.strip('/')
    
    # Verificar que empiece con neuraudit/
    if not path.startswith('neuraudit/'):
        raise ValueError(
            f"SEGURIDAD: Intento de escribir fuera de neuraudit/: {path}"
        )
    
    # Verificar que no intente salir con ../
    if '..' in path:
        raise ValueError(
            f"SEGURIDAD: Path contiene navegación no permitida (..): {path}"
        )
    
    # Verificar contra prefijos prohibidos
    for forbidden in DO_SPACES_CONFIG['FORBIDDEN_PREFIXES']:
        if path.startswith(forbidden):
            raise ValueError(
                f"SEGURIDAD: Intento de acceder a carpeta prohibida {forbidden}: {path}"
            )
    
    return True


# Configuración para Django settings
STORAGES_CONFIG = {
    'default': {
        'BACKEND': 'apps.radicacion.storage_config.RadicacionStorage',
    },
    'radicacion': {
        'BACKEND': 'apps.radicacion.storage_config.RadicacionStorage',
    },
    'glosas': {
        'BACKEND': 'apps.radicacion.storage_config.GlosasStorage',
    },
    'conciliacion': {
        'BACKEND': 'apps.radicacion.storage_config.ConciliacionStorage',
    }
}

# Variables de entorno para boto3
AWS_ACCESS_KEY_ID = DO_SPACES_CONFIG['ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = DO_SPACES_CONFIG['SECRET_ACCESS_KEY']
AWS_STORAGE_BUCKET_NAME = DO_SPACES_CONFIG['BUCKET_NAME']
AWS_S3_ENDPOINT_URL = DO_SPACES_CONFIG['ENDPOINT_URL']
AWS_S3_REGION_NAME = DO_SPACES_CONFIG['REGION']
AWS_DEFAULT_ACL = 'private'
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_QUERYSTRING_AUTH = True
AWS_QUERYSTRING_EXPIRE = 3600  # URLs firmadas válidas por 1 hora