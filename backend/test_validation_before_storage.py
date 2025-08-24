#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test de validación antes de almacenamiento
NeurAudit Colombia - Verifica que solo se suban archivos validados
"""

import os
import sys
import django
import json

# Setup Django
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import RequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile
from apps.radicacion.views import RadicacionCuentaMedicaViewSet
from datetime import datetime


User = get_user_model()


def create_test_files(scenario='valid'):
    """Crea archivos de prueba según el escenario"""
    
    if scenario == 'valid':
        # Archivos válidos con NIT y factura coincidentes
        xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
    <cbc:ID>SETP990000001</cbc:ID>
    <cbc:IssueDate>2025-08-21</cbc:IssueDate>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>900123456</cbc:CompanyID>
            </cac:PartyTaxScheme>
            <cac:PartyName>
                <cbc:Name>CLINICA DE PRUEBA S.A.S.</cbc:Name>
            </cac:PartyName>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:LegalMonetaryTotal>
        <cbc:PayableAmount currencyID="COP">1500000</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
</Invoice>"""
        
        rips_content = json.dumps({
            "numDocumentoIdObligado": "900123456",
            "numFactura": "SETP990000001",
            "usuarios": [{
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "12345678",
                "tipoUsuario": "01",
                "fechaNacimiento": "1980-01-01",
                "codSexo": "M",
                "primerNombre": "JUAN",
                "primerApellido": "PEREZ",
                "servicios": {
                    "consultas": [{
                        "fechaInicioAtencion": "2025-08-20",
                        "codConsulta": "890201",
                        "codDiagnosticoPrincipal": "A000",
                        "vrServicio": 50000
                    }]
                }
            }]
        })
        
        cuv_content = json.dumps({
            "CodigoUnicoValidacion": "a" * 96,  # CUV de 96 caracteres
            "NumFactura": "SETP990000001",
            "ResultState": True,
            "ProcesoId": 123456,
            "FechaRadicacion": "2025-08-21T10:00:00"
        })
        
        pdf_content = b"%PDF-1.4\nTest HEV"
        
    elif scenario == 'invalid_nit':
        # NIT diferente entre XML y RIPS
        xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
    <cbc:ID>SETP990000001</cbc:ID>
    <cbc:IssueDate>2025-08-21</cbc:IssueDate>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>900123456</cbc:CompanyID>
            </cac:PartyTaxScheme>
            <cac:PartyName>
                <cbc:Name>CLINICA DE PRUEBA S.A.S.</cbc:Name>
            </cac:PartyName>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:LegalMonetaryTotal>
        <cbc:PayableAmount currencyID="COP">1500000</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
</Invoice>"""
        
        rips_content = json.dumps({
            "numDocumentoIdObligado": "900999999",  # NIT diferente!
            "numFactura": "SETP990000001",
            "usuarios": [{
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "12345678",
                "tipoUsuario": "01",
                "fechaNacimiento": "1980-01-01",
                "codSexo": "M",
                "primerNombre": "JUAN",
                "primerApellido": "PEREZ"
            }]
        })
        
        cuv_content = json.dumps({
            "CodigoUnicoValidacion": "b" * 96,
            "NumFactura": "SETP990000001",
            "ResultState": True,
            "ProcesoId": 123456
        })
        
        pdf_content = b"%PDF-1.4\nTest HEV"
        
    elif scenario == 'invalid_invoice':
        # Número de factura diferente
        xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
    <cbc:ID>SETP990000001</cbc:ID>
    <cbc:IssueDate>2025-08-21</cbc:IssueDate>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>900123456</cbc:CompanyID>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:LegalMonetaryTotal>
        <cbc:PayableAmount currencyID="COP">1500000</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
</Invoice>"""
        
        rips_content = json.dumps({
            "numDocumentoIdObligado": "900123456",
            "numFactura": "SETP990000999",  # Factura diferente!
            "usuarios": [{
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "12345678"
            }]
        })
        
        cuv_content = json.dumps({
            "CodigoUnicoValidacion": "c" * 96,
            "NumFactura": "SETP990000777",  # Factura diferente también!
            "ResultState": True
        })
        
        pdf_content = b"%PDF-1.4\nTest HEV"
    
    # Crear archivos
    files = {
        'factura_xml': SimpleUploadedFile(
            'XML_0000000001_A0000000001.xml',
            xml_content.encode('utf-8'),
            content_type='application/xml'
        ),
        'rips_json': SimpleUploadedFile(
            'RIPS_0000000001_A0000000001.json',
            rips_content.encode('utf-8'),
            content_type='application/json'
        ),
        'cuv_file': SimpleUploadedFile(
            'CUV_0000000001.json',
            cuv_content.encode('utf-8'),
            content_type='application/json'
        ),
        'soportes_adicionales': SimpleUploadedFile(
            'HEV_0000000001_A0000000001.pdf',
            pdf_content,
            content_type='application/pdf'
        )
    }
    
    return files


def test_validation_flow(scenario_name, scenario_type):
    """Prueba el flujo de validación"""
    print(f"\n{'='*60}")
    print(f"ESCENARIO: {scenario_name}")
    print(f"{'='*60}")
    
    # Crear usuario de prueba
    user = User.objects.filter(username='test_pss').first()
    if not user:
        user = User.objects.create_user(
            username='test_pss',
            email='test_pss@example.com',
            password='test123',
            user_type='PSS_RADICADOR'
        )
    
    # Asegurar que el usuario tenga permiso para radicar
    user.can_radicate = True
    
    # Crear request factory
    factory = RequestFactory()
    
    # Crear archivos de prueba
    files = create_test_files(scenario_type)
    
    # Crear request
    request = factory.post('/api/radicacion/process_files/', files)
    request.user = user
    request._dont_enforce_csrf_checks = True
    
    # Crear viewset y ejecutar
    viewset = RadicacionCuentaMedicaViewSet()
    viewset.request = request
    viewset.format_kwarg = None
    
    print("\n📤 Enviando archivos para procesamiento...")
    
    try:
        response = viewset.process_files(request)
        print(f"\n📊 Status Code: {response.status_code}")
        
        if hasattr(response, 'data'):
            data = response.data
        else:
            data = {}
            
        print(f"\n📊 Respuesta del servidor:")
        print(f"   Success: {data.get('success')}")
        print(f"   Ready to create: {data.get('ready_to_create')}")
        print(f"   Message: {data.get('message')}")
        
        # Debug: mostrar toda la respuesta si hay error
        if data.get('error'):
            print(f"\n❌ Error del servidor: {data.get('error')}")
        
        # Verificar validación cruzada
        cross_validation = data.get('cross_validation', {})
        if cross_validation:
            print(f"\n🔍 Validación cruzada:")
            print(f"   Válido: {cross_validation.get('valido')}")
            print(f"   Errores: {len(cross_validation.get('errores', []))}")
            
            if cross_validation.get('errores'):
                print("\n   ❌ Errores encontrados:")
                for error in cross_validation['errores']:
                    print(f"      - {error}")
            
            if cross_validation.get('advertencias'):
                print("\n   ⚠️  Advertencias:")
                for warning in cross_validation['advertencias']:
                    print(f"      - {warning}")
        
        # Verificar almacenamiento
        almacenamiento = data.get('almacenamiento', {})
        if almacenamiento and almacenamiento.get('resumen'):
            resumen = almacenamiento['resumen']
            print(f"\n💾 Almacenamiento:")
            print(f"   Archivos almacenados: {resumen.get('archivos_almacenados', 0)}")
            print(f"   Errores: {resumen.get('errores', 0)}")
            
            if resumen.get('archivos_almacenados', 0) > 0:
                print("   ✅ Archivos subidos a Digital Ocean Spaces")
            else:
                print("   ⏸️  NO se subieron archivos (validación falló)")
        
        return data.get('success', False)
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\n🏥 NeurAudit Colombia - Test Validación antes de Almacenamiento")
    print("📅 Fecha:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("\n📋 Este test verifica que SOLO se suban archivos a Digital Ocean")
    print("   Spaces cuando la validación cruzada sea exitosa.")
    
    # Escenario 1: Archivos válidos
    test_validation_flow(
        "Archivos válidos - Deberían subirse",
        "valid"
    )
    
    # Escenario 2: NIT no coincide
    test_validation_flow(
        "NIT diferente XML vs RIPS - NO deberían subirse",
        "invalid_nit"
    )
    
    # Escenario 3: Factura no coincide
    test_validation_flow(
        "Número factura diferente - NO deberían subirse",
        "invalid_invoice"
    )
    
    print("\n" + "="*60)
    print("✅ PRUEBAS COMPLETADAS")
    print("="*60)