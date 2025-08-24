#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para probar la conexión con Digital Ocean Spaces
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
import boto3
from botocore.exceptions import ClientError

print("\n🔧 PRUEBA DE CONEXIÓN CON DIGITAL OCEAN SPACES")
print("="*60)

# Mostrar configuración
print("\n📋 Configuración actual:")
print(f"   Endpoint: {settings.AWS_S3_ENDPOINT_URL}")
print(f"   Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
print(f"   Region: {settings.AWS_S3_REGION_NAME}")
print(f"   Access Key: {settings.AWS_ACCESS_KEY_ID[:10]}..." if settings.AWS_ACCESS_KEY_ID else "NO CONFIGURADO")

try:
    # Crear cliente S3
    print("\n🔌 Conectando con Digital Ocean Spaces...")
    s3_client = boto3.client(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )
    
    # Probar listar buckets
    print("\n📦 Verificando acceso a buckets...")
    response = s3_client.list_buckets()
    print(f"   ✅ Conexión exitosa!")
    print(f"   Buckets disponibles: {[b['Name'] for b in response['Buckets']]}")
    
    # Probar acceso al bucket específico
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    print(f"\n📂 Verificando acceso al bucket: {bucket_name}")
    
    try:
        # Listar objetos en el bucket (máximo 10)
        response = s3_client.list_objects_v2(Bucket=bucket_name, MaxKeys=10)
        
        if 'Contents' in response:
            print(f"   ✅ Acceso al bucket confirmado")
            print(f"   Archivos en el bucket: {response['KeyCount']}")
            print("\n   Primeros archivos:")
            for obj in response['Contents'][:5]:
                print(f"   - {obj['Key']} ({obj['Size']} bytes)")
        else:
            print(f"   ⚠️ El bucket está vacío")
            
    except ClientError as e:
        error_code = e.response['Error']['Code']
        print(f"   ❌ Error accediendo al bucket: {error_code}")
        if error_code == 'NoSuchBucket':
            print(f"      El bucket '{bucket_name}' no existe")
        elif error_code == 'AccessDenied':
            print(f"      Sin permisos para acceder al bucket")
    
    # Probar crear un archivo de prueba
    print(f"\n📝 Probando escritura en el bucket...")
    test_key = 'neuraudit/test/connection_test.txt'
    test_content = f'Prueba de conexión - {datetime.now()}'
    
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=test_key,
            Body=test_content.encode('utf-8'),
            ContentType='text/plain'
        )
        print(f"   ✅ Escritura exitosa!")
        print(f"   Archivo creado: {test_key}")
        
        # Generar URL
        url = f"https://{bucket_name}.{settings.AWS_S3_REGION_NAME}.digitaloceanspaces.com/{test_key}"
        print(f"   URL: {url}")
        
        # Eliminar archivo de prueba
        s3_client.delete_object(Bucket=bucket_name, Key=test_key)
        print(f"   🗑️ Archivo de prueba eliminado")
        
    except ClientError as e:
        print(f"   ❌ Error escribiendo en el bucket: {e.response['Error']['Code']}")
    
    # Buscar archivos de hoy
    print(f"\n🔍 Buscando archivos subidos hoy...")
    from datetime import datetime
    today_prefix = f"neuraudit/radicaciones/{datetime.now().strftime('%Y/%m/%d')}/"
    
    response = s3_client.list_objects_v2(
        Bucket=bucket_name,
        Prefix=today_prefix,
        MaxKeys=20
    )
    
    if 'Contents' in response:
        print(f"   ✅ Archivos encontrados hoy: {len(response['Contents'])}")
        for obj in response['Contents']:
            print(f"   - {obj['Key']}")
            print(f"     Tamaño: {obj['Size']} bytes")
            print(f"     Modificado: {obj['LastModified']}")
    else:
        print(f"   ⚠️ No se encontraron archivos subidos hoy en: {today_prefix}")
    
    print(f"\n✅ PRUEBA DE CONEXIÓN COMPLETADA")
    
except Exception as e:
    print(f"\n❌ ERROR DE CONEXIÓN: {str(e)}")
    print(f"   Tipo: {type(e).__name__}")
    import traceback
    traceback.print_exc()

from datetime import datetime