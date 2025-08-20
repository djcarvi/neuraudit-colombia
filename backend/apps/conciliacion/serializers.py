from rest_framework import serializers
from django_mongodb_backend.fields import ObjectIdAutoField
from .models import CasoConciliacion
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class ObjectIdField(serializers.Field):
    """Serializer field para ObjectId de MongoDB"""
    
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return str(value) if value else None
    
    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except Exception:
            raise serializers.ValidationError("Invalid ObjectId format")

class CasoConciliacionSerializer(serializers.ModelSerializer):
    """
    Serializer NoSQL para casos de conciliación
    Maneja toda la estructura embebida de MongoDB
    """
    id = ObjectIdField(read_only=True)
    
    # Campos embebidos (NoSQL puro)
    prestador_info = serializers.JSONField()
    facturas = serializers.JSONField()
    resumen_financiero = serializers.JSONField(read_only=True)
    conciliador_asignado = serializers.JSONField()
    reuniones = serializers.JSONField(default=list)
    documentos = serializers.JSONField(default=list)
    trazabilidad = serializers.JSONField(read_only=True)
    configuracion_plazos = serializers.JSONField(default=dict)
    acta_final = serializers.JSONField(read_only=True)
    
    # Campos calculados
    dias_para_respuesta = serializers.SerializerMethodField()
    total_glosas_pendientes = serializers.SerializerMethodField()
    porcentaje_completado = serializers.SerializerMethodField()
    
    class Meta:
        model = CasoConciliacion
        fields = [
            'id', 'radicacion_id', 'numero_radicacion', 'prestador_info',
            'facturas', 'resumen_financiero', 'estado', 'conciliador_asignado',
            'reuniones', 'documentos', 'trazabilidad', 'fecha_creacion',
            'fecha_limite_respuesta', 'fecha_cierre', 'fecha_ultima_actualizacion',
            'configuracion_plazos', 'acta_final', 'dias_para_respuesta',
            'total_glosas_pendientes', 'porcentaje_completado'
        ]
        read_only_fields = [
            'id', 'resumen_financiero', 'trazabilidad', 'acta_final',
            'fecha_creacion', 'fecha_ultima_actualizacion'
        ]
    
    def get_dias_para_respuesta(self, obj):
        """Calcula días restantes para respuesta"""
        if not obj.fecha_limite_respuesta:
            return None
        
        from django.utils import timezone
        delta = obj.fecha_limite_respuesta - timezone.now()
        return delta.days if delta.days >= 0 else 0
    
    def get_total_glosas_pendientes(self, obj):
        """Cuenta glosas pendientes de respuesta o decisión"""
        total_pendientes = 0
        for factura in obj.facturas:
            for servicio in factura.get('servicios', []):
                for glosa in servicio.get('glosas_aplicadas', []):
                    if glosa.get('estado_conciliacion') == 'PENDIENTE':
                        total_pendientes += 1
        return total_pendientes
    
    def get_porcentaje_completado(self, obj):
        """Calcula porcentaje de completado del caso"""
        total_glosas = 0
        glosas_procesadas = 0
        
        for factura in obj.facturas:
            for servicio in factura.get('servicios', []):
                for glosa in servicio.get('glosas_aplicadas', []):
                    total_glosas += 1
                    if glosa.get('estado_conciliacion') in ['RATIFICADA', 'LEVANTADA']:
                        glosas_procesadas += 1
        
        return round((glosas_procesadas / total_glosas * 100), 2) if total_glosas > 0 else 0

class CasoConciliacionListSerializer(serializers.ModelSerializer):
    """
    Serializer optimizado para listado de casos
    Incluye campos esenciales + prestador_info para el frontend
    """
    id = ObjectIdField(read_only=True)
    prestador_nombre = serializers.SerializerMethodField()
    conciliador_nombre = serializers.SerializerMethodField()
    valor_total_glosado = serializers.SerializerMethodField()
    total_glosas = serializers.SerializerMethodField()
    dias_para_respuesta = serializers.SerializerMethodField()
    prestador_info = serializers.JSONField()  # Agregar prestador_info completo
    resumen_financiero = serializers.JSONField()  # Agregar resumen_financiero
    
    class Meta:
        model = CasoConciliacion
        fields = [
            'id', 'numero_radicacion', 'prestador_info', 'prestador_nombre', 'estado',
            'conciliador_nombre', 'valor_total_glosado', 'total_glosas',
            'fecha_creacion', 'fecha_limite_respuesta', 'dias_para_respuesta',
            'resumen_financiero', 'radicacion_id'
        ]
    
    def get_prestador_nombre(self, obj):
        return obj.prestador_info.get('razon_social', 'N/A')
    
    def get_conciliador_nombre(self, obj):
        return obj.conciliador_asignado.get('nombre_completo', 'N/A')
    
    def get_valor_total_glosado(self, obj):
        return obj.resumen_financiero.get('valor_total_glosado', 0)
    
    def get_total_glosas(self, obj):
        return obj.resumen_financiero.get('total_glosas', 0)
    
    def get_dias_para_respuesta(self, obj):
        if not obj.fecha_limite_respuesta:
            return None
        
        from django.utils import timezone
        delta = obj.fecha_limite_respuesta - timezone.now()
        return delta.days if delta.days >= 0 else 0

class RespuestaPrestadorSerializer(serializers.Serializer):
    """
    Serializer para respuestas del prestador a glosas
    Estructura NoSQL embebida
    """
    tipo_respuesta = serializers.ChoiceField(
        choices=[
            ('RE97', 'Glosa aceptada totalmente'),
            ('RE98', 'Glosa aceptada parcialmente'),
            ('RE99', 'Glosa no aceptada')
        ]
    )
    valor_aceptado = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_rechazado = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    justificacion = serializers.CharField(max_length=1000)
    soportes = serializers.ListField(
        child=serializers.CharField(max_length=255),
        default=list,
        required=False
    )
    
    def validate(self, data):
        """Validaciones de negocio"""
        valor_aceptado = data.get('valor_aceptado', 0)
        valor_rechazado = data.get('valor_rechazado', 0)
        tipo_respuesta = data.get('tipo_respuesta')
        
        # Validar consistencia entre tipo de respuesta y valores
        if tipo_respuesta == 'RE97' and valor_rechazado > 0:
            raise serializers.ValidationError(
                "Si la glosa es aceptada totalmente, no puede haber valor rechazado"
            )
        
        if tipo_respuesta == 'RE99' and valor_aceptado > 0:
            raise serializers.ValidationError(
                "Si la glosa no es aceptada, no puede haber valor aceptado"
            )
        
        if valor_aceptado < 0 or valor_rechazado < 0:
            raise serializers.ValidationError(
                "Los valores no pueden ser negativos"
            )
        
        return data

class DecisionConciliacionSerializer(serializers.Serializer):
    """
    Serializer para decisiones de conciliación (ratificar/levantar)
    """
    decision = serializers.ChoiceField(
        choices=[
            ('RATIFICAR', 'Ratificar glosa'),
            ('LEVANTAR', 'Levantar glosa')
        ]
    )
    justificacion = serializers.CharField(
        max_length=1000,
        required=False,
        help_text="Requerida para levantar glosas"
    )
    observaciones_adicionales = serializers.CharField(
        max_length=500,
        required=False
    )
    
    def validate(self, data):
        """Validar que se proporcione justificación para levantar glosas"""
        if data.get('decision') == 'LEVANTAR' and not data.get('justificacion'):
            raise serializers.ValidationError(
                "Se requiere justificación para levantar una glosa"
            )
        return data

class ActaConciliacionSerializer(serializers.Serializer):
    """
    Serializer para generación de actas de conciliación
    Estructura NoSQL embebida
    """
    participantes = serializers.ListField(
        child=serializers.DictField(),
        help_text="Lista de participantes con nombre, cargo, entidad"
    )
    acuerdos = serializers.ListField(
        child=serializers.CharField(max_length=500),
        help_text="Lista de acuerdos alcanzados"
    )
    observaciones = serializers.CharField(
        max_length=1000,
        required=False
    )
    fecha_reunion = serializers.DateTimeField(required=False)
    tipo_reunion = serializers.ChoiceField(
        choices=[('VIRTUAL', 'Virtual'), ('PRESENCIAL', 'Presencial')],
        default='VIRTUAL'
    )
    
    def validate_participantes(self, value):
        """Validar estructura de participantes"""
        required_fields = ['nombre', 'cargo', 'entidad']
        for participante in value:
            for field in required_fields:
                if field not in participante:
                    raise serializers.ValidationError(
                        f"Cada participante debe tener: {', '.join(required_fields)}"
                    )
        return value

class EstadisticasConciliacionSerializer(serializers.Serializer):
    """
    Serializer para estadísticas de conciliación
    Datos agregados NoSQL
    """
    total_casos = serializers.IntegerField()
    total_valor_radicado = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_valor_glosado = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_valor_ratificado = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_valor_levantado = serializers.DecimalField(max_digits=15, decimal_places=2)
    valor_en_disputa = serializers.DecimalField(max_digits=15, decimal_places=2)
    porcentaje_glosado = serializers.DecimalField(max_digits=5, decimal_places=2)
    porcentaje_ratificado = serializers.DecimalField(max_digits=5, decimal_places=2)
    casos_por_estado = serializers.DictField()

class GlosaDetalleSerializer(serializers.Serializer):
    """
    Serializer para detalle de glosas en conciliación
    Estructura NoSQL embebida
    """
    glosa_id = serializers.CharField()
    codigo_glosa = serializers.CharField()
    descripcion_glosa = serializers.CharField()
    valor_glosado = serializers.DecimalField(max_digits=12, decimal_places=2)
    auditor_info = serializers.DictField()
    fecha_aplicacion = serializers.DateTimeField()
    observaciones_auditor = serializers.CharField()
    estado_conciliacion = serializers.CharField()
    respuesta_prestador = serializers.DictField(default=dict)
    fecha_ratificacion = serializers.DateTimeField(required=False, allow_null=True)
    fecha_levantamiento = serializers.DateTimeField(required=False, allow_null=True)
    ratificada_por = serializers.DictField(required=False)
    levantada_por = serializers.DictField(required=False)
    justificacion_levantamiento = serializers.CharField(required=False)

class DocumentoConciliacionSerializer(serializers.Serializer):
    """
    Serializer para documentos de conciliación
    Estructura NoSQL embebida
    """
    tipo = serializers.ChoiceField(
        choices=[
            ('RESPUESTA_PSS', 'Respuesta PSS'),
            ('SOPORTE', 'Documento Soporte'),
            ('ACTA', 'Acta de Reunión'),
            ('COMUNICACION', 'Comunicación Oficial')
        ]
    )
    nombre_archivo = serializers.CharField(max_length=255)
    url_archivo = serializers.URLField()
    tamaño_bytes = serializers.IntegerField()
    descripcion = serializers.CharField(max_length=500, required=False)
    glosas_relacionadas = serializers.ListField(
        child=serializers.CharField(),
        default=list
    )
    subido_por = serializers.DictField()
    fecha_subida = serializers.DateTimeField()

class TrazabilidadSerializer(serializers.Serializer):
    """
    Serializer para trazabilidad de acciones
    Estructura NoSQL embebida
    """
    tipo_accion = serializers.CharField()
    accion = serializers.CharField()
    descripcion_detallada = serializers.CharField()
    usuario_info = serializers.DictField()
    fecha_hora = serializers.DateTimeField()
    ip_address = serializers.IPAddressField()
    metadatos_adicionales = serializers.DictField(default=dict)