#!/usr/bin/env python3
"""
Script para corregir errores masivos de TypeScript en el proyecto
"""
import os
import re
import glob

def fix_file(filepath):
    """Arreglar errores comunes de TypeScript en un archivo"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Corregir parámetros implícitamente any en map/filter/etc
    patterns = [
        # map, filter, forEach con parámetros sin tipo
        (r'\.map\(\(([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\)\s*=>', r'.map((\1: any, \2: number) =>'),
        (r'\.map\(\(([a-zA-Z_]\w*)\)\s*=>', r'.map((\1: any) =>'),
        (r'\.filter\(\(([a-zA-Z_]\w*)\)\s*=>', r'.filter((\1: any) =>'),
        (r'\.forEach\(\(([a-zA-Z_]\w*)\)\s*=>', r'.forEach((\1: any) =>'),
        (r'\.find\(\(([a-zA-Z_]\w*)\)\s*=>', r'.find((\1: any) =>'),
        (r'\.every\(\(([a-zA-Z_]\w*)\)\s*=>', r'.every((\1: any) =>'),
        (r'\.some\(\(([a-zA-Z_]\w*)\)\s*=>', r'.some((\1: any) =>'),
        
        # Corregir imports no utilizados comunes
        (r'import\s+\{\s*Link\s*\}\s*from\s*[\'"]react-router-dom[\'"];?\s*\n', ''),
        (r'import\s+\{\s*Image\s*\}\s*from\s*[\'"]react-bootstrap[\'"];?\s*\n', ''),
        (r'import\s+\{\s*Form\s*\}\s*from\s*[\'"]react-bootstrap[\'"];?\s*\n', ''),
        
        # Remover variables no utilizadas comunes
        (r'const\s+\[loading\s*,\s*setLoading\]\s*=\s*useState.*;\s*\n', ''),
        (r'const\s+\[error\s*,\s*setError\]\s*=\s*useState.*;\s*\n', ''),
        
        # Corregir Form.Control indeterminate
        (r'indeterminate=\{', 'data-indeterminate={'),
        
        # Corregir width en headers de tabla
        (r'width:\s*[\'"](\d+%)[\'"]', r'style: { width: "\1" }'),
        
        # Agregar tipo any a useState vacíos
        (r'useState\(\[\]\)', r'useState<any[]>([])'),
        (r'useState\(\{\}\)', r'useState<any>({})'),
    ]
    
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)
    
    # 2. Arreglar imports múltiples de react-bootstrap
    def fix_react_bootstrap_imports(content):
        lines = content.split('\n')
        imports_map = {}
        new_lines = []
        
        for line in lines:
            match = re.match(r'import\s*\{\s*([^}]+)\s*\}\s*from\s*[\'"]react-bootstrap[\'"];?', line)
            if match:
                imports = [imp.strip() for imp in match.group(1).split(',')]
                for imp in imports:
                    if imp:
                        imports_map[imp] = True
            else:
                new_lines.append(line)
        
        if imports_map:
            # Insertar un solo import combinado
            all_imports = ', '.join(sorted(imports_map.keys()))
            import_line = f'import {{ {all_imports} }} from "react-bootstrap";'
            
            # Encontrar dónde insertar
            for i, line in enumerate(new_lines):
                if 'import' in line and 'react' in line:
                    new_lines.insert(i + 1, import_line)
                    break
        
        return '\n'.join(new_lines)
    
    content = fix_react_bootstrap_imports(content)
    
    # 3. Limpiar imports no utilizados específicos
    unused_patterns = [
        r'import\s+face\d+\s+from\s*[\'"][^"\']+[\'"];?\s*\n',
        r'import\s+.*google.*\s+from\s*[\'"][^"\']+google[^"\']+[\'"];?\s*\n',
        r'import\s+SimpleBar\s+from\s*[\'"]simplebar-react[\'"];?\s*\n',
        r'import\s+\{\s*FilePond\s*\}\s+from\s*[\'"]react-filepond[\'"];?\s*\n',
        r'import\s+dragula\s+from\s*[\'"]dragula[\'"];?\s*\n',
        r'import\s+Swal\s+from\s*[\'"]sweetalert2[\'"];?\s*\n',
    ]
    
    for pattern in unused_patterns:
        content = re.sub(pattern, '', content)
    
    # Solo guardar si hubo cambios
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """Procesar todos los archivos TypeScript/React"""
    project_root = '/home/adrian_carvajal/Analí®/neuraudit_react/frontend/src'
    
    # Buscar todos los archivos .tsx y .ts
    files = []
    for ext in ['tsx', 'ts']:
        files.extend(glob.glob(f"{project_root}/**/*.{ext}", recursive=True))
    
    print(f"Encontrados {len(files)} archivos para procesar")
    
    fixed_count = 0
    for filepath in files:
        if fix_file(filepath):
            fixed_count += 1
            print(f"✓ Corregido: {os.path.basename(filepath)}")
    
    print(f"\n✅ Total archivos corregidos: {fixed_count}")

if __name__ == "__main__":
    main()