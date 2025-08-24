#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para probar el storage directamente
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.files.storage import default_storage
from apps.radicacion.storage_config import RadicacionStorage
from django.conf import settings
from datetime import datetime

print("\n🔧 PRUEBA DIRECTA DEL STORAGE DE DJANGO")
print("="*60)

# Usar el storage de radicación
storage = RadicacionStorage()

print(f"\n📋 Información del Storage:")
print(f"   Clase: {storage.__class__.__name__}")
print(f"   Bucket: {storage.bucket_name}")
print(f"   Location: {storage.location}")
print(f"   Base URL: {storage.base_url}")

# Listar archivos en la radicación de hoy
print(f"\n🔍 Listando archivos de hoy...")
today_path = f"radicaciones/{datetime.now().strftime('%Y/%m/%d')}/"

try:
    # Listar directorios
    dirs, files = storage.listdir(today_path)
    
    if dirs:
        print(f"\n📁 Directorios encontrados en {today_path}:")
        for d in dirs:
            print(f"   - {d}/")
            
            # Listar archivos en cada directorio
            try:
                subdirs, subfiles = storage.listdir(f"{today_path}{d}/")
                if subfiles:
                    print(f"     Archivos: {len(subfiles)}")
                    for f in subfiles[:3]:  # Mostrar primeros 3
                        print(f"       • {f}")
            except Exception as e:
                print(f"     Error listando: {e}")
    else:
        print(f"   ⚠️ No se encontraron directorios en {today_path}")
    
    if files:
        print(f"\n📄 Archivos directos en {today_path}:")
        for f in files:
            print(f"   - {f}")
            
except Exception as e:
    print(f"\n❌ Error listando con storage.listdir: {str(e)}")
    print(f"   Tipo: {type(e).__name__}")

# Intentar acceso directo a la carpeta del NIT
print(f"\n🔍 Buscando archivos del NIT 901019681...")
nit_path = f"radicaciones/{datetime.now().strftime('%Y/%m/%d')}/901019681/"

try:
    dirs, files = storage.listdir(nit_path)
    
    print(f"\n📁 Contenido de {nit_path}:")
    
    if dirs:
        print(f"   Carpetas: {', '.join(dirs)}")
        
        # Explorar cada carpeta
        for carpeta in dirs:
            full_path = f"{nit_path}{carpeta}/"
            try:
                subdirs, subfiles = storage.listdir(full_path)
                print(f"\n   📂 {carpeta}/")
                if subfiles:
                    print(f"      Total archivos: {len(subfiles)}")
                    for archivo in subfiles:
                        print(f"      - {archivo}")
                        
                        # Verificar si existe
                        if storage.exists(f"{full_path}{archivo}"):
                            size = storage.size(f"{full_path}{archivo}")
                            print(f"        Tamaño: {size:,} bytes")
                            
                            # Generar URL
                            url = storage.url(f"{full_path}{archivo}")
                            print(f"        URL: {url[:100]}...")
                else:
                    print(f"      (vacía)")
            except Exception as e:
                print(f"      Error: {e}")
    
    if files:
        print(f"\n   Archivos directos:")
        for f in files:
            print(f"   - {f}")
            
except Exception as e:
    print(f"\n⚠️ No se pudo acceder a {nit_path}: {str(e)}")

# Verificar la radicación específica
print(f"\n🎯 Verificando archivos de RAD-901019681-20250822-04...")

# Los archivos deberían estar en una subcarpeta con timestamp
# Buscar todas las subcarpetas posibles
base_path = f"radicaciones/2025/08/22/901019681/"

try:
    if storage.exists(base_path):
        print(f"   ✅ Path base existe: {base_path}")
        
        # Intentar listar todo recursivamente
        def listar_recursivo(path, nivel=0):
            indent = "  " * nivel
            try:
                dirs, files = storage.listdir(path)
                
                for d in dirs:
                    print(f"{indent}📁 {d}/")
                    listar_recursivo(f"{path}{d}/", nivel + 1)
                
                for f in files:
                    print(f"{indent}📄 {f}")
                    
            except Exception as e:
                print(f"{indent}❌ Error: {e}")
        
        print(f"\n📂 Estructura completa:")
        listar_recursivo(base_path)
        
    else:
        print(f"   ❌ El path base no existe: {base_path}")
        
except Exception as e:
    print(f"   ❌ Error verificando: {e}")

print(f"\n✅ Prueba completada")