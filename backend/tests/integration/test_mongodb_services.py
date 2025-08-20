#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de Testing Servicios MongoDB Nativos - NeurAudit Colombia
Valida servicios de catálogos y RIPS con operaciones nativas
"""

import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from datetime import datetime, date, timedelta
from decimal import Decimal
import json

# Import servicios
from apps.core.services.mongodb_service import mongodb_service
from apps.catalogs.services import catalogs_service
from apps.radicacion.services_rips import rips_service

def test_busqueda_cups():
    """Test búsqueda avanzada CUPS"""
    print("\n=== TEST BÚSQUEDA CUPS ===")
    
    try:
        # Primero crear algunos registros de prueba
        from apps.catalogs.models import CatalogoCUPSOficial
        
        cups_test = [
            {
                "codigo": "890201",
                "nombre": "CONSULTA PRIMERA VEZ MEDICINA GENERAL",
                "descripcion": "Consulta medicina general",
                "es_quirurgico": False,
                "sexo": "Z",
                "ambito": "A",
                "habilitado": True,
                "fecha_actualizacion": datetime.now()
            },
            {
                "codigo": "432001",
                "nombre": "CESÁREA",
                "descripcion": "Procedimiento quirúrgico cesárea",
                "es_quirurgico": True,
                "sexo": "F",
                "ambito": "H",
                "habilitado": True,
                "fecha_actualizacion": datetime.now()
            }
        ]
        
        # Crear registros
        for cups_data in cups_test:
            CatalogoCUPSOficial.objects.update_or_create(
                codigo=cups_data["codigo"],
                defaults=cups_data
            )
        
        # Test búsqueda simple
        resultados = catalogs_service.buscar_cups_avanzado("consulta")
        print(f"✅ Búsqueda 'consulta': {len(resultados)} resultados")
        
        # Test búsqueda con filtros
        filtros = {"es_quirurgico": True, "sexo": "F"}
        resultados_filtrados = catalogs_service.buscar_cups_avanzado("", filtros)
        print(f"✅ Búsqueda con filtros (quirúrgico + femenino): {len(resultados_filtrados)} resultados")
        
        # Test validación CUPS con contexto
        contexto = {"sexo_paciente": "M", "ambito": "H"}
        validacion = catalogs_service.validar_codigo_cups("432001", contexto)
        
        print(f"✅ Validación CUPS 432001:")
        print(f"   Válido: {validacion['valido']}")
        if validacion.get('validaciones'):
            print(f"   Restricciones: {len(validacion['validaciones'])}")
            for v in validacion['validaciones']:
                print(f"     - {v['tipo']}: {v['mensaje']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test búsqueda CUPS: {e}")
        return False

def test_validacion_bdua():
    """Test validación BDUA integral"""
    print("\n=== TEST VALIDACIÓN BDUA ===")
    
    try:
        # Crear usuario BDUA de prueba
        from apps.catalogs.models import BDUAAfiliados
        
        usuario_bdua = BDUAAfiliados.objects.create(
            id_unico="TEST001",
            codigo_eps="EPS037",  # EPS Familiar
            regimen="CONTRIBUTIVO",
            usuario_tipo_documento="CC",
            usuario_numero_documento="9876543210",
            usuario_primer_apellido="RODRÍGUEZ",
            usuario_primer_nombre="JUAN",
            usuario_fecha_nacimiento=date(1980, 1, 1),
            usuario_sexo="M",
            ubicacion_departamento="11",
            ubicacion_municipio="001",
            afiliacion_fecha_afiliacion=date(2020, 1, 1),
            afiliacion_fecha_efectiva_bd=date(2020, 1, 1),
            afiliacion_estado_afiliacion="AC"
        )
        
        # Test validación con derechos
        validacion = catalogs_service.validar_usuario_integral(
            "CC", "9876543210", "2025-01-30"
        )
        
        print(f"✅ Validación usuario con derechos:")
        print(f"   Tiene derechos: {validacion.get('tiene_derechos')}")
        print(f"   Régimen: {validacion.get('regimen')}")
        print(f"   EPS: {validacion.get('eps_actual')}")
        
        # Test validación sin derechos (fecha anterior)
        validacion_sin = catalogs_service.validar_usuario_integral(
            "CC", "9876543210", "2019-01-01"
        )
        
        print(f"\n✅ Validación fecha anterior a afiliación:")
        print(f"   Tiene derechos: {validacion_sin.get('tiene_derechos')}")
        print(f"   Causal: {validacion_sin.get('causal_devolucion')}")
        print(f"   Mensaje: {validacion_sin.get('mensaje')}")
        
        # Limpiar
        usuario_bdua.delete()
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test validación BDUA: {e}")
        return False

def test_procesamiento_rips():
    """Test procesamiento completo RIPS"""
    print("\n=== TEST PROCESAMIENTO RIPS ===")
    
    try:
        # Crear prestador de prueba
        from apps.catalogs.models import Prestadores
        
        prestador = Prestadores.objects.create(
            nit="900999888-7",
            razon_social="CLÍNICA DE PRUEBAS S.A.S",
            tipo_identificacion="NIT",
            numero_documento="900999888-7",
            tipo_prestador="PSS",
            categoria="IPS",
            estado="ACTIVO"
        )
        
        # Simular archivo RIPS
        archivo_rips = {
            "numFactura": "TEST-001",
            "archivo_path": "/tmp/test_rips.json",
            "tamaño_bytes": 1024,
            "usuarios": [
                {
                    "tipoDocumento": "CC",
                    "numeroDocumento": "1234567890",
                    "fechaNacimiento": "1985-06-15",
                    "sexo": "F",
                    "municipioResidencia": "11001",
                    "consultas": [
                        {
                            "codPrestador": "900999888-7",
                            "fechaAtencion": "2025-01-28T10:00:00",
                            "codConsulta": "890201",
                            "modalidadGrupoServicioTecSal": "01",
                            "grupoServicios": "01",
                            "codServicio": "01",
                            "finalidadTecnologiaSalud": "10",
                            "causaMotivo": "00",
                            "diagnosticoPrincipal": "I10X",
                            "tipoDiagnosticoPrincipal": "1",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "1234567890",
                            "vrServicio": 50000,
                            "conceptoRecaudo": "01",
                            "valorPagoModerador": 5000
                        }
                    ]
                }
            ]
        }
        
        prestador_info = {
            "nit": prestador.nit,
            "razon_social": prestador.razon_social
        }
        
        # Procesar RIPS
        resultado = rips_service.procesar_transaccion_rips(archivo_rips, prestador_info)
        
        print(f"✅ Procesamiento RIPS:")
        print(f"   Success: {resultado['success']}")
        print(f"   ID Transacción: {resultado.get('transaccion_id')}")
        print(f"   Total usuarios: {resultado.get('total_usuarios')}")
        print(f"   Total servicios: {resultado.get('total_servicios')}")
        print(f"   Valor total: ${resultado.get('valor_total'):,.2f}")
        
        # Test pre-auditoría
        if resultado.get('pre_auditoria'):
            pre_audit = resultado['pre_auditoria']
            print(f"\n✅ Pre-auditoría automática:")
            print(f"   Requiere auditoría: {pre_audit.get('requiere_auditoria')}")
            print(f"   Estado final: {pre_audit.get('estado_final')}")
            
            if pre_audit.get('devoluciones', {}).get('causales'):
                print(f"   Causales devolución: {len(pre_audit['devoluciones']['causales'])}")
        
        # Test búsqueda transacciones
        transacciones = rips_service.obtener_transacciones_prestador(
            prestador.nit,
            {"estado": "RADICADO"}
        )
        
        print(f"\n✅ Búsqueda transacciones prestador: {len(transacciones)} encontradas")
        
        # Limpiar
        if resultado.get('transaccion_id'):
            mongodb_service.db.rips_transacciones.delete_one(
                {"_id": resultado['transaccion_id']}
            )
        prestador.delete()
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test procesamiento RIPS: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_estadisticas_agregadas():
    """Test estadísticas y agregaciones MongoDB"""
    print("\n=== TEST ESTADÍSTICAS AGREGADAS ===")
    
    try:
        # Test estadísticas BDUA
        estadisticas_bdua = catalogs_service.obtener_estadisticas_bdua({
            "regimen": "CONTRIBUTIVO"
        })
        
        print(f"✅ Estadísticas BDUA:")
        print(f"   Total resultados: {len(estadisticas_bdua.get('estadisticas', []))}")
        
        # Test dashboard auditoría
        dashboard = rips_service.obtener_dashboard_auditoria()
        
        print(f"\n✅ Dashboard auditoría:")
        print(f"   Estados procesamiento: {len(dashboard.get('estadisticas_por_estado', []))}")
        print(f"   Balance auditores: {len(dashboard.get('balance_auditores', []))}")
        
        # Test estadísticas prestador (con fechas)
        desde = datetime.now() - timedelta(days=30)
        hasta = datetime.now()
        
        stats_prestador = mongodb_service.obtener_estadisticas_prestador(
            "900123456-7", desde, hasta
        )
        
        print(f"\n✅ Estadísticas prestador:")
        print(f"   Período: {stats_prestador.get('periodo', {}).get('desde')} a {stats_prestador.get('periodo', {}).get('hasta')}")
        print(f"   Total facturas: {stats_prestador.get('totales', {}).get('facturas', 0)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test estadísticas: {e}")
        return False

def test_busqueda_medicamentos():
    """Test búsqueda unificada medicamentos"""
    print("\n=== TEST BÚSQUEDA MEDICAMENTOS ===")
    
    try:
        # Crear medicamentos de prueba
        from apps.catalogs.models import CatalogoCUMOficial, CatalogoIUMOficial
        
        # CUM
        CatalogoCUMOficial.objects.create(
            codigo="20045678",
            nombre="ACETAMINOFEN 500MG TABLETA",
            descripcion="Analgésico y antipirético",
            principio_activo="ACETAMINOFEN",
            via_administracion="ORAL",
            habilitado=True,
            fecha_actualizacion=datetime.now()
        )
        
        # IUM
        CatalogoIUMOficial.objects.create(
            codigo="123456789012345",
            nombre="ACETAMINOFEN 500MG CAJA X 30",
            principio_activo="ACETAMINOFEN",
            forma_farmaceutica="TABLETA",
            habilitado=True,
            fecha_actualizacion=datetime.now()
        )
        
        # Búsqueda unificada
        resultados = catalogs_service.buscar_medicamento_unificado("acetaminofen", "AMBOS")
        
        print(f"✅ Búsqueda unificada 'acetaminofen':")
        print(f"   Total resultados: {len(resultados)}")
        
        for i, med in enumerate(resultados[:3]):
            print(f"   {i+1}. [{med['tipo_catalogo']}] {med['codigo']} - {med['nombre']} (Score: {med.get('score', 0)})")
        
        # Validación POS/No POS
        validacion_pos = catalogs_service.validar_medicamento_pos_nopos("20045678", "C")
        
        print(f"\n✅ Validación POS medicamento:")
        print(f"   Válido: {validacion_pos['valido']}")
        print(f"   Es POS: {validacion_pos.get('es_pos')}")
        print(f"   Requiere MIPRES: {validacion_pos.get('requiere_mipres')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test medicamentos: {e}")
        return False

def run_all_service_tests():
    """Ejecuta todos los tests de servicios"""
    print("\n" + "="*60)
    print("TESTS SERVICIOS MONGODB NATIVOS - NEURAUDIT")
    print("="*60)
    
    tests = [
        ("Búsqueda CUPS", test_busqueda_cups),
        ("Validación BDUA", test_validacion_bdua),
        ("Procesamiento RIPS", test_procesamiento_rips),
        ("Estadísticas Agregadas", test_estadisticas_agregadas),
        ("Búsqueda Medicamentos", test_busqueda_medicamentos)
    ]
    
    resultados = []
    
    for nombre, test_func in tests:
        print(f"\nEjecutando: {nombre}")
        resultado = test_func()
        resultados.append((nombre, resultado))
    
    # Resumen
    print("\n" + "="*60)
    print("RESUMEN DE TESTS SERVICIOS")
    print("="*60)
    
    total = len(resultados)
    exitosos = sum(1 for _, resultado in resultados if resultado)
    
    for nombre, resultado in resultados:
        estado = "✅ EXITOSO" if resultado else "❌ FALLIDO"
        print(f"{nombre}: {estado}")
    
    print(f"\nTotal: {exitosos}/{total} tests exitosos")
    
    if exitosos == total:
        print("\n🎉 TODOS LOS TESTS DE SERVICIOS PASARON!")
    else:
        print("\n⚠️ Algunos tests fallaron - Revisar errores")
    
    # Cerrar conexión MongoDB
    mongodb_service.close_connection()
    
    return exitosos == total

if __name__ == "__main__":
    success = run_all_service_tests()
    sys.exit(0 if success else 1)