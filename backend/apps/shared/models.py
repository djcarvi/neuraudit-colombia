# -*- coding: utf-8 -*-
"""
Modelos base compartidos para NeurAudit Colombia
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()


class BaseModel(models.Model):
    """
    Modelo base con campos de auditoría
    Todos los modelos deben heredar de este
    """
    id = ObjectIdAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='%(class)s_created',
        null=True,
        blank=True,
        verbose_name='Creado por'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='%(class)s_updated',
        null=True,
        blank=True,
        verbose_name='Actualizado por'
    )
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    
    class Meta:
        abstract = True
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        """
        Sobrescribe save para auditoría automática
        """
        # TODO: Obtener usuario del request context
        super().save(*args, **kwargs)
    
    def soft_delete(self):
        """
        Borrado lógico en lugar de físico
        """
        self.is_active = False
        self.save()


class TimestampedModel(models.Model):
    """
    Modelo simple con timestamps sin auditoría de usuario
    Para catálogos y datos de referencia
    """
    id = ObjectIdAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class EstadoMixin(models.Model):
    """
    Mixin para modelos con estados
    """
    ESTADOS_BASE = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_PROCESO', 'En Proceso'),
        ('COMPLETADO', 'Completado'),
        ('RECHAZADO', 'Rechazado'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS_BASE,
        default='PENDIENTE',
        verbose_name='Estado'
    )
    fecha_cambio_estado = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Fecha último cambio de estado'
    )
    
    class Meta:
        abstract = True
    
    def cambiar_estado(self, nuevo_estado, observaciones=None):
        """
        Cambia el estado y registra el cambio
        """
        estado_anterior = self.estado
        self.estado = nuevo_estado
        self.fecha_cambio_estado = datetime.now()
        self.save()
        
        # TODO: Registrar en trazabilidad
        return True


class TrazabilidadMixin(models.Model):
    """
    Mixin para agregar trazabilidad a modelos
    """
    trazabilidad = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Trazabilidad'
    )
    
    class Meta:
        abstract = True
    
    def agregar_trazabilidad(self, evento, usuario=None, detalles=None):
        """
        Agrega un evento a la trazabilidad
        """
        entrada = {
            'evento': evento,
            'fecha': datetime.now().isoformat(),
            'usuario': str(usuario.id) if usuario else 'sistema',
            'detalles': detalles or {}
        }
        
        if not self.trazabilidad:
            self.trazabilidad = []
            
        self.trazabilidad.append(entrada)
        self.save()


class ValorMonetarioMixin(models.Model):
    """
    Mixin para campos monetarios con validación
    """
    valor_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name='Valor Total'
    )
    valor_glosado = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name='Valor Glosado'
    )
    valor_aceptado = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name='Valor Aceptado'
    )
    valor_pagado = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name='Valor Pagado'
    )
    
    class Meta:
        abstract = True
    
    @property
    def valor_neto(self):
        """Calcula el valor neto después de glosas"""
        return self.valor_total - self.valor_glosado
    
    @property
    def porcentaje_glosa(self):
        """Calcula el porcentaje de glosa"""
        if self.valor_total > 0:
            return (self.valor_glosado / self.valor_total) * 100
        return 0
    
    def clean(self):
        """Validaciones de valores monetarios"""
        from django.core.exceptions import ValidationError
        
        if self.valor_glosado > self.valor_total:
            raise ValidationError('El valor glosado no puede ser mayor al valor total')
        
        if self.valor_aceptado > self.valor_neto:
            raise ValidationError('El valor aceptado no puede ser mayor al valor neto')
        
        if self.valor_pagado > self.valor_aceptado:
            raise ValidationError('El valor pagado no puede ser mayor al valor aceptado')