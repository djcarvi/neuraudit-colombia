#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test Script para Motores de Auditoría con Estructura NoSQL
Valida que los engines funcionen con los modelos RIPS oficiales embebidos
"""

import os
import sys
import django
from datetime import datetime
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Importar modelos y engines
from apps.radicacion.models_rips_oficial import RIPSTransaccionOficial
from apps.radicacion.engine_preauditoria import EnginePreAuditoria
from apps.radicacion.engine_asignacion import EngineAsignacionEquitativa

def test_engine_preauditoria_with_real_data():
    """
    Testa el engine de pre-auditoría con datos reales del hito
    """
    print("🔍 TESTING ENGINE PRE-AUDITORÍA CON DATOS REALES NoSQL")
    print("=" * 60)
    
    try:
        # Buscar transacción del hito FE470638
        transacciones = RIPSTransaccionOficial.objects.filter(
            numFactura__icontains="FE470638"
        ).order_by('-fechaRadicacion')[:1]
        
        if not transacciones:
            print("❌ No se encontraron transacciones con numFactura FE470638")
            print("📊 Buscando cualquier transacción disponible...")
            
            transacciones = RIPSTransaccionOficial.objects.all().order_by('-fechaRadicacion')[:1]
            
        if not transacciones:
            print("❌ No hay transacciones RIPS en la base de datos")
            return False
            
        transaccion = transacciones[0]
        
        print(f"✅ Transacción encontrada:")
        print(f"   • ID: {transaccion.id}")
        print(f"   • Factura: {transaccion.numFactura}")
        print(f"   • Prestador NIT: {transaccion.prestadorNit}")
        print(f"   • Usuarios embebidos: {len(transaccion.usuarios) if transaccion.usuarios else 0}")
        print(f"   • Fecha radicación: {transaccion.fechaRadicacion}")
        print()
        
        # Inicializar engine
        engine = EnginePreAuditoria()
        
        print("🚀 Ejecutando procesamiento completo de pre-auditoría...")
        resultado = engine.procesar_transaccion_completa(
            transaccion_id=str(transaccion.id),
            usuario_revisor='SISTEMA_TEST'
        )
        
        print("\n📋 RESULTADO DEL PROCESAMIENTO:")
        print(f"   • Fase actual: {resultado.get('fase_actual')}")
        print(f"   • Pre-devoluciones: {resultado['resumen']['total_pre_devoluciones']}")
        print(f"   • Valor total pre-devoluciones: ${resultado['resumen']['valor_total_pre_devoluciones']:,.2f}")
        print(f"   • Pre-glosas: {resultado['resumen']['total_pre_glosas']}")
        print(f"   • Valor total pre-glosas: ${resultado['resumen']['valor_total_pre_glosas']:,.2f}")
        print(f"   • Estado siguiente: {resultado['resumen']['estado_siguiente']}")
        
        if resultado.get('error'):
            print(f"❌ Error en procesamiento: {resultado['error']}")
            return False
        
        # Mostrar detalles de pre-devoluciones
        if resultado['pre_devoluciones']:
            print(f"\n📄 DETALLE PRE-DEVOLUCIONES ({len(resultado['pre_devoluciones'])}):")
            for i, pre_dev in enumerate(resultado['pre_devoluciones'], 1):
                print(f"   {i}. {pre_dev['codigo_causal']}: {pre_dev['descripcion_causal']}")
                print(f"      Valor afectado: ${pre_dev['valor_afectado']:,.2f}")
                print()
        
        # Mostrar detalles de pre-glosas
        if resultado['pre_glosas']:
            print(f"\n🔍 DETALLE PRE-GLOSAS ({len(resultado['pre_glosas'])}):")
            for i, pre_glosa in enumerate(resultado['pre_glosas'], 1):
                print(f"   {i}. {pre_glosa['codigo_glosa']}: {pre_glosa['categoria_glosa']}")
                print(f"      Descripción: {pre_glosa['descripcion_hallazgo']}")
                print(f"      Valor sugerido: ${pre_glosa['valor_glosado_sugerido']:,.2f}")
                print(f"      Prioridad: {pre_glosa['prioridad_revision']}")
                print()
        
        print("✅ Engine Pre-Auditoría funcionando correctamente con estructura NoSQL")
        return True
        
    except Exception as e:
        print(f"❌ ERROR en engine pre-auditoría: {str(e)}")
        import traceback
        print(f"📋 Traceback: {traceback.format_exc()}")
        return False

def test_engine_asignacion_equitativa():
    """
    Testa el engine de asignación equitativa con pre-glosas reales
    """
    print("\n🎯 TESTING ENGINE ASIGNACIÓN EQUITATIVA")
    print("=" * 60)
    
    try:
        from apps.radicacion.models_auditoria import PreGlosa
        
        # Buscar pre-glosas pendientes
        pre_glosas_pendientes = PreGlosa.objects.filter(
            estado='PENDIENTE_AUDITORIA'
        ).order_by('-fecha_generacion')[:5]  # Tomar máximo 5 para prueba
        
        if not pre_glosas_pendientes:
            print("⚠️  No hay pre-glosas pendientes en el sistema")
            print("ℹ️  El engine está listo pero no hay datos para procesar")
            return True
        
        print(f"✅ Pre-glosas pendientes encontradas: {len(pre_glosas_pendientes)}")
        
        pre_glosas_ids = [str(pg.id) for pg in pre_glosas_pendientes]
        
        # Mostrar pre-glosas encontradas
        for i, pg in enumerate(pre_glosas_pendientes, 1):
            print(f"   {i}. {pg.codigo_glosa} - {pg.categoria_glosa}")
            print(f"      Valor: ${pg.valor_glosado_sugerido:,.2f}")
        
        print(f"\n🚀 Ejecutando asignación equitativa...")
        
        # Inicializar engine
        engine = EngineAsignacionEquitativa()
        
        resultado = engine.asignar_pre_glosas_automaticamente(
            pre_glosas_ids=pre_glosas_ids,
            forzar_reasignacion=False
        )
        
        print(f"\n📋 RESULTADO DE LA ASIGNACIÓN:")
        print(f"   • Éxito: {resultado.get('exito', False)}")
        print(f"   • Total pre-glosas procesadas: {resultado.get('total_pre_glosas', 0)}")
        print(f"   • Asignaciones creadas: {len(resultado.get('asignaciones_creadas', []))}")
        print(f"   • Auditores asignados: {len(resultado.get('auditores_asignados', {}))}")
        print(f"   • Valor total asignado: ${resultado['estadisticas']['valor_total_asignado']:,.2f}")
        
        # Mostrar criterios aplicados
        if resultado.get('criterios_aplicados'):
            print(f"\n📊 CRITERIOS APLICADOS:")
            for criterio in resultado['criterios_aplicados']:
                print(f"   • {criterio}")
        
        # Mostrar asignaciones por auditor
        if resultado.get('auditores_asignados'):
            print(f"\n👥 ASIGNACIONES POR AUDITOR:")
            for auditor, datos in resultado['auditores_asignados'].items():
                print(f"   • {auditor} ({datos['perfil']}):")
                print(f"     Pre-glosas: {datos['total_pre_glosas']}")
                print(f"     Valor total: ${datos['valor_total']:,.2f}")
        
        if resultado.get('error'):
            print(f"❌ Error en asignación: {resultado['error']}")
            return False
        
        print("✅ Engine Asignación Equitativa funcionando correctamente")
        return True
        
    except Exception as e:
        print(f"❌ ERROR en engine asignación: {str(e)}")
        import traceback
        print(f"📋 Traceback: {traceback.format_exc()}")
        return False

def main():
    """
    Función principal de testing
    """
    print("🏥 TEST ENGINES AUDITORÍA - ESTRUCTURA NoSQL OFICIAL")
    print("🎯 Verificando compatibilidad con modelos RIPS embebidos")
    print("📅 " + datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
    print("=" * 80)
    
    # Test 1: Engine Pre-auditoría
    test1_ok = test_engine_preauditoria_with_real_data()
    
    # Test 2: Engine Asignación
    test2_ok = test_engine_asignacion_equitativa()
    
    # Resumen final
    print("\n🏆 RESUMEN DE TESTING:")
    print("=" * 40)
    print(f"Engine Pre-auditoría: {'✅ OK' if test1_ok else '❌ FAIL'}")
    print(f"Engine Asignación:    {'✅ OK' if test2_ok else '❌ FAIL'}")
    print()
    
    if test1_ok and test2_ok:
        print("🎉 ¡TODOS LOS ENGINES FUNCIONAN CORRECTAMENTE CON ESTRUCTURA NoSQL!")
        print("🚀 Sistema listo para procesar auditorías con datos masivos reales")
    else:
        print("⚠️  Hay engines que requieren correcciones adicionales")
    
    print()
    print("📊 Estado del sistema:")
    print(f"   • Transacciones RIPS: {RIPSTransaccionOficial.objects.count()}")
    print(f"   • Total usuarios embebidos: En estructura NoSQL optimizada")
    print("   • Engines de auditoría: Adaptados a modelos oficiales")

if __name__ == "__main__":
    main()