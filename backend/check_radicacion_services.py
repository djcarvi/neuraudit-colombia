#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_rips_oficial import (
    ArchivoCONSULTAS, ArchivoPROCEDIMIENTOS, ArchivoMEDICAMENTOS,
    ArchivoOTROS_SERVICIOS, ArchivoURGENCIAS, ArchivoHOSPITALIZACION,
    ArchivoRECIEN_NACIDOS
)
from bson import ObjectId

# Buscar la radicación
numero_radicado = "RAD-900397985-20250822-01"
print(f"\n🔍 Buscando radicación: {numero_radicado}")

try:
    radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
    print(f"✅ Radicación encontrada:")
    print(f"   - ID: {radicacion.id}")
    print(f"   - Estado: {radicacion.estado}")
    print(f"   - Factura: {radicacion.factura_numero}")
    print(f"   - Prestador: {radicacion.pss_nombre} (NIT: {radicacion.pss_nit})")
    print(f"   - Fecha radicación: {radicacion.fecha_radicacion}")
    
    # Verificar RIPS data
    print(f"\n📊 Datos RIPS:")
    if radicacion.rips_data:
        print(f"   - RIPS data existe: Sí")
        print(f"   - Tipo: {type(radicacion.rips_data)}")
        if isinstance(radicacion.rips_data, dict):
            print(f"   - Claves en RIPS data: {list(radicacion.rips_data.keys())}")
            if 'archivos' in radicacion.rips_data:
                print(f"   - Archivos RIPS: {list(radicacion.rips_data['archivos'].keys())}")
    else:
        print(f"   - RIPS data existe: No")
    
    # Buscar servicios directamente en las colecciones RIPS
    print(f"\n🔍 Buscando servicios en colecciones RIPS:")
    
    # CONSULTAS
    consultas = ArchivoCONSULTAS.objects.filter(radicacion=radicacion.id).count()
    print(f"   - CONSULTAS: {consultas}")
    
    # PROCEDIMIENTOS
    procedimientos = ArchivoPROCEDIMIENTOS.objects.filter(radicacion=radicacion.id).count()
    print(f"   - PROCEDIMIENTOS: {procedimientos}")
    
    # MEDICAMENTOS
    medicamentos = ArchivoMEDICAMENTOS.objects.filter(radicacion=radicacion.id).count()
    print(f"   - MEDICAMENTOS: {medicamentos}")
    
    # OTROS SERVICIOS
    otros = ArchivoOTROS_SERVICIOS.objects.filter(radicacion=radicacion.id).count()
    print(f"   - OTROS_SERVICIOS: {otros}")
    
    # URGENCIAS
    urgencias = ArchivoURGENCIAS.objects.filter(radicacion=radicacion.id).count()
    print(f"   - URGENCIAS: {urgencias}")
    
    # HOSPITALIZACION
    hospitalizacion = ArchivoHOSPITALIZACION.objects.filter(radicacion=radicacion.id).count()
    print(f"   - HOSPITALIZACION: {hospitalizacion}")
    
    # RECIEN NACIDOS
    recien_nacidos = ArchivoRECIEN_NACIDOS.objects.filter(radicacion=radicacion.id).count()
    print(f"   - RECIEN_NACIDOS: {recien_nacidos}")
    
    total_servicios = consultas + procedimientos + medicamentos + otros + urgencias + hospitalizacion + recien_nacidos
    print(f"\n📊 TOTAL SERVICIOS: {total_servicios}")
    
    # Verificar si hay datos de ejemplo
    if consultas > 0:
        print("\n📋 Ejemplo de CONSULTA:")
        consulta = ArchivoCONSULTAS.objects.filter(radicacion=radicacion.id).first()
        print(f"   - Código: {consulta.codConsulta}")
        print(f"   - Fecha: {consulta.fechaAtencion}")
        print(f"   - Valor: {consulta.vrServicio}")
        print(f"   - Usuario: {consulta.numeroDocumento}")
    
except RadicacionCuentaMedica.DoesNotExist:
    print(f"❌ No se encontró la radicación: {numero_radicado}")
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()