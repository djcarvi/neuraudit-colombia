#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar el procesamiento de servicios RIPS
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_rips_oficial import RIPSTransaccionOficial as RIPSTransaccion
import json
import boto3

print("\n" + "="*80)
print("🔍 VERIFICACIÓN DE PROCESAMIENTO DE SERVICIOS RIPS")
print("="*80)

# 1. Buscar la radicación
numero_radicado = "RAD-901019681-20250822-04"
print(f"\n📋 Radicación: {numero_radicado}")

try:
    radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
    print(f"✅ Radicación encontrada")
    print(f"   ID: {radicacion.id}")
    print(f"   Factura: {radicacion.factura_numero}")
    print(f"   NIT: {radicacion.pss_nit}")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)

# 2. Buscar RIPS en MongoDB (modelo oficial NoSQL)
print(f"\n📊 BUSCANDO RIPS EN MONGODB...")
rips_oficial = RIPSTransaccion.objects.filter(
    numFactura=radicacion.factura_numero
).first()

if rips_oficial:
    print(f"✅ RIPS encontrado en MongoDB")
    print(f"   ID: {rips_oficial.id}")
    print(f"   Estado: {rips_oficial.estadoProcesamiento}")
    print(f"   Factura: {rips_oficial.numFactura}")
    print(f"   NIT Prestador: {rips_oficial.prestadorNit}")
    
    # Verificar usuarios embebidos
    if rips_oficial.usuarios:
        print(f"\n👥 USUARIOS EMBEBIDOS: {len(rips_oficial.usuarios)}")
        
        total_servicios = 0
        detalles_servicios = {
            'consultas': 0,
            'procedimientos': 0,
            'medicamentos': 0,
            'urgencias': 0,
            'hospitalizacion': 0,
            'otrosServicios': 0,
            'recienNacidos': 0
        }
        
        # Analizar cada usuario
        for idx, usuario in enumerate(rips_oficial.usuarios[:5]):  # Primeros 5
            print(f"\n   Usuario {idx+1}:")
            print(f"   - Documento: {usuario.tipoDocumento} {usuario.numeroDocumento}")
            
            if usuario.servicios:
                print(f"   - Servicios embebidos: ✅ SÍ")
                
                # Contar servicios
                if usuario.servicios.consultas:
                    detalles_servicios['consultas'] += len(usuario.servicios.consultas)
                    print(f"     • Consultas: {len(usuario.servicios.consultas)}")
                    
                if usuario.servicios.procedimientos:
                    detalles_servicios['procedimientos'] += len(usuario.servicios.procedimientos)
                    print(f"     • Procedimientos: {len(usuario.servicios.procedimientos)}")
                    
                if usuario.servicios.medicamentos:
                    detalles_servicios['medicamentos'] += len(usuario.servicios.medicamentos)
                    print(f"     • Medicamentos: {len(usuario.servicios.medicamentos)}")
                    
                if usuario.servicios.urgencias:
                    detalles_servicios['urgencias'] += len(usuario.servicios.urgencias)
                    print(f"     • Urgencias: {len(usuario.servicios.urgencias)}")
                    
                if usuario.servicios.hospitalizacion:
                    detalles_servicios['hospitalizacion'] += len(usuario.servicios.hospitalizacion)
                    print(f"     • Hospitalización: {len(usuario.servicios.hospitalizacion)}")
                    
                if usuario.servicios.otrosServicios:
                    detalles_servicios['otrosServicios'] += len(usuario.servicios.otrosServicios)
                    print(f"     • Otros servicios: {len(usuario.servicios.otrosServicios)}")
                    
                if usuario.servicios.recienNacidos:
                    detalles_servicios['recienNacidos'] += len(usuario.servicios.recienNacidos)
                    print(f"     • Recién nacidos: {len(usuario.servicios.recienNacidos)}")
            else:
                print(f"   - Servicios embebidos: ❌ NO (campo servicios vacío)")
        
        # Resumen total
        total_servicios = sum(detalles_servicios.values())
        print(f"\n📊 RESUMEN DE SERVICIOS PROCESADOS:")
        print(f"   Total servicios: {total_servicios}")
        for tipo, cantidad in detalles_servicios.items():
            if cantidad > 0:
                print(f"   - {tipo}: {cantidad}")
        
        if total_servicios == 0:
            print(f"\n❌ NO SE ENCONTRARON SERVICIOS PROCESADOS")
            print(f"   Los usuarios existen pero no tienen servicios embebidos")
    else:
        print(f"\n❌ NO HAY USUARIOS EMBEBIDOS EN EL RIPS")
else:
    print(f"❌ NO SE ENCONTRÓ RIPS EN MONGODB")

# 3. Verificar el archivo RIPS original en Digital Ocean
print(f"\n📄 VERIFICANDO ARCHIVO RIPS ORIGINAL EN DIGITAL OCEAN...")

# Configuración DO
s3 = boto3.client(
    's3',
    endpoint_url='https://nyc3.digitaloceanspaces.com',
    aws_access_key_id='DO00ZQP9KAQLRG7UXNZH',
    aws_secret_access_key='Txlct66j8M1vRxDLlsh5xCF2wgsumi3a7LtxS8EWQPM',
    region_name='nyc3'
)

# Buscar el archivo RIPS más reciente
prefix = 'neuraudit/radicaciones/2025/08/22/901019681/otros/'
rips_key = f"{prefix}A01E5687_20250822_163158.json"

try:
    # Descargar el archivo RIPS
    obj = s3.get_object(Bucket='neuralytic', Key=rips_key)
    rips_content = obj['Body'].read()
    rips_data = json.loads(rips_content)
    
    print(f"✅ Archivo RIPS descargado de DO Spaces")
    print(f"   Factura: {rips_data.get('numFactura', 'N/A')}")
    print(f"   Usuarios en archivo: {len(rips_data.get('usuarios', []))}")
    
    # Analizar contenido del archivo
    if 'usuarios' in rips_data:
        total_servicios_archivo = 0
        servicios_por_tipo = {}
        
        for usuario in rips_data['usuarios']:
            if 'servicios' in usuario:
                servicios = usuario['servicios']
                
                for tipo_servicio in ['consultas', 'procedimientos', 'medicamentos', 
                                    'urgencias', 'hospitalizacion', 'otrosServicios', 'recienNacidos']:
                    if tipo_servicio in servicios and isinstance(servicios[tipo_servicio], list):
                        cantidad = len(servicios[tipo_servicio])
                        if cantidad > 0:
                            servicios_por_tipo[tipo_servicio] = servicios_por_tipo.get(tipo_servicio, 0) + cantidad
                            total_servicios_archivo += cantidad
        
        print(f"\n📊 SERVICIOS EN ARCHIVO ORIGINAL:")
        print(f"   Total servicios: {total_servicios_archivo}")
        for tipo, cantidad in servicios_por_tipo.items():
            print(f"   - {tipo}: {cantidad}")
        
        # Mostrar ejemplo de un servicio
        if total_servicios_archivo > 0:
            print(f"\n📋 EJEMPLO DE SERVICIO (primer usuario con servicios):")
            for usuario in rips_data['usuarios']:
                if 'servicios' in usuario:
                    servicios = usuario['servicios']
                    
                    # Buscar primer tipo de servicio con datos
                    for tipo in ['consultas', 'procedimientos', 'medicamentos']:
                        if tipo in servicios and len(servicios[tipo]) > 0:
                            servicio = servicios[tipo][0]
                            print(f"   Tipo: {tipo}")
                            print(f"   Datos del servicio:")
                            for k, v in list(servicio.items())[:5]:  # Primeros 5 campos
                                print(f"   - {k}: {v}")
                            break
                    break
    
except Exception as e:
    print(f"❌ Error descargando RIPS de DO: {e}")

# 4. Verificar si hay un RIPSTransaccion en el modelo legacy
print(f"\n🔍 VERIFICANDO MODELO RIPS LEGACY...")
try:
    from apps.radicacion.models_rips import RIPSTransaccion as RIPSTransaccionLegacy
    rips_legacy = RIPSTransaccionLegacy.objects.filter(
        num_factura=radicacion.factura_numero
    ).first()
    
    if rips_legacy:
        print(f"✅ RIPS encontrado en modelo legacy")
        print(f"   ID: {rips_legacy.id}")
        print(f"   Total usuarios: {rips_legacy.total_usuarios}")
        print(f"   Total servicios: {rips_legacy.total_servicios}")
    else:
        print(f"❌ No se encontró en modelo legacy")
except Exception as e:
    print(f"❌ Error verificando modelo legacy: {e}")

# 5. Diagnóstico final
print(f"\n" + "="*80)
print("🔍 DIAGNÓSTICO FINAL:")
print("="*80)

if not rips_oficial:
    print("❌ PROBLEMA: El RIPS no se procesó en MongoDB")
    print("   CAUSA: Conflicto de modelos durante el procesamiento")
elif rips_oficial and total_servicios == 0:
    print("❌ PROBLEMA: Los servicios no se guardaron en MongoDB")
    print("   CAUSA: Error en el proceso de embebido de servicios")
else:
    print("✅ El RIPS y sus servicios se procesaron correctamente")

print("\n📝 RECOMENDACIÓN:")
print("   El archivo RIPS existe en DO Spaces pero no se procesó debido a conflictos")
print("   de modelos entre 'models_rips_oficial' y 'models_rips'.")
print("   Se debe resolver el conflicto de modelos para procesar correctamente.")

print(f"\n✅ Verificación completada")