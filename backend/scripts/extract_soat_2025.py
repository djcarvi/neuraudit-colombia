#!/usr/bin/env python3
"""
Script para extraer códigos SOAT 2025 del Manual Tarifario SOAT
Extrae todos los procedimientos, servicios y tarifas del Decreto 780 de 2016
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
    # Remover $ y puntos de miles
    cleaned = value.replace('$', '').replace('.', '').strip()
    # Intentar convertir
    try:
        return float(cleaned)
    except:
        return None

def extract_soat_codes(file_path: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Extrae todos los códigos SOAT del archivo de texto
    """
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    results = {
        'procedimientos_quirurgicos': [],
        'examenes_diagnosticos': [],
        'consultas': [],
        'estancias': [],
        'servicios_profesionales': [],
        'derechos_sala': [],
        'materiales': [],
        'otros_servicios': []
    }
    
    current_section = None
    current_table = None
    current_category = None
    in_table = False
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar inicio de tabla
        if 'TABLA' in line and re.search(r'TABLA \d+\.\d+\.\d+', line):
            in_table = True
            current_table = line
            # Buscar nombre de tabla en línea siguiente
            if i + 1 < len(lines):
                table_name = lines[i + 1].strip()
                if table_name and not re.match(r'^[A-Z]+$', table_name):
                    current_table = f"{current_table} - {table_name}"
        
        # Detectar secciones principales por numeración
        if re.match(r'^\d+\.\s+[A-Z]', line):
            # Es una sección principal (ej: "2. NEUROCIRUGÍA")
            current_section = line
            if 'NEUROCIRUGÍA' in line or 'CIRUGÍA' in line:
                current_category = 'procedimientos_quirurgicos'
            elif 'DIAGNÓSTICO' in line or 'LABORATORIO' in line or 'IMAGENOLOGÍA' in line:
                current_category = 'examenes_diagnosticos'
            elif 'CONSULTA' in line:
                current_category = 'consultas'
            elif 'ESTANCIA' in line or 'INTERNACIÓN' in line or 'HABITACIÓN' in line:
                current_category = 'estancias'
            elif 'SERVICIOS PROFESIONALES' in line:
                current_category = 'servicios_profesionales'
            elif 'DERECHOS DE SALA' in line:
                current_category = 'derechos_sala'
            elif 'MATERIALES' in line or 'SUTURA' in line:
                current_category = 'materiales'
            else:
                current_category = 'otros_servicios'
        
        # Detectar fin de tabla
        if in_table and (line == '' or re.match(r'^\d+\.\d+\.', line)):
            in_table = False
        
        # Procesar códigos dentro de tablas
        if in_table and re.match(r'^\d{4,5}$', line):
            codigo = line
            descripcion = None
            grupo_quirurgico = None
            valor_2023_uvt = None
            valor_2024_uvt = None
            valor_2025_uvb = None
            
            # Buscar los datos siguientes
            j = i + 1
            while j < len(lines) and j < i + 15:
                next_line = lines[j].strip()
                
                # Si es descripción (texto que no es número ni UVT/UVB)
                if next_line and not re.match(r'^\d+$', next_line) and not descripcion and \
                   'UVT' not in next_line and 'UVB' not in next_line and '$' not in next_line:
                    descripcion = next_line
                
                # Si es grupo quirúrgico (número solo después de descripción)
                elif descripcion and re.match(r'^\d{1,2}$', next_line) and not grupo_quirurgico:
                    grupo_quirurgico = int(next_line)
                
                # Si es valor monetario con $
                elif '$' in next_line:
                    valor = clean_number(next_line)
                    if valor:
                        # Determinar a qué año corresponde basándose en el orden
                        if not valor_2023_uvt:
                            valor_2023_uvt = valor
                        elif not valor_2024_uvt:
                            valor_2024_uvt = valor
                        elif not valor_2025_uvb:
                            valor_2025_uvb = valor
                            # Ya tenemos todos los datos
                            break
                
                j += 1
            
            # Guardar el registro si tenemos los datos mínimos
            if codigo and descripcion and current_category and valor_2025_uvb:
                record = {
                    'codigo': codigo,
                    'descripcion': descripcion,
                    'grupo_quirurgico': grupo_quirurgico,
                    'valor_2023_uvt': valor_2023_uvt,
                    'valor_2024_uvt': valor_2024_uvt,
                    'valor_2025_uvb': valor_2025_uvb,
                    'seccion': current_section,
                    'tabla': current_table,
                    'tipo': current_category
                }
                results[current_category].append(record)
        
        # Buscar patrones adicionales fuera de tablas (consultas, estancias, etc.)
        # Patrón para códigos S##### (estancias)
        if re.match(r'^S\d{5}$', line):
            codigo = line
            # Buscar descripción y valor
            for j in range(1, 10):
                if i + j >= len(lines):
                    break
                next_line = lines[i + j].strip()
                if 'HABITACIÓN' in next_line or 'UNIDAD' in next_line or 'SERVICIO' in next_line:
                    descripcion = next_line
                    # Buscar valor
                    for k in range(1, 5):
                        if i + j + k >= len(lines):
                            break
                        val_line = lines[i + j + k].strip()
                        if '$' in val_line:
                            valor = clean_number(val_line)
                            if valor:
                                results['estancias'].append({
                                    'codigo': codigo,
                                    'descripcion': descripcion,
                                    'valor': valor,
                                    'seccion': current_section,
                                    'tipo': 'estancia'
                                })
                                break
                    break
        
        # Patrón para códigos de 6 dígitos (consultas y otros servicios)
        if re.match(r'^\d{6}$', line) and i > 0:
            codigo = line
            # Buscar descripción antes o después
            descripcion = None
            valor = None
            
            # Buscar descripción en líneas cercanas
            for j in range(-3, 5):
                if i + j >= 0 and i + j < len(lines):
                    check_line = lines[i + j].strip()
                    if check_line and not re.match(r'^[\d$.,]+$', check_line) and \
                       'UVT' not in check_line and 'UVB' not in check_line and \
                       len(check_line) > 10:
                        descripcion = check_line
                        break
            
            # Buscar valor
            if descripcion:
                for j in range(1, 10):
                    if i + j < len(lines):
                        val_line = lines[i + j].strip()
                        if '$' in val_line:
                            valor = clean_number(val_line)
                            if valor:
                                # Determinar categoría por palabras clave
                                desc_upper = descripcion.upper()
                                if 'CONSULTA' in desc_upper:
                                    cat = 'consultas'
                                elif 'HABITACIÓN' in desc_upper or 'ESTANCIA' in desc_upper:
                                    cat = 'estancias'
                                elif 'DERECHO' in desc_upper and 'SALA' in desc_upper:
                                    cat = 'derechos_sala'
                                else:
                                    cat = 'otros_servicios'
                                
                                results[cat].append({
                                    'codigo': codigo,
                                    'descripcion': descripcion,
                                    'valor': valor,
                                    'seccion': current_section,
                                    'tipo': cat.replace('_', ' ')
                                })
                                break
        
        i += 1
    
    # Post-procesamiento: eliminar duplicados
    for key in results:
        if results[key]:
            # Crear conjunto único basado en código
            seen = set()
            unique_items = []
            for item in results[key]:
                codigo = item.get('codigo', '')
                if codigo and codigo not in seen:
                    seen.add(codigo)
                    unique_items.append(item)
            results[key] = unique_items
    
    return results

def save_results(results: Dict[str, List[Dict[str, Any]]], output_dir: str = '.'):
    """
    Guarda los resultados en múltiples formatos
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Guardar JSON consolidado
    json_file = f'{output_dir}/soat_2025_completo_{timestamp}.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"✓ JSON guardado: {json_file}")
    
    # Guardar CSVs por tipo
    for tipo, datos in results.items():
        if datos:
            csv_file = f'{output_dir}/soat_2025_{tipo}_{timestamp}.csv'
            with open(csv_file, 'w', encoding='utf-8', newline='') as f:
                # Obtener todos los campos presentes
                all_fields = set()
                for record in datos:
                    all_fields.update(record.keys())
                
                writer = csv.DictWriter(f, fieldnames=sorted(all_fields))
                writer.writeheader()
                writer.writerows(datos)
            print(f"✓ CSV guardado: {csv_file} ({len(datos)} registros)")
    
    # Guardar archivo maestro CSV
    all_records = []
    for tipo, datos in results.items():
        all_records.extend(datos)
    
    if all_records:
        master_csv = f'{output_dir}/soat_2025_maestro_{timestamp}.csv'
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
    print("ESTADÍSTICAS DE EXTRACCIÓN SOAT 2025:")
    print("="*60)
    total = 0
    total_valor = 0
    
    for tipo, datos in results.items():
        count = len(datos)
        total += count
        
        # Calcular valor promedio para procedimientos
        if count > 0:
            if tipo == 'procedimientos_quirurgicos':
                valores = [d.get('valor_2025_uvb', 0) for d in datos if d.get('valor_2025_uvb')]
                if valores:
                    promedio = sum(valores) / len(valores)
                    minimo = min(valores)
                    maximo = max(valores)
                    print(f"✓ {tipo.replace('_', ' ').title()}: {count:,} registros")
                    print(f"  └─ Valor promedio 2025: ${promedio:,.0f}")
                    print(f"  └─ Rango: ${minimo:,.0f} - ${maximo:,.0f}")
                else:
                    print(f"✓ {tipo.replace('_', ' ').title()}: {count:,} registros")
            else:
                print(f"✓ {tipo.replace('_', ' ').title()}: {count:,} registros")
        else:
            print(f"✗ {tipo.replace('_', ' ').title()}: 0 registros")
    
    print("-"*60)
    print(f"TOTAL GENERAL: {total:,} registros")
    print("\n📋 NOTA IMPORTANTE:")
    print("- Valores 2025 en UVB (Unidad de Valor Básico)")
    print("- Valores 2023-2024 en UVT (Unidad de Valor Tributario)")
    print("- Decreto 780 de 2016 actualizado por Circular 025 de 31/12/2024")
    
    return total

def main():
    """
    Función principal
    """
    file_path = '/home/adrian_carvajal/Analí®/neuraudit_react/context/MANUAL TARIFARIO SOAT.txt'
    output_dir = '/home/adrian_carvajal/Analí®/neuraudit_react/backend/scripts/output'
    
    print("="*60)
    print("EXTRACCIÓN DE CÓDIGOS SOAT 2025")
    print("="*60)
    print(f"Archivo fuente: {file_path}")
    print("Procesando todas las tablas...")
    print()
    
    # Crear directorio de salida si no existe
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Extraer códigos
    results = extract_soat_codes(file_path)
    
    # Guardar resultados
    total = save_results(results, output_dir)
    
    print(f"\n✅ Extracción completada exitosamente")
    print("🏥 Manual tarifario máximo para auditoría médica")
    
if __name__ == "__main__":
    main()