# -*- coding: utf-8 -*-
# apps/radicacion/serializers_rips.py

"""
Serializers para APIs REST de RIPS - NeurAudit Colombia
Serialización de modelos RIPS con subdocumentos embebidos
"""

from rest_framework import serializers
from bson import ObjectId
from datetime import datetime
from decimal import Decimal

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

# ==========================================
# SERIALIZERS PARA SUBDOCUMENTOS EMBEBIDOS
# ==========================================

class RIPSUsuarioDatosSerializer(serializers.Serializer):
    """Serializer para datos personales embebidos"""
    fechaNacimiento = serializers.DateField()
    sexo = serializers.ChoiceField(choices=['M', 'F'])
    municipioResidencia = serializers.CharField(max_length=5)
    zonaResidencia = serializers.ChoiceField(choices=['R', 'U'])

class RIPSValidacionBDUASerializer(serializers.Serializer):
    """Serializer para validación BDUA embebida"""
    tieneDerechos = serializers.BooleanField()
    regimen = serializers.CharField(allow_null=True, required=False)
    epsActual = serializers.CharField(allow_null=True, required=False)
    fechaValidacion = serializers.DateTimeField()
    observaciones = serializers.CharField(allow_null=True, required=False)

class RIPSEstadisticasUsuarioSerializer(serializers.Serializer):
    """Serializer para estadísticas de usuario embebidas"""
    totalServicios = serializers.IntegerField(default=0)
    valorTotal = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    serviciosValidados = serializers.IntegerField(default=0)
    serviciosGlosados = serializers.IntegerField(default=0)
    valorGlosado = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)

class RIPSConsultaSerializer(serializers.Serializer):
    """Serializer para servicios de consulta embebidos"""
    codPrestador = serializers.CharField(max_length=20)
    fechaAtencion = serializers.DateTimeField()
    numAutorizacion = serializers.CharField(max_length=30, allow_null=True, required=False)
    codConsulta = serializers.CharField(max_length=10)
    modalidadGrupoServicioTecSal = serializers.CharField(max_length=2)
    grupoServicios = serializers.CharField(max_length=2)
    codServicio = serializers.CharField(max_length=10)
    finalidadTecnologiaSalud = serializers.CharField(max_length=2)
    causaMotivo = serializers.CharField(max_length=2)
    diagnosticoPrincipal = serializers.CharField(max_length=4)
    diagnosticoRelacionado1 = serializers.CharField(max_length=4, allow_null=True, required=False)
    diagnosticoRelacionado2 = serializers.CharField(max_length=4, allow_null=True, required=False)
    diagnosticoRelacionado3 = serializers.CharField(max_length=4, allow_null=True, required=False)
    tipoDiagnosticoPrincipal = serializers.CharField(max_length=1)
    tipoDocumentoIdentificacion = serializers.CharField(max_length=2)
    numDocumentoIdentificacion = serializers.CharField(max_length=20)
    vrServicio = serializers.DecimalField(max_digits=15, decimal_places=2)
    conceptoRecaudo = serializers.CharField(max_length=2)
    valorPagoModerador = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    numFEPS = serializers.CharField(max_length=20, allow_null=True, required=False)
    
    # Campos de validación
    estadoValidacion = serializers.ChoiceField(
        choices=['PENDIENTE', 'VALIDADO', 'GLOSADO', 'DEVUELTO'],
        default='PENDIENTE'
    )
    glosas = serializers.ListField(
        child=serializers.CharField(max_length=10),
        required=False
    )
    observaciones = serializers.CharField(allow_null=True, required=False)

class RIPSProcedimientoSerializer(serializers.Serializer):
    """Serializer para procedimientos embebidos"""
    codPrestador = serializers.CharField(max_length=20)
    fechaAtencion = serializers.DateTimeField()
    numAutorizacion = serializers.CharField(max_length=30, allow_null=True, required=False)
    codProcedimiento = serializers.CharField(max_length=10)
    viaIngresoServicioSalud = serializers.CharField(max_length=1)
    modalidadGrupoServicioTecSal = serializers.CharField(max_length=2)
    grupoServicios = serializers.CharField(max_length=2)
    codServicio = serializers.CharField(max_length=10)
    finalidadTecnologiaSalud = serializers.CharField(max_length=2)
    tipoDocumentoIdentificacion = serializers.CharField(max_length=2)
    numDocumentoIdentificacion = serializers.CharField(max_length=20)
    diagnosticoPrincipal = serializers.CharField(max_length=4)
    diagnosticoRelacionado = serializers.CharField(max_length=4, allow_null=True, required=False)
    complicacion = serializers.CharField(max_length=4, allow_null=True, required=False)
    tipoDocumentoIdentificacion2 = serializers.CharField(max_length=2, allow_null=True, required=False)
    numDocumentoIdentificacion2 = serializers.CharField(max_length=20, allow_null=True, required=False)
    vrServicio = serializers.DecimalField(max_digits=15, decimal_places=2)
    conceptoRecaudo = serializers.CharField(max_length=2)
    valorPagoModerador = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    numFEPS = serializers.CharField(max_length=20, allow_null=True, required=False)
    
    # Campos de validación
    estadoValidacion = serializers.ChoiceField(
        choices=['PENDIENTE', 'VALIDADO', 'GLOSADO', 'DEVUELTO'],
        default='PENDIENTE'
    )
    glosas = serializers.ListField(
        child=serializers.CharField(max_length=10),
        required=False
    )
    observaciones = serializers.CharField(allow_null=True, required=False)

class RIPSMedicamentoSerializer(serializers.Serializer):
    """Serializer para medicamentos embebidos"""
    codPrestador = serializers.CharField(max_length=20)
    fechaAtencion = serializers.DateTimeField()
    numAutorizacion = serializers.CharField(max_length=30, allow_null=True, required=False)
    codTecnologiaSalud = serializers.CharField(max_length=20)
    nomTecnologiaSalud = serializers.CharField(max_length=200)
    tipoDocumentoIdentificacion = serializers.CharField(max_length=2)
    numDocumentoIdentificacion = serializers.CharField(max_length=20)
    cantidadSuministrada = serializers.DecimalField(max_digits=10, decimal_places=2)
    tipoUnidadMedida = serializers.CharField(max_length=20)
    valorUnitarioTecnologia = serializers.DecimalField(max_digits=15, decimal_places=2)
    valorTotalTecnologia = serializers.DecimalField(max_digits=15, decimal_places=2)
    conceptoRecaudo = serializers.CharField(max_length=2)
    valorPagoModerador = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    numFEPS = serializers.CharField(max_length=20, allow_null=True, required=False)
    
    # Campos de validación
    estadoValidacion = serializers.ChoiceField(
        choices=['PENDIENTE', 'VALIDADO', 'GLOSADO', 'DEVUELTO'],
        default='PENDIENTE'
    )
    glosas = serializers.ListField(
        child=serializers.CharField(max_length=10),
        required=False
    )
    observaciones = serializers.CharField(allow_null=True, required=False)

class RIPSServiciosUsuarioSerializer(serializers.Serializer):
    """Serializer para todos los servicios de un usuario"""
    consultas = RIPSConsultaSerializer(many=True, required=False)
    procedimientos = RIPSProcedimientoSerializer(many=True, required=False)
    medicamentos = RIPSMedicamentoSerializer(many=True, required=False)
    # Se pueden agregar urgencias, hospitalización, etc. según necesidad

class RIPSTrazabilidadSerializer(serializers.Serializer):
    """Serializer para eventos de trazabilidad"""
    evento = serializers.CharField(max_length=50)
    fecha = serializers.DateTimeField()
    usuario = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
    datos_adicionales = serializers.JSONField(required=False)

class RIPSEstadisticasTransaccionSerializer(serializers.Serializer):
    """Serializer para estadísticas globales de transacción"""
    totalUsuarios = serializers.IntegerField(default=0)
    totalServicios = serializers.IntegerField(default=0)
    valorTotalFacturado = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    serviciosValidados = serializers.IntegerField(default=0)
    serviciosGlosados = serializers.IntegerField(default=0)
    valorGlosado = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    distribucionServicios = serializers.JSONField(default=dict)
    fechaCalculo = serializers.DateTimeField()

class RIPSPreAuditoriaSerializer(serializers.Serializer):
    """Serializer para resultados de pre-auditoría"""
    preDevolucion = serializers.JSONField(default=dict)
    preGlosas = serializers.JSONField(default=dict)
    fechaPreAuditoria = serializers.DateTimeField()
    asignacion = serializers.JSONField(required=False, allow_null=True)

# ==========================================
# SERIALIZER PARA USUARIO RIPS EMBEBIDO
# ==========================================

class RIPSUsuarioSerializer(serializers.Serializer):
    """Serializer para usuario RIPS embebido"""
    tipoDocumento = serializers.CharField(max_length=5)
    numeroDocumento = serializers.CharField(max_length=20)
    datosPersonales = RIPSUsuarioDatosSerializer(required=False)
    servicios = RIPSServiciosUsuarioSerializer(required=False)
    validacionBDUA = RIPSValidacionBDUASerializer(required=False)
    estadisticasUsuario = RIPSEstadisticasUsuarioSerializer(required=False)

# ==========================================
# SERIALIZER PRINCIPAL TRANSACCIÓN RIPS
# ==========================================

class RIPSTransaccionSerializer(serializers.ModelSerializer):
    """
    Serializer principal para transacciones RIPS
    Maneja documento raíz con subdocumentos embebidos
    """
    id = ObjectIdField(read_only=True)
    
    # Subdocumentos embebidos
    usuarios = RIPSUsuarioSerializer(many=True, required=False)
    preAuditoria = RIPSPreAuditoriaSerializer(required=False)
    estadisticasTransaccion = RIPSEstadisticasTransaccionSerializer(required=False)
    trazabilidad = RIPSTrazabilidadSerializer(many=True, required=False)
    
    class Meta:
        model = RIPSTransaccion
        fields = [
            'id', 'numFactura', 'prestadorNit', 'prestadorRazonSocial',
            'fechaRadicacion', 'estadoProcesamiento', 'usuarios',
            'preAuditoria', 'estadisticasTransaccion', 'trazabilidad',
            'archivoRIPSOriginal', 'hashArchivoRIPS', 'tamanoArchivo',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'fechaRadicacion']

class RIPSTransaccionListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listados de transacciones
    Omite subdocumentos pesados para mejorar rendimiento
    """
    id = ObjectIdField(read_only=True)
    total_usuarios = serializers.SerializerMethodField()
    total_servicios = serializers.SerializerMethodField()
    valor_total = serializers.SerializerMethodField()
    
    class Meta:
        model = RIPSTransaccion
        fields = [
            'id', 'numFactura', 'prestadorNit', 'prestadorRazonSocial',
            'fechaRadicacion', 'estadoProcesamiento', 'total_usuarios',
            'total_servicios', 'valor_total', 'created_at'
        ]
    
    def get_total_usuarios(self, obj):
        """Obtiene total de usuarios desde estadísticas"""
        if hasattr(obj, 'estadisticasTransaccion') and obj.estadisticasTransaccion:
            return getattr(obj.estadisticasTransaccion, 'totalUsuarios', 0)
        return len(obj.usuarios) if obj.usuarios else 0
    
    def get_total_servicios(self, obj):
        """Obtiene total de servicios desde estadísticas"""
        if hasattr(obj, 'estadisticasTransaccion') and obj.estadisticasTransaccion:
            return getattr(obj.estadisticasTransaccion, 'totalServicios', 0)
        return 0
    
    def get_valor_total(self, obj):
        """Obtiene valor total desde estadísticas"""
        if hasattr(obj, 'estadisticasTransaccion') and obj.estadisticasTransaccion:
            valor = getattr(obj.estadisticasTransaccion, 'valorTotalFacturado', 0)
            return float(valor) if valor else 0.0
        return 0.0

# ==========================================
# SERIALIZERS PARA REQUESTS/RESPONSES
# ==========================================

class RIPSProcesarRequestSerializer(serializers.Serializer):
    """Request para procesar archivo RIPS"""
    archivo_rips = serializers.JSONField()
    prestador_nit = serializers.CharField(max_length=20)
    validar_bdua = serializers.BooleanField(default=True)

class RIPSBusquedaRequestSerializer(serializers.Serializer):
    """Request para búsqueda de transacciones RIPS"""
    prestador_nit = serializers.CharField(required=False)
    num_factura = serializers.CharField(required=False)
    estado = serializers.ChoiceField(
        choices=[
            'RADICADO', 'VALIDANDO', 'VALIDADO', 'PRE_AUDITORIA',
            'ASIGNADO_AUDITORIA', 'AUDITORIA', 'GLOSADO', 'RESPONDIDO',
            'CONCILIACION', 'PAGADO'
        ],
        required=False
    )
    fecha_desde = serializers.DateField(required=False)
    fecha_hasta = serializers.DateField(required=False)
    limit = serializers.IntegerField(default=50, min_value=1, max_value=500)

class RIPSValidacionBDUARequestSerializer(serializers.Serializer):
    """Request para validación BDUA en RIPS"""
    transaccion_id = serializers.CharField()
    forzar_revalidacion = serializers.BooleanField(default=False)

class RIPSPreAuditoriaRequestSerializer(serializers.Serializer):
    """Request para ejecutar pre-auditoría"""
    transaccion_id = serializers.CharField()
    incluir_validaciones_cups = serializers.BooleanField(default=True)
    incluir_validaciones_bdua = serializers.BooleanField(default=True)
    incluir_validaciones_tarifarias = serializers.BooleanField(default=False)

class RIPSAsignacionRequestSerializer(serializers.Serializer):
    """Request para asignación de auditoría"""
    transacciones_ids = serializers.ListField(
        child=serializers.CharField(),
        min_length=1
    )
    auditor_username = serializers.CharField(required=False)  # Si no se especifica, asignación automática
    criterios_especiales = serializers.JSONField(default=dict)

class RIPSEstadisticasResponseSerializer(serializers.Serializer):
    """Response para estadísticas RIPS"""
    periodo = serializers.JSONField()
    total_transacciones = serializers.IntegerField()
    valor_total_facturado = serializers.DecimalField(max_digits=15, decimal_places=2)
    distribucion_estados = serializers.JSONField()
    top_prestadores = serializers.JSONField()
    metricas_auditoria = serializers.JSONField()