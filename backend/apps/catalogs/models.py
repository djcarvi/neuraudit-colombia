# -*- coding: utf-8 -*-
# apps/catalogs/models.py

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField
from datetime import datetime

class CatalogoCUPSOficial(models.Model):
    """
    Catálogo oficial CUPS (Clasificación Única de Procedimientos en Salud)
    ~450,000 códigos de procedimientos médicos
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Campos principales del catálogo CUPS
    codigo = models.CharField(max_length=10, unique=True, db_index=True)  # Ej: 010100
    nombre = models.TextField()  # Descripción del procedimiento
    descripcion = models.TextField()  # Sección y categoría detallada
    habilitado = models.BooleanField(default=True)
    
    # Campos de aplicación y uso
    aplicacion = models.CharField(max_length=50, blank=True, null=True)
    uso_codigo_cup = models.CharField(max_length=10, blank=True, null=True)  # AP, etc.
    
    # Características del procedimiento
    es_quirurgico = models.BooleanField(default=False)  # S/N
    numero_minimo = models.IntegerField(null=True, blank=True)
    numero_maximo = models.IntegerField(null=True, blank=True)
    diagnostico_requerido = models.BooleanField(default=False)  # S/N
    
    # Restricciones
    sexo = models.CharField(max_length=1, blank=True, null=True)  # M/F/Z
    ambito = models.CharField(max_length=1, blank=True, null=True)  # A/H/Z
    estancia = models.CharField(max_length=1, blank=True, null=True)  # E/Z
    cobertura = models.CharField(max_length=10, blank=True, null=True)  # 01/02
    duplicado = models.CharField(max_length=1, blank=True, null=True)  # D/Z
    
    # Metadatos
    valor_registro = models.CharField(max_length=50, blank=True, null=True)
    usuario_responsable = models.CharField(max_length=100, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField()
    is_public_private = models.CharField(max_length=10, blank=True, null=True)
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_cups_oficial'
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['habilitado', 'es_quirurgico']),
            models.Index(fields=['sexo', 'ambito']),
            models.Index(fields=['cobertura']),
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre[:50]}"

class CatalogoCUMOficial(models.Model):
    """
    Catálogo oficial CUM (Código Único de Medicamentos)
    ~950,000 medicamentos (ambas tablas unificadas)
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación del medicamento
    codigo = models.CharField(max_length=50, unique=True, db_index=True)  # CUM único
    nombre = models.TextField()  # Nombre comercial
    descripcion = models.TextField()  # Descripción completa
    habilitado = models.BooleanField(default=True)
    
    # Clasificación farmacológica
    es_muestra_medica = models.BooleanField(default=False)  # SI/NO
    codigo_atc = models.CharField(max_length=20, blank=True, null=True)  # Código ATC
    atc = models.CharField(max_length=200, blank=True, null=True)  # Descripción ATC
    registro_sanitario = models.CharField(max_length=50, blank=True, null=True)  # INVIMA
    
    # Principio activo
    principio_activo = models.TextField(blank=True, null=True)
    cantidad_principio_activo = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    unidad_medida_principio = models.CharField(max_length=20, blank=True, null=True)
    
    # Presentación
    via_administracion = models.CharField(max_length=50, blank=True, null=True)  # ORAL/PARENTERAL/etc.
    cantidad_presentacion = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    unidad_medida_presentacion = models.CharField(max_length=20, blank=True, null=True)
    
    # Metadatos
    aplicacion = models.CharField(max_length=50, blank=True, null=True)
    valor_registro = models.CharField(max_length=50, blank=True, null=True)
    usuario_responsable = models.CharField(max_length=100, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField()
    is_public_private = models.CharField(max_length=10, blank=True, null=True)
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_cum_oficial'
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['habilitado', 'es_muestra_medica']),
            models.Index(fields=['codigo_atc']),
            models.Index(fields=['registro_sanitario']),
            models.Index(fields=['via_administracion']),
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre[:50]}"

class CatalogoIUMOficial(models.Model):
    """
    Catálogo oficial IUM (Identificador Único de Medicamento)
    ~500,000 presentaciones comerciales
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación IUM
    codigo = models.CharField(max_length=20, unique=True, db_index=True)  # IUM 15 dígitos
    nombre = models.TextField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    habilitado = models.BooleanField(default=True)
    
    # Jerarquía IUM
    ium_nivel_i = models.CharField(max_length=20, blank=True, null=True)
    ium_nivel_ii = models.CharField(max_length=20, blank=True, null=True)
    ium_nivel_iii = models.CharField(max_length=20, blank=True, null=True)
    
    # Principio activo
    principio_activo = models.TextField(blank=True, null=True)
    codigo_principio_activo = models.CharField(max_length=20, blank=True, null=True)
    
    # Forma farmacéutica
    forma_farmaceutica = models.CharField(max_length=100, blank=True, null=True)
    codigo_forma_farmaceutica = models.CharField(max_length=20, blank=True, null=True)
    codigo_forma_comercializacion = models.CharField(max_length=20, blank=True, null=True)
    
    # Condiciones
    condicion_registro_muestra = models.CharField(max_length=100, blank=True, null=True)
    unidad_empaque = models.CharField(max_length=20, blank=True, null=True)  # CAJA/TABLETA/VIAL
    
    # Metadatos
    valor_registro = models.CharField(max_length=50, blank=True, null=True)
    usuario_responsable = models.CharField(max_length=100, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField()
    is_public_private = models.CharField(max_length=10, blank=True, null=True)
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_ium_oficial'
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['habilitado']),
            models.Index(fields=['ium_nivel_i']),
            models.Index(fields=['codigo_principio_activo']),
            models.Index(fields=['codigo_forma_farmaceutica']),
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.principio_activo or 'N/A'}"

class CatalogoDispositivosOficial(models.Model):
    """
    Catálogo oficial Dispositivos Médicos
    ~2,000 dispositivos médicos
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación del dispositivo
    codigo = models.CharField(max_length=10, unique=True, db_index=True)  # Código 3 dígitos
    nombre = models.TextField()
    descripcion = models.TextField()
    habilitado = models.BooleanField(default=True)
    
    # Tipo de dispositivo
    es_libertad_vigilada = models.BooleanField(default=False, db_index=True)  # True si es de libertad vigilada
    
    # Información MIPRES
    version_mipres = models.CharField(max_length=10, blank=True, null=True)
    fecha_mipres = models.DateField(null=True, blank=True)
    
    # Metadatos
    aplicacion = models.CharField(max_length=50, blank=True, null=True)
    valor_registro = models.CharField(max_length=50, blank=True, null=True)
    usuario_responsable = models.CharField(max_length=100, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField()
    is_public_private = models.CharField(max_length=10, blank=True, null=True)
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_dispositivos_oficial'
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['habilitado']),
            models.Index(fields=['version_mipres']),
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre[:50]}"

class BDUAAfiliados(models.Model):
    """
    Base de Datos Única de Afiliados (BDUA) - Documento NoSQL Unificado
    Régimen Subsidiado y Contributivo en una sola colección
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # IDENTIFICACIÓN ÚNICA SISTEMA
    id_unico = models.CharField(max_length=20, unique=True, db_index=True)  # ID único BDUA
    codigo_eps = models.CharField(max_length=10, db_index=True)  # EPSS41/EPS037
    
    # RÉGIMEN Y TIPO (Campo unificado)
    regimen = models.CharField(
        max_length=20, 
        choices=[('SUBSIDIADO', 'Subsidiado'), ('CONTRIBUTIVO', 'Contributivo')],
        db_index=True
    )
    tipo_afiliacion = models.CharField(max_length=1, blank=True, null=True)  # R=Rural, U=Urbano
    
    # DATOS BÁSICOS USUARIO (Subdocumento)
    usuario_tipo_documento = models.CharField(max_length=5, db_index=True)  # CC/TI/RC/CE/PA/AS/MS
    usuario_numero_documento = models.CharField(max_length=20, db_index=True)  # Documento del usuario
    usuario_primer_apellido = models.CharField(max_length=50, blank=True, null=True)
    usuario_segundo_apellido = models.CharField(max_length=50, blank=True, null=True)
    usuario_primer_nombre = models.CharField(max_length=50, blank=True, null=True)
    usuario_segundo_nombre = models.CharField(max_length=50, blank=True, null=True)
    usuario_fecha_nacimiento = models.DateField()
    usuario_sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino')])
    usuario_tipo_usuario = models.CharField(max_length=1, blank=True, null=True)  # C/B/F
    
    # COTIZANTE (si aplica - Subdocumento)
    cotizante_tipo_documento = models.CharField(max_length=5, blank=True, null=True)
    cotizante_numero_documento = models.CharField(max_length=20, blank=True, null=True)
    
    # DATOS FAMILIARES (Subdocumento)
    familia_parentesco = models.IntegerField(null=True, blank=True)
    familia_id_cabeza_familia = models.CharField(max_length=20, blank=True, null=True)
    familia_tipo_subsidio = models.IntegerField(null=True, blank=True)
    
    # UBICACIÓN GEOGRÁFICA (Subdocumento)
    ubicacion_departamento = models.CharField(max_length=5, db_index=True)  # Código DANE
    ubicacion_municipio = models.CharField(max_length=5, db_index=True)     # Código DANE
    ubicacion_zona = models.CharField(max_length=1, blank=True, null=True)  # 1=Urbana, 2=Rural
    
    # CARACTERISTICAS ESPECIALES (Subdocumento)
    caracteristicas_discapacidad = models.CharField(max_length=1, blank=True, null=True)  # N/S
    caracteristicas_etnia_poblacion = models.CharField(max_length=5, blank=True, null=True)
    caracteristicas_nivel_sisben = models.CharField(max_length=10, blank=True, null=True)  # A01-A05, B01-B06, etc.
    caracteristicas_puntaje_sisben = models.CharField(max_length=20, blank=True, null=True)
    caracteristicas_ficha_sisben = models.CharField(max_length=20, blank=True, null=True)
    
    # ESTADO AFILIACIÓN (Subdocumento)
    afiliacion_fecha_afiliacion = models.DateField()
    afiliacion_fecha_efectiva_bd = models.DateField(db_index=True)
    afiliacion_fecha_retiro = models.DateField(null=True, blank=True)
    afiliacion_causal_retiro = models.CharField(max_length=5, blank=True, null=True)
    afiliacion_fecha_retiro_bd = models.DateField(null=True, blank=True)
    afiliacion_tipo_traslado = models.CharField(max_length=5, blank=True, null=True)
    afiliacion_estado_traslado = models.CharField(max_length=5, blank=True, null=True)
    afiliacion_estado_afiliacion = models.CharField(
        max_length=5, 
        choices=[
            ('AC', 'Activo'),
            ('ST', 'Suspendido Temporal'),
            ('PL', 'Pendiente Legalización'),
            ('RE', 'Retirado'),
            ('AF', 'Afiliado')
        ],
        db_index=True
    )
    afiliacion_fecha_ultima_novedad = models.DateField(null=True, blank=True)
    afiliacion_fecha_defuncion = models.DateField(null=True, blank=True)
    
    # DATOS CONTRIBUTIVO (Subdocumento - solo si aplica)
    contributivo_codigo_entidad = models.CharField(max_length=20, blank=True, null=True)
    contributivo_subred = models.CharField(max_length=20, blank=True, null=True)
    contributivo_ibc = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    # METADATOS (Subdocumento)
    metadata_archivo_origen = models.CharField(max_length=100, blank=True, null=True)
    metadata_fecha_carga = models.DateTimeField(auto_now_add=True)
    metadata_fecha_actualizacion = models.DateTimeField(auto_now=True)
    metadata_version_bdua = models.CharField(max_length=20, blank=True, null=True)
    metadata_observaciones = models.TextField(blank=True, null=True)
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bdua_afiliados'
        indexes = [
            # Índice principal por documento
            models.Index(fields=['usuario_tipo_documento', 'usuario_numero_documento']),
            # Índice por código EPS + documento
            models.Index(fields=['codigo_eps', 'usuario_numero_documento']),
            # Índice por estado de afiliación
            models.Index(fields=['afiliacion_estado_afiliacion', 'afiliacion_fecha_efectiva_bd']),
            # Índice por régimen
            models.Index(fields=['regimen', 'afiliacion_estado_afiliacion']),
            # Índice por ubicación geográfica
            models.Index(fields=['ubicacion_departamento', 'ubicacion_municipio']),
            # Índice por fecha de nacimiento
            models.Index(fields=['usuario_fecha_nacimiento']),
            # Índice único compuesto
            models.Index(fields=['codigo_eps', 'usuario_tipo_documento', 'usuario_numero_documento']),
        ]
    
    def __str__(self):
        return f"{self.usuario_numero_documento} - {self.regimen} - {self.afiliacion_estado_afiliacion}"
    
    @property
    def nombre_completo(self):
        """Construye el nombre completo del usuario"""
        nombres = []
        if self.usuario_primer_nombre:
            nombres.append(self.usuario_primer_nombre)
        if self.usuario_segundo_nombre:
            nombres.append(self.usuario_segundo_nombre)
        if self.usuario_primer_apellido:
            nombres.append(self.usuario_primer_apellido)
        if self.usuario_segundo_apellido:
            nombres.append(self.usuario_segundo_apellido)
        return ' '.join(nombres)
    
    @property
    def tiene_derechos_vigentes(self):
        """Verifica si el usuario tiene derechos vigentes"""
        return (
            self.afiliacion_estado_afiliacion in ['AC', 'ST'] and
            (not self.afiliacion_fecha_retiro or self.afiliacion_fecha_retiro > datetime.now().date())
        )
    
    def validar_derechos_en_fecha(self, fecha_atencion):
        """Valida derechos del usuario en una fecha específica"""
        if not isinstance(fecha_atencion, datetime):
            fecha_atencion = datetime.strptime(fecha_atencion, '%Y-%m-%d').date()
        else:
            fecha_atencion = fecha_atencion.date()
        
        # Estado debe ser activo o suspendido temporal
        if self.afiliacion_estado_afiliacion not in ['AC', 'ST']:
            return {
                'valido': False,
                'causal_devolucion': 'DE1601',
                'mensaje': f'Usuario con estado {self.afiliacion_estado_afiliacion} en fecha de atención'
            }
        
        # Fecha debe ser posterior a fecha efectiva
        if fecha_atencion < self.afiliacion_fecha_efectiva_bd:
            return {
                'valido': False,
                'causal_devolucion': 'DE1601',
                'mensaje': 'Atención antes de la fecha efectiva de afiliación'
            }
        
        # Si hay fecha de retiro, debe ser anterior
        if self.afiliacion_fecha_retiro and fecha_atencion > self.afiliacion_fecha_retiro:
            return {
                'valido': False,
                'causal_devolucion': 'DE1601',
                'mensaje': 'Atención después de la fecha de retiro'
            }
        
        return {
            'valido': True,
            'regimen': self.regimen,
            'nivel_sisben': self.caracteristicas_nivel_sisben,
            'tipo_usuario': self.usuario_tipo_usuario,
            'estado_afiliacion': self.afiliacion_estado_afiliacion
        }

class Prestadores(models.Model):
    """
    Prestadores de Servicios de Salud (PSS/PTS)
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación
    nit = models.CharField(max_length=20, unique=True, db_index=True)
    razon_social = models.CharField(max_length=200)
    tipo_identificacion = models.CharField(
        max_length=5,
        choices=[('NIT', 'NIT'), ('CC', 'Cédula de Ciudadanía')],
        default='NIT'
    )
    numero_documento = models.CharField(max_length=20)
    
    # Clasificación
    tipo_prestador = models.CharField(
        max_length=5,
        choices=[('PSS', 'Prestador de Servicios de Salud'), ('PTS', 'Proveedor de Tecnologías en Salud')]
    )
    categoria = models.CharField(
        max_length=30,
        choices=[
            ('IPS', 'Institución Prestadora de Servicios'),
            ('PROFESIONAL_INDEPENDIENTE', 'Profesional Independiente'),
            ('TRANSPORTE', 'Servicio de Transporte')
        ]
    )
    
    # Habilitación
    codigo_habilitacion = models.CharField(max_length=20, blank=True, null=True)
    fecha_habilitacion = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVO', 'Activo'),
            ('SUSPENDIDO', 'Suspendido'),
            ('INHABILITADO', 'Inhabilitado')
        ],
        default='ACTIVO'
    )
    
    # Datos de contacto (Subdocumento)
    contacto_telefono = models.CharField(max_length=20, blank=True, null=True)
    contacto_email = models.EmailField(blank=True, null=True)
    contacto_direccion = models.CharField(max_length=200, blank=True, null=True)
    contacto_municipio = models.CharField(max_length=100, blank=True, null=True)
    contacto_departamento = models.CharField(max_length=100, blank=True, null=True)
    
    # Representante legal (Subdocumento)
    representante_nombre = models.CharField(max_length=100, blank=True, null=True)
    representante_documento = models.CharField(max_length=20, blank=True, null=True)
    representante_telefono = models.CharField(max_length=20, blank=True, null=True)
    representante_email = models.EmailField(blank=True, null=True)
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'prestadores'
        indexes = [
            models.Index(fields=['nit']),
            models.Index(fields=['tipo_prestador', 'estado']),
            models.Index(fields=['estado']),
        ]
    
    def __str__(self):
        return f"{self.nit} - {self.razon_social}"

class Contratos(models.Model):
    """
    Contratos con Prestadores
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación del contrato
    numero_contrato = models.CharField(max_length=50, unique=True, db_index=True)
    prestador_nit = models.CharField(max_length=20, db_index=True)  # Referencia NoSQL
    eps_codigo = models.CharField(max_length=10, default='23678')  # EPS Familiar
    
    # Tipo y modalidad
    tipo_contrato = models.CharField(
        max_length=30,
        choices=[
            ('CAPITACION', 'Capitación'),
            ('POR_EVENTO', 'Por Evento'),
            ('GLOBAL_PROSPECTIVO', 'Global Prospectivo'),
            ('GRUPO_DIAGNOSTICO', 'Grupo Diagnóstico')
        ]
    )
    
    # Vigencia
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    valor_contrato = models.DecimalField(max_digits=15, decimal_places=2)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('VIGENTE', 'Vigente'),
            ('VENCIDO', 'Vencido'),
            ('SUSPENDIDO', 'Suspendido'),
            ('TERMINADO', 'Terminado')
        ],
        default='VIGENTE'
    )
    
    # Modalidad de pago (Subdocumento)
    modalidad_porcentaje_primer_pago = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    modalidad_dias_primer_pago = models.IntegerField(default=5)
    modalidad_condiciones_especiales = models.TextField(blank=True, null=True)
    
    # Cláusulas contractuales (Subdocumento)
    clausulas_archivo_pdf = models.CharField(max_length=200, blank=True, null=True)  # Path al PDF
    clausulas_hash_archivo = models.CharField(max_length=64, blank=True, null=True)  # SHA256
    clausulas_fecha_carga = models.DateTimeField(null=True, blank=True)
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contratos'
        indexes = [
            models.Index(fields=['numero_contrato']),
            models.Index(fields=['prestador_nit', 'estado']),
            models.Index(fields=['fecha_inicio', 'fecha_fin']),
            models.Index(fields=['estado']),
        ]
    
    def __str__(self):
        return f"{self.numero_contrato} - {self.prestador_nit}"