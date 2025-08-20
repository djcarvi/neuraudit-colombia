# -*- coding: utf-8 -*-
"""
Comando para probar la creación de facturas desde radicaciones con RIPS
Verifica el enfoque NoSQL puro
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_rips_oficial import RIPSTransaccion
from apps.auditoria.models_facturas import FacturaRadicada
import json


class Command(BaseCommand):
    help = 'Prueba la creación de facturas desde radicaciones con datos RIPS'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔍 Verificando datos disponibles...'))
        
        # Verificar radicaciones disponibles
        radicaciones = RadicacionCuentaMedica.objects.filter(
            estado__in=['RADICADA', 'EN_AUDITORIA']
        )[:5]
        
        self.stdout.write(f'\n📋 Radicaciones encontradas: {radicaciones.count()}')
        
        for rad in radicaciones:
            self.stdout.write(f'\n➡️ Radicación: {rad.numero_radicado}')
            self.stdout.write(f'   Factura: {rad.factura_numero}')
            self.stdout.write(f'   Prestador: {rad.pss_nit} - {rad.pss_nombre}')
            
            # Buscar transacción RIPS
            rips = RIPSTransaccion.objects.filter(
                numFactura=rad.factura_numero,
                prestadorNit=rad.pss_nit
            ).first()
            
            if rips:
                self.stdout.write(self.style.SUCCESS(f'   ✅ RIPS encontrado: {rips.id}'))
                self.stdout.write(f'   Estado: {rips.estadoProcesamiento}')
                
                if rips.usuarios:
                    self.stdout.write(f'   Usuarios: {len(rips.usuarios)}')
                    
                    # Contar servicios
                    total_servicios = 0
                    for usuario in rips.usuarios:
                        if usuario.servicios:
                            if usuario.servicios.consultas:
                                total_servicios += len(usuario.servicios.consultas)
                            if usuario.servicios.procedimientos:
                                total_servicios += len(usuario.servicios.procedimientos)
                            if usuario.servicios.medicamentos:
                                total_servicios += len(usuario.servicios.medicamentos)
                    
                    self.stdout.write(f'   Total servicios embebidos: {total_servicios}')
                else:
                    self.stdout.write(self.style.WARNING('   ⚠️ Sin usuarios embebidos'))
                    
                # Verificar si ya existe factura en auditoría
                factura_existe = FacturaRadicada.objects.filter(
                    radicacion_id=str(rad.id)
                ).exists()
                
                if factura_existe:
                    self.stdout.write(self.style.WARNING('   ⚠️ Ya existe factura en auditoría'))
                else:
                    self.stdout.write(self.style.SUCCESS('   ✅ Disponible para crear factura'))
                    
            else:
                self.stdout.write(self.style.ERROR(f'   ❌ RIPS no encontrado'))
        
        # Mostrar estadísticas de RIPS
        self.stdout.write(f'\n📊 Estadísticas RIPS:')
        total_rips = RIPSTransaccion.objects.count()
        self.stdout.write(f'   Total transacciones RIPS: {total_rips}')
        
        # Por estado
        for estado in ['RADICADO', 'VALIDADO', 'ASIGNADO_AUDITORIA']:
            count = RIPSTransaccion.objects.filter(estadoProcesamiento=estado).count()
            self.stdout.write(f'   {estado}: {count}')
        
        # Mostrar estructura de un RIPS de ejemplo
        if total_rips > 0:
            ejemplo = RIPSTransaccion.objects.first()
            self.stdout.write(f'\n🔍 Estructura RIPS ejemplo:')
            self.stdout.write(f'   ID: {ejemplo.id}')
            self.stdout.write(f'   numFactura: {ejemplo.numFactura}')
            self.stdout.write(f'   prestadorNit: {ejemplo.prestadorNit}')
            self.stdout.write(f'   prestadorRazonSocial: {ejemplo.prestadorRazonSocial}')
            self.stdout.write(f'   estadoProcesamiento: {ejemplo.estadoProcesamiento}')
            
            if ejemplo.usuarios and len(ejemplo.usuarios) > 0:
                usuario = ejemplo.usuarios[0]
                self.stdout.write(f'\n   Primer usuario:')
                self.stdout.write(f'     tipoDocumento: {usuario.tipoDocumento}')
                self.stdout.write(f'     numeroDocumento: {usuario.numeroDocumento}')
                
                if usuario.servicios:
                    self.stdout.write(f'     Servicios embebidos: ✅')
                    if usuario.servicios.consultas:
                        self.stdout.write(f'       - Consultas: {len(usuario.servicios.consultas)}')
                    if usuario.servicios.procedimientos:
                        self.stdout.write(f'       - Procedimientos: {len(usuario.servicios.procedimientos)}')
                    if usuario.servicios.medicamentos:
                        self.stdout.write(f'       - Medicamentos: {len(usuario.servicios.medicamentos)}')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Verificación completada'))