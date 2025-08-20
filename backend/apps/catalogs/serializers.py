# -*- coding: utf-8 -*-
# apps/catalogs/serializers.py

"""
Serializers para APIs REST de catálogos - NeurAudit Colombia
Serialización MongoDB ObjectId con Django MongoDB Backend
"""

from rest_framework import serializers
from bson import ObjectId
from .models import (
    CatalogoCUPSOficial, CatalogoCUMOficial, CatalogoIUMOficial, 
    CatalogoDispositivosOficial, BDUAAfiliados, Prestadores, Contratos
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


class CatalogoCUPSOficialSerializer(serializers.ModelSerializer):
    """
    Serializer para el catálogo oficial CUPS
    """
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = CatalogoCUPSOficial
        fields = [
            'id', 'codigo', 'nombre', 'descripcion', 'habilitado',
            'aplicacion', 'uso_codigo_cup', 'es_quirurgico', 
            'numero_minimo', 'numero_maximo', 'diagnostico_requerido',
            'sexo', 'ambito', 'estancia', 'cobertura', 'duplicado',
            'valor_registro', 'usuario_responsable', 'fecha_actualizacion',
            'is_public_private', 'created_at', 'updated_at'
        ]


class CatalogoCUMOficialSerializer(serializers.ModelSerializer):
    """
    Serializer para el catálogo oficial CUM
    """
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = CatalogoCUMOficial
        fields = [
            'id', 'codigo', 'nombre', 'descripcion', 'habilitado',
            'es_muestra_medica', 'codigo_atc', 'atc', 'registro_sanitario',
            'principio_activo', 'cantidad_principio_activo', 'unidad_medida_principio',
            'via_administracion', 'cantidad_presentacion', 'unidad_medida_presentacion',
            'aplicacion', 'valor_registro', 'usuario_responsable', 
            'fecha_actualizacion', 'is_public_private', 'created_at', 'updated_at'
        ]


class CatalogoIUMOficialSerializer(serializers.ModelSerializer):
    """
    Serializer para el catálogo oficial IUM
    """
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = CatalogoIUMOficial
        fields = [
            'id', 'codigo', 'nombre', 'descripcion', 'habilitado',
            'ium_nivel_i', 'ium_nivel_ii', 'ium_nivel_iii',
            'principio_activo', 'codigo_principio_activo',
            'forma_farmaceutica', 'codigo_forma_farmaceutica',
            'codigo_forma_comercializacion', 'condicion_registro_muestra',
            'unidad_empaque', 'valor_registro', 'usuario_responsable',
            'fecha_actualizacion', 'is_public_private', 'created_at', 'updated_at'
        ]


class CatalogoDispositivosOficialSerializer(serializers.ModelSerializer):
    """
    Serializer para el catálogo oficial de Dispositivos Médicos
    """
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = CatalogoDispositivosOficial
        fields = [
            'id', 'codigo', 'nombre', 'descripcion', 'habilitado',
            'version_mipres', 'fecha_mipres', 'aplicacion',
            'valor_registro', 'usuario_responsable', 'fecha_actualizacion',
            'is_public_private', 'created_at', 'updated_at'
        ]


class BDUAAfiliadosSerializer(serializers.ModelSerializer):
    """
    Serializer para BDUA Afiliados
    """
    id = ObjectIdField(read_only=True)
    nombre_completo = serializers.ReadOnlyField()
    tiene_derechos_vigentes = serializers.ReadOnlyField()
    
    class Meta:
        model = BDUAAfiliados
        fields = [
            'id', 'id_unico', 'codigo_eps', 'regimen', 'tipo_afiliacion',
            'usuario_tipo_documento', 'usuario_numero_documento',
            'usuario_primer_apellido', 'usuario_segundo_apellido',
            'usuario_primer_nombre', 'usuario_segundo_nombre',
            'usuario_fecha_nacimiento', 'usuario_sexo', 'usuario_tipo_usuario',
            'cotizante_tipo_documento', 'cotizante_numero_documento',
            'familia_parentesco', 'familia_id_cabeza_familia', 'familia_tipo_subsidio',
            'ubicacion_departamento', 'ubicacion_municipio', 'ubicacion_zona',
            'caracteristicas_discapacidad', 'caracteristicas_etnia_poblacion',
            'caracteristicas_nivel_sisben', 'caracteristicas_puntaje_sisben',
            'caracteristicas_ficha_sisben',
            'afiliacion_fecha_afiliacion', 'afiliacion_fecha_efectiva_bd',
            'afiliacion_fecha_retiro', 'afiliacion_causal_retiro',
            'afiliacion_fecha_retiro_bd', 'afiliacion_tipo_traslado',
            'afiliacion_estado_traslado', 'afiliacion_estado_afiliacion',
            'afiliacion_fecha_ultima_novedad', 'afiliacion_fecha_defuncion',
            'contributivo_codigo_entidad', 'contributivo_subred', 'contributivo_ibc',
            'metadata_archivo_origen', 'metadata_fecha_carga',
            'metadata_fecha_actualizacion', 'metadata_version_bdua',
            'metadata_observaciones',
            'nombre_completo', 'tiene_derechos_vigentes',
            'created_at', 'updated_at'
        ]


class BDUAAfiliadosSearchSerializer(serializers.Serializer):
    """
    Serializer para búsquedas específicas en BDUA
    """
    tipo_documento = serializers.CharField(max_length=5)
    numero_documento = serializers.CharField(max_length=20)
    fecha_atencion = serializers.DateField(required=False)


class BDUAValidacionDerechosSerializer(serializers.Serializer):
    """
    Serializer para respuesta de validación de derechos
    """
    valido = serializers.BooleanField()
    causal_devolucion = serializers.CharField(required=False)
    mensaje = serializers.CharField(required=False)
    regimen = serializers.CharField(required=False)
    nivel_sisben = serializers.CharField(required=False)
    tipo_usuario = serializers.CharField(required=False)
    estado_afiliacion = serializers.CharField(required=False)


class PrestadoresSerializer(serializers.ModelSerializer):
    """
    Serializer para Prestadores
    """
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Prestadores
        fields = [
            'id', 'nit', 'razon_social', 'tipo_identificacion', 'numero_documento',
            'tipo_prestador', 'categoria', 'codigo_habilitacion', 'fecha_habilitacion',
            'estado', 'contacto_telefono', 'contacto_email', 'contacto_direccion',
            'contacto_municipio', 'contacto_departamento',
            'representante_nombre', 'representante_documento',
            'representante_telefono', 'representante_email',
            'created_at', 'updated_at'
        ]


class ContratosSerializer(serializers.ModelSerializer):
    """
    Serializer para Contratos
    """
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Contratos
        fields = [
            'id', 'numero_contrato', 'prestador_nit', 'eps_codigo',
            'tipo_contrato', 'fecha_inicio', 'fecha_fin', 'valor_contrato', 'estado',
            'modalidad_porcentaje_primer_pago', 'modalidad_dias_primer_pago',
            'modalidad_condiciones_especiales',
            'clausulas_archivo_pdf', 'clausulas_hash_archivo', 'clausulas_fecha_carga',
            'created_at', 'updated_at'
        ]


# Serializers para búsquedas avanzadas y validaciones

class BusquedaCUPSRequestSerializer(serializers.Serializer):
    """Request para búsqueda avanzada CUPS"""
    termino = serializers.CharField(required=False, allow_blank=True)
    es_quirurgico = serializers.BooleanField(required=False, allow_null=True)
    sexo = serializers.ChoiceField(choices=['M', 'F', 'Z'], required=False)
    ambito = serializers.ChoiceField(choices=['A', 'H', 'Z'], required=False)
    limit = serializers.IntegerField(default=100, min_value=1, max_value=500)


class BusquedaMedicamentoRequestSerializer(serializers.Serializer):
    """Request para búsqueda unificada medicamentos"""
    termino = serializers.CharField(required=True)
    tipo = serializers.ChoiceField(
        choices=['CUM', 'IUM', 'AMBOS'], 
        default='AMBOS'
    )
    limit = serializers.IntegerField(default=100, min_value=1, max_value=500)


class ValidacionCUPSRequestSerializer(serializers.Serializer):
    """Request para validación CUPS con contexto"""
    codigo = serializers.CharField(required=True)
    sexo_paciente = serializers.ChoiceField(choices=['M', 'F'], required=False)
    ambito = serializers.ChoiceField(choices=['A', 'H'], required=False)


class ValidacionBDUARequestSerializer(serializers.Serializer):
    """Request para validación BDUA"""
    tipo_documento = serializers.CharField(required=True)
    numero_documento = serializers.CharField(required=True)
    fecha_atencion = serializers.DateField(required=True)
    prestador_nit = serializers.CharField(required=False)