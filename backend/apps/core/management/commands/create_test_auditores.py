# -*- coding: utf-8 -*-
# apps/core/management/commands/create_test_auditores.py

"""
Comando para crear auditores de prueba para el sistema de asignación automática
Cumple con arquitectura NoSQL MongoDB + django_mongodb_backend
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.core.models import AuditorPerfil, ConfiguracionAlgoritmo
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Crea auditores de prueba para sistema de asignación automática'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Eliminar auditores existentes antes de crear nuevos',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🔧 Iniciando creación de auditores de prueba...')
        )

        # Eliminar existentes si se solicita
        if options['delete_existing']:
            AuditorPerfil.objects.all().delete()
            self.stdout.write('💀 Auditores existentes eliminados')

        # Crear auditores médicos
        auditores_medicos = [
            {
                'username': 'dr.martinez',
                'nombres': 'Carlos Eduardo',
                'apellidos': 'Martínez López',
                'documento': '12345678',
                'email': 'carlos.martinez@eps.co',
                'perfil': 'MEDICO',
                'especializacion': 'Medicina Interna',
                'registro_medico': 'RM-12345',
                'capacidad_maxima_dia': 12,
                'tipos_auditoria_permitidos': ['AMBULATORIO', 'HOSPITALARIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes': {'inicio': '07:00', 'fin': '15:00'},
                        'martes': {'inicio': '07:00', 'fin': '15:00'},
                        'miercoles': {'inicio': '07:00', 'fin': '15:00'},
                        'jueves': {'inicio': '07:00', 'fin': '15:00'},
                        'viernes': {'inicio': '07:00', 'fin': '15:00'}
                    },
                    'capacidad_actual': 0
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 45,  # minutos
                    'glosas_promedio_por_caso': 2.3,
                    'efectividad_glosas': 0.78,
                    'casos_completados_mes': 180
                }
            },
            {
                'username': 'dra.rodriguez',
                'nombres': 'Ana María',
                'apellidos': 'Rodríguez Silva',
                'documento': '23456789',
                'email': 'ana.rodriguez@eps.co',
                'perfil': 'MEDICO',
                'especializacion': 'Cirugía General',
                'registro_medico': 'RM-23456',
                'capacidad_maxima_dia': 10,
                'tipos_auditoria_permitidos': ['AMBULATORIO', 'HOSPITALARIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes': {'inicio': '14:00', 'fin': '22:00'},
                        'martes': {'inicio': '14:00', 'fin': '22:00'},
                        'miercoles': {'inicio': '14:00', 'fin': '22:00'},
                        'jueves': {'inicio': '14:00', 'fin': '22:00'},
                        'viernes': {'inicio': '14:00', 'fin': '22:00'}
                    },
                    'capacidad_actual': 0
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 60,
                    'glosas_promedio_por_caso': 3.1,
                    'efectividad_glosas': 0.85,
                    'casos_completados_mes': 150
                }
            },
            {
                'username': 'dr.garcia',
                'nombres': 'Luis Fernando',
                'apellidos': 'García Mendoza',
                'documento': '34567890',
                'email': 'luis.garcia@eps.co',
                'perfil': 'MEDICO',
                'especializacion': 'Medicina Familiar',
                'registro_medico': 'RM-34567',
                'capacidad_maxima_dia': 15,
                'tipos_auditoria_permitidos': ['AMBULATORIO', 'HOSPITALARIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes': {'inicio': '06:00', 'fin': '14:00'},
                        'martes': {'inicio': '06:00', 'fin': '14:00'},
                        'miercoles': {'inicio': '06:00', 'fin': '14:00'},
                        'jueves': {'inicio': '06:00', 'fin': '14:00'},
                        'viernes': {'inicio': '06:00', 'fin': '14:00'}
                    },
                    'capacidad_actual': 0
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 35,
                    'glosas_promedio_por_caso': 1.8,
                    'efectividad_glosas': 0.72,
                    'casos_completados_mes': 220
                }
            }
        ]

        # Crear auditores administrativos
        auditores_administrativos = [
            {
                'username': 'admin.lopez',
                'nombres': 'María Fernanda',
                'apellidos': 'López Herrera',
                'documento': '45678901',
                'email': 'maria.lopez@eps.co',
                'perfil': 'ADMINISTRATIVO',
                'especializacion': None,
                'registro_medico': None,
                'capacidad_maxima_dia': 20,
                'tipos_auditoria_permitidos': ['AMBULATORIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes': {'inicio': '08:00', 'fin': '17:00'},
                        'martes': {'inicio': '08:00', 'fin': '17:00'},
                        'miercoles': {'inicio': '08:00', 'fin': '17:00'},
                        'jueves': {'inicio': '08:00', 'fin': '17:00'},
                        'viernes': {'inicio': '08:00', 'fin': '17:00'}
                    },
                    'capacidad_actual': 0
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 25,
                    'glosas_promedio_por_caso': 2.8,
                    'efectividad_glosas': 0.82,
                    'casos_completados_mes': 280
                }
            },
            {
                'username': 'admin.torres',
                'nombres': 'Jorge Andrés',
                'apellidos': 'Torres Jiménez',
                'documento': '56789012',
                'email': 'jorge.torres@eps.co',
                'perfil': 'ADMINISTRATIVO',
                'especializacion': None,
                'registro_medico': None,
                'capacidad_maxima_dia': 18,
                'tipos_auditoria_permitidos': ['AMBULATORIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes': {'inicio': '13:00', 'fin': '21:00'},
                        'martes': {'inicio': '13:00', 'fin': '21:00'},
                        'miercoles': {'inicio': '13:00', 'fin': '21:00'},
                        'jueves': {'inicio': '13:00', 'fin': '21:00'},
                        'viernes': {'inicio': '13:00', 'fin': '21:00'}
                    },
                    'capacidad_actual': 0
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 30,
                    'glosas_promedio_por_caso': 3.2,
                    'efectividad_glosas': 0.76,
                    'casos_completados_mes': 250
                }
            },
            {
                'username': 'admin.vargas',
                'nombres': 'Sandra Patricia',
                'apellidos': 'Vargas Ruiz',
                'documento': '67890123',
                'email': 'sandra.vargas@eps.co',
                'perfil': 'ADMINISTRATIVO',
                'especializacion': None,
                'registro_medico': None,
                'capacidad_maxima_dia': 22,
                'tipos_auditoria_permitidos': ['AMBULATORIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes': {'inicio': '07:00', 'fin': '15:00'},
                        'martes': {'inicio': '07:00', 'fin': '15:00'},
                        'miercoles': {'inicio': '07:00', 'fin': '15:00'},
                        'jueves': {'inicio': '07:00', 'fin': '15:00'},
                        'viernes': {'inicio': '07:00', 'fin': '15:00'}
                    },
                    'capacidad_actual': 0
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 20,
                    'glosas_promedio_por_caso': 2.1,
                    'efectividad_glosas': 0.88,
                    'casos_completados_mes': 320
                }
            }
        ]

        # Crear todos los auditores
        todos_auditores = auditores_medicos + auditores_administrativos
        auditores_creados = 0

        for auditor_data in todos_auditores:
            try:
                auditor, created = AuditorPerfil.objects.get_or_create(
                    username=auditor_data['username'],
                    defaults=auditor_data
                )
                
                if created:
                    auditores_creados += 1
                    self.stdout.write(
                        f'✅ Creado: {auditor.nombres} {auditor.apellidos} ({auditor.perfil})'
                    )
                else:
                    self.stdout.write(
                        f'⚠️  Ya existe: {auditor.nombres} {auditor.apellidos}'
                    )
                    
            except Exception as e:
                self.stderr.write(
                    f'❌ Error creando {auditor_data["username"]}: {str(e)}'
                )

        # Crear configuraciones del algoritmo
        self._crear_configuraciones_algoritmo()

        self.stdout.write(
            self.style.SUCCESS(f'\n🎉 Proceso completado:')
        )
        self.stdout.write(f'   📊 {auditores_creados} auditores creados')
        self.stdout.write(f'   👨‍⚕️ {len(auditores_medicos)} médicos')
        self.stdout.write(f'   👩‍💼 {len(auditores_administrativos)} administrativos')
        
        # Mostrar estadísticas
        total_auditores = AuditorPerfil.objects.count()
        activos = AuditorPerfil.objects.filter(activo=True).count()
        
        self.stdout.write(f'\n📈 Estado actual del sistema:')
        self.stdout.write(f'   Total auditores: {total_auditores}')
        self.stdout.write(f'   Auditores activos: {activos}')

    def _crear_configuraciones_algoritmo(self):
        """Crear configuraciones por defecto para el algoritmo"""
        
        configuraciones = [
            {
                'clave': 'balance_medico_administrativo',
                'valor': {
                    'peso_medico': 0.7,
                    'peso_administrativo': 0.3,
                    'descripcion': 'Balance entre auditores médicos y administrativos para casos ambulatorios'
                },
                'descripcion': 'Distribución de carga entre perfiles de auditor',
                'categoria': 'distribucion',
                'actualizado_por': 'sistema'
            },
            {
                'clave': 'factor_complejidad',
                'valor': {
                    'alta': 3.0,
                    'media': 2.0,
                    'baja': 1.0,
                    'descripcion': 'Multiplicadores de peso por complejidad del caso'
                },
                'descripcion': 'Factores de peso por complejidad de auditoría',
                'categoria': 'pesos',
                'actualizado_por': 'sistema'
            },
            {
                'clave': 'limites_carga',
                'valor': {
                    'carga_maxima_dia': 25,
                    'sobrecarga_permitida': 1.2,
                    'descripcion': 'Límites de asignación por auditor'
                },
                'descripcion': 'Límites de carga de trabajo por auditor',
                'categoria': 'limites',
                'actualizado_por': 'sistema'
            },
            {
                'clave': 'criterios_prioridad',
                'valor': {
                    'valor_minimo_alta': 1000000,
                    'valor_minimo_media': 500000,
                    'servicios_minimo_alta': 50,
                    'usuarios_minimo_alta': 20,
                    'descripcion': 'Criterios para determinar prioridad de casos'
                },
                'descripcion': 'Criterios de priorización automática',
                'categoria': 'priorizacion',
                'actualizado_por': 'sistema'
            }
        ]

        configuraciones_creadas = 0
        
        for config_data in configuraciones:
            try:
                config, created = ConfiguracionAlgoritmo.objects.get_or_create(
                    clave=config_data['clave'],
                    defaults=config_data
                )
                
                if created:
                    configuraciones_creadas += 1
                    
            except Exception as e:
                self.stderr.write(f'❌ Error creando configuración {config_data["clave"]}: {str(e)}')

        if configuraciones_creadas > 0:
            self.stdout.write(f'⚙️  {configuraciones_creadas} configuraciones del algoritmo creadas')