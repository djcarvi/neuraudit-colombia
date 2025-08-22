"""
Clasificador de Soportes según Resolución 2284 de 2023
NeurAudit Colombia - Sistema de Auditoría Médica

Este módulo procesa y clasifica los soportes documentales según la 
nomenclatura oficial establecida en la Resolución 2284/2023 del MinSalud.

Formato oficial: CÓDIGO_NIT_FACTURA.pdf
- CÓDIGO: 3 letras identificadoras del tipo de soporte (TNA, HEV, EPI, etc.)
- NIT: NIT del prestador (longitud variable)
- FACTURA: Número de factura completo incluyendo prefijos (ej: A01E5687, FE-123, etc.)

Formato multiusuario: CÓDIGO_NIT_FACTURA_tipoDoc_numeroDoc.pdf
- Incluye tipo y número de documento del usuario para soportes específicos

Autor: Analítica Neuronal
Fecha: 21 Agosto 2025
"""

import re
from typing import Dict, Tuple, Optional, List
from dataclasses import dataclass
from datetime import datetime


@dataclass
class SoporteInfo:
    """Información extraída de un soporte"""
    codigo: str
    categoria: str
    nombre: str
    numero_factura: str
    identificador: str
    es_multiusuario: bool
    tipo_documento_usuario: Optional[str] = None
    numero_documento_usuario: Optional[str] = None
    nomenclatura_valida: bool = True
    errores: List[str] = None


# Diccionario oficial de códigos según Resolución 2284/2023
CODIGOS_SOPORTES = {
    # DOCUMENTOS BÁSICOS
    'XML': {
        'nombre': 'Factura de venta en salud',
        'categoria': 'DOCUMENTOS_BASICOS',
        'formato': 'XML',
        'obligatorio': True
    },
    'RIPS': {
        'nombre': 'Registro Individual de Prestación de Servicios',
        'categoria': 'DOCUMENTOS_BASICOS',
        'formato': 'JSON',
        'obligatorio': True
    },
    
    # REGISTROS MÉDICOS
    'HEV': {
        'nombre': 'Resumen de atención u hoja de evolución',
        'categoria': 'REGISTROS_MEDICOS',
        'formato': 'PDF',
        'obligatorio_en': ['AMBULATORIO']
    },
    'EPI': {
        'nombre': 'Epicrisis',
        'categoria': 'REGISTROS_MEDICOS',
        'formato': 'PDF',
        'obligatorio_en': ['URGENCIAS', 'HOSPITALIZACION', 'CIRUGIA']
    },
    'HAU': {
        'nombre': 'Hoja de atención de urgencia',
        'categoria': 'REGISTROS_MEDICOS',
        'formato': 'PDF',
        'obligatorio_en': ['URGENCIAS']
    },
    'HAO': {
        'nombre': 'Hoja de atención odontológica',
        'categoria': 'REGISTROS_MEDICOS',
        'formato': 'PDF',
        'obligatorio_en': ['ODONTOLOGIA']
    },
    
    # PROCEDIMIENTOS
    'PDX': {
        'nombre': 'Resultado de procedimientos de apoyo diagnóstico',
        'categoria': 'PROCEDIMIENTOS',
        'formato': 'PDF',
        'obligatorio_en': ['APOYO_DIAGNOSTICO', 'URGENCIAS', 'HOSPITALIZACION']
    },
    'DQX': {
        'nombre': 'Descripción quirúrgica',
        'categoria': 'PROCEDIMIENTOS',
        'formato': 'PDF',
        'obligatorio_en': ['CIRUGIA']
    },
    'RAN': {
        'nombre': 'Registro de anestesia',
        'categoria': 'PROCEDIMIENTOS',
        'formato': 'PDF',
        'obligatorio_en': ['CIRUGIA']
    },
    
    # MEDICAMENTOS
    'HAM': {
        'nombre': 'Hoja de administración de medicamentos',
        'categoria': 'MEDICAMENTOS',
        'formato': 'PDF',
        'obligatorio_en': ['MEDICAMENTOS', 'URGENCIAS', 'HOSPITALIZACION', 'TRANSPORTE']
    },
    'CRC': {
        'nombre': 'Comprobante de recibido del usuario',
        'categoria': 'MEDICAMENTOS',
        'formato': 'PDF',
        'obligatorio_en': ['MEDICAMENTOS', 'DISPOSITIVOS', 'TERAPIAS']
    },
    
    # TRANSPORTE
    'TAP': {
        'nombre': 'Traslado asistencial de pacientes',
        'categoria': 'TRANSPORTE',
        'formato': 'PDF',
        'obligatorio_en': ['TRANSPORTE']
    },
    'TNA': {
        'nombre': 'Transporte no asistencial ambulatorio',
        'categoria': 'TRANSPORTE',
        'formato': 'PDF',
        'obligatorio_en': ['TRANSPORTE']
    },
    
    # ÓRDENES Y PRESCRIPCIONES
    'OPF': {
        'nombre': 'Orden o prescripción facultativa',
        'categoria': 'ORDENES_PRESCRIPCIONES',
        'formato': 'PDF',
        'obligatorio_en': ['AMBULATORIO', 'MEDICAMENTOS', 'DISPOSITIVOS', 'ODONTOLOGIA', 
                          'APOYO_DIAGNOSTICO', 'TERAPIAS', 'HOSPITALIZACION', 'TRANSPORTE']
    },
    'LDP': {
        'nombre': 'Lista de precios',
        'categoria': 'ORDENES_PRESCRIPCIONES',
        'formato': 'PDF',
        'obligatorio_en': ['URGENCIAS']
    },
    
    # FACTURACIÓN ESPECIAL
    'FAT': {
        'nombre': 'Factura de venta por cobro a SOAT/ADRES',
        'categoria': 'FACTURACION_ESPECIAL',
        'formato': 'PDF',
        'obligatorio_en': ['URGENCIAS']
    },
    'FMO': {
        'nombre': 'Factura de venta del material de osteosíntesis',
        'categoria': 'FACTURACION_ESPECIAL',
        'formato': 'PDF',
        'obligatorio_en': []
    },
    
    # SOPORTES ADICIONALES
    'PDE': {
        'nombre': 'Evidencia del envío del PDEEI',
        'categoria': 'SOPORTES_ADICIONALES',
        'formato': 'PDF',
        'obligatorio_en': []
    }
}


# Categorías principales para agrupación visual
CATEGORIAS_PRINCIPALES = {
    'DOCUMENTOS_BASICOS': {
        'nombre': '📄 Documentos Básicos',
        'descripcion': 'Factura electrónica y RIPS',
        'orden': 1
    },
    'REGISTROS_MEDICOS': {
        'nombre': '🏥 Registros Médicos',
        'descripcion': 'Resúmenes de atención, epicrisis, hojas médicas',
        'orden': 2
    },
    'PROCEDIMIENTOS': {
        'nombre': '🔬 Procedimientos',
        'descripcion': 'Resultados diagnósticos, quirúrgicos, anestesia',
        'orden': 3
    },
    'MEDICAMENTOS': {
        'nombre': '💊 Medicamentos',
        'descripcion': 'Administración y recibido de medicamentos',
        'orden': 4
    },
    'TRANSPORTE': {
        'nombre': '🚑 Transporte',
        'descripcion': 'Traslados asistenciales y no asistenciales',
        'orden': 5
    },
    'ORDENES_PRESCRIPCIONES': {
        'nombre': '📋 Órdenes y Prescripciones',
        'descripcion': 'Órdenes médicas y listas de precios',
        'orden': 6
    },
    'FACTURACION_ESPECIAL': {
        'nombre': '💰 Facturación Especial',
        'descripcion': 'Facturas SOAT/ADRES y material de osteosíntesis',
        'orden': 7
    },
    'SOPORTES_ADICIONALES': {
        'nombre': '📎 Soportes Adicionales',
        'descripcion': 'Otros documentos de soporte',
        'orden': 8
    }
}


class SoporteClassifier:
    """Clasificador de soportes según Resolución 2284/2023"""
    
    # Patrón regex para nomenclatura oficial
    # Formato: CÓDIGO_NIT_FACTURA.pdf
    # Donde NIT puede tener longitud variable y FACTURA puede incluir prefijos
    PATTERN_NORMAL = re.compile(
        r'^([A-Z]{3})_(\d+)_([A-Z0-9\-]+)\.pdf$',
        re.IGNORECASE
    )
    
    # Patrón para formato multiusuario
    # Formato: CÓDIGO_NIT_FACTURA_tipoDoc_numeroDoc.pdf
    PATTERN_MULTIUSUARIO = re.compile(
        r'^([A-Z]{3})_(\d+)_([A-Z0-9\-]+)_([A-Z]{2,4})_(\d+)\.pdf$',
        re.IGNORECASE
    )
    
    def __init__(self):
        self.codigos = CODIGOS_SOPORTES
        self.categorias = CATEGORIAS_PRINCIPALES
    
    def parse_soporte_filename(self, filename: str) -> SoporteInfo:
        """
        Extrae información del nombre del archivo según nomenclatura oficial
        
        Args:
            filename: Nombre del archivo a parsear
            
        Returns:
            SoporteInfo con la información extraída
        """
        errores = []
        
        # Caso especial: Representación gráfica DIAN (solo número de factura.pdf)
        # Ejemplo: A01E5687.pdf, FE-1234.pdf, etc.
        factura_pattern = re.compile(r'^([A-Z0-9\-]+)\.pdf$', re.IGNORECASE)
        factura_match = factura_pattern.match(filename)
        if factura_match and not filename.count('_') >= 2:  # Asegurar que no es nomenclatura estándar
            numero_factura = factura_match.group(1)
            
            return SoporteInfo(
                codigo='XML',  # Considerarlo como representación gráfica de factura
                categoria='DOCUMENTOS_BASICOS',
                nombre='Representación gráfica de factura electrónica DIAN',
                numero_factura=numero_factura,
                identificador='DIAN',  # Identificador especial
                es_multiusuario=False,
                nomenclatura_valida=True,  # Es válido si coincide con número de factura
                errores=None
            )
        
        # Intentar primero formato multiusuario
        match_multi = self.PATTERN_MULTIUSUARIO.match(filename)
        if match_multi:
            codigo = match_multi.group(1).upper()
            nit_prestador = match_multi.group(2)
            numero_factura = match_multi.group(3)
            tipo_doc = match_multi.group(4).upper()
            numero_doc = match_multi.group(5)
            
            if codigo not in self.codigos:
                errores.append(f"Código de soporte '{codigo}' no reconocido")
            
            info_codigo = self.codigos.get(codigo, {})
            
            return SoporteInfo(
                codigo=codigo,
                categoria=info_codigo.get('categoria', 'DESCONOCIDO'),
                nombre=info_codigo.get('nombre', 'Soporte no clasificado'),
                numero_factura=numero_factura,
                identificador=nit_prestador,  # Usar NIT como identificador
                es_multiusuario=True,
                tipo_documento_usuario=tipo_doc,
                numero_documento_usuario=numero_doc,
                nomenclatura_valida=len(errores) == 0,
                errores=errores if errores else None
            )
        
        # Intentar formato normal
        match_normal = self.PATTERN_NORMAL.match(filename)
        if match_normal:
            codigo = match_normal.group(1).upper()
            nit_prestador = match_normal.group(2)
            numero_factura = match_normal.group(3)
            
            if codigo not in self.codigos:
                errores.append(f"Código de soporte '{codigo}' no reconocido")
            
            info_codigo = self.codigos.get(codigo, {})
            
            return SoporteInfo(
                codigo=codigo,
                categoria=info_codigo.get('categoria', 'DESCONOCIDO'),
                nombre=info_codigo.get('nombre', 'Soporte no clasificado'),
                numero_factura=numero_factura,
                identificador=nit_prestador,  # Usar NIT como identificador
                es_multiusuario=False,
                nomenclatura_valida=len(errores) == 0,
                errores=errores if errores else None
            )
        
        # Si no coincide con ningún patrón
        # Verificar si tiene espacios, guiones o texto adicional como "copia"
        if ' ' in filename or '- copia' in filename.lower() or 'copia' in filename.lower():
            errores.append(f"Nombre de archivo '{filename}' contiene espacios o texto adicional no permitido")
        else:
            errores.append(f"Nombre de archivo '{filename}' no cumple con nomenclatura oficial")
        
        # Intentar extraer al menos el código si existe
        codigo_match = re.match(r'^([A-Z]{3})_', filename, re.IGNORECASE)
        codigo = codigo_match.group(1).upper() if codigo_match else 'DESCONOCIDO'
        
        info_codigo = self.codigos.get(codigo, {})
        
        return SoporteInfo(
            codigo=codigo,
            categoria=info_codigo.get('categoria', 'DESCONOCIDO'),
            nombre=info_codigo.get('nombre', 'Soporte no clasificado'),
            numero_factura='',
            identificador='',
            es_multiusuario=False,
            nomenclatura_valida=False,
            errores=errores
        )
    
    def validate_nomenclatura(self, filename: str) -> Tuple[bool, List[str]]:
        """
        Valida si un nombre de archivo cumple con la nomenclatura oficial
        
        Args:
            filename: Nombre del archivo a validar
            
        Returns:
            Tupla (es_valido, lista_errores)
        """
        info = self.parse_soporte_filename(filename)
        return info.nomenclatura_valida, info.errores or []
    
    def classify_soporte_type(self, filename: str) -> Dict[str, any]:
        """
        Clasifica un soporte en categorías oficiales
        
        Args:
            filename: Nombre del archivo a clasificar
            
        Returns:
            Diccionario con información de clasificación
        """
        info = self.parse_soporte_filename(filename)
        
        return {
            'codigo': info.codigo,
            'categoria': info.categoria,
            'nombre': info.nombre,
            'categoria_info': self.categorias.get(info.categoria, {
                'nombre': '❓ Sin Categoría',
                'descripcion': 'Soporte no clasificado',
                'orden': 99
            }),
            'es_valido': info.nomenclatura_valida,
            'es_multiusuario': info.es_multiusuario,
            'numero_factura': info.numero_factura,
            'errores': info.errores
        }
    
    def detect_multiuser_format(self, filename: str) -> bool:
        """
        Detecta si un archivo usa formato multiusuario
        
        Args:
            filename: Nombre del archivo a verificar
            
        Returns:
            True si es formato multiusuario
        """
        info = self.parse_soporte_filename(filename)
        return info.es_multiusuario
    
    def get_soportes_obligatorios(self, tipo_servicio: str) -> List[str]:
        """
        Obtiene lista de soportes obligatorios para un tipo de servicio
        
        Args:
            tipo_servicio: Tipo de servicio (AMBULATORIO, URGENCIAS, etc.)
            
        Returns:
            Lista de códigos de soportes obligatorios
        """
        obligatorios = ['XML', 'RIPS']  # Siempre obligatorios
        
        for codigo, info in self.codigos.items():
            if tipo_servicio in info.get('obligatorio_en', []):
                obligatorios.append(codigo)
        
        return list(set(obligatorios))  # Eliminar duplicados
    
    def agrupar_por_categoria(self, soportes: List[Dict]) -> Dict[str, List]:
        """
        Agrupa una lista de soportes por categoría
        
        Args:
            soportes: Lista de diccionarios con información de soportes
            
        Returns:
            Diccionario agrupado por categoría
        """
        agrupados = {}
        
        for soporte in soportes:
            categoria = soporte.get('categoria', 'DESCONOCIDO')
            if categoria not in agrupados:
                agrupados[categoria] = []
            agrupados[categoria].append(soporte)
        
        # Ordenar categorías según orden definido
        return dict(sorted(
            agrupados.items(), 
            key=lambda x: self.categorias.get(x[0], {}).get('orden', 99)
        ))
    
    def generar_estadisticas(self, soportes: List[Dict]) -> Dict[str, any]:
        """
        Genera estadísticas de clasificación de soportes
        
        Args:
            soportes: Lista de diccionarios con información de soportes
            
        Returns:
            Diccionario con estadísticas
        """
        total = len(soportes)
        validos = sum(1 for s in soportes if s.get('es_valido', False))
        multiusuario = sum(1 for s in soportes if s.get('es_multiusuario', False))
        
        por_categoria = {}
        for soporte in soportes:
            cat = soporte.get('categoria', 'DESCONOCIDO')
            por_categoria[cat] = por_categoria.get(cat, 0) + 1
        
        return {
            'total_soportes': total,
            'soportes_validos': validos,
            'soportes_invalidos': total - validos,
            'porcentaje_validez': (validos / total * 100) if total > 0 else 0,
            'soportes_multiusuario': multiusuario,
            'por_categoria': por_categoria,
            'timestamp': datetime.now().isoformat()
        }


# Función helper para uso directo
def clasificar_soporte(filename: str) -> Dict[str, any]:
    """
    Función helper para clasificar un soporte rápidamente
    
    Args:
        filename: Nombre del archivo a clasificar
        
    Returns:
        Diccionario con información de clasificación
    """
    classifier = SoporteClassifier()
    return classifier.classify_soporte_type(filename)