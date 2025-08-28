# -*- coding: utf-8 -*-
"""
Vistas de management para monitoreo de seguridad
Solo accesible para superadministradores
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from datetime import datetime, timedelta
import json

from .services_auth_nosql import AuthenticationServiceNoSQL

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def security_dashboard_view(request):
    """
    Dashboard de seguridad para administradores
    Muestra métricas de seguridad en tiempo real
    """
    try:
        # Verificar que el usuario sea superadmin
        if not hasattr(request.user, 'is_superuser') or not request.user.is_superuser:
            return Response({
                'error': 'Acceso denegado - Solo superadministradores'
            }, status=status.HTTP_403_FORBIDDEN)
        
        auth_service = AuthenticationServiceNoSQL()
        
        # Obtener estadísticas generales
        stats = auth_service.obtener_estadisticas_seguridad()
        
        # Métricas de cache (últimas 24 horas)
        ahora = datetime.utcnow()
        hace_24h = ahora.strftime("%Y-%m-%d")
        
        # Rate limiting stats
        rate_limit_stats = {
            'ips_bloqueadas': len([k for k in cache._cache.keys() if k.startswith('blocked_ip:')]),
            'rate_limits_activos': len([k for k in cache._cache.keys() if k.startswith('rate_limit:')]),
        }
        
        # Amenazas de seguridad recientes
        threat_keys = [k for k in cache._cache.keys() if k.startswith('security_threat:')]
        recent_threats = []
        
        for key in threat_keys[-10:]:  # Últimas 10 amenazas
            threat_data = cache.get(key)
            if threat_data:
                recent_threats.append(threat_data)
        
        # Top IPs con más actividad
        ip_metrics = {}
        for key in cache._cache.keys():
            if key.startswith(f'metrics:ip:') and hace_24h in key:
                ip = key.split(':')[2]
                count = cache.get(key, 0)
                ip_metrics[ip] = count
        
        top_ips = sorted(ip_metrics.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Usuarios más activos
        user_metrics = {}
        for key in cache._cache.keys():
            if key.startswith(f'metrics:user:') and hace_24h in key:
                user_id = key.split(':')[2]
                count = cache.get(key, 0)
                user_metrics[user_id] = count
        
        top_users = sorted(user_metrics.items(), key=lambda x: x[1], reverse=True)[:10]
        
        response_data = {
            'timestamp': ahora.isoformat(),
            'estadisticas_generales': stats,
            'rate_limiting': rate_limit_stats,
            'amenazas_recientes': recent_threats,
            'top_ips_activas': [{'ip': ip, 'requests': count} for ip, count in top_ips],
            'usuarios_activos': [{'user_id': uid, 'requests': count} for uid, count in top_users],
            'sistema_estado': 'ACTIVO',
            'nivel_amenaza': _determinar_nivel_amenaza(recent_threats, stats)
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error obteniendo dashboard de seguridad: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def block_ip_view(request):
    """
    Bloquear IP manualmente por administradores
    """
    try:
        if not hasattr(request.user, 'is_superuser') or not request.user.is_superuser:
            return Response({
                'error': 'Acceso denegado'
            }, status=status.HTTP_403_FORBIDDEN)
        
        ip_address = request.data.get('ip_address', '').strip()
        reason = request.data.get('reason', 'Bloqueo manual por administrador')
        duration_hours = int(request.data.get('duration_hours', 24))
        
        if not ip_address:
            return Response({
                'error': 'IP address es requerida'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Bloquear IP
        cache.set(f"blocked_ip:{ip_address}", {
            'timestamp': datetime.utcnow().isoformat(),
            'reason': reason,
            'blocked_by': request.user.username,
            'manual_block': True
        }, duration_hours * 3600)
        
        # Registrar evento
        auth_service = AuthenticationServiceNoSQL()
        auth_service._registrar_evento_seguridad(
            'MANUAL_IP_BLOCK',
            {
                'ip_address': ip_address,
                'admin_user': request.user.username,
                'timestamp': datetime.utcnow().isoformat()
            },
            f'IP bloqueada manualmente: {reason}'
        )
        
        return Response({
            'message': f'IP {ip_address} bloqueada exitosamente por {duration_hours} horas',
            'blocked_until': (datetime.utcnow() + timedelta(hours=duration_hours)).isoformat()
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error bloqueando IP: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unblock_ip_view(request):
    """
    Desbloquear IP manualmente
    """
    try:
        if not hasattr(request.user, 'is_superuser') or not request.user.is_superuser:
            return Response({
                'error': 'Acceso denegado'
            }, status=status.HTTP_403_FORBIDDEN)
        
        ip_address = request.data.get('ip_address', '').strip()
        
        if not ip_address:
            return Response({
                'error': 'IP address es requerida'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Desbloquear IP
        cache.delete(f"blocked_ip:{ip_address}")
        
        # Registrar evento
        auth_service = AuthenticationServiceNoSQL()
        auth_service._registrar_evento_seguridad(
            'MANUAL_IP_UNBLOCK',
            {
                'ip_address': ip_address,
                'admin_user': request.user.username,
                'timestamp': datetime.utcnow().isoformat()
            },
            f'IP desbloqueada manualmente por {request.user.username}'
        )
        
        return Response({
            'message': f'IP {ip_address} desbloqueada exitosamente'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error desbloqueando IP: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invalidate_user_sessions_view(request):
    """
    Invalidar todas las sesiones de un usuario
    """
    try:
        if not hasattr(request.user, 'is_superuser') or not request.user.is_superuser:
            return Response({
                'error': 'Acceso denegado'
            }, status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.data.get('user_id', '').strip()
        reason = request.data.get('reason', 'Invalidación manual por administrador')
        
        if not user_id:
            return Response({
                'error': 'user_id es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        auth_service = AuthenticationServiceNoSQL()
        sessions_invalidated = auth_service.invalidar_todas_sesiones_usuario(user_id, reason)
        
        return Response({
            'message': f'{sessions_invalidated} sesiones invalidadas para usuario {user_id}',
            'sessions_invalidated': sessions_invalidated
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error invalidando sesiones: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def _determinar_nivel_amenaza(threats, stats):
    """Determina el nivel de amenaza actual del sistema"""
    if not threats:
        return 'BAJO'
    
    # Contar amenazas críticas en las últimas 24 horas
    amenazas_criticas = sum(1 for t in threats if t.get('severity') == 'CRITICO')
    amenazas_altas = sum(1 for t in threats if t.get('severity') == 'ALTO')
    
    intentos_fallidos = stats.get('intentos_fallidos_24h', 0)
    cuentas_bloqueadas = stats.get('cuentas_bloqueadas', 0)
    
    if amenazas_criticas > 5 or intentos_fallidos > 100 or cuentas_bloqueadas > 10:
        return 'CRITICO'
    elif amenazas_criticas > 2 or amenazas_altas > 10 or intentos_fallidos > 50:
        return 'ALTO'
    elif amenazas_altas > 5 or intentos_fallidos > 20:
        return 'MEDIO'
    else:
        return 'BAJO'