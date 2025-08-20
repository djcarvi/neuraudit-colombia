# -*- coding: utf-8 -*-
"""
Configuración del admin para el sistema de glosas
"""

from django.contrib import admin
from .models import Glosa, RespuestaGlosa, RatificacionGlosa


@admin.register(Glosa)
class GlosaAdmin(admin.ModelAdmin):
    list_display = [
        'codigo_glosa', 'numero_radicado', 'prestador_nombre',
        'categoria_glosa', 'valor_glosado', 'estado',
        'fecha_formulacion', 'aceptacion_tacita_prestador'
    ]
    list_filter = [
        'estado', 'categoria_glosa', 'aceptacion_tacita_prestador',
        'glosa_injustificada', 'fecha_formulacion'
    ]
    search_fields = [
        'numero_radicado', 'prestador_nit', 'prestador_nombre',
        'factura_numero', 'codigo_glosa'
    ]
    readonly_fields = [
        'fecha_formulacion', 'created_at', 'updated_at',
        'aceptacion_tacita_prestador', 'glosa_injustificada'
    ]
    ordering = ['-fecha_formulacion']


@admin.register(RespuestaGlosa)
class RespuestaGlosaAdmin(admin.ModelAdmin):
    list_display = [
        'glosa', 'codigo_respuesta', 'valor_aceptado_prestador',
        'fecha_respuesta', 'es_extemporanea', 'respondido_por'
    ]
    list_filter = ['codigo_respuesta', 'es_extemporanea', 'fecha_respuesta']
    search_fields = ['glosa__numero_radicado', 'glosa__codigo_glosa']
    readonly_fields = ['fecha_respuesta', 'es_extemporanea']
    ordering = ['-fecha_respuesta']


@admin.register(RatificacionGlosa)
class RatificacionGlosaAdmin(admin.ModelAdmin):
    list_display = [
        'glosa', 'decision', 'valor_final_aceptado',
        'fecha_ratificacion', 'es_extemporanea', 'ratificado_por'
    ]
    list_filter = ['decision', 'es_extemporanea', 'fecha_ratificacion']
    search_fields = ['glosa__numero_radicado', 'glosa__codigo_glosa']
    readonly_fields = ['fecha_ratificacion', 'es_extemporanea']
    ordering = ['-fecha_ratificacion']