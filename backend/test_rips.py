# test_rips.py
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuraudit.settings')
django.setup()

from apps.authentication.models import User
from apps.radicacion.storage_service import StorageService
from apps.radicacion.models_rips import RIPSTransaccion, RIPSUsuario, RIPSConsulta
import json

# Ver usuarios disponibles
print("=== USUARIOS PSS DISPONIBLES ===")
pss_users = User.objects.filter(is_pss_user=True)[:3]
for user in pss_users:
    print(f"- PSS User: {user.username} - NIT: {getattr(user, 'nit', 'N/A')}")

# Verificar si el NIT 901019681 existe
print("\n=== BUSCANDO USUARIO CON NIT 901019681 ===")
user_901019681 = User.objects.filter(nit='901019681').first()
if user_901019681:
    print(f"✓ Usuario encontrado: {user_901019681.username}")
else:
    print("✗ No se encontró usuario con NIT 901019681")

# Verificar datos en el RIPS
print("\n=== ANALIZANDO ARCHIVO RIPS ===")
rips_path = '/home/adrian_carvajal/Analí®/neuraudit_react/context/prueba_radicar/A01E5687.json'
with open(rips_path, 'r') as f:
    rips_data = json.load(f)

print(f"- NIT en RIPS: {rips_data.get('numDocumentoIdObligado', 'N/A')}")
print(f"- Número Factura: {rips_data.get('numFactura', 'N/A')}")
print(f"- Usuarios en RIPS: {len(rips_data.get('usuarios', []))}")

# Verificar transacciones RIPS existentes
print("\n=== TRANSACCIONES RIPS EXISTENTES ===")
transacciones = RIPSTransaccion.objects.all()[:5]
for trans in transacciones:
    print(f"- Factura: {trans.num_factura} - NIT: {trans.num_documento_id_obligado} - Estado: {trans.estado_procesamiento}")

# Probar validación del RIPS
print("\n=== PROBANDO VALIDACIÓN RIPS ===")
storage = StorageService()

# Simular un archivo file-like
class FakeFile:
    def __init__(self, content):
        self.content = content
        self.name = 'A01E5687.json'
        self.size = len(content)
        self.position = 0
    
    def read(self):
        self.position = len(self.content)
        return self.content.encode()
    
    def seek(self, pos):
        self.position = pos

# Validar RIPS
fake_file = FakeFile(json.dumps(rips_data))
resultado = storage._validar_rips_json(fake_file)

print(f"- Válido: {resultado['valido']}")
print(f"- Errores: {resultado['errores']}")
print(f"- Warnings: {resultado['warnings']}")
print(f"- Metadata: {resultado['metadata']}")

