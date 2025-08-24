#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test simple de validación
"""

import os
import sys
import django

sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.document_parser import FileProcessor
from apps.radicacion.cross_validation_service import CrossValidationService
import json

def test_validation():
    print("\n🏥 NeurAudit Colombia - Test de Validación Cruzada")
    print("="*60)
    
    # Caso 1: Archivos válidos
    print("\n✅ CASO 1: Archivos con datos coincidentes")
    
    datos_xml = {
        'prestador_nit': '900123456',
        'numero_factura': 'SETP990000001'
    }
    
    datos_rips = {
        'prestador_nit': '900123456',
        'numero_factura': 'SETP990000001'
    }
    
    datos_cuv = {
        'codigo_unico_validacion': 'a' * 96,
        'numero_factura': 'SETP990000001',
        'resultado_validacion': True
    }
    
    validator = CrossValidationService()
    resultado = validator.validar_coherencia_completa(
        datos_xml=datos_xml,
        datos_rips=datos_rips,
        datos_cuv=datos_cuv,
        archivos_soportes=['HEV_0000000001_A0000000001.pdf']
    )
    
    print(f"   Validación pasó: {resultado['valido']}")
    print(f"   Errores: {len(resultado['errores'])}")
    if resultado['errores']:
        print(f"   Detalle errores: {resultado['errores']}")
    print(f"   Advertencias: {len(resultado['advertencias'])}")
    if resultado['advertencias']:
        print(f"   Detalle advertencias: {resultado['advertencias']}")
    
    # Caso 2: NIT no coincide
    print("\n❌ CASO 2: NIT diferente entre XML y RIPS")
    
    datos_xml['prestador_nit'] = '900123456'
    datos_rips['prestador_nit'] = '900999999'  # NIT diferente
    
    resultado = validator.validar_coherencia_completa(
        datos_xml=datos_xml,
        datos_rips=datos_rips,
        datos_cuv=datos_cuv
    )
    
    print(f"   Validación pasó: {resultado['valido']}")
    print(f"   Errores: {resultado['errores']}")
    
    # Caso 3: Factura no coincide
    print("\n❌ CASO 3: Número de factura diferente")
    
    datos_xml['prestador_nit'] = '900123456'
    datos_rips['prestador_nit'] = '900123456'
    datos_xml['numero_factura'] = 'SETP990000001'
    datos_rips['numero_factura'] = 'SETP990000999'  # Factura diferente
    datos_cuv['numero_factura'] = 'SETP990000777'  # También diferente
    
    resultado = validator.validar_coherencia_completa(
        datos_xml=datos_xml,
        datos_rips=datos_rips,
        datos_cuv=datos_cuv
    )
    
    print(f"   Validación pasó: {resultado['valido']}")
    print(f"   Errores: {resultado['errores']}")
    
    print("\n" + "="*60)
    print("✅ PRUEBAS COMPLETADAS")

if __name__ == "__main__":
    test_validation()