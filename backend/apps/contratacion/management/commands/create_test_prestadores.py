# -*- coding: utf-8 -*-
"""
Comando para crear prestadores de prueba
"""

from django.core.management.base import BaseCommand
from apps.contratacion.models import Prestador
from apps.authentication.models import User


class Command(BaseCommand):
    help = 'Crear prestadores de prueba para testing'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('Creando prestadores de prueba...')
        )
        
        # Obtener usuario admin para created_by (ObjectIdAutoField approach)
        try:
            admin_user = User.objects.get(email='admin@neuraudit.com')
        except User.DoesNotExist:
            admin_user = User.objects.first()
            if not admin_user:
                self.stdout.write(
                    self.style.ERROR('No hay usuarios en el sistema. Ejecuta create_test_users primero.')
                )
                return

        prestadores_test = [
            {
                'nit': '123456789-0',
                'razon_social': 'Hospital San Rafael de Prueba',
                'nombre_comercial': 'Hospital San Rafael',
                'codigo_habilitacion': 'HSR001',
                'tipo_prestador': 'HOSPITAL',
                'nivel_atencion': 'III',
                'estado': 'ACTIVO'
            },
            {
                'nit': '900123456-1',
                'razon_social': 'Clínica La Esperanza S.A.S.',
                'nombre_comercial': 'Clínica La Esperanza',
                'codigo_habilitacion': 'CLE002',
                'tipo_prestador': 'CLINICA',
                'nivel_atencion': 'II',
                'estado': 'ACTIVO'
            },
            {
                'nit': '900234567-2',
                'razon_social': 'IPS Los Andes LTDA',
                'nombre_comercial': 'IPS Los Andes',
                'codigo_habilitacion': 'ILA003',
                'tipo_prestador': 'IPS',
                'nivel_atencion': 'I',
                'estado': 'ACTIVO'
            }
        ]

        creados = 0
        for prestador_data in prestadores_test:
            try:
                prestador = Prestador.objects.get(nit=prestador_data['nit'])
                self.stdout.write(f'Prestador {prestador_data["nit"]} ya existe')
            except Prestador.DoesNotExist:
                prestador = Prestador.objects.create(
                    nit=prestador_data['nit'],
                    razon_social=prestador_data['razon_social'],
                    nombre_comercial=prestador_data['nombre_comercial'],
                    codigo_habilitacion=prestador_data['codigo_habilitacion'],
                    tipo_prestador=prestador_data['tipo_prestador'],
                    nivel_atencion=prestador_data['nivel_atencion'],
                    estado=prestador_data['estado'],
                    telefono='123-456-7890',
                    email=f'contacto@{prestador_data["nit"].replace("-", "")}.com',
                    direccion='Calle 123 # 45-67',
                    ciudad='Bogotá',
                    departamento='Cundinamarca',
                    created_by=admin_user  # ObjectIdAutoField - referencia al usuario
                )
                creados += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Prestador creado: {prestador_data["nit"]} - {prestador_data["razon_social"]}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✅ {creados} prestadores de prueba creados')
        )
        
        total_prestadores = Prestador.objects.count()
        self.stdout.write(f'Total prestadores en sistema: {total_prestadores}')
        
        self.stdout.write(
            self.style.SUCCESS('\n🎯 PRESTADORES DISPONIBLES PARA PRUEBAS:')
        )
        for prestador in Prestador.objects.all():
            self.stdout.write(f'  - {prestador.nit}: {prestador.razon_social}')