"""
Modelos para Radicación de Cuentas Médicas - NeurAudit Colombia

Sistema de radicación según Resolución 2284 de 2023
Flujo: PSS radica → Factura + RIPS + Soportes → Validación automática → Radicado
Plazo: 22 días hábiles desde expedición de factura
"""

from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel
from django.utils import timezone
from django.core.validators import FileExtensionValidator
from bson import ObjectId

from datetime import datetime, timedelta
import uuid
import json

class RadicacionCuentaMedica(models.Model):
    """
    Modelo principal para radicación de cuentas médicas
    Cumple con Resolución 2284 de 2023 - Artículo 3
    """
    
    ESTADO_CHOICES = [
        ('BORRADOR', 'Borrador'),
        ('RADICADA', 'Radicada'),
        ('DEVUELTA', 'Devuelta'),
        ('EN_AUDITORIA', 'En Auditoría'),
        ('AUDITADA', 'Auditada'),
        ('PAGADA', 'Pagada'),
        ('RECHAZADA', 'Rechazada'),
    ]
    
    MODALIDAD_PAGO_CHOICES = [
        ('EVENTO', 'Pago por Evento'),
        ('CAPITACION', 'Capitación'),
        ('GLOBAL_PROSPECTIVO', 'Global Prospectivo'),
        ('GRUPO_DIAGNOSTICO', 'Grupo Diagnóstico'),
    ]
    
    TIPO_SERVICIO_CHOICES = [
        ('AMBULATORIO', 'Atención Ambulatoria'),
        ('URGENCIAS', 'Atención de Urgencias'),
        ('HOSPITALIZACION', 'Hospitalización'),
        ('CIRUGIA', 'Procedimientos Quirúrgicos'),
        ('MEDICAMENTOS', 'Medicamentos Ambulatorios'),
        ('DISPOSITIVOS', 'Dispositivos Médicos'),
        ('TRANSPORTE', 'Transporte Asistencial'),
        ('ODONTOLOGIA', 'Atención Odontológica'),
        ('APOYO_DIAGNOSTICO', 'Apoyo Diagnóstico'),
        ('TERAPIAS', 'Complementación Terapéutica'),
    ]
    
    # Identificación única
    id = ObjectIdAutoField(primary_key=True)
    numero_radicado = models.CharField(max_length=50, unique=True, verbose_name="Número Radicado")
    
    # Información del prestador (PSS/PTS)
    pss_nit = models.CharField(max_length=20, verbose_name="NIT PSS/PTS")
    pss_nombre = models.CharField(max_length=200, verbose_name="Nombre PSS/PTS")
    pss_codigo_reps = models.CharField(max_length=20, blank=True, verbose_name="Código REPS")
    
    usuario_radicador = models.ForeignKey(
        'authentication.User', 
        on_delete=models.PROTECT,
        related_name='radicaciones',
        verbose_name="Usuario Radicador"
    )
    
    # Información de la factura electrónica
    factura_numero = models.CharField(max_length=50, verbose_name="Número Factura")
    factura_prefijo = models.CharField(max_length=10, blank=True, verbose_name="Prefijo Factura")
    factura_fecha_expedicion = models.DateTimeField(verbose_name="Fecha Expedición Factura")
    factura_valor_total = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Valor Total Factura")
    factura_moneda = models.CharField(max_length=3, default='COP', verbose_name="Moneda")
    
    # Clasificación del servicio
    modalidad_pago = models.CharField(
        max_length=20, 
        choices=MODALIDAD_PAGO_CHOICES,
        verbose_name="Modalidad de Pago"
    )
    tipo_servicio = models.CharField(
        max_length=20,
        choices=TIPO_SERVICIO_CHOICES,
        verbose_name="Tipo de Servicio"
    )
    
    # Información del paciente (solo identificadores únicos para evitar cruces)
    paciente_tipo_documento = models.CharField(max_length=10, verbose_name="Tipo Documento Paciente")
    paciente_numero_documento = models.CharField(max_length=20, verbose_name="Número Documento Paciente")
    # NOTA: No almacenamos nombres/apellidos para evitar cruces entre prestadores
    # Solo el documento de identidad como identificador único
    paciente_codigo_sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino')], verbose_name="Código Sexo")
    paciente_codigo_edad = models.CharField(max_length=3, verbose_name="Código Edad (años)", help_text="Edad en años al momento de la atención")
    
    # Información clínica básica
    fecha_atencion_inicio = models.DateTimeField(verbose_name="Fecha Inicio Atención")
    fecha_atencion_fin = models.DateTimeField(null=True, blank=True, verbose_name="Fecha Fin Atención")
    diagnostico_principal = models.CharField(max_length=10, verbose_name="Diagnóstico Principal CIE-10")
    diagnosticos_relacionados = models.JSONField(default=list, blank=True, verbose_name="Diagnósticos Relacionados")
    
    # Estado y control
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='BORRADOR', verbose_name="Estado")
    fecha_radicacion = models.DateTimeField(null=True, blank=True, verbose_name="Fecha Radicación")
    fecha_limite_radicacion = models.DateTimeField(verbose_name="Fecha Límite Radicación")
    
    # Control de versiones y archivos
    version = models.IntegerField(default=1, verbose_name="Versión")
    hash_documentos = models.CharField(max_length=64, blank=True, verbose_name="Hash Documentos")
    
    # Validaciones automáticas
    validacion_rips = models.JSONField(default=dict, blank=True, verbose_name="Validación RIPS")
    validacion_factura = models.JSONField(default=dict, blank=True, verbose_name="Validación Factura")
    validacion_soportes = models.JSONField(default=dict, blank=True, verbose_name="Validación Soportes")
    
    # Código Único de Validación del Ministerio
    cuv_codigo = models.CharField(max_length=200, blank=True, verbose_name="Código Único Validación")
    cuv_proceso_id = models.CharField(max_length=50, blank=True, verbose_name="ID Proceso MinSalud")
    cuv_fecha_validacion = models.DateTimeField(null=True, blank=True, verbose_name="Fecha Validación MinSalud")
    cuv_resultado = models.JSONField(default=dict, blank=True, verbose_name="Resultado Validación MinSalud")
    
    # Auditoría y trazabilidad
    observaciones = models.TextField(blank=True, verbose_name="Observaciones")
    metadatos = models.JSONField(default=dict, blank=True, verbose_name="Metadatos")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha Actualización")
    
    class Meta:
        db_table = 'neuraudit_radicacion_cuentas'
        verbose_name = 'Radicación Cuenta Médica'
        verbose_name_plural = 'Radicaciones Cuentas Médicas'
        indexes = [
            models.Index(fields=['numero_radicado']),
            models.Index(fields=['pss_nit']),
            models.Index(fields=['factura_numero', 'factura_prefijo']),
            models.Index(fields=['estado']),
            models.Index(fields=['fecha_radicacion']),
            models.Index(fields=['fecha_limite_radicacion']),
            models.Index(fields=['paciente_numero_documento']),
        ]
    
    def __str__(self):
        return f"Radicado {self.numero_radicado} - {self.pss_nombre}"
    
    def save(self, *args, **kwargs):
        # Generar número de radicado automático
        if not self.numero_radicado:
            self.numero_radicado = self.generate_radicado_number()
        
        # Calcular fecha límite si no existe
        if not self.fecha_limite_radicacion:
            self.fecha_limite_radicacion = self.calculate_limit_date()
        
        # Actualizar fecha de radicación al cambiar a RADICADA
        if self.estado == 'RADICADA' and not self.fecha_radicacion:
            self.fecha_radicacion = timezone.now()
        
        super().save(*args, **kwargs)
    
    def generate_radicado_number(self):
        """
        Genera número de radicado único por prestador
        Formato: RAD-NIT-YYYYMMDD-NN
        Evita cruces entre prestadores
        """
        today = timezone.now().strftime('%Y%m%d')
        nit_prestador = self.pss_nit.replace('-', '').replace('.', '')  # Limpiar NIT
        
        # Obtener último número del día para este prestador específico
        prefix = f'RAD-{nit_prestador}-{today}-'
        last_radicado = RadicacionCuentaMedica.objects.filter(
            numero_radicado__startswith=prefix
        ).order_by('-numero_radicado').first()
        
        if last_radicado:
            last_number = int(last_radicado.numero_radicado.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        return f'RAD-{nit_prestador}-{today}-{new_number:02d}'
    
    def calculate_limit_date(self):
        """
        Calcula fecha límite de radicación (22 días hábiles desde expedición)
        """
        from django.conf import settings
        max_days = getattr(settings, 'NEURAUDIT_SETTINGS', {}).get('MAX_RADICACION_DAYS', 22)
        
        # Por ahora calendario simple, después implementar días hábiles
        return self.factura_fecha_expedicion + timedelta(days=max_days)
    
    @property
    def is_expired(self):
        """Verifica si ha vencido el plazo de radicación"""
        return timezone.now() > self.fecha_limite_radicacion
    
    @property
    def days_remaining(self):
        """Días restantes para radicación"""
        if self.estado == 'RADICADA':
            return 0
        delta = self.fecha_limite_radicacion - timezone.now()
        return max(0, delta.days)
    
    def validate_documents(self):
        """
        Ejecuta validaciones automáticas de documentos
        """
        validations = {
            'rips_valid': False,
            'factura_valid': False,
            'soportes_valid': False,
            'errors': [],
            'warnings': []
        }
        
        # Validar RIPS obligatorio
        rips_document = self.documentos.filter(tipo_documento='RIPS').first()
        if not rips_document:
            validations['errors'].append('RIPS es obligatorio según Resolución 2284')
        else:
            validations['rips_valid'] = True
        
        # Validar factura electrónica
        factura_document = self.documentos.filter(tipo_documento='FACTURA').first()
        if not factura_document:
            validations['errors'].append('Factura electrónica es obligatoria')
        else:
            validations['factura_valid'] = True
        
        # Validar soportes según tipo de servicio
        required_soportes = self.get_required_soportes()
        for soporte in required_soportes:
            if not self.documentos.filter(tipo_documento=soporte).exists():
                validations['warnings'].append(f'Soporte {soporte} faltante')
        
        if not validations['errors']:
            validations['soportes_valid'] = True
        
        return validations
    
    def get_required_soportes(self):
        """
        Retorna soportes requeridos según tipo de servicio (Resolución 2284)
        """
        soportes_por_tipo = {
            'AMBULATORIO': ['RESUMEN_ATENCION', 'ORDEN_PRESCRIPCION'],
            'URGENCIAS': ['HOJA_URGENCIA', 'HOJA_MEDICAMENTOS'],
            'HOSPITALIZACION': ['EPICRISIS', 'HOJA_MEDICAMENTOS'],
            'CIRUGIA': ['EPICRISIS', 'DESCRIPCION_QUIRURGICA', 'REGISTRO_ANESTESIA'],
            'MEDICAMENTOS': ['ORDEN_PRESCRIPCION', 'COMPROBANTE_RECIBIDO'],
            'DISPOSITIVOS': ['ORDEN_PRESCRIPCION', 'COMPROBANTE_RECIBIDO'],
            'TRANSPORTE': ['HOJA_TRASLADO'],
            'ODONTOLOGIA': ['HOJA_ATENCION_ODONTOLOGICA'],
            'APOYO_DIAGNOSTICO': ['RESULTADOS_APOYO_DIAGNOSTICO'],
            'TERAPIAS': ['REGISTRO_ATENCION', 'COMPROBANTE_RECIBIDO'],
        }
        
        return soportes_por_tipo.get(self.tipo_servicio, [])
    
    def can_radicate(self):
        """
        Verifica si la cuenta puede ser radicada
        """
        if self.estado != 'BORRADOR':
            return False, "Solo las cuentas en borrador pueden radicarse"
        
        if self.is_expired:
            return False, "Ha vencido el plazo de radicación (22 días hábiles)"
        
        validations = self.validate_documents()
        if validations['errors']:
            return False, f"Errores de validación: {'; '.join(validations['errors'])}"
        
        return True, "Cuenta lista para radicación"
    
    def radicate(self):
        """
        Ejecuta el proceso de radicación
        """
        can_radicate, message = self.can_radicate()
        if not can_radicate:
            raise ValueError(message)
        
        self.estado = 'RADICADA'
        self.fecha_radicacion = timezone.now()
        self.save()
        
        # Crear registro de trazabilidad
        from apps.trazabilidad.models import RegistroTrazabilidad
        RegistroTrazabilidad.objects.create(
            radicacion=self,
            accion='RADICACION',
            usuario=self.usuario_radicador,
            descripcion=f'Cuenta radicada con número {self.numero_radicado}',
            metadatos={'validation_results': self.validate_documents()}
        )
        
        return self.numero_radicado

class DocumentoSoporte(models.Model):
    """
    Documentos de soporte según Resolución 2284 - Anexo Técnico No. 1
    """
    
    TIPO_DOCUMENTO_CHOICES = [
        # Obligatorios
        ('FACTURA', 'Factura de Venta en Salud'),
        ('RIPS', 'Registro Individual de Prestación de Servicios - RIPS'),
        
        # Registro de atención
        ('RESUMEN_ATENCION', 'Resumen de Atención'),
        ('EPICRISIS', 'Epicrisis'),
        ('HOJA_URGENCIA', 'Hoja de Atención de Urgencia'),
        ('HOJA_ATENCION_ODONTOLOGICA', 'Hoja de Atención Odontológica'),
        
        # Procedimientos y medicamentos
        ('DESCRIPCION_QUIRURGICA', 'Descripción Quirúrgica'),
        ('REGISTRO_ANESTESIA', 'Registro de Anestesia'),
        ('HOJA_MEDICAMENTOS', 'Hoja de Administración de Medicamentos'),
        ('RESULTADOS_APOYO_DIAGNOSTICO', 'Resultados Apoyo Diagnóstico'),
        
        # Órdenes y prescripciones
        ('ORDEN_PRESCRIPCION', 'Orden o Prescripción Facultativa'),
        ('COMPROBANTE_RECIBIDO', 'Comprobante de Recibido del Usuario'),
        
        # Transporte
        ('HOJA_TRASLADO', 'Hoja de Traslado Asistencial'),
        ('TIQUETE_TRANSPORTE', 'Tiquete de Transporte No Asistencial'),
        
        # Otros
        ('LISTA_PRECIOS', 'Lista de Precios'),
        ('FACTURA_SOAT', 'Factura SOAT/ADRES'),
        ('EVIDENCIA_ENVIO', 'Evidencia del Envío del Trámite'),
    ]
    
    ESTADO_CHOICES = [
        ('SUBIDO', 'Subido'),
        ('VALIDADO', 'Validado'),
        ('RECHAZADO', 'Rechazado'),
        ('PROCESANDO', 'Procesando'),
    ]
    
    # Identificación
    id = ObjectIdAutoField(primary_key=True)
    radicacion = models.ForeignKey(
        RadicacionCuentaMedica,
        on_delete=models.CASCADE,
        related_name='documentos',
        verbose_name="Radicación"
    )
    
    # Información del documento
    tipo_documento = models.CharField(
        max_length=30,
        choices=TIPO_DOCUMENTO_CHOICES,
        verbose_name="Tipo Documento"
    )
    nombre_archivo = models.CharField(max_length=255, verbose_name="Nombre Archivo")
    
    # Almacenamiento (Digital Ocean Spaces)
    archivo_url = models.URLField(verbose_name="URL Archivo")
    archivo_hash = models.CharField(max_length=64, verbose_name="Hash Archivo")
    archivo_size = models.BigIntegerField(verbose_name="Tamaño Archivo (bytes)")
    
    # Metadatos técnicos
    mime_type = models.CharField(max_length=100, verbose_name="Tipo MIME")
    extension = models.CharField(max_length=10, verbose_name="Extensión")
    
    # Estado y validación
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='SUBIDO', verbose_name="Estado")
    validacion_resultado = models.JSONField(default=dict, blank=True, verbose_name="Resultado Validación")
    
    # Control de versiones
    version = models.IntegerField(default=1, verbose_name="Versión")
    documento_anterior = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        verbose_name="Documento Anterior"
    )
    
    # Metadatos adicionales
    metadatos = models.JSONField(default=dict, blank=True, verbose_name="Metadatos")
    observaciones = models.TextField(blank=True, verbose_name="Observaciones")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha Actualización")
    
    class Meta:
        db_table = 'neuraudit_documentos_soporte'
        verbose_name = 'Documento Soporte'
        verbose_name_plural = 'Documentos Soporte'
        indexes = [
            models.Index(fields=['radicacion', 'tipo_documento']),
            models.Index(fields=['archivo_hash']),
            models.Index(fields=['estado']),
            models.Index(fields=['created_at']),
        ]
        unique_together = [
            ['radicacion', 'tipo_documento', 'version']
        ]
    
    def __str__(self):
        return f"{self.get_tipo_documento_display()} - {self.nombre_archivo}"
    
    def validate_format(self):
        """
        Valida formato del documento según Resolución 2284
        """
        validations = {
            'format_valid': False,
            'size_valid': False,
            'errors': [],
            'warnings': []
        }
        
        # Validar extensión según tipo
        allowed_extensions = {
            'FACTURA': ['xml'],
            'RIPS': ['json'],
            'default': ['pdf']
        }
        
        expected_extensions = allowed_extensions.get(self.tipo_documento, allowed_extensions['default'])
        if self.extension.lower() not in expected_extensions:
            validations['errors'].append(f'Extensión {self.extension} no permitida. Se requiere: {expected_extensions}')
        else:
            validations['format_valid'] = True
        
        # Validar tamaño (1GB máximo según norma)
        max_size = 1024 * 1024 * 1024  # 1GB
        if self.archivo_size > max_size:
            validations['errors'].append(f'Archivo excede tamaño máximo (1GB)')
        else:
            validations['size_valid'] = True
        
        # Validaciones específicas por tipo
        if self.tipo_documento == 'RIPS':
            # Validar estructura JSON
            validations.update(self.validate_rips_structure())
        elif self.tipo_documento == 'FACTURA':
            # Validar estructura XML
            validations.update(self.validate_factura_structure())
        
        return validations
    
    def validate_rips_structure(self):
        """
        Valida estructura del RIPS según Resolución 1036 de 2022
        """
        # Por ahora validación básica, después integrar con API MinSalud
        return {
            'rips_structure_valid': True,
            'rips_errors': [],
            'rips_warnings': []
        }
    
    def validate_factura_structure(self):
        """
        Valida estructura de factura electrónica según DIAN
        """
        # Por ahora validación básica, después integrar con API DIAN
        return {
            'factura_structure_valid': True,
            'factura_errors': [],
            'factura_warnings': []
        }
    
    def get_nomenclature_filename(self):
        """
        Genera nombre de archivo según nomenclatura Resolución 2284
        Ejemplo: EPI_899999999_A999999999.pdf
        """
        abreviations = {
            'RESUMEN_ATENCION': 'HEV',
            'EPICRISIS': 'EPI',
            'RESULTADOS_APOYO_DIAGNOSTICO': 'PDX',
            'DESCRIPCION_QUIRURGICA': 'DQX',
            'REGISTRO_ANESTESIA': 'RAN',
            'COMPROBANTE_RECIBIDO': 'CRU',
            'HOJA_TRASLADO': 'HTR',
            'ORDEN_PRESCRIPCION': 'OPR',
            'HOJA_MEDICAMENTOS': 'HAM',
            'HOJA_URGENCIA': 'HUR',
            'HOJA_ATENCION_ODONTOLOGICA': 'HAO',
            'LISTA_PRECIOS': 'LPR',
            'EVIDENCIA_ENVIO': 'EEN',
        }
        
        abbrev = abreviations.get(self.tipo_documento, 'DOC')
        nit = self.radicacion.pss_nit
        factura = f"{self.radicacion.factura_prefijo}{self.radicacion.factura_numero}"
        
        return f"{abbrev}_{nit}_{factura}.{self.extension}"

class ValidacionRIPS(models.Model):
    """
    Registro de validaciones RIPS con API MinSalud
    """
    id = ObjectIdAutoField(primary_key=True)
    documento = models.OneToOneField(
        DocumentoSoporte,
        on_delete=models.CASCADE,
        related_name='validacion_rips'
    )
    
    # Validación con MinSalud
    codigo_validacion_minsalud = models.CharField(max_length=100, blank=True, verbose_name="Código Validación MinSalud")
    estado_validacion = models.CharField(max_length=20, default='PENDIENTE', verbose_name="Estado Validación")
    respuesta_api = models.JSONField(default=dict, blank=True, verbose_name="Respuesta API")
    
    # Resultados de validación
    es_valido = models.BooleanField(default=False, verbose_name="¿Es Válido?")
    errores_encontrados = models.JSONField(default=list, blank=True, verbose_name="Errores")
    advertencias = models.JSONField(default=list, blank=True, verbose_name="Advertencias")
    
    # Información RIPS
    total_registros = models.IntegerField(default=0, verbose_name="Total Registros")
    registros_validos = models.IntegerField(default=0, verbose_name="Registros Válidos")
    registros_con_errores = models.IntegerField(default=0, verbose_name="Registros con Errores")
    
    # Timestamps
    fecha_validacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha Validación")
    fecha_respuesta_api = models.DateTimeField(null=True, blank=True, verbose_name="Fecha Respuesta API")
    
    class Meta:
        db_table = 'neuraudit_validacion_rips'
        verbose_name = 'Validación RIPS'
        verbose_name_plural = 'Validaciones RIPS'
    
    def __str__(self):
        return f"Validación RIPS {self.documento.radicacion.numero_radicado}"


# Importar modelos de servicios
from .models_servicios import ServicioRIPS, ResumenServiciosRadicacion
