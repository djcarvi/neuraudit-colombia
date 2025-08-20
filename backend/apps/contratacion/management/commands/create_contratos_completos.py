# -*- coding: utf-8 -*-
"""
Comando para crear 8 contratos de prueba con todas las modalidades
"""

from django.core.management.base import BaseCommand
from apps.contratacion.models import Prestador, Contrato, ModalidadPago, TarifariosCUPS
from apps.authentication.models import User
from datetime import date, timedelta
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Crear 8 contratos de prueba con diferentes modalidades'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Creando 8 contratos de prueba con todas las modalidades...')
        )
        
        # Obtener usuario admin
        try:
            admin_user = User.objects.get(email='admin@neuraudit.com')
        except User.DoesNotExist:
            admin_user = User.objects.first()
            if not admin_user:
                self.stdout.write(
                    self.style.ERROR('No hay usuarios en el sistema. Ejecuta create_test_users primero.')
                )
                return

        # Obtener prestadores
        prestadores = list(Prestador.objects.filter(estado='ACTIVO'))
        if len(prestadores) < 3:
            self.stdout.write(
                self.style.ERROR('No hay suficientes prestadores activos. Ejecuta create_test_prestadores primero.')
            )
            return

        # Obtener todas las modalidades
        modalidades = list(ModalidadPago.objects.all())
        if not modalidades:
            self.stdout.write(
                self.style.ERROR('No hay modalidades de pago. Ejecuta cargar_modalidades_pago primero.')
            )
            return

        # Datos de contratos (8 contratos)
        contratos_data = [
            {
                'numero_contrato': 'CTR-2025-001',
                'modalidad': 'EVENTO',
                'valor_total': Decimal('2500000000'),
                'manual_tarifario': 'ISS_2001',
                'porcentaje': 110,
                'meses': 12
            },
            {
                'numero_contrato': 'CTR-2025-002',
                'modalidad': 'CAPITACION',
                'valor_total': Decimal('3600000000'),
                'poblacion': 25000,
                'manual_tarifario': 'ISS_2004',
                'porcentaje': 100,
                'meses': 12
            },
            {
                'numero_contrato': 'CTR-2025-003',
                'modalidad': 'PGP',
                'valor_total': Decimal('4200000000'),
                'poblacion': 30000,
                'manual_tarifario': 'ISS_2001',
                'porcentaje': 105,
                'meses': 12
            },
            {
                'numero_contrato': 'CTR-2025-004',
                'modalidad': 'PAQUETE',
                'valor_total': Decimal('1800000000'),
                'manual_tarifario': 'SOAT_2025',
                'porcentaje': 95,
                'meses': 6
            },
            {
                'numero_contrato': 'CTR-2025-005',
                'modalidad': 'CASO',
                'valor_total': Decimal('980000000'),
                'manual_tarifario': 'ISS_2004',
                'porcentaje': 108,
                'meses': 8
            },
            {
                'numero_contrato': 'CTR-2025-006',
                'modalidad': 'PRESUPUESTO_GLOBAL',
                'valor_total': Decimal('5500000000'),
                'manual_tarifario': 'PERSONALIZADO',
                'porcentaje': 100,
                'meses': 12
            },
            {
                'numero_contrato': 'CTR-2025-007',
                'modalidad': 'GRUPO_DIAGNOSTICO',
                'valor_total': Decimal('2200000000'),
                'manual_tarifario': 'ISS_2001',
                'porcentaje': 112,
                'meses': 10
            },
            {
                'numero_contrato': 'CTR-2025-008',
                'modalidad': 'EVENTO',
                'valor_total': Decimal('1500000000'),
                'manual_tarifario': 'MIXTO',
                'porcentaje': 98,
                'meses': 6
            }
        ]

        contratos_creados = 0
        
        for idx, contrato_data in enumerate(contratos_data):
            try:
                # Seleccionar prestador (rotar entre los disponibles)
                prestador = prestadores[idx % len(prestadores)]
                
                # Obtener modalidad
                modalidad = ModalidadPago.objects.get(codigo=contrato_data['modalidad'])
                
                # Calcular fechas
                fecha_inicio = date.today() + timedelta(days=random.randint(-60, 30))
                fecha_fin = fecha_inicio + timedelta(days=30 * contrato_data['meses'])
                fecha_firma = fecha_inicio - timedelta(days=random.randint(10, 30))
                
                # Calcular valor mensual si aplica
                valor_mensual = None
                if modalidad.codigo in ['CAPITACION', 'PGP', 'PRESUPUESTO_GLOBAL']:
                    valor_mensual = contrato_data['valor_total'] / contrato_data['meses']
                
                # Determinar estado según fechas
                today = date.today()
                if fecha_fin < today:
                    estado = 'VENCIDO'
                elif fecha_inicio > today:
                    estado = 'POR_INICIAR'
                elif (fecha_fin - today).days <= 60:
                    estado = 'POR_VENCER'
                else:
                    estado = 'VIGENTE'
                
                # Crear contrato
                contrato = Contrato.objects.create(
                    numero_contrato=contrato_data['numero_contrato'],
                    prestador=prestador,
                    modalidad_principal=modalidad,
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_fin,
                    fecha_firma=fecha_firma,
                    valor_total=contrato_data['valor_total'],
                    valor_mensual=valor_mensual,
                    poblacion_asignada=contrato_data.get('poblacion'),
                    manual_tarifario=contrato_data['manual_tarifario'],
                    porcentaje_negociacion=contrato_data['porcentaje'],
                    estado=estado,
                    servicios_contratados=self._generar_servicios_aleatorios(),
                    tiene_anexo_tecnico=True,
                    tiene_anexo_economico=True,
                    created_by=admin_user
                )
                
                # Crear tarifarios de ejemplo
                self._crear_tarifarios_ejemplo(contrato)
                
                contratos_creados += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Contrato {contrato.numero_contrato}: {prestador.razon_social} '
                        f'- {modalidad.nombre} - {estado}'
                    )
                )
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creando contrato {contrato_data["numero_contrato"]}: {str(e)}')
                )

        # Resumen final
        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎯 RESUMEN:'
                f'\n- Contratos creados: {contratos_creados}/8'
                f'\n- Total contratos en sistema: {Contrato.objects.count()}'
            )
        )
        
        # Mostrar distribución por modalidad
        self.stdout.write('\n📊 DISTRIBUCIÓN POR MODALIDAD:')
        for modalidad in ModalidadPago.objects.all():
            count = Contrato.objects.filter(modalidad_principal=modalidad).count()
            if count > 0:
                self.stdout.write(f'  - {modalidad.nombre}: {count} contratos')
        
        # Mostrar distribución por estado
        self.stdout.write('\n📊 DISTRIBUCIÓN POR ESTADO:')
        for estado, _ in Contrato.ESTADO_CHOICES:
            count = Contrato.objects.filter(estado=estado).count()
            if count > 0:
                self.stdout.write(f'  - {estado}: {count} contratos')

    def _generar_servicios_aleatorios(self):
        """Genera una lista aleatoria de códigos CUPS"""
        todos_servicios = [
            '390201', '390202', '390301', '390302',  # Consultas
            '890201', '890202', '890301', '890401',  # Laboratorios
            '870101', '870201', '871101', '872101',  # Imágenes
            '395001', '395101', '396001', '397001',  # Procedimientos
        ]
        num_servicios = random.randint(5, 10)
        return random.sample(todos_servicios, num_servicios)
    
    def _crear_tarifarios_ejemplo(self, contrato):
        """Crea tarifarios CUPS de ejemplo para el contrato"""
        tarifarios_base = [
            ('390201', 'CONSULTA MEDICINA GENERAL PRIMERA VEZ', 45000),
            ('390202', 'CONSULTA MEDICINA GENERAL CONTROL', 35000),
            ('890201', 'HEMOGRAMA COMPLETO', 25000),
            ('890202', 'GLUCOSA EN SANGRE', 18000),
            ('870101', 'RADIOGRAFÍA DE TÓRAX', 55000),
        ]
        
        # Aplicar porcentaje de negociación
        factor = Decimal(contrato.porcentaje_negociacion) / 100
        
        for codigo, descripcion, valor_base in tarifarios_base:
            if codigo in contrato.servicios_contratados:
                TarifariosCUPS.objects.create(
                    contrato_numero=contrato.numero_contrato,
                    codigo_cups=codigo,
                    descripcion=descripcion,
                    valor_unitario=Decimal(valor_base) * factor,
                    unidad_medida='UNIDAD',
                    aplica_copago=random.choice([True, False]),
                    aplica_cuota_moderadora=True,
                    requiere_autorizacion=random.choice([True, False]),
                    vigencia_desde=contrato.fecha_inicio,
                    vigencia_hasta=contrato.fecha_fin,
                    estado='ACTIVO'
                )