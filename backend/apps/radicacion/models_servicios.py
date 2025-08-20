"""
Modelos para almacenar servicios extraídos de los RIPS
Parte del módulo de radicación - NO de auditoría
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django.utils import timezone
from decimal import Decimal


class ServicioRIPS(models.Model):
    """
    Servicios extraídos del archivo RIPS durante la radicación
    Este modelo almacena TODOS los servicios del RIPS para consulta posterior
    """
    
    TIPO_SERVICIO_CHOICES = [
        ('CONSULTA', 'Consulta'),
        ('PROCEDIMIENTO', 'Procedimiento'),
        ('MEDICAMENTO', 'Medicamento'),
        ('OTRO_SERVICIO', 'Otro Servicio'),
        ('URGENCIA', 'Urgencia'),
        ('HOSPITALIZACION', 'Hospitalización'),
        ('RECIEN_NACIDO', 'Recién Nacido'),
        ('TRASLADO', 'Traslado'),
    ]
    
    # Identificación
    id = ObjectIdAutoField(primary_key=True)
    
    # Relación con la radicación
    radicacion = models.ForeignKey(
        'RadicacionCuentaMedica',
        on_delete=models.CASCADE,
        related_name='servicios_rips',
        verbose_name="Radicación"
    )
    
    # Relación con el documento RIPS origen
    documento_rips = models.ForeignKey(
        'DocumentoSoporte',
        on_delete=models.CASCADE,
        related_name='servicios_extraidos',
        verbose_name="Documento RIPS"
    )
    
    # Información del usuario/paciente
    usuario_tipo_documento = models.CharField(max_length=5, verbose_name="Tipo Doc Usuario")
    usuario_numero_documento = models.CharField(max_length=20, verbose_name="Número Doc Usuario")
    usuario_consecutivo = models.CharField(max_length=20, blank=True, verbose_name="Consecutivo Usuario")
    
    # Tipo y datos del servicio
    tipo_servicio = models.CharField(
        max_length=20,
        choices=TIPO_SERVICIO_CHOICES,
        verbose_name="Tipo de Servicio"
    )
    
    # Campos comunes a todos los servicios
    codigo_servicio = models.CharField(max_length=20, verbose_name="Código Servicio/Procedimiento")
    descripcion_servicio = models.TextField(blank=True, verbose_name="Descripción")
    cantidad = models.IntegerField(default=1, verbose_name="Cantidad")
    valor_unitario = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Valor Unitario"
    )
    valor_total = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        verbose_name="Valor Total Servicio"
    )
    
    # Fechas del servicio
    fecha_inicio = models.DateTimeField(null=True, blank=True, verbose_name="Fecha Inicio")
    fecha_fin = models.DateTimeField(null=True, blank=True, verbose_name="Fecha Fin")
    
    # Diagnósticos
    diagnostico_principal = models.CharField(max_length=10, blank=True, verbose_name="Dx Principal")
    diagnosticos_relacionados = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Dx Relacionados"
    )
    
    # JSON completo del servicio según RIPS
    datos_rips_completos = models.JSONField(
        default=dict,
        verbose_name="Datos RIPS Completos",
        help_text="JSON completo del servicio tal como viene en el RIPS"
    )
    
    # Metadatos de procesamiento
    fecha_procesamiento = models.DateTimeField(default=timezone.now, verbose_name="Fecha Procesamiento")
    numero_linea_rips = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Número Línea en RIPS",
        help_text="Para archivos grandes, indica la línea del archivo"
    )
    
    # Control de calidad
    tiene_inconsistencias = models.BooleanField(default=False, verbose_name="¿Tiene Inconsistencias?")
    inconsistencias = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Inconsistencias Detectadas"
    )
    
    class Meta:
        db_table = 'neuraudit_servicios_rips'
        verbose_name = 'Servicio RIPS'
        verbose_name_plural = 'Servicios RIPS'
        indexes = [
            models.Index(fields=['radicacion', 'tipo_servicio']),
            models.Index(fields=['usuario_numero_documento']),
            models.Index(fields=['codigo_servicio']),
            models.Index(fields=['fecha_procesamiento']),
        ]
    
    def __str__(self):
        return f"{self.tipo_servicio} - {self.codigo_servicio} - ${self.valor_total}"
    
    def validar_valores(self):
        """
        Valida coherencia de valores
        """
        if self.valor_unitario and self.cantidad:
            valor_calculado = self.valor_unitario * self.cantidad
            if abs(valor_calculado - self.valor_total) > Decimal('0.01'):
                self.tiene_inconsistencias = True
                self.inconsistencias.append({
                    'tipo': 'VALOR_INCONSISTENTE',
                    'mensaje': f'Valor calculado {valor_calculado} != Valor total {self.valor_total}'
                })


class ResumenServiciosRadicacion(models.Model):
    """
    Resumen agregado de servicios por radicación
    Para consultas rápidas sin procesar todos los servicios
    """
    id = ObjectIdAutoField(primary_key=True)
    
    radicacion = models.OneToOneField(
        'RadicacionCuentaMedica',
        on_delete=models.CASCADE,
        related_name='resumen_servicios',
        verbose_name="Radicación"
    )
    
    # Totales por tipo
    total_servicios = models.IntegerField(default=0, verbose_name="Total Servicios")
    total_usuarios_unicos = models.IntegerField(default=0, verbose_name="Usuarios Únicos")
    
    # Contadores por tipo
    total_consultas = models.IntegerField(default=0)
    total_procedimientos = models.IntegerField(default=0)
    total_medicamentos = models.IntegerField(default=0)
    total_otros_servicios = models.IntegerField(default=0)
    total_urgencias = models.IntegerField(default=0)
    total_hospitalizaciones = models.IntegerField(default=0)
    
    # Valores agregados
    valor_total_servicios = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=Decimal('0'),
        verbose_name="Valor Total Servicios"
    )
    valor_total_consultas = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    valor_total_procedimientos = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    valor_total_medicamentos = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0'))
    
    # Estadísticas
    promedio_valor_servicio = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Promedio Valor/Servicio"
    )
    
    # Metadatos
    fecha_calculo = models.DateTimeField(auto_now=True, verbose_name="Fecha Cálculo")
    tiempo_procesamiento_segundos = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Tiempo Procesamiento (seg)"
    )
    
    # Para archivos grandes
    archivo_procesado_completo = models.BooleanField(
        default=True,
        verbose_name="¿Archivo Procesado Completo?",
        help_text="False si el archivo era muy grande y se procesó parcialmente"
    )
    registros_procesados = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Registros Procesados",
        help_text="Para archivos parciales, cuántos registros se procesaron"
    )
    
    class Meta:
        db_table = 'neuraudit_resumen_servicios'
        verbose_name = 'Resumen Servicios Radicación'
        verbose_name_plural = 'Resúmenes Servicios Radicación'
    
    def __str__(self):
        return f"Resumen {self.radicacion.numero_radicado} - {self.total_servicios} servicios"