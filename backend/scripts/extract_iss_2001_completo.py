#!/usr/bin/env python3
"""
Script mejorado para extraer TODOS los códigos ISS 2001 del Manual de Tarifas
Incluye: procedimientos quirúrgicos, diagnósticos, consultas, estancias, conjuntos integrales
"""

import re
import json
import csv
from typing import List, Dict, Any, Optional
from datetime import datetime

def clean_number(value: str) -> Optional[float]:
    """Limpia y convierte valores numéricos"""
    if not value:
        return None
    # Remover puntos de miles
    cleaned = value.replace('.', '').strip()
    # Intentar convertir
    try:
        return float(cleaned)
    except:
        return None

def extract_iss_codes_complete(file_path: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Extrae TODOS los códigos ISS del archivo de texto
    """
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    results = {
        'procedimientos_quirurgicos': [],
        'examenes_diagnosticos': [],
        'consultas': [],
        'internacion': [],
        'servicios_profesionales': [],
        'derechos_sala': [],
        'conjuntos_integrales': [],
        'otros_servicios': []
    }
    
    current_section = None
    current_subsection = None
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar secciones principales
        if 'CAPITULO I – LISTADO DE INTERVENCIONES' in line or 'LISTADO DE INTERVENCIONES' in line:
            current_section = 'quirurgico'
        elif 'CAPITULO II – EXAMENES DE DIAGNOSTICO' in line or 'EXAMENES DE DIAGNOSTICO' in line:
            current_section = 'diagnostico'
        elif 'CAPITULO III' in line:
            current_section = 'estancia_servicios'
        elif 'CAPITULO IV' in line or 'CONJUNTOS' in line:
            current_section = 'conjuntos'
        elif 'INTERNACION' in line and 'GENERAL' in lines[i+1] if i+1 < len(lines) else False:
            current_section = 'internacion'
        elif 'CONSULTA' in line and 'POR' in line:
            current_section = 'consultas'
        elif 'DERECHOS DE SALA' in line:
            current_section = 'derechos_sala'
        elif 'SERVICIOS PROFESIONALES' in line:
            current_section = 'servicios_prof'
        
        # Procesar según la sección
        if current_section == 'quirurgico':
            # Patrón para procedimientos quirúrgicos (REF de 5 dígitos)
            if re.match(r'^[0-9M]\d{4,5}$', line):
                ref_code = line
                codigo = None
                descripcion = None
                uvr = None
                
                # Buscar elementos siguientes
                for j in range(1, 15):
                    if i + j >= len(lines):
                        break
                    next_line = lines[i + j].strip()
                    
                    # Buscar código (6 dígitos)
                    if re.match(r'^\d{6}$', next_line) and not codigo:
                        codigo = next_line
                    # Buscar descripción (texto después del código)
                    elif codigo and not descripcion and next_line and not re.match(r'^[\d.]+$', next_line) and next_line != 'PB':
                        descripcion = next_line
                    # Buscar UVR (número después de la descripción)
                    elif descripcion and not uvr and re.match(r'^[\d.]+$', next_line):
                        uvr = clean_number(next_line)
                        
                        if codigo and descripcion and uvr is not None:
                            results['procedimientos_quirurgicos'].append({
                                'ref': ref_code,
                                'codigo': codigo,
                                'descripcion': descripcion,
                                'uvr': uvr,
                                'tipo': 'quirurgico'
                            })
                            break
        
        elif current_section == 'diagnostico':
            # Patrón para exámenes diagnósticos (REF de 7 dígitos o con letras)
            if re.match(r'^\d{7}$', line) or re.match(r'^[A-Z]?\d{6,7}$', line):
                ref_code = line
                codigo = None
                descripcion = None
                valor = None
                
                # Buscar elementos siguientes
                for j in range(1, 15):
                    if i + j >= len(lines):
                        break
                    next_line = lines[i + j].strip()
                    
                    # Buscar código
                    if re.match(r'^[A-Z]?\d{5,6}$', next_line) and not codigo and next_line != 'PB':
                        codigo = next_line
                    # Buscar descripción
                    elif codigo and not descripcion and next_line and not re.match(r'^[\d.]+$', next_line) and next_line != 'PB':
                        descripcion = next_line
                    # Buscar valor
                    elif descripcion and not valor:
                        num_val = clean_number(next_line)
                        if num_val is not None:
                            valor = int(num_val)
                            
                            results['examenes_diagnosticos'].append({
                                'ref': ref_code,
                                'codigo': codigo,
                                'descripcion': descripcion,
                                'valor': valor,
                                'tipo': 'diagnostico'
                            })
                            break
        
        elif current_section == 'internacion' or 'HABITACION' in line:
            # Buscar patrones de habitación/internación
            for j in range(-5, 10):
                if i + j < 0 or i + j >= len(lines):
                    continue
                check_line = lines[i + j].strip()
                
                # Buscar código S##### o similar
                if re.match(r'^S\d{5}$', check_line):
                    codigo = check_line
                    # Buscar descripción y valor
                    for k in range(1, 10):
                        if i + j + k >= len(lines):
                            break
                        desc_line = lines[i + j + k].strip()
                        if 'HABITACION' in desc_line or 'CAMA' in desc_line:
                            descripcion = desc_line
                            # Buscar valor
                            for m in range(1, 5):
                                if i + j + k + m >= len(lines):
                                    break
                                val_line = lines[i + j + k + m].strip()
                                val_clean = clean_number(val_line)
                                if val_clean:
                                    results['internacion'].append({
                                        'codigo': codigo,
                                        'descripcion': descripcion,
                                        'valor': int(val_clean),
                                        'tipo': 'internacion'
                                    })
                                    break
                            break
        
        elif current_section == 'consultas' or ('CONSULTA' in line and 'POR' in line):
            # Buscar patrones de consulta
            if 'CONSULTA' in line and ('PRIMERA VEZ' in line or 'CONTROL' in line or 'SEGUIMIENTO' in line):
                descripcion = line
                codigo = None
                valor = None
                
                # Buscar código antes
                for k in range(1, 10):
                    if i - k >= 0:
                        prev_line = lines[i - k].strip()
                        if re.match(r'^\d{6}$', prev_line):
                            codigo = prev_line
                            break
                
                # Buscar valor después
                if codigo:
                    for m in range(1, 10):
                        if i + m < len(lines):
                            val_line = lines[i + m].strip()
                            val_clean = clean_number(val_line)
                            if val_clean:
                                valor = int(val_clean)
                                
                                # Evitar duplicados
                                exists = any(
                                    item['codigo'] == codigo and item['descripcion'] == descripcion 
                                    for item in results['consultas']
                                )
                                
                                if not exists and codigo and descripcion and valor:
                                    results['consultas'].append({
                                        'codigo': codigo,
                                        'descripcion': descripcion,
                                        'valor': valor,
                                        'tipo': 'consulta'
                                    })
                                break
        
        elif current_section == 'conjuntos':
            # Buscar conjuntos integrales con código específico
            if re.match(r'^S\d{5}$', line) or re.match(r'^\d{5}$', line):
                codigo = line
                descripcion = None
                valor = None
                
                # Buscar descripción y valor
                for j in range(1, 10):
                    if i + j >= len(lines):
                        break
                    next_line = lines[i + j].strip()
                    
                    if not descripcion and next_line and not re.match(r'^[\d.]+$', next_line) and next_line != 'PB':
                        # Buscar líneas que parecen descripciones de conjuntos
                        if 'CONJUNTO' in next_line or 'PARTO' in next_line or 'CIRUGIA' in next_line:
                            descripcion = next_line
                    elif descripcion and not valor:
                        val_clean = clean_number(next_line)
                        if val_clean:
                            valor = int(val_clean)
                            results['conjuntos_integrales'].append({
                                'codigo': codigo,
                                'descripcion': descripcion,
                                'valor': valor,
                                'tipo': 'conjunto_integral'
                            })
                            break
        
        i += 1
    
    # Post-procesamiento: eliminar duplicados
    for key in results:
        if results[key]:
            # Crear conjunto único basado en código y descripción
            seen = set()
            unique_items = []
            for item in results[key]:
                # Crear identificador único
                if 'codigo' in item:
                    identifier = f"{item.get('codigo', '')}_{item.get('descripcion', '')}"
                    if identifier not in seen:
                        seen.add(identifier)
                        unique_items.append(item)
                else:
                    unique_items.append(item)
            results[key] = unique_items
    
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
                writer = csv.DictWriter(f, fieldnames=datos[0].keys())
                writer.writeheader()
                writer.writerows(datos)
            print(f"✓ CSV guardado: {csv_file} ({len(datos)} registros)")
    
    # Guardar archivo maestro CSV con todos los registros
    all_records = []
    for tipo, datos in results.items():
        all_records.extend(datos)
    
    if all_records:
        master_csv = f'{output_dir}/iss_2001_maestro_{timestamp}.csv'
        # Obtener todos los campos posibles
        all_fields = set()
        for record in all_records:
            all_fields.update(record.keys())
        
        with open(master_csv, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=sorted(all_fields))
            writer.writeheader()
            writer.writerows(all_records)
        print(f"✓ CSV maestro guardado: {master_csv} ({len(all_records)} registros totales)")
    
    # Estadísticas detalladas
    print("\n" + "="*60)
    print("ESTADÍSTICAS DE EXTRACCIÓN ISS 2001 - VERSIÓN COMPLETA:")
    print("="*60)
    total = 0
    for tipo, datos in results.items():
        count = len(datos)
        total += count
        if count > 0:
            print(f"✓ {tipo.replace('_', ' ').title()}: {count:,} registros")
        else:
            print(f"✗ {tipo.replace('_', ' ').title()}: 0 registros")
    print("-"*60)
    print(f"TOTAL GENERAL: {total:,} registros")
    
    # Resumen de valores
    print("\nVALOR UVR (Artículo 59):")
    print("- Especialistas quirúrgicos: $1,270 por UVR")
    print("- Anestesiólogos: $960 por UVR") 
    print("- Ayudante quirúrgico: $360 por UVR")
    print("- Médico/Odontólogo general: $810 por UVR")
    
    return total

def main():
    """
    Función principal
    """
    file_path = '/home/adrian_carvajal/Analí®/neuraudit_react/context/MANUAL ISS 2001.txt'
    output_dir = '/home/adrian_carvajal/Analí®/neuraudit_react/backend/scripts/output'
    
    print("="*60)
    print("EXTRACCIÓN COMPLETA DE CÓDIGOS ISS 2001")
    print("="*60)
    print(f"Archivo fuente: {file_path}")
    print("Procesando todos los capítulos...")
    print()
    
    # Crear directorio de salida si no existe
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Extraer códigos
    results = extract_iss_codes_complete(file_path)
    
    # Guardar resultados
    total = save_results(results, output_dir)
    
    print(f"\n✅ Extracción completada exitosamente")
    print("📋 Nota: Medicamentos y dispositivos médicos se pagan por precio de adquisición + 12%")
    
if __name__ == "__main__":
    main()