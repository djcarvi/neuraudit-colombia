# -*- coding: utf-8 -*-
"""
Comando para poblar datos de actividad semanal de auditores
Para el gráfico radar de "Visitors by Device" -> "Actividad por Auditor"
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random

from apps.trazabilidad.models import RegistroTrazabilidad
from apps.authentication.models import User
from apps.radicacion.models import RadicacionCuentaMedica


class Command(BaseCommand):
    help = 'Poblar datos de actividad semanal para el gráfico radar del dashboard'

    def handle(self, *args, **options):
        self.stdout.write('Poblando datos de actividad semanal...')
        
        # Obtener una radicación para asociar (o crear una de prueba)
        radicacion = RadicacionCuentaMedica.objects.first()
        if not radicacion:
            self.stdout.write(self.style.WARNING('No hay radicaciones. Creando una de prueba...'))
            from apps.authentication.models import User
            user_pss = User.objects.filter(is_pss_user=True).first()
            if not user_pss:
                self.stdout.write(self.style.ERROR('No hay usuarios PSS. Ejecute create_test_users primero.'))
                return
            
            radicacion = RadicacionCuentaMedica.objects.create(
                numero_radicado='TEST-RAD-001',
                pss_nit='123456789-0',
                pss_nombre='CLINICA DE PRUEBA',
                factura_numero='TEST-001',
                factura_fecha_expedicion=timezone.now(),
                factura_valor_total=1000000,
                estado='RADICADA',
                usuario_radicador=user_pss
            )
        
        # Obtener usuarios por rol
        auditores_medicos = list(User.objects.filter(role='AUDITOR_MEDICO'))
        auditores_admin = list(User.objects.filter(role='AUDITOR_ADMINISTRATIVO'))
        coordinadores = list(User.objects.filter(role='COORDINADOR'))
        
        # Acciones por tipo de usuario
        acciones_auditor_medico = [
            'AUDITORIA_MEDICA',
            'GLOSA_CREADA',
            'REVISION_CLINICA',
            'ANALISIS_PERTINENCIA'
        ]
        
        acciones_auditor_admin = [
            'REVISION_ADMINISTRATIVA',
            'VERIFICACION_SOPORTES',
            'VALIDACION_TARIFAS',
            'REVISION_CONTRATOS'
        ]
        
        acciones_coordinador = [
            'ASIGNACION_AUDITORIA',
            'SUPERVISION_PROCESO',
            'REVISION_FINAL',
            'APROBACION_GLOSAS'
        ]
        
        # Generar actividad para los últimos 7 días
        hoy = timezone.now()
        
        for dia in range(7):
            fecha = hoy - timedelta(days=dia)
            
            # Actividad para auditores médicos (más alta)
            for _ in range(random.randint(15, 25)):
                if auditores_medicos:
                    auditor = random.choice(auditores_medicos)
                    RegistroTrazabilidad.objects.create(
                        radicacion=radicacion,
                        usuario=auditor,
                        accion=random.choice(acciones_auditor_medico),
                        descripcion=f"Actividad de auditoría médica del día {fecha.strftime('%A')}",
                        timestamp=fecha.replace(
                            hour=random.randint(8, 18),
                            minute=random.randint(0, 59)
                        ),
                        metadatos={
                            'tipo_actividad': 'auditoria_medica',
                            'dia_semana': fecha.weekday()
                        }
                    )
            
            # Actividad para auditores administrativos (media)
            for _ in range(random.randint(10, 20)):
                if auditores_admin:
                    auditor = random.choice(auditores_admin)
                    RegistroTrazabilidad.objects.create(
                        radicacion=radicacion,
                        usuario=auditor,
                        accion=random.choice(acciones_auditor_admin),
                        descripcion=f"Actividad administrativa del día {fecha.strftime('%A')}",
                        timestamp=fecha.replace(
                            hour=random.randint(8, 18),
                            minute=random.randint(0, 59)
                        ),
                        metadatos={
                            'tipo_actividad': 'auditoria_administrativa',
                            'dia_semana': fecha.weekday()
                        }
                    )
            
            # Actividad para coordinadores (más baja)
            for _ in range(random.randint(5, 15)):
                if coordinadores:
                    coordinador = random.choice(coordinadores)
                    RegistroTrazabilidad.objects.create(
                        radicacion=radicacion,
                        usuario=coordinador,
                        accion=random.choice(acciones_coordinador),
                        descripcion=f"Actividad de coordinación del día {fecha.strftime('%A')}",
                        timestamp=fecha.replace(
                            hour=random.randint(8, 18),
                            minute=random.randint(0, 59)
                        ),
                        metadatos={
                            'tipo_actividad': 'coordinacion',
                            'dia_semana': fecha.weekday()
                        }
                    )
        
        self.stdout.write(self.style.SUCCESS(
            'Datos de actividad semanal poblados exitosamente'
        ))