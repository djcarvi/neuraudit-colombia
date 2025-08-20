# -*- coding: utf-8 -*-
"""
Comando para crear usuarios de prueba del sistema NeurAudit
"""

from django.core.management.base import BaseCommand
from apps.authentication.models import User


class Command(BaseCommand):
    help = 'Crear usuarios de prueba para el sistema NeurAudit'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Creando usuarios de prueba para NeurAudit...')
        )

        # Usuario EPS Auditor
        try:
            user_eps = User.objects.get(email='test.eps@neuraudit.com')
            self.stdout.write('Usuario EPS ya existe')
        except User.DoesNotExist:
            user_eps = User.objects.create_user(
                email='test.eps@neuraudit.com',
                username='test.eps',
                password='simple123',
                first_name='Auditor',
                last_name='EPS',
                user_type='EPS',
                role='AUDITOR_MEDICO',
                status='AC'
            )
            self.stdout.write(
                self.style.SUCCESS('✅ Usuario EPS creado: test.eps@neuraudit.com / simple123')
            )

        # Usuario PSS Radicador
        try:
            user_pss = User.objects.get(email='test.pss@neuraudit.com')
            self.stdout.write('Usuario PSS ya existe')
        except User.DoesNotExist:
            user_pss = User.objects.create_user(
                email='test.pss@neuraudit.com',
                username='test.pss',
                password='simple123',
                first_name='Radicador',
                last_name='PSS',
                user_type='PSS',
                role='RADICADOR',
                status='AC',
                nit='123456789-0'
            )
            self.stdout.write(
                self.style.SUCCESS('✅ Usuario PSS creado: test.pss@neuraudit.com / simple123 / NIT: 123456789-0')
            )

        # Usuario Admin
        try:
            admin_user = User.objects.get(email='admin@neuraudit.com')
            self.stdout.write('Usuario Admin ya existe')
        except User.DoesNotExist:
            admin_user = User.objects.create_superuser(
                email='admin@neuraudit.com',
                username='admin',
                password='admin123',
                first_name='Super',
                last_name='Admin'
            )
            self.stdout.write(
                self.style.SUCCESS('✅ Usuario Admin creado: admin@neuraudit.com / admin123')
            )

        self.stdout.write(
            self.style.SUCCESS('\n🎯 CREDENCIALES DE PRUEBA:')
        )
        self.stdout.write('EPS: test.eps@neuraudit.com / simple123')
        self.stdout.write('PSS: test.pss@neuraudit.com / simple123 / NIT: 123456789-0')
        self.stdout.write('Admin: admin@neuraudit.com / admin123')
        
        self.stdout.write(
            self.style.SUCCESS('\n✅ Usuarios de prueba listos para usar')
        )