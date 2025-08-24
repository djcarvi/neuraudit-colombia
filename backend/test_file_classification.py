#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test de clasificación de archivos de soporte
NeurAudit Colombia
"""

import os
import sys
import django

# Setup Django
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.soporte_classifier import SoporteClassifier
from apps.radicacion.storage_service import StorageService
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime


def test_clasificacion():
    """Prueba el sistema de clasificación de soportes"""
    print("=" * 60)
    print("PRUEBA DE CLASIFICACIÓN DE SOPORTES")
    print("=" * 60)
    
    classifier = SoporteClassifier()
    
    # Archivos de prueba con nomenclatura oficial
    test_files = [
        # Documentos básicos
        "XML_0000000001_A0000000001.xml",
        "RIPS_0000000001_A0000000001.json",
        
        # Registros médicos
        "HEV_0000000001_A0000000001.pdf",  # Historia evolución
        "EPI_0000000001_A0000000001.pdf",  # Epicrisis
        "HAU_0000000001_A0000000001.pdf",  # Historia urgencias
        "HAO_0000000001_A0000000001.pdf",  # Historia odontología
        
        # Procedimientos
        "PDX_0000000001_A0000000001.pdf",  # Procedimiento diagnóstico
        "DQX_0000000001_A0000000001.pdf",  # Descripción quirúrgica
        "RAN_0000000001_A0000000001.pdf",  # Registro anestesia
        
        # Medicamentos
        "HAM_0000000001_A0000000001.pdf",  # Historia administración medicamentos
        "CRC_0000000001_A0000000001.pdf",  # Comprobante recibido
        
        # Transporte
        "TAP_0000000001_A0000000001.pdf",  # Transporte asistencial programado
        "TNA_0000000001_A0000000001.pdf",  # Transporte no asistencial
        
        # Órdenes y prescripciones
        "OPF_0000000001_A0000000001.pdf",  # Orden/prescripción/fórmula
        "LDP_0000000001_A0000000001.pdf",  # Lista de dispositivos/prescripción
        
        # Facturación especial
        "FAT_0000000001_A0000000001.pdf",  # Facturación tutela
        "FMO_0000000001_A0000000001.pdf",  # Facturación mano de obra
        
        # Soportes adicionales
        "PDE_0000000001_A0000000001.pdf",  # Paquete documentos especiales
        
        # Archivos con nomenclatura incorrecta
        "archivo_sin_formato.pdf",
        "INVALIDO_123.pdf"
    ]
    
    print("\n📋 Clasificando archivos de prueba:\n")
    
    estadisticas = {
        'documentos_basicos': 0,
        'registros_medicos': 0,
        'procedimientos': 0,
        'medicamentos': 0,
        'transporte': 0,
        'ordenes_prescripciones': 0,
        'facturacion_especial': 0,
        'soportes_adicionales': 0,
        'no_clasificados': 0
    }
    
    for filename in test_files:
        info = classifier.parse_soporte_filename(filename)
        
        print(f"📄 {filename}")
        print(f"   ✓ Válido: {'Sí' if info.nomenclatura_valida else 'No'}")
        
        if info.nomenclatura_valida:
            print(f"   ✓ Código: {info.codigo_documento}")
            print(f"   ✓ Descripción: {info.descripcion}")
            print(f"   ✓ Categoría: {info.categoria}")
            print(f"   ✓ N° Factura: {info.numero_factura}")
            print(f"   ✓ N° Autorización: {info.numero_autorizacion}")
            
            # Actualizar estadísticas
            if info.categoria == 'Documentos Básicos':
                estadisticas['documentos_basicos'] += 1
            elif info.categoria == 'Registros Médicos':
                estadisticas['registros_medicos'] += 1
            elif info.categoria == 'Procedimientos':
                estadisticas['procedimientos'] += 1
            elif info.categoria == 'Medicamentos':
                estadisticas['medicamentos'] += 1
            elif info.categoria == 'Transporte':
                estadisticas['transporte'] += 1
            elif info.categoria == 'Órdenes y Prescripciones':
                estadisticas['ordenes_prescripciones'] += 1
            elif info.categoria == 'Facturación Especial':
                estadisticas['facturacion_especial'] += 1
            elif info.categoria == 'Soportes Adicionales':
                estadisticas['soportes_adicionales'] += 1
        else:
            print(f"   ✗ Errores: {', '.join(info.errores)}")
            estadisticas['no_clasificados'] += 1
        
        print()
    
    # Mostrar resumen de estadísticas
    print("\n" + "=" * 60)
    print("RESUMEN DE CLASIFICACIÓN")
    print("=" * 60)
    
    total_archivos = len(test_files)
    archivos_validos = sum(v for k, v in estadisticas.items() if k != 'no_clasificados')
    
    print(f"\n📊 Total de archivos procesados: {total_archivos}")
    print(f"✅ Archivos con nomenclatura válida: {archivos_validos}")
    print(f"❌ Archivos con nomenclatura inválida: {estadisticas['no_clasificados']}")
    print(f"📈 Tasa de validez: {(archivos_validos/total_archivos*100):.1f}%")
    
    print("\n📁 Distribución por categorías:")
    for categoria, cantidad in estadisticas.items():
        if cantidad > 0 and categoria != 'no_clasificados':
            print(f"   • {categoria.replace('_', ' ').title()}: {cantidad} archivos")


def test_storage_clasificacion():
    """Prueba el almacenamiento con clasificación"""
    print("\n" + "=" * 60)
    print("PRUEBA DE ALMACENAMIENTO CON CLASIFICACIÓN")
    print("=" * 60)
    
    storage_service = StorageService(nit_prestador="123456789")
    
    # Crear archivo de prueba tipo soporte
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    test_filename = f"HEV_0000000001_A0000000001_{timestamp}.pdf"
    test_content = b"%PDF-1.4\n%Test PDF content\n"
    
    test_file = SimpleUploadedFile(
        test_filename,
        test_content,
        content_type="application/pdf"
    )
    
    print(f"\n📤 Procesando archivo: {test_filename}")
    
    # Validar y almacenar
    resultado = storage_service.validar_y_almacenar_archivo(test_file, 'soporte')
    
    if resultado['valido']:
        print("✅ Archivo validado y almacenado exitosamente")
        print(f"   • URL: {resultado['url_almacenamiento'][:80]}...")
        print(f"   • Hash: {resultado['hash_archivo'][:16]}...")
        print(f"   • Categoría: {resultado['info_clasificacion'].get('categoria', 'N/A')}")
        print(f"   • Descripción: {resultado['info_clasificacion'].get('descripcion', 'N/A')}")
        
        # Limpiar archivo de prueba
        if resultado['url_almacenamiento'] and storage_service.storage.exists(resultado['metadata'].get('path')):
            storage_service.storage.delete(resultado['metadata'].get('path'))
            print("\n🗑️  Archivo de prueba eliminado")
    else:
        print("❌ Error en validación/almacenamiento:")
        for error in resultado['errores']:
            print(f"   • {error}")


if __name__ == "__main__":
    print("\n🏥 NeurAudit Colombia - Test Clasificación de Archivos")
    print("📅 Fecha:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    # Test 1: Clasificación
    test_clasificacion()
    
    # Test 2: Almacenamiento con clasificación
    test_storage_clasificacion()
    
    print("\n" + "=" * 60)
    print("✅ PRUEBAS COMPLETADAS")
    print("=" * 60)