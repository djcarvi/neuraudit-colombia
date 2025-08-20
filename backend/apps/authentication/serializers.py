"""
Serializers para Autenticación - NeurAudit Colombia
Sistema de autenticación PSS/PTS + EPS según Resolución 2284 de 2023
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UserSession


class UserLoginSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para login con soporte PSS/PTS + EPS
    """
    user_type = serializers.ChoiceField(choices=['eps', 'pss'], default='eps')
    nit = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    class Meta:
        fields = ('username', 'password', 'user_type', 'nit')
    
    def validate(self, attrs):
        user_type = attrs.get('user_type', 'eps')
        nit = attrs.get('nit', '')
        
        # Validar NIT para PSS
        if user_type == 'pss' and not nit:
            raise serializers.ValidationError({
                'nit': 'El NIT del prestador es obligatorio para usuarios PSS/PTS'
            })
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para el perfil de usuario
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    user_type_display = serializers.CharField(source='get_user_type_display', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_pss_user = serializers.BooleanField(read_only=True)
    is_eps_user = serializers.BooleanField(read_only=True)
    can_audit = serializers.BooleanField(read_only=True)
    can_radicate = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'nit', 'document_type', 'document_number',
            'user_type', 'user_type_display', 'role', 'role_display',
            'status', 'status_display', 'is_active', 'is_staff', 'is_superuser',
            'pss_code', 'pss_name', 'habilitacion_number', 'perfil_auditoria',
            'created_at', 'updated_at', 'last_login',
            'is_pss_user', 'is_eps_user', 'can_audit', 'can_radicate'
        ]
        read_only_fields = [
            'id', 'username', 'created_at', 'updated_at', 'last_login',
            'full_name', 'user_type_display', 'role_display', 'status_display',
            'is_pss_user', 'is_eps_user', 'can_audit', 'can_radicate'
        ]


class UserSessionSerializer(serializers.ModelSerializer):
    """
    Serializer para sesiones de usuario
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'user_username', 'user_full_name',
            'session_token', 'device_info', 'ip_address',
            'created_at', 'expires_at', 'last_activity',
            'is_active', 'is_expired'
        ]
        read_only_fields = [
            'id', 'session_token', 'created_at', 'last_activity',
            'user_username', 'user_full_name', 'is_expired'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer para cambio de contraseña
    """
    current_password = serializers.CharField(max_length=128, write_only=True)
    new_password = serializers.CharField(max_length=128, write_only=True)
    confirm_password = serializers.CharField(max_length=128, write_only=True)
    
    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        if new_password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': 'Las contraseñas no coinciden'
            })
        
        if len(new_password) < 8:
            raise serializers.ValidationError({
                'new_password': 'La contraseña debe tener al menos 8 caracteres'
            })
        
        return attrs


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear usuarios (solo administradores)
    """
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'confirm_password',
            'first_name', 'last_name', 'phone', 'nit',
            'document_type', 'document_number', 'user_type', 'role',
            'pss_code', 'pss_name', 'habilitacion_number', 'perfil_auditoria'
        ]
    
    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        user_type = attrs.get('user_type')
        role = attrs.get('role')
        nit = attrs.get('nit')
        
        # Validar contraseñas
        if password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': 'Las contraseñas no coinciden'
            })
        
        # Validar NIT para PSS/PTS
        if user_type in ['PSS', 'PTS'] and not nit:
            raise serializers.ValidationError({
                'nit': 'El NIT es obligatorio para usuarios PSS/PTS'
            })
        
        # Validar rol según tipo de usuario
        pss_roles = ['RADICADOR']
        eps_roles = ['AUDITOR_MEDICO', 'AUDITOR_ADMINISTRATIVO', 'COORDINADOR_AUDITORIA', 
                    'CONCILIADOR', 'CONTABILIDAD', 'ADMIN']
        
        if user_type in ['PSS', 'PTS'] and role not in pss_roles:
            raise serializers.ValidationError({
                'role': f'Rol inválido para usuario {user_type}. Roles válidos: {pss_roles}'
            })
        
        if user_type == 'EPS' and role not in eps_roles:
            raise serializers.ValidationError({
                'role': f'Rol inválido para usuario EPS. Roles válidos: {eps_roles}'
            })
        
        return attrs
    
    def create(self, validated_data):
        # Remover confirm_password del validated_data
        validated_data.pop('confirm_password', None)
        
        # Crear usuario
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        return user