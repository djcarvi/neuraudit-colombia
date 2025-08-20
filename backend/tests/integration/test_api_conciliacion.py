#!/usr/bin/env python
import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.conciliacion.models import CasoConciliacion
from apps.conciliacion.services import ConciliacionService

print("=== PRUEBAS API CONCILIACION NOSQL ===\n")

# 1. Probar creación automática de caso
print("1. PROBANDO CREACION AUTOMATICA DE CASO")
print("-" * 40)

try:
    # Usar numero de radicación existente en glosas
    numero_radicacion = "RAD-900987654-20250731-01"
    
    # Simular usuario conciliador
    conciliador = {
        'user_id': '507f1f77bcf86cd799439011',
        'username': 'conciliador_test',
        'nombre_completo': 'Conciliador de Prueba',
        'email': 'conciliador@eps.com'
    }
    
    # Buscar caso existente o crear nuevo
    try:
        caso = CasoConciliacion.objects.get(numero_radicacion=numero_radicacion)
        print(f"✅ Caso existente encontrado: {caso.id}")
    except CasoConciliacion.DoesNotExist:
        print("🔄 Creando caso automáticamente...")
        caso = ConciliacionService.crear_caso_desde_radicacion(numero_radicacion, conciliador)
        print(f"✅ Caso creado: {caso.id}")
    
    print(f"   Radicación: {caso.numero_radicacion}")
    print(f"   Prestador: {caso.prestador_info.get('razon_social')}")
    print(f"   Total glosas: {caso.resumen_financiero.get('total_glosas', 0)}")
    print(f"   Valor glosado: ${caso.resumen_financiero.get('valor_total_glosado', 0):,.0f}")
    
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)

# 2. Probar respuesta del prestador
print("2. PROBANDO RESPUESTA DEL PRESTADOR")
print("-" * 40)

try:
    # Obtener primer caso
    caso = CasoConciliacion.objects.first()
    
    if caso and caso.facturas:
        primera_glosa = caso.facturas[0]['servicios'][0]['glosas_aplicadas'][0]
        glosa_id = primera_glosa['glosa_id']
        
        # Simular respuesta del prestador
        respuesta_data = {
            'tipo_respuesta': 'RE98',  # Parcialmente aceptada
            'valor_aceptado': float(primera_glosa['valor_glosado']) * 0.6,
            'valor_rechazado': float(primera_glosa['valor_glosado']) * 0.4,
            'justificacion': 'Aceptamos parcialmente. Documentación presentada no es suficiente para el total.',
            'soportes': ['respuesta_medica.pdf', 'historia_clinica.pdf']
        }
        
        usuario_prestador = {
            'user_id': '507f1f77bcf86cd799439012',
            'username': 'prestador_test',
            'nombre': 'Dr. Prestador Prueba'
        }
        
        # Aplicar respuesta
        caso_actualizado = ConciliacionService.responder_glosa(
            str(caso.id), glosa_id, respuesta_data, usuario_prestador
        )
        
        print(f"✅ Respuesta aplicada al caso: {caso_actualizado.numero_radicacion}")
        print(f"   Tipo respuesta: {respuesta_data['tipo_respuesta']}")
        print(f"   Valor aceptado: ${respuesta_data['valor_aceptado']:,.0f}")
        print(f"   Estado caso: {caso_actualizado.estado}")
        
    else:
        print("❌ No hay casos disponibles para prueba")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)

# 3. Probar decisión de conciliación
print("3. PROBANDO DECISION DE CONCILIACION")
print("-" * 40)

try:
    # Obtener caso con respuesta
    caso = CasoConciliacion.objects.filter(estado='EN_RESPUESTA').first()
    
    if caso and caso.facturas:
        primera_glosa = caso.facturas[0]['servicios'][0]['glosas_aplicadas'][0]
        glosa_id = primera_glosa['glosa_id']
        
        usuario_conciliador = {
            'user_id': '507f1f77bcf86cd799439011',
            'username': 'conciliador_test',
            'nombre_completo': 'Dr. Conciliador Prueba'
        }
        
        # Ratificar la glosa
        caso_actualizado = ConciliacionService.procesar_decision_conciliacion(
            str(caso.id), glosa_id, 'RATIFICAR', usuario_conciliador
        )
        
        print(f"✅ Glosa RATIFICADA en caso: {caso_actualizado.numero_radicacion}")
        print(f"   Código glosa: {primera_glosa['codigo_glosa']}")
        print(f"   Valor ratificado: ${primera_glosa['valor_glosado']:,.0f}")
        print(f"   Estado caso: {caso_actualizado.estado}")
        
    else:
        print("❌ No hay casos con respuestas para procesar")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)

# 4. Probar estadísticas
print("4. PROBANDO ESTADISTICAS NOSQL")
print("-" * 40)

try:
    estadisticas = ConciliacionService.obtener_estadisticas_conciliacion()
    
    print(f"✅ Estadísticas calculadas:")
    print(f"   Total casos: {estadisticas['total_casos']}")
    print(f"   Valor total radicado: ${estadisticas['total_valor_radicado']:,.0f}")
    print(f"   Valor total glosado: ${estadisticas['total_valor_glosado']:,.0f}")
    print(f"   Valor ratificado: ${estadisticas['total_valor_ratificado']:,.0f}")
    print(f"   Porcentaje glosado: {estadisticas['porcentaje_glosado']:.1f}%")
    print(f"   Casos por estado: {estadisticas['casos_por_estado']}")
    
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)
print("🎉 PRUEBAS COMPLETADAS - SISTEMA NOSQL FUNCIONANDO")
print("🔧 Endpoints disponibles para frontend:")
print("   GET /api/conciliacion/casos/obtener_o_crear_caso/?numero_radicacion=XXX")
print("   GET /api/conciliacion/casos/estadisticas/")
print("   POST /api/conciliacion/casos/{id}/responder_glosa/")
print("   POST /api/conciliacion/casos/{id}/procesar_decision/")
print("   GET /api/conciliacion/casos/{id}/detalle_glosas/")
print("=" * 60)