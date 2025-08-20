#!/usr/bin/env python3
"""
Script de prueba para verificar la extracción de datos del sector salud
"""

import os
import sys
import django

# Configurar Django
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.document_parser import DocumentParser

# Leer el archivo XML de ejemplo
xml_file_path = '/home/adrian_carvajal/Analí®/neuraudit_react/context/A01E5687.xml'

print("🔍 PROBANDO EXTRACCIÓN DE SECTOR SALUD")
print("=" * 50)

try:
    with open(xml_file_path, 'r', encoding='utf-8') as f:
        xml_content = f.read()
    
    print(f"📄 Archivo XML leído: {len(xml_content)} caracteres")
    
    # También imprimir una muestra del XML para debug
    print(f"📄 Muestra del XML (primeros 1000 chars):")
    print(xml_content[:1000] + "..." if len(xml_content) > 1000 else xml_content)
    print()
    
    # Parsear el XML
    result = DocumentParser.parse_factura_xml(xml_content)
    
    print(f"✅ Resultado exitoso: {result['success']}")
    
    if result['success']:
        sector_salud = result['data'].get('sector_salud', {})
        print(f"\n🏥 DATOS DEL SECTOR SALUD EXTRAÍDOS:")
        print("-" * 40)
        
        if sector_salud:
            for key, value in sector_salud.items():
                print(f"  {key}: {value}")
        else:
            print("  ⚠️  No se encontraron datos del sector salud")
            
        print(f"\n📊 OTROS DATOS EXTRAÍDOS:")
        print("-" * 30)
        data = result['data']
        for key in ['numero_factura', 'prestador_nombre', 'valor_total']:
            if key in data:
                print(f"  {key}: {data[key]}")
    else:
        print(f"❌ Errores: {result['errors']}")

except Exception as e:
    print(f"❌ Error ejecutando prueba: {e}")