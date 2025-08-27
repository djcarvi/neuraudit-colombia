#!/usr/bin/env python
import os
import sys
import django
import xml.etree.ElementTree as ET
from decimal import Decimal
import re
from datetime import date, timedelta

# Setup Django environment
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.contratacion.models import Contrato, TarifariosCUPS

def extract_services_from_xml(file_path):
    """Extract services from XML file handling CDATA content"""
    services = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find CDATA sections containing Invoice
        cdata_pattern = r'<!\[CDATA\[(.*?)\]\]>'
        cdata_matches = re.findall(cdata_pattern, content, re.DOTALL)
        
        for i, cdata_content in enumerate(cdata_matches):
            # Check for Invoice in any case
            if 'invoice' in cdata_content.lower() and 'invoiceline' in cdata_content.lower():
                # Extract InvoiceLine sections using regex
                invoice_line_pattern = r'<cac:InvoiceLine>(.*?)</cac:InvoiceLine>'
                line_matches = re.findall(invoice_line_pattern, cdata_content, re.DOTALL)
                
                for line_content in line_matches:
                    service = {}
                    
                    # Extract code
                    code_pattern = r'<cbc:ID[^>]*schemeID="999"[^>]*>([^<]+)</cbc:ID>'
                    code_match = re.search(code_pattern, line_content)
                    if code_match:
                        service['code'] = code_match.group(1)
                    
                    # Extract description
                    desc_pattern = r'<cbc:Description>([^<]+)</cbc:Description>'
                    desc_match = re.search(desc_pattern, line_content)
                    if desc_match:
                        service['description'] = desc_match.group(1)
                    
                    # Extract price
                    price_pattern = r'<cbc:PriceAmount[^>]*>([0-9.]+)</cbc:PriceAmount>'
                    price_match = re.search(price_pattern, line_content)
                    if price_match:
                        service['price'] = float(price_match.group(1))
                    
                    if all(key in service for key in ['code', 'description', 'price']):
                        services.append(service)
                
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    
    return services

def main():
    # Path to XML files
    xml_dir = "/home/adrian_carvajal/Analí®/neuraudit_react/context/pruebas_medicalenergy"
    
    # Get all contracts for prestador NIT 901019681
    prestador_nit = "901019681"
    contracts = list(Contrato.objects.filter(prestador__nit=prestador_nit))
    
    if not contracts:
        print(f"No contracts found for prestador with NIT {prestador_nit}")
        return
    
    print(f"Found {len(contracts)} contracts for prestador MEDICAL ENERGY SAS")
    for contract in contracts:
        print(f"  - {contract.numero_contrato} ({contract.modalidad_principal.nombre if hasattr(contract.modalidad_principal, 'nombre') else contract.modalidad_principal})")
    
    # Extract all unique services from all XML files
    all_services = {}
    
    # Walk through all subdirectories
    for root, dirs, files in os.walk(xml_dir):
        for file in files:
            if file.endswith('.xml'):
                file_path = os.path.join(root, file)
                print(f"\nProcessing {file_path}")
                
                services = extract_services_from_xml(file_path)
                for service in services:
                    code = service['code']
                    if code not in all_services or all_services[code]['price'] < service['price']:
                        all_services[code] = service
                        print(f"  Found service: {code} - {service['description']} - ${service['price']:,.2f}")
    
    print(f"\nTotal unique services found: {len(all_services)}")
    
    # Add services to each contract
    for contract in contracts:
        print(f"\nAdding services to contract {contract.numero_contrato}...")
        added_count = 0
        
        for code, service in all_services.items():
            # Calculate SOAT tariff minus 20%
            soat_value = Decimal(str(service['price']))
            tariff_value = soat_value * Decimal('0.8')  # SOAT - 20%
            
            # Check if service already exists in contract
            existing = TarifariosCUPS.objects.filter(
                contrato_numero=contract.numero_contrato,
                codigo_cups=code
            ).first()
            
            if not existing:
                # Create new service
                # Set validity dates - start today, end in 1 year
                today = date.today()
                one_year = today + timedelta(days=365)
                
                new_service = TarifariosCUPS(
                    contrato_numero=contract.numero_contrato,
                    codigo_cups=code,
                    descripcion=service['description'],
                    valor_unitario=tariff_value,
                    aplica_copago=False,
                    aplica_cuota_moderadora=False,
                    requiere_autorizacion=False,
                    vigencia_desde=today,
                    vigencia_hasta=one_year,
                    estado='ACTIVO'
                )
                new_service.save()
                added_count += 1
                print(f"  Added: {code} - {service['description']} - Tariff: ${tariff_value:,.2f}")
            else:
                print(f"  Skipped (exists): {code}")
        
        print(f"Added {added_count} new services to contract {contract.numero_contrato}")
    
    print("\nProcess completed successfully!")

if __name__ == "__main__":
    main()