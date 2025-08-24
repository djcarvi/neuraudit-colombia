#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para encontrar y analizar el archivo RIPS correcto
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import json
import boto3
from datetime import datetime

print("\n" + "="*80)
print("🔍 BÚSQUEDA Y ANÁLISIS DEL ARCHIVO RIPS")
print("="*80)

# Configuración DO
s3 = boto3.client(
    's3',
    endpoint_url='https://nyc3.digitaloceanspaces.com',
    aws_access_key_id='DO00ZQP9KAQLRG7UXNZH',
    aws_secret_access_key='Txlct66j8M1vRxDLlsh5xCF2wgsumi3a7LtxS8EWQPM',
    region_name='nyc3'
)

# Buscar todos los archivos JSON de hoy para el NIT
prefix = "neuraudit/radicaciones/2025/08/22/901019681/"

try:
    print(f"\n📂 Listando archivos JSON...")
    response = s3.list_objects_v2(
        Bucket='neuralytic',
        Prefix=prefix
    )
    
    if 'Contents' in response:
        # Filtrar archivos JSON
        json_files = []
        for obj in response['Contents']:
            if obj['Key'].endswith('.json'):
                json_files.append({
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'modified': obj['LastModified'],
                    'name': obj['Key'].split('/')[-1]
                })
        
        # Ordenar por fecha de modificación (más reciente primero)
        json_files.sort(key=lambda x: x['modified'], reverse=True)
        
        print(f"\n📄 Archivos JSON encontrados ({len(json_files)}):")
        for idx, file in enumerate(json_files):
            print(f"   {idx+1}. {file['name']}")
            print(f"      Tamaño: {file['size']:,} bytes")
            print(f"      Modificado: {file['modified'].strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"      Key: {file['key']}")
        
        # Encontrar el RIPS más reciente (no CUV)
        rips_files = [f for f in json_files if not f['name'].startswith('CUV') 
                      and not f['name'].startswith('ResultadosMSPS') 
                      and f['size'] > 1000]  # RIPS debe ser más grande que CUV
        
        if rips_files:
            rips_file = rips_files[0]  # El más reciente
            print(f"\n🎯 Archivo RIPS identificado: {rips_file['name']}")
            print(f"   Key: {rips_file['key']}")
            
            # Descargar y analizar
            try:
                print(f"\n📥 Descargando archivo RIPS...")
                obj = s3.get_object(Bucket='neuralytic', Key=rips_file['key'])
                rips_content = obj['Body'].read()
                rips_data = json.loads(rips_content)
                
                print(f"✅ Archivo RIPS descargado y parseado correctamente")
                
                # Información general
                print(f"\n📋 INFORMACIÓN GENERAL:")
                print(f"   numFactura: {rips_data.get('numFactura', 'N/A')}")
                print(f"   numDocumentoIdObligado: {rips_data.get('numDocumentoIdObligado', 'N/A')}")
                print(f"   tipoNota: {rips_data.get('tipoNota', 'N/A')}")
                
                # Verificar usuarios
                usuarios = rips_data.get('usuarios', [])
                print(f"   Total usuarios: {len(usuarios)}")
                
                if usuarios:
                    total_servicios_por_tipo = {
                        'consultas': 0,
                        'procedimientos': 0,
                        'medicamentos': 0,
                        'urgencias': 0,
                        'hospitalizacion': 0,
                        'otrosServicios': 0,
                        'recienNacidos': 0
                    }
                    
                    print(f"\n👥 ANÁLISIS DE USUARIOS:")
                    for i, usuario in enumerate(usuarios):
                        print(f"\n   Usuario {i+1}:")
                        print(f"   - Documento: {usuario.get('tipoDocumentoIdentificacion', 'N/A')} {usuario.get('numDocumentoIdentificacion', 'N/A')}")
                        
                        if 'servicios' in usuario:
                            servicios = usuario['servicios']
                            usuario_tiene_servicios = False
                            
                            for tipo in total_servicios_por_tipo.keys():
                                if tipo in servicios and isinstance(servicios[tipo], list) and len(servicios[tipo]) > 0:
                                    cantidad = len(servicios[tipo])
                                    total_servicios_por_tipo[tipo] += cantidad
                                    print(f"   - {tipo}: {cantidad}")
                                    usuario_tiene_servicios = True
                                    
                                    # Mostrar detalle del primer servicio
                                    if cantidad > 0:
                                        servicio = servicios[tipo][0]
                                        print(f"     Primer {tipo[:-1]}:")
                                        
                                        # Mostrar campos relevantes
                                        campos_mostrar = []
                                        if tipo == 'procedimientos':
                                            campos_mostrar = ['codProcedimiento', 'fechaAtencion', 'vrServicio', 'diagnosticoPrincipal']
                                        elif tipo == 'consultas':
                                            campos_mostrar = ['codConsulta', 'fechaAtencion', 'vrServicio', 'diagnosticoPrincipal']
                                        elif tipo == 'medicamentos':
                                            campos_mostrar = ['codTecnologiaSalud', 'nomTecnologiaSalud', 'cantidadSuministrada', 'vrServicio']
                                        
                                        for campo in campos_mostrar:
                                            if campo in servicio:
                                                print(f"     - {campo}: {servicio[campo]}")
                            
                            if not usuario_tiene_servicios:
                                print(f"   - ❌ No tiene servicios")
                        else:
                            print(f"   - ❌ No tiene campo 'servicios'")
                    
                    # Resumen final
                    total_servicios = sum(total_servicios_por_tipo.values())
                    print(f"\n📊 RESUMEN FINAL:")
                    print(f"   Total servicios en RIPS: {total_servicios}")
                    
                    for tipo, cantidad in total_servicios_por_tipo.items():
                        if cantidad > 0:
                            print(f"   - {tipo}: {cantidad}")
                    
                    if total_servicios == 0:
                        print(f"\n❌ EL RIPS NO CONTIENE SERVICIOS")
                        print(f"   Esto puede ser un problema con la estructura del archivo")
                    else:
                        print(f"\n✅ EL RIPS CONTIENE {total_servicios} SERVICIOS")
                        print(f"   Como menciona el usuario, es válido que solo tenga algunos tipos de servicios")
                
                # Guardar para análisis
                with open('/tmp/rips_analysis.json', 'w') as f:
                    json.dump(rips_data, f, indent=2)
                print(f"\n💾 Archivo guardado en: /tmp/rips_analysis.json")
                
            except Exception as e:
                print(f"\n❌ Error procesando archivo RIPS: {e}")
        else:
            print(f"\n❌ No se encontraron archivos RIPS válidos")
    else:
        print(f"\n❌ No se encontraron archivos en el prefix")

except Exception as e:
    print(f"\n❌ Error general: {e}")

print(f"\n✅ Búsqueda completada")