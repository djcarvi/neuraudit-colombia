"""
Servicio de Validaciones Cruzadas - NeurAudit Colombia
Valida coherencia entre XML, RIPS, CUV y nomenclatura de PDFs

Según Resolución 2284 de 2023, todos los archivos de una radicación
deben corresponder al mismo prestador y la misma factura.

Validaciones implementadas:
1. NIT del prestador debe coincidir en XML, RIPS, CUV y PDFs
2. Número de factura debe coincidir en XML, RIPS, CUV y PDFs
3. Validación de nomenclatura oficial en PDFs

Autor: Analítica Neuronal
Fecha: 21 Agosto 2025
"""

import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from decimal import Decimal
import re

from .soporte_classifier import SoporteClassifier

logger = logging.getLogger(__name__)


class CrossValidationService:
    """
    Servicio para validaciones cruzadas entre archivos de radicación
    """
    
    def __init__(self):
        self.classifier = SoporteClassifier()
        self.errores = []
        self.advertencias = []
    
    def validar_coherencia_completa(
        self, 
        datos_xml: Dict[str, Any],
        datos_rips: Dict[str, Any],
        datos_cuv: Optional[Dict[str, Any]] = None,
        archivos_soportes: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Valida coherencia completa entre todos los archivos
        
        Args:
            datos_xml: Datos extraídos del XML
            datos_rips: Datos extraídos del RIPS
            datos_cuv: Datos extraídos del CUV (opcional)
            archivos_soportes: Lista de nombres de archivos PDF
            
        Returns:
            Dict con resultado de validación
        """
        self.errores = []
        self.advertencias = []
        
        resultado = {
            'valido': True,
            'errores': [],
            'advertencias': [],
            'detalles': {
                'nit': {},
                'factura': {},
                'cuv': {},
                'soportes': {}
            }
        }
        
        # 1. Validar NIT del prestador
        nit_validacion = self._validar_nit_prestador(datos_xml, datos_rips, datos_cuv)
        resultado['detalles']['nit'] = nit_validacion
        if not nit_validacion['coincide']:
            resultado['valido'] = False
            resultado['errores'].append(nit_validacion['mensaje'])
        
        # 2. Validar número de factura
        factura_validacion = self._validar_numero_factura(datos_xml, datos_rips, datos_cuv)
        resultado['detalles']['factura'] = factura_validacion
        if not factura_validacion['coincide']:
            resultado['valido'] = False
            resultado['errores'].append(factura_validacion['mensaje'])
        
        # 3. Validar CUV si está presente
        if datos_cuv:
            cuv_validacion = self._validar_cuv(datos_cuv, datos_xml, datos_rips)
            resultado['detalles']['cuv'] = cuv_validacion
            if not cuv_validacion['valido']:
                resultado['valido'] = False
                resultado['errores'].extend(cuv_validacion['errores'])
        
        # 4. Validar nomenclatura de soportes PDF
        if archivos_soportes:
            soportes_validacion = self._validar_nomenclatura_soportes(
                archivos_soportes, 
                nit_validacion.get('nit_correcto'),
                factura_validacion.get('factura_correcta')
            )
            resultado['detalles']['soportes'] = soportes_validacion
            if not soportes_validacion['valido']:
                resultado['advertencias'].extend(soportes_validacion['advertencias'])
            if soportes_validacion['errores']:
                resultado['errores'].extend(soportes_validacion['errores'])
        
        # Agregar resumen
        resultado['resumen'] = {
            'total_validaciones': 4,
            'validaciones_exitosas': sum([
                nit_validacion.get('coincide', False),
                factura_validacion.get('coincide', False),
                resultado['detalles']['cuv'].get('valido', True) if datos_cuv else True,
                resultado['detalles']['soportes'].get('valido', True) if archivos_soportes else True
            ]),
            'requiere_atencion': len(resultado['errores']) > 0
        }
        
        logger.info(f"Validación cruzada completada: {resultado['resumen']}")
        
        return resultado
    
    def _validar_nit_prestador(
        self, 
        datos_xml: Dict[str, Any],
        datos_rips: Dict[str, Any],
        datos_cuv: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Valida que el NIT del prestador coincida en todos los archivos
        """
        resultado = {
            'coincide': True,
            'mensaje': '',
            'valores': {}
        }
        
        # Normalizar NITs (quitar guiones, puntos)
        def normalizar_nit(nit: str) -> str:
            if not nit:
                return ''
            return str(nit).replace('-', '').replace('.', '').strip()
        
        # Extraer NITs
        nit_xml = normalizar_nit(datos_xml.get('prestador_nit', ''))
        nit_rips = normalizar_nit(datos_rips.get('prestador_nit', ''))
        
        # Log para debug
        logger.info(f"Validando NIT - XML: {nit_xml}, RIPS: {nit_rips}")
        
        resultado['valores'] = {
            'xml': nit_xml,
            'rips': nit_rips
        }
        
        # Validar que existan
        if not nit_xml:
            resultado['coincide'] = False
            resultado['mensaje'] = "No se encontró NIT del prestador en el XML"
            return resultado
        
        if not nit_rips:
            resultado['coincide'] = False
            resultado['mensaje'] = "No se encontró idObligado (NIT) en el RIPS"
            return resultado
        
        # Comparar
        if nit_xml != nit_rips:
            resultado['coincide'] = False
            resultado['mensaje'] = (
                f"El NIT del prestador no coincide entre archivos: "
                f"XML={nit_xml}, RIPS={nit_rips}"
            )
            return resultado
        
        # Nota: El CUV no contiene el NIT del prestador directamente
        # Solo registramos que XML y RIPS coinciden
        
        resultado['nit_correcto'] = nit_xml
        resultado['mensaje'] = f"NIT del prestador coincide correctamente: {nit_xml}"
        
        return resultado
    
    def _validar_numero_factura(
        self, 
        datos_xml: Dict[str, Any],
        datos_rips: Dict[str, Any],
        datos_cuv: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Valida que el número de factura coincida en todos los archivos
        """
        resultado = {
            'coincide': True,
            'mensaje': '',
            'valores': {}
        }
        
        # Normalizar números de factura
        def normalizar_factura(num: str) -> str:
            if not num:
                return ''
            # Quitar espacios y convertir a mayúsculas
            return str(num).strip().upper()
        
        # Extraer números
        factura_xml = normalizar_factura(datos_xml.get('numero_factura', ''))
        factura_rips = normalizar_factura(datos_rips.get('numero_factura', ''))
        
        # Log para debug
        logger.info(f"Validando factura - XML: {factura_xml}, RIPS: {factura_rips}")
        
        resultado['valores'] = {
            'xml': factura_xml,
            'rips': factura_rips
        }
        
        # Validar que existan
        if not factura_xml:
            resultado['coincide'] = False
            resultado['mensaje'] = "No se encontró número de factura en el XML"
            return resultado
        
        if not factura_rips:
            resultado['coincide'] = False
            resultado['mensaje'] = "No se encontró número de factura en el RIPS"
            return resultado
        
        # Comparar
        if factura_xml != factura_rips:
            resultado['coincide'] = False
            resultado['mensaje'] = (
                f"El número de factura no coincide entre archivos: "
                f"XML={factura_xml}, RIPS={factura_rips}"
            )
            return resultado
        
        # Si hay CUV, validar también
        if datos_cuv:
            factura_cuv = normalizar_factura(datos_cuv.get('numero_factura', ''))
            resultado['valores']['cuv'] = factura_cuv
            
            if factura_cuv and factura_cuv != factura_xml:
                resultado['coincide'] = False
                resultado['mensaje'] = (
                    f"El número de factura en CUV ({factura_cuv}) no coincide "
                    f"con XML/RIPS ({factura_xml})"
                )
                return resultado
        
        resultado['factura_correcta'] = factura_xml
        resultado['mensaje'] = f"Número de factura coincide correctamente: {factura_xml}"
        
        return resultado
    
    def _validar_cuv(
        self,
        datos_cuv: Dict[str, Any],
        datos_xml: Dict[str, Any],
        datos_rips: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Valida la estructura y contenido del archivo CUV
        """
        resultado = {
            'valido': True,
            'errores': [],
            'advertencias': [],
            'codigo_unico': None
        }
        
        # Verificar que tenga el código único de validación
        codigo_cuv = datos_cuv.get('codigo_unico_validacion', '')
        if not codigo_cuv:
            resultado['valido'] = False
            resultado['errores'].append("El archivo CUV no contiene código único de validación")
        else:
            # Validar longitud (debe ser 96 caracteres)
            if len(codigo_cuv) != 96:
                resultado['advertencias'].append(
                    f"El CUV tiene {len(codigo_cuv)} caracteres, se esperaban 96"
                )
            resultado['codigo_unico'] = codigo_cuv
        
        # Verificar estado de validación
        if datos_cuv.get('resultado_validacion') == False:
            resultado['valido'] = False
            resultado['errores'].append("El CUV indica que la validación MinSalud falló")
            
            # Agregar errores específicos si están disponibles
            errores_validacion = datos_cuv.get('errores_validacion', [])
            for error in errores_validacion:
                resultado['errores'].append(f"Error MinSalud: {error}")
        
        return resultado
    
    def _validar_nomenclatura_soportes(
        self,
        archivos_soportes: List[str],
        nit_esperado: Optional[str],
        factura_esperada: Optional[str]
    ) -> Dict[str, Any]:
        """
        Valida que los PDFs cumplan con la nomenclatura oficial
        y correspondan al prestador/factura correctos
        """
        resultado = {
            'valido': True,
            'errores': [],
            'advertencias': [],
            'archivos_invalidos': [],
            'archivos_validos': [],
            'estadisticas': {}
        }
        
        total_archivos = len(archivos_soportes)
        archivos_validos = 0
        archivos_con_errores = 0
        
        for archivo in archivos_soportes:
            # Clasificar archivo
            info = self.classifier.parse_soporte_filename(archivo)
            
            if not info.nomenclatura_valida:
                archivos_con_errores += 1
                resultado['archivos_invalidos'].append({
                    'archivo': archivo,
                    'errores': info.errores
                })
                # Cambiar de advertencia a ERROR - no permitir subir archivos con nomenclatura incorrecta
                resultado['errores'].append(
                    f"Archivo '{archivo}' no cumple nomenclatura oficial: {', '.join(info.errores or [])}"
                )
                resultado['valido'] = False  # Marcar inmediatamente como no válido
            else:
                archivos_validos += 1
                resultado['archivos_validos'].append(archivo)
                
                # Si tenemos factura esperada, validar que coincida
                if factura_esperada and info.numero_factura:
                    # Normalizar para comparación (convertir a mayúsculas)
                    factura_pdf = info.numero_factura.upper().strip()
                    factura_esperada_norm = str(factura_esperada).upper().strip()
                    
                    if factura_pdf != factura_esperada_norm:
                        resultado['errores'].append(
                            f"Archivo '{archivo}' corresponde a factura {info.numero_factura}, "
                            f"pero se esperaba {factura_esperada}"
                        )
                        resultado['valido'] = False
                
                # Si tenemos NIT esperado, validar que coincida
                # Excepción: Si el identificador es 'DIAN', es la representación gráfica de factura
                if nit_esperado and info.identificador and info.identificador != 'DIAN':
                    # Normalizar NITs para comparación
                    nit_pdf = info.identificador.replace('-', '').replace('.', '').strip()
                    nit_esperado_norm = str(nit_esperado).replace('-', '').replace('.', '').strip()
                    
                    if nit_pdf != nit_esperado_norm:
                        resultado['errores'].append(
                            f"Archivo '{archivo}' corresponde a NIT {info.identificador}, "
                            f"pero se esperaba {nit_esperado}"
                        )
                        resultado['valido'] = False
        
        # Estadísticas
        resultado['estadisticas'] = {
            'total_archivos': total_archivos,
            'archivos_validos': archivos_validos,
            'archivos_con_errores': archivos_con_errores,
            'porcentaje_validez': (archivos_validos / total_archivos * 100) if total_archivos > 0 else 0
        }
        
        # Ya no necesitamos esta validación del 80% porque ahora cada archivo inválido
        # marca inmediatamente la validación como fallida
        # if resultado['estadisticas']['porcentaje_validez'] < 80:
        #     resultado['valido'] = False
        #     resultado['errores'].append(
        #         f"Solo el {resultado['estadisticas']['porcentaje_validez']:.1f}% "
        #         f"de los archivos cumplen con la nomenclatura oficial"
        #     )
        
        return resultado
    
    def parsear_archivo_cuv(self, contenido: str) -> Dict[str, Any]:
        """
        Parsea el contenido de un archivo CUV (JSON o TXT)
        
        Args:
            contenido: Contenido del archivo CUV
            
        Returns:
            Dict con información extraída del CUV
        """
        resultado = {
            'codigo_unico_validacion': None,
            'numero_factura': None,
            'nit_prestador': None,
            'fecha_validacion': None,
            'resultado_validacion': None,
            'proceso_id': None,
            'errores_validacion': [],
            'advertencias': []
        }
        
        try:
            # Intentar parsear como JSON
            data = json.loads(contenido)
            
            # Extraer campos según estructura real del CUV de MinSalud
            resultado['codigo_unico_validacion'] = data.get('CodigoUnicoValidacion')
            resultado['numero_factura'] = data.get('NumFactura')
            resultado['fecha_validacion'] = data.get('FechaRadicacion')
            resultado['resultado_validacion'] = data.get('ResultState', False)
            resultado['proceso_id'] = data.get('ProcesoId')
            
            # Nota: El CUV no incluye directamente el NIT del prestador
            # pero podemos extraerlo del path si está disponible
            ruta_archivos = data.get('RutaArchivos', '')
            if ruta_archivos:
                logger.info(f"Ruta archivos en CUV: {ruta_archivos}")
            
            # Extraer resultados de validación si existen
            validaciones = data.get('ResultadosValidacion', [])
            for validacion in validaciones:
                if isinstance(validacion, dict):
                    clase = validacion.get('Clase', '')
                    codigo = validacion.get('Codigo', '')
                    descripcion = validacion.get('Descripcion', '')
                    fuente = validacion.get('Fuente', '')
                    
                    mensaje = f"{codigo}: {descripcion} (Fuente: {fuente})"
                    
                    # Clasificar según la clase
                    if clase == 'ERROR':
                        resultado['errores_validacion'].append(mensaje)
                    elif clase == 'NOTIFICACION':
                        resultado['advertencias'].append(mensaje)
                    else:
                        # Por defecto, tratarlo como advertencia
                        resultado['advertencias'].append(mensaje)
            
            logger.info(f"CUV parseado exitosamente: Factura {resultado['numero_factura']}, "
                       f"Proceso {resultado['proceso_id']}, Estado: {resultado['resultado_validacion']}")
            
        except json.JSONDecodeError:
            # Si no es JSON, intentar extraer de texto plano
            logger.warning("CUV no es JSON válido, intentando parsear como texto")
            
            try:
                # Si es un archivo TXT, puede tener estructura diferente
                lines = contenido.strip().split('\n')
                
                for line in lines:
                    # Buscar código único (96 caracteres hexadecimales)
                    cuv_pattern = r'[a-fA-F0-9]{96}'
                    cuv_match = re.search(cuv_pattern, line)
                    if cuv_match and not resultado['codigo_unico_validacion']:
                        resultado['codigo_unico_validacion'] = cuv_match.group(0)
                    
                    # Buscar número de factura
                    if 'NumFactura' in line or 'Factura' in line:
                        factura_pattern = r'(?:NumFactura|Factura)[:\s]+([A-Z0-9\-]+)'
                        factura_match = re.search(factura_pattern, line, re.IGNORECASE)
                        if factura_match:
                            resultado['numero_factura'] = factura_match.group(1)
                    
                    # Buscar estado de resultado
                    if 'ResultState' in line:
                        if 'true' in line.lower():
                            resultado['resultado_validacion'] = True
                        elif 'false' in line.lower():
                            resultado['resultado_validacion'] = False
                    
                    # Buscar proceso ID
                    if 'ProcesoId' in line:
                        proceso_pattern = r'ProcesoId[:\s]+(\d+)'
                        proceso_match = re.search(proceso_pattern, line)
                        if proceso_match:
                            resultado['proceso_id'] = int(proceso_match.group(1))
            
            except Exception as e:
                logger.error(f"Error parseando CUV como texto: {str(e)}")
                resultado['errores_validacion'].append(f"Error parseando formato texto: {str(e)}")
        
        except Exception as e:
            logger.error(f"Error general parseando archivo CUV: {str(e)}")
            resultado['errores_validacion'].append(f"Error parseando CUV: {str(e)}")
        
        return resultado