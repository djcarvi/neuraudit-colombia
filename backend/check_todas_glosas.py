#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar TODAS las glosas en el sistema y su estructura
"""

import os
import sys
import django
from pymongo import MongoClient
from bson import ObjectId
from bson.decimal128 import Decimal128
from datetime import datetime
from collections import defaultdict
from decimal import Decimal

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def get_numeric_value(value):
    """Convierte valores a numérico"""
    if isinstance(value, Decimal128):
        return float(value.to_decimal())
    elif isinstance(value, Decimal):
        return float(value)
    elif value is None:
        return 0
    return float(value)

def format_currency(value):
    """Formatea valores monetarios"""
    value = get_numeric_value(value)
    return f"${value:,.2f}"

def main():
    print("=" * 100)
    print("ANÁLISIS COMPLETO DE GLOSAS EN EL SISTEMA")
    print("=" * 100)
    
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    
    # Colección de glosas
    col_glosas = db['auditoria_glosa_aplicada']
    
    # 1. Estadísticas generales
    print("\n1. ESTADÍSTICAS GENERALES DE GLOSAS")
    print("-" * 100)
    
    total_glosas = col_glosas.count_documents({})
    print(f"✓ Total de glosas en el sistema: {total_glosas}")
    
    if total_glosas == 0:
        print("\n✗ No hay glosas registradas en el sistema")
        return
    
    # Obtener una muestra de glosas
    glosas_muestra = list(col_glosas.find().limit(5))
    
    print("\n2. ESTRUCTURA DE GLOSAS (Muestra de 5)")
    print("-" * 100)
    
    for idx, glosa in enumerate(glosas_muestra, 1):
        print(f"\nGlosa {idx}:")
        print(f"  - ID: {glosa.get('_id')}")
        print(f"  - Radicación ID: {glosa.get('radicacion_id')}")
        print(f"  - Número radicación: {glosa.get('numero_radicacion')}")
        print(f"  - Factura ID: {glosa.get('factura_id')}")
        print(f"  - Número factura: {glosa.get('numero_factura')}")
        print(f"  - Código glosa: {glosa.get('codigo_glosa')}")
        print(f"  - Descripción: {glosa.get('descripcion_glosa', '')[:80]}...")
        print(f"  - Valor: {format_currency(glosa.get('valor_glosa', 0))}")
        print(f"  - Estado: {glosa.get('estado', 'N/A')}")
        print(f"  - Auditor: {glosa.get('auditor_nombre', 'N/A')}")
        print(f"  - Fecha aplicación: {glosa.get('fecha_aplicacion', 'N/A')}")
    
    # 3. Glosas por radicación
    print("\n\n3. DISTRIBUCIÓN DE GLOSAS POR RADICACIÓN")
    print("-" * 100)
    
    pipeline = [
        {
            "$group": {
                "_id": "$radicacion_id",
                "numero_radicacion": {"$first": "$numero_radicacion"},
                "total_glosas": {"$sum": 1},
                "valor_total": {"$sum": "$valor_glosa"},
                "facturas": {"$addToSet": "$numero_factura"}
            }
        },
        {"$sort": {"total_glosas": -1}},
        {"$limit": 10}
    ]
    
    radicaciones_con_glosas = list(col_glosas.aggregate(pipeline))
    
    if radicaciones_con_glosas:
        print(f"\n✓ Top 10 radicaciones con más glosas:\n")
        for rad in radicaciones_con_glosas:
            radicacion_id = rad['_id']
            numero_rad = rad.get('numero_radicacion', 'N/A')
            total_glosas = rad['total_glosas']
            valor_total = get_numeric_value(rad.get('valor_total', 0))
            num_facturas = len(rad.get('facturas', []))
            
            print(f"  Radicación: {numero_rad}")
            print(f"    - ID: {radicacion_id}")
            print(f"    - Total glosas: {total_glosas}")
            print(f"    - Valor total glosado: {format_currency(valor_total)}")
            print(f"    - Facturas afectadas: {num_facturas}")
            print()
    
    # 4. Buscar específicamente la radicación solicitada
    print("\n4. BÚSQUEDA ESPECÍFICA DE RADICACIÓN: 68a8f29b160b41846ed833fc")
    print("-" * 100)
    
    radicacion_buscar = "68a8f29b160b41846ed833fc"
    
    # Buscar de diferentes formas
    glosas_encontradas = list(col_glosas.find({
        "$or": [
            {"radicacion_id": radicacion_buscar},
            {"radicacion_id": ObjectId(radicacion_buscar) if ObjectId.is_valid(radicacion_buscar) else None},
            {"numero_radicacion": {"$regex": radicacion_buscar, "$options": "i"}}
        ]
    }))
    
    if glosas_encontradas:
        print(f"\n✓ Encontradas {len(glosas_encontradas)} glosas para esta radicación")
        valor_total = sum(get_numeric_value(g.get('valor_glosa', 0)) for g in glosas_encontradas)
        print(f"  - Valor total glosado: {format_currency(valor_total)}")
    else:
        print(f"\n✗ No se encontraron glosas para la radicación {radicacion_buscar}")
        
        # Buscar si existe alguna referencia parcial
        print("\n  Buscando referencias parciales...")
        referencias = list(col_glosas.find({
            "$or": [
                {"radicacion_id": {"$regex": radicacion_buscar[:10], "$options": "i"}},
                {"numero_radicacion": {"$regex": radicacion_buscar[:10], "$options": "i"}}
            ]
        }).limit(5))
        
        if referencias:
            print(f"  ✓ Encontradas {len(referencias)} posibles referencias:")
            for ref in referencias:
                print(f"    - Radicación ID: {ref.get('radicacion_id')}")
                print(f"    - Número: {ref.get('numero_radicacion')}")
    
    # 5. Resumen por tipo de glosa
    print("\n\n5. RESUMEN POR TIPO DE GLOSA")
    print("-" * 100)
    
    pipeline_tipos = [
        {
            "$group": {
                "_id": {"$substr": ["$codigo_glosa", 0, 2]},
                "total": {"$sum": 1},
                "valor_total": {"$sum": "$valor_glosa"},
                "codigos": {"$addToSet": "$codigo_glosa"}
            }
        },
        {"$sort": {"total": -1}}
    ]
    
    tipos_glosas = list(col_glosas.aggregate(pipeline_tipos))
    
    tipos_nombres = {
        'FA': 'Facturación',
        'TA': 'Tarifas',
        'SO': 'Soportes',
        'AU': 'Autorizaciones',
        'CO': 'Cobertura',
        'CL': 'Calidad',
        'SA': 'Seguimiento Acuerdos'
    }
    
    if tipos_glosas:
        print("\n📊 DISTRIBUCIÓN POR TIPO:\n")
        total_general = sum(get_numeric_value(t.get('valor_total', 0)) for t in tipos_glosas)
        
        for tipo in tipos_glosas:
            codigo_tipo = tipo['_id']
            nombre_tipo = tipos_nombres.get(codigo_tipo, 'Otro')
            total = tipo['total']
            valor = get_numeric_value(tipo.get('valor_total', 0))
            num_codigos = len(tipo.get('codigos', []))
            
            print(f"  {codigo_tipo} - {nombre_tipo}:")
            print(f"    - Total glosas: {total}")
            print(f"    - Valor total: {format_currency(valor)}")
            print(f"    - Códigos únicos usados: {num_codigos}")
            if total_general > 0:
                porcentaje = (valor / total_general * 100)
                print(f"    - Porcentaje del total: {porcentaje:.2f}%")
            print()
    
    # 6. Estados de glosas
    print("\n6. ESTADOS DE GLOSAS")
    print("-" * 100)
    
    pipeline_estados = [
        {
            "$group": {
                "_id": "$estado",
                "total": {"$sum": 1},
                "valor_total": {"$sum": "$valor_glosa"}
            }
        }
    ]
    
    estados = list(col_glosas.aggregate(pipeline_estados))
    
    if estados:
        print("\n📋 DISTRIBUCIÓN POR ESTADO:\n")
        for estado in estados:
            nombre_estado = estado['_id'] or 'SIN ESTADO'
            total = estado['total']
            valor = get_numeric_value(estado.get('valor_total', 0))
            
            print(f"  {nombre_estado}:")
            print(f"    - Total glosas: {total}")
            print(f"    - Valor total: {format_currency(valor)}")
    
    print("\n" + "=" * 100)
    print("ANÁLISIS COMPLETADO")
    print("=" * 100)

if __name__ == "__main__":
    main()