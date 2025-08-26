#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para buscar las glosas específicas que se acaban de aplicar
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

def buscar_glosas_especificas():
    """Buscar las glosas específicas de la auditoría reciente"""
    
    # Conectar a MongoDB
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    radicacion_id = '68a8f29b160b41846ed833fc'
    print(f"\n{'='*80}")
    print(f"BÚSQUEDA ESPECÍFICA DE GLOSAS APLICADAS")
    print(f"Radicación: {radicacion_id}")
    print(f"{'='*80}\n")
    
    pp = pprint.PrettyPrinter(indent=2, width=120)
    
    # 1. Buscar en neuraudit_auditorias_medicas (la auditoría completa)
    print("1. AUDITORÍA MÉDICA FINALIZADA:")
    print("-" * 50)
    
    auditoria = db.neuraudit_auditorias_medicas.find_one({"radicacion_id": radicacion_id})
    if auditoria:
        print("✅ Auditoría encontrada:")
        print(f"   - Estado: {auditoria.get('estado')}")
        print(f"   - Fecha: {auditoria.get('fecha_auditoria')}")
        print(f"   - Auditor: {auditoria.get('auditor', {}).get('nombre', 'N/A')}")
        
        glosas_aplicadas = auditoria.get('glosas_aplicadas', [])
        print(f"   - Total glosas aplicadas: {len(glosas_aplicadas)}")
        
        if glosas_aplicadas:
            print("\n   📋 GLOSAS APLICADAS:")
            for i, servicio_glosa in enumerate(glosas_aplicadas, 1):
                print(f"\n      Servicio {i}:")
                print(f"         - Código: {servicio_glosa.get('codigo_servicio')}")
                print(f"         - Usuario: {servicio_glosa.get('usuario_documento')}")
                print(f"         - Valor servicio: ${servicio_glosa.get('valor_servicio', 0):,}")
                
                glosas = servicio_glosa.get('glosas', [])
                print(f"         - Glosas ({len(glosas)}):")
                
                for j, glosa in enumerate(glosas, 1):
                    print(f"            {j}. {glosa.get('codigo_glosa')} - {glosa.get('descripcion_glosa')}")
                    print(f"               Valor: ${glosa.get('valor_glosado', 0):,}")
                    print(f"               Observaciones: {glosa.get('observaciones', 'N/A')}")
                    print(f"               Fecha: {glosa.get('fecha_aplicacion')}")
        
        totales = auditoria.get('totales', {})
        if totales:
            print(f"\n   💰 TOTALES:")
            print(f"      - Valor facturado: ${totales.get('valor_facturado', 0):,}")
            print(f"      - Valor glosado: ${totales.get('valor_glosado_efectivo', 0):,}")
            print(f"      - Valor a pagar: ${totales.get('valor_a_pagar', 0):,}")
    else:
        print("❌ No se encontró la auditoría en neuraudit_auditorias_medicas")
    
    # 2. Buscar en auditoria_glosa_aplicada específicas de esta radicación
    print(f"\n2. GLOSAS EN auditoria_glosa_aplicada:")
    print("-" * 50)
    
    glosas_coleccion = list(db.auditoria_glosa_aplicada.find({"radicacion_id": radicacion_id}))
    print(f"✅ {len(glosas_coleccion)} glosas encontradas para esta radicación")
    
    if glosas_coleccion:
        for i, glosa in enumerate(glosas_coleccion, 1):
            print(f"\n   Glosa {i}:")
            print(f"      - Código: {glosa.get('codigo_glosa')}")
            print(f"      - Tipo: {glosa.get('tipo_glosa')}")
            print(f"      - Descripción: {glosa.get('descripcion_glosa')}")
            print(f"      - Valor: ${glosa.get('valor_glosa', 0):,}")
            print(f"      - Observaciones: {glosa.get('observaciones')}")
            print(f"      - Servicio ID: {glosa.get('servicio_id')}")
            print(f"      - Usuario: {glosa.get('servicio_info', {}).get('usuario_documento', 'N/A')}")
    
    # 3. Buscar glosas por códigos específicos que aplicamos
    print(f"\n3. BÚSQUEDA POR CÓDIGOS ESPECÍFICOS APLICADOS:")
    print("-" * 50)
    
    codigos_aplicados = ['FA1605', 'TA0301']
    
    for codigo in codigos_aplicados:
        count = db.auditoria_glosa_aplicada.count_documents({
            "radicacion_id": radicacion_id,
            "codigo_glosa": codigo
        })
        
        if count > 0:
            print(f"\n   ✅ {codigo}: {count} glosas encontradas")
            glosas_codigo = list(db.auditoria_glosa_aplicada.find({
                "radicacion_id": radicacion_id,
                "codigo_glosa": codigo
            }))
            
            for glosa in glosas_codigo:
                print(f"      - Valor: ${glosa.get('valor_glosa', 0):,}")
                print(f"      - Observaciones: '{glosa.get('observaciones')}'")
                print(f"      - Usuario afectado: {glosa.get('servicio_info', {}).get('usuario_documento', 'N/A')}")
        else:
            print(f"   ❌ {codigo}: No encontrado")
    
    # Cerrar conexión
    client.close()
    
    print(f"\n{'='*80}")
    print("BÚSQUEDA ESPECÍFICA COMPLETADA")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    buscar_glosas_especificas()