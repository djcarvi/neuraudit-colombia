#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para buscar información de factura y glosas asociadas
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

def buscar_factura_y_glosas():
    """Buscar información de la factura A01E5687 y sus glosas"""
    
    # Conectar a MongoDB
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    numero_radicado = "RAD-901019681-20250822-07"
    numero_factura = "A01E5687"
    radicacion_id_str = "68a8f29b160b41846ed833fc"
    
    print(f"\n{'='*80}")
    print(f"BÚSQUEDA DE FACTURA Y GLOSAS")
    print(f"Radicación: {numero_radicado}")
    print(f"Factura: {numero_factura}")
    print(f"{'='*80}\n")
    
    pp = pprint.PrettyPrinter(indent=2, width=120)
    
    # 1. Buscar en auditoria_facturas
    print("1. BÚSQUEDA EN auditoria_facturas:")
    print("-" * 50)
    
    facturas = list(db.auditoria_facturas.find({
        "$or": [
            {"radicacion_id": radicacion_id_str},
            {"numero_factura": numero_factura}
        ]
    }))
    
    if facturas:
        print(f"✅ Encontradas {len(facturas)} facturas")
        for fact in facturas:
            print("\nFactura completa:")
            pp.pprint(fact)
            factura_id = fact.get('_id')
            
            # Buscar servicios de esta factura
            print(f"\n2. BUSCANDO SERVICIOS DE LA FACTURA {factura_id}:")
            print("-" * 50)
            
            servicios = list(db.auditoria_servicios.find({
                "$or": [
                    {"factura_id": str(factura_id)},
                    {"factura_id": factura_id},
                    {"numero_factura": numero_factura}
                ]
            }))
            
            if servicios:
                print(f"✅ Encontrados {len(servicios)} servicios")
                for i, serv in enumerate(servicios[:5], 1):
                    print(f"\nServicio {i}:")
                    pp.pprint(serv)
            
            # Buscar glosas por factura
            print(f"\n3. BUSCANDO GLOSAS POR NÚMERO DE FACTURA {numero_factura}:")
            print("-" * 50)
            
            glosas = list(db.auditoria_glosa_aplicada.find({
                "numero_factura": numero_factura
            }))
            
            if glosas:
                print(f"✅ Encontradas {len(glosas)} glosas")
                for i, glosa in enumerate(glosas, 1):
                    print(f"\nGlosa {i}:")
                    pp.pprint(glosa)
    
    # 4. Buscar en todas las colecciones por número de factura
    print(f"\n4. BÚSQUEDA GLOBAL POR NÚMERO DE FACTURA {numero_factura}:")
    print("-" * 50)
    
    all_collections = db.list_collection_names()
    
    for collection_name in sorted(all_collections):
        if any(x in collection_name for x in ['auditoria', 'glosa', 'servicio', 'factura']):
            count = db[collection_name].count_documents({"numero_factura": numero_factura})
            if count > 0:
                print(f"\n✅ {collection_name}: {count} documentos")
                # Mostrar un ejemplo
                sample = db[collection_name].find_one({"numero_factura": numero_factura})
                if sample:
                    print("   Ejemplo:")
                    # Mostrar campos relevantes
                    relevant_fields = {k: v for k, v in sample.items() 
                                     if k in ['_id', 'codigo_glosa', 'valor_glosa', 'estado', 
                                            'descripcion_glosa', 'observaciones', 'fecha_aplicacion',
                                            'servicio_id', 'codigo_servicio', 'valor_servicio']}
                    pp.pprint(relevant_fields)
    
    # 5. Buscar auditorías médicas por factura
    print(f"\n5. BÚSQUEDA DE AUDITORÍAS MÉDICAS:")
    print("-" * 50)
    
    auditorias = list(db.neuraudit_auditorias_medicas.find({
        "$or": [
            {"facturas_auditadas": numero_factura},
            {"facturas.numero": numero_factura}
        ]
    }))
    
    if auditorias:
        print(f"✅ Encontradas {len(auditorias)} auditorías médicas")
        for aud in auditorias:
            print(f"\nAuditoría ID: {aud['_id']}")
            print(f"Estado: {aud.get('estado')}")
            print(f"Auditor: {aud.get('auditor_username')}")
            print(f"Total glosas: {aud.get('total_glosas', 0)}")
            print(f"Valor glosas: ${aud.get('valor_glosas', 0):,.2f}")
    
    # Cerrar conexión
    client.close()
    
    print(f"\n{'='*80}")
    print("BÚSQUEDA COMPLETADA")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    buscar_factura_y_glosas()