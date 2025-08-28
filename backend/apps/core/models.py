# -*- coding: utf-8 -*-
# apps/core/models.py

"""
Modelos NoSQL para Sistema de Asignación Automática
Arquitectura: MongoDB + django_mongodb_backend
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField
from django.contrib.auth.models import AbstractUser
import uuid

# =====================================
# 1. PERFILES DE AUDITORES
# =====================================

class AuditorPerfil(models.Model):
    """
    Perfil de auditor con capacidades y especialización
    
    TIPOS DE PERFIL:
    - MEDICO: Puede auditar ambulatorio + hospitalario
    - ADMINISTRATIVO: Solo ambulatorio (facturación, soportes)
    """
    
    id = ObjectIdAutoField(primary_key=True)
    
    # Información básica
    username = models.CharField(max_length=100, unique=True, db_index=True)
    nombres = models.CharField(max_length=200)
    apellidos = models.CharField(max_length=200)
    documento = models.CharField(max_length=20, unique=True)
    email = models.EmailField()
    
    # Perfil profesional
    PERFIL_CHOICES = [
        ('MEDICO', 'Auditor Médico'),
        ('ADMINISTRATIVO', 'Auditor Administrativo'),
    ]
    perfil = models.CharField(max_length=20, choices=PERFIL_CHOICES)
    
    # Especialización (para médicos)
    especializacion = models.CharField(max_length=100, blank=True, null=True)
    registro_medico = models.CharField(max_length=50, blank=True, null=True)
    
    # Capacidades de trabajo
    capacidad_maxima_dia = models.IntegerField(default=10)  # Radicaciones por día
    tipos_auditoria_permitidos = models.JSONField(default=list)  # ['AMBULATORIO', 'HOSPITALARIO']
    
    # Disponibilidad
    disponibilidad = models.JSONField(default=dict)  # {activo: true, vacaciones: false, horarios: {...}}
    
    # Métricas de rendimiento
    metricas_historicas = models.JSONField(default=dict)  # {tiempo_promedio: X, glosas_promedio: Y}
    
    # Metadatos
    fecha_ingreso = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'auditores_perfiles'
        indexes = [
            models.Index(fields=['perfil', 'activo']),
            models.Index(fields=['username']),
            models.Index(fields=['disponibilidad']),
        ]
    
    def __str__(self):
        return f"{self.nombres} {self.apellidos} ({self.perfil})"

# =====================================
# 2. ASIGNACIONES AUTOMÁTICAS
# =====================================

class AsignacionAutomatica(models.Model):
    """
    Propuestas de asignación generadas por el algoritmo
    Estado: PENDIENTE -> APROBADA/RECHAZADA
    """
    
    id = ObjectIdAutoField(primary_key=True)
    
    # Información de la propuesta
    fecha_propuesta = models.DateTimeField(auto_now_add=True)
    coordinador_id = ObjectIdField(db_index=True)  # Referencia a usuario EPS coordinador
    algoritmo_version = models.CharField(max_length=20, default="v1.0")
    
    # Estado
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente de Aprobación'),
        ('APROBADA', 'Aprobada'),
        ('RECHAZADA', 'Rechazada'),
        ('PARCIAL', 'Parcialmente Aprobada'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
    fecha_aprobacion = models.DateTimeField(null=True, blank=True)
    
    # Métricas de la propuesta
    metricas_distribucion = models.JSONField(default=dict)
    
    # Asignaciones individuales
    asignaciones_individuales = models.JSONField(default=list)
    
    # Decisiones del coordinador
    decisiones_coordinador = models.JSONField(default=list)
    
    # Trazabilidad
    trazabilidad = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'asignaciones_automaticas'
        indexes = [
            models.Index(fields=['estado', '-fecha_propuesta']),
            models.Index(fields=['coordinador_id']),
        ]

# =====================================
# 3. ASIGNACIONES DE AUDITORÍA
# =====================================

class AsignacionAuditoria(models.Model):
    """
    Asignaciones individuales aprobadas por el coordinador
    Una radicación -> Un auditor
    """
    
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    propuesta_id = ObjectIdField(db_index=True)  # Referencia a AsignacionAutomatica
    radicacion_id = ObjectIdField(db_index=True)  # Referencia a radicacion
    auditor_username = models.CharField(max_length=100, db_index=True)
    
    # Tipo de auditoría
    TIPO_CHOICES = [
        ('AMBULATORIO', 'Auditoría Ambulatoria'),
        ('HOSPITALARIO', 'Auditoría Hospitalaria'),
    ]
    tipo_auditoria = models.CharField(max_length=20, choices=TIPO_CHOICES)
    
    # Estado de la asignación
    ESTADO_CHOICES = [
        ('ASIGNADA', 'Asignada'),
        ('EN_PROCESO', 'En Proceso'),
        ('COMPLETADA', 'Completada'),
        ('SUSPENDIDA', 'Suspendida'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='ASIGNADA')
    
    # Fechas
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    fecha_limite = models.DateTimeField()
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_completado = models.DateTimeField(null=True, blank=True)
    
    # Prioridad y valor
    PRIORIDAD_CHOICES = [
        ('ALTA', 'Alta'),
        ('MEDIA', 'Media'),
        ('BAJA', 'Baja'),
    ]
    prioridad = models.CharField(max_length=10, choices=PRIORIDAD_CHOICES)
    valor_auditoria = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Metadatos
    metadatos = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'core_asignaciones_auditoria'
        indexes = [
            models.Index(fields=['auditor_username', 'estado']),
            models.Index(fields=['radicacion_id']),
            models.Index(fields=['fecha_asignacion']),
            models.Index(fields=['tipo_auditoria', 'prioridad']),
        ]

# =====================================
# 4. TRAZABILIDAD DE ASIGNACIONES
# =====================================

class TrazabilidadAsignacion(models.Model):
    """
    Log completo de todas las acciones en el proceso de asignación
    Auditoría detallada para compliance
    """
    
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    asignacion_id = ObjectIdField(db_index=True)  # Puede ser AsignacionAutomatica o AsignacionAuditoria
    
    # Evento
    timestamp = models.DateTimeField(auto_now_add=True)
    usuario = models.CharField(max_length=100, db_index=True)
    
    EVENTO_CHOICES = [
        ('PROPUESTA_GENERADA', 'Propuesta Generada'),
        ('APROBACION_MASIVA', 'Aprobación Masiva'),
        ('APROBACION_INDIVIDUAL', 'Aprobación Individual'),
        ('REASIGNACION', 'Reasignación'),
        ('RECHAZO', 'Rechazo'),
        ('INICIO_AUDITORIA', 'Inicio Auditoría'),
        ('FINALIZACION_AUDITORIA', 'Finalización Auditoría'),
    ]
    evento = models.CharField(max_length=30, choices=EVENTO_CHOICES)
    
    # Detalles del evento
    detalles = models.JSONField(default=dict)
    
    # Impacto
    impacto = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'trazabilidad_asignaciones'
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['usuario', '-timestamp']),
            models.Index(fields=['evento']),
            models.Index(fields=['asignacion_id']),
        ]

# =====================================
# 5. CONFIGURACIONES DEL ALGORITMO
# =====================================

class ConfiguracionAlgoritmo(models.Model):
    """
    Configuraciones para el algoritmo de asignación automática
    Permite ajustar parámetros sin cambiar código
    """
    
    id = ObjectIdAutoField(primary_key=True)
    
    # Configuración
    clave = models.CharField(max_length=100, unique=True)
    valor = models.JSONField()
    descripcion = models.TextField()
    categoria = models.CharField(max_length=50)
    
    # Control de versiones
    version = models.CharField(max_length=20, default="1.0")
    activo = models.BooleanField(default=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    actualizado_por = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'configuraciones_algoritmo'
        indexes = [
            models.Index(fields=['clave', 'activo']),
            models.Index(fields=['categoria']),
        ]

# =====================================
# 6. MÉTRICAS DE RENDIMIENTO
# =====================================

class MetricaRendimiento(models.Model):
    """
    Métricas de rendimiento del algoritmo y auditores
    Para optimización continua del sistema
    """
    
    id = ObjectIdAutoField(primary_key=True)
    
    # Período de medición
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    
    # Tipo de métrica
    TIPO_CHOICES = [
        ('ALGORITMO', 'Rendimiento Algoritmo'),
        ('AUDITOR', 'Rendimiento Auditor'),
        ('SISTEMA', 'Rendimiento Sistema'),
    ]
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    
    # Objetivo de la métrica (usuario, propuesta, etc.)
    objetivo_id = models.CharField(max_length=100, db_index=True)
    
    # Métricas
    metricas = models.JSONField(default=dict)
    
    # Contexto
    contexto = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'metricas_rendimiento'
        indexes = [
            models.Index(fields=['tipo', '-fecha_fin']),
            models.Index(fields=['objetivo_id']),
        ]