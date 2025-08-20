"""
Modelos para manejo de facturas y servicios en auditoría
NO MODIFICA los modelos existentes de radicación
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django.utils import timezone
from decimal import Decimal

class FacturaRadicada(models.Model):
    """
    Representa cada factura dentro de una radicación
    Una radicación puede tener múltiples facturas
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias embebidas (enfoque NoSQL)
    radicacion_id = models.CharField(max_length=24, help_text="ID de la radicación")
    radicacion_info = models.JSONField(
        default=dict,
        help_text="Información embebida de la radicación"
    )
    # radicacion_info contiene: {numero_radicacion, fecha_radicacion, prestador_nombre, prestador_nit}
    
    # Datos de la factura
    numero_factura = models.CharField(max_length=50)
    fecha_expedicion = models.DateField()
    valor_total = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Resumen de servicios por tipo
    total_consultas = models.IntegerField(default=0)
    total_procedimientos = models.IntegerField(default=0)
    total_medicamentos = models.IntegerField(default=0)
    total_otros_servicios = models.IntegerField(default=0)
    total_urgencias = models.IntegerField(default=0)
    total_hospitalizaciones = models.IntegerField(default=0)
    total_recien_nacidos = models.IntegerField(default=0)
    
    # Valores por tipo
    valor_consultas = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    valor_procedimientos = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    valor_medicamentos = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    valor_otros_servicios = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    
    # Estado de auditoría
    estado_auditoria = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('EN_REVISION', 'En Revisión'),
            ('GLOSADA', 'Glosada'),
            ('APROBADA', 'Aprobada'),
        ],
        default='PENDIENTE'
    )
    
    # JSON completo de servicios (se carga bajo demanda)
    servicios_json = models.JSONField(null=True, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'auditoria_facturas'
        indexes = [
            models.Index(fields=['radicacion_id', 'numero_factura']),
            models.Index(fields=['estado_auditoria']),
        ]
    
    def __str__(self):
        return f"Factura {self.numero_factura}"


class ServicioFacturado(models.Model):
    """
    Representa cada servicio dentro de una factura
    Solo campos esenciales para la vista de auditoría
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias embebidas (enfoque NoSQL)
    factura_id = models.CharField(max_length=24, help_text="ID de la factura")
    factura_info = models.JSONField(
        default=dict,
        help_text="Información embebida de la factura"
    )
    # factura_info contiene: {numero_factura, fecha_expedicion, valor_total}
    
    # Tipo de servicio
    tipo_servicio = models.CharField(
        max_length=20,
        choices=[
            ('CONSULTA', 'Consulta'),
            ('PROCEDIMIENTO', 'Procedimiento'),
            ('MEDICAMENTO', 'Medicamento'),
            ('OTRO_SERVICIO', 'Otro Servicio'),
            ('URGENCIA', 'Urgencia'),
            ('HOSPITALIZACION', 'Hospitalización'),
            ('RECIEN_NACIDO', 'Recién Nacido'),
        ]
    )
    
    # Campos comunes a todos los servicios
    codigo = models.CharField(max_length=50)  # codConsulta, codProcedimiento, etc.
    descripcion = models.CharField(max_length=500)
    cantidad = models.IntegerField(default=1)
    valor_unitario = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    valor_total = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    # Campos específicos según tipo
    fecha_inicio = models.DateTimeField(null=True, blank=True)  # Para urgencias/hospitalizacion
    fecha_fin = models.DateTimeField(null=True, blank=True)
    condicion_egreso = models.CharField(max_length=100, null=True, blank=True)
    
    # Para recién nacidos
    tipo_documento = models.CharField(max_length=5, null=True, blank=True)
    numero_documento = models.CharField(max_length=20, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    sexo_biologico = models.CharField(max_length=1, null=True, blank=True)
    
    # JSON completo del servicio (para ver detalle)
    detalle_json = models.JSONField(null=True, blank=True)
    
    # Glosas aplicadas a este servicio
    tiene_glosa = models.BooleanField(default=False)
    glosas_aplicadas = models.JSONField(
        default=list,
        blank=True,
        help_text="Lista de glosas aplicadas a este servicio"
    )
    # glosas_aplicadas contiene: [{codigo_glosa, descripcion, valor_glosado, fecha_aplicacion, auditor}]
    
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'auditoria_servicios'
        indexes = [
            models.Index(fields=['factura_id', 'tipo_servicio']),
            models.Index(fields=['codigo']),
        ]
    
    def __str__(self):
        return f"{self.tipo_servicio}: {self.codigo}"