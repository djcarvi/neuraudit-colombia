#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script simple para verificar Digital Ocean Spaces
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import boto3
from datetime import datetime

print("\n🔍 VERIFICACIÓN SIMPLE DE DIGITAL OCEAN SPACES")
print("="*60)

# Configuración directa
BUCKET = 'neuralytic'
REGION = 'nyc3'
ENDPOINT = f'https://{REGION}.digitaloceanspaces.com'
ACCESS_KEY = 'DO00ZQP9KAQLRG7UXNZH'
SECRET_KEY = 'Txlct66j8M1vRxDLlsh5xCF2wgsumi3a7LtxS8EWQPM'

print(f"\n📋 Configuración:")
print(f"   Endpoint: {ENDPOINT}")
print(f"   Bucket: {BUCKET}")
print(f"   Region: {REGION}")

try:
    # Crear cliente S3
    s3 = boto3.client(
        's3',
        endpoint_url=ENDPOINT,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name=REGION
    )
    
    # Probar conexión listando el bucket
    print(f"\n🔌 Conectando al bucket...")
    
    # Listar archivos en neuraudit/radicaciones/2025/08/22/901019681/
    prefix = 'neuraudit/radicaciones/2025/08/22/901019681/'
    print(f"\n📂 Buscando archivos en: {prefix}")
    
    response = s3.list_objects_v2(
        Bucket=BUCKET,
        Prefix=prefix
    )
    
    if 'Contents' in response:
        print(f"\n✅ ARCHIVOS ENCONTRADOS: {len(response['Contents'])}")
        print("="*60)
        
        for idx, obj in enumerate(response['Contents'], 1):
            # Extraer información del archivo
            key = obj['Key']
            size = obj['Size']
            modified = obj['LastModified']
            
            # Obtener nombre y carpeta
            path_parts = key.replace(prefix, '').split('/')
            if len(path_parts) > 1:
                carpeta = path_parts[0]
                archivo = path_parts[-1]
            else:
                carpeta = '(raíz)'
                archivo = path_parts[0]
            
            print(f"\n{idx}. {archivo}")
            print(f"   Carpeta: {carpeta}")
            print(f"   Tamaño: {size:,} bytes")
            print(f"   Modificado: {modified.strftime('%Y-%m-%d %H:%M:%S')}")
            
            # URL pública
            url = f"https://{BUCKET}.{REGION}.digitaloceanspaces.com/{key}"
            print(f"   URL: {url}")
            
            # Identificar tipo
            nombre_upper = archivo.upper()
            if 'FE' in nombre_upper and '.XML' in nombre_upper:
                print(f"   ✅ TIPO: FACTURA ELECTRÓNICA XML")
            elif 'RIPS' in nombre_upper and '.JSON' in nombre_upper:
                print(f"   ✅ TIPO: ARCHIVO RIPS JSON")
            elif 'CUV' in nombre_upper:
                print(f"   ✅ TIPO: CÓDIGO ÚNICO VALIDACIÓN")
            elif '.PDF' in nombre_upper:
                print(f"   ✅ TIPO: SOPORTE PDF")
    else:
        print(f"\n❌ No se encontraron archivos en: {prefix}")
        
        # Intentar listar todo el día
        print(f"\n🔄 Buscando en todo el día...")
        prefix_dia = 'neuraudit/radicaciones/2025/08/22/'
        
        response_dia = s3.list_objects_v2(
            Bucket=BUCKET,
            Prefix=prefix_dia,
            MaxKeys=20
        )
        
        if 'Contents' in response_dia:
            print(f"\n📅 Archivos encontrados hoy:")
            for obj in response_dia['Contents']:
                print(f"   - {obj['Key']}")
        else:
            print(f"   ❌ No hay archivos en todo el día")
    
    # Actualizar la radicación si encontramos archivos
    if 'Contents' in response and len(response['Contents']) > 0:
        print(f"\n🔧 Actualizando radicación en base de datos...")
        
        from apps.radicacion.models import RadicacionCuentaMedica
        
        try:
            radicacion = RadicacionCuentaMedica.objects.get(numero_radicado="RAD-901019681-20250822-04")
            
            # Buscar y asignar URLs
            for obj in response['Contents']:
                key = obj['Key']
                nombre = key.split('/')[-1].upper()
                url = f"https://{BUCKET}.{REGION}.digitaloceanspaces.com/{key}"
                
                if 'FE' in nombre and '.XML' in nombre:
                    radicacion.factura_url = url
                    print(f"   ✅ URL Factura actualizada")
                elif 'RIPS' in nombre and '.JSON' in nombre:
                    radicacion.rips_url = url
                    print(f"   ✅ URL RIPS actualizada")
            
            radicacion.save()
            print(f"   ✅ Radicación actualizada exitosamente")
            
        except Exception as e:
            print(f"   ❌ Error actualizando radicación: {e}")
    
    print(f"\n✅ Verificación completada")
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print(f"   Tipo: {type(e).__name__}")
    
    # Si es error de credenciales
    if 'InvalidAccessKeyId' in str(e):
        print(f"\n⚠️ Las credenciales de acceso parecen ser inválidas")
    elif 'SignatureDoesNotMatch' in str(e):
        print(f"\n⚠️ La firma de autenticación no coincide")
    elif 'NoSuchBucket' in str(e):
        print(f"\n⚠️ El bucket '{BUCKET}' no existe o no es accesible")
    
    import traceback
    traceback.print_exc()