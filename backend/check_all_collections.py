#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar todas las colecciones en MongoDB
"""

import os
import sys
import django
from pymongo import MongoClient
from bson import ObjectId

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def main():
    print("=" * 80)
    print("VERIFICACIÓN COMPLETA DE MONGODB - NEURAUDIT")
    print("=" * 80)
    
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    
    # Verificar bases de datos disponibles
    print("\nBASES DE DATOS DISPONIBLES:")
    print("-" * 50)
    dbs = client.list_database_names()
    for db_name in dbs:
        print(f"  - {db_name}")
    
    # Conectar a la base de datos principal
    db = client['neuraudit_colombia_db']
    
    print(f"\n\nCOLECCIONES EN 'neuraudit_colombia_db':")
    print("-" * 50)
    
    collections = db.list_collection_names()
    collections.sort()
    
    if not collections:
        print("✗ No hay colecciones en esta base de datos")
    else:
        print(f"✓ Total de colecciones: {len(collections)}\n")
        
        # Mostrar información de cada colección
        for collection_name in collections:
            collection = db[collection_name]
            count = collection.count_documents({})
            print(f"📁 {collection_name}: {count} documentos")
            
            # Si tiene documentos, mostrar un ejemplo
            if count > 0 and "glosa" in collection_name.lower():
                print(f"   → Ejemplo de documento:")
                sample = collection.find_one()
                if sample:
                    # Mostrar campos principales
                    print(f"     - _id: {sample.get('_id')}")
                    for key in list(sample.keys())[:5]:  # Primeros 5 campos
                        if key != '_id':
                            value = sample.get(key)
                            if isinstance(value, (str, int, float, bool)):
                                print(f"     - {key}: {value}")
                            elif isinstance(value, ObjectId):
                                print(f"     - {key}: {str(value)}")
                            elif isinstance(value, list):
                                print(f"     - {key}: Lista con {len(value)} elementos")
                            elif isinstance(value, dict):
                                print(f"     - {key}: Diccionario")
                print()
    
    # Buscar específicamente la radicación
    print("\n\nBÚSQUEDA ESPECÍFICA DEL ID: 68a8f29b160b41846ed833fc")
    print("-" * 50)
    
    id_buscar = "68a8f29b160b41846ed833fc"
    encontrado = False
    
    # Buscar en todas las colecciones
    for collection_name in collections:
        collection = db[collection_name]
        
        # Buscar como ObjectId
        try:
            doc = collection.find_one({"_id": ObjectId(id_buscar)})
            if doc:
                print(f"✓ ENCONTRADO en '{collection_name}' como ObjectId!")
                print(f"  Tipo de documento: {doc.get('tipo', 'N/A')}")
                print(f"  Estado: {doc.get('estado', 'N/A')}")
                encontrado = True
                break
        except:
            pass
        
        # Buscar como string en _id
        doc = collection.find_one({"_id": id_buscar})
        if doc:
            print(f"✓ ENCONTRADO en '{collection_name}' como string en _id!")
            encontrado = True
            break
        
        # Buscar en cualquier campo que termine en _id
        for field in ['radicacion_id', 'numero_radicacion', 'id']:
            doc = collection.find_one({field: id_buscar})
            if doc:
                print(f"✓ ENCONTRADO en '{collection_name}' en campo '{field}'!")
                print(f"  _id del documento: {doc.get('_id')}")
                encontrado = True
                break
        
        if encontrado:
            break
    
    if not encontrado:
        print("✗ No se encontró el ID en ninguna colección")
    
    # Buscar colecciones relacionadas con auditoría y glosas
    print("\n\nCOLECCIONES RELACIONADAS CON AUDITORÍA Y GLOSAS:")
    print("-" * 50)
    
    keywords = ['audit', 'glosa', 'factura', 'servicio', 'radicacion']
    for keyword in keywords:
        related = [c for c in collections if keyword in c.lower()]
        if related:
            print(f"\n📌 Colecciones con '{keyword}':")
            for col in related:
                count = db[col].count_documents({})
                print(f"   - {col}: {count} documentos")
    
    print("\n" + "=" * 80)
    print("VERIFICACIÓN COMPLETADA")
    print("=" * 80)

if __name__ == "__main__":
    main()