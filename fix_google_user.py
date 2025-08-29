#!/usr/bin/env python
"""
Script para corregir el estado del usuario de Google
"""
from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['neuraudit_colombia_db']
usuarios = db['usuarios_sistema']  # Colección correcta del servicio NoSQL

# Buscar usuario por email
email = 'adriancarvajalc@gmail.com'
usuario = usuarios.find_one({'email': email})

if usuario:
    print(f"Usuario encontrado: {usuario['username']}")
    print(f"Estado actual: {usuario.get('estado', 'NO TIENE')}")
    
    # Actualizar estado
    result = usuarios.update_one(
        {'_id': usuario['_id']},
        {'$set': {'estado': 'ACTIVO'}}
    )
    
    if result.modified_count > 0:
        print("✓ Estado actualizado a 'ACTIVO'")
    else:
        print("✗ No se pudo actualizar")
else:
    print(f"No se encontró usuario con email: {email}")