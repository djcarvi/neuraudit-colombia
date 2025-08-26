#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar radicaciones recientes y buscar la especificada
"""

import os
import sys
import django
from pymongo import MongoClient
from bson import ObjectId
import json
from datetime import datetime

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def main():
    # ID de la radicación a buscar
    radicacion_id_str = "68a8f29b160b41846ed833fc"
    
    print("=" * 80)
    print("VERIFICACIÓN DE RADICACIONES EN MONGODB")
    print("=" * 80)
    
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    
    print("\n1. BUSCANDO RADICACIÓN ESPECÍFICA...")
    print("-" * 50)
    
    radicaciones = db['radicacion_radicacion']
    
    # Intentar buscar de diferentes formas
    print(f"\nBuscando ID: {radicacion_id_str}")
    
    # Buscar como ObjectId
    try:
        radicacion = radicaciones.find_one({"_id": ObjectId(radicacion_id_str)})
        if radicacion:
            print("✓ Encontrada como ObjectId")
            print(f"  - Número: {radicacion.get('numero_radicacion')}")
            print(f"  - Estado: {radicacion.get('estado')}")
            print(f"  - Prestador: {radicacion.get('prestador_nombre')}")
        else:
            print("✗ No encontrada como ObjectId")
    except Exception as e:
        print(f"✗ Error al buscar como ObjectId: {e}")
    
    # Buscar como string
    radicacion = radicaciones.find_one({"_id": radicacion_id_str})
    if radicacion:
        print("✓ Encontrada como string")
    else:
        print("✗ No encontrada como string")
    
    # Buscar por numero_radicacion
    radicacion = radicaciones.find_one({"numero_radicacion": radicacion_id_str})
    if radicacion:
        print("✓ Encontrada por numero_radicacion")
        print(f"  - ID real: {radicacion.get('_id')}")
    else:
        print("✗ No encontrada por numero_radicacion")
    
    print("\n\n2. LISTANDO ÚLTIMAS 10 RADICACIONES...")
    print("-" * 50)
    
    # Obtener las últimas 10 radicaciones
    ultimas_radicaciones = list(radicaciones.find().sort("fecha_radicacion", -1).limit(10))
    
    if ultimas_radicaciones:
        print(f"\n✓ Encontradas {len(ultimas_radicaciones)} radicaciones recientes:\n")
        for idx, rad in enumerate(ultimas_radicaciones, 1):
            print(f"{idx}. ID: {rad.get('_id')}")
            print(f"   Número: {rad.get('numero_radicacion')}")
            print(f"   Estado: {rad.get('estado')}")
            print(f"   Prestador: {rad.get('prestador_nombre')}")
            print(f"   Fecha: {rad.get('fecha_radicacion')}")
            print(f"   Facturas: {rad.get('total_facturas', 0)}")
            print()
    else:
        print("✗ No se encontraron radicaciones")
    
    print("\n3. VERIFICANDO AUDITORÍAS MÉDICAS...")
    print("-" * 50)
    
    # Verificar colección de auditorías médicas
    auditorias = db['neuraudit_auditorias_medicas']
    total_auditorias = auditorias.count_documents({})
    print(f"\nTotal de auditorías médicas: {total_auditorias}")
    
    if total_auditorias > 0:
        # Mostrar últimas 5
        ultimas_auditorias = list(auditorias.find().sort("fecha_creacion", -1).limit(5))
        print("\nÚltimas auditorías:")
        for idx, aud in enumerate(ultimas_auditorias, 1):
            print(f"\n{idx}. ID: {aud.get('_id')}")
            print(f"   Radicación ID: {aud.get('radicacion_id')}")
            print(f"   Estado: {aud.get('estado')}")
            print(f"   Auditor: {aud.get('auditor_nombre', 'N/A')}")
            print(f"   Fecha: {aud.get('fecha_creacion')}")
    
    print("\n\n4. VERIFICANDO FACTURAS RADICADAS...")
    print("-" * 50)
    
    # Verificar facturas radicadas
    facturas = db['auditoria_facturaradicada']
    total_facturas = facturas.count_documents({})
    print(f"\nTotal de facturas radicadas: {total_facturas}")
    
    if total_facturas > 0:
        # Mostrar últimas 5
        ultimas_facturas = list(facturas.find().sort("fecha_creacion", -1).limit(5))
        print("\nÚltimas facturas:")
        for idx, fac in enumerate(ultimas_facturas, 1):
            print(f"\n{idx}. ID: {fac.get('_id')}")
            print(f"   Número: {fac.get('numero_factura')}")
            print(f"   Radicación ID: {fac.get('radicacion_id')}")
            print(f"   Valor: ${fac.get('valor_total', 0):,.2f}")
            print(f"   Estado: {fac.get('estado_auditoria')}")
    
    print("\n\n5. VERIFICANDO SERVICIOS CON GLOSAS...")
    print("-" * 50)
    
    # Verificar servicios con glosas
    servicios = db['auditoria_serviciofacturado']
    servicios_con_glosas = servicios.count_documents({
        "glosas": {"$exists": True, "$ne": []}
    })
    print(f"\nServicios con glosas aplicadas: {servicios_con_glosas}")
    
    if servicios_con_glosas > 0:
        # Mostrar algunos ejemplos
        ejemplos = list(servicios.find({
            "glosas": {"$exists": True, "$ne": []}
        }).limit(3))
        
        print("\nEjemplos de servicios con glosas:")
        for idx, serv in enumerate(ejemplos, 1):
            print(f"\n{idx}. Servicio: {serv.get('codigo_servicio')} - {serv.get('descripcion_servicio')}")
            print(f"   Factura ID: {serv.get('factura_id')}")
            glosas = serv.get('glosas', [])
            print(f"   Glosas aplicadas: {len(glosas)}")
            for glosa in glosas[:2]:  # Mostrar máximo 2 glosas
                print(f"     - {glosa.get('codigo_glosa')}: ${glosa.get('valor_glosa', 0):,.2f}")
    
    print("\n" + "=" * 80)
    print("VERIFICACIÓN COMPLETADA")
    print("=" * 80)

if __name__ == "__main__":
    main()