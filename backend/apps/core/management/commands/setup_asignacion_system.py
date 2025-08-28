# -*- coding: utf-8 -*-
# apps/core/management/commands/setup_asignacion_system.py

"""
Comando maestro para setup completo del sistema de asignación automática
Inicializa MongoDB, modelos y datos de prueba
"""

from django.core.management.base import BaseCommand
from django.core.management import call_command
from pymongo import MongoClient
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Setup completo del sistema de asignación automática de auditorías médicas'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset-data',
            action='store_true',
            help='Resetear todos los datos existentes',
        )
        parser.add_argument(
            '--skip-migrations',
            action='store_true',
            help='Saltar ejecución de migraciones',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🚀 SETUP SISTEMA DE ASIGNACIÓN AUTOMÁTICA')
        )
        self.stdout.write('=' * 60)

        try:
            # 1. Verificar conexión MongoDB
            self._verificar_mongodb()
            
            # 2. Ejecutar migraciones
            if not options['skip_migrations']:
                self._ejecutar_migraciones()
            
            # 3. Crear índices MongoDB específicos
            self._crear_indices_mongodb()
            
            # 4. Crear auditores de prueba
            self._crear_datos_prueba(options['reset_data'])
            
            # 5. Verificar integridad del sistema
            self._verificar_sistema()
            
            self.stdout.write('=' * 60)
            self.stdout.write(
                self.style.SUCCESS('✅ SISTEMA DE ASIGNACIÓN CONFIGURADO EXITOSAMENTE')
            )
            
            # Mostrar información de acceso
            self._mostrar_info_acceso()
            
        except Exception as e:
            self.stderr.write(f'❌ Error durante setup: {str(e)}')
            raise

    def _verificar_mongodb(self):
        """Verificar conectividad con MongoDB"""
        self.stdout.write('🔍 Verificando conexión MongoDB...')
        
        try:
            client = MongoClient(settings.MONGODB_URI)
            db = client[settings.MONGODB_DATABASE]
            
            # Test de conexión
            result = db.command('ping')
            if result['ok'] == 1:
                self.stdout.write('   ✅ Conexión MongoDB exitosa')
            
            # Verificar colecciones existentes
            collections = db.list_collection_names()
            self.stdout.write(f'   📊 Colecciones existentes: {len(collections)}')
            
            client.close()
            
        except Exception as e:
            self.stderr.write(f'   ❌ Error conectando a MongoDB: {str(e)}')
            raise

    def _ejecutar_migraciones(self):
        """Ejecutar migraciones Django para los modelos"""
        self.stdout.write('🔄 Ejecutando migraciones...')
        
        try:
            # Crear migraciones para core app
            call_command('makemigrations', 'core', verbosity=1)
            self.stdout.write('   ✅ Migraciones creadas para app core')
            
            # Aplicar migraciones
            call_command('migrate', verbosity=1)
            self.stdout.write('   ✅ Migraciones aplicadas exitosamente')
            
        except Exception as e:
            self.stderr.write(f'   ❌ Error en migraciones: {str(e)}')
            raise

    def _crear_indices_mongodb(self):
        """Crear índices MongoDB específicos para rendimiento"""
        self.stdout.write('🔧 Creando índices MongoDB optimizados...')
        
        try:
            client = MongoClient(settings.MONGODB_URI)
            db = client[settings.MONGODB_DATABASE]
            
            # Índices para auditores_perfiles
            db.auditores_perfiles.create_index([("perfil", 1), ("activo", 1)])
            db.auditores_perfiles.create_index([("disponibilidad.activo", 1)])
            
            # Índices para asignaciones_automaticas
            db.asignaciones_automaticas.create_index([("estado", 1), ("fecha_propuesta", -1)])
            db.asignaciones_automaticas.create_index([("coordinador_id", 1)])
            
            # Índices para asignaciones_auditoria
            db.asignaciones_auditoria.create_index([("auditor_username", 1), ("estado", 1)])
            db.asignaciones_auditoria.create_index([("fecha_asignacion", -1)])
            db.asignaciones_auditoria.create_index([("tipo_auditoria", 1), ("prioridad", 1)])
            
            # Índices para trazabilidad
            db.trazabilidad_asignaciones.create_index([("timestamp", -1)])
            db.trazabilidad_asignaciones.create_index([("usuario", 1), ("timestamp", -1)])
            
            self.stdout.write('   ✅ Índices MongoDB creados exitosamente')
            
            client.close()
            
        except Exception as e:
            self.stderr.write(f'   ❌ Error creando índices: {str(e)}')
            raise

    def _crear_datos_prueba(self, reset_data):
        """Crear datos de prueba para el sistema"""
        self.stdout.write('👥 Configurando datos de prueba...')
        
        try:
            # Crear auditores de prueba
            if reset_data:
                call_command('create_test_auditores', '--delete-existing')
            else:
                call_command('create_test_auditores')
                
            self.stdout.write('   ✅ Auditores de prueba configurados')
            
        except Exception as e:
            self.stderr.write(f'   ❌ Error creando datos de prueba: {str(e)}')
            raise

    def _verificar_sistema(self):
        """Verificar integridad del sistema configurado"""
        self.stdout.write('🔍 Verificando integridad del sistema...')
        
        try:
            from apps.core.models import AuditorPerfil, ConfiguracionAlgoritmo
            from apps.core.services.asignacion_service import AsignacionService
            
            # Verificar auditores
            total_auditores = AuditorPerfil.objects.count()
            medicos = AuditorPerfil.objects.filter(perfil='MEDICO').count()
            administrativos = AuditorPerfil.objects.filter(perfil='ADMINISTRATIVO').count()
            
            # Verificar configuraciones
            total_configs = ConfiguracionAlgoritmo.objects.count()
            
            # Test básico del servicio
            service = AsignacionService()
            auditores_disponibles = service.obtener_carga_auditores()
            
            self.stdout.write('   ✅ Verificaciones completadas:')
            self.stdout.write(f'      👨‍⚕️ Auditores médicos: {medicos}')
            self.stdout.write(f'      👩‍💼 Auditores administrativos: {administrativos}')
            self.stdout.write(f'      ⚙️  Configuraciones: {total_configs}')
            self.stdout.write(f'      🟢 Auditores disponibles: {len(auditores_disponibles)}')
            
        except Exception as e:
            self.stderr.write(f'   ❌ Error en verificación: {str(e)}')
            raise

    def _mostrar_info_acceso(self):
        """Mostrar información de acceso y próximos pasos"""
        self.stdout.write('\n📋 INFORMACIÓN DEL SISTEMA:')
        self.stdout.write('-' * 40)
        
        self.stdout.write('\n🔗 ENDPOINTS PRINCIPALES:')
        self.stdout.write('   Dashboard: /neuraudit/asignacion/dashboard')
        self.stdout.write('   Manual:    /neuraudit/asignacion/manual')
        
        self.stdout.write('\n🧪 TESTING:')
        self.stdout.write('   Para probar el algoritmo de asignación:')
        self.stdout.write('   1. Crear radicaciones de prueba con estado VALIDADO')
        self.stdout.write('   2. Ejecutar servicio AsignacionService.generar_propuesta_asignacion()')
        self.stdout.write('   3. Aprobar propuesta con coordinador de prueba')
        
        self.stdout.write('\n⚡ COMANDOS ÚTILES:')
        self.stdout.write('   Crear más auditores: python manage.py create_test_auditores')
        self.stdout.write('   Reset completo:      python manage.py setup_asignacion_system --reset-data')
        
        self.stdout.write('\n🔧 CONFIGURACIÓN ALGORITMO:')
        self.stdout.write('   Las configuraciones se pueden ajustar desde ConfiguracionAlgoritmo')
        self.stdout.write('   Métricas disponibles en MetricaRendimiento')
        
        self.stdout.write('\n' + '=' * 60)