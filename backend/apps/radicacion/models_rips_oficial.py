# -*- coding: utf-8 -*-
# apps/radicacion/models_rips_oficial.py

"""
Modelos RIPS con Django MongoDB Backend Oficial - NeurAudit Colombia
Estructura oficial MinSalud con subdocumentos embebidos
Siguiendo documentación oficial Django MongoDB Backend
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel
from datetime import datetime
from decimal import Decimal

# ==========================================
# MODELOS EMBEBIDOS (SUBDOCUMENTOS)
# ==========================================

class RIPSUsuarioDatos(EmbeddedModel):
    """Subdocumento con datos personales del usuario"""
    fechaNacimiento = models.DateField()
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino')])
    municipioResidencia = models.CharField(max_length=5)  # Código DANE
    zonaResidencia = models.CharField(max_length=1, choices=[('R', 'Rural'), ('U', 'Urbana')])

class RIPSValidacionBDUA(EmbeddedModel):
    """Subdocumento con resultado de validación BDUA"""
    tieneDerechos = models.BooleanField(default=False)
    regimen = models.CharField(max_length=20, blank=True, null=True)
    epsActual = models.CharField(max_length=10, blank=True, null=True)
    fechaValidacion = models.DateTimeField(default=datetime.now)
    observaciones = models.TextField(blank=True, null=True)

class RIPSEstadisticasUsuario(EmbeddedModel):
    """Subdocumento con estadísticas calculadas del usuario"""
    totalServicios = models.IntegerField(default=0)
    valorTotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    serviciosValidados = models.IntegerField(default=0)
    serviciosGlosados = models.IntegerField(default=0)
    valorGlosado = models.DecimalField(max_digits=15, decimal_places=2, default=0)

class RIPSConsulta(EmbeddedModel):
    """Subdocumento para servicios de consulta"""
    codPrestador = models.CharField(max_length=20)
    fechaAtencion = models.DateTimeField()
    numAutorizacion = models.CharField(max_length=30, blank=True, null=True)
    codConsulta = models.CharField(max_length=10)  # Código CUPS
    modalidadGrupoServicioTecSal = models.CharField(max_length=2)
    grupoServicios = models.CharField(max_length=2)
    codServicio = models.CharField(max_length=10)
    finalidadTecnologiaSalud = models.CharField(max_length=2)
    causaMotivo = models.CharField(max_length=2)
    diagnosticoPrincipal = models.CharField(max_length=4)
    diagnosticoRelacionado1 = models.CharField(max_length=4, blank=True, null=True)
    diagnosticoRelacionado2 = models.CharField(max_length=4, blank=True, null=True)
    diagnosticoRelacionado3 = models.CharField(max_length=4, blank=True, null=True)
    tipoDiagnosticoPrincipal = models.CharField(max_length=1)
    tipoDocumentoIdentificacion = models.CharField(max_length=2)
    numDocumentoIdentificacion = models.CharField(max_length=20)
    vrServicio = models.DecimalField(max_digits=15, decimal_places=2)
    conceptoRecaudo = models.CharField(max_length=2)
    valorPagoModerador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    numFEPS = models.CharField(max_length=20, blank=True, null=True)
    
    # Validación y glosas
    estadoValidacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente Validación'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    glosas = ArrayField(models.CharField(max_length=10), null=True, blank=True)  # Códigos de glosa
    observaciones = models.TextField(blank=True, null=True)

class RIPSProcedimiento(EmbeddedModel):
    """Subdocumento para procedimientos"""
    codPrestador = models.CharField(max_length=20)
    fechaAtencion = models.DateTimeField()
    numAutorizacion = models.CharField(max_length=30, blank=True, null=True)
    codProcedimiento = models.CharField(max_length=10)  # Código CUPS
    viaIngresoServicioSalud = models.CharField(max_length=1)
    modalidadGrupoServicioTecSal = models.CharField(max_length=2)
    grupoServicios = models.CharField(max_length=2)
    codServicio = models.CharField(max_length=10)
    finalidadTecnologiaSalud = models.CharField(max_length=2)
    tipoDocumentoIdentificacion = models.CharField(max_length=2)
    numDocumentoIdentificacion = models.CharField(max_length=20)
    diagnosticoPrincipal = models.CharField(max_length=4)
    diagnosticoRelacionado = models.CharField(max_length=4, blank=True, null=True)
    complicacion = models.CharField(max_length=4, blank=True, null=True)
    tipoDocumentoIdentificacion2 = models.CharField(max_length=2, blank=True, null=True)
    numDocumentoIdentificacion2 = models.CharField(max_length=20, blank=True, null=True)
    vrServicio = models.DecimalField(max_digits=15, decimal_places=2)
    conceptoRecaudo = models.CharField(max_length=2)
    valorPagoModerador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    numFEPS = models.CharField(max_length=20, blank=True, null=True)
    
    # Validación y glosas
    estadoValidacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente Validación'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    glosas = ArrayField(models.CharField(max_length=10), null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

class RIPSMedicamento(EmbeddedModel):
    """Subdocumento para medicamentos y suministros"""
    codPrestador = models.CharField(max_length=20)
    fechaAtencion = models.DateTimeField()
    numAutorizacion = models.CharField(max_length=30, blank=True, null=True)
    codTecnologiaSalud = models.CharField(max_length=20)  # Código CUM/IUM
    nomTecnologiaSalud = models.CharField(max_length=200)
    tipoDocumentoIdentificacion = models.CharField(max_length=2)
    numDocumentoIdentificacion = models.CharField(max_length=20)
    cantidadSuministrada = models.DecimalField(max_digits=10, decimal_places=2)
    tipoUnidadMedida = models.CharField(max_length=20)
    valorUnitarioTecnologia = models.DecimalField(max_digits=15, decimal_places=2)
    vrServicio = models.DecimalField(max_digits=15, decimal_places=2)
    conceptoRecaudo = models.CharField(max_length=2)
    valorPagoModerador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    numFEPS = models.CharField(max_length=20, blank=True, null=True)
    
    # Validación y glosas
    estadoValidacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente Validación'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    glosas = ArrayField(models.CharField(max_length=10), null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

class RIPSUrgencia(EmbeddedModel):
    """Subdocumento para servicios de urgencias"""
    codPrestador = models.CharField(max_length=20)
    fechaAtencion = models.DateTimeField()
    causaExterna = models.CharField(max_length=2)
    diagnosticoPrincipal = models.CharField(max_length=4)
    diagnosticoRelacionado1 = models.CharField(max_length=4, blank=True, null=True)
    diagnosticoRelacionado2 = models.CharField(max_length=4, blank=True, null=True)
    diagnosticoRelacionado3 = models.CharField(max_length=4, blank=True, null=True)
    destinoSalidaServicioSalud = models.CharField(max_length=1)
    estadoSalidaServicioSalud = models.CharField(max_length=1)
    causaMuerteDirecta = models.CharField(max_length=4, blank=True, null=True)
    causaMuerteAntecedente = models.CharField(max_length=4, blank=True, null=True)
    tipoDocumentoIdentificacion = models.CharField(max_length=2)
    numDocumentoIdentificacion = models.CharField(max_length=20)
    vrServicio = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Validación y glosas
    estadoValidacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente Validación'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    glosas = ArrayField(models.CharField(max_length=10), null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

class RIPSHospitalizacion(EmbeddedModel):
    """Subdocumento para servicios de hospitalización"""
    codPrestador = models.CharField(max_length=20)
    viaIngresoServicioSalud = models.CharField(max_length=1)
    fechaIngresoServicioSalud = models.DateTimeField()
    numAutorizacion = models.CharField(max_length=30, blank=True, null=True)
    causaExterna = models.CharField(max_length=2)
    diagnosticoPrincipalIngreso = models.CharField(max_length=4)
    diagnosticoPrincipalEgreso = models.CharField(max_length=4)
    diagnosticoRelacionadoEgreso1 = models.CharField(max_length=4, blank=True, null=True)
    diagnosticoRelacionadoEgreso2 = models.CharField(max_length=4, blank=True, null=True)
    diagnosticoRelacionadoEgreso3 = models.CharField(max_length=4, blank=True, null=True)
    complicacion = models.CharField(max_length=4, blank=True, null=True)
    condicionDestinoUsuarioEgreso = models.CharField(max_length=1)
    estadoSalidaServicioSalud = models.CharField(max_length=1)
    causaMuerteDirecta = models.CharField(max_length=4, blank=True, null=True)
    causaMuerteAntecedente = models.CharField(max_length=4, blank=True, null=True)
    fechaEgresoServicioSalud = models.DateTimeField()
    tipoDocumentoIdentificacion = models.CharField(max_length=2)
    numDocumentoIdentificacion = models.CharField(max_length=20)
    vrServicio = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Validación y glosas
    estadoValidacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente Validación'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    glosas = ArrayField(models.CharField(max_length=10), null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

class RIPSRecienNacido(EmbeddedModel):
    """Subdocumento para recién nacidos"""
    codPrestador = models.CharField(max_length=20)
    tipoDocumentoIdentificacion = models.CharField(max_length=2)
    numDocumentoIdentificacion = models.CharField(max_length=20)
    fechaNacimiento = models.DateTimeField()
    edadGestacional = models.IntegerField()
    numConsultasCrecimientoDesarrollo = models.IntegerField(default=0)
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino')])
    peso = models.DecimalField(max_digits=5, decimal_places=2)  # En gramos
    talla = models.DecimalField(max_digits=5, decimal_places=2)  # En centímetros
    tipoDocumentoIdentificacionMadre = models.CharField(max_length=2)
    numDocumentoIdentificacionMadre = models.CharField(max_length=20)
    
    # Validación y glosas
    estadoValidacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente Validación'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    glosas = ArrayField(models.CharField(max_length=10), null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

class RIPSOtrosServicios(EmbeddedModel):
    """Subdocumento para otros servicios"""
    codPrestador = models.CharField(max_length=20)
    numAutorizacion = models.CharField(max_length=30, blank=True, null=True)
    idMIPRES = models.CharField(max_length=50, blank=True, null=True)
    fechaAtencion = models.DateTimeField()
    codTecnologiaSalud = models.CharField(max_length=20)
    nomTecnologiaSalud = models.CharField(max_length=200)
    cantidadSuministrada = models.DecimalField(max_digits=10, decimal_places=2)
    tipoUnidadMedida = models.CharField(max_length=20)
    valorUnitarioTecnologia = models.DecimalField(max_digits=15, decimal_places=2)
    valorTotalTecnologia = models.DecimalField(max_digits=15, decimal_places=2)
    tipoDocumentoIdentificacion = models.CharField(max_length=2)
    numDocumentoIdentificacion = models.CharField(max_length=20)
    conceptoRecaudo = models.CharField(max_length=2)
    valorPagoModerador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Validación y glosas
    estadoValidacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente Validación'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    glosas = ArrayField(models.CharField(max_length=10), null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

class RIPSServiciosUsuario(EmbeddedModel):
    """Subdocumento con todos los servicios de un usuario"""
    consultas = EmbeddedModelArrayField(RIPSConsulta, null=True, blank=True)
    procedimientos = EmbeddedModelArrayField(RIPSProcedimiento, null=True, blank=True)
    medicamentos = EmbeddedModelArrayField(RIPSMedicamento, null=True, blank=True)
    urgencias = EmbeddedModelArrayField(RIPSUrgencia, null=True, blank=True)
    hospitalizacion = EmbeddedModelArrayField(RIPSHospitalizacion, null=True, blank=True)
    recienNacidos = EmbeddedModelArrayField(RIPSRecienNacido, null=True, blank=True)
    otrosServicios = EmbeddedModelArrayField(RIPSOtrosServicios, null=True, blank=True)

class RIPSEstadisticasTransaccion(EmbeddedModel):
    """Subdocumento con estadísticas globales de la transacción"""
    totalUsuarios = models.IntegerField(default=0)
    totalServicios = models.IntegerField(default=0)
    valorTotalFacturado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    serviciosValidados = models.IntegerField(default=0)
    serviciosGlosados = models.IntegerField(default=0)
    valorGlosado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Distribución por tipo de servicio
    distribucionServicios = models.JSONField(default=dict)  # {"consultas": 100, "procedimientos": 50, ...}
    
    fechaCalculo = models.DateTimeField(auto_now=True)

class RIPSPreAuditoria(EmbeddedModel):
    """Subdocumento con resultados de pre-auditoría automática"""
    preDevolucion = models.JSONField(default=dict)  # {"requiere": bool, "causales": []}
    preGlosas = models.JSONField(default=dict)  # {"total": int, "porCategoria": {}, "valorTotal": decimal}
    fechaPreAuditoria = models.DateTimeField(auto_now=True)
    
    # Asignación de auditoría
    asignacion = models.JSONField(default=dict, null=True, blank=True)  # Datos de asignación

class RIPSTrazabilidad(EmbeddedModel):
    """Actor de trazabilidad para auditoría"""
    evento = models.CharField(max_length=50)
    fecha = models.DateTimeField()
    usuario = models.CharField(max_length=100)
    descripcion = models.TextField()
    datos_adicionales = models.JSONField(default=dict, null=True, blank=True)

# ==========================================
# MODELO PRINCIPAL (DOCUMENTO RAÍZ)
# ==========================================

class RIPSUsuarioOficial(EmbeddedModel):
    """Subdocumento para cada usuario en la transacción RIPS"""
    tipoDocumento = models.CharField(max_length=5, db_index=True)
    numeroDocumento = models.CharField(max_length=20, db_index=True)
    
    # Datos personales embebidos
    datosPersonales = EmbeddedModelField(RIPSUsuarioDatos, null=True, blank=True)
    
    # Servicios embebidos
    servicios = EmbeddedModelField(RIPSServiciosUsuario, null=True, blank=True)
    
    # Validación BDUA embebida
    validacionBDUA = EmbeddedModelField(RIPSValidacionBDUA, null=True, blank=True)
    
    # Estadísticas embebidas
    estadisticasUsuario = EmbeddedModelField(RIPSEstadisticasUsuario, null=True, blank=True)

class RIPSTransaccionOficial(models.Model):
    """
    Documento principal de transacción RIPS
    Estructura oficial MinSalud con subdocumentos embebidos
    """
    id = ObjectIdAutoField(primary_key=True)  # ✅ PRIMARY KEY
    
    # Metadatos de la transacción
    numFactura = models.CharField(max_length=50, unique=True, db_index=True)
    prestadorNit = models.CharField(max_length=20, db_index=True)
    prestadorRazonSocial = models.CharField(max_length=200)
    fechaRadicacion = models.DateTimeField(auto_now_add=True, db_index=True)
    
    # Estado de procesamiento
    estadoProcesamiento = models.CharField(
        max_length=20,
        choices=[
            ('RADICADO', 'Radicado'),
            ('VALIDANDO', 'En Validación'),
            ('VALIDADO', 'Validado'),
            ('PRE_AUDITORIA', 'Pre-Auditoría'),
            ('ASIGNADO_AUDITORIA', 'Asignado a Auditoría'),
            ('AUDITORIA', 'En Auditoría'),
            ('GLOSADO', 'Glosado'),
            ('RESPONDIDO', 'Respondido por PSS'),
            ('CONCILIACION', 'En Conciliación'),
            ('PAGADO', 'Pagado'),
        ],
        default='RADICADO',
        db_index=True
    )
    
    # Array de usuarios con sus servicios (ESTRUCTURA OFICIAL MINSALUD)
    usuarios = EmbeddedModelArrayField(RIPSUsuarioOficial, null=True, blank=True)
    
    # Resultados de pre-auditoría embebidos
    preAuditoria = EmbeddedModelField(RIPSPreAuditoria, null=True, blank=True)
    
    # Estadísticas globales embebidas
    estadisticasTransaccion = EmbeddedModelField(RIPSEstadisticasTransaccion, null=True, blank=True)
    
    # Array de trazabilidad
    trazabilidad = EmbeddedModelArrayField(RIPSTrazabilidad, null=True, blank=True)
    
    # Metadatos adicionales
    archivoRIPSOriginal = models.CharField(max_length=200, blank=True, null=True)  # Path al archivo
    hashArchivoRIPS = models.CharField(max_length=64, blank=True, null=True)  # SHA256
    tamanoArchivo = models.BigIntegerField(null=True, blank=True)  # Bytes
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_transacciones'
        indexes = [
            # Índices principales
            models.Index(fields=['numFactura', 'prestadorNit'], name='rips_factura_prestador_idx'),
            models.Index(fields=['fechaRadicacion'], name='rips_fecha_idx'),
            models.Index(fields=['estadoProcesamiento'], name='rips_estado_idx'),
            
            # Nota: Índices en arrays de subdocumentos se manejan directamente en MongoDB
            
            # Índices compuestos optimizados
            models.Index(fields=['prestadorNit', 'fechaRadicacion'], name='rips_prestador_fecha_idx'),
            models.Index(fields=['estadoProcesamiento', 'fechaRadicacion'], name='rips_estado_fecha_idx'),
        ]
    
    def __str__(self):
        return f"RIPS {self.numFactura} - {self.prestadorNit} - {self.estadoProcesamiento}"
    
    def calcular_estadisticas(self):
        """Calcula y actualiza las estadísticas de la transacción"""
        if not self.usuarios:
            return
        
        total_usuarios = len(self.usuarios)
        total_servicios = 0
        valor_total = Decimal('0.00')
        servicios_validados = 0
        servicios_glosados = 0
        valor_glosado = Decimal('0.00')
        
        distribucion_servicios = {
            'consultas': 0,
            'procedimientos': 0,
            'medicamentos': 0,
            'urgencias': 0,
            'hospitalizacion': 0,
            'recienNacidos': 0,
            'otrosServicios': 0
        }
        
        for usuario in self.usuarios:
            if usuario.servicios:
                servicios = usuario.servicios
                
                # Contar consultas
                if servicios.consultas:
                    count = len(servicios.consultas)
                    distribucion_servicios['consultas'] += count
                    total_servicios += count
                    for consulta in servicios.consultas:
                        valor_total += consulta.vrServicio
                        if consulta.estadoValidacion == 'VALIDADO':
                            servicios_validados += 1
                        elif consulta.estadoValidacion == 'GLOSADO':
                            servicios_glosados += 1
                            valor_glosado += consulta.vrServicio
                
                # Contar procedimientos
                if servicios.procedimientos:
                    count = len(servicios.procedimientos)
                    distribucion_servicios['procedimientos'] += count
                    total_servicios += count
                    for procedimiento in servicios.procedimientos:
                        valor_total += procedimiento.vrServicio
                        if procedimiento.estadoValidacion == 'VALIDADO':
                            servicios_validados += 1
                        elif procedimiento.estadoValidacion == 'GLOSADO':
                            servicios_glosados += 1
                            valor_glosado += procedimiento.vrServicio
                
                # Similar para otros tipos de servicio...
                # (medicamentos, urgencias, hospitalizacion, recienNacidos, otrosServicios)
        
        # Crear o actualizar estadísticas
        if not self.estadisticasTransaccion:
            self.estadisticasTransaccion = RIPSEstadisticasTransaccion()
        
        self.estadisticasTransaccion.totalUsuarios = total_usuarios
        self.estadisticasTransaccion.totalServicios = total_servicios
        self.estadisticasTransaccion.valorTotalFacturado = valor_total
        self.estadisticasTransaccion.serviciosValidados = servicios_validados
        self.estadisticasTransaccion.serviciosGlosados = servicios_glosados
        self.estadisticasTransaccion.valorGlosado = valor_glosado
        self.estadisticasTransaccion.distribucionServicios = distribucion_servicios
        
        self.save()
    
    def agregar_trazabilidad(self, evento: str, usuario: str, descripcion: str, datos_adicionales: dict = None):
        """Agrega un evento de trazabilidad"""
        if not self.trazabilidad:
            self.trazabilidad = []
        
        evento_trazabilidad = RIPSTrazabilidad(
            evento=evento,
            fecha=datetime.now(),
            usuario=usuario,
            descripcion=descripcion,
            datos_adicionales=datos_adicionales or {}
        )
        
        self.trazabilidad.append(evento_trazabilidad)
        self.save()