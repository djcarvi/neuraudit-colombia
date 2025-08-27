# -*- coding: utf-8 -*-
# apps/catalogs/serializers_tarifarios.py

from rest_framework import serializers
from .models import TarifarioISS2001, TarifarioSOAT2025

class TarifarioISS2001Serializer(serializers.ModelSerializer):
    """Serializer para tarifarios oficiales ISS 2001"""
    
    id = serializers.ReadOnlyField()
    valor_referencia_actual = serializers.ReadOnlyField()
    
    class Meta:
        model = TarifarioISS2001
        fields = [
            'id', 'codigo', 'descripcion', 'tipo', 'uvr', 
            'valor_uvr_2001', 'valor_calculado', 'valor_referencia_actual',
            'seccion_manual', 'capitulo', 'grupo_quirurgico',
            'contratos_activos', 'valor_promedio_negociado', 'uso_frecuente',
            'manual_version', 'fecha_extraccion', 'created_at', 'updated_at'
        ]

class TarifarioSOAT2025Serializer(serializers.ModelSerializer):
    """Serializer para tarifarios oficiales SOAT 2025"""
    
    id = serializers.ReadOnlyField()
    valor_referencia_actual = serializers.ReadOnlyField()
    
    class Meta:
        model = TarifarioSOAT2025
        fields = [
            'id', 'codigo', 'descripcion', 'tipo', 'grupo_quirurgico',
            'uvb', 'valor_2025_uvb', 'valor_calculado', 'valor_referencia_actual',
            'seccion_manual', 'tabla_origen', 'capitulo', 'estructura_tabla',
            'contratos_activos', 'valor_promedio_negociado', 'uso_frecuente',
            'manual_version', 'fecha_extraccion', 'created_at', 'updated_at'
        ]

class TarifarioISS2001ListSerializer(serializers.ModelSerializer):
    """Serializer optimizado para listados ISS 2001"""
    
    id = serializers.ReadOnlyField()
    valor_referencia_actual = serializers.ReadOnlyField()
    
    class Meta:
        model = TarifarioISS2001
        fields = [
            'id', 'codigo', 'descripcion', 'tipo', 'uvr', 
            'valor_uvr_2001', 'valor_calculado', 'valor_referencia_actual',
            'contratos_activos', 'uso_frecuente'
        ]

class TarifarioSOAT2025ListSerializer(serializers.ModelSerializer):
    """Serializer optimizado para listados SOAT 2025"""
    
    id = serializers.ReadOnlyField()
    valor_referencia_actual = serializers.ReadOnlyField()
    
    class Meta:
        model = TarifarioSOAT2025
        fields = [
            'id', 'codigo', 'descripcion', 'tipo', 'grupo_quirurgico',
            'valor_2025_uvb', 'valor_calculado', 'valor_referencia_actual',
            'seccion_manual', 'contratos_activos', 'uso_frecuente'
        ]