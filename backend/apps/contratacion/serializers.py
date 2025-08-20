# -*- coding: utf-8 -*-
# apps/contratacion/serializers.py

from rest_framework import serializers
from .models import (
    TarifariosCUPS, TarifariosMedicamentos, TarifariosDispositivos,
    Prestador, ModalidadPago, Contrato, CatalogoCUPS, CatalogoCUM,
    CatalogoIUM, CatalogoDispositivos, TarifarioPersonalizado,
    PaqueteServicios, TarifarioPaquete
)


class TarifariosCUPSSerializer(serializers.ModelSerializer):
    """
    Serializer para Tarifarios CUPS contractuales
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = TarifariosCUPS
        fields = [
            'id', 'contrato_numero', 'codigo_cups', 'descripcion',
            'valor_unitario', 'unidad_medida', 'aplica_copago',
            'aplica_cuota_moderadora', 'requiere_autorizacion',
            'restricciones_sexo', 'restricciones_edad_minima',
            'restricciones_edad_maxima', 'restricciones_ambito',
            'restricciones_nivel_atencion', 'vigencia_desde',
            'vigencia_hasta', 'estado', 'created_at', 'updated_at'
        ]


class TarifariosMedicamentosSerializer(serializers.ModelSerializer):
    """
    Serializer para Tarifarios de Medicamentos contractuales
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = TarifariosMedicamentos
        fields = [
            'id', 'contrato_numero', 'codigo_cum', 'codigo_ium',
            'descripcion', 'principio_activo', 'concentracion',
            'forma_farmaceutica', 'valor_unitario', 'unidad_medida',
            'via_administracion', 'requiere_autorizacion', 'es_pos',
            'es_no_pos', 'vigencia_desde', 'vigencia_hasta',
            'estado', 'created_at', 'updated_at'
        ]


class TarifariosDispositivosSerializer(serializers.ModelSerializer):
    """
    Serializer para Tarifarios de Dispositivos contractuales
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = TarifariosDispositivos
        fields = [
            'id', 'contrato_numero', 'codigo_dispositivo', 'descripcion',
            'valor_unitario', 'unidad_medida', 'requiere_autorizacion',
            'restricciones_uso', 'frecuencia_maxima', 'vigencia_desde',
            'vigencia_hasta', 'estado', 'created_at', 'updated_at'
        ]


class ValidacionTarifaSerializer(serializers.Serializer):
    """
    Serializer para validación de tarifas contractuales
    """
    codigo = serializers.CharField(max_length=50)
    tipo_codigo = serializers.ChoiceField(choices=['CUPS', 'CUM', 'IUM', 'DISPOSITIVO'])
    contrato_numero = serializers.CharField(max_length=50)
    valor_facturado = serializers.DecimalField(max_digits=15, decimal_places=2)
    fecha_servicio = serializers.DateField()


class ResultadoValidacionTarifaSerializer(serializers.Serializer):
    """
    Serializer para respuesta de validación de tarifas
    """
    codigo = serializers.CharField()
    tipo_codigo = serializers.CharField()
    tarifa_encontrada = serializers.BooleanField()
    valor_contractual = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    valor_facturado = serializers.DecimalField(max_digits=15, decimal_places=2)
    diferencia = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    requiere_autorizacion = serializers.BooleanField(required=False)
    restricciones_aplicables = serializers.ListField(required=False)
    observaciones = serializers.CharField(required=False)


class PrestadorSerializer(serializers.ModelSerializer):
    """
    Serializer para Red de Prestadores
    """
    id = serializers.ReadOnlyField()
    contratos_activos = serializers.SerializerMethodField()
    
    class Meta:
        model = Prestador
        fields = [
            'id', 'nit', 'razon_social', 'nombre_comercial', 'codigo_habilitacion',
            'tipo_prestador', 'nivel_atencion', 'departamento', 'ciudad',
            'direccion', 'telefono', 'email', 'habilitado_reps', 'fecha_habilitacion',
            'estado', 'servicios_habilitados', 'contratos_activos',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_contratos_activos(self, obj):
        """Cuenta los contratos vigentes del prestador"""
        return obj.contratos.filter(estado='VIGENTE').count()


class ModalidadPagoSerializer(serializers.ModelSerializer):
    """
    Serializer para Modalidades de Pago
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = ModalidadPago
        fields = [
            'id', 'codigo', 'nombre', 'descripcion',
            'requiere_autorizacion', 'permite_glosas', 'pago_anticipado',
            'porcentaje_primer_pago', 'dias_primer_pago',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContratoListSerializer(serializers.ModelSerializer):
    """
    Serializer para listado de contratos (información resumida)
    """
    id = serializers.ReadOnlyField()
    prestador_nombre = serializers.CharField(source='prestador.razon_social', read_only=True)
    prestador_nit = serializers.CharField(source='prestador.nit', read_only=True)
    modalidad_principal_codigo = serializers.CharField(source='modalidad_principal.codigo', read_only=True)
    modalidad_principal_nombre = serializers.CharField(source='modalidad_principal.nombre', read_only=True)
    dias_restantes = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Contrato
        fields = [
            'id', 'numero_contrato', 'prestador_nombre', 'prestador_nit',
            'modalidad_principal_codigo', 'modalidad_principal_nombre',
            'fecha_inicio', 'fecha_fin', 'valor_total', 'estado',
            'dias_restantes', 'created_at'
        ]


class ContratoDetailSerializer(serializers.ModelSerializer):
    """
    Serializer para detalle completo de contrato
    """
    id = serializers.ReadOnlyField()
    prestador = PrestadorSerializer(read_only=True)
    prestador_id = serializers.CharField(write_only=True)
    modalidad_principal = ModalidadPagoSerializer(read_only=True)
    modalidad_principal_id = serializers.CharField(write_only=True)
    dias_restantes = serializers.IntegerField(read_only=True)
    esta_vigente = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Contrato
        fields = [
            'id', 'numero_contrato', 'prestador', 'prestador_id',
            'modalidad_principal', 'modalidad_principal_id',
            'modalidades_adicionales', 'fecha_inicio', 'fecha_fin',
            'fecha_firma', 'valor_total', 'valor_mensual',
            'poblacion_asignada', 'manual_tarifario',
            'porcentaje_negociacion', 'estado', 'servicios_contratados',
            'tiene_anexo_tecnico', 'tiene_anexo_economico',
            'dias_restantes', 'esta_vigente',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    def create(self, validated_data):
        prestador_id = validated_data.pop('prestador_id')
        modalidad_principal_id = validated_data.pop('modalidad_principal_id')
        
        validated_data['prestador'] = Prestador.objects.get(id=prestador_id)
        validated_data['modalidad_principal'] = ModalidadPago.objects.get(id=modalidad_principal_id)
        validated_data['created_by'] = self.context['request'].user
        
        return super().create(validated_data)


class CatalogoCUPSSerializer(serializers.ModelSerializer):
    """
    Serializer para Catálogo CUPS
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = CatalogoCUPS
        fields = [
            'id', 'codigo', 'descripcion', 'tipo', 'capitulo',
            'grupo', 'subgrupo', 'nivel_complejidad', 'activo',
            'fecha_vigencia', 'requiere_autorizacion',
            'dias_estancia_promedio', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CatalogoCUMSerializer(serializers.ModelSerializer):
    """
    Serializer para Catálogo CUM
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = CatalogoCUM
        fields = [
            'id', 'codigo_cum', 'nombre_generico', 'nombre_comercial',
            'forma_farmaceutica', 'concentracion', 'unidad_medida',
            'grupo_terapeutico', 'via_administracion', 'es_pos',
            'es_controlado', 'requiere_autorizacion', 'activo',
            'fecha_vigencia', 'laboratorio', 'registro_invima',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TarifarioCreateSerializer(serializers.Serializer):
    """
    Serializer para creación masiva de tarifarios desde un contrato
    """
    contrato_id = serializers.CharField()
    tipo_tarifario = serializers.ChoiceField(choices=['CUPS', 'MEDICAMENTOS', 'DISPOSITIVOS'])
    archivo_excel = serializers.FileField(required=False)
    items = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )


class CatalogoIUMSerializer(serializers.ModelSerializer):
    """
    Serializer para Catálogo IUM
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = CatalogoIUM
        fields = [
            'id', 'codigo_ium', 'nombre_generico', 'nombre_comercial',
            'forma_farmaceutica', 'concentracion', 'unidad_medida',
            'grupo_terapeutico', 'via_administracion', 'es_pos',
            'es_controlado', 'requiere_autorizacion', 'activo',
            'fecha_vigencia', 'laboratorio', 'registro_invima',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CatalogoDispositivosSerializer(serializers.ModelSerializer):
    """
    Serializer para Catálogo de Dispositivos
    """
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = CatalogoDispositivos
        fields = [
            'id', 'codigo', 'nombre', 'descripcion', 'tipo_dispositivo',
            'clase_riesgo', 'requiere_autorizacion', 'vida_util_dias',
            'activo', 'fecha_vigencia', 'registro_invima', 'fabricante',
            'pais_origen', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TarifarioPersonalizadoSerializer(serializers.ModelSerializer):
    """
    Serializer para Tarifarios Personalizados
    """
    id = serializers.ReadOnlyField()
    contrato_numero = serializers.CharField(source='contrato.numero_contrato', read_only=True)
    
    class Meta:
        model = TarifarioPersonalizado
        fields = [
            'id', 'contrato', 'contrato_numero', 'codigo_interno',
            'nombre', 'descripcion', 'categoria', 'valor_unitario',
            'unidad_medida', 'requiere_autorizacion', 'aplica_copago',
            'aplica_cuota_moderadora', 'fecha_inicio_vigencia',
            'fecha_fin_vigencia', 'activo', 'observaciones',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']


class PaqueteServiciosSerializer(serializers.ModelSerializer):
    """
    Serializer para Paquetes de Servicios
    """
    id = serializers.ReadOnlyField()
    total_servicios = serializers.SerializerMethodField()
    
    class Meta:
        model = PaqueteServicios
        fields = [
            'id', 'codigo_paquete', 'nombre', 'descripcion',
            'tipo_paquete', 'servicios_incluidos', 'medicamentos_incluidos',
            'dispositivos_incluidos', 'dias_estancia_incluidos',
            'incluye_honorarios', 'incluye_insumos', 'incluye_medicamentos',
            'activo', 'requiere_autorizacion', 'total_servicios',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    def get_total_servicios(self, obj):
        """Cuenta total de servicios incluidos"""
        return len(obj.servicios_incluidos)


class TarifarioPaqueteSerializer(serializers.ModelSerializer):
    """
    Serializer para Tarifarios de Paquetes
    """
    id = serializers.ReadOnlyField()
    paquete_codigo = serializers.CharField(source='paquete.codigo_paquete', read_only=True)
    paquete_nombre = serializers.CharField(source='paquete.nombre', read_only=True)
    contrato_numero = serializers.CharField(source='contrato.numero_contrato', read_only=True)
    
    class Meta:
        model = TarifarioPaquete
        fields = [
            'id', 'contrato', 'contrato_numero', 'paquete',
            'paquete_codigo', 'paquete_nombre', 'valor_paquete',
            'tipo_tarifa', 'fecha_inicio_vigencia', 'fecha_fin_vigencia',
            'activo', 'observaciones', 'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']


class ValidacionTarifaExtendidaSerializer(serializers.Serializer):
    """
    Serializer para validación extendida de tarifas (incluye IUM y personalizados)
    """
    codigo = serializers.CharField(max_length=50)
    tipo_codigo = serializers.ChoiceField(
        choices=['CUPS', 'CUM', 'IUM', 'DISPOSITIVO', 'PAQUETE', 'PERSONALIZADO']
    )
    contrato_numero = serializers.CharField(max_length=50)
    valor_facturado = serializers.DecimalField(max_digits=15, decimal_places=2)
    fecha_servicio = serializers.DateField()
    cantidad = serializers.IntegerField(default=1)


# Serializers para importación masiva de tarifarios

class ImportacionTarifarioSerializer(serializers.Serializer):
    """
    Serializer para el proceso de importación masiva de tarifarios
    """
    archivo = serializers.FileField(
        help_text="Archivo Excel con los tarifarios a importar"
    )
    prestador_nit = serializers.CharField(
        max_length=20,
        help_text="NIT del prestador al que pertenecen los tarifarios"
    )
    tipo_tarifario = serializers.ChoiceField(
        choices=[
            ('cups', 'Tarifarios CUPS'),
            ('medicamentos', 'Tarifarios Medicamentos'),
            ('dispositivos', 'Tarifarios Dispositivos')
        ],
        help_text="Tipo de tarifario a importar"
    )
    contrato_numero = serializers.CharField(
        max_length=50,
        required=False,
        help_text="Número de contrato específico (opcional)"
    )
    hoja_excel = serializers.CharField(
        max_length=50,
        default='Sheet1',
        help_text="Nombre de la hoja de Excel a procesar"
    )
    filas_saltar = serializers.IntegerField(
        default=0,
        min_value=0,
        help_text="Número de filas a saltar al inicio del archivo"
    )
    validar_catalogo_oficial = serializers.BooleanField(
        default=True,
        help_text="Validar que los códigos existan en catálogos oficiales"
    )
    sobrescribir_existentes = serializers.BooleanField(
        default=False,
        help_text="Sobrescribir tarifarios existentes"
    )


class ResultadoImportacionSerializer(serializers.Serializer):
    """
    Resultado del proceso de importación
    """
    mensaje = serializers.CharField()
    total_procesados = serializers.IntegerField()
    registros_exitosos = serializers.IntegerField()
    registros_con_error = serializers.IntegerField()
    registros_duplicados = serializers.IntegerField(default=0)
    registros_sin_catalogo = serializers.IntegerField(default=0)
    tiempo_procesamiento = serializers.CharField()
    errores = serializers.ListField(
        child=serializers.CharField(),
        help_text="Primeros 10 errores encontrados"
    )
    advertencias = serializers.ListField(
        child=serializers.CharField(),
        help_text="Advertencias durante el proceso"
    )
    estadisticas = serializers.DictField(
        help_text="Estadísticas adicionales del proceso"
    )


class PreviewImportacionSerializer(serializers.Serializer):
    """
    Vista previa de la importación antes de ejecutarla
    """
    archivo = serializers.FileField()
    hoja_excel = serializers.CharField(max_length=50, default='Sheet1')
    filas_saltar = serializers.IntegerField(default=0, min_value=0)
    filas_preview = serializers.IntegerField(default=10, min_value=1, max_value=50)


class ResultadoPreviewSerializer(serializers.Serializer):
    """
    Resultado de la vista previa
    """
    columnas_detectadas = serializers.DictField()
    muestra_datos = serializers.ListField(child=serializers.DictField())
    total_filas = serializers.IntegerField()
    estructura_valida = serializers.BooleanField()
    observaciones = serializers.ListField(child=serializers.CharField())
    columnas_requeridas = serializers.ListField(child=serializers.CharField())
    columnas_opcionales = serializers.ListField(child=serializers.CharField())