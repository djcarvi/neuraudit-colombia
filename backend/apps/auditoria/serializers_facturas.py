from rest_framework import serializers
from .models_facturas import FacturaRadicada, ServicioFacturado


class FacturaRadicadaSerializer(serializers.ModelSerializer):
    """
    Serializer para FacturaRadicada con información embebida
    """
    # Declaración explícita del campo id para MongoDB
    id = serializers.CharField(read_only=True)
    
    # Campos calculados
    total_glosas = serializers.SerializerMethodField()
    total_servicios = serializers.SerializerMethodField()
    
    class Meta:
        model = FacturaRadicada
        fields = [
            'id',
            'radicacion_id',
            'radicacion_info',
            'numero_factura',
            'fecha_expedicion',
            'valor_total',
            'total_consultas',
            'total_procedimientos',
            'total_medicamentos',
            'total_otros_servicios',
            'total_urgencias',
            'total_hospitalizaciones',
            'total_recien_nacidos',
            'valor_consultas',
            'valor_procedimientos',
            'valor_medicamentos',
            'valor_otros_servicios',
            'estado_auditoria',
            'servicios_json',
            'created_at',
            'updated_at',
            'total_glosas',
            'total_servicios'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_total_glosas(self, obj):
        """Obtiene el total de glosas aplicadas a esta factura"""
        # Por ahora retornar 0, después se implementará con el conteo real
        return 0
    
    def get_total_servicios(self, obj):
        """Obtiene el total de servicios de la factura"""
        return ((obj.total_consultas or 0) + (obj.total_procedimientos or 0) + 
                (obj.total_medicamentos or 0) + (obj.total_otros_servicios or 0) +
                (obj.total_urgencias or 0) + (obj.total_hospitalizaciones or 0) +
                (obj.total_recien_nacidos or 0))


class ServicioFacturadoSerializer(serializers.ModelSerializer):
    """
    Serializer para ServicioFacturado
    """
    # Declaración explícita del campo id para MongoDB
    id = serializers.CharField(read_only=True)
    
    class Meta:
        model = ServicioFacturado
        fields = [
            'id',
            'factura_id',
            'factura_info',
            'tipo_servicio',
            'codigo',
            'descripcion',
            'cantidad',
            'valor_unitario',
            'valor_total',
            'fecha_inicio',
            'fecha_fin',
            'condicion_egreso',
            'tipo_documento',
            'numero_documento',
            'fecha_nacimiento',
            'sexo_biologico',
            'detalle_json',
            'tiene_glosa',
            'glosas_aplicadas',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ServicioRIPSSerializer(serializers.ModelSerializer):
    """
    Serializer que devuelve servicios con nomenclatura RIPS para el frontend
    """
    id = serializers.CharField(read_only=True)
    
    # Mapear campos del modelo a nombres RIPS esperados por el frontend
    codConsulta = serializers.SerializerMethodField()
    codProcedimiento = serializers.SerializerMethodField() 
    codTecnologiaSalud = serializers.SerializerMethodField()
    nomTecnologiaSalud = serializers.SerializerMethodField()
    vrServicio = serializers.DecimalField(source='valor_total', max_digits=15, decimal_places=2)
    
    class Meta:
        model = ServicioFacturado
        fields = [
            'id',
            'tipo_servicio',
            'codConsulta',
            'codProcedimiento', 
            'codTecnologiaSalud',
            'nomTecnologiaSalud',
            'descripcion',
            'vrServicio',
            'tiene_glosa',
            'glosas_aplicadas',
            'detalle_json'
        ]
    
    def get_codConsulta(self, obj):
        """Devuelve código para consultas"""
        return obj.codigo if obj.tipo_servicio == 'CONSULTA' else None
        
    def get_codProcedimiento(self, obj):
        """Devuelve código para procedimientos"""
        return obj.codigo if obj.tipo_servicio == 'PROCEDIMIENTO' else None
        
    def get_codTecnologiaSalud(self, obj):
        """Devuelve código para medicamentos y otros servicios"""
        return obj.codigo if obj.tipo_servicio in ['MEDICAMENTO', 'OTRO_SERVICIO'] else None
        
    def get_nomTecnologiaSalud(self, obj):
        """Devuelve nombre para medicamentos y otros servicios"""
        return obj.descripcion if obj.tipo_servicio in ['MEDICAMENTO', 'OTRO_SERVICIO'] else None


class FacturaResumenSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listados
    """
    id = serializers.CharField(read_only=True)
    prestador_nombre = serializers.SerializerMethodField()
    prestador_nit = serializers.SerializerMethodField()
    numero_radicacion = serializers.SerializerMethodField()
    total_servicios = serializers.SerializerMethodField()
    
    class Meta:
        model = FacturaRadicada
        fields = [
            'id',
            'numero_factura',
            'fecha_expedicion',
            'valor_total',
            'estado_auditoria',
            'prestador_nombre',
            'prestador_nit',
            'numero_radicacion',
            'total_servicios'
        ]
    
    def get_prestador_nombre(self, obj):
        return obj.radicacion_info.get('prestador_nombre', '')
    
    def get_prestador_nit(self, obj):
        return obj.radicacion_info.get('prestador_nit', '')
    
    def get_numero_radicacion(self, obj):
        return obj.radicacion_info.get('numero_radicacion', '')