# -*- coding: utf-8 -*-
"""
Comando corregido para crear datos de prueba para auditoría
"""

from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
from decimal import Decimal
from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_rips_oficial import (
    RIPSTransaccion, RIPSUsuario, RIPSUsuarioDatos,
    RIPSServiciosUsuario, RIPSConsulta, RIPSProcedimiento,
    RIPSMedicamento, RIPSEstadisticasTransaccion
)
from apps.authentication.models import User
import random


class Command(BaseCommand):
    help = 'Crea datos de prueba para auditoría (corregido)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Creando datos de prueba para auditoría...'))
        
        # Obtener usuario PSS
        try:
            usuario_pss = User.objects.filter(username='test.pss').first()
            if not usuario_pss:
                usuario_pss = User.objects.create(
                    username='test.pss',
                    email='test.pss@example.com',
                    rol='RADICADOR',
                    tipo_usuario='PSS',
                    nit_prestador='123456789-0',
                    nombre_completo='Usuario PSS Prueba'
                )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error obteniendo usuario: {e}'))
            return
        
        # Datos de prestadores
        prestadores = [
            {
                'nit': '901234567',
                'nombre': 'HOSPITAL GENERAL SAN MARCOS',
                'tipo': 'HOSPITALARIO'
            },
            {
                'nit': '802345678',
                'nombre': 'CENTRO MÉDICO LA ESPERANZA',
                'tipo': 'AMBULATORIO'
            }
        ]
        
        # Códigos CUPS reales para consultas
        consultas_cups = [
            {'codigo': '890201', 'descripcion': 'CONSULTA DE PRIMERA VEZ POR MEDICINA GENERAL', 'valor': 45000},
            {'codigo': '890301', 'descripcion': 'CONSULTA DE PRIMERA VEZ POR MEDICINA ESPECIALIZADA', 'valor': 65000},
            {'codigo': '890202', 'descripcion': 'CONSULTA DE CONTROL POR MEDICINA GENERAL', 'valor': 35000},
        ]
        
        # Códigos CUPS reales para procedimientos
        procedimientos_cups = [
            {'codigo': '881201', 'descripcion': 'RADIOGRAFÍA DE TÓRAX', 'valor': 45000},
            {'codigo': '879301', 'descripcion': 'ECOGRAFÍA ABDOMINAL TOTAL', 'valor': 120000},
            {'codigo': '901209', 'descripcion': 'HEMOGRAMA COMPLETO', 'valor': 25000},
        ]
        
        # Códigos CUM reales para medicamentos
        medicamentos_cum = [
            {'codigo': '19904138-1', 'nombre': 'ACETAMINOFEN 500MG TABLETA', 'valor_unitario': 150},
            {'codigo': '19903876-1', 'nombre': 'IBUPROFENO 400MG TABLETA', 'valor_unitario': 200},
            {'codigo': '19993014-1', 'nombre': 'AMOXICILINA 500MG CAPSULA', 'valor_unitario': 350},
        ]
        
        # Crear radicaciones y transacciones RIPS
        for i, prestador in enumerate(prestadores):
            self.stdout.write(f'\n📋 Creando radicación para {prestador["nombre"]}...')
            
            # Crear radicación
            fecha_actual = datetime.now()
            numero_radicado = f'RAD-{prestador["nit"]}-{fecha_actual.strftime("%Y%m%d")}-{i+1:02d}'
            numero_factura = f'FV-{fecha_actual.year}-{random.randint(1000, 9999)}'
            
            # Calcular valor total aleatorio
            valor_total = Decimal(random.randint(2000000, 8000000))
            
            radicacion = RadicacionCuentaMedica.objects.create(
                numero_radicado=numero_radicado,
                fecha_radicacion=fecha_actual,
                pss_nombre=prestador['nombre'],
                pss_nit=prestador['nit'],
                tipo_servicio=prestador['tipo'],
                modalidad_pago='EVENTO',
                factura_numero=numero_factura,
                factura_fecha_expedicion=fecha_actual - timedelta(days=5),
                factura_valor_total=valor_total,
                fecha_atencion_inicio=fecha_actual - timedelta(days=30),
                fecha_atencion_fin=fecha_actual - timedelta(days=6),
                usuario_radicador=usuario_pss,
                estado='RADICADA'
            )
            
            # Crear transacción RIPS
            transaccion = RIPSTransaccion.objects.create(
                numFactura=numero_factura,
                prestadorNit=prestador['nit'],
                prestadorRazonSocial=prestador['nombre'],
                estadoProcesamiento='RADICADO'
            )
            
            # Crear usuarios con servicios
            usuarios_embebidos = []
            num_usuarios = random.randint(3, 6)
            
            for j in range(num_usuarios):
                # Datos personales del usuario
                edad = random.randint(18, 75)
                fecha_nacimiento = datetime.now().date() - timedelta(days=edad*365)
                sexo = random.choice(['M', 'F'])
                numero_documento = f'{random.randint(10000000, 99999999)}'
                
                datos_personales = RIPSUsuarioDatos(
                    fechaNacimiento=fecha_nacimiento,
                    sexo=sexo,
                    municipioResidencia='11001',
                    zonaResidencia='U'
                )
                
                # Servicios del usuario
                servicios = RIPSServiciosUsuario()
                
                # CONSULTAS
                consultas = []
                num_consultas = random.randint(1, 2)
                for k in range(num_consultas):
                    consulta_data = random.choice(consultas_cups)
                    consulta = RIPSConsulta(
                        codPrestador=prestador['nit'],
                        fechaAtencion=fecha_actual - timedelta(days=random.randint(1, 25)),
                        codConsulta=consulta_data['codigo'],
                        modalidadGrupoServicioTecSal='01',
                        grupoServicios='01',
                        codServicio=1,
                        finalidadTecnologiaSalud=random.choice(['01', '02', '03', '10']),
                        causaMotivo=random.choice(['01', '02', '03']),
                        diagnosticoPrincipal=random.choice(['I10X', 'J449', 'E119']),
                        tipoDiagnosticoPrincipal='1',
                        tipoDocumentoIdentificacion='CC',
                        numDocumentoIdentificacion=numero_documento,
                        vrServicio=Decimal(consulta_data['valor']),
                        conceptoRecaudo='01',
                        valorPagoModerador=Decimal('0'),
                        numFEPS='',
                        estadoValidacion='PENDIENTE'
                    )
                    consultas.append(consulta)
                
                servicios.consultas = consultas
                
                # PROCEDIMIENTOS
                procedimientos = []
                num_procedimientos = random.randint(0, 2)
                for k in range(num_procedimientos):
                    proc_data = random.choice(procedimientos_cups)
                    proc = RIPSProcedimiento(
                        codPrestador=prestador['nit'],
                        fechaAtencion=fecha_actual - timedelta(days=random.randint(1, 25)),
                        codProcedimiento=proc_data['codigo'],
                        viaIngresoServicioSalud=random.choice(['1', '2', '3']),
                        modalidadGrupoServicioTecSal='02',
                        grupoServicios='02',
                        codServicio=2,
                        finalidadTecnologiaSalud=random.choice(['01', '02', '03', '04']),
                        tipoDocumentoIdentificacion='CC',
                        numDocumentoIdentificacion=numero_documento,
                        diagnosticoPrincipal=random.choice(['I10X', 'J449', 'E119']),
                        diagnosticoRelacionado='',
                        complicacion='',
                        vrServicio=Decimal(proc_data['valor']),
                        conceptoRecaudo='01',
                        valorPagoModerador=Decimal('0'),
                        estadoValidacion='PENDIENTE'
                    )
                    procedimientos.append(proc)
                
                servicios.procedimientos = procedimientos
                
                # MEDICAMENTOS
                medicamentos = []
                num_medicamentos = random.randint(0, 4)
                for k in range(num_medicamentos):
                    med_data = random.choice(medicamentos_cum)
                    cantidad = random.randint(5, 30)
                    med = RIPSMedicamento(
                        codPrestador=prestador['nit'],
                        fechaAtencion=fecha_actual - timedelta(days=random.randint(1, 25)),
                        codTecnologiaSalud=med_data['codigo'],
                        nomTecnologiaSalud=med_data['nombre'],
                        tipoDocumentoIdentificacion='CC',
                        numDocumentoIdentificacion=numero_documento,
                        cantidadSuministrada=Decimal(str(cantidad)),
                        tipoUnidadMedida='TABLETA',
                        valorUnitarioTecnologia=Decimal(med_data['valor_unitario']),
                        valorTotalTecnologia=Decimal(med_data['valor_unitario'] * cantidad),
                        conceptoRecaudo='01',
                        valorPagoModerador=Decimal('0'),
                        estadoValidacion='PENDIENTE'
                    )
                    medicamentos.append(med)
                
                servicios.medicamentos = medicamentos
                
                # Crear usuario con todos sus servicios
                usuario = RIPSUsuario(
                    tipoDocumento='CC',
                    numeroDocumento=numero_documento,
                    datosPersonales=datos_personales,
                    servicios=servicios
                )
                
                usuarios_embebidos.append(usuario)
            
            # IMPORTANTE: Asignar usuarios a la transacción
            transaccion.usuarios = usuarios_embebidos
            
            # Calcular estadísticas
            total_servicios = 0
            valor_total_servicios = Decimal('0')
            distribucion = {
                'consultas': 0,
                'procedimientos': 0,
                'medicamentos': 0,
                'urgencias': 0,
                'hospitalizacion': 0,
                'recienNacidos': 0,
                'otrosServicios': 0
            }
            
            for usuario in usuarios_embebidos:
                if usuario.servicios:
                    if usuario.servicios.consultas:
                        total_servicios += len(usuario.servicios.consultas)
                        distribucion['consultas'] += len(usuario.servicios.consultas)
                        for c in usuario.servicios.consultas:
                            valor_total_servicios += c.vrServicio or Decimal('0')
                    
                    if usuario.servicios.procedimientos:
                        total_servicios += len(usuario.servicios.procedimientos)
                        distribucion['procedimientos'] += len(usuario.servicios.procedimientos)
                        for p in usuario.servicios.procedimientos:
                            valor_total_servicios += p.vrServicio or Decimal('0')
                    
                    if usuario.servicios.medicamentos:
                        total_servicios += len(usuario.servicios.medicamentos)
                        distribucion['medicamentos'] += len(usuario.servicios.medicamentos)
                        for m in usuario.servicios.medicamentos:
                            valor_total_servicios += m.valorTotalTecnologia or Decimal('0')
            
            # Crear estadísticas
            estadisticas = RIPSEstadisticasTransaccion(
                totalUsuarios=len(usuarios_embebidos),
                totalServicios=total_servicios,
                valorTotalFacturado=valor_total_servicios,
                serviciosValidados=0,
                serviciosGlosados=0,
                valorGlosado=Decimal('0'),
                distribucionServicios=distribucion
            )
            
            transaccion.estadisticasTransaccion = estadisticas
            transaccion.save()
            
            self.stdout.write(self.style.SUCCESS(
                f'   ✅ Radicación {numero_radicado} creada\n'
                f'   📄 Factura: {numero_factura}\n'
                f'   👥 Usuarios: {len(usuarios_embebidos)}\n'
                f'   🏥 Servicios: {total_servicios} (C:{distribucion["consultas"]} P:{distribucion["procedimientos"]} M:{distribucion["medicamentos"]})\n'
                f'   💰 Valor: ${valor_total_servicios:,.0f}'
            ))
        
        self.stdout.write(self.style.SUCCESS('\n✅ Datos de prueba creados exitosamente'))