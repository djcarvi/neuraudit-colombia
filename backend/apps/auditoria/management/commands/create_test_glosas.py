"""
Comando para crear glosas de prueba que requieren conciliación
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from decimal import Decimal

from apps.auditoria.models_glosas import GlosaAplicada
from apps.radicacion.models import RadicacionCuentaMedica
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado


class Command(BaseCommand):
    help = 'Crea glosas de prueba para el módulo de conciliación'
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== Creando glosas de prueba para conciliación ===\n'))
        
        # Obtener radicaciones existentes
        radicaciones = RadicacionCuentaMedica.objects.filter(estado='RADICADA').order_by('-created_at')[:5]
        
        if not radicaciones:
            self.stdout.write(self.style.WARNING('No hay radicaciones en estado RADICADA. Ejecute primero create_test_radicaciones'))
            return
        
        glosas_creadas = 0
        
        # Tipos de glosas que típicamente requieren conciliación
        glosas_conciliacion = [
            ('FA', 'FA0101', 'Diferencia en cantidades de estancia y/o observación', 0.5),
            ('TA', 'TA0201', 'Diferencia tarifa contratada según modalidad de contratación', 0.7),
            ('SO', 'SO0101', 'Ausencia y/o inconsistencia de epicrisis', 0.8),
            ('AU', 'AU0101', 'Servicios no autorizados', 1.0),
            ('CL', 'CL5301', 'Servicios prestados no obedecen a atención de urgencia vital', 0.6),
            ('CO', 'CO0102', 'Servicio corresponde a diferente cobertura', 0.9),
        ]
        
        auditores_simulados = [
            {'user_id': '1', 'username': 'auditor.medico1', 'nombre_completo': 'Dr. Carlos Mendez', 'rol': 'AUDITOR_MEDICO'},
            {'user_id': '2', 'username': 'auditor.medico2', 'nombre_completo': 'Dra. Patricia Ruiz', 'rol': 'AUDITOR_MEDICO'},
            {'user_id': '3', 'username': 'auditor.admin1', 'nombre_completo': 'Juan Rodriguez', 'rol': 'AUDITOR_ADMINISTRATIVO'},
        ]
        
        for radicacion in radicaciones:
            self.stdout.write(f'\nProcesando radicación {radicacion.numero_radicado}...')
            
            # Obtener o crear facturas para esta radicación
            facturas = FacturaRadicada.objects.filter(radicacion_id=str(radicacion.id))
            
            if not facturas:
                # Crear una factura de ejemplo
                factura = FacturaRadicada.objects.create(
                    radicacion_id=str(radicacion.id),
                    numero_factura=f'FE-2025-{random.randint(1000, 9999)}',
                    fecha_expedicion=radicacion.factura_fecha_expedicion,
                    valor_total=radicacion.factura_valor_total,
                    prestador_info={
                        'nit': radicacion.pss_nit,
                        'razon_social': radicacion.pss_nombre,
                        'codigo_habilitacion': radicacion.pss_codigo_reps or 'HAB001'
                    }
                )
                facturas = [factura]
                
                # Crear algunos servicios para la factura
                tipos_servicio = ['CONSULTAS', 'PROCEDIMIENTOS', 'MEDICAMENTOS', 'HOSPITALIZACION']
                for tipo in tipos_servicio:
                    for i in range(random.randint(2, 5)):
                        valor_servicio = Decimal(random.randint(50000, 500000))
                        ServicioFacturado.objects.create(
                            factura_id=str(factura.id),
                            codigo_servicio=f'{tipo[:3]}{random.randint(100, 999)}',
                            descripcion_servicio=f'Servicio {tipo.lower()} {i+1}',
                            tipo_servicio=tipo,
                            cantidad=random.randint(1, 3),
                            valor_unitario=valor_servicio,
                            valor_total=valor_servicio,
                            usuario_info={
                                'tipo_documento': 'CC',
                                'documento': f'{random.randint(10000000, 99999999)}',
                                'nombre': f'Paciente {i+1}'
                            }
                        )
            
            # Obtener servicios de las facturas
            for factura in facturas:
                servicios = ServicioFacturado.objects.filter(factura_id=str(factura.id))[:3]
                
                for servicio in servicios:
                    # Seleccionar tipo de glosa aleatoriamente
                    glosa_info = random.choice(glosas_conciliacion)
                    tipo_glosa, codigo_glosa, descripcion, porcentaje = glosa_info
                    
                    # Calcular valor glosado
                    valor_glosado = float(servicio.valor_total) * porcentaje
                    
                    # Crear la glosa
                    glosa = GlosaAplicada.objects.create(
                        radicacion_id=str(radicacion.id),
                        numero_radicacion=radicacion.numero_radicado,
                        factura_id=str(factura.id),
                        numero_factura=factura.numero_factura,
                        fecha_factura=factura.fecha_expedicion,
                        servicio_id=str(servicio.id),
                        servicio_info={
                            'codigo': servicio.codigo_servicio,
                            'descripcion': servicio.descripcion_servicio,
                            'tipo_servicio': servicio.tipo_servicio,
                            'valor_original': float(servicio.valor_total)
                        },
                        prestador_info={
                            'nit': radicacion.pss_nit,
                            'razon_social': radicacion.pss_nombre,
                            'codigo_habilitacion': radicacion.pss_codigo_reps or 'HAB001'
                        },
                        tipo_glosa=tipo_glosa,
                        codigo_glosa=codigo_glosa,
                        descripcion_glosa=descripcion,
                        valor_servicio=servicio.valor_total,
                        valor_glosado=Decimal(str(valor_glosado)),
                        porcentaje_glosa=Decimal(str(porcentaje * 100)),
                        observaciones=f'Glosa aplicada por auditoría médica. {descripcion}. Requiere respuesta del prestador.',
                        estado='APLICADA',
                        auditor_info=random.choice(auditores_simulados),
                        tipo_servicio=servicio.tipo_servicio,
                        fecha_aplicacion=timezone.now() - timedelta(days=random.randint(1, 10))
                    )
                    
                    # Simular algunas respuestas que requieren conciliación
                    if random.random() > 0.4:  # 60% con respuestas
                        respuesta = {
                            'tipo_respuesta': random.choice(['RE98', 'RE99']),  # Parcialmente aceptada o no aceptada
                            'valor_aceptado': float(valor_glosado * Decimal('0.3')),
                            'valor_rechazado': float(valor_glosado * Decimal('0.7')),
                            'justificacion': 'No se acepta la glosa en su totalidad. Se requiere conciliación.',
                            'usuario_prestador': {
                                'user_id': '100',
                                'username': 'prestador.respuesta',
                                'nombre': 'Coordinador Respuestas PSS'
                            },
                            'fecha_respuesta': (timezone.now() - timedelta(days=random.randint(1, 5))).isoformat(),
                            'soportes': []
                        }
                        glosa.agregar_respuesta(respuesta)
                    
                    glosas_creadas += 1
                    self.stdout.write(f'  ✓ Glosa {codigo_glosa} creada por ${valor_glosado:,.0f}')
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ {glosas_creadas} glosas creadas exitosamente'))
        self.stdout.write(self.style.SUCCESS('Use el módulo de conciliación para gestionar estas glosas'))