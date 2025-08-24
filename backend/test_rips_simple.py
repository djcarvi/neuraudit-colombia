import os
import sys
sys.path.insert(0, '/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from apps.authentication.models import User
from apps.radicacion.storage_service import StorageService
from apps.radicacion.models_rips import RIPSTransaccion, RIPSUsuario
import json

# Cargar el RIPS de prueba
print("=== ANALIZANDO ARCHIVO RIPS DE PRUEBA ===")
rips_path = '/home/adrian_carvajal/Analí®/neuraudit_react/context/prueba_radicar/A01E5687.json'
with open(rips_path, 'r') as f:
    rips_data = json.load(f)

print(f"- NIT Prestador: {rips_data.get('numDocumentoIdObligado', 'N/A')}")
print(f"- Número Factura: {rips_data.get('numFactura', 'N/A')}")
print(f"- Tipo Nota: {rips_data.get('tipoNota', 'N/A')}")
print(f"- Total Usuarios: {len(rips_data.get('usuarios', []))}")

# Contar servicios
if 'usuarios' in rips_data and len(rips_data['usuarios']) > 0:
    usuario = rips_data['usuarios'][0]
    servicios = usuario.get('servicios', {})
    print(f"\n=== SERVICIOS DEL PRIMER USUARIO ===")
    for tipo, items in servicios.items():
        if isinstance(items, list):
            print(f"- {tipo}: {len(items)} servicios")

# Ver si ya existe esta transacción
print(f"\n=== VERIFICANDO SI YA EXISTE LA TRANSACCIÓN ===")
trans_existente = RIPSTransaccion.objects.filter(num_factura='A01E5687').first()
if trans_existente:
    print(f"✓ Ya existe: ID={trans_existente.id}, Estado={trans_existente.estado_procesamiento}")
    print(f"  Usuarios: {trans_existente.total_usuarios}, Servicios: {trans_existente.total_servicios}")
else:
    print("✗ No existe la transacción")

# Probar procesamiento
print(f"\n=== PROBANDO PROCESAMIENTO RIPS ===")
storage = StorageService()

try:
    # Simular procesamiento sin archivo real
    resultado = storage.procesar_y_guardar_rips(
        rips_data,
        'test_radicacion_123',  # ID de radicación ficticio
        'neuraudit/test/A01E5687.json'  # Path ficticio
    )
    
    print(f"✓ Procesamiento exitoso:")
    print(f"  - Transacción ID: {resultado['transaccion_id']}")
    print(f"  - Usuarios procesados: {resultado['usuarios_procesados']}")
    print(f"  - Servicios procesados: {resultado['servicios_procesados']}")
    
except Exception as e:
    print(f"✗ Error procesando: {str(e)}")
    import traceback
    traceback.print_exc()

# Verificar datos guardados
if 'transaccion_id' in locals() and resultado.get('transaccion_id'):
    print(f"\n=== VERIFICANDO DATOS GUARDADOS ===")
    trans = RIPSTransaccion.objects.filter(id=resultado['transaccion_id']).first()
    if trans:
        print(f"✓ Transacción guardada: {trans.num_factura}")
        
        # Contar usuarios
        usuarios = RIPSUsuario.objects.filter(transaccion_id=str(trans.id)).count()
        print(f"✓ Usuarios guardados: {usuarios}")
        
        # Contar consultas
        from apps.radicacion.models_rips import RIPSConsulta
        consultas = RIPSConsulta.objects.filter(transaccion_id=str(trans.id)).count()
        print(f"✓ Consultas guardadas: {consultas}")

