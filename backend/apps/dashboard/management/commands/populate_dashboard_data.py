# -*- coding: utf-8 -*-
"""
Comando para poblar datos realistas necesarios para el dashboard completo
Incluye trazabilidad, más glosas, y enriquecimiento de datos existentes
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
import random

from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_auditoria import AsignacionAuditoria
from apps.auditoria.models_glosas import GlosaAplicada
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado
from apps.conciliacion.models import CasoConciliacion
from apps.trazabilidad.models import RegistroTrazabilidad
from apps.authentication.models import User


class Command(BaseCommand):
    help = 'Pobla datos realistas para todas las secciones del dashboard'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear-trazabilidad',
            action='store_true',
            help='Elimina registros de trazabilidad existentes antes de poblar',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Iniciando población de datos para dashboard...'))
        
        # 1. Crear usuarios adicionales si faltan
        self.crear_usuarios_adicionales()
        
        # 2. Poblar trazabilidad (la más importante que falta)
        if options['clear_trazabilidad']:
            RegistroTrazabilidad.objects.all().delete()
            self.stdout.write('🗑️  Trazabilidad limpiada')
        self.poblar_trazabilidad()
        
        # 3. Crear más glosas para tener datos más ricos
        self.crear_glosas_adicionales()
        
        # 4. Crear más facturas y servicios
        self.crear_facturas_adicionales()
        
        # 5. Crear más casos de conciliación
        self.crear_casos_conciliacion_adicionales()
        
        self.stdout.write(self.style.SUCCESS('✅ Población de datos completada'))
    
    def crear_usuarios_adicionales(self):
        """Crear usuarios auditores adicionales si faltan"""
        self.stdout.write('👥 Verificando usuarios auditores...')
        
        # Auditores médicos
        auditores_medicos = [
            {'username': 'dra.garcia', 'first_name': 'María', 'last_name': 'García', 'email': 'maria.garcia@eps.com'},
            {'username': 'dr.perez', 'first_name': 'Juan', 'last_name': 'Pérez', 'email': 'juan.perez@eps.com'},
            {'username': 'dr.lopez', 'first_name': 'Carlos', 'last_name': 'López', 'email': 'carlos.lopez@eps.com'},
        ]
        
        for auditor_data in auditores_medicos:
            if not User.objects.filter(username=auditor_data['username']).exists():
                User.objects.create(
                    username=auditor_data['username'],
                    first_name=auditor_data['first_name'],
                    last_name=auditor_data['last_name'],
                    email=auditor_data['email'],
                    role='AUDITOR_MEDICO',
                    user_type='EPS',
                    status='ACTIVE'
                )
                self.stdout.write(f'  ✅ Creado auditor médico: {auditor_data["username"]}')
        
        # Auditores administrativos
        auditores_admin = [
            {'username': 'lic.rodriguez', 'first_name': 'Ana', 'last_name': 'Rodríguez', 'email': 'ana.rodriguez@eps.com'},
            {'username': 'lic.martinez', 'first_name': 'Laura', 'last_name': 'Martínez', 'email': 'laura.martinez@eps.com'},
        ]
        
        for auditor_data in auditores_admin:
            if not User.objects.filter(username=auditor_data['username']).exists():
                User.objects.create(
                    username=auditor_data['username'],
                    first_name=auditor_data['first_name'],
                    last_name=auditor_data['last_name'],
                    email=auditor_data['email'],
                    role='AUDITOR_ADMINISTRATIVO',
                    user_type='EPS',
                    status='ACTIVE'
                )
                self.stdout.write(f'  ✅ Creado auditor administrativo: {auditor_data["username"]}')
    
    def poblar_trazabilidad(self):
        """Crear registros de trazabilidad para actividad reciente"""
        self.stdout.write('📊 Poblando trazabilidad...')
        
        # Obtener datos necesarios
        radicaciones = RadicacionCuentaMedica.objects.all().order_by('-created_at')[:50]
        usuarios = User.objects.filter(user_type='EPS')
        
        if not radicaciones:
            self.stdout.write(self.style.ERROR('❌ No hay radicaciones para crear trazabilidad'))
            return
        
        acciones_por_estado = {
            'BORRADOR': [
                ('RADICACION', 'Cuenta médica creada en estado borrador'),
                ('DOCUMENTO_SUBIDO', 'Factura XML cargada correctamente'),
                ('DOCUMENTO_SUBIDO', 'Archivo RIPS JSON cargado y validado'),
            ],
            'RADICADA': [
                ('ESTADO_CAMBIADO', 'Estado cambiado de BORRADOR a RADICADA'),
                ('RADICACION', 'Radicación completada exitosamente'),
                ('DOCUMENTO_VALIDADO', 'Documentos validados según Resolución 2284'),
            ],
            'EN_AUDITORIA': [
                ('ASIGNACION_AUDITORIA', 'Cuenta asignada para auditoría médica'),
                ('ESTADO_CAMBIADO', 'Estado cambiado de RADICADA a EN_AUDITORIA'),
                ('AUDITORIA_MEDICA', 'Auditoría médica iniciada'),
            ],
            'AUDITADA': [
                ('AUDITORIA_MEDICA', 'Auditoría médica completada'),
                ('GLOSA_CREADA', 'Glosa aplicada durante auditoría'),
                ('ESTADO_CAMBIADO', 'Estado cambiado de EN_AUDITORIA a AUDITADA'),
            ],
            'DEVUELTA': [
                ('DEVOLUCION', 'Cuenta devuelta por inconsistencias'),
                ('ESTADO_CAMBIADO', 'Estado cambiado a DEVUELTA'),
            ],
            'PAGADA': [
                ('PAGO_AUTORIZADO', 'Pago autorizado por contabilidad'),
                ('PAGO_REALIZADO', 'Pago realizado exitosamente'),
                ('ESTADO_CAMBIADO', 'Estado cambiado a PAGADA'),
            ]
        }
        
        contador = 0
        for radicacion in radicaciones:
            estado = radicacion.estado
            acciones = acciones_por_estado.get(estado, [])
            
            # Crear registros de trazabilidad basados en el estado
            fecha_base = radicacion.created_at
            for i, (accion, descripcion) in enumerate(acciones):
                # Incrementar fecha para cada acción
                fecha_accion = fecha_base + timedelta(hours=i*2, minutes=random.randint(0, 59))
                
                # Seleccionar usuario aleatorio
                usuario = random.choice(usuarios) if usuarios else None
                
                # Crear registro (ajustado a campos reales del modelo)
                RegistroTrazabilidad.objects.create(
                    radicacion=radicacion,
                    accion=accion,
                    descripcion=f"{descripcion} - Radicación #{radicacion.numero_radicado}",
                    usuario=usuario,
                    metadatos={
                        'numero_radicado': radicacion.numero_radicado,
                        'prestador': radicacion.pss_nombre,
                        'valor': float(radicacion.factura_valor_total or 0),
                        'estado_anterior': 'BORRADOR' if i == 0 else estado,
                        'estado_nuevo': estado
                    },
                    ip_address=f"192.168.1.{random.randint(1, 254)}",
                    user_agent="Mozilla/5.0 Dashboard System"
                )
                contador += 1
        
        self.stdout.write(f'  ✅ Creados {contador} registros de trazabilidad')
    
    def crear_glosas_adicionales(self):
        """Crear más glosas para enriquecer los datos"""
        self.stdout.write('🚨 Creando glosas adicionales...')
        
        # Obtener radicaciones auditadas
        radicaciones_auditadas = RadicacionCuentaMedica.objects.filter(
            estado__in=['AUDITADA', 'EN_AUDITORIA']
        )[:20]
        
        auditores = User.objects.filter(role='AUDITOR_MEDICO')
        if not auditores:
            self.stdout.write(self.style.WARNING('⚠️  No hay auditores médicos'))
            return
        
        # Códigos de glosa más comunes
        glosas_comunes = [
            ('FA', 'FA0101', 'Diferencia en cantidad de servicios facturados vs prestados'),
            ('TA', 'TA0201', 'Tarifa facturada mayor a la contratada'),
            ('SO', 'SO0301', 'Falta epicrisis o resumen de atención'),
            ('AU', 'AU0401', 'Servicio no autorizado previamente'),
            ('CO', 'CO0501', 'Servicio no cubierto por el plan de beneficios'),
            ('CL', 'CL0601', 'No se evidencia pertinencia médica del procedimiento'),
        ]
        
        contador = 0
        for radicacion in radicaciones_auditadas:
            # Crear 1-3 glosas por radicación
            num_glosas = random.randint(1, 3)
            
            for _ in range(num_glosas):
                tipo, codigo, descripcion = random.choice(glosas_comunes)
                auditor = random.choice(auditores)
                
                # Valores de la glosa
                valor_servicio = float(radicacion.factura_valor_total or 0) / 10  # Aproximado
                porcentaje_glosa = random.uniform(0.1, 0.3)  # 10-30% de glosa
                valor_glosado = valor_servicio * porcentaje_glosa
                
                GlosaAplicada.objects.create(
                    radicacion_id=str(radicacion.id),
                    numero_radicacion=radicacion.numero_radicado,
                    factura_id=str(radicacion.id),  # Simplificado
                    numero_factura=radicacion.factura_numero,
                    fecha_factura=radicacion.factura_fecha_expedicion.date() if radicacion.factura_fecha_expedicion else timezone.now().date(),
                    servicio_id=str(radicacion.id),  # Simplificado
                    servicio_info={
                        'codigo': f'SRV{random.randint(1000, 9999)}',
                        'descripcion': 'Servicio médico general',
                        'tipo_servicio': random.choice(['CONSULTA', 'PROCEDIMIENTO', 'MEDICAMENTO']),
                        'valor_original': float(valor_servicio)
                    },
                    prestador_info={
                        'nit': radicacion.pss_nit,
                        'razon_social': radicacion.pss_nombre,
                        'codigo_habilitacion': f'HAB{random.randint(1000, 9999)}'
                    },
                    tipo_glosa=tipo,
                    codigo_glosa=codigo,
                    descripcion_glosa=descripcion,
                    valor_servicio=valor_servicio,
                    valor_glosado=valor_glosado,
                    porcentaje_glosa=porcentaje_glosa * 100,
                    auditor_info={
                        'id': str(auditor.id),
                        'nombre': f"{auditor.first_name} {auditor.last_name}".strip() or auditor.username,
                        'rol': auditor.role
                    },
                    estado='APLICADA',
                    fecha_aplicacion=timezone.now() - timedelta(days=random.randint(1, 30))
                )
                contador += 1
        
        self.stdout.write(f'  ✅ Creadas {contador} glosas adicionales')
    
    def crear_facturas_adicionales(self):
        """Crear más facturas y servicios para enriquecer datos"""
        self.stdout.write('📄 Creando facturas y servicios adicionales...')
        
        # Solo crear para radicaciones que no tienen facturas
        radicaciones_sin_factura = RadicacionCuentaMedica.objects.filter(
            estado__in=['EN_AUDITORIA', 'AUDITADA']
        ).exclude(
            id__in=FacturaRadicada.objects.values_list('radicacion_id', flat=True)
        )[:10]
        
        tipos_servicio = [
            ('CONSULTA', 'Consulta médica especializada', 80000, 150000),
            ('PROCEDIMIENTO', 'Procedimiento diagnóstico', 200000, 800000),
            ('MEDICAMENTO', 'Suministro de medicamentos', 50000, 500000),
            ('URGENCIAS', 'Atención de urgencias', 150000, 600000),
            ('HOSPITALIZACION', 'Día cama hospitalización', 300000, 800000),
        ]
        
        contador_facturas = 0
        contador_servicios = 0
        
        for radicacion in radicaciones_sin_factura:
            # Crear factura
            factura = FacturaRadicada.objects.create(
                radicacion_id=str(radicacion.id),  # CharField espera string de ObjectId
                numero_factura=radicacion.factura_numero,
                fecha_expedicion=radicacion.factura_fecha_expedicion.date() if radicacion.factura_fecha_expedicion else timezone.now().date(),
                radicacion_info={
                    'numero_radicacion': radicacion.numero_radicado,
                    'fecha_radicacion': radicacion.fecha_radicacion.isoformat() if radicacion.fecha_radicacion else radicacion.created_at.isoformat(),
                    'prestador_nombre': radicacion.pss_nombre,
                    'prestador_nit': radicacion.pss_nit
                },
                valor_total=float(radicacion.factura_valor_total or 0),
                estado_auditoria='EN_REVISION' if radicacion.estado == 'EN_AUDITORIA' else 'APROBADA' if radicacion.estado == 'AUDITADA' else 'PENDIENTE'
            )
            contador_facturas += 1
            
            # Crear servicios para la factura
            num_servicios = random.randint(3, 8)
            valor_acumulado = 0
            
            for i in range(num_servicios):
                tipo, descripcion, min_valor, max_valor = random.choice(tipos_servicio)
                valor_unitario = random.randint(min_valor, max_valor)
                cantidad = random.randint(1, 3)
                valor_total = valor_unitario * cantidad
                
                fecha_inicio = radicacion.factura_fecha_expedicion - timedelta(days=random.randint(1, 30)) if radicacion.factura_fecha_expedicion else timezone.now() - timedelta(days=random.randint(1, 30))
                
                ServicioFacturado.objects.create(
                    factura_id=str(factura.id),
                    factura_info={
                        'numero_factura': factura.numero_factura,
                        'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                        'valor_total': float(factura.valor_total)
                    },
                    codigo=f'{tipo[:3]}{random.randint(1000, 9999)}',
                    descripcion=f'{descripcion} - Item {i+1}',
                    tipo_servicio=tipo,
                    cantidad=cantidad,
                    valor_unitario=valor_unitario,
                    valor_total=valor_total,
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_inicio + timedelta(hours=random.randint(1, 24)) if tipo in ['URGENCIAS', 'HOSPITALIZACION'] else None
                )
                contador_servicios += 1
                valor_acumulado += valor_total
            
            # Actualizar contadores de la factura según tipos de servicios creados
            consultas = ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='CONSULTA').count()
            procedimientos = ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='PROCEDIMIENTO').count()
            medicamentos = ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='MEDICAMENTO').count()
            urgencias = ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='URGENCIAS').count()
            hospitalizaciones = ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='HOSPITALIZACION').count()
            
            # Calcular valores por tipo
            valor_consultas = sum(float(s.valor_total or 0) for s in ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='CONSULTA'))
            valor_procedimientos = sum(float(s.valor_total or 0) for s in ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='PROCEDIMIENTO'))
            valor_medicamentos = sum(float(s.valor_total or 0) for s in ServicioFacturado.objects.filter(factura_id=str(factura.id), tipo_servicio='MEDICAMENTO'))
            
            # Actualizar factura
            factura.total_consultas = consultas
            factura.total_procedimientos = procedimientos
            factura.total_medicamentos = medicamentos
            factura.total_urgencias = urgencias
            factura.total_hospitalizaciones = hospitalizaciones
            factura.valor_consultas = valor_consultas
            factura.valor_procedimientos = valor_procedimientos
            factura.valor_medicamentos = valor_medicamentos
            factura.save()
        
        self.stdout.write(f'  ✅ Creadas {contador_facturas} facturas con {contador_servicios} servicios')
    
    def crear_casos_conciliacion_adicionales(self):
        """Crear más casos de conciliación"""
        self.stdout.write('🤝 Creando casos de conciliación adicionales...')
        
        # Obtener radicaciones con glosas
        radicaciones_con_glosas = RadicacionCuentaMedica.objects.filter(
            estado='AUDITADA',
            id__in=GlosaAplicada.objects.values_list('radicacion_id', flat=True).distinct()
        ).exclude(
            id__in=CasoConciliacion.objects.values_list('radicacion_id', flat=True)
        )[:5]
        
        conciliadores = User.objects.filter(role='CONCILIADOR')
        if not conciliadores:
            # Crear un conciliador si no existe
            conciliador = User.objects.create(
                username='conciliador.eps',
                first_name='Pedro',
                last_name='Sánchez',
                email='pedro.sanchez@eps.com',
                role='CONCILIADOR',
                user_type='EPS',
                status='ACTIVE'
            )
            conciliadores = [conciliador]
            self.stdout.write('  ✅ Creado usuario conciliador')
        
        estados_caso = ['INICIADA', 'EN_RESPUESTA', 'EN_CONCILIACION', 'CONCILIADA']
        
        contador = 0
        for radicacion in radicaciones_con_glosas:
            # Obtener glosas de esta radicación
            glosas = GlosaAplicada.objects.filter(radicacion_id=str(radicacion.id))
            
            total_glosado = sum(float(g.valor_glosado) for g in glosas)
            
            # Crear caso
            caso = CasoConciliacion.objects.create(
                radicacion_id=str(radicacion.id),
                numero_radicacion=radicacion.numero_radicado,
                prestador_info={
                    'nit': radicacion.pss_nit,
                    'razon_social': radicacion.pss_nombre,
                    'representante': 'Juan Representante PSS',
                    'email': 'contacto@pss.com',
                    'telefono': '3001234567'
                },
                facturas=[{
                    'numero': radicacion.factura_numero,
                    'fecha': radicacion.factura_fecha_expedicion.isoformat() if radicacion.factura_fecha_expedicion else timezone.now().isoformat(),
                    'valor': float(radicacion.factura_valor_total or 0)
                }],
                resumen_financiero={
                    'valor_facturado': float(radicacion.factura_valor_total or 0),
                    'valor_glosado': total_glosado,
                    'valor_aceptado_pss': total_glosado * 0.3,  # PSS acepta 30%
                    'valor_en_disputa': total_glosado * 0.7,
                    'valor_conciliado': 0 if estados_caso[contador % len(estados_caso)] != 'CONCILIADA' else total_glosado * 0.5
                },
                estado=estados_caso[contador % len(estados_caso)],
                conciliador_asignado={
                    'id': str(conciliadores[0].id),
                    'nombre': f"{conciliadores[0].first_name} {conciliadores[0].last_name}",
                    'email': conciliadores[0].email
                },
                fecha_limite_respuesta=timezone.now() + timedelta(days=5),
                trazabilidad=[{
                    'fecha': timezone.now().isoformat(),
                    'accion': 'CASO_CREADO',
                    'descripcion': 'Caso de conciliación creado automáticamente',
                    'usuario': 'Sistema'
                }]
            )
            contador += 1
        
        self.stdout.write(f'  ✅ Creados {contador} casos de conciliación adicionales')