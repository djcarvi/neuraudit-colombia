# -*- coding: utf-8 -*-
"""
Comando para cargar modalidades de pago según Resolución 2284 de 2023
"""

from django.core.management.base import BaseCommand
from apps.contratacion.models import ModalidadPago


class Command(BaseCommand):
    help = 'Carga las modalidades de pago estándar según Resolución 2284'

    def handle(self, *args, **options):
        modalidades = [
            {
                'codigo': 'EVENTO',
                'nombre': 'Pago por Evento',
                'descripcion': 'Pago por cada servicio prestado según tarifas contratadas. Mayor control para la EPS pero mayor carga administrativa.',
                'requiere_autorizacion': True,
                'permite_glosas': True,
                'pago_anticipado': False,
                'porcentaje_primer_pago': 50,
                'dias_primer_pago': 5
            },
            {
                'codigo': 'CAPITACION',
                'nombre': 'Capitación',
                'descripcion': 'Pago fijo mensual por afiliado asignado. Incentiva la prevención y el control de costos.',
                'requiere_autorizacion': False,
                'permite_glosas': False,
                'pago_anticipado': True,
                'porcentaje_primer_pago': 100,
                'dias_primer_pago': 5
            },
            {
                'codigo': 'PGP',
                'nombre': 'Pago Global Prospectivo',
                'descripcion': 'Pago anticipado para la atención integral de una población definida durante un período determinado.',
                'requiere_autorizacion': False,
                'permite_glosas': True,
                'pago_anticipado': True,
                'porcentaje_primer_pago': 100,
                'dias_primer_pago': 5
            },
            {
                'codigo': 'PAQUETE',
                'nombre': 'Paquete',
                'descripcion': 'Precio fijo por conjunto de servicios relacionados (ej. parto, cirugía).',
                'requiere_autorizacion': True,
                'permite_glosas': True,
                'pago_anticipado': False,
                'porcentaje_primer_pago': 50,
                'dias_primer_pago': 5
            },
            {
                'codigo': 'CASO',
                'nombre': 'Pago por Caso',
                'descripcion': 'Pago único por episodio completo de atención, independiente de los servicios utilizados.',
                'requiere_autorizacion': True,
                'permite_glosas': True,
                'pago_anticipado': False,
                'porcentaje_primer_pago': 50,
                'dias_primer_pago': 5
            },
            {
                'codigo': 'PRESUPUESTO_GLOBAL',
                'nombre': 'Presupuesto Global',
                'descripcion': 'Monto fijo anual para todos los servicios de un prestador.',
                'requiere_autorizacion': False,
                'permite_glosas': False,
                'pago_anticipado': True,
                'porcentaje_primer_pago': 100,
                'dias_primer_pago': 30
            },
            {
                'codigo': 'GRUPO_DIAGNOSTICO',
                'nombre': 'Grupo Diagnóstico',
                'descripcion': 'Pago por grupos relacionados de diagnóstico (GRD). Agrupa pacientes con características clínicas similares.',
                'requiere_autorizacion': True,
                'permite_glosas': True,
                'pago_anticipado': False,
                'porcentaje_primer_pago': 50,
                'dias_primer_pago': 5
            }
        ]
        
        created_count = 0
        updated_count = 0
        
        for modalidad_data in modalidades:
            modalidad, created = ModalidadPago.objects.update_or_create(
                codigo=modalidad_data['codigo'],
                defaults=modalidad_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Creada modalidad: {modalidad.nombre}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Actualizada modalidad: {modalidad.nombre}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nProceso completado: {created_count} modalidades creadas, '
                f'{updated_count} modalidades actualizadas.'
            )
        )