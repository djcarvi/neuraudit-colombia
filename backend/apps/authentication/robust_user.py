# -*- coding: utf-8 -*-
"""
Usuario robusto integrado con sistema NoSQL de alta seguridad
"""

from bson import ObjectId
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class RobustNeurAuditUser:
    """
    Usuario robusto que se sincroniza en tiempo real con MongoDB
    Implementa verificaciones de seguridad completas
    """
    
    def __init__(self, auth_service, token_payload, request_context=None):
        self.auth_service = auth_service
        self._token_payload = token_payload
        self._request_context = request_context or {}
        
        # Datos base del token
        self.id = token_payload.get('user_id')
        self.username = token_payload.get('username', '')
        self._last_sync = None
        self._cached_user_data = None
        
        # Estado de autenticación
        self.is_authenticated = True
        
        # Sincronización inicial
        self._sync_with_database()
    
    def _sync_with_database(self):
        """Sincroniza datos del usuario con MongoDB en tiempo real"""
        try:
            if not self.id:
                raise ValueError("Usuario sin ID válido")
            
            # Obtener datos actualizados de MongoDB
            usuario_actual = self.auth_service.usuarios.find_one({
                "_id": ObjectId(self.id)
            })
            
            if not usuario_actual:
                logger.warning(f"Usuario {self.username} no encontrado en MongoDB")
                self.is_authenticated = False
                return False
            
            # Verificar si el usuario está activo
            estado = usuario_actual.get('estado', 'INACTIVO')
            if estado != 'ACTIVO':
                logger.warning(f"Usuario {self.username} está inactivo: {estado}")
                self.is_authenticated = False
                return False
            
            # Verificar si la cuenta está bloqueada
            seguridad = usuario_actual.get('seguridad', {})
            if seguridad.get('cuenta_bloqueada', False):
                logger.warning(f"Usuario {self.username} tiene cuenta bloqueada")
                self.is_authenticated = False
                return False
            
            # Verificar sesión activa
            token_actual = self._token_payload.get('jti', '')
            sesion_activa = self.auth_service.sesiones.find_one({
                "usuario_id": ObjectId(self.id),
                "activa": True,
                "fecha_expiracion": {"$gt": datetime.utcnow()}
            })
            
            if not sesion_activa:
                logger.warning(f"Sesión inválida para usuario {self.username}")
                self.is_authenticated = False
                return False
            
            # Verificar consistencia de IP (opcional - configurable)
            ip_request = self._request_context.get('ip_address', '')
            ip_sesion = sesion_activa.get('ip_address', '')
            
            if ip_request and ip_sesion and ip_request != ip_sesion:
                # Registrar posible anomalía pero no bloquear automáticamente
                self.auth_service._registrar_log_auditoria(
                    ObjectId(self.id), 
                    'IP_MISMATCH', 
                    f'IP request: {ip_request}, IP sesión: {ip_sesion}',
                    ip_request
                )
                logger.warning(f"Inconsistencia de IP para usuario {self.username}")
            
            # Cache de datos del usuario
            self._cached_user_data = usuario_actual
            self._last_sync = datetime.utcnow()
            
            # Propiedades del usuario
            self.tipo_usuario = usuario_actual.get('tipo_usuario', 'EPS')
            self.perfil = usuario_actual.get('perfil', '')
            self.email = usuario_actual.get('email', '')
            self.datos_personales = usuario_actual.get('datos_personales', {})
            self.datos_pss = usuario_actual.get('datos_pss', {})
            
            # Atributos de compatibilidad
            self.is_pss_user = self.tipo_usuario in ['PSS', 'PTS']
            self.is_eps_user = self.tipo_usuario == 'EPS'
            self.is_staff = self.perfil in ['SUPERADMIN', 'COORDINADOR_AUDITORIA']
            self.is_superuser = self.perfil == 'SUPERADMIN'
            self.is_active = estado == 'ACTIVO'
            
            # Actualizar último acceso
            self.auth_service.usuarios.update_one(
                {"_id": ObjectId(self.id)},
                {"$set": {"metadata.ultimo_acceso": datetime.utcnow()}}
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error sincronizando usuario {self.username}: {str(e)}")
            self.is_authenticated = False
            return False
    
    def get_permissions(self):
        """Obtiene permisos actualizados desde MongoDB"""
        try:
            if not self._cached_user_data:
                self._sync_with_database()
            
            if not self._cached_user_data:
                return []
            
            # Obtener permisos del perfil
            perfil_id = self._cached_user_data.get('perfil')
            perfil = self.auth_service.perfiles_permisos.find_one({"_id": perfil_id})
            
            return perfil.get('permisos', []) if perfil else []
            
        except Exception as e:
            logger.error(f"Error obteniendo permisos para {self.username}: {str(e)}")
            return []
    
    def has_perm(self, permiso):
        """Verifica permisos en tiempo real contra MongoDB"""
        try:
            permisos = self.get_permissions()
            
            # Superadmin tiene todos los permisos
            if self.is_superuser:
                return True
                
            # Verificar permiso específico o comodín
            return permiso in permisos or '*' in permisos
            
        except Exception as e:
            logger.error(f"Error verificando permiso {permiso} para {self.username}: {str(e)}")
            return False
    
    def has_module_access(self, modulo):
        """Verifica acceso a módulos específicos"""
        try:
            if not self._cached_user_data:
                self._sync_with_database()
            
            perfil_id = self._cached_user_data.get('perfil')
            perfil = self.auth_service.perfiles_permisos.find_one({"_id": perfil_id})
            
            if not perfil:
                return False
            
            modulos_permitidos = perfil.get('modulos', [])
            return modulo in modulos_permitidos or '*' in modulos_permitidos
            
        except Exception as e:
            logger.error(f"Error verificando acceso al módulo {modulo}: {str(e)}")
            return False
    
    def invalidate_session(self, reason="manual"):
        """Invalidar sesión actual de forma segura"""
        try:
            token_id = self._token_payload.get('jti', '')
            
            # Marcar sesión como inactiva
            self.auth_service.sesiones.update_one(
                {
                    "usuario_id": ObjectId(self.id),
                    "activa": True
                },
                {
                    "$set": {
                        "activa": False,
                        "fecha_cierre": datetime.utcnow(),
                        "razon_cierre": reason
                    }
                }
            )
            
            # Registrar en audit trail
            self.auth_service._registrar_log_auditoria(
                ObjectId(self.id),
                'SESSION_INVALIDATED',
                f'Sesión invalidada: {reason}',
                self._request_context.get('ip_address', '')
            )
            
            self.is_authenticated = False
            
            return True
            
        except Exception as e:
            logger.error(f"Error invalidando sesión para {self.username}: {str(e)}")
            return False
    
    def should_refresh_data(self):
        """Determina si necesita refrescar datos (cada 5 minutos)"""
        if not self._last_sync:
            return True
        
        return datetime.utcnow() - self._last_sync > timedelta(minutes=5)
    
    def __str__(self):
        return f"{self.username} ({self.tipo_usuario}-{self.perfil})"
    
    def __repr__(self):
        return f"<RobustNeurAuditUser: {self.username}>"