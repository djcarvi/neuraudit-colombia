#!/usr/bin/env python
"""
Test completo del flujo de radicación con archivos reales
No hardcodea datos - crea una radicación real y procesa archivos
"""

import os
import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:8003/api"
TEST_USER = "test.pss"  # Usuario simple, sin email
TEST_PASSWORD = "simple123"
ARCHIVOS_DIR = "/home/adrian_carvajal/Analí®/neuraudit_react/context/prueba_radicar"

def login():
    """Autenticarse y obtener token JWT"""
    print("=== AUTENTICACIÓN ===")
    response = requests.post(f"{BASE_URL}/auth/login/", json={
        "username": TEST_USER,
        "password": TEST_PASSWORD,
        "nit": "123456789-0",
        "user_type": "pss"  # Especificar que es un usuario PSS
    })
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Login exitoso: {data['user']['full_name']}")
        print(f"  Token: {data['access'][:20]}...")
        return data['access']
    else:
        print(f"✗ Error en login: {response.status_code}")
        print(f"  Respuesta: {response.text}")
        return None

def crear_radicacion(token):
    """Crear una nueva radicación sin archivos"""
    print("\n=== CREANDO RADICACIÓN ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Datos completos de la radicación según campos requeridos
    data = {
        # Prestador
        "pss_nit": "123456789-0",
        "pss_nombre": "Test PSS Prestador",
        
        # Factura
        "factura_numero": "A01E5687",
        "factura_fecha_expedicion": "2025-08-15",
        "factura_valor_total": "1500000.00",
        
        # Clasificación
        "modalidad_pago": "EVENTO",
        "tipo_servicio": "CONSULTA_EXTERNA",
        
        # Paciente
        "paciente_tipo_documento": "CC",
        "paciente_numero_documento": "1234567890",
        "paciente_codigo_sexo": "M",
        "paciente_codigo_edad": "A", 
        
        # Información clínica
        "fecha_atencion_inicio": "2025-08-10T08:00:00",
        "diagnostico_principal": "I10X",
        
        # Adicionales
        "cuv": "CUV00123456",
        "observaciones": "Prueba de radicación completa con archivos reales"
    }
    
    response = requests.post(
        f"{BASE_URL}/radicacion/",
        headers=headers,
        json=data
    )
    
    if response.status_code == 201:
        radicacion = response.json()
        print(f"✓ Radicación creada: {radicacion['numero_radicado']}")
        print(f"  ID: {radicacion['id']}")
        print(f"  Estado: {radicacion['estado']}")
        return radicacion['id']
    else:
        print(f"✗ Error creando radicación: {response.status_code}")
        print(f"  Respuesta: {response.text}")
        return None

def subir_archivos(token, radicacion_id):
    """Subir los archivos reales de la carpeta de prueba"""
    print(f"\n=== SUBIENDO ARCHIVOS PARA RADICACIÓN {radicacion_id} ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Mapeo de archivos a tipos
    archivos_a_subir = [
        ("A01E5687.xml", "xml", "factura"),
        ("A01E5687.json", "rips", "rips"),
        ("ResultadosMSPS_RFFV303_ID779996_A_CUV.json", "cuv", "cuv"),
        ("SOPORTE_CRC_A01E5687.pdf", "soporte", "soporte"),
        ("SOPORTE_EPI_A01E5687.pdf", "soporte", "soporte"),
        ("SOPORTE_HEV_A01E5687.pdf", "soporte", "soporte"),
        ("SOPORTE_TNA_A01E5687.pdf", "soporte", "soporte")
    ]
    
    archivos_subidos = []
    
    for nombre_archivo, tipo_archivo, campo in archivos_a_subir:
        archivo_path = os.path.join(ARCHIVOS_DIR, nombre_archivo)
        
        if not os.path.exists(archivo_path):
            print(f"✗ Archivo no encontrado: {archivo_path}")
            continue
        
        print(f"\n  Subiendo {nombre_archivo} como {tipo_archivo}...")
        
        with open(archivo_path, 'rb') as f:
            files = {campo: (nombre_archivo, f, 'application/octet-stream')}
            data = {"tipo_archivo": tipo_archivo}
            
            response = requests.post(
                f"{BASE_URL}/radicacion/{radicacion_id}/upload_document/",
                headers=headers,
                data=data,
                files=files
            )
            
            if response.status_code == 201:
                resultado = response.json()
                archivos_subidos.append(resultado)
                print(f"  ✓ Subido exitosamente")
                print(f"    - ID documento: {resultado.get('id', 'N/A')}")
                print(f"    - Hash: {resultado.get('hash_archivo', 'N/A')[:20]}...")
                
                # Mostrar información de clasificación si es un soporte
                if tipo_archivo == "soporte" and 'info_clasificacion' in resultado:
                    info = resultado['info_clasificacion']
                    print(f"    - Clasificación: {info.get('categoria', 'N/A')} - {info.get('tipo_especifico', 'N/A')}")
            else:
                print(f"  ✗ Error subiendo archivo: {response.status_code}")
                print(f"    Respuesta: {response.text[:200]}")
    
    return archivos_subidos

def verificar_rips_procesado(token, radicacion_id):
    """Verificar que el RIPS fue procesado y guardado en MongoDB"""
    print(f"\n=== VERIFICANDO PROCESAMIENTO RIPS ===")
    
    # Primero, obtener detalles de la radicación
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/radicacion/{radicacion_id}/", headers=headers)
    
    if response.status_code != 200:
        print(f"✗ Error obteniendo radicación: {response.status_code}")
        return
    
    radicacion = response.json()
    print(f"✓ Radicación obtenida: {radicacion['numero_radicado']}")
    print(f"  - Número factura: {radicacion.get('numero_factura', 'N/A')}")
    print(f"  - Estado: {radicacion.get('estado', 'N/A')}")
    print(f"  - Documentos: {len(radicacion.get('documentos', []))}")
    
    # Ahora verificar en la base de datos directamente
    print("\n  Verificando datos RIPS en MongoDB...")
    
    # Importar Django para acceder a los modelos
    import sys
    sys.path.insert(0, '/home/adrian_carvajal/Analí®/neuraudit_react/backend')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    import django
    django.setup()
    
    from apps.radicacion.models_rips import RIPSTransaccion, RIPSUsuario, RIPSConsulta
    
    # Buscar transacción RIPS
    trans = RIPSTransaccion.objects.filter(
        radicacion_id=str(radicacion_id)
    ).first()
    
    if trans:
        print(f"\n  ✓ Transacción RIPS encontrada:")
        print(f"    - ID: {trans.id}")
        print(f"    - Factura: {trans.num_factura}")
        print(f"    - Estado: {trans.estado_procesamiento}")
        print(f"    - Total usuarios: {trans.total_usuarios}")
        print(f"    - Total servicios: {trans.total_servicios}")
        print(f"    - Valor total: ${trans.valor_total_facturado:,.2f}")
        
        # Contar usuarios guardados
        usuarios = RIPSUsuario.objects.filter(transaccion_id=str(trans.id)).count()
        print(f"    - Usuarios en BD: {usuarios}")
        
        # Contar servicios por tipo
        consultas = RIPSConsulta.objects.filter(transaccion_id=str(trans.id)).count()
        print(f"    - Consultas en BD: {consultas}")
        
        # Mostrar algunos usuarios de ejemplo
        print("\n  Primeros 3 usuarios:")
        for i, usuario in enumerate(RIPSUsuario.objects.filter(transaccion_id=str(trans.id))[:3]):
            print(f"    {i+1}. {usuario.tipo_documento_identificacion} {usuario.num_documento_identificacion}")
            print(f"       - Consultas: {usuario.total_consultas}")
            print(f"       - Procedimientos: {usuario.total_procedimientos}")
            print(f"       - Valor total: ${usuario.valor_total_usuario:,.2f}")
    else:
        print("  ✗ No se encontró transacción RIPS en MongoDB")

def main():
    """Ejecutar prueba completa"""
    print("=== PRUEBA COMPLETA DE RADICACIÓN ===")
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Directorio archivos: {ARCHIVOS_DIR}")
    
    # 1. Login
    token = login()
    if not token:
        print("\n✗ No se pudo obtener token. Abortando.")
        return
    
    # 2. Crear radicación
    radicacion_id = crear_radicacion(token)
    if not radicacion_id:
        print("\n✗ No se pudo crear radicación. Abortando.")
        return
    
    # 3. Subir archivos
    archivos = subir_archivos(token, radicacion_id)
    print(f"\n✓ Se subieron {len(archivos)} archivos exitosamente")
    
    # 4. Verificar procesamiento RIPS
    verificar_rips_procesado(token, radicacion_id)
    
    print("\n=== PRUEBA COMPLETADA ===")

if __name__ == "__main__":
    main()