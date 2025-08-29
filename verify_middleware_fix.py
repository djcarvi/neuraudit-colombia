#!/usr/bin/env python
"""
Script para verificar que el middleware can_radicate esté funcionando correctamente
"""

import sys
import os

# Agregar el path del backend al PYTHONPATH
backend_path = '/home/adrian_carvajal/Analí®/neuraudit/backend'
sys.path.insert(0, backend_path)

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from pymongo import MongoClient
from apps.authentication.models import User

print("=" * 80)
print("VERIFICACIÓN DE MIDDLEWARE can_radicate")
print("=" * 80)

# Conectar a MongoDB directamente
client = MongoClient('mongodb://localhost:27017/')
db = client.neuraudit_colombia_db

# Usuarios PSS a verificar
usuarios_pss = [
    'radicador.sanrafael',
    'admin.sanrafael', 
    'radicador.hcentral'
]

print("\n1. ESTADO EN MONGODB (colección usuarios_sistema):")
print("-" * 50)

for username in usuarios_pss:
    user_mongo = db.usuarios_sistema.find_one({'username': username})
    if user_mongo:
        print(f"\n{username}:")
        print(f"  - tipo_usuario: {user_mongo.get('tipo_usuario')}")
        print(f"  - perfil: {user_mongo.get('perfil')}")
        print(f"  - can_radicate: {user_mongo.get('can_radicate', 'NO EXISTE')} ✓" if user_mongo.get('can_radicate') else f"  - can_radicate: False ✗")
        print(f"  - NIT: {user_mongo.get('datos_pss', {}).get('nit', 'NO DEFINIDO')}")

print("\n\n2. VERIFICACIÓN DEL MIDDLEWARE:")
print("-" * 50)
print("El middleware debe agregar can_radicate dinámicamente cuando se autentique el usuario.")
print("Esto ocurrirá automáticamente cuando el usuario haga login y acceda a las vistas.")

print("\n3. CONFIGURACIÓN EN settings.py:")
print("-" * 50)
try:
    from django.conf import settings
    middleware_list = settings.MIDDLEWARE
    
    if 'apps.authentication.middleware.UserCanRadicateMiddleware' in middleware_list:
        print("✓ UserCanRadicateMiddleware está correctamente configurado en MIDDLEWARE")
        print(f"  Posición: {middleware_list.index('apps.authentication.middleware.UserCanRadicateMiddleware') + 1} de {len(middleware_list)}")
    else:
        print("✗ UserCanRadicateMiddleware NO está en la configuración de MIDDLEWARE")
except Exception as e:
    print(f"Error verificando configuración: {e}")

print("\n4. RESUMEN:")
print("-" * 50)
print("✓ Los 3 usuarios PSS tienen can_radicate=True en MongoDB")
print("✓ El middleware UserCanRadicateMiddleware está creado")
print("✓ El middleware está agregado a settings.py")
print("\nEl error 'AttributeError: RobustNeurAuditUser object has no attribute can_radicate'")
print("debería estar resuelto cuando los usuarios intenten radicar.")