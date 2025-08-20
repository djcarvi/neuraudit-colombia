# -*- coding: utf-8 -*-
# apps/contratacion/models.py

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ArrayField
from datetime import datetime, date, timedelta

class TarifariosCUPS(models.Model):
    """
    Tarifarios contractuales para códigos CUPS
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia al contrato
    contrato_numero = models.CharField(max_length=50, db_index=True)  # Referencia NoSQL
    
    # Código CUPS
    codigo_cups = models.CharField(max_length=10, db_index=True)  # Referencia a catálogo oficial
    descripcion = models.TextField()
    
    # Valores contractuales
    valor_unitario = models.DecimalField(max_digits=15, decimal_places=2)
    unidad_medida = models.CharField(max_length=20, default='UNIDAD')
    
    # Aplicaciones financieras
    aplica_copago = models.BooleanField(default=False)
    aplica_cuota_moderadora = models.BooleanField(default=False)
    requiere_autorizacion = models.BooleanField(default=False)
    
    # Restricciones (Subdocumento)
    restricciones_sexo = models.CharField(
        max_length=10,
        choices=[('M', 'Masculino'), ('F', 'Femenino'), ('AMBOS', 'Ambos')],
        default='AMBOS'
    )
    restricciones_edad_minima = models.IntegerField(null=True, blank=True)
    restricciones_edad_maxima = models.IntegerField(null=True, blank=True)
    restricciones_ambito = models.CharField(
        max_length=15,
        choices=[
            ('AMBULATORIO', 'Ambulatorio'),
            ('HOSPITALARIO', 'Hospitalario'),
            ('AMBOS', 'Ambos')
        ],
        default='AMBOS'
    )
    restricciones_nivel_atencion = models.CharField(
        max_length=5,
        choices=[('I', 'Nivel I'), ('II', 'Nivel II'), ('III', 'Nivel III'), ('IV', 'Nivel IV')],
        blank=True, null=True
    )
    
    # Vigencia
    vigencia_desde = models.DateField()
    vigencia_hasta = models.DateField()
    estado = models.CharField(
        max_length=10,
        choices=[('ACTIVO', 'Activo'), ('INACTIVO', 'Inactivo')],
        default='ACTIVO'
    )
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tarifarios_cups'
        indexes = [
            models.Index(fields=['contrato_numero']),
            models.Index(fields=['codigo_cups']),
            models.Index(fields=['contrato_numero', 'codigo_cups']),
            models.Index(fields=['estado', 'vigencia_desde', 'vigencia_hasta']),
            models.Index(fields=['restricciones_ambito']),
        ]
    
    def __str__(self):
        return f"{self.codigo_cups} - {self.descripcion[:50]} - ${self.valor_unitario}"

class TarifariosMedicamentos(models.Model):
    """
    Tarifarios contractuales para medicamentos (CUM/IUM)
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia al contrato
    contrato_numero = models.CharField(max_length=50, db_index=True)  # Referencia NoSQL
    
    # Códigos de medicamento
    codigo_cum = models.CharField(max_length=50, blank=True, null=True, db_index=True)  # Referencia CUM
    codigo_ium = models.CharField(max_length=20, blank=True, null=True, db_index=True)  # Referencia IUM
    
    # Información del medicamento
    descripcion = models.TextField()
    principio_activo = models.TextField(blank=True, null=True)
    concentracion = models.CharField(max_length=100, blank=True, null=True)
    forma_farmaceutica = models.CharField(max_length=100, blank=True, null=True)
    
    # Valores contractuales
    valor_unitario = models.DecimalField(max_digits=15, decimal_places=2)
    unidad_medida = models.CharField(max_length=20, default='UNIDAD')
    via_administracion = models.CharField(max_length=50, blank=True, null=True)
    
    # Autorizaciones y cobertura
    requiere_autorizacion = models.BooleanField(default=False)
    es_pos = models.BooleanField(default=True)  # Plan Obligatorio de Salud
    es_no_pos = models.BooleanField(default=False)  # No POS
    
    # Vigencia
    vigencia_desde = models.DateField()
    vigencia_hasta = models.DateField()
    estado = models.CharField(
        max_length=10,
        choices=[('ACTIVO', 'Activo'), ('INACTIVO', 'Inactivo')],
        default='ACTIVO'
    )
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tarifarios_medicamentos'
        indexes = [
            models.Index(fields=['contrato_numero']),
            models.Index(fields=['codigo_cum']),
            models.Index(fields=['codigo_ium']),
            models.Index(fields=['contrato_numero', 'codigo_cum']),
            models.Index(fields=['contrato_numero', 'codigo_ium']),
            models.Index(fields=['estado', 'vigencia_desde', 'vigencia_hasta']),
            models.Index(fields=['es_pos', 'es_no_pos']),
        ]
    
    def __str__(self):
        codigo = self.codigo_cum or self.codigo_ium or 'N/A'
        return f"{codigo} - {self.descripcion[:50]} - ${self.valor_unitario}"

class TarifariosDispositivos(models.Model):
    """
    Tarifarios contractuales para dispositivos médicos
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Referencia al contrato
    contrato_numero = models.CharField(max_length=50, db_index=True)  # Referencia NoSQL
    
    # Código del dispositivo
    codigo_dispositivo = models.CharField(max_length=10, db_index=True)  # Referencia a catálogo oficial
    descripcion = models.TextField()
    
    # Valores contractuales
    valor_unitario = models.DecimalField(max_digits=15, decimal_places=2)
    unidad_medida = models.CharField(max_length=20, default='UNIDAD')
    
    # Restricciones de uso
    requiere_autorizacion = models.BooleanField(default=False)
    restricciones_uso = models.TextField(blank=True, null=True)
    frecuencia_maxima = models.CharField(max_length=100, blank=True, null=True)  # Por mes/año/etc.
    
    # Vigencia
    vigencia_desde = models.DateField()
    vigencia_hasta = models.DateField()
    estado = models.CharField(
        max_length=10,
        choices=[('ACTIVO', 'Activo'), ('INACTIVO', 'Inactivo')],
        default='ACTIVO'
    )
    
    # Campos de control
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tarifarios_dispositivos'
        indexes = [
            models.Index(fields=['contrato_numero']),
            models.Index(fields=['codigo_dispositivo']),
            models.Index(fields=['contrato_numero', 'codigo_dispositivo']),
            models.Index(fields=['estado', 'vigencia_desde', 'vigencia_hasta']),
            models.Index(fields=['requiere_autorizacion']),
        ]
    
    def __str__(self):
        return f"{self.codigo_dispositivo} - {self.descripcion[:50]} - ${self.valor_unitario}"


class Prestador(models.Model):
    """
    Modelo para gestionar la red de prestadores de servicios de salud
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación
    nit = models.CharField(max_length=20, unique=True, db_index=True)
    razon_social = models.CharField(max_length=200)
    nombre_comercial = models.CharField(max_length=200, blank=True)
    codigo_habilitacion = models.CharField(max_length=20, unique=True)
    
    # Clasificación
    TIPO_PRESTADOR_CHOICES = [
        ('IPS', 'IPS'),
        ('ESE', 'ESE'),
        ('CLINICA', 'Clínica'),
        ('HOSPITAL', 'Hospital'),
        ('CONSULTORIO', 'Consultorio'),
        ('LABORATORIO', 'Laboratorio'),
        ('IMAGENES', 'Centro de Imágenes'),
        ('OTRO', 'Otro')
    ]
    tipo_prestador = models.CharField(max_length=20, choices=TIPO_PRESTADOR_CHOICES)
    
    NIVEL_ATENCION_CHOICES = [
        ('I', 'Nivel I - Baja complejidad'),
        ('II', 'Nivel II - Media complejidad'),
        ('III', 'Nivel III - Alta complejidad'),
        ('IV', 'Nivel IV - Muy alta complejidad')
    ]
    nivel_atencion = models.CharField(max_length=3, choices=NIVEL_ATENCION_CHOICES)
    
    # Ubicación
    departamento = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=50)
    email = models.EmailField()
    
    # Estado
    habilitado_reps = models.BooleanField(default=True)
    fecha_habilitacion = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=20, 
        choices=[
            ('ACTIVO', 'Activo'),
            ('INACTIVO', 'Inactivo'),
            ('SANCIONADO', 'Sancionado'),
            ('SUSPENDIDO', 'Suspendido')
        ],
        default='ACTIVO'
    )
    
    # Servicios habilitados (lista de códigos CUPS)
    servicios_habilitados = ArrayField(models.CharField(max_length=10), default=list)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='prestadores_creados',
        to_field='id'
    )
    
    class Meta:
        db_table = 'contratacion_prestadores'
        ordering = ['razon_social']
        indexes = [
            models.Index(fields=['nit']),
            models.Index(fields=['codigo_habilitacion']),
            models.Index(fields=['estado']),
            models.Index(fields=['departamento', 'ciudad'])
        ]
    
    def __str__(self):
        return f"{self.razon_social} - NIT: {self.nit}"


class ModalidadPago(models.Model):
    """
    Modelo para las modalidades de pago según Resolución 2284
    """
    id = ObjectIdAutoField(primary_key=True)
    
    MODALIDAD_CHOICES = [
        ('EVENTO', 'Pago por Evento'),
        ('CAPITACION', 'Capitación'),
        ('PGP', 'Pago Global Prospectivo'),
        ('PAQUETE', 'Paquete'),
        ('CASO', 'Pago por Caso'),
        ('PRESUPUESTO_GLOBAL', 'Presupuesto Global')
    ]
    
    codigo = models.CharField(max_length=20, choices=MODALIDAD_CHOICES, unique=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    
    # Características
    requiere_autorizacion = models.BooleanField(default=True)
    permite_glosas = models.BooleanField(default=True)
    pago_anticipado = models.BooleanField(default=False)
    
    # Porcentajes de pago según Resolución 2284
    porcentaje_primer_pago = models.IntegerField(
        default=50,
        help_text="Porcentaje del primer pago al radicar (Art. 57)"
    )
    dias_primer_pago = models.IntegerField(
        default=5,
        help_text="Días hábiles para el primer pago"
    )
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'modalidades_pago'
        ordering = ['codigo']
    
    def __str__(self):
        return f"{self.nombre} ({self.codigo})"


class Contrato(models.Model):
    """
    Modelo para contratos entre EPS y Prestadores
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación
    numero_contrato = models.CharField(max_length=50, unique=True, db_index=True)
    prestador = models.ForeignKey(
        Prestador,
        on_delete=models.PROTECT,
        related_name='contratos',
        to_field='id'
    )
    
    # Modalidades
    modalidad_principal = models.ForeignKey(
        ModalidadPago,
        on_delete=models.PROTECT,
        related_name='contratos',
        to_field='id',
        help_text="Modalidad de pago principal del contrato"
    )
    modalidades_adicionales = ArrayField(
        models.CharField(max_length=20),
        default=list,
        help_text="Lista de códigos de modalidades adicionales"
    )
    
    # Vigencia
    fecha_inicio = models.DateField(db_index=True)
    fecha_fin = models.DateField(db_index=True)
    fecha_firma = models.DateField()
    
    # Valores
    valor_total = models.DecimalField(max_digits=15, decimal_places=2)
    valor_mensual = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Para contratos de capitación o PGP"
    )
    
    # Población (para capitación/PGP)
    poblacion_asignada = models.IntegerField(null=True, blank=True)
    
    # Manual tarifario
    MANUAL_TARIFARIO_CHOICES = [
        ('ISS_2001', 'ISS 2001'),
        ('ISS_2004', 'ISS 2004'),
        ('SOAT_2025', 'SOAT 2025'),
        ('PERSONALIZADO', 'Personalizado'),
        ('MIXTO', 'Mixto')
    ]
    manual_tarifario = models.CharField(
        max_length=20, 
        choices=MANUAL_TARIFARIO_CHOICES,
        default='ISS_2001'
    )
    
    # Porcentaje de negociación sobre manual
    porcentaje_negociacion = models.IntegerField(
        default=100,
        help_text="Porcentaje aplicado sobre el manual tarifario base"
    )
    
    # Estado
    ESTADO_CHOICES = [
        ('VIGENTE', 'Vigente'),
        ('POR_VENCER', 'Por Vencer'),
        ('VENCIDO', 'Vencido'),
        ('EN_RENOVACION', 'En Renovación'),
        ('TERMINADO', 'Terminado'),
        ('SUSPENDIDO', 'Suspendido')
    ]
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    
    # Servicios contratados (lista de códigos CUPS)
    servicios_contratados = ArrayField(
        models.CharField(max_length=10),
        default=list,
        help_text="Lista de códigos CUPS contratados"
    )
    
    # Anexos técnicos
    tiene_anexo_tecnico = models.BooleanField(default=True)
    tiene_anexo_economico = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='contratos_creados',
        to_field='id'
    )
    
    class Meta:
        db_table = 'contratacion_contratos'
        ordering = ['-fecha_inicio']
        indexes = [
            models.Index(fields=['numero_contrato']),
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_inicio', 'fecha_fin']),
            models.Index(fields=['prestador', 'estado'])
        ]
    
    def __str__(self):
        return f"{self.numero_contrato} - {self.prestador.razon_social}"
    
    @property
    def dias_restantes(self):
        """Calcula días restantes hasta el vencimiento"""
        if self.fecha_fin:
            delta = self.fecha_fin - date.today()
            return delta.days
        return 0
    
    @property
    def esta_vigente(self):
        """Verifica si el contrato está vigente"""
        today = date.today()
        return self.fecha_inicio <= today <= self.fecha_fin
    
    def actualizar_estado(self):
        """Actualiza automáticamente el estado según fechas"""
        today = date.today()
        
        if today > self.fecha_fin:
            self.estado = 'VENCIDO'
        elif self.dias_restantes <= 30:
            self.estado = 'POR_VENCER'
        elif self.fecha_inicio <= today <= self.fecha_fin:
            self.estado = 'VIGENTE'
        
        self.save()


class CatalogoCUPS(models.Model):
    """
    Catálogo de procedimientos CUPS (Clasificación Única de Procedimientos en Salud)
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=10, unique=True, db_index=True)
    descripcion = models.TextField()
    
    # Categorización
    TIPO_PROCEDIMIENTO_CHOICES = [
        ('CONSULTA', 'Consulta'),
        ('PROCEDIMIENTO', 'Procedimiento'),
        ('CIRUGIA', 'Cirugía'),
        ('LABORATORIO', 'Laboratorio'),
        ('IMAGENES', 'Imágenes Diagnósticas'),
        ('TERAPIA', 'Terapia'),
        ('PROMOCION', 'Promoción y Prevención'),
        ('OTRO', 'Otro')
    ]
    tipo = models.CharField(max_length=20, choices=TIPO_PROCEDIMIENTO_CHOICES)
    
    # Clasificación por capítulos
    capitulo = models.CharField(max_length=100)
    grupo = models.CharField(max_length=100)
    subgrupo = models.CharField(max_length=100, blank=True)
    
    # Complejidad
    NIVEL_COMPLEJIDAD_CHOICES = [
        ('BAJA', 'Baja'),
        ('MEDIA', 'Media'),
        ('ALTA', 'Alta')
    ]
    nivel_complejidad = models.CharField(
        max_length=10, 
        choices=NIVEL_COMPLEJIDAD_CHOICES,
        default='MEDIA'
    )
    
    # Estado
    activo = models.BooleanField(default=True)
    fecha_vigencia = models.DateField()
    
    # Requerimientos
    requiere_autorizacion = models.BooleanField(default=False)
    dias_estancia_promedio = models.IntegerField(null=True, blank=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_cups'
        ordering = ['codigo']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['tipo']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.descripcion[:50]}..."


class CatalogoCUM(models.Model):
    """
    Catálogo de medicamentos CUM (Código Único de Medicamentos)
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo_cum = models.CharField(max_length=20, unique=True, db_index=True)
    nombre_generico = models.CharField(max_length=200)
    nombre_comercial = models.CharField(max_length=200, blank=True)
    
    # Presentación
    forma_farmaceutica = models.CharField(max_length=100)
    concentracion = models.CharField(max_length=100)
    unidad_medida = models.CharField(max_length=50)
    
    # Clasificación
    grupo_terapeutico = models.CharField(max_length=100)
    via_administracion = models.CharField(max_length=50)
    
    # Control
    es_pos = models.BooleanField(default=True, help_text="Incluido en Plan de Beneficios")
    es_controlado = models.BooleanField(default=False)
    requiere_autorizacion = models.BooleanField(default=False)
    
    # Estado
    activo = models.BooleanField(default=True)
    fecha_vigencia = models.DateField()
    
    # Fabricante
    laboratorio = models.CharField(max_length=200)
    registro_invima = models.CharField(max_length=50)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_cum'
        ordering = ['nombre_generico']
        indexes = [
            models.Index(fields=['codigo_cum']),
            models.Index(fields=['es_pos']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo_cum} - {self.nombre_generico}"


class CatalogoIUM(models.Model):
    """
    Catálogo de medicamentos IUM (Identificador Único de Medicamento)
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo_ium = models.CharField(max_length=20, unique=True, db_index=True)
    nombre_generico = models.CharField(max_length=200)
    nombre_comercial = models.CharField(max_length=200, blank=True)
    
    # Presentación
    forma_farmaceutica = models.CharField(max_length=100)
    concentracion = models.CharField(max_length=100)
    unidad_medida = models.CharField(max_length=50)
    
    # Clasificación
    grupo_terapeutico = models.CharField(max_length=100)
    via_administracion = models.CharField(max_length=50)
    
    # Control
    es_pos = models.BooleanField(default=True, help_text="Incluido en Plan de Beneficios")
    es_controlado = models.BooleanField(default=False)
    requiere_autorizacion = models.BooleanField(default=False)
    
    # Estado
    activo = models.BooleanField(default=True)
    fecha_vigencia = models.DateField()
    
    # Fabricante
    laboratorio = models.CharField(max_length=200)
    registro_invima = models.CharField(max_length=50)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_ium'
        ordering = ['nombre_generico']
        indexes = [
            models.Index(fields=['codigo_ium']),
            models.Index(fields=['es_pos']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo_ium} - {self.nombre_generico}"


class CatalogoDispositivos(models.Model):
    """
    Catálogo de dispositivos médicos
    """
    id = ObjectIdAutoField(primary_key=True)
    
    codigo = models.CharField(max_length=20, unique=True, db_index=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    
    # Clasificación
    TIPO_DISPOSITIVO_CHOICES = [
        ('IMPLANTABLE', 'Implantable'),
        ('NO_IMPLANTABLE', 'No Implantable'),
        ('EQUIPO_BIOMEDICO', 'Equipo Biomédico'),
        ('REACTIVO', 'Reactivo de Diagnóstico'),
        ('INSUMO', 'Insumo Médico'),
        ('PROTESIS', 'Prótesis'),
        ('ORTESIS', 'Órtesis')
    ]
    tipo_dispositivo = models.CharField(max_length=20, choices=TIPO_DISPOSITIVO_CHOICES)
    
    # Clasificación de riesgo
    CLASE_RIESGO_CHOICES = [
        ('I', 'Clase I - Bajo riesgo'),
        ('IIA', 'Clase IIA - Riesgo moderado'),
        ('IIB', 'Clase IIB - Riesgo alto'),
        ('III', 'Clase III - Muy alto riesgo')
    ]
    clase_riesgo = models.CharField(max_length=3, choices=CLASE_RIESGO_CHOICES)
    
    # Control
    requiere_autorizacion = models.BooleanField(default=True)
    vida_util_dias = models.IntegerField(null=True, blank=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    fecha_vigencia = models.DateField()
    
    # Registro sanitario
    registro_invima = models.CharField(max_length=50)
    fabricante = models.CharField(max_length=200)
    pais_origen = models.CharField(max_length=100)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'catalogo_dispositivos'
        ordering = ['nombre']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['tipo_dispositivo']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class TarifarioPersonalizado(models.Model):
    """
    Tarifarios personalizados para servicios no incluidos en catálogos oficiales
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Relación con contrato
    contrato = models.ForeignKey(
        Contrato,
        on_delete=models.CASCADE,
        related_name='tarifarios_personalizados',
        to_field='id'
    )
    
    # Identificación del servicio
    codigo_interno = models.CharField(max_length=50, db_index=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    
    # Categorización
    CATEGORIA_CHOICES = [
        ('SERVICIO_ESPECIAL', 'Servicio Especial'),
        ('PAQUETE_INTEGRAL', 'Paquete Integral'),
        ('ACTIVIDAD_PREVENTIVA', 'Actividad Preventiva'),
        ('PROGRAMA_ESPECIAL', 'Programa Especial'),
        ('CONVENIO_DOCENCIA', 'Convenio Docencia-Servicio'),
        ('TELEMEDICINA', 'Telemedicina'),
        ('ATENCION_DOMICILIARIA', 'Atención Domiciliaria'),
        ('OTRO', 'Otro')
    ]
    categoria = models.CharField(max_length=30, choices=CATEGORIA_CHOICES)
    
    # Valores
    valor_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    unidad_medida = models.CharField(max_length=50)
    
    # Condiciones
    requiere_autorizacion = models.BooleanField(default=True)
    aplica_copago = models.BooleanField(default=False)
    aplica_cuota_moderadora = models.BooleanField(default=False)
    
    # Vigencia
    fecha_inicio_vigencia = models.DateField()
    fecha_fin_vigencia = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    
    # Observaciones
    observaciones = models.TextField(blank=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='tarifarios_personalizados_creados',
        to_field='id'
    )
    
    class Meta:
        db_table = 'tarifarios_personalizados'
        ordering = ['codigo_interno']
        indexes = [
            models.Index(fields=['contrato', 'codigo_interno']),
            models.Index(fields=['categoria']),
            models.Index(fields=['activo'])
        ]
        unique_together = [
            ['contrato', 'codigo_interno']
        ]
    
    def __str__(self):
        return f"{self.codigo_interno} - {self.nombre}"


class PaqueteServicios(models.Model):
    """
    Paquetes de servicios integrales (ej. parto, cirugías)
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación
    codigo_paquete = models.CharField(max_length=50, unique=True, db_index=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    
    # Tipo de paquete
    TIPO_PAQUETE_CHOICES = [
        ('QUIRURGICO', 'Quirúrgico'),
        ('OBSTETRICO', 'Obstétrico'),
        ('ONCOLOGICO', 'Oncológico'),
        ('DIAGNOSTICO', 'Diagnóstico'),
        ('REHABILITACION', 'Rehabilitación'),
        ('CRONICO', 'Atención Crónica'),
        ('INTEGRAL', 'Atención Integral')
    ]
    tipo_paquete = models.CharField(max_length=20, choices=TIPO_PAQUETE_CHOICES)
    
    # Servicios incluidos (lista de códigos CUPS)
    servicios_incluidos = ArrayField(
        models.CharField(max_length=10),
        help_text="Lista de códigos CUPS incluidos en el paquete"
    )
    
    # Medicamentos incluidos (lista de códigos CUM/IUM)
    medicamentos_incluidos = ArrayField(
        models.CharField(max_length=20),
        default=list,
        help_text="Lista de códigos CUM/IUM incluidos"
    )
    
    # Dispositivos incluidos
    dispositivos_incluidos = ArrayField(
        models.CharField(max_length=20),
        default=list,
        help_text="Lista de códigos de dispositivos incluidos"
    )
    
    # Condiciones de aplicación
    dias_estancia_incluidos = models.IntegerField(null=True, blank=True)
    incluye_honorarios = models.BooleanField(default=True)
    incluye_insumos = models.BooleanField(default=True)
    incluye_medicamentos = models.BooleanField(default=True)
    
    # Estado
    activo = models.BooleanField(default=True)
    requiere_autorizacion = models.BooleanField(default=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='paquetes_creados',
        to_field='id'
    )
    
    class Meta:
        db_table = 'paquetes_servicios'
        ordering = ['nombre']
        indexes = [
            models.Index(fields=['codigo_paquete']),
            models.Index(fields=['tipo_paquete']),
            models.Index(fields=['activo'])
        ]
    
    def __str__(self):
        return f"{self.codigo_paquete} - {self.nombre}"


class TarifarioPaquete(models.Model):
    """
    Tarifarios para paquetes de servicios por contrato
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Relaciones
    contrato = models.ForeignKey(
        Contrato,
        on_delete=models.CASCADE,
        related_name='tarifarios_paquetes',
        to_field='id'
    )
    paquete = models.ForeignKey(
        PaqueteServicios,
        on_delete=models.PROTECT,
        related_name='tarifarios',
        to_field='id'
    )
    
    # Valores
    valor_paquete = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        help_text="Valor total del paquete"
    )
    
    # Aplicación
    TIPO_TARIFA_CHOICES = [
        ('NORMAL', 'Normal'),
        ('URGENCIAS', 'Urgencias'),
        ('FESTIVO', 'Festivo'),
        ('NOCTURNO', 'Nocturno')
    ]
    tipo_tarifa = models.CharField(
        max_length=20, 
        choices=TIPO_TARIFA_CHOICES,
        default='NORMAL'
    )
    
    # Vigencia
    fecha_inicio_vigencia = models.DateField()
    fecha_fin_vigencia = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    
    # Observaciones
    observaciones = models.TextField(blank=True)
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.PROTECT,
        related_name='tarifarios_paquetes_creados',
        to_field='id'
    )
    
    class Meta:
        db_table = 'tarifarios_paquetes'
        ordering = ['paquete__codigo_paquete']
        indexes = [
            models.Index(fields=['contrato', 'paquete']),
            models.Index(fields=['activo']),
            models.Index(fields=['fecha_inicio_vigencia'])
        ]
        unique_together = [
            ['contrato', 'paquete', 'tipo_tarifa']
        ]
    
    def __str__(self):
        return f"{self.paquete.codigo_paquete} - ${self.valor_paquete:,.0f}"