#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar el contenido del archivo RIPS
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import json
import boto3

print("\n" + "="*80)
print("🔍 VERIFICACIÓN DEL CONTENIDO DEL ARCHIVO RIPS")
print("="*80)

# Configuración DO
s3 = boto3.client(
    's3',
    endpoint_url='https://nyc3.digitaloceanspaces.com',
    aws_access_key_id='DO00ZQP9KAQLRG7UXNZH',
    aws_secret_access_key='Txlct66j8M1vRxDLlsh5xCF2wgsumi3a7LtxS8EWQPM',
    region_name='nyc3'
)

# Descargar el archivo RIPS más reciente
rips_key = "neuraudit/radicaciones/2025/08/22/901019681/otros/A01E5687_20250822_163158.json"

try:
    print(f"\n📥 Descargando archivo RIPS...")
    print(f"   Key: {rips_key}")
    
    obj = s3.get_object(Bucket='neuralytic', Key=rips_key)
    rips_content = obj['Body'].read()
    rips_data = json.loads(rips_content)
    
    print(f"\n✅ Archivo RIPS descargado correctamente")
    
    # Información general
    print(f"\n📋 INFORMACIÓN GENERAL DEL RIPS:")
    print(f"   numFactura: {rips_data.get('numFactura', 'N/A')}")
    print(f"   numDocumentoIdObligado: {rips_data.get('numDocumentoIdObligado', 'N/A')}")
    print(f"   tipoNota: {rips_data.get('tipoNota', 'N/A')}")
    print(f"   Total usuarios: {len(rips_data.get('usuarios', []))}")
    
    # Analizar usuarios y servicios
    if 'usuarios' in rips_data and len(rips_data['usuarios']) > 0:
        print(f"\n👥 ANÁLISIS DE USUARIOS Y SERVICIOS:")
        
        total_global = {
            'consultas': 0,
            'procedimientos': 0,
            'medicamentos': 0,
            'urgencias': 0,
            'hospitalizacion': 0,
            'otrosServicios': 0,
            'recienNacidos': 0
        }
        
        for idx, usuario in enumerate(rips_data['usuarios']):
            print(f"\n   Usuario {idx + 1}:")
            print(f"   - Tipo Doc: {usuario.get('tipoDocumentoIdentificacion', 'N/A')}")
            print(f"   - Número Doc: {usuario.get('numDocumentoIdentificacion', 'N/A')}")
            
            if 'servicios' in usuario:
                servicios = usuario['servicios']
                print(f"   - Servicios:")
                
                servicios_encontrados = False
                
                # Verificar cada tipo de servicio
                for tipo_servicio in ['consultas', 'procedimientos', 'medicamentos', 
                                    'urgencias', 'hospitalizacion', 'otrosServicios', 'recienNacidos']:
                    if tipo_servicio in servicios and isinstance(servicios[tipo_servicio], list):
                        cantidad = len(servicios[tipo_servicio])
                        if cantidad > 0:
                            print(f"     • {tipo_servicio}: {cantidad}")
                            total_global[tipo_servicio] += cantidad
                            servicios_encontrados = True
                            
                            # Mostrar detalles del primer servicio
                            if cantidad > 0:
                                primer_servicio = servicios[tipo_servicio][0]
                                print(f"       Ejemplo del primer {tipo_servicio[:-1]}:")
                                
                                # Campos importantes según el tipo
                                if tipo_servicio == 'procedimientos':
                                    print(f"       - Código: {primer_servicio.get('codProcedimiento', 'N/A')}")
                                    print(f"       - Fecha: {primer_servicio.get('fechaAtencion', 'N/A')}")
                                    print(f"       - Valor: {primer_servicio.get('vrServicio', 'N/A')}")
                                elif tipo_servicio == 'consultas':
                                    print(f"       - Código: {primer_servicio.get('codConsulta', 'N/A')}")
                                    print(f"       - Fecha: {primer_servicio.get('fechaAtencion', 'N/A')}")
                                    print(f"       - Valor: {primer_servicio.get('vrServicio', 'N/A')}")
                                elif tipo_servicio == 'medicamentos':
                                    print(f"       - Código: {primer_servicio.get('codTecnologiaSalud', 'N/A')}")
                                    print(f"       - Nombre: {primer_servicio.get('nomTecnologiaSalud', 'N/A')}")
                                    print(f"       - Cantidad: {primer_servicio.get('cantidadSuministrada', 'N/A')}")
                                    print(f"       - Valor: {primer_servicio.get('vrServicio', 'N/A')}")
                
                if not servicios_encontrados:
                    print(f"     ❌ No tiene servicios")
            else:
                print(f"   - ❌ No tiene campo 'servicios'")
        
        # Resumen total
        print(f"\n📊 RESUMEN TOTAL DE SERVICIOS EN EL ARCHIVO:")
        total_servicios = sum(total_global.values())
        print(f"   Total servicios: {total_servicios}")
        
        for tipo, cantidad in total_global.items():
            if cantidad > 0:
                print(f"   - {tipo}: {cantidad}")
        
        if total_servicios == 0:
            print(f"\n❌ NO HAY SERVICIOS EN EL ARCHIVO RIPS")
        else:
            print(f"\n✅ El archivo RIPS contiene {total_servicios} servicios")
            
    else:
        print(f"\n❌ El archivo RIPS no tiene usuarios")
    
    # Guardar una copia local para análisis
    with open('/tmp/rips_content.json', 'w') as f:
        json.dump(rips_data, f, indent=2)
    print(f"\n💾 Copia del RIPS guardada en: /tmp/rips_content.json")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    print(f"   Tipo: {type(e).__name__}")
    
    # Intentar con otros archivos JSON
    print(f"\n🔄 Buscando otros archivos JSON...")
    
    try:
        response = s3.list_objects_v2(
            Bucket='neuralytic',
            Prefix='neuraudit/radicaciones/2025/08/22/901019681/otros/',
            MaxKeys=50
        )
        
        if 'Contents' in response:
            json_files = [obj['Key'] for obj in response['Contents'] if obj['Key'].endswith('.json')]
            
            print(f"\n📄 Archivos JSON encontrados:")
            for f in json_files:
                print(f"   - {f.split('/')[-1]}")
    except Exception as e2:
        print(f"   Error listando: {e2}")

print(f"\n✅ Verificación completada")