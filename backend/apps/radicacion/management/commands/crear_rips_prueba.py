# -*- coding: utf-8 -*-
"""
Comando para crear datos RIPS de prueba usando el modelo oficial con subdocumentos embebidos
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
import random


class Command(BaseCommand):
    help = 'Crea transacciones RIPS de prueba para las radicaciones existentes'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Creando datos RIPS de prueba...'))
        
        # Obtener radicaciones existentes
        radicaciones = RadicacionCuentaMedica.objects.filter(estado__in=['RADICADA', 'EN_AUDITORIA'])[:5]
        
        if not radicaciones:
            self.stdout.write(self.style.ERROR('❌ No hay radicaciones disponibles'))
            return
        
        for rad in radicaciones:
            self.stdout.write(f'\n📋 Procesando radicación: {rad.numero_radicado}')
            
            # Verificar si ya existe RIPS
            existe = RIPSTransaccion.objects.filter(
                numFactura=rad.factura_numero,
                prestadorNit=rad.pss_nit
            ).exists()
            
            if existe:
                self.stdout.write(self.style.WARNING('   ⚠️ Ya existe RIPS para esta factura'))
                continue
            
            # Crear transacción RIPS
            transaccion = RIPSTransaccion.objects.create(
                numFactura=rad.factura_numero,
                prestadorNit=rad.pss_nit,
                prestadorRazonSocial=rad.pss_nombre,
                estadoProcesamiento='RADICADO'
            )
            
            # Crear usuarios con servicios embebidos
            usuarios_embebidos = []
            num_usuarios = random.randint(1, 3)
            
            for i in range(num_usuarios):
                # Datos personales
                datos_personales = RIPSUsuarioDatos(
                    fechaNacimiento=datetime.now().date() - timedelta(days=random.randint(7300, 25550)),
                    sexo=random.choice(['M', 'F']),
                    municipioResidencia='11001',
                    zonaResidencia='U'
                )
                
                # Servicios embebidos
                servicios = RIPSServiciosUsuario()
                
                # Consultas
                consultas = []
                for j in range(random.randint(1, 3)):
                    consulta = RIPSConsulta(
                        codPrestador=rad.pss_nit,
                        fechaAtencion=datetime.now() - timedelta(days=random.randint(1, 30)),
                        codConsulta=f'890{random.randint(201, 299)}',
                        modalidadGrupoServicioTecSal='01',
                        grupoServicios='01',
                        codServicio=1,
                        finalidadTecnologiaSalud='01',
                        causaMotivo='01',
                        diagnosticoPrincipal='I10X',
                        tipoDiagnosticoPrincipal='1',
                        tipoDocumentoIdentificacion='CC',
                        numDocumentoIdentificacion=f'{random.randint(10000000, 99999999)}',
                        vrServicio=Decimal(f'{random.randint(50000, 150000)}'),
                        conceptoRecaudo='01',
                        valorPagoModerador=Decimal('0'),
                        estadoValidacion='PENDIENTE'
                    )
                    consultas.append(consulta)
                
                servicios.consultas = consultas
                
                # Procedimientos
                procedimientos = []
                for j in range(random.randint(0, 2)):
                    proc = RIPSProcedimiento(
                        codPrestador=rad.pss_nit,
                        fechaAtencion=datetime.now() - timedelta(days=random.randint(1, 30)),
                        codProcedimiento=f'86{random.randint(1000, 9999)}',
                        viaIngresoServicioSalud='1',
                        modalidadGrupoServicioTecSal='02',
                        grupoServicios='02',
                        codServicio=2,
                        finalidadTecnologiaSalud='02',
                        tipoDocumentoIdentificacion='CC',
                        numDocumentoIdentificacion=f'{random.randint(10000000, 99999999)}',
                        diagnosticoPrincipal='I10X',
                        vrServicio=Decimal(f'{random.randint(100000, 500000)}'),
                        conceptoRecaudo='01',
                        valorPagoModerador=Decimal('0'),
                        estadoValidacion='PENDIENTE'
                    )
                    procedimientos.append(proc)
                
                servicios.procedimientos = procedimientos
                
                # Medicamentos
                medicamentos = []
                for j in range(random.randint(0, 5)):
                    med = RIPSMedicamento(
                        codPrestador=rad.pss_nit,
                        fechaAtencion=datetime.now() - timedelta(days=random.randint(1, 30)),
                        codTecnologiaSalud=f'M{random.randint(100000, 999999)}',
                        nomTecnologiaSalud=f'MEDICAMENTO PRUEBA {j+1}',
                        tipoDocumentoIdentificacion='CC',
                        numDocumentoIdentificacion=f'{random.randint(10000000, 99999999)}',
                        cantidadSuministrada=Decimal(f'{random.randint(1, 30)}'),
                        tipoUnidadMedida='TABLETA',
                        valorUnitarioTecnologia=Decimal(f'{random.randint(1000, 50000)}'),
                        valorTotalTecnologia=Decimal(f'{random.randint(10000, 500000)}'),
                        conceptoRecaudo='01',
                        valorPagoModerador=Decimal('0'),
                        estadoValidacion='PENDIENTE'
                    )
                    medicamentos.append(med)
                
                servicios.medicamentos = medicamentos
                
                # Crear usuario embebido
                usuario = RIPSUsuario(
                    tipoDocumento='CC',
                    numeroDocumento=f'{random.randint(10000000, 99999999)}',
                    datosPersonales=datos_personales,
                    servicios=servicios
                )
                
                usuarios_embebidos.append(usuario)
            
            # Asignar usuarios a la transacción
            transaccion.usuarios = usuarios_embebidos
            
            # Calcular estadísticas
            total_servicios = 0
            valor_total = Decimal('0')
            
            for usuario in usuarios_embebidos:
                if usuario.servicios:
                    if usuario.servicios.consultas:
                        total_servicios += len(usuario.servicios.consultas)
                        for c in usuario.servicios.consultas:
                            valor_total += c.vrServicio or Decimal('0')
                    
                    if usuario.servicios.procedimientos:
                        total_servicios += len(usuario.servicios.procedimientos)
                        for p in usuario.servicios.procedimientos:
                            valor_total += p.vrServicio or Decimal('0')
                    
                    if usuario.servicios.medicamentos:
                        total_servicios += len(usuario.servicios.medicamentos)
                        for m in usuario.servicios.medicamentos:
                            valor_total += m.valorTotalTecnologia or Decimal('0')
            
            # Crear estadísticas embebidas
            estadisticas = RIPSEstadisticasTransaccion(
                totalUsuarios=len(usuarios_embebidos),
                totalServicios=total_servicios,
                valorTotalFacturado=valor_total,
                serviciosValidados=0,
                serviciosGlosados=0,
                valorGlosado=Decimal('0'),
                distribucionServicios={
                    'consultas': sum(len(u.servicios.consultas) if u.servicios and u.servicios.consultas else 0 for u in usuarios_embebidos),
                    'procedimientos': sum(len(u.servicios.procedimientos) if u.servicios and u.servicios.procedimientos else 0 for u in usuarios_embebidos),
                    'medicamentos': sum(len(u.servicios.medicamentos) if u.servicios and u.servicios.medicamentos else 0 for u in usuarios_embebidos),
                    'urgencias': 0,
                    'hospitalizacion': 0,
                    'recienNacidos': 0,
                    'otrosServicios': 0
                }
            )
            
            transaccion.estadisticasTransaccion = estadisticas
            transaccion.save()
            
            self.stdout.write(self.style.SUCCESS(f'   ✅ RIPS creado con {len(usuarios_embebidos)} usuarios y {total_servicios} servicios'))
            self.stdout.write(f'   💰 Valor total: ${valor_total:,.2f}')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Proceso completado'))