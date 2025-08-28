# -*- coding: utf-8 -*-
"""
Vistas de autenticación NoSQL - NeurAudit Colombia
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .services_auth_nosql import AuthenticationServiceNoSQL
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# Instancia del servicio
auth_service = AuthenticationServiceNoSQL()

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_view(request):
    """
    Login de usuarios EPS y PSS
    """
    try:
        user_type = request.data.get('user_type', '').upper()
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        nit = request.data.get('nit', '')
        
        # Obtener información del cliente
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0] or request.META.get('REMOTE_ADDR', '')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # Construir credenciales
        credenciales = {
            'username': username,
            'password': password
        }
        
        if user_type == 'PSS' and nit:
            credenciales['nit'] = nit
            
        # Autenticar
        success, mensaje, sesion_data = auth_service.autenticar_usuario(
            credenciales, ip_address, user_agent
        )
        
        if success and sesion_data:
            # Transformar respuesta al formato esperado por el frontend
            response_data = {
                'access': sesion_data['access_token'],
                'refresh': sesion_data['refresh_token'],
                'expires_in': sesion_data['expires_in'],
                'user': {
                    'id': sesion_data['usuario']['id'],
                    'username': sesion_data['usuario']['username'],
                    'user_type': sesion_data['usuario']['tipo_usuario'],
                    'role': sesion_data['usuario']['perfil'],
                    'full_name': sesion_data['usuario']['nombre_completo'],
                    'email': sesion_data['usuario']['email'],
                    'nit': sesion_data['usuario']['datos_pss']['nit'] if sesion_data['usuario']['datos_pss'] else None,
                    'pss_name': sesion_data['usuario']['datos_pss']['razon_social'] if sesion_data['usuario']['datos_pss'] else None,
                    'permissions': sesion_data['usuario']['permisos'],
                    'session_id': str(ObjectId())  # Generar ID de sesión
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': mensaje, 'code': 'INVALID_CREDENTIALS'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    """
    Login con Google OAuth
    """
    try:
        google_token = request.data.get('google_token', '')
        
        if not google_token:
            return Response(
                {'error': 'Token de Google requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Por ahora retornar no implementado
        return Response(
            {'error': 'Login con Google no disponible aún'},
            status=status.HTTP_501_NOT_IMPLEMENTED
        )
        
    except Exception as e:
        logger.error(f"Error en Google login: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Cerrar sesión
    """
    try:
        # Obtener token del header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        token = auth_header.split(' ')[-1] if auth_header else ''
        
        # Obtener usuario del request (agregado por el middleware JWT)
        usuario_id = ObjectId(request.user.id) if hasattr(request, 'user') else None
        
        if token and usuario_id:
            auth_service.cerrar_sesion(token, usuario_id)
        
        return Response(
            {'message': 'Sesión cerrada exitosamente'},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        logger.error(f"Error en logout: {str(e)}")
        return Response(
            {'error': 'Error al cerrar sesión'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_token_view(request):
    """
    Validar si el token es válido
    """
    try:
        return Response(
            {
                'valid': True,
                'user_id': str(request.user.id),
                'username': request.user.username
            },
            status=status.HTTP_200_OK
        )
    except Exception:
        return Response(
            {'valid': False},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    Renovar access token con refresh token
    """
    try:
        refresh_token = request.data.get('refresh', '')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        success, mensaje, nueva_sesion = auth_service.renovar_token(refresh_token)
        
        if success and nueva_sesion:
            return Response(
                {'access': nueva_sesion['access_token']},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': mensaje},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        logger.error(f"Error renovando token: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password_view(request):
    """
    Cambiar contraseña del usuario
    """
    try:
        password_actual = request.data.get('password_actual', '')
        password_nuevo = request.data.get('password_nuevo', '')
        confirmacion = request.data.get('confirmacion_password', '')
        
        # Validaciones básicas
        if not all([password_actual, password_nuevo, confirmacion]):
            return Response(
                {'error': 'Todos los campos son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if password_nuevo != confirmacion:
            return Response(
                {'error': 'Las contraseñas no coinciden'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar contraseña
        usuario_id = ObjectId(request.user.id)
        success, mensaje = auth_service.cambiar_password(
            usuario_id, password_actual, password_nuevo
        )
        
        if success:
            return Response(
                {'message': mensaje},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': mensaje},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        logger.error(f"Error cambiando contraseña: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil_usuario_view(request):
    """
    Obtener perfil del usuario actual
    """
    try:
        usuario_id = ObjectId(request.user.id)
        
        # Obtener usuario desde MongoDB
        usuario = auth_service.usuarios.find_one({"_id": usuario_id})
        
        if not usuario:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener perfil/permisos
        perfil = auth_service.perfiles_permisos.find_one({"_id": usuario["perfil"]})
        
        response_data = {
            'id': str(usuario['_id']),
            'username': usuario['username'],
            'email': usuario['email'],
            'tipo_usuario': usuario['tipo_usuario'],
            'perfil': usuario['perfil'],
            'datos_personales': usuario['datos_personales'],
            'configuracion': usuario['configuracion'],
            'permisos': perfil['permisos'] if perfil else [],
            'modulos': perfil['modulos'] if perfil else [],
            'ultimo_acceso': usuario['metadata']['ultimo_acceso']
        }
        
        # Agregar datos PSS si aplica
        if usuario['tipo_usuario'] in ['PSS', 'PTS']:
            response_data['datos_pss'] = usuario.get('datos_pss', {})
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error obteniendo perfil: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def actualizar_perfil_view(request):
    """
    Actualizar perfil del usuario
    """
    try:
        usuario_id = ObjectId(request.user.id)
        datos_actualizacion = request.data
        
        success, mensaje = auth_service.actualizar_perfil_usuario(
            usuario_id, datos_actualizacion
        )
        
        if success:
            # Obtener usuario actualizado
            usuario = auth_service.usuarios.find_one({"_id": usuario_id})
            
            return Response(
                {
                    'message': mensaje,
                    'usuario': {
                        'datos_personales': usuario['datos_personales'],
                        'configuracion': usuario['configuracion']
                    }
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': mensaje},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        logger.error(f"Error actualizando perfil: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sesiones_activas_view(request):
    """
    Obtener sesiones activas del usuario
    """
    try:
        usuario_id = ObjectId(request.user.id)
        sesiones = auth_service.obtener_sesiones_activas(usuario_id)
        
        return Response(
            {'sesiones': sesiones},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        logger.error(f"Error obteniendo sesiones: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cerrar_todas_sesiones_view(request):
    """
    Cerrar todas las sesiones excepto la actual
    """
    try:
        usuario_id = ObjectId(request.user.id)
        
        # Obtener token actual
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        token_actual = auth_header.split(' ')[-1] if auth_header else ''
        
        cantidad = auth_service.cerrar_todas_sesiones(usuario_id, token_actual)
        
        return Response(
            {
                'message': f'{cantidad} sesiones cerradas exitosamente',
                'sesiones_cerradas': cantidad
            },
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        logger.error(f"Error cerrando sesiones: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def perfiles_disponibles_view(request):
    """
    Obtener perfiles disponibles para registro
    """
    try:
        tipo_usuario = request.GET.get('tipo_usuario', '').upper()
        
        query = {}
        if tipo_usuario in ['EPS', 'PSS', 'PTS']:
            query['tipo_usuario'] = tipo_usuario
        
        perfiles = list(auth_service.perfiles_permisos.find(
            query,
            {'password': 0}  # Excluir campos sensibles
        ))
        
        # Convertir ObjectId a string
        for perfil in perfiles:
            perfil['_id'] = str(perfil['_id'])
        
        return Response(perfiles, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error obteniendo perfiles: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# URLs para desarrollo - Crear usuarios de prueba
@api_view(['POST'])
@permission_classes([AllowAny])
def crear_usuarios_prueba_view(request):
    """
    Crear usuarios de prueba para desarrollo
    Solo disponible en DEBUG=True
    """
    from django.conf import settings
    
    if not settings.DEBUG:
        return Response(
            {'error': 'No disponible en producción'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        usuarios_creados = []
        
        # Usuario superadmin EPS
        success, mensaje, user_id = auth_service.registrar_usuario({
            'username': 'admin.superuser',
            'email': 'admin@neuraudit.co',
            'password': 'AdminNeuraudit2025',
            'tipo_usuario': 'EPS',
            'perfil': 'SUPERADMIN',
            'nombres': 'Administrador',
            'apellidos': 'Sistema',
            'tipo_documento': 'CC',
            'numero_documento': '1234567890',
            'telefono': '3001234567',
            'cargo': 'Administrador del Sistema'
        })
        
        if success:
            usuarios_creados.append({'username': 'admin.superuser', 'tipo': 'EPS', 'perfil': 'SUPERADMIN'})
        
        # Coordinador de auditoría
        success, mensaje, user_id = auth_service.registrar_usuario({
            'username': 'coordinador.auditoria',
            'email': 'coordinador@neuraudit.co',
            'password': 'CoordinadorNA2025',
            'tipo_usuario': 'EPS',
            'perfil': 'COORDINADOR_AUDITORIA',
            'nombres': 'María',
            'apellidos': 'Rodríguez',
            'tipo_documento': 'CC',
            'numero_documento': '52123456',
            'telefono': '3012345678',
            'cargo': 'Coordinadora de Auditoría'
        })
        
        if success:
            usuarios_creados.append({'username': 'coordinador.auditoria', 'tipo': 'EPS', 'perfil': 'COORDINADOR_AUDITORIA'})
        
        # Auditor médico
        success, mensaje, user_id = auth_service.registrar_usuario({
            'username': 'auditor.medico1',
            'email': 'auditor.medico@neuraudit.co',
            'password': 'AuditorMedico2025',
            'tipo_usuario': 'EPS',
            'perfil': 'AUDITOR_MEDICO',
            'nombres': 'Carlos',
            'apellidos': 'Martínez',
            'tipo_documento': 'CC',
            'numero_documento': '79456789',
            'telefono': '3023456789',
            'cargo': 'Auditor Médico Senior'
        })
        
        if success:
            usuarios_creados.append({'username': 'auditor.medico1', 'tipo': 'EPS', 'perfil': 'AUDITOR_MEDICO'})
        
        # Radicador PSS
        success, mensaje, user_id = auth_service.registrar_usuario({
            'username': 'radicador.clinica1',
            'email': 'radicador@clinicaejemplo.co',
            'password': 'RadicadorPSS2025',
            'tipo_usuario': 'PSS',
            'perfil': 'RADICADOR',
            'nombres': 'Ana',
            'apellidos': 'Gómez',
            'tipo_documento': 'CC',
            'numero_documento': '1053456789',
            'telefono': '3034567890',
            'cargo': 'Auxiliar de Facturación',
            'nit': '900100200-1',
            'razon_social': 'Clínica Ejemplo S.A.S',
            'codigo_habilitacion': '110010123456',
            'direccion': 'Calle 100 # 15-20',
            'ciudad': 'Bogotá',
            'departamento': 'Cundinamarca'
        })
        
        if success:
            usuarios_creados.append({'username': 'radicador.clinica1', 'tipo': 'PSS', 'perfil': 'RADICADOR', 'nit': '900100200-1'})
        
        return Response(
            {
                'message': 'Usuarios de prueba creados',
                'usuarios': usuarios_creados
            },
            status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        logger.error(f"Error creando usuarios de prueba: {str(e)}")
        return Response(
            {'error': 'Error creando usuarios de prueba'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )