# -*- coding: utf-8 -*-
"""
Modelos para todos los códigos de referencia y catálogos del sistema NeurAudit
Según Resolución 2284 de 2023 y normativa colombiana de salud
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class CodigoGlosa(models.Model):
    """
    Códigos de glosas según Resolución 2284 de 2023
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Código de 6 caracteres: AA0000
    codigo = models.CharField(max_length=6, unique=True, db_index=True)
    categoria = models.CharField(max_length=2, db_index=True)  # FA, TA, SO, AU, CO, CL, SA
    
    CATEGORIA_CHOICES = [
        ('FA', 'Facturación'),
        ('TA', 'Tarifas'),
        ('SO', 'Soportes'),
        ('AU', 'Autorizaciones'),
        ('CO', 'Cobertura'),
        ('CL', 'Calidad'),
        ('SA', 'Seguimiento de Acuerdos')
    ]
    categoria_nombre = models.CharField(max_length=30, choices=CATEGORIA_CHOICES)
    
    # Descripción
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    
    # Aplicación
    aplica_consulta = models.BooleanField(default=True)
    aplica_procedimiento = models.BooleanField(default=True)
    aplica_medicamento = models.BooleanField(default=True)
    aplica_dispositivo = models.BooleanField(default=True)
    aplica_urgencias = models.BooleanField(default=True)
    aplica_hospitalizacion = models.BooleanField(default=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    fecha_vigencia = models.DateField()
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'codigos_glosas'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['categoria']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class CodigoDevolucion(models.Model):
    """
    Códigos de devolución según Resolución 2284 de 2023
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Código: DE + número
    codigo = models.CharField(max_length=5, unique=True, db_index=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    
    # Tipo de causal
    TIPO_CAUSAL_CHOICES = [
        ('ADMINISTRATIVA', 'Administrativa'),
        ('ASEGURAMIENTO', 'Aseguramiento'),
        ('CONTRACTUAL', 'Contractual'),
        ('NORMATIVA', 'Normativa')
    ]
    tipo_causal = models.CharField(max_length=20, choices=TIPO_CAUSAL_CHOICES)
    
    # Documentos requeridos para subsanar
    documentos_requeridos = models.TextField(blank=True)
    
    # Plazo respuesta
    plazo_respuesta_dias = models.IntegerField(default=5)
    
    # Estado
    activo = models.BooleanField(default=True)
    fecha_vigencia = models.DateField()
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'codigos_devolucion'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['tipo_causal']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class CodigoCIE10(models.Model):
    """
    Códigos CIE-10 de diagnósticos
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Código CIE-10 (3-7 caracteres)
    codigo = models.CharField(max_length=7, unique=True, db_index=True)
    nombre = models.CharField(max_length=300)
    descripcion = models.TextField(blank=True)
    
    # Categorización
    capitulo = models.CharField(max_length=5)  # I, II, III, etc.
    capitulo_nombre = models.CharField(max_length=200)
    grupo = models.CharField(max_length=10, blank=True)
    categoria = models.CharField(max_length=10, blank=True)
    
    # Características
    es_principal = models.BooleanField(default=True)
    requiere_causa_externa = models.BooleanField(default=False)
    edad_minima = models.IntegerField(null=True, blank=True)
    edad_maxima = models.IntegerField(null=True, blank=True)
    aplica_sexo = models.CharField(
        max_length=1,
        choices=[('M', 'Masculino'), ('F', 'Femenino'), ('Z', 'Ambos')],
        default='Z'
    )
    
    # Estado
    activo = models.BooleanField(default=True)
    fecha_vigencia = models.DateField()
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'codigos_cie10'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['capitulo']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class CodigoDANE(models.Model):
    """
    Códigos DANE de departamentos y municipios
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Códigos
    codigo_departamento = models.CharField(max_length=2, db_index=True)
    codigo_municipio = models.CharField(max_length=5, unique=True, db_index=True)
    
    # Nombres
    nombre_departamento = models.CharField(max_length=100)
    nombre_municipio = models.CharField(max_length=100)
    
    # Región
    REGION_CHOICES = [
        ('ANDINA', 'Andina'),
        ('CARIBE', 'Caribe'),
        ('PACIFICA', 'Pacífica'),
        ('ORINOQUIA', 'Orinoquía'),
        ('AMAZONIA', 'Amazonía'),
        ('INSULAR', 'Insular')
    ]
    region = models.CharField(max_length=20, choices=REGION_CHOICES)
    
    # Características
    es_capital_departamento = models.BooleanField(default=False)
    poblacion = models.IntegerField(null=True, blank=True)
    area_km2 = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'codigos_dane'
        ordering = ['codigo_municipio']
        indexes = [
            models.Index(fields=['codigo_departamento']),
            models.Index(fields=['codigo_municipio']),
            models.Index(fields=['region'])
        ]
    
    def __str__(self):
        return f"{self.codigo_municipio} - {self.nombre_municipio}, {self.nombre_departamento}"


class TipoDocumentoIdentificacion(models.Model):
    """
    Tipos de documento de identificación
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=5, unique=True, db_index=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True)
    
    # Características
    aplica_personas_naturales = models.BooleanField(default=True)
    aplica_personas_juridicas = models.BooleanField(default=False)
    requiere_digito_verificacion = models.BooleanField(default=False)
    longitud_minima = models.IntegerField(null=True, blank=True)
    longitud_maxima = models.IntegerField(null=True, blank=True)
    formato_validacion = models.CharField(max_length=100, blank=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tipos_documento_identificacion'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class TipoUsuarioRIPS(models.Model):
    """
    Tipos de usuario RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=2, unique=True, db_index=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    
    # Régimen aplicable
    aplica_contributivo = models.BooleanField(default=True)
    aplica_subsidiado = models.BooleanField(default=True)
    aplica_especial = models.BooleanField(default=False)
    aplica_vinculado = models.BooleanField(default=False)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tipos_usuario_rips'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class EstadoAfiliacion(models.Model):
    """
    Estados de afiliación BDUA
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=5, unique=True, db_index=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True)
    
    # Características
    permite_atencion = models.BooleanField(default=True)
    genera_pago = models.BooleanField(default=True)
    es_temporal = models.BooleanField(default=False)
    dias_duracion = models.IntegerField(null=True, blank=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'estados_afiliacion'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class TipoServicioRIPS(models.Model):
    """
    Tipos de servicio RIPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=2, unique=True, db_index=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    
    # Archivos RIPS asociados
    archivo_rips = models.CharField(max_length=10)  # AC, AP, AM, AT, AU, AH, AN
    
    # Características
    requiere_autorizacion = models.BooleanField(default=False)
    genera_copago = models.BooleanField(default=True)
    genera_cuota_moderadora = models.BooleanField(default=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tipos_servicio_rips'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['archivo_rips']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class ViaIngreso(models.Model):
    """
    Vías de ingreso para servicios de salud
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=2, unique=True, db_index=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    
    # Aplicación
    aplica_urgencias = models.BooleanField(default=True)
    aplica_hospitalizacion = models.BooleanField(default=True)
    aplica_consulta_externa = models.BooleanField(default=False)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vias_ingreso'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class CausaAtencion(models.Model):
    """
    Causas de atención médica
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=2, unique=True, db_index=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    
    # Tipo
    TIPO_CAUSA_CHOICES = [
        ('ENFERMEDAD_GENERAL', 'Enfermedad General'),
        ('ACCIDENTE_TRABAJO', 'Accidente de Trabajo'),
        ('ACCIDENTE_TRANSITO', 'Accidente de Tránsito'),
        ('EVENTO_CATASTROFICO', 'Evento Catastrófico'),
        ('ENFERMEDAD_PROFESIONAL', 'Enfermedad Profesional'),
        ('VIOLENCIA', 'Violencia'),
        ('OTRO', 'Otro')
    ]
    tipo_causa = models.CharField(max_length=30, choices=TIPO_CAUSA_CHOICES)
    
    # Responsable del pago
    responsable_primario = models.CharField(max_length=50)
    responsable_secundario = models.CharField(max_length=50, blank=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'causas_atencion'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['tipo_causa']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class TipoPrestador(models.Model):
    """
    Tipos de prestador de servicios de salud
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=10, unique=True, db_index=True)
    sigla = models.CharField(max_length=10)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    
    # Naturaleza jurídica
    NATURALEZA_CHOICES = [
        ('PUBLICA', 'Pública'),
        ('PRIVADA', 'Privada'),
        ('MIXTA', 'Mixta')
    ]
    naturaleza_juridica = models.CharField(max_length=10, choices=NATURALEZA_CHOICES)
    
    # Características
    requiere_habilitacion = models.BooleanField(default=True)
    puede_contratar_eps = models.BooleanField(default=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tipos_prestador'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['sigla']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.sigla} - {self.nombre}"


class EstadoValidacion(models.Model):
    """
    Estados de validación para facturas y cuentas médicas
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=20, unique=True, db_index=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True)
    
    # Flujo
    es_inicial = models.BooleanField(default=False)
    es_final = models.BooleanField(default=False)
    permite_edicion = models.BooleanField(default=True)
    genera_notificacion = models.BooleanField(default=True)
    
    # Estados siguientes permitidos
    estados_siguientes = models.JSONField(default=list)
    
    # Colores para UI
    color_badge = models.CharField(max_length=20, default='secondary')
    icono = models.CharField(max_length=50, blank=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'estados_validacion'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['es_inicial']),
            models.Index(fields=['es_final']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"