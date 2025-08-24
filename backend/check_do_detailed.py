#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script detallado para verificar archivos en Digital Ocean Spaces
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
import boto3
from datetime import datetime

print("\n🔍 VERIFICACIÓN DETALLADA DE DIGITAL OCEAN SPACES")
print("="*60)

try:
    # Crear cliente S3
    s3_client = boto3.client(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )
    
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    print(f"\n📦 Bucket: {bucket_name}")
    
    # Buscar en la ruta del NIT 901019681
    nit_path = "neuraudit/radicaciones/2025/08/22/901019681/"
    print(f"\n📂 Buscando archivos en la ruta del NIT: {nit_path}")
    
    try:
        response = s3_client.list_objects_v2(
            Bucket=bucket_name,
            Prefix=nit_path,
            Delimiter='/'
        )
        
        # Listar carpetas
        if 'CommonPrefixes' in response:
            print(f"\n📁 Carpetas encontradas:")
            for prefix in response['CommonPrefixes']:
                carpeta = prefix['Prefix'].split('/')[-2]
                print(f"   - {carpeta}/")
        
        # Listar archivos
        if 'Contents' in response:
            print(f"\n📄 Archivos encontrados directamente en {nit_path}:")
            for obj in response['Contents']:
                if obj['Key'] != nit_path:  # Excluir la carpeta misma
                    nombre = obj['Key'].replace(nit_path, '')
                    print(f"   - {nombre} ({obj['Size']:,} bytes)")
        else:
            print(f"\n⚠️ No se encontraron archivos directamente en esta ruta")
        
        # Buscar en todas las subcarpetas
        print(f"\n🔍 Buscando en todas las subcarpetas...")
        response_all = s3_client.list_objects_v2(
            Bucket=bucket_name,
            Prefix=nit_path
        )
        
        if 'Contents' in response_all:
            archivos_por_carpeta = {}
            
            for obj in response_all['Contents']:
                # Extraer la carpeta del path
                path_parts = obj['Key'].replace(nit_path, '').split('/')
                if len(path_parts) > 1:
                    carpeta = path_parts[0]
                    archivo = path_parts[-1]
                    
                    if carpeta not in archivos_por_carpeta:
                        archivos_por_carpeta[carpeta] = []
                    
                    archivos_por_carpeta[carpeta].append({
                        'nombre': archivo,
                        'size': obj['Size'],
                        'key': obj['Key'],
                        'modified': obj['LastModified']
                    })
            
            # Mostrar archivos por carpeta
            for carpeta, archivos in archivos_por_carpeta.items():
                print(f"\n📁 Carpeta: {carpeta}/")
                print(f"   Total archivos: {len(archivos)}")
                for archivo in archivos:
                    print(f"   - {archivo['nombre']} ({archivo['size']:,} bytes)")
                    
                    # Identificar tipo
                    nombre_upper = archivo['nombre'].upper()
                    if 'FE' in nombre_upper and '.XML' in nombre_upper:
                        print(f"     📄 Tipo: FACTURA XML")
                    elif 'RIPS' in nombre_upper and '.JSON' in nombre_upper:
                        print(f"     📊 Tipo: ARCHIVO RIPS")
                    elif 'CUV' in nombre_upper:
                        print(f"     🔐 Tipo: CUV")
                    elif '.PDF' in nombre_upper:
                        print(f"     📑 Tipo: SOPORTE PDF")
                    
                    # URL completa
                    url = f"https://{bucket_name}.{settings.AWS_S3_REGION_NAME}.digitaloceanspaces.com/{archivo['key']}"
                    print(f"     🌐 URL: {url}")
            
            # Resumen
            print(f"\n📊 RESUMEN:")
            print(f"   Total carpetas: {len(archivos_por_carpeta)}")
            print(f"   Total archivos: {len(response_all['Contents'])}")
            
            # Buscar archivos principales
            print(f"\n🎯 ARCHIVOS PRINCIPALES:")
            xml_found = False
            json_found = False
            
            for obj in response_all['Contents']:
                nombre = obj['Key'].split('/')[-1].upper()
                if 'FE' in nombre and '.XML' in nombre:
                    print(f"   ✅ Factura XML: {obj['Key']}")
                    xml_found = True
                elif 'RIPS' in nombre and '.JSON' in nombre:
                    print(f"   ✅ RIPS JSON: {obj['Key']}")
                    json_found = True
            
            if not xml_found:
                print(f"   ❌ No se encontró factura XML")
            if not json_found:
                print(f"   ❌ No se encontró RIPS JSON")
                
        else:
            print(f"\n❌ No se encontraron archivos en ninguna subcarpeta")
            
    except Exception as e:
        print(f"\n❌ Error listando archivos: {str(e)}")
        
        # Intentar rutas alternativas
        print(f"\n🔄 Intentando rutas alternativas...")
        
        # Buscar en todo el día
        day_path = "neuraudit/radicaciones/2025/08/22/"
        response_day = s3_client.list_objects_v2(
            Bucket=bucket_name,
            Prefix=day_path,
            MaxKeys=50
        )
        
        if 'Contents' in response_day:
            print(f"\n📅 Archivos encontrados en {day_path}:")
            nits = set()
            for obj in response_day['Contents']:
                path_parts = obj['Key'].replace(day_path, '').split('/')
                if path_parts[0]:
                    nits.add(path_parts[0])
            
            print(f"   NITs con archivos hoy: {', '.join(nits)}")
            
            # Mostrar archivos del NIT 901019681
            for obj in response_day['Contents']:
                if '901019681' in obj['Key']:
                    print(f"   - {obj['Key']}")
    
    print(f"\n✅ Verificación completada")
    
except Exception as e:
    print(f"\n❌ Error general: {str(e)}")
    import traceback
    traceback.print_exc()