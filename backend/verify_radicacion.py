#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para verificar la radicación RAD-901019681-20250822-04
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_rips_oficial import RIPSTransaccionOficial as RIPSTransaccion
from apps.radicacion.models_rips import RIPSUsuario, RIPSConsulta, RIPSProcedimiento, RIPSMedicamentos
from apps.radicacion.mongodb_soporte_service import MongoDBSoporteService
import json

# Buscar la radicación
numero_radicado = "RAD-901019681-20250822-04"
print(f"\n🔍 Buscando radicación: {numero_radicado}")

try:
    radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
    print(f"✅ Radicación encontrada!")
    print(f"   ID: {radicacion.id}")
    print(f"   Estado: {radicacion.estado}")
    print(f"   Prestador: {radicacion.pss_nombre} (NIT: {radicacion.pss_nit})")
    print(f"   Factura: {radicacion.factura_numero}")
    print(f"   Valor: ${radicacion.factura_valor_total:,.2f}")
    print(f"   Fecha creación: {radicacion.created_at}")
    
    # Verificar documentos
    print(f"\n📄 Documentos asociados: {radicacion.documentos.count()}")
    for doc in radicacion.documentos.all():
        print(f"   - {doc.tipo_documento}: {doc.nombre_archivo} ({doc.estado})")
    
    # Verificar RIPS en modelo oficial
    print(f"\n📊 Verificando RIPS oficial...")
    rips_oficial = RIPSTransaccion.objects.filter(
        numFactura=radicacion.factura_numero,
        prestadorNit=radicacion.pss_nit
    ).first()
    
    if rips_oficial:
        print(f"✅ RIPS oficial encontrado!")
        print(f"   ID: {rips_oficial.id}")
        print(f"   Estado: {rips_oficial.estadoProcesamiento}")
        print(f"   Usuarios: {len(rips_oficial.usuarios) if rips_oficial.usuarios else 0}")
        if rips_oficial.estadisticasTransaccion:
            print(f"   Total servicios: {rips_oficial.estadisticasTransaccion.totalServicios}")
            print(f"   Distribución: {rips_oficial.estadisticasTransaccion.distribucionServicios}")
    else:
        print("❌ No se encontró RIPS oficial")
    
    # Verificar RIPS en modelo legacy
    print(f"\n📊 Verificando RIPS legacy...")
    from apps.radicacion.models_rips import RIPSTransaccion as RIPSTransaccionLegacy
    rips_legacy = RIPSTransaccionLegacy.objects.filter(
        num_factura=radicacion.factura_numero,
        radicacion_id=str(radicacion.id)
    ).first()
    
    if rips_legacy:
        print(f"✅ RIPS legacy encontrado!")
        print(f"   ID: {rips_legacy.id}")
        print(f"   Estado: {rips_legacy.estado_procesamiento}")
        print(f"   Total usuarios: {rips_legacy.total_usuarios}")
        print(f"   Total servicios: {rips_legacy.total_servicios}")
        
        # Contar usuarios y servicios
        usuarios = RIPSUsuario.objects.filter(transaccion_id=str(rips_legacy.id))
        print(f"   Usuarios guardados: {usuarios.count()}")
        
        if usuarios.exists():
            total_consultas = sum(u.total_consultas for u in usuarios)
            total_procedimientos = sum(u.total_procedimientos for u in usuarios)
            total_medicamentos = sum(u.total_medicamentos for u in usuarios)
            print(f"   - Consultas: {total_consultas}")
            print(f"   - Procedimientos: {total_procedimientos}")
            print(f"   - Medicamentos: {total_medicamentos}")
    else:
        print("❌ No se encontró RIPS legacy")
    
    # Verificar soportes en MongoDB
    print(f"\n🗃️ Verificando soportes en MongoDB...")
    mongo_service = MongoDBSoporteService()
    soportes = mongo_service.obtener_soportes_radicacion(str(radicacion.id))
    
    print(f"   Total soportes: {len(soportes)}")
    for soporte in soportes[:5]:  # Mostrar primeros 5
        print(f"   - {soporte.get('tipo_archivo', 'N/A')}: {soporte.get('nombre_archivo', 'N/A')}")
        if soporte.get('clasificacion'):
            print(f"     Categoría: {soporte['clasificacion'].get('categoria', 'N/A')}")
    
    # Verificar URLs de almacenamiento
    print(f"\n🌐 URLs de almacenamiento:")
    if hasattr(radicacion, 'factura_url') and radicacion.factura_url:
        print(f"   Factura: {radicacion.factura_url[:50]}...")
    if hasattr(radicacion, 'rips_url') and radicacion.rips_url:
        print(f"   RIPS: {radicacion.rips_url[:50]}...")
    
    print(f"\n✅ Verificación completada exitosamente!")
    
except RadicacionCuentaMedica.DoesNotExist:
    print(f"❌ No se encontró la radicación {numero_radicado}")
except Exception as e:
    print(f"❌ Error verificando radicación: {str(e)}")
    import traceback
    traceback.print_exc()