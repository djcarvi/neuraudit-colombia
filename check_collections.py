#!/usr/bin/env python
"""
Script para verificar colecciones en MongoDB
"""

from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.neuraudit_colombia_db

print("Verificando base de datos y colecciones...")
print("-" * 80)

# Listar todas las colecciones
collections = db.list_collection_names()
print(f"Colecciones en neuraudit_colombia_db: {len(collections)}")
print("-" * 80)

# Buscar colecciones relacionadas con usuarios/authentication
for collection in sorted(collections):
    if 'user' in collection.lower() or 'auth' in collection.lower() or 'pss' in collection.lower():
        count = db[collection].count_documents({})
        print(f"{collection}: {count} documentos")
        
        # Si hay documentos, mostrar una muestra
        if count > 0:
            print("  Muestra de documentos:")
            for doc in db[collection].find({}).limit(3):
                if 'username' in doc:
                    print(f"    - username: {doc.get('username')}")
                elif 'usuario' in doc:
                    print(f"    - usuario: {doc.get('usuario')}")
                elif 'email' in doc:
                    print(f"    - email: {doc.get('email')}")
                elif 'nit' in doc:
                    print(f"    - nit: {doc.get('nit')}")
            print()

# También buscar en todas las colecciones por usuarios específicos
print("\n" + "-" * 80)
print("Buscando usuarios en TODAS las colecciones...")
print("-" * 80)

usernames_buscar = ['radicador.sanrafael', 'admin.sanrafael', 'radicador.hcentral']

for collection in collections:
    # Buscar por username
    for username in usernames_buscar:
        result = db[collection].find_one({
            "$or": [
                {"username": username},
                {"usuario": username},
                {"email": username}
            ]
        })
        if result:
            print(f"¡ENCONTRADO! {username} en colección: {collection}")
            print(f"  Documento: {result}")
            print()