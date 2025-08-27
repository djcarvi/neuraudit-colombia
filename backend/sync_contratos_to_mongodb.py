#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para sincronizar contratos de Django ORM a MongoDB
"""

import os
import sys
import django
from datetime import datetime
from pymongo import MongoClient

# Setup Django
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.contratacion.models import Contrato, Prestador


def sync_contratos_to_mongodb():
    """Sincronizar contratos de Django ORM a MongoDB"""
    
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    contratos_collection = db['contratos']
    
    # Obtener todos los contratos del ORM
    contratos = Contrato.objects.select_related('prestador', 'modalidad_principal').all()
    
    print(f"📋 Encontrados {contratos.count()} contratos en Django ORM")
    
    # Limpiar colección MongoDB
    contratos_collection.delete_many({})
    print("🗑️ Colección MongoDB limpiada")
    
    # Sincronizar cada contrato
    for contrato in contratos:
        doc_mongodb = {
            '_id': str(contrato.id),
            'numero_contrato': contrato.numero_contrato,
            'prestador': {
                'id': str(contrato.prestador.id),
                'nit': contrato.prestador.nit,
                'razon_social': contrato.prestador.razon_social,
                'ciudad': contrato.prestador.ciudad,
                'departamento': contrato.prestador.departamento
            },
            'modalidad_principal': contrato.modalidad_principal.codigo,
            'modalidad_principal_nombre': contrato.modalidad_principal.nombre,
            'modalidades_adicionales': contrato.modalidades_adicionales or [],
            'fecha_inicio': datetime.combine(contrato.fecha_inicio, datetime.min.time()),
            'fecha_fin': datetime.combine(contrato.fecha_fin, datetime.min.time()),
            'fecha_firma': datetime.combine(contrato.fecha_firma, datetime.min.time()),
            'valor_total': float(contrato.valor_total) if contrato.valor_total else 0.0,
            'valor_mensual': float(contrato.valor_mensual) if contrato.valor_mensual else 0.0,
            'manual_tarifario': contrato.manual_tarifario,
            'porcentaje_negociacion': float(contrato.porcentaje_negociacion),
            'estado': contrato.estado,
            'objeto_contractual': getattr(contrato, 'objeto_contractual', ''),
            'poblacion_objeto': getattr(contrato, 'poblacion_objeto', ''),
            'valor_upc': float(contrato.valor_upc) if hasattr(contrato, 'valor_upc') and contrato.valor_upc else None,
            'numero_afiliados': getattr(contrato, 'numero_afiliados', None),
            'tiene_poliza': getattr(contrato, 'tiene_poliza', False),
            'tiene_anexo_tecnico': getattr(contrato, 'tiene_anexo_tecnico', False),
            'tiene_anexo_economico': getattr(contrato, 'tiene_anexo_economico', True),
            'created_at': contrato.created_at,
            'updated_at': contrato.updated_at,
            'created_by': {
                'id': str(contrato.created_by.id),
                'username': contrato.created_by.username,
                'email': contrato.created_by.email
            }
        }
        
        # Insertar en MongoDB
        contratos_collection.insert_one(doc_mongodb)
        print(f"✅ Sincronizado contrato: {contrato.numero_contrato} - {contrato.prestador.razon_social}")
    
    # Verificar sincronización
    count_mongodb = contratos_collection.count_documents({})
    print(f"\n📊 Total contratos sincronizados a MongoDB: {count_mongodb}")
    
    # Mostrar contratos de MEDICAL ENERGY
    medical_energy_contratos = list(contratos_collection.find(
        {'prestador.nit': '901019681'},
        {'numero_contrato': 1, 'modalidad_principal': 1, 'estado': 1}
    ))
    
    if medical_energy_contratos:
        print(f"\n🏥 Contratos de MEDICAL ENERGY SAS:")
        for cont in medical_energy_contratos:
            print(f"  - {cont['numero_contrato']} ({cont['modalidad_principal']}) - {cont['estado']}")


if __name__ == "__main__":
    sync_contratos_to_mongodb()