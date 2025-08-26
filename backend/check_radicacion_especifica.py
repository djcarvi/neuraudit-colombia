#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar toda la información relacionada con la radicación 68a8f29b160b41846ed833fc
"""

import os
import sys
import django
from pymongo import MongoClient
from bson import ObjectId
from bson.decimal128 import Decimal128
from datetime import datetime
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
    radicacion_id = "68a8f29b160b41846ed833fc"
    
    print("=" * 100)
    print(f"VERIFICACIÓN COMPLETA - RADICACIÓN: {radicacion_id}")
    print("=" * 100)
    
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    
    # 1. Buscar en neuraudit_radicacion_cuentas
    print("\n1. BÚSQUEDA EN neuraudit_radicacion_cuentas")
    print("-" * 100)
    
    col_radicaciones = db['neuraudit_radicacion_cuentas']
    
    # Buscar por _id y numero_radicacion
    radicacion = None
    try:
        radicacion = col_radicaciones.find_one({"_id": ObjectId(radicacion_id)})
        if radicacion:
            print("✓ Encontrada por _id (ObjectId)")
    except:
        pass
    
    if not radicacion:
        radicacion = col_radicaciones.find_one({"_id": radicacion_id})
        if radicacion:
            print("✓ Encontrada por _id (string)")
    
    if not radicacion:
        radicacion = col_radicaciones.find_one({"numero_radicacion": radicacion_id})
        if radicacion:
            print("✓ Encontrada por numero_radicacion")
    
    if radicacion:
        print(f"\nInformación de la radicación:")
        print(f"  - ID: {radicacion.get('_id')}")
        print(f"  - Número: {radicacion.get('numero_radicacion')}")
        print(f"  - Estado: {radicacion.get('estado')}")
        print(f"  - Prestador NIT: {radicacion.get('prestador_nit')}")
        print(f"  - Prestador nombre: {radicacion.get('prestador_nombre')}")
        print(f"  - Fecha radicación: {radicacion.get('fecha_radicacion')}")
        print(f"  - Total facturas: {radicacion.get('total_facturas', 0)}")
        print(f"  - Valor total: {format_currency(radicacion.get('valor_total', 0))}")
        
        # Verificar facturas dentro de la radicación
        facturas_data = radicacion.get('facturas', [])
        if facturas_data:
            print(f"\n  Facturas en la radicación: {len(facturas_data)}")
            for idx, fac in enumerate(facturas_data[:3], 1):  # Mostrar máximo 3
                print(f"    {idx}. {fac.get('numero_factura', 'N/A')} - {format_currency(fac.get('valor_total', 0))}")
    else:
        print("✗ No se encontró la radicación en neuraudit_radicacion_cuentas")
    
    # 2. Buscar en auditoria_facturas
    print("\n\n2. BÚSQUEDA EN auditoria_facturas")
    print("-" * 100)
    
    col_facturas = db['auditoria_facturas']
    facturas = list(col_facturas.find({"radicacion_id": radicacion_id}))
    
    if facturas:
        print(f"✓ Encontradas {len(facturas)} facturas en auditoría\n")
        
        factura_ids = []
        for idx, factura in enumerate(facturas, 1):
            factura_id = factura.get('_id')
            factura_ids.append(factura_id)
            
            print(f"  Factura {idx}:")
            print(f"    - ID: {factura_id}")
            print(f"    - Número: {factura.get('numero_factura')}")
            print(f"    - Valor total: {format_currency(factura.get('valor_total', 0))}")
            print(f"    - Estado auditoría: {factura.get('estado_auditoria')}")
            print(f"    - Fecha creación: {factura.get('fecha_creacion')}")
            
            # Verificar si tiene información de glosas
            valor_glosas = factura.get('valor_glosas', 0)
            valor_aceptado = factura.get('valor_aceptado', 0)
            if valor_glosas or valor_aceptado:
                print(f"    - Valor glosas: {format_currency(valor_glosas)}")
                print(f"    - Valor aceptado: {format_currency(valor_aceptado)}")
    else:
        print("✗ No se encontraron facturas en auditoria_facturas")
        factura_ids = []
    
    # 3. Buscar servicios
    print("\n\n3. BÚSQUEDA EN auditoria_servicios")
    print("-" * 100)
    
    col_servicios = db['auditoria_servicios']
    
    if factura_ids:
        servicios = list(col_servicios.find({"factura_id": {"$in": factura_ids}}))
        
        if servicios:
            print(f"✓ Encontrados {len(servicios)} servicios\n")
            
            # Contar servicios con glosas
            servicios_con_glosas = 0
            total_glosas_en_servicios = 0
            
            for servicio in servicios:
                glosas = servicio.get('glosas', [])
                if glosas:
                    servicios_con_glosas += 1
                    total_glosas_en_servicios += len(glosas)
            
            print(f"  - Total servicios: {len(servicios)}")
            print(f"  - Servicios con glosas: {servicios_con_glosas}")
            print(f"  - Total glosas en servicios: {total_glosas_en_servicios}")
            
            # Mostrar algunos ejemplos
            if servicios_con_glosas > 0:
                print("\n  Ejemplos de servicios con glosas:")
                ejemplos = 0
                for servicio in servicios:
                    if servicio.get('glosas') and ejemplos < 3:
                        ejemplos += 1
                        print(f"\n    Servicio: {servicio.get('codigo_servicio')} - {servicio.get('descripcion_servicio')}")
                        print(f"    Factura ID: {servicio.get('factura_id')}")
                        glosas = servicio.get('glosas', [])
                        print(f"    Glosas aplicadas: {len(glosas)}")
                        for glosa in glosas[:2]:  # Máximo 2 glosas por servicio
                            print(f"      - {glosa.get('codigo_glosa')}: {format_currency(glosa.get('valor_glosa', 0))}")
        else:
            print("✗ No se encontraron servicios para las facturas")
    else:
        print("✗ No hay facturas para buscar servicios")
    
    # 4. Buscar en auditoria_glosa_aplicada
    print("\n\n4. BÚSQUEDA EN auditoria_glosa_aplicada")
    print("-" * 100)
    
    col_glosas = db['auditoria_glosa_aplicada']
    
    # Buscar glosas por radicacion_id
    glosas = list(col_glosas.find({"radicacion_id": radicacion_id}))
    
    if glosas:
        print(f"✓ Encontradas {len(glosas)} glosas aplicadas\n")
        
        total_valor_glosas = 0
        glosas_por_tipo = {}
        
        for idx, glosa in enumerate(glosas[:10], 1):  # Mostrar máximo 10
            valor = get_numeric_value(glosa.get('valor_glosa', 0))
            total_valor_glosas += valor
            
            codigo = glosa.get('codigo_glosa', 'N/A')
            tipo = codigo[:2] if len(codigo) >= 2 else 'XX'
            
            if tipo not in glosas_por_tipo:
                glosas_por_tipo[tipo] = {'count': 0, 'valor': 0}
            glosas_por_tipo[tipo]['count'] += 1
            glosas_por_tipo[tipo]['valor'] += valor
            
            print(f"  Glosa {idx}:")
            print(f"    - Código: {codigo}")
            print(f"    - Descripción: {glosa.get('descripcion_glosa', '')[:60]}...")
            print(f"    - Valor: {format_currency(valor)}")
            print(f"    - Factura: {glosa.get('numero_factura')}")
            print(f"    - Estado: {glosa.get('estado')}")
            print(f"    - Fecha: {glosa.get('fecha_aplicacion')}")
        
        if len(glosas) > 10:
            print(f"\n  ... y {len(glosas) - 10} glosas más")
        
        print(f"\n  📊 RESUMEN:")
        print(f"     - Total glosas: {len(glosas)}")
        print(f"     - Valor total glosado: {format_currency(total_valor_glosas)}")
        print(f"\n     Por tipo:")
        for tipo, data in glosas_por_tipo.items():
            print(f"       {tipo}: {data['count']} glosas - {format_currency(data['valor'])}")
    else:
        print("✗ No se encontraron glosas en auditoria_glosa_aplicada")
        
        # Buscar con ObjectId
        try:
            glosas = list(col_glosas.find({"radicacion_id": ObjectId(radicacion_id)}))
            if glosas:
                print(f"\n  ✓ Encontradas {len(glosas)} glosas buscando con ObjectId")
        except:
            pass
    
    # 5. Verificar trazabilidad
    print("\n\n5. BÚSQUEDA EN neuraudit_trazabilidad")
    print("-" * 100)
    
    col_trazabilidad = db['neuraudit_trazabilidad']
    trazas = list(col_trazabilidad.find({
        "$or": [
            {"entidad_id": radicacion_id},
            {"detalles.radicacion_id": radicacion_id}
        ]
    }).sort("fecha", -1).limit(5))
    
    if trazas:
        print(f"✓ Encontradas {len(trazas)} entradas de trazabilidad\n")
        for idx, traza in enumerate(trazas, 1):
            print(f"  {idx}. {traza.get('accion')} - {traza.get('fecha')}")
            print(f"     Usuario: {traza.get('usuario_nombre', 'N/A')}")
            if traza.get('detalles'):
                print(f"     Detalles: {str(traza.get('detalles'))[:100]}...")
    else:
        print("✗ No se encontraron entradas de trazabilidad")
    
    print("\n" + "=" * 100)
    print("VERIFICACIÓN COMPLETADA")
    print("=" * 100)

if __name__ == "__main__":
    main()