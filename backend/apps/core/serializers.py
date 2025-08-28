# -*- coding: utf-8 -*-
# apps/core/serializers.py

"""
Serializers para Sistema de Asignación Automática
MongoDB + django_mongodb_backend compatibility
"""

from rest_framework import serializers
from bson import ObjectId
import json

from .models import (
    AuditorPerfil, AsignacionAutomatica, AsignacionAuditoria,
    TrazabilidadAsignacion, ConfiguracionAlgoritmo, MetricaRendimiento
)

# =====================================
# SERIALIZER BASE PARA MONGODB
# =====================================

class MongoIdField(serializers.Field):
    """
    Campo personalizado para manejar ObjectId de MongoDB
    """
    
    def to_representation(self, value):
        """Convierte ObjectId a string para JSON"""
        if isinstance(value, ObjectId):
            return str(value)
        return value
    
    def to_internal_value(self, data):
        """Convierte string a ObjectId"""
        if isinstance(data, str):
            try:
                return ObjectId(data)
            except:
                raise serializers.ValidationError("Invalid ObjectId format")
        return data

# =====================================
# 1. AUDITOR PERFIL SERIALIZER
# =====================================

class AuditorPerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para perfiles de auditores
    """
    
    id = MongoIdField(read_only=True)
    
    # Campos calculados (se agregan dinámicamente)
    carga_actual = serializers.JSONField(read_only=True, required=False)
    porcentaje_carga = serializers.FloatField(read_only=True, required=False)
    capacidad_disponible = serializers.IntegerField(read_only=True, required=False)
    
    class Meta:
        model = AuditorPerfil
        fields = [
            'id', 'username', 'nombres', 'apellidos', 'documento', 'email',
            'perfil', 'especializacion', 'registro_medico', 'capacidad_maxima_dia',
            'tipos_auditoria_permitidos', 'disponibilidad', 'metricas_historicas',
            'fecha_ingreso', 'fecha_actualizacion', 'activo',
            # Campos calculados
            'carga_actual', 'porcentaje_carga', 'capacidad_disponible'
        ]
        read_only_fields = ['fecha_ingreso', 'fecha_actualizacion']
    
    def validate_tipos_auditoria_permitidos(self, value):
        """Validar tipos de auditoría permitidos"""
        tipos_validos = ['AMBULATORIO', 'HOSPITALARIO']
        
        if not isinstance(value, list):
            raise serializers.ValidationError("Debe ser una lista")
        
        for tipo in value:
            if tipo not in tipos_validos:
                raise serializers.ValidationError(f"Tipo inválido: {tipo}")
        
        return value
    
    def validate_disponibilidad(self, value):
        """Validar estructura de disponibilidad"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("disponibilidad debe ser un objeto")
        
        # Campos requeridos
        required_fields = ['activo']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Campo requerido: {field}")
        
        return value

class AuditorPerfilListSerializer(AuditorPerfilSerializer):
    """
    Serializer optimizado para listas de auditores
    """
    
    class Meta(AuditorPerfilSerializer.Meta):
        fields = [
            'id', 'username', 'nombres', 'apellidos', 'perfil',
            'capacidad_maxima_dia', 'disponibilidad', 
            'carga_actual', 'porcentaje_carga'
        ]

# =====================================
# 2. ASIGNACION AUTOMATICA SERIALIZER
# =====================================

class AsignacionAutomaticaSerializer(serializers.ModelSerializer):
    """
    Serializer para propuestas de asignación automática
    """
    
    id = MongoIdField(read_only=True)
    coordinador_id = MongoIdField()
    
    class Meta:
        model = AsignacionAutomatica
        fields = [
            'id', 'fecha_propuesta', 'coordinador_id', 'algoritmo_version',
            'estado', 'fecha_aprobacion', 'metricas_distribucion',
            'asignaciones_individuales', 'decisiones_coordinador', 'trazabilidad'
        ]
        read_only_fields = ['fecha_propuesta']
    
    def validate_estado(self, value):
        """Validar transiciones de estado"""
        estados_validos = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'PARCIAL']
        
        if value not in estados_validos:
            raise serializers.ValidationError(f"Estado inválido: {value}")
        
        return value

class AsignacionAutomaticaListSerializer(AsignacionAutomaticaSerializer):
    """
    Serializer optimizado para listas de propuestas
    """
    
    class Meta(AsignacionAutomaticaSerializer.Meta):
        fields = [
            'id', 'fecha_propuesta', 'estado', 'algoritmo_version',
            'metricas_distribucion'
        ]

# =====================================
# 3. ASIGNACION AUDITORIA SERIALIZER
# =====================================

class AsignacionAuditoriaSerializer(serializers.ModelSerializer):
    """
    Serializer para asignaciones individuales de auditoría
    """
    
    id = MongoIdField(read_only=True)
    propuesta_id = MongoIdField()
    radicacion_id = MongoIdField()
    
    # Información de radicación (se puede incluir via lookup)
    radicacion_info = serializers.JSONField(read_only=True, required=False)
    auditor_info = serializers.JSONField(read_only=True, required=False)
    
    class Meta:
        model = AsignacionAuditoria
        fields = [
            'id', 'propuesta_id', 'radicacion_id', 'auditor_username',
            'tipo_auditoria', 'estado', 'fecha_asignacion', 'fecha_limite',
            'fecha_inicio', 'fecha_completado', 'prioridad', 'valor_auditoria',
            'metadatos',
            # Campos de lookup
            'radicacion_info', 'auditor_info'
        ]
        read_only_fields = ['fecha_asignacion']
    
    def validate_tipo_auditoria(self, value):
        """Validar tipo de auditoría"""
        tipos_validos = ['AMBULATORIO', 'HOSPITALARIO']
        
        if value not in tipos_validos:
            raise serializers.ValidationError(f"Tipo inválido: {value}")
        
        return value
    
    def validate_estado(self, value):
        """Validar estado de asignación"""
        estados_validos = ['ASIGNADA', 'EN_PROCESO', 'COMPLETADA', 'SUSPENDIDA']
        
        if value not in estados_validos:
            raise serializers.ValidationError(f"Estado inválido: {value}")
        
        return value

class AsignacionAuditoriaListSerializer(AsignacionAuditoriaSerializer):
    """
    Serializer optimizado para listas de asignaciones
    """
    
    class Meta(AsignacionAuditoriaSerializer.Meta):
        fields = [
            'id', 'radicacion_id', 'auditor_username', 'tipo_auditoria',
            'estado', 'fecha_asignacion', 'prioridad', 'valor_auditoria',
            'radicacion_info'
        ]

# =====================================
# 4. TRAZABILIDAD SERIALIZER
# =====================================

class TrazabilidadAsignacionSerializer(serializers.ModelSerializer):
    """
    Serializer para eventos de trazabilidad
    """
    
    id = MongoIdField(read_only=True)
    asignacion_id = MongoIdField()
    
    class Meta:
        model = TrazabilidadAsignacion
        fields = [
            'id', 'asignacion_id', 'timestamp', 'usuario', 'evento',
            'detalles', 'impacto'
        ]
        read_only_fields = ['timestamp']
    
    def validate_evento(self, value):
        """Validar tipo de evento"""
        eventos_validos = [
            'PROPUESTA_GENERADA', 'APROBACION_MASIVA', 'APROBACION_INDIVIDUAL',
            'REASIGNACION', 'RECHAZO', 'INICIO_AUDITORIA', 'FINALIZACION_AUDITORIA'
        ]
        
        if value not in eventos_validos:
            raise serializers.ValidationError(f"Evento inválido: {value}")
        
        return value

# =====================================
# 5. CONFIGURACION ALGORITMO SERIALIZER
# =====================================

class ConfiguracionAlgoritmoSerializer(serializers.ModelSerializer):
    """
    Serializer para configuraciones del algoritmo
    """
    
    id = MongoIdField(read_only=True)
    
    class Meta:
        model = ConfiguracionAlgoritmo
        fields = [
            'id', 'clave', 'valor', 'descripcion', 'categoria',
            'version', 'activo', 'fecha_actualizacion', 'actualizado_por'
        ]
        read_only_fields = ['fecha_actualizacion']
    
    def validate_clave(self, value):
        """Validar unicidad de clave"""
        if self.instance is None:  # Creación
            if ConfiguracionAlgoritmo.objects.filter(clave=value, activo=True).exists():
                raise serializers.ValidationError("Ya existe una configuración activa con esta clave")
        
        return value

# =====================================
# 6. METRICA RENDIMIENTO SERIALIZER
# =====================================

class MetricaRendimientoSerializer(serializers.ModelSerializer):
    """
    Serializer para métricas de rendimiento
    """
    
    id = MongoIdField(read_only=True)
    
    class Meta:
        model = MetricaRendimiento
        fields = [
            'id', 'fecha_inicio', 'fecha_fin', 'tipo', 'objetivo_id',
            'metricas', 'contexto'
        ]
    
    def validate_fechas(self, attrs):
        """Validar que fecha_fin > fecha_inicio"""
        fecha_inicio = attrs.get('fecha_inicio')
        fecha_fin = attrs.get('fecha_fin')
        
        if fecha_inicio and fecha_fin and fecha_fin <= fecha_inicio:
            raise serializers.ValidationError("fecha_fin debe ser posterior a fecha_inicio")
        
        return attrs
    
    def validate(self, attrs):
        """Validaciones generales"""
        return self.validate_fechas(attrs)

# =====================================
# 7. SERIALIZERS PARA REQUESTS/RESPONSES
# =====================================

class DecisionCoordinadorSerializer(serializers.Serializer):
    """
    Serializer para decisiones del coordinador
    """
    
    accion = serializers.ChoiceField(
        choices=['APROBAR_MASIVO', 'RECHAZAR_MASIVO', 'APROBAR_INDIVIDUAL', 'REASIGNAR'],
        required=True
    )
    radicaciones_ids = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    justificacion = serializers.CharField(
        max_length=500,
        required=False
    )
    reasignaciones = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )
    
    def validate(self, attrs):
        """Validar campos según acción"""
        accion = attrs.get('accion')
        
        if accion == 'RECHAZAR_MASIVO' and not attrs.get('justificacion'):
            raise serializers.ValidationError("justificacion es requerida para RECHAZAR_MASIVO")
        
        if accion == 'APROBAR_INDIVIDUAL' and not attrs.get('radicaciones_ids'):
            raise serializers.ValidationError("radicaciones_ids es requerido para APROBAR_INDIVIDUAL")
        
        if accion == 'REASIGNAR' and not attrs.get('reasignaciones'):
            raise serializers.ValidationError("reasignaciones es requerido para REASIGNAR")
        
        return attrs

class AsignacionManualSerializer(serializers.Serializer):
    """
    Serializer para asignaciones manuales
    """
    
    radicacion_id = serializers.CharField(required=True)
    auditor_username = serializers.CharField(required=True)
    tipo_auditoria = serializers.ChoiceField(
        choices=['AMBULATORIO', 'HOSPITALARIO'],
        required=True
    )
    prioridad = serializers.ChoiceField(
        choices=['ALTA', 'MEDIA', 'BAJA'],
        required=True
    )
    valor_auditoria = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        required=False,
        default=0
    )
    
    def validate_radicacion_id(self, value):
        """Validar formato ObjectId"""
        try:
            ObjectId(value)
        except:
            raise serializers.ValidationError("Formato de radicacion_id inválido")
        
        return value