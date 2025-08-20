# -*- coding: utf-8 -*-
"""
Comando para cargar datos de prueba en el módulo de contratación
"""

from django.core.management.base import BaseCommand
from datetime import date, timedelta
from decimal import Decimal
from apps.contratacion.models import (
    Prestador, ModalidadPago, Contrato,
    TarifariosCUPS, TarifariosMedicamentos, TarifariosDispositivos
)
from apps.authentication.models import User


class Command(BaseCommand):
    help = 'Carga datos de prueba para el módulo de contratación'

    def handle(self, *args, **options):
        self.stdout.write('Cargando datos de contratación...')
        
        # Obtener un usuario administrador
        try:
            admin_user = User.objects.filter(role='ADMIN').first()
            if not admin_user:
                admin_user = User.objects.first()
        except:
            self.stdout.write(self.style.ERROR('No se encontró usuario administrador'))
            return
        
        # Crear modalidades de pago
        modalidades = [
            {
                'codigo': 'EVENTO',
                'nombre': 'Pago por Evento',
                'descripcion': 'Pago por cada servicio prestado según tarifas contratadas',
                'requiere_autorizacion': True,
                'permite_glosas': True,
                'pago_anticipado': False,
                'porcentaje_primer_pago': 50,
                'dias_primer_pago': 5
            },
            {
                'codigo': 'CAPITACION',
                'nombre': 'Capitación',
                'descripcion': 'Pago fijo mensual por afiliado asignado',
                'requiere_autorizacion': False,
                'permite_glosas': False,
                'pago_anticipado': True,
                'porcentaje_primer_pago': 100,
                'dias_primer_pago': 0
            },
            {
                'codigo': 'PGP',
                'nombre': 'Pago Global Prospectivo',
                'descripcion': 'Pago anticipado para atención integral de población',
                'requiere_autorizacion': False,
                'permite_glosas': True,
                'pago_anticipado': True,
                'porcentaje_primer_pago': 100,
                'dias_primer_pago': 0
            },
            {
                'codigo': 'PAQUETE',
                'nombre': 'Paquete',
                'descripcion': 'Precio fijo por conjunto de servicios relacionados',
                'requiere_autorizacion': True,
                'permite_glosas': True,
                'pago_anticipado': False,
                'porcentaje_primer_pago': 50,
                'dias_primer_pago': 5
            }
        ]
        
        for mod_data in modalidades:
            modalidad, created = ModalidadPago.objects.update_or_create(
                codigo=mod_data['codigo'],
                defaults=mod_data
            )
            if created:
                self.stdout.write(f'Creada modalidad: {modalidad.nombre}')
        
        # Crear prestadores
        prestadores_data = [
            {
                'nit': '900123456-7',
                'razon_social': 'CLINICA GENERAL DEL NORTE S.A.S',
                'nombre_comercial': 'Clínica General del Norte',
                'codigo_habilitacion': '110010012345',
                'tipo_prestador': 'CLINICA',
                'nivel_atencion': 'III',
                'departamento': 'CUNDINAMARCA',
                'ciudad': 'Bogotá D.C.',
                'direccion': 'Av. Caracas No. 45-67',
                'telefono': '(601) 3456789',
                'email': 'info@clinicadelnorte.com.co',
                'habilitado_reps': True,
                'fecha_habilitacion': date(2020, 1, 15),
                'estado': 'ACTIVO',
                'servicios_habilitados': ['890201', '890301', '890701', '861401'],
                'created_by': admin_user
            },
            {
                'nit': '800987654-3',
                'razon_social': 'HOSPITAL SAN RAFAEL E.S.E',
                'nombre_comercial': 'Hospital San Rafael',
                'codigo_habilitacion': '050010023456',
                'tipo_prestador': 'ESE',
                'nivel_atencion': 'II',
                'departamento': 'ANTIOQUIA',
                'ciudad': 'Medellín',
                'direccion': 'Calle 50 No. 20-30',
                'telefono': '(604) 2345678',
                'email': 'contacto@hospitalsanrafael.gov.co',
                'habilitado_reps': True,
                'fecha_habilitacion': date(2019, 5, 10),
                'estado': 'ACTIVO',
                'servicios_habilitados': ['890101', '890201', '890301'],
                'created_by': admin_user
            },
            {
                'nit': '900555666-1',
                'razon_social': 'IPS SALUD TOTAL LTDA',
                'nombre_comercial': 'IPS Salud Total',
                'codigo_habilitacion': '760010034567',
                'tipo_prestador': 'IPS',
                'nivel_atencion': 'I',
                'departamento': 'VALLE',
                'ciudad': 'Cali',
                'direccion': 'Carrera 15 No. 10-20',
                'telefono': '(602) 8765432',
                'email': 'atencion@ipssaludtotal.com',
                'habilitado_reps': True,
                'fecha_habilitacion': date(2021, 3, 20),
                'estado': 'ACTIVO',
                'servicios_habilitados': ['890101', '890201'],
                'created_by': admin_user
            }
        ]
        
        prestadores = []
        for prest_data in prestadores_data:
            prestador, created = Prestador.objects.update_or_create(
                nit=prest_data['nit'],
                defaults=prest_data
            )
            prestadores.append(prestador)
            if created:
                self.stdout.write(f'Creado prestador: {prestador.razon_social}')
        
        # Crear contratos
        contratos_data = [
            {
                'numero_contrato': 'CTR-2025-001',
                'prestador': prestadores[0],  # Clínica General del Norte
                'modalidad_principal': 'EVENTO',
                'modalidades_adicionales': ['PAQUETE'],
                'fecha_inicio': date(2025, 1, 1),
                'fecha_fin': date(2025, 12, 31),
                'fecha_firma': date(2024, 12, 15),
                'valor_total': Decimal('5000000000.00'),
                'manual_tarifario': 'ISS_2001',
                'porcentaje_negociacion': 110,
                'estado': 'VIGENTE',
                'servicios_contratados': ['890201', '890301', '890701', '861401'],
                'tiene_anexo_tecnico': True,
                'tiene_anexo_economico': True,
                'created_by': admin_user
            },
            {
                'numero_contrato': 'CTR-2025-002',
                'prestador': prestadores[1],  # Hospital San Rafael
                'modalidad_principal': 'PGP',
                'modalidades_adicionales': ['EVENTO'],
                'fecha_inicio': date(2025, 1, 1),
                'fecha_fin': date(2025, 12, 31),
                'fecha_firma': date(2024, 12, 20),
                'valor_total': Decimal('3500000000.00'),
                'valor_mensual': Decimal('291666666.67'),
                'poblacion_asignada': 15000,
                'manual_tarifario': 'ISS_2001',
                'porcentaje_negociacion': 100,
                'estado': 'VIGENTE',
                'servicios_contratados': ['890101', '890201', '890301'],
                'tiene_anexo_tecnico': True,
                'tiene_anexo_economico': True,
                'created_by': admin_user
            },
            {
                'numero_contrato': 'CTR-2025-003',
                'prestador': prestadores[2],  # IPS Salud Total
                'modalidad_principal': 'CAPITACION',
                'modalidades_adicionales': [],
                'fecha_inicio': date(2025, 1, 1),
                'fecha_fin': date(2025, 12, 31),
                'fecha_firma': date(2024, 12, 18),
                'valor_total': Decimal('1200000000.00'),
                'valor_mensual': Decimal('100000000.00'),
                'poblacion_asignada': 25000,
                'manual_tarifario': 'ISS_2001',
                'porcentaje_negociacion': 95,
                'estado': 'VIGENTE',
                'servicios_contratados': ['890101', '890201'],
                'tiene_anexo_tecnico': True,
                'tiene_anexo_economico': True,
                'created_by': admin_user
            }
        ]
        
        contratos = []
        for cont_data in contratos_data:
            contrato, created = Contrato.objects.update_or_create(
                numero_contrato=cont_data['numero_contrato'],
                defaults=cont_data
            )
            contratos.append(contrato)
            if created:
                self.stdout.write(f'Creado contrato: {contrato.numero_contrato}')
        
        # Crear algunos tarifarios CUPS de ejemplo
        tarifarios_cups = [
            {
                'contrato_numero': 'CTR-2025-001',
                'codigo_cups': '890201',
                'descripcion': 'CONSULTA DE PRIMERA VEZ POR MEDICINA GENERAL',
                'valor_unitario': Decimal('31350.00'),
                'unidad_medida': 'UNIDAD',
                'aplica_copago': True,
                'aplica_cuota_moderadora': True,
                'requiere_autorizacion': False,
                'vigencia_desde': date(2025, 1, 1),
                'vigencia_hasta': date(2025, 12, 31),
                'estado': 'ACTIVO'
            },
            {
                'contrato_numero': 'CTR-2025-001',
                'codigo_cups': '890301',
                'descripcion': 'CONSULTA DE CONTROL O DE SEGUIMIENTO POR MEDICINA GENERAL',
                'valor_unitario': Decimal('26000.00'),
                'unidad_medida': 'UNIDAD',
                'aplica_copago': True,
                'aplica_cuota_moderadora': True,
                'requiere_autorizacion': False,
                'vigencia_desde': date(2025, 1, 1),
                'vigencia_hasta': date(2025, 12, 31),
                'estado': 'ACTIVO'
            }
        ]
        
        for tarif_data in tarifarios_cups:
            tarif, created = TarifariosCUPS.objects.update_or_create(
                contrato_numero=tarif_data['contrato_numero'],
                codigo_cups=tarif_data['codigo_cups'],
                defaults=tarif_data
            )
            if created:
                self.stdout.write(f'Creado tarifario CUPS: {tarif.codigo_cups}')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Datos de contratación cargados exitosamente'))