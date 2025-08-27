#!/usr/bin/env python3
"""
Script mejorado para extraer TODOS los códigos SOAT 2025 del Manual Tarifario
Captura todas las estructuras de tablas diferentes en el documento
"""

import re
import json
import csv
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def clean_number(value: str) -> Optional[float]:
    """Limpia y convierte valores numéricos"""
    if not value:
        return None
    # Remover $ y puntos de miles y espacios
    cleaned = value.replace('$', '').replace('.', '').replace(' ', '').strip()
    # Manejar comas decimales
    cleaned = cleaned.replace(',', '.')
    try:
        return float(cleaned)
    except:
        return None

def identify_table_structure(lines: List[str], start_idx: int) -> str:
    """
    Identifica el tipo de estructura de la tabla
    """
    # Buscar líneas de encabezado
    headers_found = []
    for i in range(start_idx, min(start_idx + 10, len(lines))):
        line = lines[i].strip().upper()
        if 'CÓDIGO' in line:
            headers_found.append('CÓDIGO')
        if 'DESCRIPCIÓN' in line:
            headers_found.append('DESCRIPCIÓN')
        if 'GRUPO QUIRUR' in line:
            headers_found.append('GRUPO_QUIRUR')
        if 'UVB' in line and 'CÓDIGO' in line:
            # Es un encabezado, no un valor
            headers_found.append('UVB_HEADER')
    
    # Determinar estructura
    if 'GRUPO_QUIRUR' in headers_found:
        return 'TIPO_1_GRUPO_QUIRURGICO'
    elif 'UVB_HEADER' in headers_found:
        return 'TIPO_2_UVB_COLUMNA'
    else:
        # Revisar si es tipo 3 (UVB integrado) buscando patrones en las siguientes líneas
        for i in range(start_idx + 5, min(start_idx + 20, len(lines))):
            line = lines[i].strip()
            # Buscar pattern de código seguido de descripción con valor decimal
            if re.match(r'^\d{4,6}$', line):
                # Ver si hay un valor decimal cerca
                for j in range(i + 1, min(i + 5, len(lines))):
                    next_line = lines[j].strip()
                    if re.search(r'\d+,\d+', next_line) and not '$' in next_line:
                        return 'TIPO_3_UVB_INTEGRADO'
        
        return 'TIPO_2_UVB_COLUMNA'  # Default

def extract_table_tipo_1(lines: List[str], start_idx: int, current_table: str, current_section: str) -> List[Dict[str, Any]]:
    """
    Extrae datos de tablas Tipo 1: CÓDIGO | DESCRIPCIÓN | GRUPO QUIRUR. | valores
    """
    records = []
    i = start_idx + 3  # Saltar encabezados
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar fin de tabla
        if not line or 'TABLA' in line or re.match(r'^\d+\.\d+', line):
            break
        
        # Buscar código
        if re.match(r'^\d{4,5}$', line):
            codigo = line
            descripcion = None
            grupo_quirurgico = None
            valor_2023 = None
            valor_2024 = None
            valor_2025 = None
            
            # Buscar elementos siguientes
            j = i + 1
            while j < min(i + 15, len(lines)):
                next_line = lines[j].strip()
                
                # Descripción
                if not descripcion and next_line and not re.match(r'^[\d$.,]+$', next_line) and len(next_line) > 5:
                    descripcion = next_line
                
                # Grupo quirúrgico
                elif descripcion and not grupo_quirurgico and re.match(r'^\d{1,2}$', next_line):
                    grupo_quirurgico = int(next_line)
                
                # Valores monetarios
                elif grupo_quirurgico and '$' in next_line:
                    valor = clean_number(next_line)
                    if valor:
                        if not valor_2023:
                            valor_2023 = valor
                        elif not valor_2024:
                            valor_2024 = valor
                        elif not valor_2025:
                            valor_2025 = valor
                            break
                
                j += 1
            
            if codigo and descripcion and valor_2025:
                records.append({
                    'codigo': codigo,
                    'descripcion': descripcion,
                    'grupo_quirurgico': grupo_quirurgico,
                    'valor_2023_uvt': valor_2023,
                    'valor_2024_uvt': valor_2024,
                    'valor_2025_uvb': valor_2025,
                    'tabla': current_table,
                    'seccion': current_section,
                    'estructura': 'tipo_1_grupo_quirurgico'
                })
        
        i += 1
    
    return records

def extract_table_tipo_2(lines: List[str], start_idx: int, current_table: str, current_section: str) -> List[Dict[str, Any]]:
    """
    Extrae datos de tablas Tipo 2: CÓDIGO | DESCRIPCIÓN | UVB | valores
    """
    records = []
    i = start_idx + 3  # Saltar encabezados
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar fin de tabla
        if not line or 'TABLA' in line or re.match(r'^\d+\.\d+', line):
            break
        
        # Buscar código
        if re.match(r'^\d{4,6}$', line):
            codigo = line
            descripcion = None
            uvb_valor = None
            valor_2023 = None
            valor_2024 = None
            valor_2025 = None
            
            # Buscar elementos siguientes
            j = i + 1
            data_lines = []
            while j < min(i + 15, len(lines)):
                next_line = lines[j].strip()
                if next_line:
                    data_lines.append(next_line)
                j += 1
            
            # Procesar líneas recolectadas
            for idx, data_line in enumerate(data_lines):
                # Descripción
                if not descripcion and not re.match(r'^[\d$.,]+$', data_line) and len(data_line) > 5:
                    descripcion = data_line
                
                # UVB valor (número con coma decimal)
                elif descripcion and not uvb_valor and re.match(r'^\d+,\d+$', data_line):
                    uvb_valor = clean_number(data_line)
                
                # Valores monetarios
                elif descripcion and '$' in data_line:
                    valor = clean_number(data_line)
                    if valor:
                        if not valor_2023:
                            valor_2023 = valor
                        elif not valor_2024:
                            valor_2024 = valor
                        elif not valor_2025:
                            valor_2025 = valor
                            break
            
            if codigo and descripcion and valor_2025:
                records.append({
                    'codigo': codigo,
                    'descripcion': descripcion,
                    'uvb_base': uvb_valor,
                    'valor_2023_uvt': valor_2023,
                    'valor_2024_uvt': valor_2024,
                    'valor_2025_uvb': valor_2025,
                    'tabla': current_table,
                    'seccion': current_section,
                    'estructura': 'tipo_2_uvb_columna'
                })
        
        i += 1
    
    return records

def extract_table_tipo_3(lines: List[str], start_idx: int, current_table: str, current_section: str) -> List[Dict[str, Any]]:
    """
    Extrae datos de tablas Tipo 3: CÓDIGO | DESCRIPCIÓN valor_UVB | valores
    """
    records = []
    i = start_idx + 3  # Saltar encabezados
    
    while i < len(lines) - 10:
        line = lines[i].strip()
        
        # Detectar fin de tabla
        if not line or 'TABLA' in line or re.match(r'^\d+\.\d+', line):
            break
        
        # Buscar código
        if re.match(r'^\d{4,6}$', line):
            codigo = line
            descripcion = None
            uvb_valor = None
            valor_2023 = None
            valor_2024 = None
            valor_2025 = None
            
            # La descripción y UVB están en líneas separadas
            # Buscar descripción en línea siguiente
            if i + 1 < len(lines):
                desc_line = lines[i + 1].strip()
                if desc_line and not re.match(r'^[\d$.,]+$', desc_line):
                    descripcion = desc_line
            
            # Buscar UVB en línea siguiente a la descripción
            if descripcion and i + 2 < len(lines):
                uvb_line = lines[i + 2].strip()
                # Verificar si es un valor decimal con coma
                if re.match(r'^\d+,\d+$', uvb_line):
                    uvb_valor = clean_number(uvb_line)
                    
                    # Buscar valores monetarios
                    j = i + 3
                    valores_encontrados = 0
                    while j < min(i + 15, len(lines)) and valores_encontrados < 6:
                        val_line = lines[j].strip()
                        if '$' in val_line:
                            valor = clean_number(val_line)
                            if valor:
                                valores_encontrados += 1
                                if valores_encontrados <= 2:  # Primeros 2 son 2023
                                    if not valor_2023:
                                        valor_2023 = valor
                                elif valores_encontrados <= 4:  # Siguientes 2 son 2024
                                    if not valor_2024:
                                        valor_2024 = valor
                                else:  # Últimos 2 son 2025
                                    if not valor_2025:
                                        valor_2025 = valor
                        j += 1
            
            if codigo and descripcion and valor_2025:
                records.append({
                    'codigo': codigo,
                    'descripcion': descripcion,
                    'uvb_base': uvb_valor,
                    'valor_2023_uvt': valor_2023,
                    'valor_2024_uvt': valor_2024,
                    'valor_2025_uvb': valor_2025,
                    'tabla': current_table,
                    'seccion': current_section,
                    'estructura': 'tipo_3_uvb_integrado'
                })
        
        i += 1
    
    return records

def extract_soat_codes(file_path: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Extrae TODOS los códigos SOAT del archivo
    """
    logger.info("Iniciando extracción de códigos SOAT...")
    
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
        'laboratorio_clinico': [],
        'conjuntos_integrales': [],
        'otros_servicios': []
    }
    
    current_section = None
    current_table = None
    current_category = None
    table_count = 0
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar secciones principales por numeración
        section_match = re.match(r'^(\d+)\.\s+([A-Z].*)', line)
        if section_match:
            section_num = section_match.group(1)
            section_name = section_match.group(2)
            current_section = f"{section_num}. {section_name}"
            
            # Categorizar por nombre de sección
            if any(x in section_name.upper() for x in ['NEUROCIRUGÍA', 'CIRUGÍA', 'ORTOPEDIA', 'UROLOGÍA']):
                current_category = 'procedimientos_quirurgicos'
            elif 'LABORATORIO' in section_name.upper():
                current_category = 'laboratorio_clinico'
            elif any(x in section_name.upper() for x in ['DIAGNÓSTICO', 'IMAGENOLOGÍA', 'RAYOS']):
                current_category = 'examenes_diagnosticos'
            elif 'CONSULTA' in section_name.upper():
                current_category = 'consultas'
            elif 'ESTANCIA' in line.upper():
                current_category = 'estancias'
            elif 'CONJUNTOS' in section_name.upper():
                current_category = 'conjuntos_integrales'
            else:
                current_category = 'otros_servicios'
            
            logger.info(f"\n📂 Sección encontrada: {current_section} → {current_category}")
        
        # Detectar tablas
        if 'TABLA' in line:
            table_match = re.search(r'TABLA\s+(\d+(?:\.\d+)*(?:\.\d+)?)', line)
            if table_match:
                current_table = f"TABLA {table_match.group(1)}"
                table_count += 1
                
                # Buscar nombre de la tabla
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if next_line and not re.match(r'^[A-Z\s]+$', next_line) and len(next_line) > 10:
                        current_table = f"{current_table} - {next_line}"
                
                logger.info(f"  📊 Procesando: {current_table}")
                
                # Identificar estructura de la tabla
                table_structure = identify_table_structure(lines, i)
                
                # Extraer datos según el tipo
                if table_structure == 'TIPO_1_GRUPO_QUIRURGICO':
                    records = extract_table_tipo_1(lines, i, current_table, current_section)
                elif table_structure == 'TIPO_2_UVB_COLUMNA':
                    records = extract_table_tipo_2(lines, i, current_table, current_section)
                elif table_structure == 'TIPO_3_UVB_INTEGRADO':
                    records = extract_table_tipo_3(lines, i, current_table, current_section)
                else:
                    records = []
                
                # Agregar registros a la categoría correcta
                if records and current_category:
                    results[current_category].extend(records)
                    logger.info(f"    ✓ {len(records)} registros extraídos ({table_structure})")
        
        # Detectar códigos específicos de estancias (38XXX)
        if re.match(r'^38\d{3}$', line):
            codigo = line
            # Buscar descripción y valores
            for j in range(1, 10):
                if i + j >= len(lines):
                    break
                next_line = lines[i + j].strip()
                if 'Habitación' in next_line or 'habitación' in next_line:
                    descripcion = next_line
                    # Buscar valores
                    valores = []
                    for k in range(1, 10):
                        if i + j + k >= len(lines):
                            break
                        val_line = lines[i + j + k].strip()
                        if '$' in val_line or re.match(r'^\d+,\d+$', val_line):
                            valor = clean_number(val_line)
                            if valor:
                                valores.append(valor)
                    
                    if valores and len(valores) >= 4:
                        results['estancias'].append({
                            'codigo': codigo,
                            'descripcion': descripcion,
                            'uvb_base': valores[0] if not '$' in lines[i + j + 1] else None,
                            'valor_2023_uvt': valores[1] if len(valores) > 1 else None,
                            'valor_2024_uvt': valores[2] if len(valores) > 2 else None,
                            'valor_2025_uvb': valores[3] if len(valores) > 3 else None,
                            'tabla': current_table,
                            'seccion': current_section or '46. TARIFAS DE ESTANCIA',
                            'estructura': 'estancia'
                        })
                    break
        
        i += 1
    
    # Post-procesamiento: eliminar duplicados
    for key in results:
        if results[key]:
            seen = set()
            unique_items = []
            for item in results[key]:
                codigo = item.get('codigo', '')
                if codigo and codigo not in seen:
                    seen.add(codigo)
                    unique_items.append(item)
            results[key] = unique_items
    
    logger.info(f"\n📊 Total de tablas procesadas: {table_count}")
    
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
    logger.info(f"\n✓ JSON guardado: {json_file}")
    
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
            logger.info(f"✓ CSV guardado: {csv_file} ({len(datos)} registros)")
    
    # Guardar archivo maestro CSV
    all_records = []
    for tipo, datos in results.items():
        all_records.extend(datos)
    
    if all_records:
        master_csv = f'{output_dir}/soat_2025_maestro_{timestamp}.csv'
        all_fields = set()
        for record in all_records:
            all_fields.update(record.keys())
        
        with open(master_csv, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=sorted(all_fields))
            writer.writeheader()
            writer.writerows(all_records)
        logger.info(f"✓ CSV maestro guardado: {master_csv} ({len(all_records)} registros totales)")
    
    # Estadísticas detalladas
    print("\n" + "="*70)
    print("ESTADÍSTICAS DE EXTRACCIÓN SOAT 2025:")
    print("="*70)
    total = 0
    
    for tipo, datos in results.items():
        count = len(datos)
        total += count
        
        if count > 0:
            print(f"\n✓ {tipo.replace('_', ' ').title()}: {count:,} registros")
            
            # Análisis por estructura para procedimientos
            if tipo == 'procedimientos_quirurgicos':
                estructuras = {}
                for d in datos:
                    est = d.get('estructura', 'sin_estructura')
                    estructuras[est] = estructuras.get(est, 0) + 1
                
                for est, cant in estructuras.items():
                    print(f"  └─ {est}: {cant} registros")
                
                # Estadísticas de valores
                valores_2025 = [d.get('valor_2025_uvb', 0) for d in datos if d.get('valor_2025_uvb')]
                if valores_2025:
                    promedio = sum(valores_2025) / len(valores_2025)
                    minimo = min(valores_2025)
                    maximo = max(valores_2025)
                    print(f"  └─ Valor promedio 2025: ${promedio:,.0f}")
                    print(f"  └─ Rango: ${minimo:,.0f} - ${maximo:,.0f}")
            
            # Mostrar secciones únicas
            secciones = set(d.get('seccion', '') for d in datos if d.get('seccion'))
            if secciones and len(secciones) <= 10:
                print(f"  └─ Secciones: {len(secciones)}")
                for sec in sorted(secciones)[:5]:
                    if sec:
                        print(f"     • {sec[:60]}{'...' if len(sec) > 60 else ''}")
                if len(secciones) > 5:
                    print(f"     • ... y {len(secciones) - 5} más")
        else:
            print(f"\n✗ {tipo.replace('_', ' ').title()}: 0 registros")
    
    print("-"*70)
    print(f"TOTAL GENERAL: {total:,} registros")
    print("\n📋 INFORMACIÓN DEL MANUAL:")
    print("- Decreto 780 de 2016 - Anexo técnico 1")
    print("- Actualizado por Circular 025 del 31/12/2024")
    print("- Vigente desde 01/01/2025")
    print("- Valores 2025 en UVB (Unidad de Valor Básico)")
    print("- Valores 2023-2024 en UVT (Unidad de Valor Tributario)")
    print("\n🏥 Tarifas máximas para auditoría médica en Colombia")
    
    return total

def main():
    """
    Función principal
    """
    file_path = '/home/adrian_carvajal/Analí®/neuraudit_react/context/MANUAL TARIFARIO SOAT.txt'
    output_dir = '/home/adrian_carvajal/Analí®/neuraudit_react/backend/scripts/output'
    
    print("="*70)
    print("EXTRACCIÓN COMPLETA DE CÓDIGOS SOAT 2025")
    print("="*70)
    print(f"Archivo fuente: {file_path}")
    print("Analizando todas las estructuras de tablas...")
    
    # Crear directorio de salida si no existe
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Extraer códigos
    results = extract_soat_codes(file_path)
    
    # Guardar resultados
    total = save_results(results, output_dir)
    
    print(f"\n✅ Extracción completada exitosamente")
    
if __name__ == "__main__":
    main()