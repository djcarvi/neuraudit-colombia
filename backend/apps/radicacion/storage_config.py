"""
Configuración de Digital Ocean Spaces para NeurAudit Colombia
Compatible con S3 API

Digital Ocean Spaces es un servicio de almacenamiento de objetos compatible con S3
que permite almacenar archivos de forma segura y escalable.

Requisitos:
1. pip install boto3 django-storages
2. Crear un Space en Digital Ocean
3. Generar Access Keys en el panel de Digital Ocean
4. Configurar las variables de entorno

Variables de entorno necesarias:
- DO_SPACES_ENDPOINT_URL: https://nyc3.digitaloceanspaces.com (o tu región)
- DO_SPACES_ACCESS_KEY_ID: Tu access key de Digital Ocean
- DO_SPACES_SECRET_ACCESS_KEY: Tu secret key de Digital Ocean
- DO_SPACES_BUCKET_NAME: Nombre de tu Space (ej: neuraudit-colombia)
- DO_SPACES_REGION: Región del Space (ej: nyc3)

Autor: Analítica Neuronal
Fecha: 21 Agosto 2025
"""

import os
import logging
from storages.backends.s3boto3 import S3Boto3Storage
from django.core.exceptions import SuspiciousOperation

logger = logging.getLogger(__name__)


class DigitalOceanSpacesStorage(S3Boto3Storage):
    """Storage backend para Digital Ocean Spaces"""
    
    # Configuración básica - Usar credenciales específicas
    access_key = os.getenv('DO_SPACES_ACCESS_KEY_ID', 'DO00ZQP9KAQLRG7UXNZH')
    secret_key = os.getenv('DO_SPACES_SECRET_ACCESS_KEY', 'Txlct66j8M1vRxDLlsh5xCF2wgsumi3a7LtxS8EWQPM')
    bucket_name = os.getenv('DO_SPACES_BUCKET_NAME', 'neuralytic')  # Bucket compartido
    endpoint_url = os.getenv('DO_SPACES_ENDPOINT_URL', 'https://nyc3.digitaloceanspaces.com')
    region_name = os.getenv('DO_SPACES_REGION', 'nyc3')
    
    # Configuración adicional
    object_parameters = {'CacheControl': 'max-age=86400'}  # Cache 1 día
    file_overwrite = False  # No sobrescribir archivos existentes
    default_acl = 'private'  # Archivos privados por defecto
    
    # Organización de archivos por carpetas
    location = 'neuraudit'  # CRÍTICO: Carpeta base SIEMPRE debe ser neuraudit
    
    # Configuración de seguridad
    secure_urls = True  # Usar HTTPS
    signature_version = 's3v4'  # Versión de firma más reciente
    
    # URLs firmadas (para archivos privados)
    querystring_auth = True  # Generar URLs firmadas
    querystring_expire = 3600  # URLs válidas por 1 hora
    
    # Configuración de almacenamiento
    max_memory_size = 5 * 1024 * 1024  # 5MB en memoria antes de usar archivo temporal
    
    def get_object_parameters(self, name):
        """
        Personalizar parámetros por tipo de archivo
        """
        params = super().get_object_parameters(name)
        
        # Configurar Content-Type según extensión
        if name.endswith('.pdf'):
            params['ContentType'] = 'application/pdf'
        elif name.endswith('.xml'):
            params['ContentType'] = 'application/xml'
        elif name.endswith('.json'):
            params['ContentType'] = 'application/json'
            
        return params
    
    def _validate_safe_path(self, name):
        """
        CRÍTICO: Validar que el path esté dentro de neuraudit/
        """
        # Construir path completo
        if self.location:
            full_path = f"{self.location}/{name}".strip('/')
        else:
            full_path = name.strip('/')
        
        # Verificar que empiece con neuraudit/
        if not full_path.startswith('neuraudit/'):
            logger.error(f"SEGURIDAD: Intento de escribir fuera de neuraudit/: {full_path}")
            raise SuspiciousOperation(
                f"Intento de acceder fuera de la carpeta neuraudit: {full_path}"
            )
        
        # Verificar que no intente salir con ../
        if '..' in full_path:
            logger.error(f"SEGURIDAD: Path contiene navegación no permitida: {full_path}")
            raise SuspiciousOperation(
                f"Path contiene navegación no permitida (..): {full_path}"
            )
        
        # Log para auditoría
        logger.info(f"Path validado correctamente: {full_path}")
        return True
    
    def save(self, name, content, max_length=None):
        """
        Guardar archivo con validación de seguridad
        """
        self._validate_safe_path(name)
        return super().save(name, content, max_length)
    
    def delete(self, name):
        """
        Eliminar archivo con validación de seguridad
        """
        self._validate_safe_path(name)
        return super().delete(name)
    
    def exists(self, name):
        """
        Verificar existencia con validación de seguridad
        """
        self._validate_safe_path(name)
        return super().exists(name)


class RadicacionStorage(DigitalOceanSpacesStorage):
    """Storage específico para archivos de radicación"""
    location = 'neuraudit/radicaciones'  # IMPORTANTE: Solo usar carpeta neuraudit
    
    def get_available_name(self, name, max_length=None):
        """
        Organizar archivos por fecha y tipo
        Estructura: radicaciones/2025/08/21/NIT/tipo/archivo.pdf
        """
        from datetime import datetime
        import os
        
        # Obtener fecha actual
        now = datetime.now()
        year = now.strftime('%Y')
        month = now.strftime('%m')
        day = now.strftime('%d')
        
        # Extraer información del nombre del archivo si sigue nomenclatura
        parts = name.split('/')
        filename = parts[-1]
        
        # Detectar NIT del contexto si es posible
        nit = 'sin_nit'
        if hasattr(self, '_current_nit'):
            nit = self._current_nit.replace('-', '')
        
        # Detectar tipo de archivo
        tipo = 'otros'
        if filename.startswith('XML_'):
            tipo = 'facturas'
        elif filename.startswith('RIPS_'):
            tipo = 'rips'
        elif any(filename.startswith(code + '_') for code in 
                 ['HEV', 'EPI', 'HAU', 'PDX', 'DQX', 'RAN', 'HAM', 'TAP', 'OPF']):
            tipo = 'soportes'
        
        # Construir nueva ruta - NO incluir neuraudit/ aquí porque ya está en location
        new_path = f"{year}/{month}/{day}/{nit}/{tipo}/{filename}"
        
        return super().get_available_name(new_path, max_length)


class GlosasStorage(DigitalOceanSpacesStorage):
    """Storage específico para documentos de glosas"""
    location = 'neuraudit/glosas'  # IMPORTANTE: Solo usar carpeta neuraudit


class ConciliacionStorage(DigitalOceanSpacesStorage):
    """Storage específico para documentos de conciliación"""
    location = 'neuraudit/conciliacion'  # IMPORTANTE: Solo usar carpeta neuraudit


# Configuración para usar en settings.py
STORAGE_SETTINGS = {
    'DEFAULT_FILE_STORAGE': 'apps.radicacion.storage_config.RadicacionStorage',
    'RADICACION_STORAGE': 'apps.radicacion.storage_config.RadicacionStorage',
    'GLOSAS_STORAGE': 'apps.radicacion.storage_config.GlosasStorage',
    'CONCILIACION_STORAGE': 'apps.radicacion.storage_config.ConciliacionStorage',
}


# Validar configuración
def validate_storage_config():
    """
    Valida que todas las variables de entorno necesarias estén configuradas
    """
    required_vars = [
        'DO_SPACES_ACCESS_KEY_ID',
        'DO_SPACES_SECRET_ACCESS_KEY',
        'DO_SPACES_BUCKET_NAME',
        'DO_SPACES_ENDPOINT_URL',
    ]
    
    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        raise ValueError(
            f"Faltan variables de entorno para Digital Ocean Spaces: {', '.join(missing)}"
        )
    
    return True