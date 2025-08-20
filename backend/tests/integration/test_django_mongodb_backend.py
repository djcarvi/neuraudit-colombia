#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de Testing Django MongoDB Backend - NeurAudit Colombia
Valida la correcta implementación de modelos con ObjectIdAutoField
"""

import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from datetime import datetime, date
from decimal import Decimal
from bson import ObjectId

# Import de modelos para testing
from apps.catalogs.models import (
    CatalogoCUPSOficial, CatalogoCUMOficial, 
    BDUAAfiliados, Prestadores, Contratos
)
from apps.radicacion.models_rips_oficial import (
    RIPSTransaccion, RIPSUsuario, RIPSConsulta,
    RIPSUsuarioDatos, RIPSValidacionBDUA
)
from apps.authentication.models import User, UserSession

def test_catalogo_cups():
    """Test modelo CatalogoCUPSOficial"""
    print("\n=== TEST CATÁLOGO CUPS ===")
    
    try:
        # Crear registro
        cups = CatalogoCUPSOficial.objects.create(
            codigo="890201",
            nombre="CONSULTA PRIMERA VEZ MEDICINA GENERAL",
            descripcion="Consulta de primera vez por medicina general",
            habilitado=True,
            es_quirurgico=False,
            sexo="Z",  # Ambos sexos
            ambito="Z",  # Todos los ámbitos
            fecha_actualizacion=datetime.now()
        )
        
        print(f"✅ CUPS creado: {cups.id} (tipo: {type(cups.id)})")
        print(f"   Código: {cups.codigo}")
        print(f"   Nombre: {cups.nombre}")
        
        # Verificar que id es ObjectId
        assert isinstance(cups.id, ObjectId), "ID debe ser ObjectId"
        
        # Buscar por código
        cups_encontrado = CatalogoCUPSOficial.objects.filter(codigo="890201").first()
        assert cups_encontrado is not None, "Debe encontrar el CUPS"
        assert cups_encontrado.id == cups.id, "IDs deben coincidir"
        
        print("✅ Búsqueda por código exitosa")
        
        # Buscar por ObjectId
        cups_por_id = CatalogoCUPSOficial.objects.get(id=cups.id)
        assert cups_por_id.codigo == "890201", "Códigos deben coincidir"
        
        print("✅ Búsqueda por ObjectId exitosa")
        
        # Actualizar
        cups.descripcion = "Descripción actualizada con tildes y ñ"
        cups.save()
        
        print("✅ Actualización exitosa")
        
        # Eliminar
        cups.delete()
        print("✅ Eliminación exitosa")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test CUPS: {e}")
        return False

def test_bdua_afiliados():
    """Test modelo BDUAAfiliados"""
    print("\n=== TEST BDUA AFILIADOS ===")
    
    try:
        # Crear afiliado
        afiliado = BDUAAfiliados.objects.create(
            id_unico="BDUA2025001",
            codigo_eps="EPS037",
            regimen="CONTRIBUTIVO",
            usuario_tipo_documento="CC",
            usuario_numero_documento="1234567890",
            usuario_primer_apellido="PÉREZ",
            usuario_segundo_apellido="GONZÁLEZ",
            usuario_primer_nombre="MARÍA",
            usuario_segundo_nombre="JOSÉ",
            usuario_fecha_nacimiento=date(1985, 6, 15),
            usuario_sexo="F",
            ubicacion_departamento="11",  # Bogotá
            ubicacion_municipio="001",
            afiliacion_fecha_afiliacion=date(2020, 1, 1),
            afiliacion_fecha_efectiva_bd=date(2020, 1, 1),
            afiliacion_estado_afiliacion="AC"
        )
        
        print(f"✅ BDUA creado: {afiliado.id}")
        print(f"   Documento: {afiliado.usuario_numero_documento}")
        print(f"   Nombre: {afiliado.nombre_completo}")
        
        # Verificar propiedad calculada
        assert afiliado.tiene_derechos_vigentes == True, "Debe tener derechos vigentes"
        print("✅ Propiedad tiene_derechos_vigentes funciona")
        
        # Validar derechos en fecha
        validacion = afiliado.validar_derechos_en_fecha("2025-01-15")
        assert validacion['valido'] == True, "Debe ser válido en fecha actual"
        print("✅ Validación de derechos en fecha funciona")
        
        # Buscar por documento
        encontrado = BDUAAfiliados.objects.filter(
            usuario_numero_documento="1234567890"
        ).first()
        assert encontrado is not None, "Debe encontrar por documento"
        
        print("✅ Búsqueda por documento exitosa")
        
        # Eliminar
        afiliado.delete()
        print("✅ Eliminación exitosa")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test BDUA: {e}")
        return False

def test_rips_transaccion():
    """Test modelo RIPSTransaccion con subdocumentos"""
    print("\n=== TEST RIPS TRANSACCIÓN ===")
    
    try:
        # Crear transacción con subdocumentos embebidos
        transaccion = RIPSTransaccion()
        transaccion.numFactura = "FE12345"
        transaccion.prestadorNit = "900123456-7"
        transaccion.prestadorRazonSocial = "CLÍNICA TEST S.A.S"
        transaccion.estadoProcesamiento = "RADICADO"
        
        # Crear usuario embebido
        usuario = RIPSUsuario()
        usuario.tipoDocumento = "CC"
        usuario.numeroDocumento = "1234567890"
        
        # Datos personales embebidos
        usuario.datosPersonales = RIPSUsuarioDatos(
            fechaNacimiento=date(1985, 6, 15),
            sexo="F",
            municipioResidencia="11001",
            zonaResidencia="U"
        )
        
        # Validación BDUA embebida
        usuario.validacionBDUA = RIPSValidacionBDUA(
            tieneDerechos=True,
            regimen="CONTRIBUTIVO",
            epsActual="EPS037",
            fechaValidacion=datetime.now()
        )
        
        # Asignar usuarios (array)
        transaccion.usuarios = [usuario]
        
        # Guardar
        transaccion.save()
        
        print(f"✅ RIPS creado: {transaccion.id}")
        print(f"   Factura: {transaccion.numFactura}")
        print(f"   Usuarios: {len(transaccion.usuarios)}")
        
        # Verificar subdocumentos
        assert len(transaccion.usuarios) == 1, "Debe tener 1 usuario"
        assert transaccion.usuarios[0].numeroDocumento == "1234567890"
        assert transaccion.usuarios[0].datosPersonales.sexo == "F"
        assert transaccion.usuarios[0].validacionBDUA.tieneDerechos == True
        
        print("✅ Subdocumentos embebidos funcionan correctamente")
        
        # Buscar por factura
        encontrada = RIPSTransaccion.objects.filter(numFactura="FE12345").first()
        assert encontrada is not None, "Debe encontrar por factura"
        assert len(encontrada.usuarios) == 1, "Debe mantener subdocumentos"
        
        print("✅ Búsqueda con subdocumentos exitosa")
        
        # Test método calcular_estadisticas
        transaccion.calcular_estadisticas()
        assert transaccion.estadisticasTransaccion is not None
        
        print("✅ Método calcular_estadisticas funciona")
        
        # Test agregar_trazabilidad
        transaccion.agregar_trazabilidad(
            evento="RADICACION",
            usuario="test_user",
            descripcion="Radicación inicial de prueba"
        )
        assert len(transaccion.trazabilidad) == 1
        
        print("✅ Método agregar_trazabilidad funciona")
        
        # Eliminar
        transaccion.delete()
        print("✅ Eliminación exitosa")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test RIPS: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_authentication_models():
    """Test modelos de autenticación"""
    print("\n=== TEST AUTENTICACIÓN ===")
    
    try:
        # Crear usuario
        user = User.objects.create_user(
            email="test@neuraudit.com",
            username="test_user",
            password="Test123!",
            first_name="Usuario",
            last_name="Prueba",
            user_type="EPS",
            role="AUDITOR_MEDICO",
            document_number="1234567890"
        )
        
        print(f"✅ Usuario creado: {user.id}")
        print(f"   Username: {user.username}")
        print(f"   Tipo: {user.user_type} - {user.role}")
        
        # Verificar contraseña
        assert user.check_password("Test123!"), "Contraseña debe validar"
        print("✅ Validación de contraseña funciona")
        
        # Test permisos
        assert user.has_perm('audit_medical'), "Debe tener permiso audit_medical"
        assert user.can_audit == True, "Debe poder auditar"
        
        print("✅ Sistema de permisos funciona")
        
        # Crear sesión
        session = UserSession.create_session(
            user=user,
            ip_address="192.168.1.1",
            device_info={"browser": "Chrome", "os": "Windows"}
        )
        
        print(f"✅ Sesión creada: {session.id}")
        print(f"   Token: {session.session_token[:10]}...")
        
        # Verificar sesión
        assert session.is_expired == False, "Sesión no debe estar expirada"
        
        # Buscar sesiones activas
        sesiones_activas = UserSession.objects.filter(
            user=user,
            is_active=True
        ).count()
        assert sesiones_activas == 1, "Debe tener 1 sesión activa"
        
        print("✅ Gestión de sesiones funciona")
        
        # Limpiar
        session.delete()
        user.delete()
        print("✅ Limpieza exitosa")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test autenticación: {e}")
        return False

def test_contratos_tarifarios():
    """Test modelos de contratación"""
    print("\n=== TEST CONTRATOS Y TARIFARIOS ===")
    
    try:
        # Crear contrato
        contrato = Contratos.objects.create(
            numero_contrato="CON-2025-001",
            prestador_nit="900123456-7",
            eps_codigo="23678",
            tipo_contrato="POR_EVENTO",
            fecha_inicio=date(2025, 1, 1),
            fecha_fin=date(2025, 12, 31),
            valor_contrato=Decimal("1000000000.00"),
            estado="VIGENTE",
            modalidad_porcentaje_primer_pago=50.00,
            modalidad_dias_primer_pago=5
        )
        
        print(f"✅ Contrato creado: {contrato.id}")
        print(f"   Número: {contrato.numero_contrato}")
        print(f"   Valor: ${contrato.valor_contrato:,.2f}")
        
        # Verificar tipos de datos
        assert isinstance(contrato.valor_contrato, Decimal), "Valor debe ser Decimal"
        assert isinstance(contrato.fecha_inicio, date), "Fecha debe ser date"
        
        print("✅ Tipos de datos correctos")
        
        # Buscar contratos vigentes
        vigentes = Contratos.objects.filter(
            estado="VIGENTE",
            fecha_inicio__lte=date.today(),
            fecha_fin__gte=date.today()
        ).count()
        assert vigentes >= 1, "Debe encontrar contratos vigentes"
        
        print("✅ Consultas de fechas funcionan")
        
        # Eliminar
        contrato.delete()
        print("✅ Eliminación exitosa")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en test contratos: {e}")
        return False

def run_all_tests():
    """Ejecuta todos los tests"""
    print("\n" + "="*60)
    print("INICIANDO TESTS DJANGO MONGODB BACKEND - NEURAUDIT")
    print("="*60)
    
    tests = [
        ("Catálogo CUPS", test_catalogo_cups),
        ("BDUA Afiliados", test_bdua_afiliados),
        ("RIPS Transacción", test_rips_transaccion),
        ("Autenticación", test_authentication_models),
        ("Contratos", test_contratos_tarifarios)
    ]
    
    resultados = []
    
    for nombre, test_func in tests:
        print(f"\nEjecutando: {nombre}")
        resultado = test_func()
        resultados.append((nombre, resultado))
    
    # Resumen
    print("\n" + "="*60)
    print("RESUMEN DE TESTS")
    print("="*60)
    
    total = len(resultados)
    exitosos = sum(1 for _, resultado in resultados if resultado)
    
    for nombre, resultado in resultados:
        estado = "✅ EXITOSO" if resultado else "❌ FALLIDO"
        print(f"{nombre}: {estado}")
    
    print(f"\nTotal: {exitosos}/{total} tests exitosos")
    
    if exitosos == total:
        print("\n🎉 TODOS LOS TESTS PASARON - Django MongoDB Backend funciona correctamente!")
    else:
        print("\n⚠️ Algunos tests fallaron - Revisar errores arriba")
    
    return exitosos == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)