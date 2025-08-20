# -*- coding: utf-8 -*-
"""
Comando para cargar datos de prueba del sistema de glosas según Resolución 2284
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.glosas.models import Glosa, RespuestaGlosa, RatificacionGlosa
from datetime import datetime, timedelta
from decimal import Decimal
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Carga datos de prueba para el sistema de glosas según Resolución 2284'

    def add_arguments(self, parser):
        parser.add_argument(
            '--cantidad',
            type=int,
            default=20,
            help='Cantidad de glosas de prueba a crear (default: 20)',
        )

    def handle(self, *args, **options):
        cantidad = options['cantidad']
        
        self.stdout.write(
            self.style.SUCCESS(f'Iniciando carga de {cantidad} glosas de prueba...')
        )

        # Obtener o crear usuario de prueba
        try:
            usuario_auditor = User.objects.get(username='test.eps')
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Usuario test.eps no encontrado. Ejecuta primero load_test_users.')
            )
            return

        # Datos de prueba para prestadores
        prestadores_test = [
            {'nit': '900123456-1', 'nombre': 'Hospital San Rafael'},
            {'nit': '900234567-2', 'nombre': 'Clínica La Esperanza'},
            {'nit': '900345678-3', 'nombre': 'IPS Los Andes'},
            {'nit': '900456789-4', 'nombre': 'Hospital Central'},
            {'nit': '900567890-5', 'nombre': 'Clínica del Caribe'},
        ]

        # Códigos de glosa según Resolución 2284
        codigos_glosa = [
            ('FA0101', 'FA', 'Diferencia en cantidad facturada vs autorizada'),
            ('FA0102', 'FA', 'Facturación de servicios no prestados'),
            ('TA0201', 'TA', 'Diferencia en valor pactado contractualmente'),
            ('TA0202', 'TA', 'Aplicación incorrecta de tarifas SOAT'),
            ('SO0301', 'SO', 'Ausencia de epicrisis médica'),
            ('SO0302', 'SO', 'Historia clínica incompleta'),
            ('AU0401', 'AU', 'Servicio no autorizado por EPS'),
            ('AU0402', 'AU', 'Exceso en días autorizados'),
            ('CO0501', 'CO', 'Servicio no incluido en POS'),
            ('CO0502', 'CO', 'Medicamento no incluido en vademécum'),
            ('CL0601', 'CL', 'Pertinencia clínica cuestionable'),
            ('CL0602', 'CL', 'Estancia hospitalaria prolongada sin justificación'),
            ('SA0701', 'SA', 'Incumplimiento de indicadores de calidad'),
        ]

        estados_posibles = [
            'FORMULADA', 'NOTIFICADA', 'RESPONDIDA_1', 'RATIFICADA',
            'ACEPTADA_PARCIAL', 'ACEPTADA_TOTAL', 'OBJETADA', 'CERRADA'
        ]

        glosas_creadas = 0

        for i in range(cantidad):
            prestador = random.choice(prestadores_test)
            codigo_data = random.choice(codigos_glosa)
            estado = random.choice(estados_posibles)
            
            # Generar fechas coherentes
            fecha_formulacion = datetime.now() - timedelta(days=random.randint(1, 60))
            fecha_notificacion = None
            fecha_limite_respuesta = None
            fecha_respuesta_prestador = None
            
            if estado in ['NOTIFICADA', 'RESPONDIDA_1', 'RATIFICADA', 'ACEPTADA_PARCIAL', 'ACEPTADA_TOTAL', 'OBJETADA', 'CERRADA']:
                fecha_notificacion = fecha_formulacion + timedelta(days=1)
                fecha_limite_respuesta = fecha_notificacion + timedelta(days=5)
                
                if estado in ['RESPONDIDA_1', 'RATIFICADA', 'ACEPTADA_PARCIAL', 'ACEPTADA_TOTAL', 'OBJETADA', 'CERRADA']:
                    fecha_respuesta_prestador = fecha_notificacion + timedelta(days=random.randint(1, 7))

            # Valores monetarios aleatorios
            valor_glosado = Decimal(str(random.randint(50000, 5000000)))
            valor_aceptado = Decimal('0')
            valor_objetado = Decimal('0')
            
            if estado in ['ACEPTADA_TOTAL']:
                valor_aceptado = valor_glosado
            elif estado in ['ACEPTADA_PARCIAL']:
                valor_aceptado = valor_glosado * Decimal(str(random.uniform(0.3, 0.8)))
                valor_objetado = valor_glosado - valor_aceptado
            elif estado in ['OBJETADA', 'CERRADA']:
                valor_objetado = valor_glosado

            try:
                glosa = Glosa.objects.create(
                    radicacion_id=f"rad_{random.randint(100000, 999999)}",
                    numero_radicado=f"R{random.randint(10000, 99999)}",
                    prestador_nit=prestador['nit'],
                    prestador_nombre=prestador['nombre'],
                    factura_numero=f"F{random.randint(1000, 9999)}",
                    factura_prefijo=random.choice(['', 'FC', 'FA', 'FV']),
                    codigo_glosa=codigo_data[0],
                    categoria_glosa=codigo_data[1],
                    descripcion_glosa=codigo_data[2],
                    consecutivo_servicio=str(random.randint(1, 100)),
                    codigo_servicio=f"{random.randint(890000, 899999)}",
                    descripcion_servicio=f"Servicio médico {random.randint(1, 100)}",
                    valor_glosado=valor_glosado,
                    valor_aceptado=valor_aceptado,
                    valor_objetado=valor_objetado,
                    estado=estado,
                    fecha_formulacion=fecha_formulacion,
                    fecha_notificacion=fecha_notificacion,
                    fecha_limite_respuesta=fecha_limite_respuesta,
                    fecha_respuesta_prestador=fecha_respuesta_prestador,
                    aceptacion_tacita_prestador=random.choice([True, False]) if estado == 'ACEPTADA_TOTAL' else False,
                    observaciones_auditoria=f"Observación de auditoría para glosa {i+1}",
                    created_by=usuario_auditor
                )

                glosas_creadas += 1
                
                # Crear respuesta si la glosa está respondida
                if estado in ['RESPONDIDA_1', 'RATIFICADA', 'ACEPTADA_PARCIAL', 'ACEPTADA_TOTAL', 'OBJETADA', 'CERRADA']:
                    codigos_respuesta = [
                        'RE9701', 'RE9702', 'RE9801', 'RE9901', 'RE9601', 'RE9602'
                    ]
                    
                    RespuestaGlosa.objects.create(
                        glosa=glosa,
                        codigo_respuesta=random.choice(codigos_respuesta),
                        descripcion_respuesta=f"Respuesta del prestador a la glosa {glosa.codigo_glosa}",
                        valor_aceptado_prestador=valor_aceptado,
                        valor_objetado_prestador=valor_objetado,
                        valor_subsanado=Decimal('0'),
                        documentos_soporte=[],
                        observaciones=f"Observaciones de respuesta para glosa {glosa.codigo_glosa}",
                        fecha_respuesta=fecha_respuesta_prestador,
                        es_extemporanea=random.choice([True, False]),
                        respondido_por=usuario_auditor
                    )

                if i % 5 == 0:
                    self.stdout.write(f'Creadas {i+1} glosas...')

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creando glosa {i+1}: {str(e)}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Proceso completado: {glosas_creadas} glosas de prueba creadas exitosamente'
            )
        )
        
        # Mostrar estadísticas
        total_glosas = Glosa.objects.count()
        glosas_por_estado = {}
        for estado, nombre in Glosa.ESTADO_GLOSA_CHOICES:
            count = Glosa.objects.filter(estado=estado).count()
            if count > 0:
                glosas_por_estado[nombre] = count

        self.stdout.write(
            self.style.SUCCESS(f'\n📊 ESTADÍSTICAS DEL SISTEMA:')
        )
        self.stdout.write(f'Total de glosas: {total_glosas}')
        
        for estado, count in glosas_por_estado.items():
            self.stdout.write(f'  - {estado}: {count}')

        # Calcular valores totales
        from django.db.models import Sum
        valores = Glosa.objects.aggregate(
            total_glosado=Sum('valor_glosado') or Decimal('0'),
            total_aceptado=Sum('valor_aceptado') or Decimal('0'),
            total_objetado=Sum('valor_objetado') or Decimal('0')
        )
        
        self.stdout.write(f'\n💰 VALORES MONETARIOS:')
        self.stdout.write(f'  - Total glosado: ${valores["total_glosado"]:,.2f}')
        self.stdout.write(f'  - Total aceptado: ${valores["total_aceptado"]:,.2f}')
        self.stdout.write(f'  - Total objetado: ${valores["total_objetado"]:,.2f}')
        
        porcentaje_aceptacion = (valores['total_aceptado'] / valores['total_glosado'] * 100) if valores['total_glosado'] > 0 else 0
        self.stdout.write(f'  - Porcentaje de aceptación: {porcentaje_aceptacion:.2f}%')

        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎯 Sistema de glosas listo para pruebas según Resolución 2284 de 2023'
            )
        )