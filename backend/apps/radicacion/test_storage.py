"""
Script de prueba para verificar la configuración de Digital Ocean Spaces
IMPORTANTE: Solo debe escribir en neuraudit/test/

Uso:
    python manage.py shell
    from apps.radicacion.test_storage import test_storage_connection
    test_storage_connection()

Autor: Analítica Neuronal
Fecha: 21 Agosto 2025
"""

import os
from datetime import datetime
from django.core.files.base import ContentFile
import logging

logger = logging.getLogger(__name__)


def test_storage_connection():
    """
    Prueba la conexión con Digital Ocean Spaces y las validaciones de seguridad
    """
    from .storage_config import RadicacionStorage
    
    storage = RadicacionStorage()
    
    print("=== Prueba de conexión con Digital Ocean Spaces ===")
    print(f"Bucket: {storage.bucket_name}")
    print(f"Endpoint: {storage.endpoint_url}")
    print(f"Location base: {storage.location}")
    
    # 1. Prueba de escritura segura
    print("\n1. Probando escritura en carpeta permitida...")
    try:
        test_content = f"Prueba de NeurAudit - {datetime.now().isoformat()}"
        test_file = ContentFile(test_content.encode('utf-8'))
        test_filename = f"test/prueba_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        
        saved_path = storage.save(test_filename, test_file)
        print(f"✅ Archivo guardado exitosamente: {saved_path}")
        
        # Generar URL firmada
        url = storage.url(saved_path)
        print(f"✅ URL firmada generada: {url[:100]}...")
        
        # Verificar existencia
        exists = storage.exists(saved_path)
        print(f"✅ Verificación de existencia: {exists}")
        
        # Limpiar archivo de prueba
        storage.delete(saved_path)
        print("✅ Archivo de prueba eliminado")
        
    except Exception as e:
        print(f"❌ Error en prueba de escritura: {str(e)}")
        return False
    
    # 2. Prueba de seguridad - intentar escribir fuera de neuraudit/
    print("\n2. Probando validaciones de seguridad...")
    try:
        # Intentar escribir fuera de neuraudit/
        bad_file = ContentFile(b"No debería guardarse")
        bad_filename = "../otros_proyectos/hack.txt"
        
        storage.save(bad_filename, bad_file)
        print("❌ ERROR: Se permitió escritura fuera de neuraudit/")
        return False
        
    except Exception as e:
        print(f"✅ Seguridad funcionando: {str(e)}")
    
    # 3. Prueba de clasificación de soportes
    print("\n3. Probando clasificación de soportes...")
    from .soporte_classifier import SoporteClassifier
    
    classifier = SoporteClassifier()
    
    # Probar nomenclatura válida
    test_files = [
        "XML_1234567890_A123456789.pdf",
        "RIPS_1234567890_A123456789.pdf",
        "HEV_1234567890_A123456789.pdf",
        "EPI_1234567890_A123456789_CC_1234567.pdf",  # Multiusuario
        "archivo_invalido.pdf"
    ]
    
    for filename in test_files:
        info = classifier.classify_soporte_type(filename)
        print(f"\nArchivo: {filename}")
        print(f"  - Código: {info['codigo']}")
        print(f"  - Categoría: {info['categoria']}")
        print(f"  - Válido: {info['es_valido']}")
        if not info['es_valido']:
            print(f"  - Errores: {info['errores']}")
    
    print("\n✅ Todas las pruebas completadas exitosamente")
    return True


def test_storage_security():
    """
    Pruebas exhaustivas de seguridad
    """
    from .storage_config import RadicacionStorage
    from django.core.exceptions import SuspiciousOperation
    
    storage = RadicacionStorage()
    
    print("=== Pruebas de seguridad exhaustivas ===")
    
    # Casos de prueba maliciosos
    malicious_paths = [
        "../medispensa/hack.txt",
        "../../production/hack.txt",
        "neuraudit/../medispensa/hack.txt",
        "/medispensa/hack.txt",
        "medispensa/hack.txt",
        "\\/etc/passwd",
        "neuraudit/../../../../etc/passwd"
    ]
    
    for path in malicious_paths:
        try:
            content = ContentFile(b"malicious")
            storage.save(path, content)
            print(f"❌ CRÍTICO: Se permitió path malicioso: {path}")
        except (SuspiciousOperation, Exception) as e:
            print(f"✅ Bloqueado correctamente: {path} - {type(e).__name__}")
    
    print("\n✅ Pruebas de seguridad completadas")