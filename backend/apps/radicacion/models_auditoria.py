# -*- coding: utf-8 -*-
# apps/radicacion/models_auditoria.py

"""
Modelos para proceso de auditoría según Resolución 2284:
1. Radicación → 2. Pre-devolución automática → 3. Revisión humana
4. Pre-glosas automáticas → 5. Auditoría humana
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel
from django_mongodb_backend.models import EmbeddedModel

from datetime import datetime
from decimal import Decimal

class PreDevolucion(models.Model):
    """
    Pre-devoluciones automáticas generadas por el engine
    Requieren aprobación/rechazo humano antes de ser oficiales
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia a la transacción
    transaccion_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    prestador_nit = models.CharField(max_length=20, db_index=True)
    
    # Causal de pre-devolución
    codigo_causal = models.CharField(max_length=10, db_index=True)  # DE16, DE44, DE50, DE56
    descripcion_causal = models.TextField()
    valor_afectado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Evidencia automática encontrada
    evidencia_automatica = models.JSONField(default=dict)  # Detalles técnicos
    fundamentacion_tecnica = models.TextField()  # Explicación para el revisor
    
    # Estado de revisión humana
    estado = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE_REVISION', 'Pendiente Revisión'),
            ('APROBADA', 'Aprobada por Revisor'),
            ('RECHAZADA', 'Rechazada por Revisor'),
            ('MODIFICADA', 'Modificada por Revisor')
        ],
        default='PENDIENTE_REVISION',
        db_index=True
    )
    
    # Revisión humana
    revisado_por = models.CharField(max_length=100, blank=True, null=True)
    fecha_revision = models.DateTimeField(blank=True, null=True)
    observaciones_revisor = models.TextField(blank=True, null=True)
    decision_revisor = models.CharField(
        max_length=20,
        choices=[
            ('APROBAR', 'Aprobar Devolución'),
            ('RECHAZAR', 'Rechazar Devolución'),
            ('MODIFICAR', 'Modificar Devolución')
        ],
        blank=True, null=True
    )
    
    # Valores modificados por revisor (si aplica)
    valor_afectado_final = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    descripcion_final = models.TextField(blank=True, null=True)
    
    # Control automático
    generada_automaticamente = models.BooleanField(default=True)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    version_engine = models.CharField(max_length=50, default='1.0')
    
    # Plazos legales (5 días hábiles para respuesta EPS)
    fecha_limite_revision = models.DateTimeField()
    
    class Meta:
        db_table = 'pre_devoluciones'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['estado']),
            models.Index(fields=['codigo_causal']),
            models.Index(fields=['prestador_nit']),
            models.Index(fields=['fecha_limite_revision']),
        ]

    def __str__(self):
        return f"PreDevolución {self.codigo_causal} - {self.num_factura} - {self.estado}"

class DevolucionOficial(models.Model):
    """
    Devoluciones oficiales aprobadas por revisor humano
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia a pre-devolución
    pre_devolucion_id = models.CharField(max_length=24, db_index=True)
    transaccion_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    prestador_nit = models.CharField(max_length=20, db_index=True)
    
    # Datos finales de la devolución
    codigo_causal = models.CharField(max_length=10)
    descripcion_causal = models.TextField()
    valor_devuelto = models.DecimalField(max_digits=15, decimal_places=2)
    fundamentacion_oficial = models.TextField()
    
    # Trazabilidad
    aprobada_por = models.CharField(max_length=100)
    fecha_aprobacion = models.DateTimeField(auto_now_add=True)
    
    # Respuesta del prestador
    respuesta_prestador = models.TextField(blank=True, null=True)
    fecha_respuesta_prestador = models.DateTimeField(blank=True, null=True)
    documentos_respuesta = models.JSONField(default=list)  # URLs de documentos
    
    # Estado final
    estado_final = models.CharField(
        max_length=20,
        choices=[
            ('VIGENTE', 'Devolución Vigente'),
            ('SUBSANADA', 'Subsanada por Prestador'),
            ('SOSTENIDA', 'Sostenida por EPS'),
            ('VENCIDA', 'Vencida sin Respuesta')
        ],
        default='VIGENTE'
    )
    
    class Meta:
        db_table = 'devoluciones_oficiales'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['prestador_nit']),
            models.Index(fields=['estado_final']),
        ]

    def __str__(self):
        return f"Devolución {self.codigo_causal} - {self.num_factura} - {self.estado_final}"

class PreGlosa(models.Model):
    """
    Pre-glosas automáticas generadas por el engine
    Para cuentas que pasaron la pre-devolución
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)  # Usuario específico
    servicio_id = models.CharField(max_length=24, blank=True, null=True)  # Servicio específico
    num_factura = models.CharField(max_length=50, db_index=True)
    prestador_nit = models.CharField(max_length=20, db_index=True)
    
    # Causal de glosa automática
    codigo_glosa = models.CharField(max_length=10, db_index=True)  # FA0101, TA0201, CL0301, etc.
    categoria_glosa = models.CharField(
        max_length=20,
        choices=[
            ('FA', 'Facturación'),
            ('TA', 'Tarifas'),
            ('SO', 'Soportes'),
            ('AU', 'Autorizaciones'),
            ('CO', 'Cobertura'),
            ('CL', 'Calidad'),
            ('SA', 'Seguimiento Acuerdos')
        ],
        db_index=True
    )
    
    descripcion_hallazgo = models.TextField()
    valor_glosado_sugerido = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Evidencia técnica del engine
    evidencia_tecnica = models.JSONField(default=dict)
    fundamentacion_clinica = models.TextField(blank=True, null=True)  # Para glosas CL
    fundamentacion_administrativa = models.TextField(blank=True, null=True)  # Para glosas FA/TA
    
    # Datos del servicio glosado
    tipo_servicio = models.CharField(max_length=50)  # consulta, procedimiento, medicamento
    codigo_cups_cum = models.CharField(max_length=20, blank=True, null=True)
    descripcion_servicio = models.CharField(max_length=200, blank=True, null=True)
    valor_servicio_original = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Estado de auditoría humana
    estado = models.CharField(
        max_length=30,
        choices=[
            ('PENDIENTE_AUDITORIA', 'Pendiente Auditoría'),
            ('APROBADA', 'Aprobada por Auditor'),
            ('RECHAZADA', 'Rechazada por Auditor'),
            ('MODIFICADA', 'Modificada por Auditor'),
            ('REQUIERE_REVISION_MEDICA', 'Requiere Revisión Médica')
        ],
        default='PENDIENTE_AUDITORIA',
        db_index=True
    )
    
    # Auditoría humana
    auditado_por = models.CharField(max_length=100, blank=True, null=True)
    perfil_auditor = models.CharField(
        max_length=30,
        choices=[
            ('AUDITOR_ADMINISTRATIVO', 'Auditor Administrativo'),
            ('AUDITOR_MEDICO', 'Auditor Médico'),
            ('COORDINADOR_AUDITORIA', 'Coordinador Auditoría')
        ],
        blank=True, null=True
    )
    fecha_auditoria = models.DateTimeField(blank=True, null=True)
    
    # Decisión del auditor
    decision_auditor = models.CharField(
        max_length=20,
        choices=[
            ('APROBAR', 'Aprobar Glosa'),
            ('RECHAZAR', 'Rechazar Glosa'),
            ('MODIFICAR_VALOR', 'Modificar Valor'),
            ('MODIFICAR_CAUSAL', 'Modificar Causal'),
            ('ESCALAR_MEDICO', 'Escalar a Médico')
        ],
        blank=True, null=True
    )
    
    # Valores finales del auditor
    valor_glosado_final = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    codigo_glosa_final = models.CharField(max_length=10, blank=True, null=True)
    observaciones_auditor = models.TextField(blank=True, null=True)
    
    # Control automático
    generada_automaticamente = models.BooleanField(default=True)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    prioridad_revision = models.CharField(
        max_length=10,
        choices=[
            ('ALTA', 'Alta - Revisar primero'),
            ('MEDIA', 'Media - Revisar normal'),
            ('BAJA', 'Baja - Revisar último')
        ],
        default='MEDIA'
    )
    
    class Meta:
        db_table = 'pre_glosas'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['estado']),
            models.Index(fields=['categoria_glosa']),
            models.Index(fields=['prestador_nit']),
            models.Index(fields=['auditado_por']),
            models.Index(fields=['prioridad_revision']),
        ]

    def __str__(self):
        return f"PreGlosa {self.codigo_glosa} - {self.num_factura} - ${self.valor_glosado_sugerido}"

class GlosaOficial(models.Model):
    """
    Glosas oficiales aprobadas por auditor humano
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia a pre-glosa
    pre_glosa_id = models.CharField(max_length=24, db_index=True)
    transaccion_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    prestador_nit = models.CharField(max_length=20, db_index=True)
    
    # Datos finales de la glosa
    codigo_glosa = models.CharField(max_length=10)
    categoria_glosa = models.CharField(max_length=20)
    descripcion_glosa = models.TextField()
    valor_glosado = models.DecimalField(max_digits=15, decimal_places=2)
    fundamentacion_oficial = models.TextField()
    
    # Trazabilidad de aprobación
    aprobada_por = models.CharField(max_length=100)
    perfil_aprobador = models.CharField(max_length=30)
    fecha_aprobacion = models.DateTimeField(auto_now_add=True)
    
    # Respuesta del prestador (5 días hábiles)
    respuesta_prestador = models.TextField(blank=True, null=True)
    fecha_respuesta_prestador = models.DateTimeField(blank=True, null=True)
    documentos_respuesta = models.JSONField(default=list)
    aceptacion_prestador = models.CharField(
        max_length=20,
        choices=[
            ('ACEPTA', 'Acepta la Glosa'),
            ('NO_ACEPTA', 'No Acepta la Glosa'),
            ('ACEPTA_PARCIAL', 'Acepta Parcialmente')
        ],
        blank=True, null=True
    )
    
    # Estado final de la glosa
    estado_final = models.CharField(
        max_length=20,
        choices=[
            ('VIGENTE', 'Glosa Vigente'),
            ('ACEPTADA', 'Aceptada por Prestador'),
            ('CONTROVERTIDA', 'Controvertida por Prestador'),
            ('SOSTENIDA', 'Sostenida por EPS'),
            ('LEVANTADA', 'Levantada por EPS'),
            ('CONCILIACION', 'En Conciliación')
        ],
        default='VIGENTE'
    )
    
    # Para conciliación
    fecha_conciliacion = models.DateTimeField(blank=True, null=True)
    resultado_conciliacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('FAVORABLE_EPS', 'Favorable a EPS'),
            ('FAVORABLE_PSS', 'Favorable a PSS'),
            ('PARCIAL', 'Parcial')
        ],
        blank=True, null=True
    )
    valor_final_conciliacion = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    
    class Meta:
        db_table = 'glosas_oficiales'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['prestador_nit']),
            models.Index(fields=['estado_final']),
            models.Index(fields=['categoria_glosa']),
        ]

    def __str__(self):
        return f"Glosa {self.codigo_glosa} - {self.num_factura} - ${self.valor_glosado}"

class AsignacionAuditoria(models.Model):
    """
    Asignación automática equitativa de pre-glosas a auditores
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Auditor asignado
    auditor_username = models.CharField(max_length=100, db_index=True)
    auditor_perfil = models.CharField(
        max_length=30,
        choices=[
            ('AUDITOR_ADMINISTRATIVO', 'Auditor Administrativo'),
            ('AUDITOR_MEDICO', 'Auditor Médico')
        ]
    )
    
    # Pre-glosas asignadas
    pre_glosas_ids = models.JSONField(default=list)  # Lista de ObjectIds
    total_pre_glosas = models.IntegerField(default=0)
    valor_total_asignado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Fechas y plazos
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    fecha_limite_auditoria = models.DateTimeField()  # Según plazos normativos
    
    # Estado de la asignación
    estado = models.CharField(
        max_length=20,
        choices=[
            ('ASIGNADA', 'Asignada'),
            ('EN_PROCESO', 'En Proceso'),
            ('COMPLETADA', 'Completada'),
            ('VENCIDA', 'Vencida')
        ],
        default='ASIGNADA'
    )
    
    # Estadísticas de progreso
    pre_glosas_auditadas = models.IntegerField(default=0)
    pre_glosas_aprobadas = models.IntegerField(default=0)
    pre_glosas_rechazadas = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'asignaciones_auditoria'
        indexes = [
            models.Index(fields=['auditor_username']),
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_limite_auditoria']),
        ]

    def __str__(self):
        return f"Asignación {self.auditor_username} - {self.total_pre_glosas} pre-glosas"

class TrazabilidadAuditoria(models.Model):
    """
    Trazabilidad completa del proceso de auditoría
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia
    transaccion_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    
    # Evento de auditoría
    evento = models.CharField(
        max_length=50,
        choices=[
            ('TRANSACCION_RADICADA', 'Transacción Radicada'),
            ('PRE_DEVOLUCION_GENERADA', 'Pre-devolución Generada'),
            ('PRE_DEVOLUCION_REVISADA', 'Pre-devolución Revisada'),
            ('DEVOLUCION_OFICIAL', 'Devolución Oficial'),
            ('PRE_GLOSA_GENERADA', 'Pre-glosa Generada'),
            ('PRE_GLOSA_ASIGNADA', 'Pre-glosa Asignada'),
            ('PRE_GLOSA_AUDITADA', 'Pre-glosa Auditada'),
            ('GLOSA_OFICIAL', 'Glosa Oficial'),
            ('RESPUESTA_PRESTADOR', 'Respuesta Prestador'),
            ('CONCILIACION_INICIADA', 'Conciliación Iniciada')
        ],
        db_index=True
    )
    
    # Detalles del evento
    usuario = models.CharField(max_length=100)  # Usuario que ejecutó la acción
    fecha_evento = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField()
    datos_adicionales = models.JSONField(default=dict)  # Datos específicos del evento
    
    # Para auditoría automática vs humana
    origen = models.CharField(
        max_length=20,
        choices=[
            ('AUTOMATICO', 'Sistema Automático'),
            ('HUMANO', 'Decisión Humana')
        ],
        default='AUTOMATICO'
    )
    
    class Meta:
        db_table = 'trazabilidad_auditoria'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['evento']),
            models.Index(fields=['fecha_evento']),
            models.Index(fields=['usuario']),
        ]

    def __str__(self):
        return f"{self.evento} - {self.num_factura} - {self.fecha_evento}"