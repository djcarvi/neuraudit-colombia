#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar archivos en Digital Ocean Spaces
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica
from django.conf import settings
import boto3
from datetime import datetime

# Buscar la radicación
numero_radicado = "RAD-901019681-20250822-04"
print(f"\n🔍 Verificando archivos en Digital Ocean Spaces para: {numero_radicado}")

try:
    # Configurar cliente S3 para Digital Ocean Spaces
    s3_client = boto3.client(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )
    
    # Buscar archivos en el path esperado
    prefix = 'neuraudit/radicaciones/2025/08/22/901019681/'
    print(f"\n📂 Buscando archivos en bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"   Prefix: {prefix}")
    
    response = s3_client.list_objects_v2(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Prefix=prefix
    )
    
    archivos_encontrados = []
    if 'Contents' in response:
        print(f"\n✅ ARCHIVOS ENCONTRADOS EN DIGITAL OCEAN SPACES:")
        print(f"   Total: {len(response['Contents'])} archivos")
        print(f"\n{'='*80}")
        
        for idx, obj in enumerate(response['Contents'], 1):
            archivo = {
                'key': obj['Key'],
                'size': obj['Size'],
                'last_modified': obj['LastModified'],
                'nombre': obj['Key'].split('/')[-1],
                'carpeta': obj['Key'].split('/')[-2]
            }
            archivos_encontrados.append(archivo)
            
            print(f"\n{idx}. {archivo['nombre']}")
            print(f"   Tamaño: {archivo['size']:,} bytes")
            print(f"   Carpeta: {archivo['carpeta']}")
            print(f"   Modificado: {archivo['last_modified'].strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Identificar tipo de archivo
            nombre_upper = archivo['nombre'].upper()
            if 'FE' in nombre_upper and '.XML' in nombre_upper:
                print(f"   Tipo: 📄 FACTURA ELECTRÓNICA XML")
            elif 'RIPS' in nombre_upper and '.JSON' in nombre_upper:
                print(f"   Tipo: 📊 ARCHIVO RIPS JSON")
            elif 'CUV' in nombre_upper:
                print(f"   Tipo: 🔐 CÓDIGO ÚNICO DE VALIDACIÓN")
            elif '.PDF' in nombre_upper:
                print(f"   Tipo: 📑 SOPORTE PDF")
            
            # URL pública
            url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.{settings.AWS_S3_REGION_NAME}.digitaloceanspaces.com/{archivo['key']}"
            print(f"   URL: {url}")
        
        print(f"\n{'='*80}")
        
        # Resumen por tipo
        print(f"\n📊 RESUMEN POR TIPO:")
        xml_count = sum(1 for a in archivos_encontrados if '.XML' in a['nombre'].upper())
        json_count = sum(1 for a in archivos_encontrados if '.JSON' in a['nombre'].upper())
        pdf_count = sum(1 for a in archivos_encontrados if '.PDF' in a['nombre'].upper())
        
        print(f"   - Archivos XML: {xml_count}")
        print(f"   - Archivos JSON: {json_count}")
        print(f"   - Archivos PDF: {pdf_count}")
        
        # Actualizar la radicación con las URLs
        print(f"\n🔧 Actualizando radicación en base de datos...")
        radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
        
        urls_actualizadas = []
        for archivo in archivos_encontrados:
            nombre = archivo['nombre'].upper()
            url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.{settings.AWS_S3_REGION_NAME}.digitaloceanspaces.com/{archivo['key']}"
            
            if 'FE' in nombre and '.XML' in nombre:
                radicacion.factura_url = url
                urls_actualizadas.append("Factura XML")
            elif 'RIPS' in nombre and '.JSON' in nombre:
                radicacion.rips_url = url
                urls_actualizadas.append("RIPS JSON")
        
        if urls_actualizadas:
            radicacion.save()
            print(f"   ✅ URLs actualizadas: {', '.join(urls_actualizadas)}")
        else:
            print(f"   ⚠️ No se encontraron archivos principales para actualizar")
        
    else:
        print(f"\n❌ NO SE ENCONTRARON ARCHIVOS en el path especificado")
        print(f"   Esto puede significar que:")
        print(f"   1. Los archivos no se subieron correctamente")
        print(f"   2. El path es diferente al esperado")
        print(f"   3. Hay un problema de permisos")
        
        # Intentar listar todo el bucket para debug
        print(f"\n🔍 Listando archivos recientes en todo el bucket...")
        response_all = s3_client.list_objects_v2(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Prefix='neuraudit/radicaciones/2025/08/22/',
            MaxKeys=10
        )
        
        if 'Contents' in response_all:
            print(f"   Archivos encontrados en 2025/08/22:")
            for obj in response_all['Contents'][:5]:
                print(f"   - {obj['Key']}")
    
    print(f"\n✅ Verificación completada")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()