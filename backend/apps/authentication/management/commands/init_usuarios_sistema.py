# -*- coding: utf-8 -*-
"""
Comando para inicializar usuarios del sistema NeurAudit
"""

from django.core.management.base import BaseCommand
from django.conf import settings
from apps.authentication.services_auth_nosql import AuthenticationServiceNoSQL
import sys

class Command(BaseCommand):
    help = 'Inicializa usuarios de prueba para el sistema NeurAudit'
    
    def handle(self, *args, **kwargs):
        auth_service = AuthenticationServiceNoSQL()
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write('🏥 INICIALIZACIÓN DE USUARIOS - NEURAUDIT COLOMBIA')
        self.stdout.write('='*60 + '\n')
        
        usuarios_prueba = [
            # Super Administrador
            {
                'username': 'admin.superuser',
                'email': 'admin@neuraudit.co',
                'password': 'AdminNeuraudit2025',
                'tipo_usuario': 'EPS',
                'perfil': 'SUPERADMIN',
                'nombres': 'Administrador',
                'apellidos': 'Sistema',
                'tipo_documento': 'CC',
                'numero_documento': '1234567890',
                'telefono': '3001234567',
                'cargo': 'Administrador del Sistema'
            },
            # Coordinador de Auditoría
            {
                'username': 'maria.rodriguez',
                'email': 'maria.rodriguez@epsfamiliar.co',
                'password': 'Coordinador2025',
                'tipo_usuario': 'EPS',
                'perfil': 'COORDINADOR_AUDITORIA',
                'nombres': 'María',
                'apellidos': 'Rodríguez Pérez',
                'tipo_documento': 'CC',
                'numero_documento': '52123456',
                'telefono': '3012345678',
                'cargo': 'Coordinadora de Auditoría'
            },
            # Auditor Médico 1
            {
                'username': 'carlos.martinez',
                'email': 'carlos.martinez@epsfamiliar.co',
                'password': 'AuditorMed2025',
                'tipo_usuario': 'EPS',
                'perfil': 'AUDITOR_MEDICO',
                'nombres': 'Carlos',
                'apellidos': 'Martínez López',
                'tipo_documento': 'CC',
                'numero_documento': '79456789',
                'telefono': '3023456789',
                'cargo': 'Auditor Médico Senior'
            },
            # Auditor Médico 2
            {
                'username': 'laura.sanchez',
                'email': 'laura.sanchez@epsfamiliar.co',
                'password': 'AuditorMed2025',
                'tipo_usuario': 'EPS',
                'perfil': 'AUDITOR_MEDICO',
                'nombres': 'Laura',
                'apellidos': 'Sánchez Gómez',
                'tipo_documento': 'CC',
                'numero_documento': '52987654',
                'telefono': '3034567890',
                'cargo': 'Auditora Médica'
            },
            # Auditor Administrativo
            {
                'username': 'jorge.ramirez',
                'email': 'jorge.ramirez@epsfamiliar.co',
                'password': 'AuditorAdm2025',
                'tipo_usuario': 'EPS',
                'perfil': 'AUDITOR_ADMINISTRATIVO',
                'nombres': 'Jorge',
                'apellidos': 'Ramírez Castro',
                'tipo_documento': 'CC',
                'numero_documento': '80123789',
                'telefono': '3045678901',
                'cargo': 'Auditor Administrativo'
            },
            # Radicador PSS - Clínica San Rafael
            {
                'username': 'radicador.sanrafael',
                'email': 'facturacion@clinicasanrafael.co',
                'password': 'Radicador2025',
                'tipo_usuario': 'PSS',
                'perfil': 'RADICADOR',
                'nombres': 'Ana María',
                'apellidos': 'Gómez Torres',
                'tipo_documento': 'CC',
                'numero_documento': '1053456789',
                'telefono': '3056789012',
                'cargo': 'Auxiliar de Facturación',
                'nit': '900100200-1',
                'razon_social': 'Clínica San Rafael S.A.S',
                'codigo_habilitacion': '110010123456',
                'direccion': 'Calle 100 # 15-20',
                'ciudad': 'Bogotá',
                'departamento': 'Cundinamarca'
            },
            # Administrador PSS
            {
                'username': 'admin.sanrafael',
                'email': 'administracion@clinicasanrafael.co',
                'password': 'AdminPSS2025',
                'tipo_usuario': 'PSS',
                'perfil': 'ADMINISTRADOR_PSS',
                'nombres': 'Pedro',
                'apellidos': 'Jiménez Mora',
                'tipo_documento': 'CC',
                'numero_documento': '79876543',
                'telefono': '3067890123',
                'cargo': 'Director Administrativo',
                'nit': '900100200-1',
                'razon_social': 'Clínica San Rafael S.A.S',
                'codigo_habilitacion': '110010123456',
                'direccion': 'Calle 100 # 15-20',
                'ciudad': 'Bogotá',
                'departamento': 'Cundinamarca'
            },
            # Radicador PSS - Hospital Central
            {
                'username': 'radicador.hcentral',
                'email': 'facturacion@hospitalcentral.gov.co',
                'password': 'Radicador2025',
                'tipo_usuario': 'PSS',
                'perfil': 'RADICADOR',
                'nombres': 'Claudia',
                'apellidos': 'Méndez Ruiz',
                'tipo_documento': 'CC',
                'numero_documento': '52345678',
                'telefono': '3078901234',
                'cargo': 'Coordinadora de Facturación',
                'nit': '800200300-2',
                'razon_social': 'Hospital Central E.S.E',
                'codigo_habilitacion': '110010654321',
                'direccion': 'Carrera 20 # 45-60',
                'ciudad': 'Bogotá',
                'departamento': 'Cundinamarca'
            }
        ]
        
        usuarios_creados = 0
        usuarios_existentes = 0
        
        for usuario_data in usuarios_prueba:
            success, mensaje, user_id = auth_service.registrar_usuario(
                usuario_data, 
                creado_por='sistema_init'
            )
            
            if success:
                usuarios_creados += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Usuario creado: {usuario_data["username"]} '
                        f'({usuario_data["tipo_usuario"]} - {usuario_data["perfil"]})'
                    )
                )
            else:
                if "ya está en uso" in mensaje:
                    usuarios_existentes += 1
                    self.stdout.write(
                        self.style.WARNING(
                            f'⚠️  Usuario existente: {usuario_data["username"]}'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(
                            f'❌ Error con {usuario_data["username"]}: {mensaje}'
                        )
                    )
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write(f'📊 RESUMEN:')
        self.stdout.write(f'   - Usuarios creados: {usuarios_creados}')
        self.stdout.write(f'   - Usuarios existentes: {usuarios_existentes}')
        self.stdout.write(f'   - Total procesados: {len(usuarios_prueba)}')
        self.stdout.write('='*60 + '\n')
        
        if usuarios_creados > 0:
            self.stdout.write(self.style.SUCCESS('\n🎉 Inicialización completada!'))
            self.stdout.write('\n📋 CREDENCIALES DE PRUEBA:')
            self.stdout.write('─' * 50)
            self.stdout.write('USUARIOS EPS:')
            self.stdout.write('  🔸 admin.superuser / AdminNeuraudit2025')
            self.stdout.write('  🔸 maria.rodriguez / Coordinador2025')
            self.stdout.write('  🔸 carlos.martinez / AuditorMed2025')
            self.stdout.write('\nUSUARIOS PSS:')
            self.stdout.write('  🔸 radicador.sanrafael / Radicador2025 (NIT: 900100200-1)')
            self.stdout.write('  🔸 radicador.hcentral / Radicador2025 (NIT: 800200300-2)')
            self.stdout.write('─' * 50 + '\n')