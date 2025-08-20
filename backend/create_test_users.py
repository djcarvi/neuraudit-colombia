#!/usr/bin/env python3
"""
Script para crear usuarios de prueba en NeurAudit Colombia
Conecta directamente a MongoDB para evitar problemas de configuración Django
"""

import os
import sys
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import hashlib

def simple_hash_password(password):
    """Simple password hashing for testing (Django-compatible format)"""
    return f"pbkdf2_sha256$260000${'test_salt'}${hashlib.sha256(password.encode()).hexdigest()}"

# Conectar a MongoDB
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    users_collection = db['neuraudit_users']
    
    print("✅ Conexión exitosa a MongoDB")
    print(f"📊 Base de datos: {db.name}")
    
except Exception as e:
    print(f"❌ Error conectando a MongoDB: {e}")
    sys.exit(1)

# Crear usuarios de prueba
test_users = [
    {
        '_id': ObjectId('68897889778e200bfdd7d9ad'),
        'first_name': 'Carlos',
        'last_name': 'Rodríguez',
        'email': 'auditor.medico@epsfamiliar.com.co',
        'phone': '3001234567',
        'nit': '',
        'document_type': 'CC',
        'document_number': '1234567890',
        'username': 'auditor.medico',
        'password_hash': simple_hash_password('NeurAudit2025!'),
        'user_type': 'EPS',
        'role': 'AUDITOR_MEDICO',
        'status': 'AC',
        'is_active': True,
        'is_staff': False,
        'is_superuser': False,
        'pss_code': '',
        'pss_name': '',
        'habilitacion_number': '',
        'perfil_auditoria': {
            'especialidades': ['medicina_interna', 'cardiologia'],
            'max_cuentas_dia': 50,
            'experiencia_anos': 8
        },
        'created_at': datetime.now(),
        'updated_at': datetime.now(),
        'last_login': None
    },
    {
        '_id': ObjectId('6889788a778e200bfdd7d9b0'),
        'first_name': 'María',
        'last_name': 'González',
        'email': 'radicador@hospitalsanjose.com',
        'phone': '3019876543',
        'nit': '900123456-1',
        'document_type': 'CC', 
        'document_number': '9876543210',
        'username': 'radicador.pss',
        'password_hash': simple_hash_password('HSanJose2025!'),
        'user_type': 'PSS',
        'role': 'RADICADOR',
        'status': 'AC',
        'is_active': True,
        'is_staff': False,
        'is_superuser': False,
        'pss_code': 'HSJ001',
        'pss_name': 'Hospital San José',
        'habilitacion_number': 'COL-HSJ-2024-001',
        'perfil_auditoria': {},
        'created_at': datetime.now(),
        'updated_at': datetime.now(),
        'last_login': None
    }
]

print("\n🔄 Creando usuarios de prueba...")

# Limpiar usuarios existentes (opcional)
users_collection.delete_many({})
print("🧹 Usuarios existentes eliminados")

# Insertar usuarios de prueba
try:
    result = users_collection.insert_many(test_users)
    print(f"✅ {len(result.inserted_ids)} usuarios creados exitosamente")
    
    # Verificar creación
    total_users = users_collection.count_documents({})
    eps_users = users_collection.count_documents({'user_type': 'EPS'})
    pss_users = users_collection.count_documents({'user_type': 'PSS'})
    
    print(f"\n📊 Resumen:")
    print(f"   • Total usuarios: {total_users}")
    print(f"   • Usuarios EPS: {eps_users}")
    print(f"   • Usuarios PSS: {pss_users}")
    
    print(f"\n👤 Usuarios creados:")
    for user in users_collection.find({}):
        print(f"   • {user['username']} ({user['user_type']}) - {user['first_name']} {user['last_name']}")
    
    print(f"\n✅ ¡Usuarios de prueba listos para testing!")
    print(f"📄 Ver detalles en: NEURAUDIT-USUARIOS-TESTING.md")
    
except Exception as e:
    print(f"❌ Error creando usuarios: {e}")
    sys.exit(1)

finally:
    client.close()