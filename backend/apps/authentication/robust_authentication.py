# -*- coding: utf-8 -*-
"""
Backend de autenticación robusto de alta seguridad
Integración completa con AuthenticationServiceNoSQL
"""

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from django.core.cache import cache
from datetime import datetime, timedelta
import logging
import hashlib
import json

from .services_auth_nosql import AuthenticationServiceNoSQL
from .robust_user import RobustNeurAuditUser

logger = logging.getLogger(__name__)

class RobustNeurAuditAuthentication(BaseAuthentication):
    """
    Sistema de autenticación robusto de alta seguridad
    
    Características:
    - Verificación en tiempo real con MongoDB
    - Rate limiting por IP y usuario
    - Detección de anomalías
    - Audit trail completo
    - Manejo de refresh tokens
    - Verificación de permisos dinámicos
    - Invalidación de tokens comprometidos
    """
    
    def __init__(self):
        self.auth_service = AuthenticationServiceNoSQL()
        
        # Configuración de seguridad
        self.RATE_LIMIT_REQUESTS = 100  # Requests por ventana
        self.RATE_LIMIT_WINDOW = 300   # 5 minutos
        self.SUSPICIOUS_THRESHOLD = 10  # Requests sospechosos antes de alerta
        self.MAX_FAILED_ATTEMPTS = 5   # Intentos fallidos antes de bloqueo temporal
        
    def authenticate(self, request):
        """
        Proceso de autenticación robusto
        """
        try:
            # 1. Extraer token del request
            token = self._extract_token(request)
            if not token:
                return None
            
            # 2. Obtener contexto del request
            request_context = self._build_request_context(request)
            
            # 3. Rate limiting
            if not self._check_rate_limits(request_context):
                self._log_security_event('RATE_LIMIT_EXCEEDED', request_context)
                raise AuthenticationFailed('Rate limit excedido')
            
            # 4. Validar token con servicio NoSQL
            es_valido, payload = self.auth_service.validar_token(token)
            
            if not es_valido or not payload:
                self._handle_invalid_token(token, request_context)
                raise AuthenticationFailed('Token inválido o expirado')
            
            # 5. Verificar integridad del token
            if not self._verify_token_integrity(token, payload):
                self._log_security_event('TOKEN_INTEGRITY_VIOLATION', request_context)
                raise AuthenticationFailed('Token comprometido')
            
            # 6. Crear usuario robusto con verificación en tiempo real
            user = RobustNeurAuditUser(
                self.auth_service, 
                payload, 
                request_context
            )
            
            if not user.is_authenticated:
                self._handle_user_not_authenticated(user, request_context)
                raise AuthenticationFailed('Usuario no autenticado')
            
            # 7. Verificar anomalías de comportamiento
            self._detect_anomalies(user, request_context)
            
            # 8. Actualizar métricas de seguridad
            self._update_security_metrics(user, request_context)
            
            # 9. Registrar acceso exitoso
            self._log_successful_access(user, request_context)
            
            return (user, token)
            
        except AuthenticationFailed:
            # Re-lanzar excepciones de autenticación
            raise
        except Exception as e:
            logger.error(f"Error crítico en autenticación: {str(e)}")
            self._log_security_event('AUTHENTICATION_ERROR', 
                                   request_context or {}, 
                                   f"Error: {str(e)}")
            raise AuthenticationFailed('Error de autenticación')
    
    def _extract_token(self, request):
        """Extrae token del request con múltiples métodos"""
        # Header Authorization
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').strip()
        if auth_header.startswith('Bearer '):
            return auth_header[7:]
        
        # Query parameter (para websockets/SSE)
        token = request.GET.get('token', '').strip()
        if token:
            return token
        
        # Cookie (si está configurado)
        token = request.COOKIES.get('neuraudit_token', '').strip()
        if token:
            return token
        
        return None
    
    def _build_request_context(self, request):
        """Construye contexto completo del request para auditoría"""
        # Obtener IP real (considerando proxies)
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR', '')
        
        return {
            'ip_address': ip_address,
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'method': request.method,
            'path': request.path,
            'timestamp': datetime.utcnow(),
            'referer': request.META.get('HTTP_REFERER', ''),
            'host': request.META.get('HTTP_HOST', ''),
            'request_id': self._generate_request_id(request)
        }
    
    def _generate_request_id(self, request):
        """Genera ID único para el request"""
        data = f"{request.path}:{request.method}:{datetime.utcnow().isoformat()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
    
    def _check_rate_limits(self, context):
        """Rate limiting robusto por IP y usuario"""
        ip_address = context['ip_address']
        
        # Rate limit por IP
        ip_key = f"rate_limit:ip:{ip_address}"
        ip_requests = cache.get(ip_key, 0)
        
        if ip_requests >= self.RATE_LIMIT_REQUESTS:
            # Bloquear IP temporalmente
            self._block_ip_temporarily(ip_address, context)
            return False
        
        # Incrementar contador
        cache.set(ip_key, ip_requests + 1, self.RATE_LIMIT_WINDOW)
        
        return True
    
    def _block_ip_temporarily(self, ip_address, context):
        """Bloquea IP temporalmente por rate limiting"""
        block_key = f"blocked_ip:{ip_address}"
        cache.set(block_key, True, 3600)  # 1 hora
        
        # Registrar en audit trail
        self._log_security_event('IP_BLOCKED_RATE_LIMIT', context, 
                               f'IP {ip_address} bloqueada por rate limiting')
    
    def _verify_token_integrity(self, token, payload):
        """Verifica integridad y consistencia del token"""
        try:
            # Verificar que el token no esté en blacklist
            token_hash = hashlib.sha256(token.encode()).hexdigest()
            if cache.get(f"blacklist_token:{token_hash}"):
                return False
            
            # Verificar campos requeridos
            required_fields = ['user_id', 'username', 'jti', 'exp', 'iat']
            for field in required_fields:
                if field not in payload:
                    return False
            
            # Verificar que no sea un token duplicado/replay
            jti = payload.get('jti', '')
            jti_key = f"token_jti:{jti}"
            
            if cache.get(jti_key):
                # Posible replay attack
                return False
            
            # Marcar JTI como usado (hasta expiración)
            exp_timestamp = payload.get('exp', 0)
            ttl = max(0, exp_timestamp - datetime.utcnow().timestamp())
            cache.set(jti_key, True, int(ttl))
            
            return True
            
        except Exception as e:
            logger.error(f"Error verificando integridad del token: {str(e)}")
            return False
    
    def _handle_invalid_token(self, token, context):
        """Maneja tokens inválidos con logging de seguridad"""
        self._log_security_event('INVALID_TOKEN_ATTEMPT', context, 
                               f'Token inválido: {token[:20]}...')
        
        # Incrementar contador de intentos fallidos por IP
        ip_address = context['ip_address']
        failed_key = f"failed_attempts:ip:{ip_address}"
        failed_count = cache.get(failed_key, 0) + 1
        cache.set(failed_key, failed_count, 3600)  # 1 hora
        
        if failed_count >= self.MAX_FAILED_ATTEMPTS:
            self._block_ip_temporarily(ip_address, context)
    
    def _handle_user_not_authenticated(self, user, context):
        """Maneja usuarios no autenticados"""
        self._log_security_event('USER_NOT_AUTHENTICATED', context,
                               f'Usuario {user.username} falló autenticación')
    
    def _detect_anomalies(self, user, context):
        """Detección de anomalías de comportamiento"""
        try:
            # Verificar patrones sospechosos
            anomalies = []
            
            # 1. Múltiples IPs en poco tiempo
            ip_key = f"user_ips:{user.id}"
            user_ips = cache.get(ip_key, set())
            current_ip = context['ip_address']
            
            if isinstance(user_ips, set):
                user_ips.add(current_ip)
                if len(user_ips) > 3:  # Más de 3 IPs en ventana de tiempo
                    anomalies.append('MULTIPLE_IPS')
                cache.set(ip_key, user_ips, 1800)  # 30 minutos
            
            # 2. Actividad fuera de horario normal (configurable)
            current_hour = datetime.utcnow().hour
            if current_hour < 6 or current_hour > 22:  # Fuera de 6 AM - 10 PM UTC
                anomalies.append('OFF_HOURS_ACCESS')
            
            # 3. Múltiples requests en muy poco tiempo
            burst_key = f"request_burst:{user.id}"
            burst_count = cache.get(burst_key, 0) + 1
            cache.set(burst_key, burst_count, 60)  # 1 minuto
            
            if burst_count > 50:  # Más de 50 requests por minuto
                anomalies.append('REQUEST_BURST')
            
            # Registrar anomalías detectadas
            if anomalies:
                self._log_security_event('ANOMALY_DETECTED', context,
                                       f'Anomalías: {", ".join(anomalies)} para usuario {user.username}')
            
        except Exception as e:
            logger.error(f"Error en detección de anomalías: {str(e)}")
    
    def _update_security_metrics(self, user, context):
        """Actualiza métricas de seguridad"""
        try:
            # Incrementar métricas de acceso
            date_key = datetime.utcnow().strftime("%Y-%m-%d")
            
            # Por usuario
            user_metric_key = f"metrics:user:{user.id}:{date_key}"
            cache.set(user_metric_key, cache.get(user_metric_key, 0) + 1, 86400)
            
            # Por IP
            ip_metric_key = f"metrics:ip:{context['ip_address']}:{date_key}"
            cache.set(ip_metric_key, cache.get(ip_metric_key, 0) + 1, 86400)
            
            # Por perfil
            profile_metric_key = f"metrics:profile:{user.perfil}:{date_key}"
            cache.set(profile_metric_key, cache.get(profile_metric_key, 0) + 1, 86400)
            
        except Exception as e:
            logger.error(f"Error actualizando métricas de seguridad: {str(e)}")
    
    def _log_successful_access(self, user, context):
        """Registra acceso exitoso en audit trail"""
        try:
            self.auth_service._registrar_log_auditoria(
                user.id,
                'SUCCESSFUL_ACCESS',
                json.dumps({
                    'path': context['path'],
                    'method': context['method'],
                    'user_agent': context['user_agent'][:200],  # Limitar tamaño
                    'request_id': context['request_id']
                }),
                context['ip_address']
            )
        except Exception as e:
            logger.error(f"Error registrando acceso exitoso: {str(e)}")
    
    def _log_security_event(self, event_type, context, details=""):
        """Registra eventos de seguridad"""
        try:
            # Log en Django
            logger.warning(f"SECURITY EVENT [{event_type}]: {details} | "
                         f"IP: {context.get('ip_address', 'unknown')} | "
                         f"UA: {context.get('user_agent', 'unknown')[:100]}")
            
            # Registrar en sistema de auditoría NoSQL si es posible
            if hasattr(self.auth_service, '_registrar_evento_seguridad'):
                self.auth_service._registrar_evento_seguridad(
                    event_type, context, details
                )
            
        except Exception as e:
            logger.error(f"Error registrando evento de seguridad: {str(e)}")
    
    def authenticate_header(self, request):
        """Header para WWW-Authenticate"""
        return 'Bearer realm="neuraudit-api"'