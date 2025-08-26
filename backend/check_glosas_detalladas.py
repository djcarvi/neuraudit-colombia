#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para obtener información detallada de glosas aplicadas a una radicación
"""

import os
import sys
import django
from pymongo import MongoClient
from bson import ObjectId
from bson.decimal128 import Decimal128
import json
from datetime import datetime
from collections import defaultdict
from decimal import Decimal

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def format_currency(value):
    """Formatea valores monetarios"""
    if isinstance(value, Decimal128):
        value = float(value.to_decimal())
    elif isinstance(value, Decimal):
        value = float(value)
    elif value is None:
        value = 0
    return f"${value:,.2f}" if value else "$0.00"

def get_numeric_value(value):
    """Convierte valores a numérico"""
    if isinstance(value, Decimal128):
        return float(value.to_decimal())
    elif isinstance(value, Decimal):
        return float(value)
    elif value is None:
        return 0
    return float(value)

def main():
    # ID de la radicación a buscar
    radicacion_id = "68a8f29b160b41846ed833fc"
    
    print("=" * 100)
    print(f"ANÁLISIS DETALLADO DE GLOSAS - RADICACIÓN: {radicacion_id}")
    print("=" * 100)
    
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    
    # Colecciones relevantes
    col_facturas = db['auditoria_facturas']
    col_glosas = db['auditoria_glosa_aplicada']
    col_servicios = db['auditoria_servicios']
    col_radicaciones = db['neuraudit_radicacion_cuentas']
    
    # 1. Obtener información de la radicación
    print("\n1. INFORMACIÓN DE LA RADICACIÓN")
    print("-" * 100)
    
    radicacion = col_radicaciones.find_one({"_id": radicacion_id}) or \
                 col_radicaciones.find_one({"numero_radicacion": radicacion_id})
    
    if radicacion:
        print(f"✓ Radicación encontrada:")
        print(f"  - Número: {radicacion.get('numero_radicacion', 'N/A')}")
        print(f"  - Estado: {radicacion.get('estado', 'N/A')}")
        print(f"  - Prestador: {radicacion.get('prestador_nombre', 'N/A')}")
        print(f"  - Fecha: {radicacion.get('fecha_radicacion', 'N/A')}")
        print(f"  - Valor total: {format_currency(radicacion.get('valor_total', 0))}")
    else:
        print("✗ No se encontró información de la radicación en neuraudit_radicacion_cuentas")
    
    # 2. Obtener facturas de esta radicación
    print("\n\n2. FACTURAS ASOCIADAS")
    print("-" * 100)
    
    facturas = list(col_facturas.find({"radicacion_id": radicacion_id}))
    
    if facturas:
        print(f"✓ Encontradas {len(facturas)} facturas\n")
        
        total_valor_facturas = 0
        facturas_info = []
        
        for idx, factura in enumerate(facturas, 1):
            factura_id = factura.get('_id')
            numero_factura = factura.get('numero_factura', 'N/A')
            valor_total = get_numeric_value(factura.get('valor_total', 0))
            total_valor_facturas += valor_total
            
            print(f"  Factura {idx}: {numero_factura}")
            print(f"    - ID: {factura_id}")
            print(f"    - Valor total: {format_currency(valor_total)}")
            print(f"    - Estado: {factura.get('estado_auditoria', 'N/A')}")
            print(f"    - Fecha: {factura.get('fecha_factura', 'N/A')}")
            
            facturas_info.append({
                'id': str(factura_id),
                'numero': numero_factura,
                'valor': valor_total
            })
        
        print(f"\n  📊 TOTAL FACTURAS: {format_currency(total_valor_facturas)}")
    else:
        print("✗ No se encontraron facturas para esta radicación")
        facturas_info = []
    
    # 3. Obtener glosas aplicadas
    print("\n\n3. GLOSAS APLICADAS")
    print("-" * 100)
    
    glosas = list(col_glosas.find({"radicacion_id": radicacion_id}))
    
    if glosas:
        print(f"✓ Encontradas {len(glosas)} glosas aplicadas\n")
        
        # Agrupar glosas por factura
        glosas_por_factura = defaultdict(list)
        total_valor_glosado = 0
        
        for glosa in glosas:
            factura_id = glosa.get('factura_id')
            glosas_por_factura[factura_id].append(glosa)
            total_valor_glosado += get_numeric_value(glosa.get('valor_glosa', 0))
        
        # Mostrar glosas por factura
        for factura_info in facturas_info:
            factura_id = factura_info['id']
            factura_glosas = glosas_por_factura.get(factura_id, [])
            
            if factura_glosas:
                print(f"\n  📄 FACTURA: {factura_info['numero']}")
                print(f"     Valor factura: {format_currency(factura_info['valor'])}")
                print(f"     Glosas aplicadas: {len(factura_glosas)}")
                print()
                
                total_factura_glosado = 0
                
                for idx, glosa in enumerate(factura_glosas, 1):
                    codigo = glosa.get('codigo_glosa', 'N/A')
                    descripcion = glosa.get('descripcion_glosa', 'N/A')
                    valor = get_numeric_value(glosa.get('valor_glosa', 0))
                    total_factura_glosado += valor
                    
                    print(f"     Glosa {idx}:")
                    print(f"       - Código: {codigo}")
                    print(f"       - Descripción: {descripcion}")
                    print(f"       - Valor glosado: {format_currency(valor)}")
                    print(f"       - Estado: {glosa.get('estado', 'APLICADA')}")
                    print(f"       - Auditor: {glosa.get('auditor_nombre', 'N/A')}")
                    print(f"       - Fecha aplicación: {glosa.get('fecha_aplicacion', 'N/A')}")
                    
                    # Información del servicio si está disponible
                    servicio_id = glosa.get('servicio_id')
                    if servicio_id:
                        servicio = col_servicios.find_one({"_id": servicio_id})
                        if servicio:
                            print(f"       - Servicio: {servicio.get('codigo_servicio', 'N/A')} - {servicio.get('descripcion_servicio', 'N/A')}")
                            print(f"       - Tipo servicio: {servicio.get('tipo_servicio', 'N/A')}")
                    
                    # Justificación si existe
                    justificacion = glosa.get('justificacion', '').strip()
                    if justificacion:
                        print(f"       - Justificación: {justificacion}")
                    
                    print()
                
                print(f"     📊 Total glosado en factura: {format_currency(total_factura_glosado)}")
                porcentaje = (total_factura_glosado / factura_info['valor'] * 100) if factura_info['valor'] > 0 else 0
                print(f"     📊 Porcentaje glosado: {porcentaje:.2f}%")
        
        # Resumen de glosas por tipo
        print("\n\n4. RESUMEN DE GLOSAS POR TIPO")
        print("-" * 100)
        
        glosas_por_tipo = defaultdict(lambda: {'count': 0, 'valor': 0})
        
        for glosa in glosas:
            codigo = glosa.get('codigo_glosa', 'N/A')
            tipo = codigo[:2] if len(codigo) >= 2 else 'XX'
            glosas_por_tipo[tipo]['count'] += 1
            glosas_por_tipo[tipo]['valor'] += get_numeric_value(glosa.get('valor_glosa', 0))
        
        tipos_nombres = {
            'FA': 'Facturación',
            'TA': 'Tarifas',
            'SO': 'Soportes',
            'AU': 'Autorizaciones',
            'CO': 'Cobertura',
            'CL': 'Calidad',
            'SA': 'Seguimiento Acuerdos'
        }
        
        print("\n  📊 DISTRIBUCIÓN POR TIPO DE GLOSA:\n")
        for tipo, data in sorted(glosas_por_tipo.items()):
            nombre_tipo = tipos_nombres.get(tipo, 'Otro')
            print(f"    {tipo} - {nombre_tipo}:")
            print(f"      - Cantidad: {data['count']} glosas")
            print(f"      - Valor total: {format_currency(data['valor'])}")
            porcentaje = (data['valor'] / total_valor_glosado * 100) if total_valor_glosado > 0 else 0
            print(f"      - Porcentaje del total: {porcentaje:.2f}%")
            print()
        
        # Resumen general
        print("\n\n5. RESUMEN GENERAL")
        print("-" * 100)
        print(f"\n  💰 VALORES TOTALES:")
        print(f"     - Valor total facturas: {format_currency(total_valor_facturas)}")
        print(f"     - Valor total glosado: {format_currency(total_valor_glosado)}")
        print(f"     - Valor aceptado: {format_currency(total_valor_facturas - total_valor_glosado)}")
        
        porcentaje_total = (total_valor_glosado / total_valor_facturas * 100) if total_valor_facturas > 0 else 0
        print(f"\n  📊 PORCENTAJE GLOSADO: {porcentaje_total:.2f}%")
        
        # Estados de glosas
        estados_glosas = defaultdict(int)
        for glosa in glosas:
            estado = glosa.get('estado', 'APLICADA')
            estados_glosas[estado] += 1
        
        print(f"\n  📋 ESTADOS DE GLOSAS:")
        for estado, count in estados_glosas.items():
            print(f"     - {estado}: {count} glosas")
            
    else:
        print("✗ No se encontraron glosas aplicadas para esta radicación")
    
    # 6. Verificar servicios con glosas
    print("\n\n6. SERVICIOS AUDITADOS")
    print("-" * 100)
    
    # Obtener IDs de facturas
    factura_ids = [f.get('_id') for f in facturas]
    
    if factura_ids:
        servicios = list(col_servicios.find({"factura_id": {"$in": factura_ids}}))
        
        if servicios:
            print(f"✓ Encontrados {len(servicios)} servicios\n")
            
            servicios_con_glosas = 0
            for servicio in servicios:
                if any(g.get('servicio_id') == servicio.get('_id') for g in glosas):
                    servicios_con_glosas += 1
            
            print(f"  - Servicios totales: {len(servicios)}")
            print(f"  - Servicios con glosas: {servicios_con_glosas}")
            print(f"  - Servicios sin glosas: {len(servicios) - servicios_con_glosas}")
            
            # Mostrar distribución por tipo de servicio
            servicios_por_tipo = defaultdict(int)
            for servicio in servicios:
                tipo = servicio.get('tipo_servicio', 'OTRO')
                servicios_por_tipo[tipo] += 1
            
            print(f"\n  📊 DISTRIBUCIÓN POR TIPO DE SERVICIO:")
            for tipo, count in sorted(servicios_por_tipo.items()):
                print(f"     - {tipo}: {count} servicios")
    
    print("\n" + "=" * 100)
    print("ANÁLISIS COMPLETADO")
    print("=" * 100)

if __name__ == "__main__":
    main()