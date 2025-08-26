#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para buscar TODAS las glosas relacionadas con la radicación
"""

import os
import sys
import django
from datetime import datetime
from bson import ObjectId
import json
import pprint

# Configurar Django
sys.path.insert(0, '/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pymongo import MongoClient
from django.conf import settings

def buscar_todas_las_glosas():
    """Buscar todas las glosas en cualquier colección"""
    
    # Conectar a MongoDB
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    # IDs y valores conocidos
    radicacion_id = ObjectId('68a8f29b160b41846ed833fc')
    radicacion_id_str = '68a8f29b160b41846ed833fc'
    numero_radicado = "RAD-901019681-20250822-07"
    numero_factura = "A01E5687"
    factura_id = ObjectId('68aa0700459401e67468bc6a')
    factura_id_str = '68aa0700459401e67468bc6a'
    servicios_ids = [
        '68aa0700459401e67468bc6b',
        '68aa0700459401e67468bc6c', 
        '68aa0700459401e67468bc6d',
        '68aa0700459401e67468bc6e'
    ]
    
    print(f"\n{'='*80}")
    print(f"BÚSQUEDA EXHAUSTIVA DE GLOSAS")
    print(f"{'='*80}\n")
    
    pp = pprint.PrettyPrinter(indent=2, width=120)
    
    # 1. Listar todas las colecciones
    print("1. TODAS LAS COLECCIONES EN LA BASE DE DATOS:")
    print("-" * 50)
    
    all_collections = sorted(db.list_collection_names())
    glosa_collections = []
    
    for col in all_collections:
        if 'glosa' in col.lower() or 'auditoria' in col.lower():
            glosa_collections.append(col)
            print(f"   - {col}")
    
    # 2. Buscar en cada colección relacionada con glosas
    print("\n2. BÚSQUEDA EN COLECCIONES DE GLOSAS:")
    print("-" * 50)
    
    for collection_name in glosa_collections:
        print(f"\n📁 Colección: {collection_name}")
        
        # Crear consultas amplias
        queries = [
            {"radicacion_id": radicacion_id},
            {"radicacion_id": radicacion_id_str},
            {"numero_radicado": numero_radicado},
            {"numero_factura": numero_factura},
            {"factura_id": factura_id},
            {"factura_id": factura_id_str},
            {"servicio_id": {"$in": servicios_ids}},
            {"_id": {"$in": [ObjectId(sid) for sid in servicios_ids]}},
        ]
        
        total_docs = 0
        for query in queries:
            count = db[collection_name].count_documents(query)
            if count > 0:
                total_docs += count
                print(f"   ✅ Query {query}: {count} documentos")
                
                # Mostrar ejemplo
                doc = db[collection_name].find_one(query)
                if doc:
                    print("      Ejemplo:")
                    # Mostrar campos relevantes
                    relevant = {k: v for k, v in doc.items() 
                              if k in ['_id', 'codigo_glosa', 'valor_glosa', 'estado', 
                                      'descripcion_glosa', 'servicio_id', 'factura_id',
                                      'numero_factura', 'radicacion_id']}
                    pp.pprint(relevant)
        
        if total_docs == 0:
            # Intentar búsqueda más amplia
            sample = db[collection_name].find_one()
            if sample:
                print(f"   ℹ️  Colección no vacía, documento de ejemplo:")
                pp.pprint({k: v for k, v in list(sample.items())[:5]})
    
    # 3. Buscar glosas en los servicios
    print("\n3. BÚSQUEDA DE GLOSAS EN SERVICIOS:")
    print("-" * 50)
    
    for servicio_id in servicios_ids:
        servicio = db.auditoria_servicios.find_one({"_id": ObjectId(servicio_id)})
        if servicio:
            print(f"\n📋 Servicio {servicio_id}:")
            print(f"   - Código: {servicio.get('codigo')}")
            print(f"   - Valor: ${servicio.get('valor_total', 0)}")
            print(f"   - Tiene glosa: {servicio.get('tiene_glosa', False)}")
            print(f"   - Glosas aplicadas: {servicio.get('glosas_aplicadas', [])}")
            
            # Verificar el campo detalle_json
            if 'detalle_json' in servicio and isinstance(servicio['detalle_json'], dict):
                glosas_detalle = servicio['detalle_json'].get('glosas', [])
                print(f"   - Glosas en detalle_json: {glosas_detalle}")
    
    # 4. Buscar en colecciones con nombre similar a glosa
    print("\n4. BÚSQUEDA AMPLIA POR PATRONES:")
    print("-" * 50)
    
    pattern_collections = [col for col in all_collections 
                          if any(x in col.lower() for x in ['glosa', 'audit', 'concil', 'respuesta'])]
    
    for col in pattern_collections:
        # Contar documentos totales
        total = db[col].count_documents({})
        if total > 0:
            print(f"\n📊 {col}: {total} documentos totales")
            # Mostrar estructura de un documento
            sample = db[col].find_one()
            if sample:
                print("   Campos del documento:")
                print(f"   {list(sample.keys())[:10]}...")
    
    # 5. Buscar específicamente glosas por código
    print("\n5. BÚSQUEDA POR CÓDIGOS DE GLOSA:")
    print("-" * 50)
    
    # Códigos de glosa comunes
    codigos_glosa = ['FA0001', 'TA0001', 'SO0001', 'AU0001', 'CO0001', 'CL0001']
    
    for col in glosa_collections:
        for codigo in codigos_glosa:
            count = db[col].count_documents({"codigo_glosa": {"$regex": f"^{codigo[:2]}"}})
            if count > 0:
                print(f"\n✅ {col} - Glosas tipo {codigo[:2]}: {count}")
                ejemplo = db[col].find_one({"codigo_glosa": {"$regex": f"^{codigo[:2]}"}})
                if ejemplo:
                    print(f"   Ejemplo: {ejemplo.get('codigo_glosa')} - {ejemplo.get('descripcion_glosa', 'N/A')}")
    
    # Cerrar conexión
    client.close()
    
    print(f"\n{'='*80}")
    print("BÚSQUEDA EXHAUSTIVA COMPLETADA")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    buscar_todas_las_glosas()