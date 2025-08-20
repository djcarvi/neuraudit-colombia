# -*- coding: utf-8 -*-
# apps/radicacion/serializers.py

"""
Serializers para APIs REST de RIPS - NeurAudit Colombia
Serialización de modelos RIPS con subdocumentos embebidos
"""

from rest_framework import serializers
from bson import ObjectId
from datetime import datetime
from decimal import Decimal
from django.utils import timezone

from .models import RadicacionCuentaMedica, DocumentoSoporte, ValidacionRIPS
from .models_rips_oficial import (
    RIPSTransaccion, RIPSUsuario, RIPSUsuarioDatos, RIPSValidacionBDUA,
    RIPSEstadisticasUsuario, RIPSServiciosUsuario, RIPSConsulta, 
    RIPSProcedimiento, RIPSMedicamento, RIPSUrgencia, RIPSHospitalizacion,
    RIPSRecienNacido, RIPSOtrosServicios, RIPSEstadisticasTransaccion,
    RIPSPreAuditoria, RIPSTrazabilidad
)

class ObjectIdField(serializers.Field):
    """Campo personalizado para serializar/deserializar ObjectId"""
    
    def to_representation(self, value):
        if value:
            return str(value)
        return None
    
    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except:
            raise serializers.ValidationError("Invalid ObjectId format")


class DocumentoSoporteSerializer(serializers.ModelSerializer):
    """
    Serializer para documentos de soporte según Resolución 2284
    """
    id = serializers.CharField(read_only=True)  # CRÍTICO para MongoDB
    
    # Campos calculados
    tipo_documento_display = serializers.CharField(source='get_tipo_documento_display', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    size_mb = serializers.SerializerMethodField()
    is_required = serializers.SerializerMethodField()
    nomenclature_filename = serializers.CharField(source='get_nomenclature_filename', read_only=True)
    
    # Validación
    validation_errors = serializers.SerializerMethodField()
    is_valid = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentoSoporte
        fields = [
            'id', 'tipo_documento', 'tipo_documento_display', 'nombre_archivo',
            'archivo_url', 'archivo_hash', 'archivo_size', 'size_mb', 'mime_type', 'extension',
            'estado', 'estado_display', 'validacion_resultado', 'version',
            'is_required', 'nomenclature_filename', 'validation_errors', 'is_valid',
            'metadatos', 'observaciones', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'archivo_hash', 'archivo_size', 'size_mb', 'validation_errors', 
            'is_valid', 'nomenclature_filename', 'created_at', 'updated_at'
        ]
    
    def get_size_mb(self, obj):
        """Convertir tamaño a MB"""
        return round(obj.archivo_size / (1024 * 1024), 2) if obj.archivo_size else 0
    
    def get_is_required(self, obj):
        """Verifica si el documento es requerido para el tipo de servicio"""
        if hasattr(obj, 'radicacion'):
            required_soportes = obj.radicacion.get_required_soportes()
            return obj.tipo_documento in required_soportes
        return False
    
    def get_validation_errors(self, obj):
        """Obtiene errores de validación del documento"""
        validation = obj.validate_format()
        return validation.get('errors', [])
    
    def get_is_valid(self, obj):
        """Verifica si el documento es válido"""
        validation = obj.validate_format()
        return len(validation.get('errors', [])) == 0


class ValidacionRIPSSerializer(serializers.ModelSerializer):
    """
    Serializer para validaciones RIPS con MinSalud
    """
    id = serializers.CharField(read_only=True)  # CRÍTICO para MongoDB
    
    # Campos calculados
    porcentaje_validos = serializers.SerializerMethodField()
    tiene_errores = serializers.SerializerMethodField()
    
    class Meta:
        model = ValidacionRIPS
        fields = [
            'id', 'codigo_validacion_minsalud', 'estado_validacion', 'es_valido',
            'errores_encontrados', 'advertencias', 'total_registros', 'registros_validos',
            'registros_con_errores', 'porcentaje_validos', 'tiene_errores',
            'fecha_validacion', 'fecha_respuesta_api'
        ]
        read_only_fields = [
            'id', 'porcentaje_validos', 'tiene_errores', 'fecha_validacion', 'fecha_respuesta_api'
        ]
    
    def get_porcentaje_validos(self, obj):
        """Calcula porcentaje de registros válidos"""
        if obj.total_registros > 0:
            return round((obj.registros_validos / obj.total_registros) * 100, 2)
        return 0
    
    def get_tiene_errores(self, obj):
        """Verifica si tiene errores"""
        return len(obj.errores_encontrados) > 0


class RadicacionCuentaMedicaSerializer(serializers.ModelSerializer):
    """
    Serializer principal para radicación de cuentas médicas
    """
    id = serializers.CharField(read_only=True)  # CRÍTICO para MongoDB
    
    # Relaciones
    usuario_radicador_info = serializers.SerializerMethodField()
    documentos = DocumentoSoporteSerializer(many=True, read_only=True)
    
    # Campos calculados
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    modalidad_pago_display = serializers.CharField(source='get_modalidad_pago_display', read_only=True)
    tipo_servicio_display = serializers.CharField(source='get_tipo_servicio_display', read_only=True)
    
    # Estado y control de tiempo
    is_expired = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    can_radicate_status = serializers.SerializerMethodField()
    
    # Validaciones
    validation_summary = serializers.SerializerMethodField()
    required_documents = serializers.SerializerMethodField()
    documents_summary = serializers.SerializerMethodField()
    
    # Información del paciente (solo nombres/apellidos para privacidad)
    paciente_nombre_completo = serializers.SerializerMethodField()
    
    class Meta:
        model = RadicacionCuentaMedica
        fields = [
            # Identificación
            'id', 'numero_radicado',
            
            # Prestador
            'pss_nit', 'pss_nombre', 'pss_codigo_reps', 'usuario_radicador', 'usuario_radicador_info',
            
            # Factura
            'factura_numero', 'factura_prefijo', 'factura_fecha_expedicion', 
            'factura_valor_total', 'factura_moneda',
            
            # Clasificación
            'modalidad_pago', 'modalidad_pago_display', 'tipo_servicio', 'tipo_servicio_display',
            
            # Paciente (solo identificadores únicos)
            'paciente_tipo_documento', 'paciente_numero_documento', 'paciente_codigo_sexo', 'paciente_codigo_edad',
            
            # Información clínica
            'fecha_atencion_inicio', 'fecha_atencion_fin', 'diagnostico_principal', 
            'diagnosticos_relacionados',
            
            # Estado y control
            'estado', 'estado_display', 'fecha_radicacion', 'fecha_limite_radicacion',
            'is_expired', 'days_remaining', 'can_radicate_status',
            
            # Validaciones y documentos
            'validation_summary', 'required_documents', 'documents_summary', 'documentos',
            
            # Control
            'version', 'observaciones', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'numero_radicado', 'fecha_radicacion', 'is_expired', 'days_remaining',
            'can_radicate_status', 'validation_summary', 'required_documents', 
            'documents_summary', 'paciente_nombre_completo', 'created_at', 'updated_at'
        ]
    
    def get_usuario_radicador_info(self, obj):
        """Información básica del usuario radicador"""
        user = obj.usuario_radicador
        return {
            'id': str(user.id),
            'nombre_completo': user.get_full_name(),
            'email': user.email,
            'rol': user.get_role_display()
        }
    
    def get_paciente_nombre_completo(self, obj):
        """Identificador único del paciente (documento)"""
        return f"{obj.paciente_tipo_documento} {obj.paciente_numero_documento}"
    
    def get_can_radicate_status(self, obj):
        """Estado de si puede radicar con mensaje"""
        can_radicate, message = obj.can_radicate()
        return {
            'can_radicate': can_radicate,
            'message': message
        }
    
    def get_validation_summary(self, obj):
        """Resumen de validaciones de documentos"""
        validations = obj.validate_documents()
        return {
            'all_valid': validations['rips_valid'] and validations['factura_valid'] and validations['soportes_valid'],
            'rips_valid': validations['rips_valid'],
            'factura_valid': validations['factura_valid'],
            'soportes_valid': validations['soportes_valid'],
            'errors_count': len(validations['errors']),
            'warnings_count': len(validations['warnings']),
            'errors': validations['errors'],
            'warnings': validations['warnings']
        }
    
    def get_required_documents(self, obj):
        """Lista de documentos requeridos"""
        required_soportes = obj.get_required_soportes()
        return [
            {
                'tipo': 'FACTURA',
                'nombre': 'Factura de Venta en Salud',
                'obligatorio': True
            },
            {
                'tipo': 'RIPS',
                'nombre': 'Registro Individual de Prestación de Servicios',
                'obligatorio': True
            }
        ] + [
            {
                'tipo': soporte,
                'nombre': dict(DocumentoSoporte.TIPO_DOCUMENTO_CHOICES).get(soporte, soporte),
                'obligatorio': False
            }
            for soporte in required_soportes
        ]
    
    def get_documents_summary(self, obj):
        """Resumen de documentos subidos"""
        documentos = obj.documentos.all()
        
        # Contar por tipo
        docs_by_type = {}
        for doc in documentos:
            if doc.tipo_documento not in docs_by_type:
                docs_by_type[doc.tipo_documento] = []
            docs_by_type[doc.tipo_documento].append({
                'id': str(doc.id),
                'nombre': doc.nombre_archivo,
                'estado': doc.estado,
                'size_mb': round(doc.archivo_size / (1024 * 1024), 2) if doc.archivo_size else 0
            })
        
        # Verificar completitud
        required_soportes = obj.get_required_soportes()
        missing_required = []
        
        # Verificar obligatorios
        if 'FACTURA' not in docs_by_type:
            missing_required.append('Factura de Venta en Salud')
        if 'RIPS' not in docs_by_type:
            missing_required.append('RIPS')
        
        # Verificar según tipo de servicio
        for soporte in required_soportes:
            if soporte not in docs_by_type:
                missing_required.append(dict(DocumentoSoporte.TIPO_DOCUMENTO_CHOICES).get(soporte, soporte))
        
        return {
            'total_documentos': len(documentos),
            'documentos_por_tipo': docs_by_type,
            'documentos_faltantes': missing_required,
            'is_complete': len(missing_required) == 0
        }
    
    def validate_factura_valor_total(self, value):
        """Validar que el valor de la factura sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El valor de la factura debe ser mayor a cero")
        return value
    
    def validate_fecha_atencion_inicio(self, value):
        """Validar que la fecha de atención no sea futura"""
        if value > timezone.now():
            raise serializers.ValidationError("La fecha de atención no puede ser futura")
        return value
    
    def validate(self, data):
        """Validaciones cruzadas"""
        # Validar que fecha fin sea posterior a inicio
        if data.get('fecha_atencion_fin') and data.get('fecha_atencion_inicio'):
            if data['fecha_atencion_fin'] < data['fecha_atencion_inicio']:
                raise serializers.ValidationError({
                    'fecha_atencion_fin': 'La fecha de fin debe ser posterior a la fecha de inicio'
                })
        
        # Validar que el usuario radicador sea de tipo PSS/PTS
        if data.get('usuario_radicador'):
            user = data['usuario_radicador']
            if not user.is_pss_user:
                raise serializers.ValidationError({
                    'usuario_radicador': 'Solo usuarios PSS/PTS pueden radicar cuentas'
                })
            
            if user.role != 'RADICADOR':
                raise serializers.ValidationError({
                    'usuario_radicador': 'El usuario debe tener rol de RADICADOR'
                })
        
        return data


class RadicacionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para creación de radicaciones
    Campos mínimos requeridos para crear borrador
    """
    id = serializers.CharField(read_only=True)  # CRÍTICO para MongoDB
    
    class Meta:
        model = RadicacionCuentaMedica
        fields = [
            'id', 'pss_nit', 'pss_nombre', 'pss_codigo_reps',
            'factura_numero', 'factura_prefijo', 'factura_fecha_expedicion', 
            'factura_valor_total', 'modalidad_pago', 'tipo_servicio',
            'paciente_tipo_documento', 'paciente_numero_documento', 
            'paciente_codigo_sexo', 'paciente_codigo_edad',
            'fecha_atencion_inicio', 'fecha_atencion_fin', 'diagnostico_principal',
            'diagnosticos_relacionados', 'observaciones'
        ]
    
    def create(self, validated_data):
        """Crear radicación en estado borrador"""
        validated_data['estado'] = 'BORRADOR'
        
        # Agregar usuario radicador automáticamente desde el contexto
        request = self.context.get('request')
        if request and request.user:
            validated_data['usuario_radicador'] = request.user
        
        # Calcular fecha límite de radicación
        factura_fecha = validated_data['factura_fecha_expedicion']
        validated_data['fecha_limite_radicacion'] = RadicacionCuentaMedica().calculate_limit_date()
        
        return super().create(validated_data)


class RadicacionListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listado de radicaciones
    """
    id = serializers.CharField(read_only=True)  # CRÍTICO para MongoDB
    
    # Campos calculados
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    paciente_nombre_completo = serializers.SerializerMethodField()
    total_documentos = serializers.SerializerMethodField()
    
    class Meta:
        model = RadicacionCuentaMedica
        fields = [
            'id', 'numero_radicado', 'pss_nit', 'pss_nombre', 'factura_numero', 'factura_prefijo',
            'factura_valor_total', 'estado', 'estado_display', 'paciente_nombre_completo',
            'fecha_radicacion', 'fecha_limite_radicacion', 'days_remaining', 'is_expired',
            'total_documentos', 'created_at'
        ]
    
    def get_paciente_nombre_completo(self, obj):
        """Identificador único del paciente (documento)"""
        return f"{obj.paciente_tipo_documento} {obj.paciente_numero_documento}"
    
    def get_total_documentos(self, obj):
        """Total de documentos subidos"""
        return obj.documentos.count()


class DocumentoUploadSerializer(serializers.Serializer):
    """
    Serializer para upload de documentos
    """
    archivo = serializers.FileField()
    tipo_documento = serializers.ChoiceField(choices=DocumentoSoporte.TIPO_DOCUMENTO_CHOICES)
    observaciones = serializers.CharField(required=False, allow_blank=True)
    
    def validate_archivo(self, value):
        """Validar archivo subido"""
        # Validar tamaño (1GB máximo)
        max_size = 1024 * 1024 * 1024  # 1GB
        if value.size > max_size:
            raise serializers.ValidationError("El archivo excede el tamaño máximo permitido (1GB)")
        
        # Validar extensión
        allowed_extensions = ['pdf', 'xml', 'json']
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in allowed_extensions:
            raise serializers.ValidationError(f"Extensión no permitida. Permitidas: {allowed_extensions}")
        
        return value
    
    def validate(self, data):
        """Validaciones cruzadas"""
        archivo = data.get('archivo')
        tipo_documento = data.get('tipo_documento')
        
        if archivo and tipo_documento:
            file_extension = archivo.name.split('.')[-1].lower()
            
            # Validar extensión específica por tipo
            extension_rules = {
                'FACTURA': ['xml'],
                'RIPS': ['json'],
            }
            
            if tipo_documento in extension_rules:
                allowed = extension_rules[tipo_documento]
                if file_extension not in allowed:
                    raise serializers.ValidationError({
                        'archivo': f'Para {tipo_documento} se requiere extensión: {allowed}'
                    })
        
        return data