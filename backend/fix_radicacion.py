#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para arreglar la radicación y verificar archivos en DO Spaces
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

# Buscar la radicación
numero_radicado = "RAD-901019681-20250822-04"
print(f"\n🔍 Verificando archivos en Digital Ocean Spaces para: {numero_radicado}")

try:
    # Configurar cliente S3 para Digital Ocean Spaces
    s3_client = boto3.client(
        's3',
        endpoint_url=f'https://{settings.DO_SPACES_REGION}.digitaloceanspaces.com',
        aws_access_key_id=settings.DO_SPACES_KEY,
        aws_secret_access_key=settings.DO_SPACES_SECRET,
        region_name=settings.DO_SPACES_REGION
    )
    
    # Buscar archivos en el path esperado
    prefix = 'neuraudit/radicaciones/2025/08/22/901019681/'
    print(f"\n📂 Buscando archivos en: {prefix}")
    
    response = s3_client.list_objects_v2(
        Bucket=settings.DO_SPACES_BUCKET,
        Prefix=prefix
    )
    
    archivos_encontrados = []
    if 'Contents' in response:
        print(f"\n✅ Archivos encontrados en Digital Ocean Spaces:")
        for obj in response['Contents']:
            archivo = {
                'key': obj['Key'],
                'size': obj['Size'],
                'last_modified': obj['LastModified'],
                'nombre': obj['Key'].split('/')[-1]
            }
            archivos_encontrados.append(archivo)
            print(f"   - {archivo['nombre']} ({archivo['size']} bytes)")
            print(f"     Path: {archivo['key']}")
            
            # Generar URL pública
            url = f"https://{settings.DO_SPACES_BUCKET}.{settings.DO_SPACES_REGION}.digitaloceanspaces.com/{archivo['key']}"
            print(f"     URL: {url}")
    else:
        print(f"\n❌ No se encontraron archivos en el path especificado")
    
    # Actualizar la radicación con las URLs encontradas
    if archivos_encontrados:
        print(f"\n🔧 Actualizando radicación con URLs encontradas...")
        radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
        
        for archivo in archivos_encontrados:
            nombre = archivo['nombre'].upper()
            url = f"https://{settings.DO_SPACES_BUCKET}.{settings.DO_SPACES_REGION}.digitaloceanspaces.com/{archivo['key']}"
            
            if 'XML' in nombre and 'FE' in nombre:
                radicacion.factura_url = url
                print(f"   ✅ URL de factura actualizada")
            elif 'RIPS' in nombre and '.JSON' in nombre:
                radicacion.rips_url = url
                print(f"   ✅ URL de RIPS actualizada")
        
        radicacion.save()
        print(f"\n✅ Radicación actualizada con las URLs de Digital Ocean")
    
    # Procesar el RIPS si existe
    rips_file = next((f for f in archivos_encontrados if 'RIPS' in f['nombre'].upper() and '.JSON' in f['nombre'].upper()), None)
    if rips_file:
        print(f"\n📊 Procesando RIPS desde Digital Ocean...")
        # Descargar y procesar el archivo
        try:
            obj = s3_client.get_object(Bucket=settings.DO_SPACES_BUCKET, Key=rips_file['key'])
            rips_content = obj['Body'].read()
            
            import json
            rips_data = json.loads(rips_content)
            
            print(f"   ✅ RIPS descargado correctamente")
            print(f"   Factura: {rips_data.get('numFactura', 'N/A')}")
            print(f"   NIT: {rips_data.get('numDocumentoIdObligado', 'N/A')}")
            print(f"   Usuarios: {len(rips_data.get('usuarios', []))}")
            
        except Exception as e:
            print(f"   ❌ Error procesando RIPS: {str(e)}")
    
    print(f"\n✅ Verificación completada")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()