#!/usr/bin/env python
"""
Script para buscar usuarios en la base de datos
"""

from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.neuraudit_colombia_db

print("Buscando todos los usuarios en la base de datos...")
print("-" * 80)

# Buscar todos los usuarios
usuarios = db.authentication_robustneuraudituser.find({})

print(f"Total de usuarios encontrados: {db.authentication_robustneuraudituser.count_documents({})}")
print("-" * 80)

# Mostrar todos los usuarios
for user in usuarios:
    print(f"\nUsername: {user.get('username')}")
    print(f"  - Perfil: {user.get('perfil', 'No definido')}")
    print(f"  - NIT: {user.get('prestador_nit', 'No PSS')}")
    print(f"  - can_radicate: {user.get('can_radicate', 'No definido')}")
    print(f"  - is_active: {user.get('is_active', False)}")

print("\n" + "-" * 80)
print("Buscando usuarios PSS específicos...")
print("-" * 80)

# Buscar por username con patrones
patrones = ['radicador', 'sanrafael', 'hcentral']
for patron in patrones:
    print(f"\nBuscando usuarios que contengan '{patron}':")
    regex_pattern = {"username": {"$regex": patron, "$options": "i"}}
    encontrados = db.authentication_robustneuraudituser.find(regex_pattern)
    count = db.authentication_robustneuraudituser.count_documents(regex_pattern)
    
    if count > 0:
        for user in encontrados:
            print(f"  → {user.get('username')} (NIT: {user.get('prestador_nit', 'N/A')})")
    else:
        print(f"  → No se encontraron usuarios con '{patron}'")