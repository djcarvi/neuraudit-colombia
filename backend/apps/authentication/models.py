"""
Authentication models for NeurAudit Colombia - MongoDB Compatible

Sistema de autenticación PSS/PTS + EPS según Resolución 2284 de 2023
Autenticación: NIT + Usuario + Contraseña para PSS
Roles: Radicador (PSS), Auditor Médico, Auditor Administrativo, 
       Coordinador Auditoría, Conciliador, Contabilidad, Admin
"""

from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField, ArrayField, EmbeddedModelField, EmbeddedModelArrayField
from django_mongodb_backend.models import EmbeddedModel
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.conf import settings
import secrets
from datetime import datetime, timedelta
import hashlib

class CustomUserManager(models.Manager):
    """
    Manager personalizado para el modelo User de auditoría médica con MongoDB
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Crear y guardar un usuario de auditoría médica
        """
        if not email:
            raise ValueError('El usuario debe tener un email válido')
        
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('Email inválido')
        
        email = email.lower().strip()
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        
        # ObjectIdAutoField maneja automáticamente la generación del ID
        user.save()
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Crear y guardar un superusuario administrador
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        extra_fields.setdefault('user_type', 'EPS')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(models.Model):
    """
    Modelo de usuario para sistema de auditoría médica NeurAudit Colombia
    Soporte para PSS/PTS y EPS con roles específicos según Resolución 2284
    """
    
    # Tipos de usuario según normativa
    USER_TYPE_CHOICES = [
        ('PSS', 'PSS - Prestador de Servicios de Salud'),
        ('PTS', 'PTS - Proveedor de Tecnologías en Salud'),
        ('EPS', 'EPS - Entidad Promotora de Salud'),
    ]
    
    # Roles específicos según funcionalidad
    ROLE_CHOICES = [
        # Roles PSS/PTS
        ('RADICADOR', 'Radicador de Cuentas Médicas'),
        
        # Roles EPS
        ('AUDITOR_MEDICO', 'Auditor Médico'),
        ('AUDITOR_ADMINISTRATIVO', 'Auditor Administrativo'),
        ('COORDINADOR_AUDITORIA', 'Coordinador de Auditoría'),
        ('CONCILIADOR', 'Conciliador'),
        ('CONTABILIDAD', 'Contabilidad'),
        
        # Rol administrador
        ('ADMIN', 'Administrador del Sistema'),
    ]
    
    STATUS_CHOICES = [
        ('AC', 'Activo'),
        ('IN', 'Inactivo'),
        ('SU', 'Suspendido'),
    ]
    
    # Campos básicos de identificación
    id = ObjectIdAutoField(primary_key=True)
    
    # Información personal y de contacto
    first_name = models.CharField(max_length=100, verbose_name="Nombres")
    last_name = models.CharField(max_length=100, verbose_name="Apellidos")
    email = models.EmailField(unique=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Teléfono")
    
    # Identificación fiscal/legal (obligatorio para PSS)
    nit = models.CharField(max_length=20, blank=True, verbose_name="NIT")
    document_type = models.CharField(max_length=10, default='CC', verbose_name="Tipo Documento")
    document_number = models.CharField(max_length=20, verbose_name="Número Documento")
    
    # Información de autenticación
    username = models.CharField(max_length=150, unique=True, verbose_name="Usuario")
    password_hash = models.CharField(max_length=128, verbose_name="Password Hash")
    
    # Clasificación del usuario
    user_type = models.CharField(max_length=3, choices=USER_TYPE_CHOICES, verbose_name="Tipo Usuario")
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, verbose_name="Rol")
    
    # Estado y permisos
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='AC', verbose_name="Estado")
    is_active = models.BooleanField(default=True, verbose_name="¿Activo?")
    is_staff = models.BooleanField(default=False, verbose_name="¿Es staff?")
    is_superuser = models.BooleanField(default=False, verbose_name="¿Es superusuario?")
    
    # Información específica para PSS/PTS
    pss_code = models.CharField(max_length=20, blank=True, verbose_name="Código PSS REPS")
    pss_name = models.CharField(max_length=200, blank=True, verbose_name="Nombre PSS/PTS")
    habilitacion_number = models.CharField(max_length=50, blank=True, verbose_name="Número Habilitación")
    
    # Información de auditoría
    perfil_auditoria = models.JSONField(default=dict, blank=True, verbose_name="Perfil Auditoría")
    # Ejemplo: {"especialidades": ["medicina_interna", "cirugia"], "max_cuentas_dia": 50}
    
    # Metadatos temporales
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha Actualización")
    last_login = models.DateTimeField(null=True, blank=True, verbose_name="Último Login")
    
    # Manager personalizado
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'user_type', 'role']
    
    class Meta:
        db_table = 'neuraudit_users'
        verbose_name = 'Usuario NeurAudit'
        verbose_name_plural = 'Usuarios NeurAudit'
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
            models.Index(fields=['nit']),
            models.Index(fields=['user_type', 'role']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        if self.user_type in ['PSS', 'PTS']:
            return f"{self.get_full_name()} - {self.pss_name} ({self.nit})"
        return f"{self.get_full_name()} - {self.get_role_display()}"
    
    def get_full_name(self):
        """Retorna el nombre completo del usuario"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        """Retorna el primer nombre del usuario"""
        return self.first_name
    
    def set_password(self, raw_password):
        """Establece la contraseña hasheada"""
        self.password_hash = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Verifica la contraseña"""
        return check_password(raw_password, self.password_hash)
    
    def has_perm(self, perm, obj=None):
        """
        Verifica si el usuario tiene un permiso específico
        Para superusuarios siempre retorna True
        """
        if self.is_active and self.is_superuser:
            return True
        
        # Lógica específica de permisos por rol
        role_permissions = {
            'ADMIN': ['*'],  # Todos los permisos
            'COORDINADOR_AUDITORIA': ['view_dashboard', 'assign_audits', 'view_reports'],
            'AUDITOR_MEDICO': ['audit_medical', 'create_glosas', 'view_assigned'],
            'AUDITOR_ADMINISTRATIVO': ['audit_admin', 'create_glosas', 'view_assigned'],
            'CONCILIADOR': ['manage_conciliation', 'view_glosas'],
            'CONTABILIDAD': ['view_financial', 'export_reports', 'manage_payments'],
            'RADICADOR': ['create_radicacion', 'upload_documents', 'view_own'],
        }
        
        user_perms = role_permissions.get(self.role, [])
        return '*' in user_perms or perm in user_perms
    
    def has_module_perms(self, app_label):
        """
        Verifica si el usuario tiene permisos para un módulo
        """
        if self.is_active and self.is_superuser:
            return True
        
        # Módulos por rol
        role_modules = {
            'ADMIN': ['*'],
            'COORDINADOR_AUDITORIA': ['dashboard', 'auditoria', 'reportes'],
            'AUDITOR_MEDICO': ['auditoria', 'glosas'],
            'AUDITOR_ADMINISTRATIVO': ['auditoria', 'glosas'],
            'CONCILIADOR': ['conciliacion', 'glosas'],
            'CONTABILIDAD': ['reportes', 'pagos'],
            'RADICADOR': ['radicacion', 'devoluciones'],
        }
        
        user_modules = role_modules.get(self.role, [])
        return '*' in user_modules or app_label in user_modules
    
    @property
    def is_pss_user(self):
        """Verifica si es usuario PSS/PTS"""
        return self.user_type in ['PSS', 'PTS']
    
    @property
    def is_eps_user(self):
        """Verifica si es usuario EPS"""
        return self.user_type == 'EPS'
    
    @property
    def can_audit(self):
        """Verifica si puede realizar auditorías"""
        return self.role in ['AUDITOR_MEDICO', 'AUDITOR_ADMINISTRATIVO', 'COORDINADOR_AUDITORIA']
    
    @property
    def can_radicate(self):
        """Verifica si puede radicar cuentas"""
        return self.role == 'RADICADOR' and self.is_pss_user
    
    def get_audit_profile(self):
        """Retorna el perfil de auditoría del usuario"""
        return self.perfil_auditoria
    
    def update_last_login(self):
        """Actualiza la fecha del último login"""
        self.last_login = timezone.now()
        self.save(update_fields=['last_login'])

    @property
    def is_anonymous(self):
        """Always return False. This is a way of comparing User objects to anonymous users."""
        return False

    @property
    def is_authenticated(self):
        """Always return True. This is a way to tell if the user has been authenticated in templates."""
        return True

class UserSession(models.Model):
    """
    Modelo para gestionar sesiones de usuario con MongoDB
    Permite control granular de sesiones activas
    """
    id = ObjectIdAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    
    # Información de la sesión
    session_token = models.CharField(max_length=255, unique=True)
    device_info = models.JSONField(default=dict, blank=True)  # User-Agent, IP, etc.
    ip_address = models.GenericIPAddressField()
    
    # Control temporal
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    last_activity = models.DateTimeField(auto_now=True)
    
    # Estado
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'neuraudit_user_sessions'
        verbose_name = 'Sesión Usuario'
        verbose_name_plural = 'Sesiones Usuario'
        indexes = [
            models.Index(fields=['session_token']),
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"Sesión {self.user.username} - {self.created_at}"
    
    @property
    def is_expired(self):
        """Verifica si la sesión ha expirado"""
        return timezone.now() > self.expires_at
    
    def extend_session(self, hours=8):
        """Extiende la sesión por el número de horas especificado"""
        self.expires_at = timezone.now() + timedelta(hours=hours)
        self.save(update_fields=['expires_at'])
    
    def invalidate(self):
        """Invalida la sesión"""
        self.is_active = False
        self.save(update_fields=['is_active'])
    
    @classmethod
    def create_session(cls, user, ip_address, device_info=None, hours=8):
        """Crea una nueva sesión para el usuario"""
        # Generar token único
        session_token = secrets.token_urlsafe(32)
        
        # Crear sesión
        session = cls.objects.create(
            user=user,
            session_token=session_token,
            ip_address=ip_address,
            device_info=device_info or {},
            expires_at=timezone.now() + timedelta(hours=hours)
        )
        
        return session
    
    @classmethod
    def cleanup_expired_sessions(cls):
        """Limpia sesiones expiradas"""
        expired_sessions = cls.objects.filter(
            expires_at__lt=timezone.now()
        )
        count = expired_sessions.count()
        expired_sessions.delete()
        return count