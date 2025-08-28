# -*- coding: utf-8 -*-
"""
Comando para inicializar auditores de prueba en MongoDB
NoSQL puro - Sin modelos Django
"""

from django.core.management.base import BaseCommand
from pymongo import MongoClient
from django.conf import settings
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Inicializa auditores de prueba en MongoDB'

    def handle(self, *args, **options):
        """Ejecutar comando"""
        
        # Conexión MongoDB pura
        client = MongoClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_DATABASE]
        auditores_collection = db.auditores_perfiles
        
        # Limpiar colección si existe
        if auditores_collection.count_documents({}) > 0:
            self.stdout.write(self.style.WARNING('Limpiando auditores existentes...'))
            auditores_collection.delete_many({})
        
        # Datos de auditores de prueba
        auditores_data = [
            {
                'username': 'auditor.medico1',
                'nombres': 'Carlos',
                'apellidos': 'Rodriguez Mendez',
                'documento': '1234567890',
                'email': 'carlos.rodriguez@epsfamiliar.com.co',
                'perfil': 'MEDICO',
                'especializacion': 'Medicina Interna',
                'registro_medico': 'RM123456',
                'capacidad_maxima_dia': 15,
                'tipos_auditoria_permitidos': ['AMBULATORIO', 'HOSPITALARIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes_viernes': '08:00-17:00',
                        'sabado': 'no_disponible'
                    },
                    'capacidad_actual': 5
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 45,  # minutos
                    'glosas_promedio_por_caso': 2.5,
                    'efectividad_glosas': 0.85,  # 85%
                    'casos_completados_mes': 120
                },
                'fecha_ingreso': datetime.now(),
                'activo': True
            },
            {
                'username': 'auditor.medico2',
                'nombres': 'Ana Maria',
                'apellidos': 'Gutierrez Lopez',
                'documento': '0987654321',
                'email': 'ana.gutierrez@epsfamiliar.com.co',
                'perfil': 'MEDICO',
                'especializacion': 'Cirugía General',
                'registro_medico': 'RM654321',
                'capacidad_maxima_dia': 12,
                'tipos_auditoria_permitidos': ['AMBULATORIO', 'HOSPITALARIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes_viernes': '07:00-16:00',
                        'sabado': '08:00-12:00'
                    },
                    'capacidad_actual': 8
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 50,
                    'glosas_promedio_por_caso': 3.2,
                    'efectividad_glosas': 0.92,
                    'casos_completados_mes': 95
                },
                'fecha_ingreso': datetime.now(),
                'activo': True
            },
            {
                'username': 'auditor.admin1',
                'nombres': 'Pedro',
                'apellidos': 'Sanchez Ruiz',
                'documento': '1122334455',
                'email': 'pedro.sanchez@epsfamiliar.com.co',
                'perfil': 'ADMINISTRATIVO',
                'especializacion': None,
                'registro_medico': None,
                'capacidad_maxima_dia': 20,
                'tipos_auditoria_permitidos': ['AMBULATORIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes_viernes': '08:00-18:00',
                        'sabado': 'no_disponible'
                    },
                    'capacidad_actual': 12
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 30,
                    'glosas_promedio_por_caso': 1.8,
                    'efectividad_glosas': 0.78,
                    'casos_completados_mes': 150
                },
                'fecha_ingreso': datetime.now(),
                'activo': True
            },
            {
                'username': 'auditor.admin2',
                'nombres': 'Lucia',
                'apellidos': 'Martinez Diaz',
                'documento': '5544332211',
                'email': 'lucia.martinez@epsfamiliar.com.co',
                'perfil': 'ADMINISTRATIVO',
                'especializacion': None,
                'registro_medico': None,
                'capacidad_maxima_dia': 25,
                'tipos_auditoria_permitidos': ['AMBULATORIO'],
                'disponibilidad': {
                    'activo': True,
                    'vacaciones': False,
                    'horarios': {
                        'lunes_viernes': '09:00-18:00',
                        'sabado': 'no_disponible'
                    },
                    'capacidad_actual': 18
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 25,
                    'glosas_promedio_por_caso': 1.5,
                    'efectividad_glosas': 0.82,
                    'casos_completados_mes': 180
                },
                'fecha_ingreso': datetime.now(),
                'activo': True
            },
            {
                'username': 'auditor.medico3',
                'nombres': 'Roberto',
                'apellidos': 'Hernandez Silva',
                'documento': '9988776655',
                'email': 'roberto.hernandez@epsfamiliar.com.co',
                'perfil': 'MEDICO',
                'especializacion': 'Pediatría',
                'registro_medico': 'RM789012',
                'capacidad_maxima_dia': 10,
                'tipos_auditoria_permitidos': ['AMBULATORIO', 'HOSPITALARIO'],
                'disponibilidad': {
                    'activo': False,  # En vacaciones
                    'vacaciones': True,
                    'horarios': {
                        'lunes_viernes': '08:00-17:00',
                        'sabado': 'no_disponible'
                    },
                    'capacidad_actual': 0
                },
                'metricas_historicas': {
                    'tiempo_promedio_auditoria': 40,
                    'glosas_promedio_por_caso': 2.0,
                    'efectividad_glosas': 0.88,
                    'casos_completados_mes': 100
                },
                'fecha_ingreso': datetime.now(),
                'activo': True
            }
        ]
        
        # Insertar auditores
        self.stdout.write('Insertando auditores de prueba...')
        resultado = auditores_collection.insert_many(auditores_data)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'✓ {len(resultado.inserted_ids)} auditores creados exitosamente'
            )
        )
        
        # Mostrar resumen
        self.stdout.write('\nResumen de auditores creados:')
        for auditor in auditores_data:
            disponible = 'Disponible' if auditor['disponibilidad']['activo'] else 'No disponible'
            self.stdout.write(
                f"  - {auditor['nombres']} {auditor['apellidos']} "
                f"({auditor['perfil']}) - {disponible}"
            )
        
        self.stdout.write(self.style.SUCCESS('\n✅ Inicialización completa'))