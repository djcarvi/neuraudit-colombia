#!/usr/bin/env python
"""
Script para inspeccionar la estructura exacta de los usuarios en la base de datos
"""

from pymongo import MongoClient
import json

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.neuraudit_colombia_db

print("=" * 80)
print("INSPECCIÓN DE ESTRUCTURA DE USUARIOS EN MONGODB")
print("=" * 80)

# Buscar un usuario PSS de ejemplo
usuario_ejemplo = db.usuarios_sistema.find_one({
    'username': {'$in': ['radicador.sanrafael', 'admin.sanrafael', 'radicador.hcentral']}
})

if usuario_ejemplo:
    print("\n1. ESTRUCTURA COMPLETA DE UN USUARIO PSS:")
    print("-" * 80)
    # Mostrar todos los campos
    for key, value in usuario_ejemplo.items():
        if key != 'password':  # No mostrar contraseña
            print(f"  {key}: {value} (tipo: {type(value).__name__})")
    
    print("\n2. CAMPOS RELACIONADOS CON can_radicate:")
    print("-" * 80)
    print(f"  can_radicate: {usuario_ejemplo.get('can_radicate', 'NO EXISTE')}")
    print(f"  perfil: {usuario_ejemplo.get('perfil', 'NO EXISTE')}")
    print(f"  role: {usuario_ejemplo.get('role', 'NO EXISTE')}")
    print(f"  user_type: {usuario_ejemplo.get('user_type', 'NO EXISTE')}")
    print(f"  tipo_usuario: {usuario_ejemplo.get('tipo_usuario', 'NO EXISTE')}")
    print(f"  is_pss_user: {usuario_ejemplo.get('is_pss_user', 'NO EXISTE')}")
    print(f"  prestador_nit: {usuario_ejemplo.get('prestador_nit', 'NO EXISTE')}")
    print(f"  nit: {usuario_ejemplo.get('nit', 'NO EXISTE')}")
    
    print("\n3. ANÁLISIS DE COMPATIBILIDAD:")
    print("-" * 80)
    
    # Verificar compatibilidad con modelo User
    print("Campos del modelo User que deberían existir:")
    campos_modelo_user = [
        'username', 'email', 'first_name', 'last_name', 'password_hash',
        'user_type', 'role', 'status', 'is_active', 'is_staff', 'is_superuser',
        'nit', 'document_type', 'document_number', 'pss_code', 'pss_name',
        'habilitacion_number', 'perfil_auditoria', 'google_id', 'avatar_url',
        'created_at', 'updated_at', 'last_login'
    ]
    
    for campo in campos_modelo_user:
        existe = campo in usuario_ejemplo
        valor = usuario_ejemplo.get(campo, 'NO EXISTE')
        print(f"  {campo}: {'✓' if existe else '✗'} {valor if existe and campo != 'password_hash' else ''}")
    
    print("\n4. CAMPOS ADICIONALES NO EN EL MODELO:")
    print("-" * 80)
    campos_adicionales = [k for k in usuario_ejemplo.keys() if k not in campos_modelo_user]
    for campo in campos_adicionales:
        print(f"  {campo}: {usuario_ejemplo[campo]}")

else:
    print("No se encontró ningún usuario PSS de ejemplo")

print("\n5. CONTEO DE USUARIOS POR TIPO:")
print("-" * 80)
# Contar usuarios por perfil
perfiles = db.usuarios_sistema.distinct('perfil')
for perfil in perfiles:
    count = db.usuarios_sistema.count_documents({'perfil': perfil})
    print(f"  {perfil}: {count} usuarios")

print("\n6. MUESTRA DE TODOS LOS USUARIOS:")
print("-" * 80)
usuarios = db.usuarios_sistema.find({}, {'username': 1, 'perfil': 1, 'can_radicate': 1, '_id': 0})
for user in usuarios:
    print(f"  {user.get('username')}: perfil={user.get('perfil')}, can_radicate={user.get('can_radicate', 'NO DEFINIDO')}")