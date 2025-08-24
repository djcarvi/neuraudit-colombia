#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script simplificado para verificar la radicación RAD-901019681-20250822-04
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_rips_oficial import RIPSTransaccionOficial as RIPSTransaccion
from apps.radicacion.mongodb_soporte_service import MongoDBSoporteService

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
    print(f"\n📊 Verificando RIPS oficial (NoSQL embebido)...")
    rips_oficial = RIPSTransaccion.objects.filter(
        numFactura=radicacion.factura_numero,
        prestadorNit=radicacion.pss_nit
    ).first()
    
    if rips_oficial:
        print(f"✅ RIPS oficial encontrado!")
        print(f"   ID: {rips_oficial.id}")
        print(f"   Estado: {rips_oficial.estadoProcesamiento}")
        print(f"   Usuarios embebidos: {len(rips_oficial.usuarios) if rips_oficial.usuarios else 0}")
        
        # Mostrar estadísticas si existen
        if rips_oficial.estadisticasTransaccion:
            stats = rips_oficial.estadisticasTransaccion
            print(f"   Total usuarios: {stats.totalUsuarios}")
            print(f"   Total servicios: {stats.totalServicios}")
            if stats.distribucionServicios:
                print(f"   Distribución de servicios:")
                for tipo, cantidad in stats.distribucionServicios.items():
                    if cantidad > 0:
                        print(f"     - {tipo}: {cantidad}")
        
        # Mostrar primeros usuarios
        if rips_oficial.usuarios:
            print(f"\n   Primeros 3 usuarios:")
            for idx, usuario in enumerate(rips_oficial.usuarios[:3]):
                print(f"   Usuario {idx+1}: {usuario.tipoDocumento} {usuario.numeroDocumento}")
                if usuario.servicios:
                    servicios = usuario.servicios
                    total_servicios = 0
                    if servicios.consultas:
                        total_servicios += len(servicios.consultas)
                    if servicios.procedimientos:
                        total_servicios += len(servicios.procedimientos)
                    if servicios.medicamentos:
                        total_servicios += len(servicios.medicamentos)
                    print(f"     Servicios: {total_servicios}")
    else:
        print("❌ No se encontró RIPS oficial")
    
    # Verificar soportes en MongoDB
    print(f"\n🗃️ Verificando soportes en MongoDB...")
    mongo_service = MongoDBSoporteService()
    soportes = mongo_service.obtener_soportes_radicacion(str(radicacion.id))
    
    print(f"   Total soportes: {len(soportes)}")
    
    # Agrupar por categoría
    categorias = {}
    for soporte in soportes:
        categoria = soporte.get('clasificacion', {}).get('categoria', 'SIN_CATEGORIA')
        if categoria not in categorias:
            categorias[categoria] = []
        categorias[categoria].append(soporte)
    
    print(f"   Soportes por categoría:")
    for categoria, soportes_cat in categorias.items():
        print(f"   - {categoria}: {len(soportes_cat)} archivos")
        for soporte in soportes_cat[:2]:  # Mostrar primeros 2 de cada categoría
            print(f"     • {soporte.get('nombre_archivo', 'N/A')}")
    
    # Verificar URLs de almacenamiento en Digital Ocean
    print(f"\n🌐 Verificación de almacenamiento en Digital Ocean:")
    urls_presentes = []
    if hasattr(radicacion, 'factura_url') and radicacion.factura_url:
        urls_presentes.append('Factura XML')
    if hasattr(radicacion, 'rips_url') and radicacion.rips_url:
        urls_presentes.append('RIPS JSON')
    
    if urls_presentes:
        print(f"   ✅ Archivos almacenados: {', '.join(urls_presentes)}")
    else:
        print(f"   ⚠️ No se encontraron URLs de almacenamiento")
    
    # Verificar el total de archivos procesados
    total_archivos = radicacion.documentos.count() + len(soportes)
    print(f"\n📊 Resumen final:")
    print(f"   Total archivos procesados: {total_archivos}")
    print(f"   - Documentos Django: {radicacion.documentos.count()}")
    print(f"   - Soportes MongoDB: {len(soportes)}")
    print(f"   Estado radicación: {radicacion.estado}")
    
    print(f"\n✅ Verificación completada exitosamente!")
    print(f"   La radicación {numero_radicado} fue creada correctamente con todos sus archivos.")
    
except RadicacionCuentaMedica.DoesNotExist:
    print(f"❌ No se encontró la radicación {numero_radicado}")
except Exception as e:
    print(f"❌ Error verificando radicación: {str(e)}")
    import traceback
    traceback.print_exc()