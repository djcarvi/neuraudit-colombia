# -*- coding: utf-8 -*-
"""
Permisos personalizados para NeurAudit Colombia
Control de acceso basado en roles
"""

from rest_framework import permissions
from typing import Any


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permite edición solo al propietario del objeto
    """
    def has_object_permission(self, request, view, obj):
        # Lectura permitida para todos los autenticados
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escritura solo para el propietario
        return obj.created_by == request.user


class IsPrestadorUser(permissions.BasePermission):
    """
    Verifica que el usuario sea un prestador (PSS)
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'tipo_usuario') and
            request.user.tipo_usuario == 'PSS'
        )


class IsEPSUser(permissions.BasePermission):
    """
    Verifica que el usuario sea de la EPS
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'tipo_usuario') and
            request.user.tipo_usuario == 'EPS'
        )


class IsAuditorMedico(permissions.BasePermission):
    """
    Verifica que el usuario sea auditor médico
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in ['AUDITOR_MEDICO', 'COORDINADOR_AUDITORIA', 'ADMINISTRADOR']
        )


class IsAuditorAdministrativo(permissions.BasePermission):
    """
    Verifica que el usuario sea auditor administrativo
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in ['AUDITOR_ADMINISTRATIVO', 'COORDINADOR_AUDITORIA', 'ADMINISTRADOR']
        )


class IsConciliador(permissions.BasePermission):
    """
    Verifica que el usuario sea conciliador
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in ['CONCILIADOR', 'ADMINISTRADOR']
        )


class IsCoordinadorAuditoria(permissions.BasePermission):
    """
    Verifica que el usuario sea coordinador de auditoría
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in ['COORDINADOR_AUDITORIA', 'ADMINISTRADOR']
        )


class IsContabilidad(permissions.BasePermission):
    """
    Verifica que el usuario sea de contabilidad
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in ['CONTABILIDAD', 'ADMINISTRADOR']
        )


class IsAdministrador(permissions.BasePermission):
    """
    Verifica que el usuario sea administrador
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol == 'ADMINISTRADOR'
        )


class CanViewRadicacion(permissions.BasePermission):
    """
    Determina quién puede ver radicaciones
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Administradores ven todo
        if user.rol == 'ADMINISTRADOR':
            return True
        
        # PSS solo ve sus propias radicaciones
        if user.tipo_usuario == 'PSS':
            return obj.prestador.nit == user.prestador_nit
        
        # EPS ve todas las radicaciones
        if user.tipo_usuario == 'EPS':
            return True
        
        return False


class CanApplyGlosa(permissions.BasePermission):
    """
    Determina quién puede aplicar glosas
    Solo auditores médicos y administrativos
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in [
                'AUDITOR_MEDICO',
                'AUDITOR_ADMINISTRATIVO',
                'COORDINADOR_AUDITORIA',
                'ADMINISTRADOR'
            ]
        )
    
    def has_object_permission(self, request, view, obj):
        # Verificar que la factura esté asignada al auditor
        if request.user.rol in ['AUDITOR_MEDICO', 'AUDITOR_ADMINISTRATIVO']:
            # TODO: Verificar asignación
            return True
        
        # Coordinadores y administradores pueden aplicar a cualquier factura
        return request.user.rol in ['COORDINADOR_AUDITORIA', 'ADMINISTRADOR']


class CanRatifyGlosa(permissions.BasePermission):
    """
    Determina quién puede ratificar o levantar glosas
    Solo conciliadores
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in ['CONCILIADOR', 'ADMINISTRADOR']
        )


class CanAuthorizePayment(permissions.BasePermission):
    """
    Determina quién puede autorizar pagos
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol in ['CONTABILIDAD', 'ADMINISTRADOR']
        )


class ReadOnlyOrAdmin(permissions.BasePermission):
    """
    Solo lectura para todos, escritura solo para administradores
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol == 'ADMINISTRADOR'
        )


class DynamicPermission(permissions.BasePermission):
    """
    Permiso dinámico basado en configuración del view
    Uso: permission_classes = [DynamicPermission]
    En el view: permission_roles = ['AUDITOR_MEDICO', 'ADMINISTRADOR']
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Obtener roles permitidos del view
        allowed_roles = getattr(view, 'permission_roles', [])
        
        if not allowed_roles:
            # Si no hay roles definidos, permitir a todos los autenticados
            return True
        
        # Verificar si el usuario tiene alguno de los roles permitidos
        return (
            hasattr(request.user, 'rol') and
            request.user.rol in allowed_roles
        )