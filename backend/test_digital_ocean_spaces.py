#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test de conexión a Digital Ocean Spaces
NeurAudit Colombia
"""

import os
import sys
import django

# Setup Django
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.storage_config import RadicacionStorage
from django.core.files.base import ContentFile
import boto3
from datetime import datetime


def test_connection():
    """Prueba básica de conexión"""
    print("=" * 60)
    print("PRUEBA DE CONEXIÓN A DIGITAL OCEAN SPACES")
    print("=" * 60)
    
    try:
        storage = RadicacionStorage()
        
        # Mostrar configuración (sin credenciales)
        print(f"\n✅ Configuración:")
        print(f"   Endpoint: {storage.endpoint_url}")
        print(f"   Bucket: {storage.bucket_name}")
        print(f"   Location: {storage.location}")
        print(f"   Region: {storage.region_name}")
        
        # Verificar conexión listando archivos
        print(f"\n🔍 Verificando conexión...")
        
        # Crear cliente S3
        client = boto3.client(
            's3',
            endpoint_url=storage.endpoint_url,
            aws_access_key_id=storage.access_key,
            aws_secret_access_key=storage.secret_key,
            region_name=storage.region_name
        )
        
        # Listar objetos en la carpeta neuraudit/
        response = client.list_objects_v2(
            Bucket=storage.bucket_name,
            Prefix='neuraudit/',
            MaxKeys=5
        )
        
        if response.get('Contents'):
            print(f"✅ Conexión exitosa! Se encontraron {response['KeyCount']} archivos")
            print("\n📁 Primeros archivos en neuraudit/:")
            for obj in response['Contents'][:5]:
                print(f"   - {obj['Key']} ({obj['Size']} bytes)")
        else:
            print("✅ Conexión exitosa! Carpeta neuraudit/ está vacía o no existe")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error de conexión: {str(e)}")
        return False


def test_upload():
    """Prueba de subida de archivo"""
    print("\n" + "=" * 60)
    print("PRUEBA DE SUBIDA DE ARCHIVO")
    print("=" * 60)
    
    try:
        storage = RadicacionStorage()
        
        # Crear archivo de prueba
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        test_filename = f"test/neuraudit_test_{timestamp}.txt"
        test_content = f"Archivo de prueba NeurAudit Colombia - {timestamp}"
        
        print(f"\n📤 Subiendo archivo de prueba: {test_filename}")
        
        # Guardar archivo
        path = storage.save(test_filename, ContentFile(test_content.encode('utf-8')))
        
        print(f"✅ Archivo guardado en: {path}")
        
        # Verificar que existe
        if storage.exists(path):
            print("✅ Archivo verificado - existe en el storage")
            
            # Generar URL firmada
            url = storage.url(path)
            print(f"\n🔗 URL firmada (válida por 1 hora):")
            print(f"   {url[:100]}...")
            
            # Eliminar archivo de prueba
            storage.delete(path)
            print("\n🗑️  Archivo de prueba eliminado exitosamente")
            
            return True
        else:
            print("❌ Error: El archivo no se guardó correctamente")
            return False
            
    except Exception as e:
        print(f"\n❌ Error en prueba de subida: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_security():
    """Prueba de validación de seguridad"""
    print("\n" + "=" * 60)
    print("PRUEBA DE VALIDACIÓN DE SEGURIDAD")
    print("=" * 60)
    
    storage = RadicacionStorage()
    
    # Pruebas de paths no permitidos
    invalid_paths = [
        "../otro_proyecto/archivo.pdf",
        "/otro_bucket/archivo.pdf",
        "medispensa/archivo.pdf",  # Fuera de neuraudit/
        "../../neuraudit/archivo.pdf"
    ]
    
    print("\n🔒 Probando paths no permitidos:")
    for path in invalid_paths:
        try:
            storage._validate_safe_path(path)
            print(f"   ❌ FALLO: {path} - Debería haber sido bloqueado!")
        except Exception as e:
            print(f"   ✅ OK: {path} - Bloqueado correctamente")
    
    # Pruebas de paths permitidos
    valid_paths = [
        "test/archivo.pdf",
        "2025/08/21/123456789/soportes/HEV_0000000001_A0000000001.pdf"
    ]
    
    print("\n✅ Probando paths permitidos:")
    for path in valid_paths:
        try:
            storage._validate_safe_path(path)
            print(f"   ✅ OK: {path} - Permitido correctamente")
        except Exception as e:
            print(f"   ❌ FALLO: {path} - No debería haber sido bloqueado!")


if __name__ == "__main__":
    print("\n🏥 NeurAudit Colombia - Test Digital Ocean Spaces")
    print("📅 Fecha:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    # Test 1: Conexión
    connection_ok = test_connection()
    
    if connection_ok:
        # Test 2: Subida
        upload_ok = test_upload()
        
        # Test 3: Seguridad
        test_security()
        
        if upload_ok:
            print("\n" + "=" * 60)
            print("✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE")
            print("=" * 60)
        else:
            print("\n" + "=" * 60)
            print("❌ ALGUNAS PRUEBAS FALLARON")
            print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ NO SE PUDO ESTABLECER CONEXIÓN")
        print("=" * 60)