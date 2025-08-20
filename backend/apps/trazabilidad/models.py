# -*- coding: utf-8 -*-
"""
Modelo de Trazabilidad para NeurAudit Colombia
Sistema de auditoria completa de acciones
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel
from django.utils import timezone

class RegistroTrazabilidad(models.Model):
    """
    Registro completo de trazabilidad de acciones en el sistema
    Cumple con requisitos de auditoria de Resolucion 2284
    """
    
    ACCION_CHOICES = [
        ('RADICACION', 'Radicacion de Cuenta'),
        ('DEVOLUCION', 'Devolucion'),
        ('ASIGNACION_AUDITORIA', 'Asignacion a Auditoria'),
        ('AUDITORIA_MEDICA', 'Auditoria Medica'),
        ('AUDITORIA_ADMINISTRATIVA', 'Auditoria Administrativa'),
        ('GLOSA_CREADA', 'Glosa Creada'),
        ('GLOSA_RESPONDIDA', 'Glosa Respondida'),
        ('CONCILIACION_INICIADA', 'Conciliacion Iniciada'),
        ('CONCILIACION_COMPLETADA', 'Conciliacion Completada'),
        ('PAGO_AUTORIZADO', 'Pago Autorizado'),
        ('PAGO_REALIZADO', 'Pago Realizado'),
        ('DOCUMENTO_SUBIDO', 'Documento Subido'),
        ('DOCUMENTO_VALIDADO', 'Documento Validado'),
        ('ESTADO_CAMBIADO', 'Estado Cambiado'),
    ]
    
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia a la radicacion (principal)
    radicacion = models.ForeignKey(
        'radicacion.RadicacionCuentaMedica',
        on_delete=models.CASCADE,
        related_name='trazabilidad'
    )
    
    # Accion realizada
    accion = models.CharField(max_length=30, choices=ACCION_CHOICES)
    descripcion = models.TextField(verbose_name="Descripcion")
    
    # Usuario que realizo la accion
    usuario = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='acciones_realizadas'
    )
    
    # Informacion adicional
    metadatos = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Timestamp
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'neuraudit_trazabilidad'
        verbose_name = 'Registro Trazabilidad'
        verbose_name_plural = 'Registros Trazabilidad'
        indexes = [
            models.Index(fields=['radicacion']),
            models.Index(fields=['accion']),
            models.Index(fields=['usuario']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.accion} - {self.radicacion.numero_radicado} - {self.usuario.username}"