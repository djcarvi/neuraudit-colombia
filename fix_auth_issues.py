#!/usr/bin/env python
"""
Script para resolver problemas de autenticación
"""
from pymongo import MongoClient
from datetime import datetime, timedelta

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['neuraudit_colombia_db']

print("=== RESOLVIENDO PROBLEMAS DE AUTENTICACIÓN ===\n")

# 1. Actualizar estado del usuario
usuarios = db['usuarios_sistema']
usuario = usuarios.find_one({'email': 'adriancarvajalc@gmail.com'})

if usuario:
    print(f"1. Usuario encontrado: {usuario['username']}")
    print(f"   Estado actual: {usuario.get('estado', 'NO TIENE')}")
    
    # Actualizar estado a ACTIVO
    result = usuarios.update_one(
        {'_id': usuario['_id']},
        {'$set': {
            'estado': 'ACTIVO',
            'activo': True,
            'updated_at': datetime.utcnow()
        }}
    )
    
    if result.modified_count > 0:
        print("   ✓ Estado actualizado a 'ACTIVO'")
    else:
        print("   ✗ No se pudo actualizar")
else:
    print("1. ✗ No se encontró usuario con email: adriancarvajalc@gmail.com")

# 2. Limpiar intentos de login fallidos
intentos = db['intentos_login']
deleted = intentos.delete_many({'ip': '127.0.0.1'})
print(f"\n2. Limpieza de intentos fallidos:")
print(f"   ✓ {deleted.deleted_count} registros eliminados")

# 3. Limpiar eventos de seguridad
eventos = db['eventos_seguridad']
deleted = eventos.delete_many({'ip': '127.0.0.1'})
print(f"\n3. Limpieza de eventos de seguridad:")
print(f"   ✓ {deleted.deleted_count} registros eliminados")

# 4. Limpiar sesiones antiguas
sesiones = db['sesiones_activas']
deleted = sesiones.delete_many({
    'usuario_id': usuario['_id'] if usuario else None,
    'activa': False
})
print(f"\n4. Limpieza de sesiones inactivas:")
print(f"   ✓ {deleted.deleted_count} sesiones eliminadas")

print("\n=== PROBLEMAS RESUELTOS ===")
print("\n⚠️  IMPORTANTE: Verifica que la hora de tu sistema esté correcta")
print("    El error 'Token used too early' indica desincronización de tiempo")
print("\nAhora puedes intentar hacer login nuevamente con Google.")