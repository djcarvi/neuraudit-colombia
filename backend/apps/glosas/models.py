"""
Modelos para el sistema de glosas según Resolución 2284 de 2023
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ArrayField
from datetime import datetime, date, timedelta
from decimal import Decimal


class Glosa(models.Model):
    """
    Modelo principal para glosas según Resolución 2284
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia a la radicación
    radicacion_id = models.CharField(max_length=24, db_index=True)  # ObjectId de radicación
    numero_radicado = models.CharField(max_length=50, db_index=True)
    
    # Información del prestador
    prestador_nit = models.CharField(max_length=20, db_index=True)
    prestador_nombre = models.CharField(max_length=200)
    
    # Información de la factura
    factura_numero = models.CharField(max_length=50, db_index=True)
    factura_prefijo = models.CharField(max_length=10, blank=True)
    
    # Códigos de glosa (según Resolución 2284)
    CATEGORIA_GLOSA_CHOICES = [
        ('FA', 'Facturación'),
        ('TA', 'Tarifas'),
        ('SO', 'Soportes'),
        ('AU', 'Autorizaciones'),
        ('CO', 'Cobertura'),
        ('CL', 'Calidad'),
        ('SA', 'Seguimiento de Acuerdos')
    ]
    
    codigo_glosa = models.CharField(max_length=6, db_index=True)  # FA0101, TA0201, etc.
    categoria_glosa = models.CharField(max_length=2, choices=CATEGORIA_GLOSA_CHOICES, db_index=True)
    descripcion_glosa = models.TextField()
    
    # Detalle específico del servicio glosado
    consecutivo_servicio = models.CharField(max_length=20)  # Del RIPS
    codigo_servicio = models.CharField(max_length=20)  # CUPS, CUM, IUM
    descripcion_servicio = models.TextField()
    
    # Valores
    valor_glosado = models.DecimalField(max_digits=15, decimal_places=2)
    valor_aceptado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valor_objetado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Estados de la glosa
    ESTADO_GLOSA_CHOICES = [
        ('FORMULADA', 'Formulada'),
        ('NOTIFICADA', 'Notificada'),
        ('RESPONDIDA_1', 'Respondida (Primera vez)'),
        ('RATIFICADA', 'Ratificada por EPS'),
        ('ACEPTADA_PARCIAL', 'Aceptada Parcialmente'),
        ('ACEPTADA_TOTAL', 'Aceptada Totalmente'),
        ('OBJETADA', 'Objetada por Prestador'),
        ('CONCILIACION', 'En Conciliación'),
        ('CERRADA', 'Cerrada')
    ]
    
    estado = models.CharField(max_length=20, choices=ESTADO_GLOSA_CHOICES, default='FORMULADA', db_index=True)
    
    # Fechas y plazos según Resolución 2284
    fecha_formulacion = models.DateTimeField(auto_now_add=True, db_index=True)
    fecha_notificacion = models.DateTimeField(null=True, blank=True, db_index=True)
    fecha_limite_respuesta = models.DateTimeField(null=True, blank=True, db_index=True)  # 5 días hábiles
    fecha_respuesta_prestador = models.DateTimeField(null=True, blank=True)
    fecha_limite_ratificacion = models.DateTimeField(null=True, blank=True)  # 5 días hábiles después de respuesta
    fecha_ratificacion_eps = models.DateTimeField(null=True, blank=True)
    
    # Flags de control de plazos
    respuesta_extemporanea = models.BooleanField(default=False)
    aceptacion_tacita_prestador = models.BooleanField(default=False)  # Si no responde en 5 días
    glosa_injustificada = models.BooleanField(default=False)  # Si EPS no ratifica en 5 días
    
    # Observaciones de auditoría
    observaciones_auditoria = models.TextField(blank=True)
    observaciones_respuesta = models.TextField(blank=True)
    observaciones_ratificacion = models.TextField(blank=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='glosas_creadas',
        to_field='id'
    )
    
    class Meta:
        db_table = 'glosas'
        ordering = ['-fecha_formulacion']
        indexes = [
            models.Index(fields=['radicacion_id']),
            models.Index(fields=['numero_radicado']),
            models.Index(fields=['prestador_nit']),
            models.Index(fields=['factura_numero']),
            models.Index(fields=['codigo_glosa']),
            models.Index(fields=['categoria_glosa']),
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_formulacion']),
            models.Index(fields=['fecha_limite_respuesta']),
            models.Index(fields=['aceptacion_tacita_prestador']),
            models.Index(fields=['glosa_injustificada'])
        ]
    
    def __str__(self):
        return f"Glosa {self.codigo_glosa} - {self.numero_radicado} - ${self.valor_glosado}"
    
    def calcular_dias_restantes_respuesta(self):
        """Calcula días hábiles restantes para respuesta del prestador"""
        if not self.fecha_limite_respuesta or self.fecha_respuesta_prestador:
            return 0
        
        now = datetime.now()
        if now > self.fecha_limite_respuesta:
            return 0
        
        # Calcular días hábiles restantes (simplificado)
        delta = self.fecha_limite_respuesta - now
        return max(0, delta.days)
    
    def calcular_dias_restantes_ratificacion(self):
        """Calcula días hábiles restantes para ratificación de EPS"""
        if not self.fecha_limite_ratificacion or self.fecha_ratificacion_eps:
            return 0
        
        now = datetime.now()
        if now > self.fecha_limite_ratificacion:
            return 0
        
        delta = self.fecha_limite_ratificacion - now
        return max(0, delta.days)
    
    def verificar_aceptacion_tacita(self):
        """Verifica si aplica aceptación tácita por vencimiento de plazos"""
        now = datetime.now()
        
        # Aceptación tácita del prestador (si no responde en 5 días)
        if (self.fecha_limite_respuesta and 
            now > self.fecha_limite_respuesta and 
            not self.fecha_respuesta_prestador and
            self.estado == 'NOTIFICADA'):
            
            self.aceptacion_tacita_prestador = True
            self.estado = 'ACEPTADA_TOTAL'
            self.valor_aceptado = self.valor_glosado
            self.save()
            return True
        
        # Glosa injustificada (si EPS no ratifica en 5 días)
        if (self.fecha_limite_ratificacion and 
            now > self.fecha_limite_ratificacion and 
            not self.fecha_ratificacion_eps and
            self.estado == 'RESPONDIDA_1'):
            
            self.glosa_injustificada = True
            self.estado = 'CERRADA'
            self.valor_aceptado = 0
            self.valor_objetado = self.valor_glosado
            self.save()
            return True
        
        return False


class RespuestaGlosa(models.Model):
    """
    Respuestas del prestador a las glosas según Resolución 2284
    """
    id = ObjectIdAutoField(primary_key=True)
    
    glosa = models.ForeignKey(
        Glosa,
        on_delete=models.CASCADE,
        related_name='respuestas',
        to_field='id'
    )
    
    # Códigos de respuesta según Resolución 2284
    CODIGO_RESPUESTA_CHOICES = [
        ('RE9501', 'Devolución extemporánea'),
        ('RE9502', 'Glosa extemporánea'),
        ('RE9601', 'Devolución injustificada al 100%'),
        ('RE9602', 'Glosa injustificada al 100%'),
        ('RE9701', 'Devolución totalmente aceptada'),
        ('RE9702', 'Glosa totalmente aceptada'),
        ('RE9801', 'Glosa parcialmente aceptada y subsanada parcialmente'),
        ('RE9901', 'Glosa no aceptada y subsanada en su totalidad'),
        ('RE2201', 'Respuesta a devolución extemporánea'),
        ('RE2202', 'Respuesta a glosa extemporánea')
    ]
    
    codigo_respuesta = models.CharField(max_length=6, choices=CODIGO_RESPUESTA_CHOICES, db_index=True)
    descripcion_respuesta = models.TextField()
    
    # Valores de la respuesta
    valor_aceptado_prestador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valor_objetado_prestador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valor_subsanado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Soportes adjuntos
    documentos_soporte = ArrayField(
        models.CharField(max_length=200),
        default=list,
        help_text="Rutas de documentos soporte adjuntos"
    )
    
    # Observaciones
    observaciones = models.TextField(blank=True)
    
    # Fechas
    fecha_respuesta = models.DateTimeField(auto_now_add=True)
    es_extemporanea = models.BooleanField(default=False)
    
    # Usuario que responde
    respondido_por = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='respuestas_glosas',
        to_field='id'
    )
    
    class Meta:
        db_table = 'respuestas_glosas'
        ordering = ['-fecha_respuesta']
        indexes = [
            models.Index(fields=['glosa']),
            models.Index(fields=['codigo_respuesta']),
            models.Index(fields=['fecha_respuesta']),
            models.Index(fields=['es_extemporanea'])
        ]
    
    def __str__(self):
        return f"Respuesta {self.codigo_respuesta} - Glosa {self.glosa.codigo_glosa}"


class RatificacionGlosa(models.Model):
    """
    Ratificación de glosas por parte de la EPS según Resolución 2284
    """
    id = ObjectIdAutoField(primary_key=True)
    
    glosa = models.ForeignKey(
        Glosa,
        on_delete=models.CASCADE,
        related_name='ratificaciones',
        to_field='id'
    )
    
    respuesta_glosa = models.ForeignKey(
        RespuestaGlosa,
        on_delete=models.CASCADE,
        related_name='ratificaciones',
        to_field='id'
    )
    
    # Decisión de la EPS
    DECISION_CHOICES = [
        ('ACEPTAR_RESPUESTA', 'Aceptar Respuesta del Prestador'),
        ('RATIFICAR_GLOSA', 'Ratificar Glosa Original'),
        ('ACEPTAR_PARCIAL', 'Aceptar Parcialmente'),
        ('CONCILIACION', 'Enviar a Conciliación')
    ]
    
    decision = models.CharField(max_length=20, choices=DECISION_CHOICES, db_index=True)
    
    # Valores finales
    valor_final_aceptado = models.DecimalField(max_digits=15, decimal_places=2)
    valor_final_glosado = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Justificación
    justificacion = models.TextField()
    
    # Fechas
    fecha_ratificacion = models.DateTimeField(auto_now_add=True)
    es_extemporanea = models.BooleanField(default=False)
    
    # Usuario que ratifica
    ratificado_por = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='ratificaciones_glosas',
        to_field='id'
    )
    
    class Meta:
        db_table = 'ratificaciones_glosas'
        ordering = ['-fecha_ratificacion']
        indexes = [
            models.Index(fields=['glosa']),
            models.Index(fields=['decision']),
            models.Index(fields=['fecha_ratificacion']),
            models.Index(fields=['es_extemporanea'])
        ]
    
    def __str__(self):
        return f"Ratificación {self.decision} - Glosa {self.glosa.codigo_glosa}"