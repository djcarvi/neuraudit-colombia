import os
import sys
sys.path.insert(0, '/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.radicacion.storage_service import StorageService

# Test simple de almacenamiento
storage = StorageService(nit_prestador='123456789-0')

# Crear un archivo de prueba
from django.core.files.base import ContentFile
test_file = ContentFile(b"<xml>test</xml>", name="test.xml")

# Probar validar_y_almacenar_archivo
resultado = storage.validar_y_almacenar_archivo(test_file, 'xml')

print("=== RESULTADO DE validar_y_almacenar_archivo ===")
print(f"Claves en resultado: {list(resultado.keys())}")
print(f"¿Tiene 'url'? {'url' in resultado}")
print(f"¿Tiene 'url_almacenamiento'? {'url_almacenamiento' in resultado}")
print(f"Valor de 'url': {resultado.get('url', 'NO EXISTE')}")
print(f"Valor de 'url_almacenamiento': {resultado.get('url_almacenamiento', 'NO EXISTE')}")