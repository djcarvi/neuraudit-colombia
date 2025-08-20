# -*- coding: utf-8 -*-
# apps/radicacion/models_rips.py

"""
Modelos NoSQL para manejo de RIPS JSON según estructura oficial MinSalud
Estructura: transaccion{} -> usuarios[()] -> servicios{} -> consultas[{}], medicamentos[{}], etc.
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel
from django_mongodb_backend.models import EmbeddedModel

from datetime import datetime
from decimal import Decimal

class RIPSTransaccion(models.Model):
    """
    Transacción RIPS completa según estructura oficial MinSalud
    Contiene metadatos generales y referencia a usuarios con sus servicios
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación de la transacción (nivel raíz del JSON)
    num_documento_id_obligado = models.CharField(max_length=20, db_index=True)  # NIT del prestador
    num_factura = models.CharField(max_length=50, unique=True, db_index=True)  # Número de factura
    tipo_nota = models.CharField(max_length=10, blank=True, null=True)
    num_nota = models.CharField(max_length=50, blank=True, null=True)
    
    # Metadatos de procesamiento
    fecha_radicacion = models.DateTimeField(auto_now_add=True)
    archivo_origen_json = models.CharField(max_length=200, blank=True, null=True)
    archivo_origen_xml = models.CharField(max_length=200, blank=True, null=True)
    tamaño_archivo_kb = models.IntegerField(default=0)
    total_usuarios = models.IntegerField(default=0)
    total_servicios = models.IntegerField(default=0)
    
    # Estado de procesamiento
    estado_procesamiento = models.CharField(
        max_length=20,
        choices=[
            ('CARGANDO', 'Cargando'),
            ('PROCESADO', 'Procesado'),
            ('VALIDANDO', 'Validando'),
            ('VALIDADO', 'Validado'),
            ('ERROR', 'Error')
        ],
        default='CARGANDO'
    )
    
    # Estadísticas del RIPS
    estadisticas_servicios = models.JSONField(default=dict)  # Conteo por tipo de servicio
    valor_total_facturado = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_transacciones'
        indexes = [
            models.Index(fields=['num_documento_id_obligado']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['fecha_radicacion']),
            models.Index(fields=['estado_procesamiento']),
        ]
    
    def __str__(self):
        return f"RIPS {self.num_factura} - {self.num_documento_id_obligado} - {self.total_usuarios} usuarios"

class RIPSUsuario(models.Model):
    """
    Usuario individual dentro de un RIPS
    Puede tener múltiples tipos de servicios
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia a la transacción
    transaccion_id = models.CharField(max_length=24, db_index=True)  # ObjectId de RIPSTransaccion
    num_factura = models.CharField(max_length=50, db_index=True)  # Para consultas rápidas
    
    # Datos del usuario
    tipo_documento_identificacion = models.CharField(max_length=5, db_index=True)  # CC, TI, etc.
    num_documento_identificacion = models.CharField(max_length=20, db_index=True)
    tipo_usuario = models.CharField(max_length=5)  # 01, 02, etc.
    fecha_nacimiento = models.DateField()
    cod_sexo = models.CharField(max_length=1)  # M/F
    cod_pais_residencia = models.CharField(max_length=5, default='170')
    cod_municipio_residencia = models.CharField(max_length=10)
    cod_zona_territorial_residencia = models.CharField(max_length=5)
    incapacidad = models.CharField(max_length=5, default='SI')
    consecutivo = models.IntegerField()
    cod_pais_origen = models.CharField(max_length=5, default='170')
    
    # Estadísticas de servicios para este usuario
    total_consultas = models.IntegerField(default=0)
    total_procedimientos = models.IntegerField(default=0)
    total_urgencias = models.IntegerField(default=0)
    total_hospitalizacion = models.IntegerField(default=0)
    total_otros_servicios = models.IntegerField(default=0)
    total_medicamentos = models.IntegerField(default=0)
    total_recien_nacidos = models.IntegerField(default=0)
    total_suministros = models.IntegerField(default=0)
    
    valor_total_usuario = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_usuarios'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['tipo_documento_identificacion', 'num_documento_identificacion']),
            models.Index(fields=['fecha_nacimiento']),
            models.Index(fields=['cod_municipio_residencia']),
        ]
    
    def __str__(self):
        return f"{self.num_documento_identificacion} - {self.num_factura}"

class RIPSConsulta(models.Model):
    """
    Consultas médicas dentro del RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    num_documento_usuario = models.CharField(max_length=20, db_index=True)
    
    # Datos de la consulta
    cod_prestador = models.CharField(max_length=20, db_index=True)
    fecha_inicio_atencion = models.DateTimeField(db_index=True)
    num_autorizacion = models.CharField(max_length=50, blank=True, null=True)
    cod_consulta = models.CharField(max_length=10, db_index=True)  # Código CUPS
    modalidad_grupo_servicio_tec_sal = models.CharField(max_length=5)
    grupo_servicios = models.CharField(max_length=5)
    cod_servicio = models.IntegerField()
    finalidad_tecnologia_salud = models.CharField(max_length=5)
    causa_motivo_atencion = models.CharField(max_length=5)
    
    # Diagnósticos
    cod_diagnostico_principal = models.CharField(max_length=10, db_index=True)
    cod_diagnostico_relacionado1 = models.CharField(max_length=10, blank=True, null=True)
    cod_diagnostico_relacionado2 = models.CharField(max_length=10, blank=True, null=True)
    cod_diagnostico_relacionado3 = models.CharField(max_length=10, blank=True, null=True)
    tipo_diagnostico_principal = models.CharField(max_length=5)
    
    # Profesional que atiende
    tipo_documento_profesional = models.CharField(max_length=5)
    num_documento_profesional = models.CharField(max_length=20, db_index=True)
    
    # Valores financieros
    vr_servicio = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    concepto_recaudo = models.CharField(max_length=5)
    valor_pago_moderador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    num_fev_pago_moderador = models.CharField(max_length=50, blank=True, null=True)
    
    consecutivo = models.IntegerField()
    
    # Estado de validación
    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_consultas'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['usuario_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['cod_consulta']),  # CUPS
            models.Index(fields=['fecha_inicio_atencion']),
            models.Index(fields=['cod_prestador']),
            models.Index(fields=['estado_validacion']),
            models.Index(fields=['cod_diagnostico_principal']),
        ]
    
    def __str__(self):
        return f"Consulta {self.cod_consulta} - {self.num_documento_usuario} - {self.num_factura}"

class RIPSProcedimiento(models.Model):
    """
    Procedimientos médicos dentro del RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    num_documento_usuario = models.CharField(max_length=20, db_index=True)
    
    # Datos del procedimiento
    cod_prestador = models.CharField(max_length=20, db_index=True)
    fecha_inicio_atencion = models.DateTimeField(db_index=True)
    id_mipres = models.CharField(max_length=50, blank=True, null=True)
    num_autorizacion = models.CharField(max_length=50, blank=True, null=True)
    cod_procedimiento = models.CharField(max_length=10, db_index=True)  # Código CUPS
    via_ingreso_servicio_salud = models.CharField(max_length=5)
    modalidad_grupo_servicio_tec_sal = models.CharField(max_length=5)
    grupo_servicios = models.CharField(max_length=5)
    cod_servicio = models.IntegerField()
    finalidad_tecnologia_salud = models.CharField(max_length=5)
    
    # Profesional que realiza
    tipo_documento_profesional = models.CharField(max_length=5)
    num_documento_profesional = models.CharField(max_length=20, db_index=True)
    
    # Diagnósticos
    cod_diagnostico_principal = models.CharField(max_length=10, db_index=True)
    cod_diagnostico_relacionado = models.CharField(max_length=10, blank=True, null=True)
    cod_complicacion = models.CharField(max_length=10, blank=True, null=True)
    
    # Valores financieros
    vr_servicio = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    concepto_recaudo = models.CharField(max_length=5)
    valor_pago_moderador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    num_fev_pago_moderador = models.CharField(max_length=50, blank=True, null=True)
    
    consecutivo = models.IntegerField()
    
    # Estado de validación
    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_procedimientos'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['usuario_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['cod_procedimiento']),  # CUPS
            models.Index(fields=['fecha_inicio_atencion']),
            models.Index(fields=['cod_prestador']),
            models.Index(fields=['estado_validacion']),
            models.Index(fields=['cod_diagnostico_principal']),
        ]
    
    def __str__(self):
        return f"Procedimiento {self.cod_procedimiento} - {self.num_documento_usuario} - {self.num_factura}"

class RIPSUrgencias(models.Model):
    """
    Atenciones de urgencias dentro del RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    num_documento_usuario = models.CharField(max_length=20, db_index=True)
    
    # Datos de urgencias
    cod_prestador = models.CharField(max_length=20, db_index=True)
    fecha_inicio_atencion = models.DateTimeField(db_index=True)
    causa_motivo_atencion = models.CharField(max_length=5)
    
    # Diagnósticos de ingreso
    cod_diagnostico_principal = models.CharField(max_length=10, db_index=True)
    
    # Diagnósticos de egreso
    cod_diagnostico_principal_e = models.CharField(max_length=10, db_index=True)
    cod_diagnostico_relacionado_e1 = models.CharField(max_length=10, blank=True, null=True)
    cod_diagnostico_relacionado_e2 = models.CharField(max_length=10, blank=True, null=True)
    cod_diagnostico_relacionado_e3 = models.CharField(max_length=10, blank=True, null=True)
    
    # Egreso
    condicion_destino_usuario_egreso = models.CharField(max_length=5)
    cod_diagnostico_causa_muerte = models.CharField(max_length=10, blank=True, null=True)
    fecha_egreso = models.DateTimeField()
    
    consecutivo = models.IntegerField()
    
    # Estado de validación
    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_urgencias'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['usuario_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['fecha_inicio_atencion']),
            models.Index(fields=['fecha_egreso']),
            models.Index(fields=['cod_prestador']),
            models.Index(fields=['estado_validacion']),
            models.Index(fields=['cod_diagnostico_principal']),
            models.Index(fields=['cod_diagnostico_principal_e']),
        ]
    
    def __str__(self):
        return f"Urgencia - {self.num_documento_usuario} - {self.num_factura}"

class RIPSHospitalizacion(models.Model):
    """
    Hospitalizaciones dentro del RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    num_documento_usuario = models.CharField(max_length=20, db_index=True)
    
    # Datos de hospitalización
    cod_prestador = models.CharField(max_length=20, db_index=True)
    via_ingreso_servicio_salud = models.CharField(max_length=5)
    fecha_inicio_atencion = models.DateTimeField(db_index=True)
    num_autorizacion = models.CharField(max_length=50, blank=True, null=True)
    causa_motivo_atencion = models.CharField(max_length=5)
    
    # Diagnósticos de ingreso
    cod_diagnostico_principal = models.CharField(max_length=10, db_index=True)
    
    # Diagnósticos de egreso
    cod_diagnostico_principal_e = models.CharField(max_length=10, db_index=True)
    cod_diagnostico_relacionado_e1 = models.CharField(max_length=10, blank=True, null=True)
    cod_diagnostico_relacionado_e2 = models.CharField(max_length=10, blank=True, null=True)
    cod_diagnostico_relacionado_e3 = models.CharField(max_length=10, blank=True, null=True)
    cod_complicacion = models.CharField(max_length=10, blank=True, null=True)
    
    # Egreso
    condicion_destino_usuario_egreso = models.CharField(max_length=5)
    cod_diagnostico_causa_muerte = models.CharField(max_length=10, blank=True, null=True)
    fecha_egreso = models.DateTimeField()
    
    consecutivo = models.IntegerField()
    
    # Estado de validación
    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_hospitalizacion'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['usuario_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['fecha_inicio_atencion']),
            models.Index(fields=['fecha_egreso']),
            models.Index(fields=['cod_prestador']),
            models.Index(fields=['estado_validacion']),
            models.Index(fields=['cod_diagnostico_principal']),
            models.Index(fields=['cod_diagnostico_principal_e']),
        ]
    
    def __str__(self):
        return f"Hospitalización - {self.num_documento_usuario} - {self.num_factura}"

class RIPSOtrosServicios(models.Model):
    """
    Otros servicios (estancias, etc.) dentro del RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    num_documento_usuario = models.CharField(max_length=20, db_index=True)
    
    # Datos del servicio
    cod_prestador = models.CharField(max_length=20, db_index=True)
    num_autorizacion = models.CharField(max_length=50, blank=True, null=True)
    id_mipres = models.CharField(max_length=50, blank=True, null=True)
    fecha_suministro_tecnologia = models.DateTimeField(db_index=True)
    tipo_os = models.CharField(max_length=5)  # Tipo de otros servicios
    cod_tecnologia_salud = models.CharField(max_length=20, db_index=True)
    nom_tecnologia_salud = models.CharField(max_length=200)
    cantidad_os = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Profesional
    tipo_documento_profesional = models.CharField(max_length=5)
    num_documento_profesional = models.CharField(max_length=20, db_index=True)
    
    # Valores financieros
    vr_unit_os = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    vr_servicio = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    concepto_recaudo = models.CharField(max_length=5)
    valor_pago_moderador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    num_fev_pago_moderador = models.CharField(max_length=50, blank=True, null=True)
    
    consecutivo = models.IntegerField()
    
    # Estado de validación
    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_otros_servicios'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['usuario_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['cod_tecnologia_salud']),
            models.Index(fields=['fecha_suministro_tecnologia']),
            models.Index(fields=['cod_prestador']),
            models.Index(fields=['estado_validacion']),
            models.Index(fields=['tipo_os']),
        ]
    
    def __str__(self):
        return f"Otro Servicio {self.cod_tecnologia_salud} - {self.num_documento_usuario} - {self.num_factura}"

class RIPSRecienNacidos(models.Model):
    """
    Recién nacidos dentro del RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    num_documento_usuario = models.CharField(max_length=20, db_index=True)  # Madre
    
    # Datos del recién nacido
    cod_prestador = models.CharField(max_length=20, db_index=True)
    tipo_documento_identificacion = models.CharField(max_length=5)  # CN (Certificado de Nacido Vivo)
    num_documento_identificacion = models.CharField(max_length=30, db_index=True)  # Número certificado
    fecha_nacimiento = models.DateTimeField(db_index=True)
    edad_gestacional = models.IntegerField()  # Semanas
    num_consultas_c_prenatal = models.IntegerField(default=0)
    cod_sexo_biologico = models.CharField(max_length=5)  # 01=M, 02=F
    peso = models.IntegerField()  # Gramos
    
    # Diagnósticos
    cod_diagnostico_principal = models.CharField(max_length=10, db_index=True)
    
    # Egreso
    condicion_destino_usuario_egreso = models.CharField(max_length=5)
    cod_diagnostico_causa_muerte = models.CharField(max_length=10, blank=True, null=True)
    fecha_egreso = models.DateTimeField()
    
    consecutivo = models.IntegerField()
    
    # Estado de validación
    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_recien_nacidos'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['usuario_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['num_documento_identificacion']),
            models.Index(fields=['fecha_nacimiento']),
            models.Index(fields=['cod_prestador']),
            models.Index(fields=['estado_validacion']),
            models.Index(fields=['cod_diagnostico_principal']),
            models.Index(fields=['peso']),
            models.Index(fields=['edad_gestacional']),
        ]
    
    def __str__(self):
        return f"Recién Nacido {self.num_documento_identificacion} - {self.fecha_nacimiento} - {self.num_factura}"

class RIPSMedicamentos(models.Model):
    """
    Medicamentos/Suministros dentro del RIPS
    Aunque este archivo específico no tiene, el modelo debe estar preparado
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencias
    transaccion_id = models.CharField(max_length=24, db_index=True)
    usuario_id = models.CharField(max_length=24, db_index=True)
    num_factura = models.CharField(max_length=50, db_index=True)
    num_documento_usuario = models.CharField(max_length=20, db_index=True)
    
    # Datos del medicamento
    cod_prestador = models.CharField(max_length=20, db_index=True)
    num_autorizacion = models.CharField(max_length=50, blank=True, null=True)
    id_mipres = models.CharField(max_length=50, blank=True, null=True)
    fecha_suministro_medicamento = models.DateTimeField(db_index=True)
    tipo_medicamento = models.CharField(max_length=5)  # 01=Medicamento, 02=Material, etc
    cod_medicamento = models.CharField(max_length=50, db_index=True)  # CUM
    tipo_medicamento_codigo = models.CharField(max_length=5)  # CUM/IUM
    nom_medicamento = models.CharField(max_length=200)
    forma_farmaceutica = models.CharField(max_length=100, blank=True, null=True)
    concentracion_medicamento = models.CharField(max_length=100, blank=True, null=True)
    unidad_medida_medicamento = models.CharField(max_length=20)
    cantidad_medicamento = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Profesional que prescribe
    tipo_documento_profesional = models.CharField(max_length=5)
    num_documento_profesional = models.CharField(max_length=20, db_index=True)
    
    # Valores financieros
    vr_unitario_medicamento = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    vr_servicio = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    concepto_recaudo = models.CharField(max_length=5)
    valor_pago_moderador = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    num_fev_pago_moderador = models.CharField(max_length=50, blank=True, null=True)
    
    consecutivo = models.IntegerField()
    
    # Estado de validación
    estado_validacion = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('VALIDADO', 'Validado'),
            ('GLOSADO', 'Glosado'),
            ('DEVUELTO', 'Devuelto')
        ],
        default='PENDIENTE'
    )
    
    # Control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rips_medicamentos'
        indexes = [
            models.Index(fields=['transaccion_id']),
            models.Index(fields=['usuario_id']),
            models.Index(fields=['num_factura']),
            models.Index(fields=['cod_medicamento']),  # CUM
            models.Index(fields=['fecha_suministro_medicamento']),
            models.Index(fields=['cod_prestador']),
            models.Index(fields=['estado_validacion']),
            models.Index(fields=['tipo_medicamento']),
            models.Index(fields=['tipo_medicamento_codigo']),
        ]
    
    def __str__(self):
        return f"Medicamento {self.cod_medicamento} - {self.num_documento_usuario} - {self.num_factura}"