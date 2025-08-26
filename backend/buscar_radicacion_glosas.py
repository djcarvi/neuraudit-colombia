#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para buscar radicación y glosas asociadas en MongoDB
"""

import os
import sys
import django
from datetime import datetime
from bson import ObjectId
import json

# Configurar Django
sys.path.insert(0, '/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pymongo import MongoClient
from django.conf import settings

def json_serial(obj):
    """JSON serializer para objetos no serializables por defecto"""
    if isinstance(obj, (datetime, ObjectId)):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

def buscar_radicacion_y_glosas():
    """Buscar radicación RAD-901019681-20250822-07 y todas sus glosas asociadas"""
    
    # Conectar a MongoDB
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    numero_radicado = "RAD-901019681-20250822-07"
    print(f"\n{'='*80}")
    print(f"BÚSQUEDA DE RADICACIÓN: {numero_radicado}")
    print(f"{'='*80}\n")
    
    # 1. Buscar la radicación
    print("1. BUSCANDO RADICACIÓN EN neuraudit_radicacion_cuentas...")
    print("-" * 50)
    
    radicacion = db.neuraudit_radicacion_cuentas.find_one({
        "numero_radicado": numero_radicado
    })
    
    if not radicacion:
        print(f"❌ No se encontró la radicación con número: {numero_radicado}")
        return
    
    radicacion_id = radicacion['_id']
    print(f"✅ Radicación encontrada!")
    print(f"   ID: {radicacion_id}")
    print(f"   Prestador: {radicacion.get('prestador_info', {}).get('razon_social', 'N/A')}")
    print(f"   NIT: {radicacion.get('prestador_info', {}).get('nit', 'N/A')}")
    print(f"   Fecha: {radicacion.get('fecha_radicacion', 'N/A')}")
    print(f"   Estado: {radicacion.get('estado', 'N/A')}")
    print(f"   Total facturas: {radicacion.get('total_facturas', 0)}")
    print(f"   Valor total: ${radicacion.get('valor_total', 0):,.2f}")
    
    # 2. Buscar auditorías médicas asociadas
    print(f"\n2. BUSCANDO AUDITORÍAS EN neuraudit_auditorias_medicas...")
    print("-" * 50)
    
    auditorias = list(db.neuraudit_auditorias_medicas.find({
        "radicacion_id": radicacion_id
    }))
    
    if auditorias:
        print(f"✅ Encontradas {len(auditorias)} auditorías médicas:")
        for i, aud in enumerate(auditorias, 1):
            print(f"\n   Auditoría {i}:")
            print(f"   - ID: {aud['_id']}")
            print(f"   - Estado: {aud.get('estado', 'N/A')}")
            print(f"   - Auditor: {aud.get('auditor_username', 'N/A')}")
            print(f"   - Fecha inicio: {aud.get('fecha_inicio', 'N/A')}")
            print(f"   - Valor glosas: ${aud.get('valor_glosas', 0):,.2f}")
            print(f"   - Total glosas: {aud.get('total_glosas', 0)}")
    else:
        print("❌ No se encontraron auditorías médicas para esta radicación")
    
    # 3. Buscar glosas aplicadas
    print(f"\n3. BUSCANDO GLOSAS EN auditoria_glosa_aplicada...")
    print("-" * 50)
    
    glosas = list(db.auditoria_glosa_aplicada.find({
        "radicacion_id": radicacion_id
    }))
    
    if glosas:
        print(f"✅ Encontradas {len(glosas)} glosas aplicadas:")
        for i, glosa in enumerate(glosas, 1):
            print(f"\n   Glosa {i}:")
            print(f"   - ID: {glosa['_id']}")
            print(f"   - Código: {glosa.get('codigo_glosa', 'N/A')}")
            print(f"   - Descripción: {glosa.get('descripcion_glosa', 'N/A')}")
            print(f"   - Valor: ${glosa.get('valor_glosa', 0):,.2f}")
            print(f"   - Estado: {glosa.get('estado', 'N/A')}")
            print(f"   - Servicio ID: {glosa.get('servicio_id', 'N/A')}")
            print(f"   - Factura: {glosa.get('numero_factura', 'N/A')}")
            print(f"   - Fecha aplicación: {glosa.get('fecha_aplicacion', 'N/A')}")
            print(f"   - Observaciones: {glosa.get('observaciones', 'N/A')}")
    else:
        print("❌ No se encontraron glosas aplicadas para esta radicación")
    
    # 4. Buscar servicios asociados
    print(f"\n4. BUSCANDO SERVICIOS EN auditoria_servicios...")
    print("-" * 50)
    
    servicios = list(db.auditoria_servicios.find({
        "radicacion_id": radicacion_id
    }))
    
    if servicios:
        print(f"✅ Encontrados {len(servicios)} servicios:")
        total_servicios = 0
        total_glosas = 0
        for servicio in servicios:
            total_servicios += servicio.get('valor_servicio', 0)
            total_glosas += servicio.get('valor_glosa', 0)
        
        print(f"   - Total servicios: {len(servicios)}")
        print(f"   - Valor total servicios: ${total_servicios:,.2f}")
        print(f"   - Valor total glosas: ${total_glosas:,.2f}")
        
        # Mostrar primeros 5 servicios como ejemplo
        print("\n   Primeros 5 servicios:")
        for i, serv in enumerate(servicios[:5], 1):
            print(f"\n   Servicio {i}:")
            print(f"   - ID: {serv['_id']}")
            print(f"   - Código: {serv.get('codigo_servicio', 'N/A')}")
            print(f"   - Descripción: {serv.get('descripcion_servicio', 'N/A')}")
            print(f"   - Valor: ${serv.get('valor_servicio', 0):,.2f}")
            print(f"   - Valor glosa: ${serv.get('valor_glosa', 0):,.2f}")
            print(f"   - Estado glosa: {serv.get('estado_glosa', 'N/A')}")
    else:
        print("❌ No se encontraron servicios para esta radicación")
    
    # 5. Buscar en otras colecciones relacionadas
    print(f"\n5. BUSCANDO EN OTRAS COLECCIONES...")
    print("-" * 50)
    
    # Buscar en facturas de auditoría
    facturas = list(db.auditoria_factura_radicada.find({
        "radicacion_id": radicacion_id
    }))
    
    if facturas:
        print(f"✅ Encontradas {len(facturas)} facturas en auditoria_factura_radicada:")
        for i, fact in enumerate(facturas, 1):
            print(f"\n   Factura {i}:")
            print(f"   - Número: {fact.get('numero_factura', 'N/A')}")
            print(f"   - Valor: ${fact.get('valor_factura', 0):,.2f}")
            print(f"   - Total servicios: {fact.get('total_servicios', 0)}")
    
    # Buscar glosas oficiales
    glosas_oficiales = list(db.radicacion_glosaoficial.find({
        "radicacion_id": radicacion_id
    }))
    
    if glosas_oficiales:
        print(f"\n✅ Encontradas {len(glosas_oficiales)} glosas en radicacion_glosaoficial:")
        for i, glosa in enumerate(glosas_oficiales, 1):
            print(f"\n   Glosa oficial {i}:")
            print(f"   - Código: {glosa.get('codigo_glosa', 'N/A')}")
            print(f"   - Valor: ${glosa.get('valor_glosa', 0):,.2f}")
            print(f"   - Estado: {glosa.get('estado', 'N/A')}")
    
    # Buscar pre-glosas
    pre_glosas = list(db.radicacion_preglosa.find({
        "radicacion_id": radicacion_id
    }))
    
    if pre_glosas:
        print(f"\n✅ Encontradas {len(pre_glosas)} pre-glosas en radicacion_preglosa:")
        for i, preglosa in enumerate(pre_glosas, 1):
            print(f"\n   Pre-glosa {i}:")
            print(f"   - Código: {preglosa.get('codigo_glosa', 'N/A')}")
            print(f"   - Tipo: {preglosa.get('tipo_glosa', 'N/A')}")
            print(f"   - Valor sugerido: ${preglosa.get('valor_sugerido', 0):,.2f}")
    
    # 6. Resumen de colecciones revisadas
    print(f"\n{'='*80}")
    print("RESUMEN DE COLECCIONES REVISADAS:")
    print(f"{'='*80}")
    collections_checked = [
        'neuraudit_radicacion_cuentas',
        'neuraudit_auditorias_medicas',
        'auditoria_glosa_aplicada',
        'auditoria_servicios',
        'auditoria_factura_radicada',
        'radicacion_glosaoficial',
        'radicacion_preglosa'
    ]
    
    for collection in collections_checked:
        count = db[collection].count_documents({"radicacion_id": radicacion_id})
        if collection == 'neuraudit_radicacion_cuentas':
            count = 1 if radicacion else 0
        print(f"- {collection}: {count} documentos")
    
    # Cerrar conexión
    client.close()
    
    print(f"\n{'='*80}")
    print("BÚSQUEDA COMPLETADA")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    buscar_radicacion_y_glosas()