from rest_framework import serializers
from bson import ObjectId
from .models_glosas import GlosaAplicada
from django.utils import timezone


class GlosaAplicadaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo GlosaAplicada con manejo especial de ObjectId
    """
    # Declaración explícita del campo id para evitar errores de serialización
    id = serializers.CharField(read_only=True)
    
    # Campos adicionales para el frontend
    fecha_aplicacion_formato = serializers.SerializerMethodField()
    puede_editar = serializers.SerializerMethodField()
    ultima_respuesta = serializers.SerializerMethodField()
    
    class Meta:
        model = GlosaAplicada
        fields = [
            'id',
            'radicacion_id',
            'numero_radicacion',
            'factura_id',
            'numero_factura',
            'fecha_factura',
            'servicio_id',
            'servicio_info',
            'prestador_info',
            'tipo_glosa',
            'codigo_glosa',
            'descripcion_glosa',
            'valor_servicio',
            'valor_glosado',
            'porcentaje_glosa',
            'observaciones',
            'estado',
            'auditor_info',
            'fecha_aplicacion',
            'fecha_aplicacion_formato',
            'fecha_ultima_actualizacion',
            'tipo_servicio',
            'excede_valor_servicio',
            'historial_cambios',
            'respuestas',
            'estadisticas',
            'puede_editar',
            'ultima_respuesta'
        ]
        read_only_fields = ['id', 'fecha_aplicacion', 'fecha_ultima_actualizacion', 'porcentaje_glosa']
    
    def get_fecha_aplicacion_formato(self, obj):
        """Formato legible para la fecha de aplicación"""
        if obj.fecha_aplicacion:
            return obj.fecha_aplicacion.strftime("%d/%m/%Y %I:%M %p")
        return ""
    
    def get_puede_editar(self, obj):
        """Determina si la glosa puede ser editada"""
        # Solo se puede editar si está en estado APLICADA
        return obj.estado == 'APLICADA'
    
    def get_ultima_respuesta(self, obj):
        """Obtiene la última respuesta del prestador si existe"""
        if obj.respuestas and len(obj.respuestas) > 0:
            return obj.respuestas[-1]
        return None
    
    def validate_valor_glosado(self, value):
        """Valida que el valor glosado sea positivo"""
        if value < 0:
            raise serializers.ValidationError("El valor glosado no puede ser negativo")
        return value
    
    def validate(self, data):
        """Validaciones a nivel de objeto"""
        # Validar que el valor glosado no exceda el valor del servicio
        valor_servicio = data.get('valor_servicio', 0)
        valor_glosado = data.get('valor_glosado', 0)
        
        if valor_glosado > valor_servicio:
            data['excede_valor_servicio'] = True
        
        return data
    
    def create(self, validated_data):
        """Crear nueva glosa con información del usuario actual"""
        # Agregar información del auditor desde el contexto
        request = self.context.get('request')
        if request and request.user:
            validated_data['auditor_info'] = {
                'user_id': str(request.user.id),
                'username': request.user.username,
                'nombre_completo': getattr(request.user, 'get_full_name', lambda: request.user.username)(),
                'rol': 'AUDITOR'
            }
        
        # Calcular porcentaje
        if validated_data.get('valor_servicio', 0) > 0:
            validated_data['porcentaje_glosa'] = (
                validated_data.get('valor_glosado', 0) / validated_data['valor_servicio']
            ) * 100
        
        return super().create(validated_data)


class RespuestaGlosaSerializer(serializers.Serializer):
    """Serializer para las respuestas del prestador a las glosas"""
    tipo_respuesta = serializers.ChoiceField(
        choices=['RE95', 'RE96', 'RE97', 'RE98', 'RE99', 'RE22'],
        help_text="Código de respuesta según Resolución 2284"
    )
    valor_aceptado = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0,
        help_text="Valor aceptado de la glosa"
    )
    valor_rechazado = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0,
        help_text="Valor rechazado de la glosa"
    )
    justificacion = serializers.CharField(
        help_text="Justificación de la respuesta"
    )
    soportes = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="Lista de archivos de soporte"
    )
    
    def validate(self, data):
        """Validar que la suma de aceptado + rechazado no exceda el valor glosado"""
        valor_aceptado = data.get('valor_aceptado', 0)
        valor_rechazado = data.get('valor_rechazado', 0)
        
        # Esta validación se debe hacer en el ViewSet con el valor_glosado de la glosa
        
        return data


class GlosaPorRadicacionSerializer(serializers.Serializer):
    """Serializer para estadísticas de glosas por radicación"""
    numero_radicacion = serializers.CharField()
    total_glosas = serializers.IntegerField()
    valor_total_glosado = serializers.DecimalField(max_digits=15, decimal_places=2)
    valor_total_aceptado = serializers.DecimalField(max_digits=15, decimal_places=2)
    valor_total_rechazado = serializers.DecimalField(max_digits=15, decimal_places=2)
    estado_general = serializers.CharField()
    requiere_conciliacion = serializers.BooleanField()


class GlosaPorPrestadorSerializer(serializers.Serializer):
    """Serializer para estadísticas de glosas por prestador"""
    prestador_nit = serializers.CharField()
    prestador_nombre = serializers.CharField()
    total_glosas = serializers.IntegerField()
    valor_total_glosado = serializers.DecimalField(max_digits=15, decimal_places=2)
    porcentaje_aceptacion = serializers.DecimalField(max_digits=5, decimal_places=2)
    glosas_pendientes = serializers.IntegerField()
    glosas_en_conciliacion = serializers.IntegerField()