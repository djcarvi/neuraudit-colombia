# -*- coding: utf-8 -*-
"""
Middleware de seguridad avanzado para NeurAudit
Implementa capas adicionales de protección y audit trail
"""

import time
import hashlib
import json
import logging
from datetime import datetime
from django.core.cache import cache
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class NeurAuditSecurityMiddleware(MiddlewareMixin):
    """
    Middleware de seguridad avanzado que complementa la autenticación
    
    Características:
    - Audit trail completo de requests
    - Detección de ataques (XSS, Injection, etc.)
    - Headers de seguridad
    - Throttling avanzado
    - Monitoreo de sesiones
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Patrones sospechosos
        self.suspicious_patterns = [
            'script>',
            'javascript:',
            'eval(',
            'union select',
            'drop table',
            'insert into',
            'update set',
            'delete from',
            '../',
            '..\\',
            '/etc/passwd',
            'cmd.exe',
            'powershell',
            '__import__',
            'exec(',
            'os.system'
        ]
        
        # Rutas que requieren audit trail completo
        self.critical_paths = [
            '/api/auth/',
            '/api/dashboard/',
            '/api/radicacion/',
            '/api/auditoria/',
            '/api/conciliacion/',
            '/api/contratacion/'
        ]
        
    def __call__(self, request):
        # Registrar inicio del request
        start_time = time.time()
        request.start_time = start_time
        
        # Análisis de seguridad pre-request
        security_check = self.pre_request_security_check(request)
        if not security_check['allowed']:
            return JsonResponse({
                'error': 'Request bloqueado por seguridad',
                'code': security_check['code']
            }, status=403)
        
        # Agregar headers de seguridad
        response = self.get_response(request)
        
        # Análisis post-request
        self.post_request_analysis(request, response, start_time)
        
        # Headers de seguridad
        self.add_security_headers(response)
        
        return response
    
    def pre_request_security_check(self, request):
        """Análisis de seguridad antes de procesar el request"""
        try:
            ip_address = self.get_client_ip(request)
            
            # Skip security checks for localhost during development
            if ip_address in ['127.0.0.1', 'localhost', '::1']:
                return {'allowed': True}
            
            # 1. Verificar IP bloqueada
            if cache.get(f"blocked_ip:{ip_address}"):
                return {
                    'allowed': False,
                    'code': 'IP_BLOCKED'
                }
            
            # 2. Detectar patrones de ataque en URL
            full_path = request.get_full_path().lower()
            for pattern in self.suspicious_patterns:
                if pattern in full_path:
                    self.log_security_threat(request, 'SUSPICIOUS_URL', 
                                           f'Patrón sospechoso en URL: {pattern}')
                    return {
                        'allowed': False,
                        'code': 'SUSPICIOUS_PATTERN'
                    }
            
            # 3. Verificar tamaño de request
            content_length = int(request.META.get('CONTENT_LENGTH', 0))
            if content_length > 50 * 1024 * 1024:  # 50MB
                return {
                    'allowed': False,
                    'code': 'REQUEST_TOO_LARGE'
                }
            
            # 4. Verificar User-Agent sospechoso
            user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
            suspicious_agents = ['bot', 'crawler', 'scanner', 'curl', 'wget']
            
            # Permitir algunos bots conocidos pero registrar
            if any(agent in user_agent for agent in suspicious_agents):
                if not any(allowed in user_agent for allowed in ['googlebot', 'bingbot']):
                    self.log_security_threat(request, 'SUSPICIOUS_USER_AGENT', 
                                           f'User-Agent: {user_agent}')
            
            # 5. Rate limiting por IP más granular
            minute_key = f"requests_per_minute:{ip_address}"
            minute_count = cache.get(minute_key, 0)
            
            if minute_count > 60:  # Máximo 60 requests por minuto
                return {
                    'allowed': False,
                    'code': 'RATE_LIMIT_MINUTE'
                }
            
            cache.set(minute_key, minute_count + 1, 60)
            
            return {'allowed': True}
            
        except Exception as e:
            logger.error(f"Error en pre_request_security_check: {str(e)}")
            return {'allowed': True}  # Fallar de forma segura
    
    def post_request_analysis(self, request, response, start_time):
        """Análisis post-request para audit trail y detección"""
        try:
            # Calcular tiempo de respuesta
            response_time = time.time() - start_time
            
            # Audit trail para rutas críticas
            if any(path in request.path for path in self.critical_paths):
                self.log_request_audit(request, response, response_time)
            
            # Detectar respuestas anómalas
            if response_time > 10:  # Más de 10 segundos
                self.log_security_threat(request, 'SLOW_RESPONSE', 
                                       f'Tiempo de respuesta: {response_time:.2f}s')
            
            # Registrar errores de servidor
            if response.status_code >= 500:
                self.log_security_threat(request, 'SERVER_ERROR', 
                                       f'Status: {response.status_code}')
            
            # Monitorear intentos de acceso no autorizado
            if response.status_code == 401:
                self.handle_unauthorized_attempt(request)
            
        except Exception as e:
            logger.error(f"Error en post_request_analysis: {str(e)}")
    
    def log_request_audit(self, request, response, response_time):
        """Registra audit trail completo del request"""
        try:
            audit_data = {
                'timestamp': datetime.utcnow().isoformat(),
                'ip_address': self.get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', '')[:500],
                'method': request.method,
                'path': request.path,
                'query_params': dict(request.GET),
                'status_code': response.status_code,
                'response_time': round(response_time, 3),
                'content_length': len(response.content) if hasattr(response, 'content') else 0,
                'referer': request.META.get('HTTP_REFERER', ''),
                'user_id': getattr(request.user, 'id', None) if hasattr(request, 'user') else None,
                'username': getattr(request.user, 'username', None) if hasattr(request, 'user') else None
            }
            
            # Registrar en cache para análisis posterior
            audit_key = f"audit_trail:{datetime.utcnow().strftime('%Y%m%d%H%M')}:{hashlib.md5(json.dumps(audit_data).encode()).hexdigest()[:8]}"
            cache.set(audit_key, audit_data, 86400)  # 24 horas
            
            # Log estructurado
            logger.info(f"AUDIT: {request.method} {request.path} | "
                       f"Status: {response.status_code} | "
                       f"Time: {response_time:.3f}s | "
                       f"IP: {audit_data['ip_address']} | "
                       f"User: {audit_data['username'] or 'anonymous'}")
            
        except Exception as e:
            logger.error(f"Error en log_request_audit: {str(e)}")
    
    def log_security_threat(self, request, threat_type, details):
        """Registra amenazas de seguridad"""
        try:
            ip_address = self.get_client_ip(request)
            
            threat_data = {
                'timestamp': datetime.utcnow().isoformat(),
                'threat_type': threat_type,
                'ip_address': ip_address,
                'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200],
                'path': request.path,
                'method': request.method,
                'details': details,
                'severity': self.get_threat_severity(threat_type)
            }
            
            # Cache para análisis
            threat_key = f"security_threat:{datetime.utcnow().strftime('%Y%m%d%H')}:{ip_address}:{threat_type}"
            cache.set(threat_key, threat_data, 86400)
            
            # Log de seguridad
            logger.warning(f"SECURITY THREAT [{threat_type}]: {details} | "
                          f"IP: {ip_address} | "
                          f"Path: {request.path}")
            
            # Incrementar contador de amenazas por IP
            threat_count_key = f"threat_count:{ip_address}"
            threat_count = cache.get(threat_count_key, 0) + 1
            cache.set(threat_count_key, threat_count, 3600)  # 1 hora
            
            # Auto-bloqueo por múltiples amenazas
            if threat_count >= 5:
                self.auto_block_ip(ip_address, f"Múltiples amenazas: {threat_count}")
            
        except Exception as e:
            logger.error(f"Error registrando amenaza de seguridad: {str(e)}")
    
    def handle_unauthorized_attempt(self, request):
        """Maneja intentos de acceso no autorizado"""
        try:
            ip_address = self.get_client_ip(request)
            
            # Incrementar contador de intentos no autorizados
            unauth_key = f"unauthorized_attempts:{ip_address}"
            unauth_count = cache.get(unauth_key, 0) + 1
            cache.set(unauth_key, unauth_count, 3600)  # 1 hora
            
            # Bloqueo temporal por múltiples intentos
            if unauth_count >= 10:
                self.auto_block_ip(ip_address, f"Intentos no autorizados: {unauth_count}")
            
            self.log_security_threat(request, 'UNAUTHORIZED_ATTEMPT', 
                                   f"Intento #{unauth_count}")
            
        except Exception as e:
            logger.error(f"Error manejando intento no autorizado: {str(e)}")
    
    def auto_block_ip(self, ip_address, reason):
        """Bloqueo automático de IP por amenazas"""
        try:
            # Bloquear por 1 hora
            cache.set(f"blocked_ip:{ip_address}", {
                'timestamp': datetime.utcnow().isoformat(),
                'reason': reason,
                'auto_blocked': True
            }, 3600)
            
            logger.error(f"IP AUTO-BLOQUEADA: {ip_address} | Razón: {reason}")
            
        except Exception as e:
            logger.error(f"Error en auto_block_ip: {str(e)}")
    
    def get_client_ip(self, request):
        """Obtiene IP real del cliente considerando proxies"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')
    
    def get_threat_severity(self, threat_type):
        """Determina severidad de la amenaza"""
        high_severity = ['SUSPICIOUS_URL', 'SQL_INJECTION', 'XSS_ATTEMPT']
        medium_severity = ['RATE_LIMIT_EXCEEDED', 'SUSPICIOUS_USER_AGENT']
        
        if threat_type in high_severity:
            return 'HIGH'
        elif threat_type in medium_severity:
            return 'MEDIUM'
        return 'LOW'
    
    def add_security_headers(self, response):
        """Agrega headers de seguridad HTTP"""
        security_headers = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'X-Permitted-Cross-Domain-Policies': 'none'
        }
        
        for header, value in security_headers.items():
            if header not in response:
                response[header] = value
        
        return response