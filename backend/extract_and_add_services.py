#!/usr/bin/env python
import os
import sys
import django
import xml.etree.ElementTree as ET
from decimal import Decimal
import re

# Setup Django environment
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.contratacion.models import Contrato, TarifariosCUPS

def extract_services_from_xml(file_path):
    """Extract services from XML file handling CDATA content"""
    services = []
    
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        # Find AttachedDocument with CDATA containing the Invoice
        for elem in root.iter():
            if elem.tag.endswith('Description') and elem.text and '<Invoice' in elem.text:
                # Extract CDATA content
                cdata_content = elem.text
                
                # Parse the inner XML content
                try:
                    # Parse directly without removing namespaces
                    parser = ET.XMLParser()
                    inner_root = ET.fromstring(cdata_content, parser=parser)
                    
                    # Find all InvoiceLine elements
                    for line in inner_root.iter():
                        if line.tag.endswith('InvoiceLine'):
                            service = {}
                            
                            # Get service code
                            for item in line.iter():
                                if item.tag.endswith('StandardItemIdentification'):
                                    for id_elem in item:
                                        if id_elem.tag.endswith('ID'):
                                            service['code'] = id_elem.text
                                            break
                                
                                # Get description
                                if item.tag.endswith('Description') and not '<' in (item.text or ''):
                                    service['description'] = item.text
                                
                                # Get price
                                if item.tag.endswith('PriceAmount'):
                                    service['price'] = float(item.text)
                            
                            if 'code' in service and 'description' in service and 'price' in service:
                                services.append(service)
                    
                except ET.ParseError as e:
                    print(f"Error parsing CDATA content in {file_path}: {e}")
                
                break  # Found the CDATA section
                
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
                new_service = TarifariosCUPS(
                    contrato_numero=contract.numero_contrato,
                    codigo_cups=code,
                    descripcion=service['description'],
                    valor_unitario=tariff_value,
                    aplica_copago=False,
                    aplica_cuota_moderadora=False,
                    requiere_autorizacion=False,
                    activo=True
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