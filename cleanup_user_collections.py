#!/usr/bin/env python
"""
Script para identificar y limpiar colecciones de usuarios duplicadas
"""
from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['neuraudit_colombia_db']

# Listar todas las colecciones
print("=== TODAS LAS COLECCIONES ===")
all_collections = db.list_collection_names()
for col in sorted(all_collections):
    print(f"- {col}")

print("\n=== COLECCIONES DE USUARIOS ===")
# Buscar colecciones que parecen ser de usuarios
user_collections = [col for col in all_collections if 'user' in col.lower() or 'usuario' in col.lower()]

for col in user_collections:
    count = db[col].count_documents({})
    print(f"\n{col}:")
    print(f"  Documentos: {count}")
    if count > 0:
        # Mostrar un ejemplo
        sample = db[col].find_one()
        if sample:
            fields = list(sample.keys())[:5]  # Primeros 5 campos
            print(f"  Campos ejemplo: {fields}")

print("\n=== COLECCIÓN ACTIVA ===")
print("La colección ACTIVA es: usuarios_sistema")
print("Esta es la que usa AuthenticationServiceNoSQL")

print("\n=== COLECCIONES A ELIMINAR ===")
# Colecciones de usuarios que NO son usuarios_sistema
to_delete = [col for col in user_collections if col != 'usuarios_sistema']
print(f"Colecciones candidatas a eliminar: {to_delete}")

# Eliminar directamente (comentar si quieres confirmación manual)
if to_delete:
    print("\n=== ELIMINANDO COLECCIONES ===")
    for col in to_delete:
        # Solo eliminar si no es rips_usuarios (parece ser de RIPS)
        if col == 'rips_usuarios':
            print(f"⚠️  Saltando {col} (parece ser de RIPS, no de autenticación)")
            continue
            
        print(f"Eliminando {col}...")
        db[col].drop()
        print(f"  ✓ {col} eliminada")
    print("\n✅ Limpieza completada")
else:
    print("\nNo hay colecciones de usuarios para eliminar")