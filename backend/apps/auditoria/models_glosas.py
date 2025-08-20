from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django.utils import timezone
from bson import ObjectId

class GlosaAplicada(models.Model):
    """
    Modelo NoSQL para registrar las glosas aplicadas por los auditores de la EPS
    según la Resolución 2284 de 2023
    """
    # Campo ObjectId para MongoDB
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias embebidas (enfoque NoSQL)
    radicacion_id = models.CharField(max_length=24, help_text="ID de la radicación")
    numero_radicacion = models.CharField(max_length=50)
    
    factura_id = models.CharField(max_length=24, help_text="ID de la factura")
    numero_factura = models.CharField(max_length=50)
    fecha_factura = models.DateField()
    
    servicio_id = models.CharField(max_length=24, help_text="ID del servicio")
    servicio_info = models.JSONField(
        default=dict,
        help_text="Información embebida del servicio"
    )
    # servicio_info contiene: {codigo, descripcion, tipo_servicio, valor_original}
    
    prestador_info = models.JSONField(
        default=dict,
        help_text="Información embebida del prestador"
    )
    # prestador_info contiene: {nit, razon_social, codigo_habilitacion}
    
    # Información de la glosa
    tipo_glosa = models.CharField(
        max_length=2,
        help_text="Tipo general de glosa (FA, TA, SO, AU, CO, CL, SA)"
    )
    codigo_glosa = models.CharField(
        max_length=10,
        help_text="Código específico de la glosa (ej: FA0101)"
    )
    descripcion_glosa = models.TextField(
        help_text="Descripción del motivo de la glosa"
    )
    
    # Valores
    valor_servicio = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Valor original del servicio"
    )
    valor_glosado = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Valor glosado"
    )
    porcentaje_glosa = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Porcentaje de la glosa sobre el valor del servicio"
    )
    
    # Observaciones y justificación
    observaciones = models.TextField(
        help_text="Observaciones detalladas del auditor"
    )
    
    # Estado de la glosa
    estado = models.CharField(
        max_length=20,
        default='APLICADA',
        help_text="Estado actual de la glosa"
    )
    
    # Información del auditor (embebida)
    auditor_info = models.JSONField(
        default=dict,
        help_text="Información del auditor que aplicó la glosa"
    )
    # auditor_info contiene: {user_id, username, nombre_completo, rol}
    
    # Fechas de auditoría
    fecha_aplicacion = models.DateTimeField(default=timezone.now)
    fecha_ultima_actualizacion = models.DateTimeField(auto_now=True)
    
    # Metadatos adicionales
    tipo_servicio = models.CharField(
        max_length=20,
        help_text="Tipo de servicio glosado (CONSULTA, PROCEDIMIENTO, etc.)"
    )
    excede_valor_servicio = models.BooleanField(
        default=False,
        help_text="Indica si el valor glosado excede el valor del servicio"
    )
    
    # Para tracking de cambios
    historial_cambios = models.JSONField(
        default=list,
        blank=True,
        help_text="Historial de cambios en la glosa"
    )
    
    # Respuestas del prestador (embebidas)
    respuestas = models.JSONField(
        default=list,
        blank=True,
        help_text="Lista de respuestas del prestador"
    )
    # respuestas contiene lista de objetos: [
    #   {
    #     tipo_respuesta: 'RE97', 
    #     valor_aceptado: 100000,
    #     valor_rechazado: 0,
    #     justificacion: '...',
    #     usuario_prestador: {user_id, username, nombre},
    #     fecha_respuesta: '2025-07-31T10:00:00',
    #     soportes: ['archivo1.pdf', 'archivo2.jpg']
    #   }
    # ]
    
    # Estadísticas agregadas (para consultas rápidas)
    estadisticas = models.JSONField(
        default=dict,
        blank=True,
        help_text="Estadísticas agregadas de la glosa"
    )
    # estadisticas contiene: {
    #   total_respuestas: 0,
    #   valor_total_aceptado: 0,
    #   valor_total_rechazado: 0,
    #   requiere_conciliacion: false
    # }
    
    class Meta:
        db_table = 'auditoria_glosa_aplicada'
        verbose_name = 'Glosa Aplicada'
        verbose_name_plural = 'Glosas Aplicadas'
        ordering = ['-fecha_aplicacion']
        indexes = [
            models.Index(fields=['numero_radicacion', 'estado']),
            models.Index(fields=['numero_factura']),
            models.Index(fields=['codigo_glosa']),
            models.Index(fields=['fecha_aplicacion']),
            models.Index(fields=['estado']),
        ]
    
    def __str__(self):
        return f"Glosa {self.codigo_glosa} - Factura {self.numero_factura} - ${self.valor_glosado}"
    
    def save(self, *args, **kwargs):
        # Calcular porcentaje automáticamente
        if self.valor_servicio > 0:
            self.porcentaje_glosa = (self.valor_glosado / self.valor_servicio) * 100
        
        # Registrar en historial si es actualización
        if self.pk:
            cambio = {
                'fecha': timezone.now().isoformat(),
                'usuario': self.auditor_info.get('username', 'Sistema'),
                'estado_anterior': getattr(self, '_estado_anterior', self.estado),
                'estado_nuevo': self.estado,
                'observacion': getattr(self, '_observacion_cambio', '')
            }
            if not self.historial_cambios:
                self.historial_cambios = []
            self.historial_cambios.append(cambio)
        
        # Actualizar estadísticas
        self.actualizar_estadisticas()
        
        super().save(*args, **kwargs)
    
    def actualizar_estadisticas(self):
        """Actualiza las estadísticas agregadas basadas en las respuestas"""
        if not self.respuestas:
            self.estadisticas = {
                'total_respuestas': 0,
                'valor_total_aceptado': 0,
                'valor_total_rechazado': 0,
                'requiere_conciliacion': False
            }
        else:
            total_aceptado = sum(r.get('valor_aceptado', 0) for r in self.respuestas)
            total_rechazado = sum(r.get('valor_rechazado', 0) for r in self.respuestas)
            
            self.estadisticas = {
                'total_respuestas': len(self.respuestas),
                'valor_total_aceptado': float(total_aceptado),
                'valor_total_rechazado': float(total_rechazado),
                'requiere_conciliacion': total_rechazado > 0
            }
    
    def agregar_respuesta(self, respuesta_data):
        """Agrega una nueva respuesta del prestador"""
        if not self.respuestas:
            self.respuestas = []
        
        respuesta_data['fecha_respuesta'] = timezone.now().isoformat()
        self.respuestas.append(respuesta_data)
        
        # Actualizar estado según el tipo de respuesta
        tipo_respuesta = respuesta_data.get('tipo_respuesta')
        if tipo_respuesta == 'RE97':  # Totalmente aceptada
            self.estado = 'ACEPTADA'
        elif tipo_respuesta in ['RE98', 'RE99']:  # Parcialmente aceptada o no aceptada
            self.estado = 'EN_CONCILIACION'
        else:
            self.estado = 'RESPONDIDA'
        
        self.actualizar_estadisticas()
        self.save()