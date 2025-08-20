# -*- coding: utf-8 -*-
"""
Comando para poblar la base de datos con datos realistas de radicación
Genera datos de enero a diciembre 2025 para dashboard más completo
"""

import random
from decimal import Decimal
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model

from apps.radicacion.models import RadicacionCuentaMedica
from apps.authentication.models import User

User = get_user_model()

class Command(BaseCommand):
    help = 'Pobla la base de datos con datos realistas de radicación médica para todo el año 2025'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina todos los datos existentes antes de poblar',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('🗑️  Eliminando datos existentes...')
            RadicacionCuentaMedica.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✅ Datos existentes eliminados'))

        self.stdout.write('🏥 Iniciando población de datos realistas...')

        # Crear usuarios PSS si no existen
        self.create_pss_users()
        
        # Generar datos por mes
        total_generated = 0
        for month in range(1, 13):  # Enero a Diciembre
            month_count = self.generate_monthly_data(2025, month)
            total_generated += month_count
            self.stdout.write(f'📅 Mes {month:02d}: {month_count} radicaciones generadas')

        self.stdout.write(
            self.style.SUCCESS(f'🎉 ¡Completado! Total: {total_generated} radicaciones generadas')
        )
        
        # Mostrar estadísticas finales
        self.show_statistics()

    def create_pss_users(self):
        """Crear usuarios PSS para diferentes prestadores"""
        prestadores_data = [
            {
                'nit': '900123456-1',
                'nombre': 'CLÍNICA SAN RAFAEL S.A.',
                'username': 'clinica.sanrafael'
            },
            {
                'nit': '890234567-2', 
                'nombre': 'HOSPITAL UNIVERSITARIO NACIONAL',
                'username': 'hospital.universitario'
            },
            {
                'nit': '800345678-3',
                'nombre': 'CENTRO MÉDICO ESPECIALIZADO LTDA',
                'username': 'centro.medico'
            },
            {
                'nit': '900456789-4',
                'nombre': 'LABORATORIO CLÍNICO CENTRAL S.A.S',
                'username': 'lab.central'
            },
            {
                'nit': '890567890-5',
                'nombre': 'IMÁGENES DIAGNÓSTICAS DEL CARIBE',
                'username': 'imagenes.caribe'
            },
            {
                'nit': '901019681-0',
                'nombre': 'MEDICAL ENERGY SAS',
                'username': 'medical.energy'
            },
            {
                'nit': '900555666-7',
                'nombre': 'HOSPITAL UNIVERSITARIO SAN JOSÉ',
                'username': 'hospital.sanjose'
            },
            {
                'nit': '800123456-8',
                'nombre': 'FUNDACIÓN CARDIOVASCULAR DEL CARIBE',
                'username': 'cardio.caribe'
            }
        ]

        for prest_data in prestadores_data:
            user, created = User.objects.get_or_create(
                username=prest_data['username'],
                defaults={
                    'user_type': 'PSS',
                    'role': 'RADICADOR',
                    'nit': prest_data['nit'],
                    'pss_name': prest_data['nombre'],
                    'email': f"{prest_data['username']}@neuraudit.com",
                    'first_name': 'Radicador',
                    'last_name': prest_data['nombre'].split()[0],
                    'document_type': 'CC',
                    'document_number': f"{10000000 + hash(prest_data['username']) % 80000000}",
                    'is_active': True,
                    'status': 'AC'
                }
            )
            if created:
                user.set_password('simple123')
                user.save()

    def generate_monthly_data(self, year, month):
        """Generar datos realistas para un mes específico"""
        
        # Obtener usuarios PSS (prestadores de servicios de salud)
        pss_users = list(User.objects.filter(user_type='PSS', role='RADICADOR'))
        if not pss_users:
            self.stdout.write(self.style.ERROR('❌ No hay usuarios PSS disponibles'))
            return 0

        # Configuración por mes (más realista)
        monthly_config = {
            1: {'base_count': 45, 'factor': 0.8},   # Enero - inicio lento
            2: {'base_count': 52, 'factor': 0.9},   # Febrero - incremento
            3: {'base_count': 68, 'factor': 1.1},   # Marzo - alta actividad
            4: {'base_count': 63, 'factor': 1.0},   # Abril - normal
            5: {'base_count': 71, 'factor': 1.2},   # Mayo - pico
            6: {'base_count': 58, 'factor': 0.95},  # Junio - baja
            7: {'base_count': 49, 'factor': 0.85},  # Julio - vacaciones
            8: {'base_count': 67, 'factor': 1.05},  # Agosto - regreso
            9: {'base_count': 74, 'factor': 1.25},  # Septiembre - pico
            10: {'base_count': 69, 'factor': 1.15}, # Octubre - alto
            11: {'base_count': 61, 'factor': 1.0},  # Noviembre - normal
            12: {'base_count': 38, 'factor': 0.7}   # Diciembre - festivos
        }

        config = monthly_config[month]
        base_count = config['base_count']
        
        # Generar número de radicaciones para el mes (con variación aleatoria)
        month_radicaciones = random.randint(
            int(base_count * 0.8), 
            int(base_count * 1.2)
        )

        generated_count = 0
        
        for _ in range(month_radicaciones):
            # Fecha aleatoria dentro del mes
            start_date = datetime(year, month, 1)
            if month == 12:
                end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
            else:
                end_date = datetime(year, month + 1, 1) - timedelta(days=1)
            
            random_date = start_date + timedelta(
                days=random.randint(0, (end_date - start_date).days)
            )
            random_date = timezone.make_aware(random_date)

            # Seleccionar usuario PSS aleatorio
            pss_user = random.choice(pss_users)
            
            # Generar datos de radicación
            radicacion_data = self.generate_radicacion_data(pss_user, random_date, config['factor'])
            
            # Crear radicación
            radicacion = RadicacionCuentaMedica.objects.create(**radicacion_data)
            
            # Actualizar manualmente las fechas para distribuir por el año
            radicacion.created_at = random_date
            radicacion.updated_at = random_date
            radicacion.save()
            
            generated_count += 1

        return generated_count

    def generate_radicacion_data(self, pss_user, fecha, factor):
        """Generar datos realistas para una radicación usando campos del modelo MongoDB"""
        
        # Usar tipos de servicio del modelo (TIPO_SERVICIO_CHOICES)
        tipos_servicio = [
            {'tipo': 'AMBULATORIO', 'valor_base': 85000, 'variacion': 0.4},
            {'tipo': 'URGENCIAS', 'valor_base': 180000, 'variacion': 0.6},
            {'tipo': 'HOSPITALIZACION', 'valor_base': 2500000, 'variacion': 0.8},
            {'tipo': 'CIRUGIA', 'valor_base': 1200000, 'variacion': 0.7},
            {'tipo': 'MEDICAMENTOS', 'valor_base': 450000, 'variacion': 0.9},
            {'tipo': 'APOYO_DIAGNOSTICO', 'valor_base': 250000, 'variacion': 0.5},
            {'tipo': 'TERAPIAS', 'valor_base': 65000, 'variacion': 0.3},
            {'tipo': 'ODONTOLOGIA', 'valor_base': 95000, 'variacion': 0.4},
            {'tipo': 'TRANSPORTE', 'valor_base': 120000, 'variacion': 0.5}
        ]

        # Seleccionar tipo de servicio (ambulatorio y urgencias más frecuentes)
        if random.random() < 0.45:  # 45% ambulatorio
            servicio = tipos_servicio[0]
        elif random.random() < 0.25:  # 25% urgencias
            servicio = tipos_servicio[1]
        else:  # 30% otros servicios
            servicio = random.choice(tipos_servicio[2:])

        # Calcular valor con variación y factor mensual
        valor_base = servicio['valor_base']
        variacion = servicio['variacion']
        valor_min = valor_base * (1 - variacion) * factor
        valor_max = valor_base * (1 + variacion) * factor
        valor_total = random.uniform(valor_min, valor_max)

        # Estados realistas según tiempo transcurrido (usar ESTADO_CHOICES del modelo)
        tiempo_transcurrido = (timezone.now() - fecha).days
        if tiempo_transcurrido < 5:
            estado = random.choice(['BORRADOR', 'RADICADA'])
        elif tiempo_transcurrido < 15:
            estado = random.choice(['RADICADA', 'EN_AUDITORIA'])
        elif tiempo_transcurrido < 30:
            estado = random.choice(['EN_AUDITORIA', 'AUDITADA'])
        else:
            estado = random.choice(['AUDITADA', 'PAGADA', 'DEVUELTA'])

        # Generar fechas realistas
        fecha_atencion = fecha - timedelta(days=random.randint(1, 5))
        fecha_expedicion_factura = fecha_atencion + timedelta(days=random.randint(0, 3))
        fecha_limite = fecha_expedicion_factura + timedelta(days=22)  # 22 días hábiles
        
        # Generar número de radicación único
        fecha_str = fecha.strftime('%Y%m%d')
        numero_radicacion = f"RAD-{pss_user.nit.split('-')[0]}-{fecha_str}-{random.randint(1, 999):03d}"
        
        # Modalidades de pago
        modalidades = ['EVENTO', 'CAPITACION', 'GLOBAL_PROSPECTIVO', 'GRUPO_DIAGNOSTICO']
        modalidad = random.choice(modalidades)
        
        # Diagnósticos CIE-10 comunes
        diagnosticos_comunes = [
            'Z00.0', 'Z01.0', 'K59.0', 'M54.5', 'J06.9', 'I10.0', 'E11.9', 
            'F32.9', 'G43.9', 'N39.0', 'L20.9', 'H52.1', 'Z51.1', 'R50.9'
        ]

        return {
            # Identificación única
            'numero_radicado': numero_radicacion,
            
            # Información del prestador (usuario del sistema)
            'pss_nit': pss_user.nit,
            'pss_nombre': pss_user.pss_name,
            'pss_codigo_reps': f'REPS-{random.randint(10000, 99999)}',
            'usuario_radicador': pss_user,
            
            # Información de la factura electrónica
            'factura_numero': f"FAC-{random.randint(100000, 999999)}",
            'factura_prefijo': random.choice(['A', 'B', 'C', 'FE']),
            'factura_fecha_expedicion': fecha_expedicion_factura,
            'factura_valor_total': Decimal(str(round(valor_total, 2))),
            'factura_moneda': 'COP',
            
            # Clasificación del servicio
            'modalidad_pago': modalidad,
            'tipo_servicio': servicio['tipo'],
            
            # Información del paciente (persona que recibió atención médica - NO es usuario del sistema)
            'paciente_tipo_documento': random.choice(['CC', 'TI', 'CE', 'PP', 'RC']),
            'paciente_numero_documento': str(random.randint(10000000, 99999999)),
            'paciente_codigo_sexo': random.choice(['M', 'F']),
            'paciente_codigo_edad': str(random.randint(0, 99)),
            
            # Información clínica
            'fecha_atencion_inicio': fecha_atencion,
            'fecha_atencion_fin': fecha_atencion + timedelta(hours=random.randint(1, 8)),
            'diagnostico_principal': random.choice(diagnosticos_comunes),
            'diagnosticos_relacionados': random.sample(diagnosticos_comunes, random.randint(0, 3)),
            
            # Estado y control
            'estado': estado,
            'fecha_radicacion': fecha if estado != 'BORRADOR' else None,
            'fecha_limite_radicacion': fecha_limite,
            
            # Control de versiones
            'version': 1,
            'hash_documentos': f'hash_{random.randint(100000, 999999)}',
            
            # Validaciones (simuladas como exitosas)
            'validacion_rips': {
                'estado': 'VALIDO',
                'errores': [],
                'codigo_validacion': f'RIPS_{random.randint(100000, 999999)}'
            },
            'validacion_factura': {
                'estado': 'VALIDO',
                'errores': [],
                'codigo_dian': f'DIAN_{random.randint(100000, 999999)}'
            },
            'validacion_soportes': {
                'estado': 'COMPLETO',
                'documentos_adjuntos': random.randint(3, 8)
            },
            
            # Código Único de Validación MinSalud (simulado)
            'cuv_codigo': f'CUV{random.randint(1000000000, 9999999999)}' if random.random() > 0.3 else '',
            'cuv_proceso_id': f'PROC_{random.randint(100000, 999999)}' if random.random() > 0.3 else '',
            'cuv_fecha_validacion': fecha + timedelta(hours=random.randint(1, 48)) if random.random() > 0.3 else None,
            'cuv_resultado': {
                'estado': 'APROBADO',
                'observaciones': 'Validación exitosa MinSalud'
            } if random.random() > 0.3 else {},
            
            # Observaciones
            'observaciones': f'Radicación {servicio["tipo"].lower().replace("_", " ")} - Datos generados automáticamente para testing',
            
            # Metadatos adicionales
            'metadatos': {
                'origen': 'comando_populate',
                'factor_mes': factor,
                'valor_base_servicio': servicio['valor_base'],
                'generado_en': timezone.now().isoformat()
            }
        }

    def show_statistics(self):
        """Mostrar estadísticas finales"""
        self.stdout.write('\n📊 ESTADÍSTICAS FINALES:')
        
        total_radicaciones = RadicacionCuentaMedica.objects.count()
        total_valor = RadicacionCuentaMedica.objects.aggregate(
            total=models.Sum('factura_valor_total')
        )['total'] or 0
        
        self.stdout.write(f'📋 Total radicaciones: {total_radicaciones}')
        self.stdout.write(f'💰 Valor total: ${total_valor:,.2f}')
        
        # Estadísticas por estado
        estados = RadicacionCuentaMedica.objects.values('estado').annotate(
            count=models.Count('id'),
            valor=models.Sum('factura_valor_total')
        ).order_by('-count')
        
        self.stdout.write('\n📈 Por estado:')
        for estado in estados:
            self.stdout.write(f"  {estado['estado']}: {estado['count']} ({estado['valor']:,.2f})")
        
        # Estadísticas por mes
        self.stdout.write('\n📅 Por mes:')
        for month in range(1, 13):
            month_count = RadicacionCuentaMedica.objects.filter(
                created_at__month=month,
                created_at__year=2025
            ).count()
            month_valor = RadicacionCuentaMedica.objects.filter(
                created_at__month=month,
                created_at__year=2025
            ).aggregate(total=models.Sum('factura_valor_total'))['total'] or 0
            
            month_name = [
                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
            ][month - 1]
            
            self.stdout.write(f"  {month_name}: {month_count} radicaciones (${month_valor:,.2f})")