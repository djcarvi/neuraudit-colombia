"""
Vistas para Autenticación - NeurAudit Colombia
Sistema JWT para PSS/PTS + EPS según Resolución 2284 de 2023
"""

import logging
from datetime import datetime, timedelta
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import jwt
from django.conf import settings
from .models import User, UserSession
from .serializers import UserLoginSerializer, UserProfileSerializer

logger = logging.getLogger('apps.authentication')


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtener tokens JWT
    Soporte para autenticación PSS (NIT + Usuario + Contraseña) y EPS (Usuario + Contraseña)
    """
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        logger.info(f"Intento de login desde IP: {self.get_client_ip(request)}")
        
        user_type = request.data.get('user_type', 'eps')
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        nit = request.data.get('nit', '').strip() if user_type == 'pss' else None
        
        # Validaciones básicas
        if not username or not password:
            logger.warning(f"Login fallido: Campos vacíos - IP: {self.get_client_ip(request)}")
            return Response({
                'error': 'Usuario y contraseña son obligatorios',
                'code': 'MISSING_CREDENTIALS'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if user_type == 'pss' and not nit:
            logger.warning(f"Login PSS fallido: NIT faltante - Usuario: {username}")
            return Response({
                'error': 'El NIT del prestador es obligatorio',
                'code': 'MISSING_NIT'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscar usuario según tipo
            if user_type == 'pss':
                # Para PSS: validar NIT + usuario
                user = User.objects.filter(
                    username=username,
                    nit=nit,
                    user_type__in=['PSS', 'PTS'],
                    is_active=True,
                    status='AC'
                ).first()
                
                if not user:
                    logger.warning(f"Login PSS fallido: Usuario no encontrado - NIT: {nit}, Usuario: {username}")
                    return Response({
                        'error': 'Credenciales inválidas para PSS/PTS',
                        'code': 'INVALID_PSS_CREDENTIALS'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                    
            else:  # EPS
                # Para EPS: solo usuario
                user = User.objects.filter(
                    username=username,
                    user_type='EPS',
                    is_active=True,
                    status='AC'
                ).first()
                
                if not user:
                    logger.warning(f"Login EPS fallido: Usuario no encontrado - Usuario: {username}")
                    return Response({
                        'error': 'Credenciales inválidas para EPS',
                        'code': 'INVALID_EPS_CREDENTIALS'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Verificar contraseña
            if not user.check_password(password):
                logger.warning(f"Login fallido: Contraseña incorrecta - Usuario: {username}")
                return Response({
                    'error': 'Credenciales inválidas',
                    'code': 'INVALID_PASSWORD'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Agregar claims personalizados
            access_token['user_type'] = user.user_type
            access_token['role'] = user.role
            access_token['nit'] = user.nit if user.is_pss_user else None
            access_token['full_name'] = user.get_full_name()
            
            # Crear sesión
            session = UserSession.create_session(
                user=user,
                ip_address=self.get_client_ip(request),
                device_info={
                    'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                    'accept_language': request.META.get('HTTP_ACCEPT_LANGUAGE', ''),
                }
            )
            
            # Actualizar último login
            user.update_last_login()
            
            # Respuesta exitosa
            response_data = {
                'access': str(access_token),
                'refresh': str(refresh),
                'user': {
                    'id': str(user.id),
                    'username': user.username,
                    'user_type': user.user_type,
                    'role': user.role,
                    'full_name': user.get_full_name(),
                    'email': user.email,
                    'nit': user.nit if user.is_pss_user else None,
                    'pss_name': user.pss_name if user.is_pss_user else None,
                    'permissions': self.get_user_permissions(user),
                    'session_id': str(session.id)
                },
                'expires_in': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
            }
            
            logger.info(f"Login exitoso - Usuario: {username}, Tipo: {user_type}, IP: {self.get_client_ip(request)}")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en login - Usuario: {username}, Error: {str(e)}")
            return Response({
                'error': 'Error interno del servidor',
                'code': 'INTERNAL_ERROR'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        """Obtiene la IP del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def get_user_permissions(self, user):
        """Obtiene los permisos del usuario según su rol"""
        role_permissions = {
            'ADMIN': ['*'],
            'COORDINADOR_AUDITORIA': ['view_dashboard', 'assign_audits', 'view_reports', 'manage_auditors'],
            'AUDITOR_MEDICO': ['audit_medical', 'create_glosas', 'view_assigned', 'medical_review'],
            'AUDITOR_ADMINISTRATIVO': ['audit_admin', 'create_glosas', 'view_assigned', 'admin_review'],
            'CONCILIADOR': ['manage_conciliation', 'view_glosas', 'conciliation_meetings'],
            'CONTABILIDAD': ['view_financial', 'export_reports', 'manage_payments', 'financial_reports'],
            'RADICADOR': ['create_radicacion', 'upload_documents', 'view_own', 'manage_submissions'],
        }
        return role_permissions.get(user.role, [])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Cerrar sesión y invalidar token
    """
    try:
        # Obtener el token del header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
            # Invalidar sesión activa
            sessions = UserSession.objects.filter(
                user=request.user,
                is_active=True
            )
            sessions.update(is_active=False)
            
            logger.info(f"Logout exitoso - Usuario: {request.user.username}")
            return Response({
                'message': 'Sesión cerrada exitosamente'
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        logger.error(f"Error en logout - Usuario: {request.user.username if hasattr(request, 'user') else 'Desconocido'}, Error: {str(e)}")
        
    return Response({
        'message': 'Sesión cerrada'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Obtiene el perfil del usuario autenticado
    """
    try:
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error obteniendo perfil - Usuario: {request.user.username}, Error: {str(e)}")
        return Response({
            'error': 'Error obteniendo perfil de usuario'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Cambiar contraseña del usuario
    """
    current_password = request.data.get('current_password', '')
    new_password = request.data.get('new_password', '')
    
    if not current_password or not new_password:
        return Response({
            'error': 'Contraseña actual y nueva son obligatorias'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar contraseña actual
    if not request.user.check_password(current_password):
        return Response({
            'error': 'Contraseña actual incorrecta'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar nueva contraseña (mínimo 8 caracteres)
    if len(new_password) < 8:
        return Response({
            'error': 'La nueva contraseña debe tener al menos 8 caracteres'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Cambiar contraseña
        request.user.set_password(new_password)
        request.user.save()
        
        # Invalidar todas las sesiones activas
        UserSession.objects.filter(
            user=request.user,
            is_active=True
        ).update(is_active=False)
        
        logger.info(f"Contraseña cambiada - Usuario: {request.user.username}")
        return Response({
            'message': 'Contraseña cambiada exitosamente'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error cambiando contraseña - Usuario: {request.user.username}, Error: {str(e)}")
        return Response({
            'error': 'Error cambiando contraseña'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_token_view(request):
    """
    Validar si el token JWT es válido
    """
    try:
        return Response({
            'valid': True,
            'user': {
                'id': str(request.user.id),
                'username': request.user.username,
                'user_type': request.user.user_type,
                'role': request.user.role,
                'full_name': request.user.get_full_name()
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error validando token - Error: {str(e)}")
        return Response({
            'valid': False,
            'error': 'Token inválido'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    Refrescar token JWT
    """
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response({
            'error': 'Refresh token requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Validar y refrescar token
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        
        # Agregar claims personalizados
        user_id = refresh.payload.get('user_id')
        user = User.objects.get(id=user_id)
        
        access_token['user_type'] = user.user_type
        access_token['role'] = user.role
        access_token['nit'] = user.nit if user.is_pss_user else None
        access_token['full_name'] = user.get_full_name()
        
        return Response({
            'access': str(access_token)
        }, status=status.HTTP_200_OK)
        
    except TokenError as e:
        logger.warning(f"Token refresh fallido: {str(e)}")
        return Response({
            'error': 'Refresh token inválido o expirado'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({
            'error': 'Usuario no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error refrescando token: {str(e)}")
        return Response({
            'error': 'Error interno del servidor'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)