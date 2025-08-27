import xml.etree.ElementTree as ET
import os
import json

# Lista de archivos XML
xml_files = [
    '../context/pruebas_medicalenergy/A01E5754/A01E5754.xml',
    '../context/pruebas_medicalenergy/A01E5755/A01E5755.xml',
    '../context/pruebas_medicalenergy/A01E5756/A01E5756.xml',
    '../context/pruebas_medicalenergy/A01E5757/A01E5757.xml',
    '../context/pruebas_medicalenergy/A01E5758/A01E5758.xml',
    '../context/pruebas_medicalenergy/A01E5759/A01E5759.xml',
    '../context/pruebas_medicalenergy/A01E5760/A01E5760.xml',
    '../context/pruebas_medicalenergy/A01E5761/A01E5761.xml',
]

servicios_unicos = {}

print('Extrayendo servicios de facturas XML...')

for xml_file in xml_files:
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        # Buscar en el CDATA
        for desc in root.iter():
            if desc.tag.endswith('Description') and desc.text and '<InvoiceLine>' in desc.text:
                inner_xml = desc.text
                inner_root = ET.fromstring(inner_xml)
                
                # Namespaces
                ns = {
                    'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                    'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
                }
                
                # Buscar cada línea
                for line in inner_root.findall('.//cac:InvoiceLine', ns):
                    # Código
                    id_elem = line.find('.//cac:Item/cac:StandardItemIdentification/cbc:ID', ns)
                    codigo = id_elem.text if id_elem is not None else None
                    
                    # Descripción
                    desc_elem = line.find('.//cac:Item/cbc:Description', ns)
                    descripcion = desc_elem.text if desc_elem is not None else None
                    
                    # Precio
                    price_elem = line.find('.//cac:Price/cbc:PriceAmount', ns)
                    precio = price_elem.text if price_elem is not None else '0'
                    
                    if codigo and codigo not in servicios_unicos:
                        valor_orig = float(precio)
                        valor_desc = valor_orig * 0.8  # SOAT menos 20%
                        servicios_unicos[codigo] = {
                            'descripcion': descripcion,
                            'valor_original': valor_orig,
                            'valor_soat_80': valor_desc
                        }
                        
    except Exception as e:
        print(f'Error procesando {os.path.basename(xml_file)}: {str(e)}')

print(f'\nSERVICIOS ENCONTRADOS: {len(servicios_unicos)}')

# Guardar en archivo
with open('servicios_extraidos.json', 'w') as f:
    json.dump(servicios_unicos, f)

# Mostrar algunos
contador = 0
for codigo, info in servicios_unicos.items():
    if contador < 10:
        print(f'\n{codigo}: {info["descripcion"]}')
        print(f'  Valor original: ${int(info["valor_original"]):,}')
        print(f'  Valor SOAT -20%: ${int(info["valor_soat_80"]):,}')
        contador += 1

print(f'\nTotal servicios únicos extraídos: {len(servicios_unicos)}')