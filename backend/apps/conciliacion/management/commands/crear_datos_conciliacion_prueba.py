from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from bson import ObjectId
from apps.conciliacion.models import CasoConciliacion
from apps.auditoria.models_glosas import GlosaAplicada
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado
import json

class Command(BaseCommand):
    help = 'Crear datos de prueba para conciliación usando estructura igual a auditoría'

    def handle(self, *args, **options):
        self.stdout.write("🏥 Creando datos de prueba para conciliación...")
        
        # Primero verificar si existen glosas en auditoría
        glosas_auditoria = list(GlosaAplicada.objects.all()[:3])
        
        if not glosas_auditoria:
            self.stdout.write("⚠️  No hay glosas en auditoría. Creando datos base...")
            self.crear_datos_auditoria_base()
            glosas_auditoria = list(GlosaAplicada.objects.all()[:3])
        
        # Crear casos de conciliación usando datos reales de auditoría
        casos_creados = []
        
        for i, glosa in enumerate(glosas_auditoria):
            # Crear caso de conciliación con estructura NoSQL embebida
            caso_data = {
                'radicacion_id': glosa.radicacion_id,
                'numero_radicacion': glosa.numero_radicacion,
                'prestador_info': {
                    'nit': glosa.prestador_info.get('nit', f'900123456{i}'),
                    'razon_social': glosa.prestador_info.get('razon_social', f'Prestador Prueba {i+1}'),
                    'codigo_habilitacion': glosa.prestador_info.get('codigo_habilitacion', f'HAB{i+1}'),
                    'contacto_conciliacion': {
                        'nombre': f'Contacto Conciliación {i+1}',
                        'email': f'conciliacion{i+1}@prestador.com',
                        'telefono': f'3001234567{i}',
                        'cargo': 'Coordinador de Conciliación'
                    }
                },
                'facturas': [{
                    'factura_id': glosa.factura_id,
                    'numero_factura': glosa.numero_factura,
                    'fecha_factura': glosa.fecha_factura.isoformat(),
                    'valor_factura': float(glosa.valor_servicio) * 2,  # Valor aproximado
                    'servicios': [{
                        'servicio_id': glosa.servicio_id,
                        'codigo_cups': glosa.servicio_info.get('codigo_cups', f'890201{i}'),
                        'descripcion': glosa.servicio_info.get('descripcion', f'Servicio de prueba {i+1}'),
                        'tipo_servicio': glosa.tipo_servicio,
                        'valor_servicio': float(glosa.valor_servicio),
                        'glosas_aplicadas': [{
                            'glosa_id': str(glosa.id),
                            'codigo_glosa': glosa.codigo_glosa,
                            'descripcion_glosa': glosa.descripcion_glosa,
                            'valor_glosado': float(glosa.valor_glosado),
                            'auditor_info': glosa.auditor_info,
                            'fecha_aplicacion': glosa.fecha_aplicacion.isoformat(),
                            'observaciones_auditor': glosa.observaciones,
                            'estado_conciliacion': 'PENDIENTE',
                            'respuesta_prestador': {}  # Vacío inicialmente
                        }]
                    }]
                }],
                'estado': 'INICIADA',
                'conciliador_asignado': {
                    'user_id': '507f1f77bcf86cd799439011',
                    'username': f'conciliador{i+1}',
                    'nombre_completo': f'Conciliador Prueba {i+1}',
                    'email': f'conciliador{i+1}@eps.com'
                },
                'fecha_limite_respuesta': timezone.now() + timedelta(days=15),
                'configuracion_plazos': {
                    'dias_respuesta_pss': 15,
                    'dias_conciliacion': 30,
                    'dias_notificacion_previa': 3,
                    'prorroga_solicitada': False
                },
                'reuniones': [],
                'documentos': [],
                'trazabilidad': [{
                    'tipo_accion': 'CREACION',
                    'accion': f'Caso de conciliación creado para {glosa.numero_radicacion}',
                    'descripcion_detallada': 'Caso creado desde datos de auditoría para pruebas',
                    'usuario_info': {
                        'user_id': 'sistema',
                        'nombre': 'Sistema de Pruebas',
                        'rol': 'Sistema'
                    },
                    'fecha_hora': timezone.now().isoformat(),
                    'ip_address': '127.0.0.1',
                    'metadatos_adicionales': {
                        'origen': 'datos_prueba',
                        'glosas_incluidas': 1
                    }
                }]
            }
            
            # Crear documento en MongoDB
            caso = CasoConciliacion(**caso_data)
            caso.save()
            casos_creados.append(caso)
            
            self.stdout.write(f"✅ Caso creado: {caso.numero_radicacion} (ID: {caso.id})")
        
        # Crear algunos casos con respuestas PSS para pruebas
        if casos_creados:
            caso_con_respuesta = casos_creados[0]
            
            # Simular respuesta del prestador
            primera_glosa = caso_con_respuesta.facturas[0]['servicios'][0]['glosas_aplicadas'][0]
            respuesta_pss = {
                'tipo_respuesta': 'RE98',  # Parcialmente aceptada
                'valor_aceptado': float(primera_glosa['valor_glosado']) * 0.7,
                'valor_rechazado': float(primera_glosa['valor_glosado']) * 0.3,
                'justificacion': 'Aceptamos parcialmente la glosa por inconsistencias menores en la documentación',
                'usuario_prestador': {
                    'user_id': '507f1f77bcf86cd799439012',
                    'username': 'prestador1',
                    'nombre': 'Representante Prestador 1'
                },
                'fecha_respuesta': timezone.now().isoformat(),
                'soportes': ['respuesta_glosa_001.pdf', 'soporte_clinico.jpg']
            }
            
            # Actualizar la glosa con la respuesta
            caso_con_respuesta.facturas[0]['servicios'][0]['glosas_aplicadas'][0]['respuesta_prestador'] = respuesta_pss
            caso_con_respuesta.estado = 'EN_RESPUESTA'
            
            # Agregar a trazabilidad
            caso_con_respuesta.trazabilidad.append({
                'tipo_accion': 'RESPUESTA',
                'accion': f'Respuesta a glosa {primera_glosa["codigo_glosa"]}',
                'descripcion_detallada': 'Prestador respondió parcialmente aceptando la glosa',
                'usuario_info': respuesta_pss['usuario_prestador'],
                'fecha_hora': timezone.now().isoformat(),
                'ip_address': '192.168.1.100',
                'metadatos_adicionales': {
                    'tipo_respuesta': 'RE98',
                    'valor_aceptado': respuesta_pss['valor_aceptado']
                }
            })
            
            caso_con_respuesta.save()
            self.stdout.write(f"✅ Respuesta PSS agregada al caso: {caso_con_respuesta.numero_radicacion}")
        
        self.stdout.write(f"\n🎉 Creados {len(casos_creados)} casos de conciliación con estructura NoSQL")
        self.stdout.write("📋 Puedes probar con:")
        self.stdout.write("   python manage.py shell")
        self.stdout.write("   >>> from apps.conciliacion.models import CasoConciliacion")
        self.stdout.write("   >>> casos = CasoConciliacion.objects.all()")
        self.stdout.write("   >>> for caso in casos: print(caso)")
    
    def crear_datos_auditoria_base(self):
        """Crear datos base en auditoría si no existen"""
        self.stdout.write("🔧 Creando datos base en auditoría...")
        
        # Crear algunas glosas de prueba
        for i in range(3):
            glosa_data = {
                'radicacion_id': f'66a1234567890abcd{i:07d}',
                'numero_radicacion': f'RAD-2025-{1000 + i:06d}',
                'factura_id': f'66b1234567890abcd{i:07d}',
                'numero_factura': f'FAC-{2025}{1000 + i:04d}',
                'fecha_factura': timezone.now().date() - timedelta(days=30 + i),
                'servicio_id': f'66c1234567890abcd{i:07d}',
                'servicio_info': {
                    'codigo_cups': f'890201{i}',
                    'descripcion': f'Servicio de consulta especializada {i+1}',
                    'tipo_servicio': 'CONSULTA'
                },
                'prestador_info': {
                    'nit': f'900123456{i}',
                    'razon_social': f'IPS Prestador Prueba {i+1}',
                    'codigo_habilitacion': f'HAB{i+1:04d}'
                },
                'tipo_glosa': 'FA',
                'codigo_glosa': f'FA0{i+1:02d}01',
                'descripcion_glosa': f'Inconsistencia en facturación - Prueba {i+1}',
                'valor_servicio': 150000 + (i * 50000),
                'valor_glosado': 75000 + (i * 25000),
                'porcentaje_glosa': 50.0,
                'observaciones': f'Observaciones de auditoría para glosa de prueba {i+1}',
                'estado': 'APLICADA',
                'auditor_info': {
                    'user_id': f'507f1f77bcf86cd79943901{i}',
                    'username': f'auditor{i+1}',
                    'nombre_completo': f'Dr. Auditor Prueba {i+1}',
                    'rol': 'Auditor Médico'
                },
                'tipo_servicio': 'CONSULTA',
                'excede_valor_servicio': False
            }
            
            glosa = GlosaAplicada(**glosa_data)
            glosa.save()
            
        self.stdout.write("✅ Datos base de auditoría creados")