# -*- coding: utf-8 -*-
# apps/contratacion/utils.py

from django.db.models import Q
from .models import Prestador

def buscar_prestador_por_nit(nit_busqueda):
    """
    Busca un prestador por NIT, manejando casos con y sin dígito de verificación
    
    Args:
        nit_busqueda: NIT a buscar (puede o no incluir dígito de verificación)
    
    Returns:
        Prestador object o None
    """
    if not nit_busqueda:
        return None
    
    # Limpiar el NIT de entrada
    nit_limpio = str(nit_busqueda).strip()
    
    # Construir query para buscar
    query = Q(nit=nit_limpio)
    
    # Si el NIT no tiene guión, también buscar con posibles dígitos de verificación
    if '-' not in nit_limpio:
        query |= Q(nit__startswith=f"{nit_limpio}-")
    else:
        # Si tiene guión, también buscar sin él
        nit_sin_dv = nit_limpio.split('-')[0]
        query |= Q(nit=nit_sin_dv)
    
    try:
        return Prestador.objects.get(query)
    except Prestador.DoesNotExist:
        return None
    except Prestador.MultipleObjectsReturned:
        # Si hay múltiples, devolver el que tenga dígito de verificación
        return Prestador.objects.filter(query).filter(nit__contains='-').first()

def normalizar_nit(nit, digito_verificacion=None):
    """
    Normaliza un NIT al formato estándar con dígito de verificación
    
    Args:
        nit: NIT base
        digito_verificacion: Dígito de verificación (opcional)
    
    Returns:
        NIT normalizado (con guión si tiene DV)
    """
    nit_limpio = str(nit).strip().replace('"', '').replace("'", '')
    
    if digito_verificacion and str(digito_verificacion).strip() not in ['', 'nan', 'None']:
        dv_limpio = str(digito_verificacion).strip().replace('"', '').replace("'", '')
        return f"{nit_limpio}-{dv_limpio}"
    
    return nit_limpio