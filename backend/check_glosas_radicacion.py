#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar glosas aplicadas a una radicación específica
NeurAudit Colombia
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

from django.conf import settings

def json_encoder(obj):
    """Helper para serializar ObjectId y datetime"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    return str(obj)

def main():
    # ID de la radicación a buscar
    radicacion_id = "68a8f29b160b41846ed833fc"
    
    print("=" * 80)
    print(f"VERIFICACIÓN DE GLOSAS PARA RADICACIÓN: {radicacion_id}")
    print("=" * 80)
    
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    
    print("\n1. BUSCANDO EN COLECCIÓN neuraudit_auditorias_medicas...")
    print("-" * 50)
    
    # Buscar en auditorías médicas
    auditorias_medicas = db['neuraudit_auditorias_medicas']
    
    # Buscar por radicacion_id
    auditorias = list(auditorias_medicas.find({
        "radicacion_id": radicacion_id
    }))
    
    if auditorias:
        print(f"✓ Encontradas {len(auditorias)} auditorías médicas")
        for idx, aud in enumerate(auditorias, 1):
            print(f"\n  Auditoría {idx}:")
            print(f"  - ID: {aud.get('_id')}")
            print(f"  - Estado: {aud.get('estado')}")
            print(f"  - Auditor: {aud.get('auditor_nombre', 'N/A')}")
            print(f"  - Fecha creación: {aud.get('fecha_creacion')}")
            
            # Mostrar facturas si existen
            facturas = aud.get('facturas', [])
            if facturas:
                print(f"  - Facturas: {len(facturas)}")
                for f_idx, factura in enumerate(facturas, 1):
                    print(f"\n    Factura {f_idx}: {factura.get('numero_factura')}")
                    servicios = factura.get('servicios', [])
                    if servicios:
                        print(f"    - Servicios: {len(servicios)}")
                        for s_idx, servicio in enumerate(servicios, 1):
                            glosas = servicio.get('glosas', [])
                            if glosas:
                                print(f"\n      Servicio {s_idx}: {servicio.get('codigo_servicio')} - {servicio.get('descripcion_servicio')}")
                                print(f"      Glosas aplicadas: {len(glosas)}")
                                for g_idx, glosa in enumerate(glosas, 1):
                                    print(f"\n        Glosa {g_idx}:")
                                    print(f"        - Código: {glosa.get('codigo_glosa')}")
                                    print(f"        - Descripción: {glosa.get('descripcion_glosa')}")
                                    print(f"        - Valor glosado: ${glosa.get('valor_glosa', 0):,.2f}")
                                    print(f"        - Estado: {glosa.get('estado', 'APLICADA')}")
                                    print(f"        - Fecha: {glosa.get('fecha_glosa')}")
                                    print(f"        - Auditor: {glosa.get('auditor_nombre', 'N/A')}")
    else:
        print("✗ No se encontraron auditorías médicas para esta radicación")
    
    print("\n\n2. BUSCANDO EN COLECCIÓN radicacion_radicacion...")
    print("-" * 50)
    
    # Buscar en radicaciones
    radicaciones = db['radicacion_radicacion']
    
    # Buscar la radicación
    try:
        radicacion = radicaciones.find_one({"_id": ObjectId(radicacion_id)})
        
        if radicacion:
            print(f"✓ Radicación encontrada")
            print(f"  - Número: {radicacion.get('numero_radicacion')}")
            print(f"  - Estado: {radicacion.get('estado')}")
            print(f"  - Prestador: {radicacion.get('prestador_nombre')}")
            print(f"  - Fecha: {radicacion.get('fecha_radicacion')}")
            
            # Verificar si hay glosas en la radicación
            glosas_radicacion = radicacion.get('glosas', [])
            if glosas_radicacion:
                print(f"\n  Glosas en radicación: {len(glosas_radicacion)}")
                for idx, glosa in enumerate(glosas_radicacion, 1):
                    print(f"\n  Glosa {idx}:")
                    print(f"  - Código: {glosa.get('codigo')}")
                    print(f"  - Descripción: {glosa.get('descripcion')}")
                    print(f"  - Valor: ${glosa.get('valor', 0):,.2f}")
                    print(f"  - Estado: {glosa.get('estado')}")
            else:
                print("\n  ✗ No hay glosas almacenadas en la radicación")
        else:
            print("✗ Radicación no encontrada")
    except Exception as e:
        print(f"✗ Error al buscar radicación: {e}")
    
    print("\n\n3. BUSCANDO EN COLECCIÓN radicacion_glosaoficial...")
    print("-" * 50)
    
    # Buscar en glosas oficiales
    glosas_oficiales = db['radicacion_glosaoficial']
    
    # Buscar glosas por radicacion_id
    glosas = list(glosas_oficiales.find({
        "radicacion_id": ObjectId(radicacion_id)
    }))
    
    if glosas:
        print(f"✓ Encontradas {len(glosas)} glosas oficiales")
        for idx, glosa in enumerate(glosas, 1):
            print(f"\n  Glosa {idx}:")
            print(f"  - ID: {glosa.get('_id')}")
            print(f"  - Código: {glosa.get('codigo_glosa')}")
            print(f"  - Descripción: {glosa.get('descripcion')}")
            print(f"  - Valor glosado: ${glosa.get('valor_glosa', 0):,.2f}")
            print(f"  - Estado: {glosa.get('estado')}")
            print(f"  - Auditor: {glosa.get('auditor_nombre', 'N/A')}")
            print(f"  - Fecha aplicación: {glosa.get('fecha_aplicacion')}")
            print(f"  - Servicio ID: {glosa.get('servicio_id')}")
            print(f"  - Factura número: {glosa.get('factura_numero')}")
    else:
        print("✗ No se encontraron glosas oficiales para esta radicación")
    
    print("\n\n4. BUSCANDO EN COLECCIÓN auditoria_facturaradicada...")
    print("-" * 50)
    
    # Buscar en facturas radicadas
    facturas_radicadas = db['auditoria_facturaradicada']
    
    # Buscar facturas por radicacion_id
    facturas = list(facturas_radicadas.find({
        "radicacion_id": ObjectId(radicacion_id)
    }))
    
    if facturas:
        print(f"✓ Encontradas {len(facturas)} facturas radicadas")
        for idx, factura in enumerate(facturas, 1):
            print(f"\n  Factura {idx}:")
            print(f"  - ID: {factura.get('_id')}")
            print(f"  - Número: {factura.get('numero_factura')}")
            print(f"  - Valor total: ${factura.get('valor_total', 0):,.2f}")
            print(f"  - Valor glosado: ${factura.get('valor_glosas', 0):,.2f}")
            print(f"  - Valor aceptado: ${factura.get('valor_aceptado', 0):,.2f}")
            print(f"  - Estado auditoría: {factura.get('estado_auditoria')}")
            
            # Buscar servicios de esta factura
            servicios_facturados = db['auditoria_serviciofacturado']
            servicios = list(servicios_facturados.find({
                "factura_id": factura.get('_id')
            }))
            
            if servicios:
                print(f"  - Servicios: {len(servicios)}")
                servicios_con_glosas = 0
                for servicio in servicios:
                    if servicio.get('glosas'):
                        servicios_con_glosas += 1
                print(f"  - Servicios con glosas: {servicios_con_glosas}")
    else:
        print("✗ No se encontraron facturas radicadas para esta radicación")
    
    print("\n\n5. RESUMEN DE GLOSAS ENCONTRADAS")
    print("=" * 80)
    
    # Buscar todas las glosas en servicios facturados
    servicios_facturados = db['auditoria_serviciofacturado']
    
    # Primero obtener IDs de facturas de esta radicación
    factura_ids = [f.get('_id') for f in facturas]
    
    if factura_ids:
        # Buscar servicios con glosas
        servicios_con_glosas = list(servicios_facturados.find({
            "factura_id": {"$in": factura_ids},
            "glosas": {"$exists": True, "$ne": []}
        }))
        
        total_glosas = 0
        valor_total_glosas = 0
        
        if servicios_con_glosas:
            print(f"\n✓ Servicios con glosas: {len(servicios_con_glosas)}")
            
            for servicio in servicios_con_glosas:
                glosas = servicio.get('glosas', [])
                total_glosas += len(glosas)
                
                print(f"\n  Servicio: {servicio.get('codigo_servicio')} - {servicio.get('descripcion_servicio')}")
                print(f"  Factura ID: {servicio.get('factura_id')}")
                print(f"  Glosas aplicadas: {len(glosas)}")
                
                for glosa in glosas:
                    valor_glosa = glosa.get('valor_glosa', 0)
                    valor_total_glosas += valor_glosa
                    print(f"    - {glosa.get('codigo_glosa')}: ${valor_glosa:,.2f} - {glosa.get('descripcion_glosa', '')[:50]}...")
            
            print(f"\n📊 TOTALES:")
            print(f"  - Total de glosas aplicadas: {total_glosas}")
            print(f"  - Valor total glosado: ${valor_total_glosas:,.2f}")
        else:
            print("\n✗ No se encontraron servicios con glosas para esta radicación")
    
    print("\n" + "=" * 80)
    print("VERIFICACIÓN COMPLETADA")
    print("=" * 80)

if __name__ == "__main__":
    main()