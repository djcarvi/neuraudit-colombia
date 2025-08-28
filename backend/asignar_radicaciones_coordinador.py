#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script para que el COORDINADOR asigne las radicaciones reales pendientes
Simula el flujo completo de asignación automática
"""

import os
import django
from pymongo import MongoClient
from datetime import datetime
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from apps.core.services.asignacion_service import AsignacionService

def mostrar_estado_actual():
    """Muestra el estado actual del sistema"""
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    print("\n=== 📊 ESTADO ACTUAL DEL SISTEMA ===")
    
    # Contar radicaciones pendientes
    radicaciones_pendientes = db.radicaciones_cuentas_medicas.count_documents({
        'estado': {'$in': ['RADICADA', 'VALIDADO', 'PENDIENTE_ASIGNACION']}
    })
    print(f"\n📋 Radicaciones pendientes de asignación: {radicaciones_pendientes}")
    
    # Mostrar detalle
    if radicaciones_pendientes > 0:
        radicaciones = db.radicaciones_cuentas_medicas.find({
            'estado': {'$in': ['RADICADA', 'VALIDADO', 'PENDIENTE_ASIGNACION']}
        }).limit(10)
        
        print("\nDetalle de radicaciones pendientes:")
        for rad in radicaciones:
            print(f"  - {rad['numero_radicado']} | {rad['prestador_info']['razon_social']} | ${rad['valor_total_facturado']:,.0f}")
    
    # Contar auditores disponibles
    auditores_disponibles = db.auditores_perfiles.count_documents({
        'disponibilidad.activo': True,
        'disponibilidad.vacaciones': False
    })
    print(f"\n👥 Auditores disponibles: {auditores_disponibles}")
    
    # Mostrar auditores
    auditores = db.auditores_perfiles.find({
        'disponibilidad.activo': True
    })
    for auditor in auditores:
        print(f"  - {auditor['username']} ({auditor['perfil']}) - Capacidad: {auditor['capacidad_maxima_dia']} casos/día")
    
    return radicaciones_pendientes > 0

def generar_propuesta_asignacion():
    """Genera propuesta de asignación automática"""
    print("\n=== 🤖 GENERANDO PROPUESTA DE ASIGNACIÓN AUTOMÁTICA ===")
    
    service = AsignacionService()
    coordinador_username = "admin.coordinador"  # Usuario coordinador de ejemplo
    
    try:
        propuesta_id = service.generar_propuesta_asignacion(coordinador_username)
        
        if propuesta_id:
            print(f"\n✅ Propuesta generada exitosamente")
            print(f"📄 ID de propuesta: {propuesta_id}")
            
            # Obtener detalles de la propuesta
            propuesta = service.asignaciones_automaticas.find_one({'_id': propuesta_id})
            
            print(f"\n📊 MÉTRICAS DE LA PROPUESTA:")
            metricas = propuesta['metricas_distribucion']
            print(f"  - Total radicaciones: {metricas['total_radicaciones']}")
            print(f"  - Auditores involucrados: {metricas['auditores_involucrados']}")
            print(f"  - Balance del algoritmo: {metricas['balance_score']*100:.1f}%")
            print(f"  - Valor total asignado: ${metricas['valor_total_asignado']:,.0f}")
            
            print(f"\n📋 DISTRIBUCIÓN POR TIPO:")
            print(f"  - Ambulatorio: {metricas['tipos_servicio']['ambulatorio']}")
            print(f"  - Hospitalario: {metricas['tipos_servicio']['hospitalario']}")
            
            print(f"\n🎯 DISTRIBUCIÓN POR PRIORIDAD:")
            print(f"  - Alta: {metricas['distribucion_prioridad']['alta']}")
            print(f"  - Media: {metricas['distribucion_prioridad']['media']}")
            print(f"  - Baja: {metricas['distribucion_prioridad']['baja']}")
            
            print(f"\n👥 ASIGNACIONES POR AUDITOR:")
            for auditor, data in metricas['distribucion_auditores'].items():
                print(f"  - {auditor}: {data['count']} casos (peso total: {data['peso_total']:.1f})")
            
            return propuesta_id
        else:
            print("\n⚠️ No hay radicaciones pendientes para asignar")
            return None
            
    except Exception as e:
        print(f"\n❌ Error generando propuesta: {str(e)}")
        return None

def revisar_propuesta(propuesta_id):
    """Muestra detalles de las asignaciones individuales"""
    print("\n=== 📋 DETALLE DE ASIGNACIONES PROPUESTAS ===")
    
    service = AsignacionService()
    propuesta = service.asignaciones_automaticas.find_one({'_id': propuesta_id})
    
    if not propuesta:
        print("❌ Propuesta no encontrada")
        return
    
    asignaciones = propuesta['asignaciones_individuales']
    print(f"\nTotal de asignaciones: {len(asignaciones)}")
    
    # Mostrar primeras 10 asignaciones
    print("\nPrimeras 10 asignaciones:")
    print("-" * 120)
    print(f"{'Radicación':<15} {'Prestador':<30} {'Auditor':<20} {'Tipo':<15} {'Prioridad':<10} {'Valor':<15}")
    print("-" * 120)
    
    for asig in asignaciones[:10]:
        prestador = asig['prestador_info']['razon_social'][:28] if asig.get('prestador_info') else 'N/A'
        print(f"{asig['numero_radicado']:<15} {prestador:<30} {asig['auditor_asignado']:<20} "
              f"{asig['tipo_auditoria']:<15} {asig['prioridad']:<10} ${asig['valor_auditoria']:>14,.0f}")
    
    if len(asignaciones) > 10:
        print(f"\n... y {len(asignaciones) - 10} asignaciones más")
    
    return True

def aprobar_propuesta(propuesta_id):
    """Aprueba la propuesta de asignación"""
    print("\n=== ✅ APROBANDO PROPUESTA ===")
    
    service = AsignacionService()
    coordinador_username = "admin.coordinador"
    
    decision = {
        'accion': 'APROBAR_MASIVO',
        'justificacion': 'Aprobación de propuesta con distribución equitativa'
    }
    
    try:
        resultado = service.procesar_decision_coordinador(
            propuesta_id, 
            decision, 
            coordinador_username
        )
        
        if resultado:
            print("\n✅ Propuesta aprobada exitosamente")
            print("📧 Las asignaciones han sido creadas y los auditores serán notificados")
            
            # Verificar cambios en la BD
            client = MongoClient(settings.MONGODB_URI)
            db = client[settings.MONGODB_DATABASE]
            
            # Contar asignaciones creadas
            asignaciones_creadas = db.asignaciones_auditoria.count_documents({
                'propuesta_id': propuesta_id
            })
            
            print(f"\n📊 RESULTADO:")
            print(f"  - Asignaciones creadas: {asignaciones_creadas}")
            print(f"  - Estado de radicaciones actualizado a: ASIGNADA")
            
            return True
        else:
            print("\n❌ Error al aprobar la propuesta")
            return False
            
    except Exception as e:
        print(f"\n❌ Error procesando decisión: {str(e)}")
        return False

def main():
    """Flujo principal del coordinador"""
    print("=" * 60)
    print("🏥 SISTEMA DE ASIGNACIÓN AUTOMÁTICA - NEURAUDIT")
    print("👤 Usuario: Coordinador de Auditoría")
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # 1. Mostrar estado actual
    hay_pendientes = mostrar_estado_actual()
    
    if not hay_pendientes:
        print("\n✅ No hay radicaciones pendientes de asignación")
        return
    
    # 2. Preguntar si generar propuesta
    print("\n" + "="*60)
    respuesta = input("\n¿Desea generar una propuesta de asignación automática? (s/n): ")
    
    if respuesta.lower() != 's':
        print("Operación cancelada")
        return
    
    # 3. Generar propuesta
    propuesta_id = generar_propuesta_asignacion()
    
    if not propuesta_id:
        return
    
    # 4. Revisar propuesta
    print("\n" + "="*60)
    respuesta = input("\n¿Desea revisar el detalle de las asignaciones? (s/n): ")
    
    if respuesta.lower() == 's':
        revisar_propuesta(propuesta_id)
    
    # 5. Aprobar o rechazar
    print("\n" + "="*60)
    print("\n¿Qué desea hacer con esta propuesta?")
    print("1. Aprobar todas las asignaciones")
    print("2. Rechazar la propuesta")
    print("3. Salir sin hacer cambios")
    
    opcion = input("\nSeleccione una opción (1-3): ")
    
    if opcion == '1':
        aprobar_propuesta(propuesta_id)
    elif opcion == '2':
        print("\n❌ Propuesta rechazada")
        print("💡 Puede generar una nueva propuesta o realizar asignaciones manuales")
    else:
        print("\n👋 Saliendo sin cambios")
    
    print("\n" + "="*60)
    print("✅ Proceso completado")

if __name__ == "__main__":
    main()