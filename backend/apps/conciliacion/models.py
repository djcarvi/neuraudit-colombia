from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django.utils import timezone
from bson import ObjectId

class CasoConciliacion(models.Model):
    """
    Modelo NoSQL para casos de conciliacion de cuentas medicas
    Independiente de auditoria pero usando datos reales de MongoDB
    """
    # Campo ObjectId para MongoDB
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias a datos reales de auditoria
    radicacion_id = models.CharField(max_length=24, help_text="ID de la radicacion original")
    numero_radicacion = models.CharField(max_length=50, unique=True)
    
    # Informacion embebida del prestador (NoSQL puro)
    prestador_info = models.JSONField(
        default=dict,
        help_text="Informacion completa del prestador"
    )
    
    # Facturas incluidas en el caso (embebidas)
    facturas = models.JSONField(
        default=list,
        help_text="Lista de facturas incluidas en la conciliacion"
    )
    
    # Resumen financiero agregado (NoSQL)
    resumen_financiero = models.JSONField(
        default=dict,
        help_text="Resumen financiero del caso"
    )
    
    # Estado del caso
    estado = models.CharField(
        max_length=20,
        default='INICIADA',
        choices=[
            ('INICIADA', 'Iniciada'),
            ('EN_RESPUESTA', 'En Respuesta PSS'),
            ('EN_CONCILIACION', 'En Conciliacion'),
            ('CONCILIADA', 'Conciliada'),
            ('CERRADA', 'Cerrada'),
        ]
    )
    
    # Conciliador asignado (embebido)
    conciliador_asignado = models.JSONField(
        default=dict,
        help_text="Informacion del conciliador asignado"
    )
    
    # Reuniones de conciliacion (embebidas)
    reuniones = models.JSONField(
        default=list,
        help_text="Lista de reuniones de conciliacion"
    )
    
    # Documentos asociados (embebidos)
    documentos = models.JSONField(
        default=list,
        help_text="Documentos del proceso de conciliacion"
    )
    
    # Trazabilidad completa (embebida)
    trazabilidad = models.JSONField(
        default=list,
        help_text="Historial completo de acciones"
    )
    
    # Fechas importantes
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_limite_respuesta = models.DateTimeField(
        help_text="Fecha limite para respuesta del prestador"
    )
    fecha_cierre = models.DateTimeField(null=True, blank=True)
    fecha_ultima_actualizacion = models.DateTimeField(auto_now=True)
    
    # Configuracion de plazos (embebida)
    configuracion_plazos = models.JSONField(
        default=dict,
        help_text="Configuracion de plazos del caso"
    )
    
    # Acta final (embebida)
    acta_final = models.JSONField(
        default=dict,
        blank=True,
        help_text="Acta final de conciliacion"
    )
    
    class Meta:
        db_table = 'conciliacion_caso'
        verbose_name = 'Caso de Conciliacion'
        verbose_name_plural = 'Casos de Conciliacion'
        ordering = ['-fecha_creacion']
        indexes = [
            models.Index(fields=['numero_radicacion']),
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_creacion']),
            models.Index(fields=['fecha_limite_respuesta']),
        ]
    
    def __str__(self):
        return f"Conciliacion {self.numero_radicacion} - {self.estado}"
    
    def save(self, *args, **kwargs):
        # Calcular resumen financiero automaticamente
        self.calcular_resumen_financiero()
        super().save(*args, **kwargs)
    
    def calcular_resumen_financiero(self):
        """Calcula el resumen financiero basado en las facturas embebidas"""
        valor_total_radicado = 0
        valor_total_glosado = 0
        valor_total_aceptado = 0
        valor_total_ratificado = 0
        valor_total_levantado = 0
        total_glosas = 0
        total_servicios = 0
        
        for factura in self.facturas:
            for servicio in factura.get('servicios', []):
                total_servicios += 1
                valor_total_radicado += servicio.get('valor_servicio', 0)
                
                for glosa in servicio.get('glosas_aplicadas', []):
                    total_glosas += 1
                    valor_glosado = glosa.get('valor_glosado', 0)
                    valor_total_glosado += valor_glosado
                    
                    # Calcular segun estado de conciliacion
                    estado_conciliacion = glosa.get('estado_conciliacion', 'PENDIENTE')
                    if estado_conciliacion == 'RATIFICADA':
                        valor_total_ratificado += valor_glosado
                    elif estado_conciliacion == 'LEVANTADA':
                        valor_total_levantado += valor_glosado
                    
                    # Valor aceptado por prestador
                    respuesta = glosa.get('respuesta_prestador', {})
                    valor_total_aceptado += respuesta.get('valor_aceptado', 0)
        
        valor_en_disputa = valor_total_glosado - valor_total_aceptado - valor_total_levantado
        
        self.resumen_financiero = {
            'valor_total_radicado': float(valor_total_radicado),
            'valor_total_glosado': float(valor_total_glosado),
            'valor_total_aceptado': float(valor_total_aceptado),
            'valor_total_ratificado': float(valor_total_ratificado),
            'valor_total_levantado': float(valor_total_levantado),
            'valor_en_disputa': float(valor_en_disputa),
            'porcentaje_glosado': float((valor_total_glosado / valor_total_radicado * 100) if valor_total_radicado > 0 else 0),
            'porcentaje_ratificado': float((valor_total_ratificado / valor_total_glosado * 100) if valor_total_glosado > 0 else 0),
            'total_glosas': total_glosas,
            'total_servicios': total_servicios
        }