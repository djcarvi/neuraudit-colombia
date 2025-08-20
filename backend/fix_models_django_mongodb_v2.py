#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script mejorado para corregir todos los modelos de djongo a Django MongoDB Backend oficial
NeurAudit Colombia - 30 Julio 2025 - Versión 2
"""

import os
import re
import glob

def fix_model_file_v2(file_path):
    """Corrige un archivo de modelo individual - versión mejorada"""
    print(f"🔧 Corrigiendo: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Guardar contenido original
        original_content = content
        
        # 1. Remover import de ObjectId de bson completamente
        content = re.sub(r'from bson import ObjectId\n?', '', content)
        content = re.sub(r'import.*ObjectId.*\n?', '', content)
        
        # 2. Corregir imports de djongo
        content = re.sub(r'from djongo import models', 'from django.db import models', content)
        
        # 3. Agregar imports correctos de Django MongoDB Backend
        if 'from django_mongodb_backend.fields import' not in content:
            # Buscar donde insertar los imports
            django_import_match = re.search(r'(from django\.db import models)', content)
            if django_import_match:
                import_line = django_import_match.group(1)
                replacement = f"""{import_line}
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel"""
                content = content.replace(import_line, replacement)
        
        # 4. Corregir todos los ObjectIdField con default=ObjectId
        content = re.sub(
            r'(\s+)_?id\s*=\s*models\.ObjectIdField\s*\(\s*primary_key\s*=\s*True\s*,?\s*default\s*=\s*ObjectId\s*\)',
            r'\1id = ObjectIdAutoField(primary_key=True)',
            content
        )
        
        # 5. Corregir ObjectIdField sin default
        content = re.sub(
            r'(\s+)_?id\s*=\s*models\.ObjectIdField\s*\(\s*primary_key\s*=\s*True\s*\)',
            r'\1id = ObjectIdAutoField(primary_key=True)',
            content
        )
        
        # 6. Corregir otros campos ObjectId que no son primary key
        content = re.sub(
            r'(\s+)([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*models\.ObjectIdField\s*\(',
            r'\1\2 = ObjectIdField(',
            content
        )
        
        # 7. Limpiar líneas vacías múltiples
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        # 8. Limpiar imports vacíos o redundantes
        content = re.sub(r'\nfrom datetime import datetime\n\n\n', '\nfrom datetime import datetime\n\n', content)
        
        # Solo escribir si hubo cambios
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Archivo corregido: {file_path}")
            return True
        else:
            print(f"⏩ Sin cambios necesarios: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error procesando {file_path}: {str(e)}")
        return False

def main():
    """Función principal"""
    print("🚀 Iniciando corrección mejorada de modelos Django MongoDB Backend")
    print("=" * 70)
    
    # Buscar todos los archivos models.py
    base_path = "/home/adrian_carvajal/Analí®/neuraudit/backend/apps"
    model_files = glob.glob(f"{base_path}/**/models*.py", recursive=True)
    
    print(f"📁 Encontrados {len(model_files)} archivos de modelos:")
    for file_path in model_files:
        print(f"   📄 {file_path}")
    
    print("\n🔧 Iniciando correcciones mejoradas...")
    print("-" * 50)
    
    corrected_count = 0
    for file_path in model_files:
        if fix_model_file_v2(file_path):
            corrected_count += 1
    
    print("\n" + "=" * 70)
    print(f"✅ Corrección mejorada completada!")
    print(f"📊 Archivos procesados: {len(model_files)}")
    print(f"📊 Archivos corregidos: {corrected_count}")
    print(f"📊 Sin cambios: {len(model_files) - corrected_count}")
    
    if corrected_count > 0:
        print("\n🎯 CAMBIOS REALIZADOS V2:")
        print("   • Removido completamente: from bson import ObjectId")
        print("   • Corregido: djongo → django.db + Django MongoDB Backend")
        print("   • Corregido: _id/id = ObjectIdAutoField(primary_key=True)")
        print("   • Corregido: otros campos ObjectId → ObjectIdField")
        print("   • Agregados: imports oficiales Django MongoDB Backend")
        print("   • Limpiados: imports vacíos y líneas múltiples")

if __name__ == "__main__":
    main()