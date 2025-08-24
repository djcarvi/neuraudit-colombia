#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script final para verificar la radicación RAD-901019681-20250822-04
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
print(f"\n{'='*60}")
print(f"🔍 VERIFICACIÓN DE RADICACIÓN: {numero_radicado}")
print(f"{'='*60}")

try:
    radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
    print(f"\n✅ RADICACIÓN ENCONTRADA!")
    print(f"   ID: {radicacion.id}")
    print(f"   Estado: {radicacion.estado}")
    print(f"   Prestador: {radicacion.pss_nombre}")
    print(f"   NIT: {radicacion.pss_nit}")
    print(f"   Factura: {radicacion.factura_numero}")
    print(f"   Valor: ${radicacion.factura_valor_total:,.2f}")
    print(f"   Fecha creación: {radicacion.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Verificar RIPS en modelo oficial
    print(f"\n📊 VERIFICANDO RIPS (NoSQL)...")
    rips_oficial = RIPSTransaccion.objects.filter(
        numFactura=radicacion.factura_numero,
        prestadorNit=radicacion.pss_nit
    ).first()
    
    if rips_oficial:
        print(f"✅ RIPS encontrado!")
        print(f"   ID: {rips_oficial.id}")
        print(f"   Estado procesamiento: {rips_oficial.estadoProcesamiento}")
        
        # Contar usuarios y servicios embebidos
        if rips_oficial.usuarios:
            total_usuarios = len(rips_oficial.usuarios)
            total_servicios = 0
            
            for usuario in rips_oficial.usuarios:
                if usuario.servicios:
                    if usuario.servicios.consultas:
                        total_servicios += len(usuario.servicios.consultas)
                    if usuario.servicios.procedimientos:
                        total_servicios += len(usuario.servicios.procedimientos)
                    if usuario.servicios.medicamentos:
                        total_servicios += len(usuario.servicios.medicamentos)
                    if usuario.servicios.urgencias:
                        total_servicios += len(usuario.servicios.urgencias)
                    if usuario.servicios.hospitalizacion:
                        total_servicios += len(usuario.servicios.hospitalizacion)
                    if usuario.servicios.otrosServicios:
                        total_servicios += len(usuario.servicios.otrosServicios)
                    if usuario.servicios.recienNacidos:
                        total_servicios += len(usuario.servicios.recienNacidos)
            
            print(f"   Usuarios procesados: {total_usuarios}")
            print(f"   Servicios totales: {total_servicios}")
            
            # Mostrar primer usuario como ejemplo
            if total_usuarios > 0:
                primer_usuario = rips_oficial.usuarios[0]
                print(f"\n   Ejemplo - Primer usuario:")
                print(f"     Documento: {primer_usuario.tipoDocumento} {primer_usuario.numeroDocumento}")
                if primer_usuario.servicios:
                    print(f"     Servicios del usuario:")
                    if primer_usuario.servicios.consultas:
                        print(f"       - Consultas: {len(primer_usuario.servicios.consultas)}")
                    if primer_usuario.servicios.procedimientos:
                        print(f"       - Procedimientos: {len(primer_usuario.servicios.procedimientos)}")
                    if primer_usuario.servicios.medicamentos:
                        print(f"       - Medicamentos: {len(primer_usuario.servicios.medicamentos)}")
    else:
        # Buscar con criterios más amplios
        print("⚠️ No se encontró RIPS con criterios exactos, buscando alternativas...")
        cualquier_rips = RIPSTransaccion.objects.filter(numFactura=radicacion.factura_numero).first()
        if cualquier_rips:
            print(f"   Encontrado RIPS con factura {radicacion.factura_numero}")
            print(f"   NIT en RIPS: {cualquier_rips.prestadorNit}")
            print(f"   Estado: {cualquier_rips.estadoProcesamiento}")
    
    # Verificar soportes usando el método correcto
    print(f"\n🗃️ VERIFICANDO SOPORTES...")
    mongo_service = MongoDBSoporteService()
    
    # Usar el método correcto
    resultado_clasificacion = mongo_service.obtener_soportes_clasificados(str(radicacion.id))
    
    if resultado_clasificacion.get('exito'):
        soportes = resultado_clasificacion.get('soportes', [])
        print(f"✅ Soportes encontrados: {len(soportes)}")
        
        # Mostrar estadísticas
        stats = resultado_clasificacion.get('estadisticas', {})
        if stats:
            print(f"\n   Estadísticas de clasificación:")
            print(f"   Total archivos: {stats.get('total_archivos', 0)}")
            print(f"   Documentos básicos: {stats.get('documentos_basicos', 0)}")
            print(f"   Historias clínicas: {stats.get('historias_clinicas', 0)}")
            print(f"   Exámenes: {stats.get('examenes_diagnosticos', 0)}")
            print(f"   Prescripciones: {stats.get('prescripciones', 0)}")
            print(f"   Administrativos: {stats.get('administrativos', 0)}")
        
        # Mostrar algunos archivos
        if soportes:
            print(f"\n   Primeros archivos:")
            for soporte in soportes[:5]:
                print(f"   - {soporte.get('nombre_archivo', 'N/A')}")
                if soporte.get('clasificacion'):
                    print(f"     Categoría: {soporte['clasificacion'].get('categoria', 'N/A')}")
                    print(f"     Código: {soporte['clasificacion'].get('codigo', 'N/A')}")
    else:
        print(f"⚠️ No se encontraron soportes o hubo un error: {resultado_clasificacion.get('mensaje', 'Error desconocido')}")
    
    # Verificar almacenamiento en Digital Ocean
    print(f"\n🌐 ALMACENAMIENTO DIGITAL OCEAN:")
    if hasattr(radicacion, 'factura_url') and radicacion.factura_url:
        print(f"   ✅ Factura XML almacenada")
    else:
        print(f"   ❌ Factura XML no encontrada")
        
    if hasattr(radicacion, 'rips_url') and radicacion.rips_url:
        print(f"   ✅ RIPS JSON almacenado")
    else:
        print(f"   ❌ RIPS JSON no encontrado")
    
    # Resumen final
    print(f"\n{'='*60}")
    print(f"📊 RESUMEN FINAL:")
    print(f"{'='*60}")
    print(f"✅ Radicación creada exitosamente")
    print(f"✅ Número: {numero_radicado}")
    print(f"✅ Estado actual: {radicacion.estado}")
    
    # Verificar proceso completo
    proceso_completo = True
    mensajes = []
    
    if not rips_oficial:
        proceso_completo = False
        mensajes.append("⚠️ RIPS no procesado en MongoDB")
    
    if not resultado_clasificacion.get('exito') or len(resultado_clasificacion.get('soportes', [])) == 0:
        proceso_completo = False
        mensajes.append("⚠️ Soportes no encontrados en MongoDB")
    
    if proceso_completo:
        print(f"\n✅ TODOS LOS COMPONENTES VERIFICADOS CORRECTAMENTE")
    else:
        print(f"\n⚠️ ADVERTENCIAS:")
        for msg in mensajes:
            print(f"   {msg}")
    
    print(f"\n{'='*60}\n")
    
except RadicacionCuentaMedica.DoesNotExist:
    print(f"\n❌ ERROR: No se encontró la radicación {numero_radicado}")
    print(f"   Verifique el número de radicación\n")
except Exception as e:
    print(f"\n❌ ERROR INESPERADO: {str(e)}")
    import traceback
    traceback.print_exc()