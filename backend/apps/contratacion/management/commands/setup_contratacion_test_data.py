# -*- coding: utf-8 -*-
"""
Comando maestro para configurar todos los datos de prueba de contratación
"""

from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Configurar todos los datos de prueba del módulo de contratación'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('\n🚀 CONFIGURANDO DATOS DE PRUEBA DE CONTRATACIÓN\n')
        )
        
        # Verificar usuarios
        self.stdout.write('1️⃣ Verificando usuarios del sistema...')
        try:
            from apps.authentication.models import User
            if not User.objects.exists():
                self.stdout.write('   Creando usuarios de prueba...')
                call_command('create_test_users')
            else:
                self.stdout.write('   ✅ Usuarios ya existen')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'   ❌ Error con usuarios: {str(e)}')
            )
            return
        
        # Crear prestadores
        self.stdout.write('\n2️⃣ Creando prestadores de prueba...')
        try:
            call_command('create_test_prestadores')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'   ❌ Error creando prestadores: {str(e)}')
            )
        
        # Crear contratos y tarifarios
        self.stdout.write('\n3️⃣ Creando contratos y tarifarios de prueba...')
        try:
            call_command('create_test_contratos')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'   ❌ Error creando contratos: {str(e)}')
            )
        
        # Resumen final
        self.stdout.write(
            self.style.SUCCESS('\n✅ CONFIGURACIÓN COMPLETADA\n')
        )
        
        # Mostrar estadísticas
        from apps.contratacion.models import Prestador, Contrato, TarifariosCUPS, TarifariosMedicamentos
        
        self.stdout.write('📊 ESTADÍSTICAS FINALES:')
        self.stdout.write(f'   - Prestadores: {Prestador.objects.count()}')
        self.stdout.write(f'   - Contratos: {Contrato.objects.count()}')
        self.stdout.write(f'   - Tarifarios CUPS: {TarifariosCUPS.objects.count()}')
        self.stdout.write(f'   - Tarifarios Medicamentos: {TarifariosMedicamentos.objects.count()}')
        
        self.stdout.write(
            self.style.SUCCESS('\n🎯 Sistema listo para pruebas del módulo de contratación!')
        )