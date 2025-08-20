"""
Administración Django para Radicación de Cuentas Médicas
"""

from django.contrib import admin
from .models import RadicacionCuentaMedica, DocumentoSoporte, ValidacionRIPS


@admin.register(RadicacionCuentaMedica)
class RadicacionCuentaMedicaAdmin(admin.ModelAdmin):
    list_display = [
        'numero_radicado', 'pss_nombre', 'factura_numero', 'factura_valor_total',
        'estado', 'fecha_radicacion', 'days_remaining', 'created_at'
    ]
    list_filter = ['estado', 'modalidad_pago', 'tipo_servicio', 'created_at']
    search_fields = [
        'numero_radicado', 'factura_numero', 'pss_nombre', 'pss_nit',
        'paciente_nombres', 'paciente_apellidos', 'paciente_numero_documento'
    ]
    readonly_fields = ['numero_radicado', 'fecha_radicacion', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Información de Radicación', {
            'fields': ('numero_radicado', 'estado', 'fecha_radicacion', 'fecha_limite_radicacion')
        }),
        ('Prestador', {
            'fields': ('pss_nit', 'pss_nombre', 'pss_codigo_reps', 'usuario_radicador')
        }),
        ('Factura', {
            'fields': ('factura_numero', 'factura_prefijo', 'factura_fecha_expedicion', 
                      'factura_valor_total', 'factura_moneda')
        }),
        ('Clasificación', {
            'fields': ('modalidad_pago', 'tipo_servicio')
        }),
        ('Paciente', {
            'fields': ('paciente_tipo_documento', 'paciente_numero_documento',
                      'paciente_nombres', 'paciente_apellidos', 'paciente_fecha_nacimiento', 'paciente_sexo')
        }),
        ('Información Clínica', {
            'fields': ('fecha_atencion_inicio', 'fecha_atencion_fin', 
                      'diagnostico_principal', 'diagnosticos_relacionados')
        }),
        ('Control', {
            'fields': ('version', 'observaciones', 'created_at', 'updated_at')
        })
    )


@admin.register(DocumentoSoporte)
class DocumentoSoporteAdmin(admin.ModelAdmin):
    list_display = [
        'radicacion', 'tipo_documento', 'nombre_archivo', 'estado',
        'archivo_size_mb', 'created_at'
    ]
    list_filter = ['tipo_documento', 'estado', 'extension', 'created_at']
    search_fields = ['radicacion__numero_radicado', 'nombre_archivo', 'tipo_documento']
    readonly_fields = ['archivo_hash', 'archivo_size', 'created_at', 'updated_at']
    
    def archivo_size_mb(self, obj):
        if obj.archivo_size:
            return f"{obj.archivo_size / (1024 * 1024):.2f} MB"
        return "0 MB"
    archivo_size_mb.short_description = 'Tamaño'


@admin.register(ValidacionRIPS)
class ValidacionRIPSAdmin(admin.ModelAdmin):
    list_display = [
        'documento', 'codigo_validacion_minsalud', 'estado_validacion',
        'es_valido', 'total_registros', 'registros_validos', 'fecha_validacion'
    ]
    list_filter = ['estado_validacion', 'es_valido', 'fecha_validacion']
    search_fields = ['codigo_validacion_minsalud', 'documento__radicacion__numero_radicado']
    readonly_fields = ['fecha_validacion', 'fecha_respuesta_api']