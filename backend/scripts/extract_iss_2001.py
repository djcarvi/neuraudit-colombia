#!/usr/bin/env python3
"""
Script para extraer códigos ISS 2001 del Manual de Tarifas
Extrae procedimientos quirúrgicos, diagnósticos y consultas
"""

import re
import json
import csv
from typing import List, Dict, Any
from datetime import datetime

def extract_iss_codes(file_path: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Extrae todos los códigos ISS del archivo de texto
    """
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    results = {
        'procedimientos_quirurgicos': [],
        'examenes_diagnosticos': [],
        'consultas': [],
        'internacion': []
    }
    
    current_section = None
    current_subsection = None
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar secciones principales
        if 'CAPITULO I – LISTADO DE INTERVENCIONES' in line:
            current_section = 'quirurgico'
        elif 'CAPITULO II – EXAMENES DE DIAGNOSTICO Y TRATAMIENTO' in line:
            current_section = 'diagnostico'
        elif 'INTERNACION' in line and i + 1 < len(lines) and lines[i+1].strip() == '':
            current_section = 'internacion'
        elif 'CONSULTA' in line and 'POR' in line:
            current_section = 'consultas'
        
        # Detectar códigos según la sección
        if current_section == 'quirurgico':
            # Patrón para procedimientos quirúrgicos (REF de 5 dígitos)
            if re.match(r'^\d{5}$', line):
                ref_code = line
                pb_found = False
                codigo_found = False
                
                # Buscar los siguientes elementos
                for j in range(1, 10):
                    if i + j < len(lines):
                        next_line = lines[i + j].strip()
                        
                        if next_line == 'PB' and not pb_found:
                            pb_found = True
                        elif re.match(r'^\d{6}$', next_line) and pb_found and not codigo_found:
                            codigo = next_line
                            codigo_found = True
                        elif codigo_found and next_line and not next_line.isdigit() and next_line != 'PB':
                            descripcion = next_line
                            # Buscar el UVR
                            for k in range(1, 5):
                                if i + j + k < len(lines):
                                    uvr_line = lines[i + j + k].strip()
                                    if re.match(r'^\d+(\.\d+)?$', uvr_line):
                                        uvr = float(uvr_line)
                                        results['procedimientos_quirurgicos'].append({
                                            'ref': ref_code,
                                            'codigo': codigo,
                                            'descripcion': descripcion,
                                            'uvr': uvr,
                                            'tipo': 'quirurgico'
                                        })
                                        break
                            break
        
        elif current_section == 'diagnostico':
            # Patrón para exámenes diagnósticos (REF de 7 dígitos)
            if re.match(r'^\d{7}$', line):
                ref_code = line
                pb_found = False
                codigo_found = False
                
                # Buscar los siguientes elementos
                for j in range(1, 10):
                    if i + j < len(lines):
                        next_line = lines[i + j].strip()
                        
                        if next_line == 'PB':
                            pb_found = True
                        elif re.match(r'^[A-Z]?\d{5,6}$', next_line) and pb_found and not codigo_found:
                            codigo = next_line
                            codigo_found = True
                        elif codigo_found and next_line and not next_line.isdigit() and next_line != 'PB':
                            descripcion = next_line
                            # Buscar el valor
                            for k in range(1, 5):
                                if i + j + k < len(lines):
                                    valor_line = lines[i + j + k].strip()
                                    # Remover puntos de miles y convertir
                                    valor_clean = valor_line.replace('.', '')
                                    if re.match(r'^\d+$', valor_clean):
                                        valor = int(valor_clean)
                                        results['examenes_diagnosticos'].append({
                                            'ref': ref_code,
                                            'codigo': codigo,
                                            'descripcion': descripcion,
                                            'valor': valor,
                                            'tipo': 'diagnostico'
                                        })
                                        break
                            break
        
        elif current_section == 'consultas' or 'CONSULTA' in line:
            # Buscar patrones de consulta en las próximas líneas
            for j in range(0, 15):
                if i + j < len(lines):
                    check_line = lines[i + j].strip()
                    if 'CONSULTA' in check_line and 'POR' in check_line:
                        # Buscar el código y valor en líneas anteriores
                        for k in range(1, 10):
                            if i + j - k >= 0:
                                prev_line = lines[i + j - k].strip()
                                if re.match(r'^\d{6}$', prev_line):
                                    codigo = prev_line
                                    descripcion = check_line
                                    # Buscar valor después
                                    for m in range(1, 5):
                                        if i + j + m < len(lines):
                                            valor_line = lines[i + j + m].strip()
                                            valor_clean = valor_line.replace('.', '')
                                            if re.match(r'^\d+$', valor_clean):
                                                valor = int(valor_clean)
                                                results['consultas'].append({
                                                    'codigo': codigo,
                                                    'descripcion': descripcion,
                                                    'valor': valor,
                                                    'tipo': 'consulta'
                                                })
                                                break
                                    break
        
        i += 1
    
    return results

def save_results(results: Dict[str, List[Dict[str, Any]]], output_dir: str = '.'):
    """
    Guarda los resultados en múltiples formatos
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Guardar JSON consolidado
    json_file = f'{output_dir}/iss_2001_completo_{timestamp}.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"✓ JSON guardado: {json_file}")
    
    # Guardar CSVs por tipo
    for tipo, datos in results.items():
        if datos:
            csv_file = f'{output_dir}/iss_2001_{tipo}_{timestamp}.csv'
            with open(csv_file, 'w', encoding='utf-8', newline='') as f:
                if datos:
                    writer = csv.DictWriter(f, fieldnames=datos[0].keys())
                    writer.writeheader()
                    writer.writerows(datos)
            print(f"✓ CSV guardado: {csv_file} ({len(datos)} registros)")
    
    # Estadísticas
    print("\nESTADÍSTICAS DE EXTRACCIÓN:")
    print("=" * 50)
    total = 0
    for tipo, datos in results.items():
        count = len(datos)
        total += count
        print(f"{tipo}: {count} registros")
    print(f"TOTAL: {total} registros")
    
    return total

def main():
    """
    Función principal
    """
    file_path = '/home/adrian_carvajal/Analí®/neuraudit_react/context/MANUAL ISS 2001.txt'
    output_dir = '/home/adrian_carvajal/Analí®/neuraudit_react/backend/scripts/output'
    
    print("EXTRACCIÓN DE CÓDIGOS ISS 2001")
    print("=" * 50)
    print(f"Archivo fuente: {file_path}")
    print("Procesando...")
    
    # Crear directorio de salida si no existe
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Extraer códigos
    results = extract_iss_codes(file_path)
    
    # Guardar resultados
    total = save_results(results, output_dir)
    
    print(f"\n✅ Extracción completada exitosamente")
    
if __name__ == "__main__":
    main()