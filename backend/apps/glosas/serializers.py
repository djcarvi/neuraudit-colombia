# -*- coding: utf-8 -*-
"""
Serializers para el sistema de glosas según Resolución 2284
"""

from rest_framework import serializers
from .models import Glosa, RespuestaGlosa, RatificacionGlosa
from datetime import datetime, timedelta


class GlosaSerializer(serializers.ModelSerializer):
    """
    Serializer principal para glosas
    """
    # Campos calculados
    dias_restantes_respuesta = serializers.SerializerMethodField()
    dias_restantes_ratificacion = serializers.SerializerMethodField()
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    categoria_display = serializers.CharField(source='get_categoria_glosa_display', read_only=True)
    porcentaje_aceptacion = serializers.SerializerMethodField()
    
    # Información del creador
    created_by_nombre = serializers.CharField(source='created_by.get_full_name', read_only=True)
    created_by_role = serializers.CharField(source='created_by.role', read_only=True)
    
    class Meta:
        model = Glosa
        fields = [
            'id', 'radicacion_id', 'numero_radicado',
            'prestador_nit', 'prestador_nombre',
            'factura_numero', 'factura_prefijo',
            'codigo_glosa', 'categoria_glosa', 'categoria_display',
            'descripcion_glosa',
            'consecutivo_servicio', 'codigo_servicio', 'descripcion_servicio',
            'valor_glosado', 'valor_aceptado', 'valor_objetado',
            'estado', 'estado_display',
            'fecha_formulacion', 'fecha_notificacion',
            'fecha_limite_respuesta', 'fecha_respuesta_prestador',
            'fecha_limite_ratificacion', 'fecha_ratificacion_eps',
            'respuesta_extemporanea', 'aceptacion_tacita_prestador', 'glosa_injustificada',
            'observaciones_auditoria', 'observaciones_respuesta', 'observaciones_ratificacion',
            'dias_restantes_respuesta', 'dias_restantes_ratificacion',
            'porcentaje_aceptacion',
            'created_by_nombre', 'created_by_role',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'fecha_formulacion', 'created_at', 'updated_at',
            'aceptacion_tacita_prestador', 'glosa_injustificada'
        ]
    
    def get_dias_restantes_respuesta(self, obj):
        """Calcula días restantes para respuesta"""
        return obj.calcular_dias_restantes_respuesta()
    
    def get_dias_restantes_ratificacion(self, obj):
        """Calcula días restantes para ratificación"""
        return obj.calcular_dias_restantes_ratificacion()
    
    def get_porcentaje_aceptacion(self, obj):
        """Calcula porcentaje de aceptación"""
        if obj.valor_glosado > 0:
            return round((obj.valor_aceptado / obj.valor_glosado) * 100, 2)
        return 0
    
    def create(self, validated_data):
        """Crear glosa con cálculo automático de fechas límite"""
        # Obtener usuario del contexto
        request = self.context.get('request')
        if request and request.user:
            validated_data['created_by'] = request.user
        
        # Crear la glosa
        glosa = super().create(validated_data)
        
        # Calcular fecha límite de respuesta (5 días hábiles después de notificación)
        if glosa.fecha_notificacion:
            # Simplificado: 5 días calendario (en producción sería días hábiles)
            glosa.fecha_limite_respuesta = glosa.fecha_notificacion + timedelta(days=5)
            glosa.save()
        
        return glosa


class GlosaListSerializer(serializers.ModelSerializer):
    """
    Serializer optimizado para listados de glosas
    """
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    categoria_display = serializers.CharField(source='get_categoria_glosa_display', read_only=True)
    dias_restantes_respuesta = serializers.SerializerMethodField()
    porcentaje_aceptacion = serializers.SerializerMethodField()
    
    class Meta:
        model = Glosa
        fields = [
            'id', 'numero_radicado', 'prestador_nit', 'prestador_nombre',
            'factura_numero', 'codigo_glosa', 'categoria_glosa', 'categoria_display',
            'descripcion_glosa', 'valor_glosado', 'valor_aceptado',
            'estado', 'estado_display', 'fecha_formulacion',
            'fecha_limite_respuesta', 'dias_restantes_respuesta',
            'aceptacion_tacita_prestador', 'glosa_injustificada',
            'porcentaje_aceptacion'
        ]
    
    def get_dias_restantes_respuesta(self, obj):
        return obj.calcular_dias_restantes_respuesta()
    
    def get_porcentaje_aceptacion(self, obj):
        if obj.valor_glosado > 0:
            return round((obj.valor_aceptado / obj.valor_glosado) * 100, 2)
        return 0


class RespuestaGlosaSerializer(serializers.ModelSerializer):
    """
    Serializer para respuestas a glosas
    """
    codigo_respuesta_display = serializers.CharField(source='get_codigo_respuesta_display', read_only=True)
    respondido_por_nombre = serializers.CharField(source='respondido_por.get_full_name', read_only=True)
    
    class Meta:
        model = RespuestaGlosa
        fields = [
            'id', 'glosa', 'codigo_respuesta', 'codigo_respuesta_display',
            'descripcion_respuesta',
            'valor_aceptado_prestador', 'valor_objetado_prestador', 'valor_subsanado',
            'documentos_soporte', 'observaciones',
            'fecha_respuesta', 'es_extemporanea',
            'respondido_por_nombre'
        ]
        read_only_fields = ['id', 'fecha_respuesta', 'es_extemporanea']
    
    def create(self, validated_data):
        """Crear respuesta con validación de plazos"""
        # Obtener usuario del contexto
        request = self.context.get('request')
        if request and request.user:
            validated_data['respondido_por'] = request.user
        
        respuesta = super().create(validated_data)
        
        # Verificar si la respuesta es extemporánea
        glosa = respuesta.glosa
        if glosa.fecha_limite_respuesta and datetime.now() > glosa.fecha_limite_respuesta:
            respuesta.es_extemporanea = True
            respuesta.save()
        
        # Actualizar estado de la glosa
        glosa.estado = 'RESPONDIDA_1'
        glosa.fecha_respuesta_prestador = respuesta.fecha_respuesta
        glosa.observaciones_respuesta = respuesta.observaciones
        
        # Calcular fecha límite de ratificación (5 días hábiles después de respuesta)
        glosa.fecha_limite_ratificacion = respuesta.fecha_respuesta + timedelta(days=5)
        glosa.save()
        
        return respuesta


class RatificacionGlosaSerializer(serializers.ModelSerializer):
    """
    Serializer para ratificaciones de glosas
    """
    decision_display = serializers.CharField(source='get_decision_display', read_only=True)
    ratificado_por_nombre = serializers.CharField(source='ratificado_por.get_full_name', read_only=True)
    
    class Meta:
        model = RatificacionGlosa
        fields = [
            'id', 'glosa', 'respuesta_glosa',
            'decision', 'decision_display',
            'valor_final_aceptado', 'valor_final_glosado',
            'justificacion',
            'fecha_ratificacion', 'es_extemporanea',
            'ratificado_por_nombre'
        ]
        read_only_fields = ['id', 'fecha_ratificacion', 'es_extemporanea']
    
    def create(self, validated_data):
        """Crear ratificación con actualización de glosa"""
        # Obtener usuario del contexto
        request = self.context.get('request')
        if request and request.user:
            validated_data['ratificado_por'] = request.user
        
        ratificacion = super().create(validated_data)
        
        # Verificar si la ratificación es extemporánea
        glosa = ratificacion.glosa
        if glosa.fecha_limite_ratificacion and datetime.now() > glosa.fecha_limite_ratificacion:
            ratificacion.es_extemporanea = True
            ratificacion.save()
        
        # Actualizar estado y valores de la glosa según la decisión
        if ratificacion.decision == 'ACEPTAR_RESPUESTA':
            glosa.estado = 'CERRADA'
            glosa.valor_aceptado = 0
            glosa.valor_objetado = glosa.valor_glosado
        elif ratificacion.decision == 'RATIFICAR_GLOSA':
            glosa.estado = 'RATIFICADA'
            glosa.valor_aceptado = glosa.valor_glosado
            glosa.valor_objetado = 0
        elif ratificacion.decision == 'ACEPTAR_PARCIAL':
            glosa.estado = 'ACEPTADA_PARCIAL'
            glosa.valor_aceptado = ratificacion.valor_final_aceptado
            glosa.valor_objetado = ratificacion.valor_final_glosado
        elif ratificacion.decision == 'CONCILIACION':
            glosa.estado = 'CONCILIACION'
        
        glosa.fecha_ratificacion_eps = ratificacion.fecha_ratificacion
        glosa.observaciones_ratificacion = ratificacion.justificacion
        glosa.save()
        
        return ratificacion


class EstadisticasGlosasSerializer(serializers.Serializer):
    """
    Serializer para estadísticas de glosas
    """
    # Contadores
    total_glosas = serializers.IntegerField(default=0)
    total_respondidas = serializers.IntegerField(default=0)
    total_ratificadas = serializers.IntegerField(default=0)
    total_aceptadas = serializers.IntegerField(default=0)
    total_objetadas = serializers.IntegerField(default=0)
    total_extemporaneas = serializers.IntegerField(default=0)
    total_conciliacion = serializers.IntegerField(default=0)
    
    # Valores monetarios
    valor_total_glosado = serializers.DecimalField(max_digits=18, decimal_places=2, default=0)
    valor_total_aceptado = serializers.DecimalField(max_digits=18, decimal_places=2, default=0)
    valor_total_objetado = serializers.DecimalField(max_digits=18, decimal_places=2, default=0)
    
    # Porcentajes
    porcentaje_respuesta = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    porcentaje_aceptacion = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    porcentaje_objecion = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Promedios de tiempo
    promedio_dias_respuesta = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    promedio_dias_ratificacion = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Por categoría
    estadisticas_por_categoria = serializers.DictField(child=serializers.DictField(), default=dict)
    
    # Por prestador (top 10)
    top_prestadores_glosados = serializers.ListField(child=serializers.DictField(), default=list)