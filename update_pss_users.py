#!/usr/bin/env python
"""
Script para actualizar usuarios PSS con el atributo can_radicate
"""

from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.neuraudit_colombia_db

# Lista de usuarios PSS que necesitan can_radicate
usuarios_pss = [
    'radicador.sanrafael',
    'admin.sanrafael', 
    'radicador.hcentral'
]

print("Actualizando usuarios PSS con can_radicate=True...")
print("-" * 50)

for username in usuarios_pss:
    try:
        # Actualizar en MongoDB directamente
        result = db.authentication_robustneuraudituser.update_one(
            {'username': username},
            {'$set': {'can_radicate': True}}
        )
        if result.modified_count > 0:
            print(f"✓ Usuario {username} actualizado con can_radicate=True")
        elif result.matched_count > 0:
            print(f"→ Usuario {username} ya tenía can_radicate=True")
        else:
            print(f"✗ Usuario {username} no encontrado")
    except Exception as e:
        print(f"Error actualizando {username}: {e}")

# Verificar los cambios
print("\n" + "-" * 50)
print("Verificando usuarios actualizados:")
print("-" * 50)

for username in usuarios_pss:
    user_data = db.authentication_robustneuraudituser.find_one({'username': username})
    if user_data:
        can_radicate = user_data.get('can_radicate', False)
        perfil = user_data.get('perfil', 'No definido')
        prestador_nit = user_data.get('prestador_nit', 'No definido')
        print(f"\n{username}:")
        print(f"  - can_radicate: {can_radicate}")
        print(f"  - perfil: {perfil}")
        print(f"  - NIT: {prestador_nit}")
    else:
        print(f"\n{username}: NO ENCONTRADO")

print("\n✓ Proceso completado")