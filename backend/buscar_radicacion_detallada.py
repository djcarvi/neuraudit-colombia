#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para buscar información detallada de la radicación
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

def buscar_informacion_detallada():
    """Buscar toda la información disponible de la radicación"""
    
    # Conectar a MongoDB
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    numero_radicado = "RAD-901019681-20250822-07"
    print(f"\n{'='*80}")
    print(f"BÚSQUEDA DETALLADA DE RADICACIÓN: {numero_radicado}")
    print(f"{'='*80}\n")
    
    # 1. Obtener la radicación completa
    print("1. DATOS COMPLETOS DE LA RADICACIÓN:")
    print("-" * 50)
    
    radicacion = db.neuraudit_radicacion_cuentas.find_one({
        "numero_radicado": numero_radicado
    })
    
    if radicacion:
        # Pretty print del documento completo
        pp = pprint.PrettyPrinter(indent=2, width=120)
        pp.pprint(radicacion)
        
        radicacion_id = radicacion['_id']
        
        # 2. Buscar por string ID también
        print(f"\n2. BÚSQUEDA ALTERNATIVA POR ID STRING: {str(radicacion_id)}")
        print("-" * 50)
        
        # Buscar glosas usando string del ID
        glosas_str = list(db.auditoria_glosa_aplicada.find({
            "radicacion_id": str(radicacion_id)
        }))
        
        if glosas_str:
            print(f"✅ Encontradas {len(glosas_str)} glosas usando ID como string")
            for glosa in glosas_str[:3]:  # Mostrar primeras 3
                pp.pprint(glosa)
                print()
        
        # 3. Buscar en todas las colecciones que empiezan con 'auditoria' o 'radicacion'
        print("\n3. BÚSQUEDA EN TODAS LAS COLECCIONES RELACIONADAS:")
        print("-" * 50)
        
        all_collections = db.list_collection_names()
        relevant_collections = [c for c in all_collections if 'auditoria' in c or 'radicacion' in c or 'glosa' in c]
        
        for collection_name in sorted(relevant_collections):
            # Buscar por ObjectId
            count_oid = db[collection_name].count_documents({"radicacion_id": radicacion_id})
            # Buscar por string
            count_str = db[collection_name].count_documents({"radicacion_id": str(radicacion_id)})
            # Buscar por numero_radicado
            count_num = db[collection_name].count_documents({"numero_radicado": numero_radicado})
            
            total = count_oid + count_str + count_num
            if total > 0:
                print(f"\n✅ {collection_name}:")
                print(f"   - Por radicacion_id (ObjectId): {count_oid}")
                print(f"   - Por radicacion_id (string): {count_str}")
                print(f"   - Por numero_radicado: {count_num}")
                
                # Mostrar un ejemplo
                if count_oid > 0:
                    sample = db[collection_name].find_one({"radicacion_id": radicacion_id})
                elif count_str > 0:
                    sample = db[collection_name].find_one({"radicacion_id": str(radicacion_id)})
                else:
                    sample = db[collection_name].find_one({"numero_radicado": numero_radicado})
                
                if sample:
                    print("\n   Ejemplo de documento:")
                    # Mostrar solo campos clave
                    key_fields = ['_id', 'codigo_glosa', 'valor_glosa', 'estado', 'fecha_aplicacion', 
                                  'numero_factura', 'servicio_id', 'descripcion_glosa']
                    sample_filtered = {k: v for k, v in sample.items() if k in key_fields}
                    pp.pprint(sample_filtered)
        
        # 4. Buscar facturas asociadas
        print("\n4. BÚSQUEDA DE FACTURAS ASOCIADAS:")
        print("-" * 50)
        
        # Buscar en radicacion_factura
        facturas = list(db.radicacion_factura.find({
            "radicacion_id": radicacion_id
        }))
        
        if not facturas:
            facturas = list(db.radicacion_factura.find({
                "radicacion_id": str(radicacion_id)
            }))
        
        if facturas:
            print(f"✅ Encontradas {len(facturas)} facturas")
            for fact in facturas[:3]:
                print(f"\n   Factura: {fact.get('numero_factura', 'N/A')}")
                print(f"   ID: {fact.get('_id')}")
                print(f"   Valor: ${fact.get('valor_factura', 0):,.2f}")
        
        # 5. Verificar estructura de datos RIPS
        print("\n5. DATOS RIPS EN LA RADICACIÓN:")
        print("-" * 50)
        
        if 'rips_data' in radicacion:
            rips = radicacion['rips_data']
            if rips:
                print("✅ RIPS data encontrada:")
                print(f"   - Tipo: {type(rips)}")
                if isinstance(rips, dict):
                    print(f"   - Claves: {list(rips.keys())}")
                    if 'transaccion' in rips:
                        print(f"   - Número transacción: {rips['transaccion'].get('numero_transaccion', 'N/A')}")
                    if 'facturas' in rips:
                        print(f"   - Total facturas RIPS: {len(rips.get('facturas', []))}")
    
    # Cerrar conexión
    client.close()
    
    print(f"\n{'='*80}")
    print("BÚSQUEDA DETALLADA COMPLETADA")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    buscar_informacion_detallada()