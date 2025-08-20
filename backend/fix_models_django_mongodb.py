#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para corregir todos los modelos de djongo a Django MongoDB Backend oficial
NeurAudit Colombia - 30 Julio 2025
"""

import os
import re
import glob

def fix_model_file(file_path):
    """Corrige un archivo de modelo individual"""
    print(f"🔧 Corrigiendo: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Guardar contenido original
        original_content = content
        
        # 1. Corregir imports
        content = re.sub(
            r'from djongo import models',
            'from django.db import models',
            content
        )
        
        content = re.sub(
            r'from bson import ObjectId',
            '',
            content
        )
        
        # Agregar imports de Django MongoDB Backend si no existen
        if 'from django_mongodb_backend.fields import' not in content:
            # Insertar después de los imports de Django
            django_import_pattern = r'(from django\.db import models)'
            replacement = r'\1\nfrom django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField\nfrom django_mongodb_backend.models import EmbeddedModel'
            content = re.sub(django_import_pattern, replacement, content)
        
        # 2. Corregir ObjectIdField a ObjectIdAutoField para primary keys
        content = re.sub(
            r'_id = models\.ObjectIdField\(primary_key=True,?\s*default=ObjectId\)',
            'id = ObjectIdAutoField(primary_key=True)',
            content
        )
        
        # 3. Corregir otros _id a ObjectIdAutoField
        content = re.sub(
            r'_id = models\.ObjectIdField\([^)]*\)',
            'id = ObjectIdAutoField(primary_key=True)',
            content
        )
        
        # 4. Limpiar imports vacíos
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)  # Múltiples líneas vacías
        content = re.sub(r'from datetime import datetime\n\n\n', 'from datetime import datetime\n\n', content)
        
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
    print("🚀 Iniciando corrección de modelos Django MongoDB Backend")
    print("=" * 60)
    
    # Buscar todos los archivos models.py
    base_path = "/home/adrian_carvajal/Analí®/neuraudit/backend/apps"
    model_files = glob.glob(f"{base_path}/**/models*.py", recursive=True)
    
    print(f"📁 Encontrados {len(model_files)} archivos de modelos:")
    for file_path in model_files:
        print(f"   📄 {file_path}")
    
    print("\n🔧 Iniciando correcciones...")
    print("-" * 40)
    
    corrected_count = 0
    for file_path in model_files:
        if fix_model_file(file_path):
            corrected_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Corrección completada!")
    print(f"📊 Archivos procesados: {len(model_files)}")
    print(f"📊 Archivos corregidos: {corrected_count}")
    print(f"📊 Sin cambios: {len(model_files) - corrected_count}")
    
    if corrected_count > 0:
        print("\n🎯 CAMBIOS REALIZADOS:")
        print("   • djongo → django.db")
        print("   • ObjectIdField → ObjectIdAutoField (para primary keys)")
        print("   • _id → id")
        print("   • Agregados imports Django MongoDB Backend")
        
        print("\n⚠️  PRÓXIMOS PASOS:")
        print("   1. Verificar que todos los modelos compilen")
        print("   2. Ejecutar makemigrations")
        print("   3. Revisar subdocumentos embebidos manualmente")
        print("   4. Agregar ArrayField y EmbeddedModelField donde sea necesario")

if __name__ == "__main__":
    main()