# -*- coding: utf-8 -*-
"""
Comando para crear contratos de prueba
"""

from django.core.management.base import BaseCommand
from apps.contratacion.models import Prestador, Contrato, TarifariosCUPS, TarifariosMedicamentos, ModalidadPago
from apps.authentication.models import User
from datetime import date, timedelta
from decimal import Decimal


class Command(BaseCommand):
    help = 'Crear contratos de prueba con tarifarios'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Creando contratos de prueba...')
        )
        
        # Obtener usuario admin para created_by
        try:
            admin_user = User.objects.get(email='admin@neuraudit.com')
        except User.DoesNotExist:
            admin_user = User.objects.first()
            if not admin_user:
                self.stdout.write(
                    self.style.ERROR('No hay usuarios en el sistema. Ejecuta create_test_users primero.')
                )
                return

        # Obtener prestadores existentes
        prestadores = Prestador.objects.filter(estado='ACTIVO')
        if not prestadores.exists():
            self.stdout.write(
                self.style.ERROR('No hay prestadores activos. Ejecuta create_test_prestadores primero.')
            )
            return

        # Datos de contratos de prueba
        contratos_test = [
            {
                'numero_contrato': 'C001-2025',
                'nit_prestador': '123456789-0',
                'modalidad_principal': 'CAPITACION',
                'fecha_inicio': date(2025, 1, 1),
                'fecha_fin': date(2025, 12, 31),
                'fecha_firma': date(2024, 12, 15),
                'valor_total': Decimal('2500000000'),
                'valor_mensual': Decimal('208333333'),
                'poblacion_asignada': 15000,
                'manual_tarifario': 'ISS_2001',
                'porcentaje_negociacion': 110,
                'estado': 'VIGENTE'
            },
            {
                'numero_contrato': 'C002-2025',
                'nit_prestador': '900123456-1',
                'modalidad_principal': 'EVENTO',
                'fecha_inicio': date(2025, 2, 1),
                'fecha_fin': date(2026, 1, 31),
                'fecha_firma': date(2025, 1, 20),
                'valor_total': Decimal('1800000000'),
                'manual_tarifario': 'ISS_2004',
                'porcentaje_negociacion': 105,
                'estado': 'VIGENTE'
            },
            {
                'numero_contrato': 'C003-2025',
                'nit_prestador': '900234567-2',
                'modalidad_principal': 'EVENTO',
                'fecha_inicio': date(2024, 12, 1),
                'fecha_fin': date(2025, 11, 30),
                'fecha_firma': date(2024, 11, 25),
                'valor_total': Decimal('950000000'),
                'manual_tarifario': 'SOAT_2025',
                'porcentaje_negociacion': 100,
                'estado': 'VIGENTE'
            }
        ]

        contratos_creados = 0
        for contrato_data in contratos_test:
            try:
                # Buscar prestador por NIT
                prestador = Prestador.objects.get(nit=contrato_data['nit_prestador'])
                
                # Verificar si el contrato ya existe
                if Contrato.objects.filter(numero_contrato=contrato_data['numero_contrato']).exists():
                    self.stdout.write(f'Contrato {contrato_data["numero_contrato"]} ya existe')
                    continue
                
                # Obtener modalidad de pago
                try:
                    modalidad = ModalidadPago.objects.get(codigo=contrato_data['modalidad_principal'])
                except ModalidadPago.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(f'Modalidad {contrato_data["modalidad_principal"]} no encontrada. Ejecute cargar_modalidades_pago primero.')
                    )
                    continue
                
                # Crear contrato
                contrato = Contrato.objects.create(
                    numero_contrato=contrato_data['numero_contrato'],
                    prestador=prestador,
                    modalidad_principal=modalidad,
                    fecha_inicio=contrato_data['fecha_inicio'],
                    fecha_fin=contrato_data['fecha_fin'],
                    fecha_firma=contrato_data['fecha_firma'],
                    valor_total=contrato_data['valor_total'],
                    valor_mensual=contrato_data.get('valor_mensual'),
                    poblacion_asignada=contrato_data.get('poblacion_asignada'),
                    manual_tarifario=contrato_data['manual_tarifario'],
                    porcentaje_negociacion=contrato_data['porcentaje_negociacion'],
                    estado=contrato_data['estado'],
                    servicios_contratados=['390201', '390202', '890201', '890202', '870101'],
                    tiene_anexo_tecnico=True,
                    tiene_anexo_economico=True,
                    created_by=admin_user
                )
                
                contratos_creados += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Contrato creado: {contrato.numero_contrato} - {prestador.razon_social}'
                    )
                )
                
                # Crear algunos tarifarios CUPS de ejemplo para cada contrato
                self._crear_tarifarios_ejemplo(contrato, admin_user)
                
            except Prestador.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Prestador con NIT {contrato_data["nit_prestador"]} no encontrado')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creando contrato: {str(e)}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✅ {contratos_creados} contratos de prueba creados')
        )
        
        total_contratos = Contrato.objects.count()
        self.stdout.write(f'Total contratos en sistema: {total_contratos}')
        
        # Actualizar estados según fechas
        self.stdout.write('\nActualizando estados de contratos...')
        for contrato in Contrato.objects.all():
            contrato.actualizar_estado()
        
        self.stdout.write(
            self.style.SUCCESS('\n🎯 CONTRATOS DISPONIBLES PARA PRUEBAS:')
        )
        for contrato in Contrato.objects.all():
            self.stdout.write(
                f'  - {contrato.numero_contrato}: {contrato.prestador.razon_social} '
                f'({contrato.modalidad_principal.nombre}) - Estado: {contrato.estado}'
            )

    def _crear_tarifarios_ejemplo(self, contrato, usuario):
        """Crear algunos tarifarios de ejemplo para el contrato"""
        
        # Tarifarios CUPS de ejemplo
        tarifarios_cups = [
            {
                'codigo_cups': '390201',
                'descripcion': 'CONSULTA DE PRIMERA VEZ POR MEDICINA GENERAL',
                'valor_unitario': Decimal('45000'),
                'unidad_medida': 'CONSULTA',
                'aplica_copago': True,
                'aplica_cuota_moderadora': True
            },
            {
                'codigo_cups': '390202',
                'descripcion': 'CONSULTA DE CONTROL POR MEDICINA GENERAL',
                'valor_unitario': Decimal('35000'),
                'unidad_medida': 'CONSULTA',
                'aplica_copago': True,
                'aplica_cuota_moderadora': True
            },
            {
                'codigo_cups': '890201',
                'descripcion': 'HEMOGRAMA AUTOMATIZADO',
                'valor_unitario': Decimal('25000'),
                'unidad_medida': 'EXAMEN',
                'aplica_copago': False,
                'aplica_cuota_moderadora': True
            },
            {
                'codigo_cups': '890202',
                'descripcion': 'GLUCOSA EN SUERO',
                'valor_unitario': Decimal('18000'),
                'unidad_medida': 'EXAMEN',
                'aplica_copago': False,
                'aplica_cuota_moderadora': True
            }
        ]
        
        for tarifa_data in tarifarios_cups:
            TarifariosCUPS.objects.get_or_create(
                contrato_numero=contrato.numero_contrato,
                codigo_cups=tarifa_data['codigo_cups'],
                defaults={
                    'descripcion': tarifa_data['descripcion'],
                    'valor_unitario': tarifa_data['valor_unitario'],
                    'unidad_medida': tarifa_data['unidad_medida'],
                    'aplica_copago': tarifa_data['aplica_copago'],
                    'aplica_cuota_moderadora': tarifa_data['aplica_cuota_moderadora'],
                    'requiere_autorizacion': False,
                    'vigencia_desde': contrato.fecha_inicio,
                    'vigencia_hasta': contrato.fecha_fin,
                    'estado': 'ACTIVO'
                }
            )
        
        # Tarifarios de medicamentos de ejemplo
        tarifarios_medicamentos = [
            {
                'codigo_cum': 'CUM001',
                'descripcion': 'ACETAMINOFEN 500MG TABLETA',
                'principio_activo': 'ACETAMINOFEN',
                'concentracion': '500MG',
                'forma_farmaceutica': 'TABLETA',
                'valor_unitario': Decimal('180'),
                'es_pos': True
            },
            {
                'codigo_cum': 'CUM002',
                'descripcion': 'IBUPROFENO 400MG TABLETA',
                'principio_activo': 'IBUPROFENO',
                'concentracion': '400MG',
                'forma_farmaceutica': 'TABLETA',
                'valor_unitario': Decimal('250'),
                'es_pos': True
            }
        ]
        
        for med_data in tarifarios_medicamentos:
            TarifariosMedicamentos.objects.get_or_create(
                contrato_numero=contrato.numero_contrato,
                codigo_cum=med_data['codigo_cum'],
                defaults={
                    'descripcion': med_data['descripcion'],
                    'principio_activo': med_data['principio_activo'],
                    'concentracion': med_data['concentracion'],
                    'forma_farmaceutica': med_data['forma_farmaceutica'],
                    'valor_unitario': med_data['valor_unitario'],
                    'unidad_medida': 'UNIDAD',
                    'es_pos': med_data['es_pos'],
                    'es_no_pos': not med_data['es_pos'],
                    'requiere_autorizacion': False,
                    'vigencia_desde': contrato.fecha_inicio,
                    'vigencia_hasta': contrato.fecha_fin,
                    'estado': 'ACTIVO'
                }
            )
        
        self.stdout.write(f'   - Tarifarios creados para contrato {contrato.numero_contrato}')