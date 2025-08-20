# -*- coding: utf-8 -*-
# apps/radicacion/models_coordinacion.py

"""
Modelos para Coordinación de Auditoría - NeurAudit Colombia
Maneja el flujo de aprobación de asignaciones por parte del Coordinador de Auditoría
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel

from datetime import datetime
from decimal import Decimal

class PropuestaAsignacion(models.Model):
    """
    Propuesta de asignación generada automáticamente
    Requiere aprobación del Coordinador de Auditoría antes de ser efectiva
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Metadatos de la propuesta
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    generada_por = models.CharField(max_length=100, default='SISTEMA_AUTOMATICO')
    algoritmo_version = models.CharField(max_length=50, default='1.0')
    
    # Datos agregados de la propuesta
    total_pre_glosas = models.IntegerField(default=0)
    valor_total_propuesto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_auditores_involucrados = models.IntegerField(default=0)
    
    # Criterios aplicados en la asignación automática
    criterios_aplicados = models.JSONField(default=list)
    parametros_algoritmo = models.JSONField(default=dict)
    
    # Estado de la propuesta
    estado = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE_APROBACION', 'Pendiente Aprobación'),
            ('APROBADA', 'Aprobada por Coordinador'),
            ('RECHAZADA', 'Rechazada por Coordinador'),
            ('MODIFICADA', 'Modificada por Coordinador'),
            ('EJECUTADA', 'Ejecutada y Asignaciones Creadas'),
            ('VENCIDA', 'Vencida sin Aprobación')
        ],
        default='PENDIENTE_APROBACION',
        db_index=True
    )
    
    # Distribución propuesta por auditor
    distribucion_propuesta = models.JSONField(default=dict)  # {auditor_username: {pre_glosas_ids: [], valor: X}}
    
    # Justificación del algoritmo
    justificacion_algoritmo = models.TextField()
    factores_balance = models.JSONField(default=dict)  # Factores de balanceamiento aplicados
    
    # Fechas límite
    fecha_limite_aprobacion = models.DateTimeField()  # 24 horas para aprobar
    fecha_limite_auditoria = models.DateTimeField()   # Fecha límite para completar auditorías
    
    class Meta:
        db_table = 'propuestas_asignacion'
        indexes = [
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_limite_aprobacion']),
            models.Index(fields=['generada_por']),
        ]

    def __str__(self):
        return f"Propuesta {self.estado} - {self.total_pre_glosas} pre-glosas - {self.total_auditores_involucrados} auditores"

class AprobacionCoordinador(models.Model):
    """
    Registro de aprobación/rechazo por parte del Coordinador de Auditoría
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia a la propuesta
    propuesta_id = models.CharField(max_length=24, db_index=True)
    
    # Coordinador que aprueba/rechaza
    coordinador_username = models.CharField(max_length=100, db_index=True)
    coordinador_nombre = models.CharField(max_length=200)
    fecha_decision = models.DateTimeField(auto_now_add=True)
    
    # Decisión tomada
    decision = models.CharField(
        max_length=20,
        choices=[
            ('APROBAR', 'Aprobar Propuesta'),
            ('RECHAZAR', 'Rechazar Propuesta'),
            ('MODIFICAR', 'Modificar Distribución'),
            ('SOLICITAR_AJUSTES', 'Solicitar Ajustes')
        ],
        db_index=True
    )
    
    # Justificación de la decisión
    observaciones = models.TextField()
    criterios_revision = models.JSONField(default=list)  # Criterios evaluados por el coordinador
    
    # Modificaciones propuestas (si aplica)
    distribucion_modificada = models.JSONField(default=dict, blank=True, null=True)
    ajustes_solicitados = models.JSONField(default=list, blank=True, null=True)
    
    # Métricas evaluadas
    metricas_evaluadas = models.JSONField(default=dict)  # Métricas que influyeron en la decisión
    
    class Meta:
        db_table = 'aprobaciones_coordinador'
        indexes = [
            models.Index(fields=['propuesta_id']),
            models.Index(fields=['coordinador_username']),
            models.Index(fields=['decision']),
            models.Index(fields=['fecha_decision']),
        ]

    def __str__(self):
        return f"{self.decision} por {self.coordinador_username} - Propuesta {self.propuesta_id}"

class ConfiguracionAsignacion(models.Model):
    """
    Configuración de parámetros para el algoritmo de asignación automática
    Configurable por el Coordinador de Auditoría
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación de la configuración
    nombre_configuracion = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField()
    activa = models.BooleanField(default=False)
    
    # Parámetros de balanceamiento
    peso_carga_trabajo = models.FloatField(default=0.4)        # 40% peso en carga actual
    peso_especializacion = models.FloatField(default=0.3)      # 30% peso en especialización
    peso_rendimiento = models.FloatField(default=0.2)          # 20% peso en rendimiento histórico
    peso_capacidad = models.FloatField(default=0.1)            # 10% peso en capacidad disponible
    
    # Límites operativos
    max_pre_glosas_por_auditor_dia = models.IntegerField(default=15)
    max_valor_asignado_por_auditor = models.DecimalField(max_digits=15, decimal_places=2, default=5000000)
    
    # Configuración de prioridades
    factor_prioridad_alta = models.FloatField(default=1.5)     # Multiplicador para prioridad alta
    factor_prioridad_media = models.FloatField(default=1.0)    # Multiplicador para prioridad media
    factor_prioridad_baja = models.FloatField(default=0.8)     # Multiplicador para prioridad baja
    
    # Configuración de especialización
    mapeo_especializaciones = models.JSONField(default=dict)   # Mapeo especialidad -> categorías de glosa
    factor_especializacion_exacta = models.FloatField(default=1.8)  # Factor cuando hay match exacto
    factor_especializacion_general = models.FloatField(default=1.0) # Factor para especialización general
    
    # Configuración temporal
    horas_limite_aprobacion = models.IntegerField(default=24)   # Horas para aprobar propuesta
    dias_limite_auditoria = models.IntegerField(default=10)     # Días para completar auditorías
    
    # Control de versiones
    version = models.CharField(max_length=20, default='1.0')
    creada_por = models.CharField(max_length=100)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    modificada_por = models.CharField(max_length=100, blank=True, null=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'configuraciones_asignacion'
        indexes = [
            models.Index(fields=['activa']),
            models.Index(fields=['nombre_configuracion']),
        ]

    def __str__(self):
        estado = "ACTIVA" if self.activa else "INACTIVA"
        return f"Config {self.nombre_configuracion} v{self.version} - {estado}"

class AlertaCoordinacion(models.Model):
    """
    Alertas para el Coordinador de Auditoría sobre eventos que requieren atención
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Clasificación de la alerta
    tipo_alerta = models.CharField(
        max_length=30,
        choices=[
            ('PROPUESTA_PENDIENTE', 'Propuesta Pendiente de Aprobación'),
            ('PROPUESTA_VENCIDA', 'Propuesta Vencida'),
            ('CARGA_DESBALANCEADA', 'Carga de Trabajo Desbalanceada'),
            ('AUDITOR_SOBRECARGADO', 'Auditor Sobrecargado'),
            ('ATRASO_AUDITORIA', 'Atraso en Auditorías'),
            ('RENDIMIENTO_BAJO', 'Rendimiento Bajo de Auditor'),
            ('ESCALAMIENTO_REQUERIDO', 'Escalamiento Médico Requerido')
        ],
        db_index=True
    )
    
    # Nivel de criticidad
    nivel_criticidad = models.CharField(
        max_length=10,
        choices=[
            ('CRITICA', 'Crítica - Acción Inmediata'),
            ('ALTA', 'Alta - Acción en 4 horas'),
            ('MEDIA', 'Media - Acción en 24 horas'),
            ('BAJA', 'Baja - Acción en 72 horas')
        ],
        default='MEDIA',
        db_index=True
    )
    
    # Contenido de la alerta
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    datos_contextuales = models.JSONField(default=dict)  # Datos adicionales para contexto
    
    # Referencias relacionadas
    propuesta_id = models.CharField(max_length=24, blank=True, null=True)
    auditor_afectado = models.CharField(max_length=100, blank=True, null=True)
    
    # Estado de la alerta
    estado = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVA', 'Activa'),
            ('ATENDIDA', 'Atendida'),
            ('DESESTIMADA', 'Desestimada'),
            ('VENCIDA', 'Vencida')
        ],
        default='ACTIVA',
        db_index=True
    )
    
    # Fechas
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    fecha_limite_atencion = models.DateTimeField()
    fecha_atencion = models.DateTimeField(blank=True, null=True)
    
    # Atención de la alerta
    atendida_por = models.CharField(max_length=100, blank=True, null=True)
    accion_tomada = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'alertas_coordinacion'
        indexes = [
            models.Index(fields=['tipo_alerta']),
            models.Index(fields=['nivel_criticidad']),
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_limite_atencion']),
            models.Index(fields=['auditor_afectado']),
        ]

    def __str__(self):
        return f"{self.tipo_alerta} - {self.nivel_criticidad} - {self.estado}"

class MetricasCoordinacion(models.Model):
    """
    Métricas y KPIs para el dashboard del Coordinador de Auditoría
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Período de las métricas
    fecha_inicio = models.DateField(db_index=True)
    fecha_fin = models.DateField(db_index=True)
    tipo_periodo = models.CharField(
        max_length=20,
        choices=[
            ('DIARIO', 'Diario'),
            ('SEMANAL', 'Semanal'),
            ('MENSUAL', 'Mensual'),
            ('TRIMESTRAL', 'Trimestral')
        ],
        default='DIARIO'
    )
    
    # Métricas de asignación
    total_propuestas_generadas = models.IntegerField(default=0)
    propuestas_aprobadas = models.IntegerField(default=0)
    propuestas_rechazadas = models.IntegerField(default=0)
    propuestas_modificadas = models.IntegerField(default=0)
    tiempo_promedio_aprobacion_horas = models.FloatField(default=0.0)
    
    # Métricas de distribución
    total_pre_glosas_asignadas = models.IntegerField(default=0)
    valor_total_asignado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    auditores_activos = models.IntegerField(default=0)
    indice_balance_cargas = models.FloatField(default=0.0)  # 0-1, siendo 1 perfectamente balanceado
    
    # Métricas de rendimiento
    pre_glosas_auditadas = models.IntegerField(default=0)
    tasa_cumplimiento_plazos = models.FloatField(default=0.0)  # Porcentaje 0-100
    tiempo_promedio_auditoria_horas = models.FloatField(default=0.0)
    
    # Métricas de calidad
    tasa_aprobacion_glosas = models.FloatField(default=0.0)    # Porcentaje de glosas aprobadas
    tasa_modificacion_glosas = models.FloatField(default=0.0)  # Porcentaje de glosas modificadas
    escalamientos_medicos = models.IntegerField(default=0)
    
    # Detalle por auditor
    metricas_por_auditor = models.JSONField(default=dict)
    
    # Fechas de cálculo
    fecha_calculo = models.DateTimeField(auto_now_add=True)
    calculada_por = models.CharField(max_length=100, default='SISTEMA_AUTOMATICO')
    
    class Meta:
        db_table = 'metricas_coordinacion'
        indexes = [
            models.Index(fields=['fecha_inicio', 'fecha_fin']),
            models.Index(fields=['tipo_periodo']),
            models.Index(fields=['fecha_calculo']),
        ]
        unique_together = ['fecha_inicio', 'fecha_fin', 'tipo_periodo']

    def __str__(self):
        return f"Métricas {self.tipo_periodo} - {self.fecha_inicio} a {self.fecha_fin}"