# -*- coding: utf-8 -*-
"""
Validadores compartidos para NeurAudit Colombia
Cumplimiento Resolución 2284 de 2023
"""

from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
import re
from datetime import datetime, timedelta
from typing import Any, Dict

# Validadores de identificación colombiana
nit_validator = RegexValidator(
    regex=r'^\d{9}-\d$',
    message='NIT debe tener formato: 123456789-0'
)

cedula_validator = RegexValidator(
    regex=r'^\d{6,12}$',
    message='Cédula debe tener entre 6 y 12 dígitos'
)

# Validador de código de habilitación
codigo_habilitacion_validator = RegexValidator(
    regex=r'^\d{12}$',
    message='Código de habilitación debe tener 12 dígitos'
)


def validar_nit_dv(nit_completo: str) -> bool:
    """
    Valida el dígito de verificación del NIT
    """
    if not re.match(r'^\d{9}-\d$', nit_completo):
        return False
    
    nit, dv = nit_completo.split('-')
    
    # Algoritmo de validación DV Colombia
    vpri = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3]
    suma = 0
    
    for i in range(len(nit)):
        suma += int(nit[i]) * vpri[i]
    
    residuo = suma % 11
    
    if residuo == 0 or residuo == 1:
        dv_calculado = residuo
    else:
        dv_calculado = 11 - residuo
    
    return str(dv_calculado) == dv


def validar_fecha_radicacion(fecha_factura: datetime, fecha_radicacion: datetime) -> None:
    """
    Valida que la radicación esté dentro de los 22 días hábiles
    según Resolución 2284 de 2023
    """
    # Calcular días hábiles (aproximado, sin festivos)
    dias_transcurridos = 0
    fecha_actual = fecha_factura
    
    while fecha_actual < fecha_radicacion:
        if fecha_actual.weekday() < 5:  # Lunes a Viernes
            dias_transcurridos += 1
        fecha_actual += timedelta(days=1)
    
    if dias_transcurridos > 22:
        raise ValidationError(
            f'La radicación excede los 22 días hábiles permitidos. '
            f'Han transcurrido {dias_transcurridos} días hábiles.'
        )


def validar_valor_glosa(valor_servicio: float, valor_glosa: float) -> None:
    """
    Valida que el valor de la glosa no exceda el valor del servicio
    """
    if valor_glosa > valor_servicio:
        raise ValidationError(
            f'El valor de la glosa (${valor_glosa:,.0f}) no puede ser mayor '
            f'al valor del servicio (${valor_servicio:,.0f})'
        )
    
    if valor_glosa <= 0:
        raise ValidationError('El valor de la glosa debe ser mayor a cero')


def validar_codigo_cups(codigo: str) -> None:
    """
    Valida formato de código CUPS
    """
    if not re.match(r'^\d{6}$', codigo):
        raise ValidationError(
            f'Código CUPS "{codigo}" debe tener 6 dígitos'
        )


def validar_codigo_cum(codigo: str) -> None:
    """
    Valida formato de código CUM (medicamentos)
    """
    # CUM puede tener diferentes formatos
    if not re.match(r'^[A-Z0-9]{5,20}$', codigo.upper()):
        raise ValidationError(
            f'Código CUM "{codigo}" tiene formato inválido'
        )


def validar_codigo_glosa(codigo: str) -> Dict[str, str]:
    """
    Valida y descompone un código de glosa según Resolución 2284
    Retorna tipo y subcódigo
    """
    if not re.match(r'^[A-Z]{2}\d{4}$', codigo):
        raise ValidationError(
            f'Código de glosa "{codigo}" debe tener formato: AA0000'
        )
    
    tipo = codigo[:2]
    subcodigo = codigo[2:]
    
    tipos_validos = ['FA', 'TA', 'SO', 'AU', 'CO', 'CL', 'SA']
    
    if tipo not in tipos_validos:
        raise ValidationError(
            f'Tipo de glosa "{tipo}" no válido. '
            f'Debe ser uno de: {", ".join(tipos_validos)}'
        )
    
    return {
        'tipo': tipo,
        'subcodigo': subcodigo,
        'codigo_completo': codigo
    }


def validar_tipo_documento(tipo: str) -> None:
    """
    Valida tipos de documento según RIPS
    """
    tipos_validos = [
        'CC',  # Cédula de ciudadanía
        'CE',  # Cédula de extranjería
        'PA',  # Pasaporte
        'RC',  # Registro civil
        'TI',  # Tarjeta de identidad
        'AS',  # Adulto sin identificación
        'MS',  # Menor sin identificación
        'NU',  # Número único de identificación
        'PE',  # Permiso especial de permanencia
        'CN',  # Certificado de nacido vivo
    ]
    
    if tipo not in tipos_validos:
        raise ValidationError(
            f'Tipo de documento "{tipo}" no válido. '
            f'Debe ser uno de: {", ".join(tipos_validos)}'
        )


def validar_modalidad_contratacion(modalidad: str) -> None:
    """
    Valida modalidades de contratación
    """
    modalidades_validas = [
        'CAPITACION',
        'EVENTO',
        'PAQUETE',
        'PGP',  # Pago Global Prospectivo
        'CASO',
        'MIXTA'
    ]
    
    if modalidad not in modalidades_validas:
        raise ValidationError(
            f'Modalidad "{modalidad}" no válida. '
            f'Debe ser una de: {", ".join(modalidades_validas)}'
        )


def validar_porcentaje(valor: float, campo: str = 'Porcentaje') -> None:
    """
    Valida que un valor esté entre 0 y 100
    """
    if not 0 <= valor <= 100:
        raise ValidationError(
            f'{campo} debe estar entre 0 y 100. Valor recibido: {valor}'
        )


def validar_archivo_xml(contenido: str) -> Dict[str, Any]:
    """
    Valida estructura básica de factura electrónica XML
    """
    import xml.etree.ElementTree as ET
    
    try:
        root = ET.fromstring(contenido)
        
        # Validar namespace DIAN
        if 'dian' not in root.tag.lower() and 'invoice' not in root.tag.lower():
            raise ValidationError('XML no parece ser una factura electrónica válida')
        
        # Buscar elementos requeridos
        elementos_requeridos = {
            'numero_factura': './/cbc:ID',
            'fecha_emision': './/cbc:IssueDate',
            'nit_emisor': './/cac:AccountingSupplierParty//cbc:CompanyID',
            'valor_total': './/cbc:TaxInclusiveAmount'
        }
        
        datos = {}
        namespaces = {
            'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
            'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2'
        }
        
        for campo, xpath in elementos_requeridos.items():
            elemento = root.find(xpath, namespaces)
            if elemento is None:
                raise ValidationError(f'Elemento requerido no encontrado: {campo}')
            datos[campo] = elemento.text
        
        return datos
        
    except ET.ParseError as e:
        raise ValidationError(f'Error parseando XML: {str(e)}')
    except Exception as e:
        raise ValidationError(f'Error validando XML: {str(e)}')


def validar_json_rips(contenido: Dict) -> None:
    """
    Valida estructura JSON de RIPS según especificación MinSalud
    """
    campos_requeridos = [
        'numFactura',
        'codPrestador',
        'tipoFactura',
        'usuarios'
    ]
    
    for campo in campos_requeridos:
        if campo not in contenido:
            raise ValidationError(f'Campo requerido "{campo}" no encontrado en RIPS')
    
    # Validar que haya al menos un usuario
    if not contenido.get('usuarios') or len(contenido['usuarios']) == 0:
        raise ValidationError('RIPS debe contener al menos un usuario')
    
    # Validar estructura de usuarios
    for idx, usuario in enumerate(contenido['usuarios']):
        campos_usuario = [
            'tipoDocumentoIdentificacion',
            'numDocumentoIdentificacion',
            'tipoUsuario'
        ]
        
        for campo in campos_usuario:
            if campo not in usuario:
                raise ValidationError(
                    f'Usuario {idx + 1}: Campo requerido "{campo}" no encontrado'
                )