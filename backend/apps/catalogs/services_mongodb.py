# -*- coding: utf-8 -*-
# apps/catalogs/services_mongodb.py

"""
Servicios MongoDB Nativos - Catálogos Oficiales
PyMongo directo para verdadero enfoque NoSQL
"""

from datetime import datetime
from typing import Dict, List, Any, Optional
from bson import ObjectId
from pymongo.errors import BulkWriteError, DuplicateKeyError
import logging

from apps.core.mongodb_config import get_collection

logger = logging.getLogger(__name__)


class CatalogosCUPSService:
    """
    Servicio para manejo del Catálogo CUPS oficial
    ~450,000 códigos de procedimientos médicos
    """
    
    def __init__(self):
        self.collection = get_collection('catalogos_cups')
    
    def crear_codigo_cups(self, datos_cups: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo código CUPS en el catálogo
        """
        try:
            documento = {
                '_id': ObjectId(),
                'codigo': datos_cups['codigo'],
                'nombre': datos_cups['nombre'],
                'descripcion': datos_cups.get('descripcion', ''),
                'habilitado': datos_cups.get('habilitado', True),
                
                # Campos de aplicación
                'aplicacion': datos_cups.get('aplicacion'),
                'uso_codigo_cup': datos_cups.get('uso_codigo_cup'),
                
                # Características del procedimiento
                'es_quirurgico': datos_cups.get('es_quirurgico', False),
                'numero_minimo': datos_cups.get('numero_minimo'),
                'numero_maximo': datos_cups.get('numero_maximo'),
                'diagnostico_requerido': datos_cups.get('diagnostico_requerido', False),
                
                # Restricciones
                'sexo': datos_cups.get('sexo'),  # M/F/Z
                'ambito': datos_cups.get('ambito'),  # A/H/Z
                'estancia': datos_cups.get('estancia'),  # E/Z
                'cobertura': datos_cups.get('cobertura'),  # 01/02
                'duplicado': datos_cups.get('duplicado'),  # D/Z
                
                # Metadatos
                'valor_registro': datos_cups.get('valor_registro'),
                'usuario_responsable': datos_cups.get('usuario_responsable'),
                'fecha_actualizacion': datos_cups.get('fecha_actualizacion', datetime.now()),
                'is_public_private': datos_cups.get('is_public_private'),
                
                # Control de versiones
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            }
            
            resultado = self.collection.insert_one(documento)
            return {
                'exito': True,
                'id': str(resultado.inserted_id),
                'codigo': datos_cups['codigo']
            }
            
        except DuplicateKeyError:
            return {
                'exito': False,
                'error': f"Código CUPS {datos_cups['codigo']} ya existe"
            }
        except Exception as e:
            logger.error(f'Error creando código CUPS: {str(e)}')
            return {'exito': False, 'error': str(e)}
    
    def buscar_codigo_cups(self, codigo: str) -> Optional[Dict]:
        """
        Busca un código CUPS específico
        """
        return self.collection.find_one({'codigo': codigo})
    
    def validar_codigo_cups(self, codigo: str, datos_servicio: Dict = None) -> Dict[str, Any]:
        """
        Valida un código CUPS con reglas de negocio
        """
        cups = self.buscar_codigo_cups(codigo)
        
        if not cups:
            return {
                'valido': False,
                'codigo_devolucion': 'DE5001',
                'mensaje': f'Código CUPS {codigo} no existe en catálogo oficial'
            }
        
        if not cups.get('habilitado', True):
            return {
                'valido': False,
                'codigo_devolucion': 'DE5002',
                'mensaje': f'Código CUPS {codigo} se encuentra inhabilitado'
            }
        
        # Validaciones adicionales si se proporcionan datos del servicio
        if datos_servicio:
            # Validar sexo
            if cups.get('sexo') and datos_servicio.get('sexo_paciente'):
                if cups['sexo'] != 'Z' and cups['sexo'] != datos_servicio['sexo_paciente']:
                    return {
                        'valido': False,
                        'codigo_devolucion': 'DE5003',
                        'mensaje': f'Código CUPS {codigo} no aplica para sexo {datos_servicio["sexo_paciente"]}'
                    }
            
            # Validar ámbito
            if cups.get('ambito') and datos_servicio.get('ambito_atencion'):
                if cups['ambito'] != 'Z' and cups['ambito'] != datos_servicio['ambito_atencion']:
                    return {
                        'valido': False,
                        'codigo_devolucion': 'DE5004',
                        'mensaje': f'Código CUPS {codigo} no aplica para ámbito {datos_servicio["ambito_atencion"]}'
                    }
        
        return {
            'valido': True,
            'codigo_cups': codigo,
            'nombre': cups['nombre'],
            'es_quirurgico': cups.get('es_quirurgico', False),
            'diagnostico_requerido': cups.get('diagnostico_requerido', False)
        }
    
    def buscar_cups_por_texto(self, texto_busqueda: str, limite: int = 50) -> List[Dict]:
        """
        Búsqueda de códigos CUPS por texto en nombre o descripción
        """
        pipeline = [
            {
                '$match': {
                    '$and': [
                        {'habilitado': True},
                        {
                            '$or': [
                                {'nombre': {'$regex': texto_busqueda, '$options': 'i'}},
                                {'descripcion': {'$regex': texto_busqueda, '$options': 'i'}},
                                {'codigo': {'$regex': texto_busqueda}}
                            ]
                        }
                    ]
                }
            },
            {
                '$project': {
                    'codigo': 1,
                    'nombre': 1,
                    'descripcion': 1,
                    'es_quirurgico': 1,
                    'sexo': 1,
                    'ambito': 1
                }
            },
            {'$limit': limite}
        ]
        
        return list(self.collection.aggregate(pipeline))
    
    def cargar_masivo_cups(self, datos_cups: List[Dict]) -> Dict[str, Any]:
        """
        Carga masiva de códigos CUPS desde archivos oficiales
        """
        try:
            documentos = []
            errores = []
            
            for i, datos in enumerate(datos_cups):
                try:
                    documento = {
                        '_id': ObjectId(),
                        'codigo': datos['codigo'],
                        'nombre': datos['nombre'],
                        'descripcion': datos.get('descripcion', ''),
                        'habilitado': True,
                        
                        # Campos específicos CUPS
                        'aplicacion': datos.get('aplicacion'),
                        'uso_codigo_cup': datos.get('uso_codigo_cup'),
                        'es_quirurgico': datos.get('es_quirurgico') == 'S',
                        'numero_minimo': self._convertir_entero(datos.get('numero_minimo')),
                        'numero_maximo': self._convertir_entero(datos.get('numero_maximo')),
                        'diagnostico_requerido': datos.get('diagnostico_requerido') == 'S',
                        
                        # Restricciones
                        'sexo': datos.get('sexo'),
                        'ambito': datos.get('ambito'),
                        'estancia': datos.get('estancia'),
                        'cobertura': datos.get('cobertura'),
                        'duplicado': datos.get('duplicado'),
                        
                        # Metadatos
                        'valor_registro': datos.get('valor_registro'),
                        'usuario_responsable': datos.get('usuario_responsable'),
                        'fecha_actualizacion': self._convertir_fecha(datos.get('fecha_actualizacion')),
                        'is_public_private': datos.get('is_public_private'),
                        
                        'created_at': datetime.now(),
                        'updated_at': datetime.now()
                    }
                    
                    documentos.append(documento)
                    
                except Exception as e:
                    errores.append({
                        'fila': i + 1,
                        'codigo': datos.get('codigo', 'N/A'),
                        'error': str(e)
                    })
            
            if documentos:
                resultado_bulk = self.collection.insert_many(documentos, ordered=False)
                
                return {
                    'exito': True,
                    'registros_insertados': len(resultado_bulk.inserted_ids),
                    'registros_procesados': len(datos_cups),
                    'errores': errores
                }
            else:
                return {
                    'exito': False,
                    'mensaje': 'No se pudieron procesar los documentos',
                    'errores': errores
                }
                
        except BulkWriteError as e:
            logger.error(f'Error en carga masiva CUPS: {str(e)}')
            return {
                'exito': False,
                'error': 'Error en operación masiva',
                'detalles': str(e)
            }
    
    def obtener_estadisticas_cups(self) -> Dict[str, Any]:
        """
        Obtiene estadísticas del catálogo CUPS
        """
        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'total_codigos': {'$sum': 1},
                    'habilitados': {
                        '$sum': {'$cond': [{'$eq': ['$habilitado', True]}, 1, 0]}
                    },
                    'quirurgicos': {
                        '$sum': {'$cond': [{'$eq': ['$es_quirurgico', True]}, 1, 0]}
                    },
                    'requieren_diagnostico': {
                        '$sum': {'$cond': [{'$eq': ['$diagnostico_requerido', True]}, 1, 0]}
                    }
                }
            }
        ]
        
        resultado = list(self.collection.aggregate(pipeline))
        if resultado:
            stats = resultado[0]
            stats.pop('_id', None)
            return stats
        
        return {'total_codigos': 0, 'habilitados': 0, 'quirurgicos': 0, 'requieren_diagnostico': 0}
    
    def _convertir_entero(self, valor) -> Optional[int]:
        """Convierte valor a entero de forma segura"""
        try:
            return int(valor) if valor and str(valor).strip() else None
        except (ValueError, TypeError):
            return None
    
    def _convertir_fecha(self, valor) -> datetime:
        """Convierte valor a fecha de forma segura"""
        if isinstance(valor, datetime):
            return valor
        elif isinstance(valor, str) and valor.strip():
            try:
                return datetime.strptime(valor.strip(), '%Y-%m-%d')
            except ValueError:
                return datetime.now()
        else:
            return datetime.now()


class CatalogosCUMService:
    """
    Servicio para manejo del Catálogo CUM oficial
    ~950,000 medicamentos
    """
    
    def __init__(self):
        self.collection = get_collection('catalogos_cum')
    
    def buscar_medicamento_cum(self, codigo_cum: str) -> Optional[Dict]:
        """
        Busca un medicamento por código CUM
        """
        return self.collection.find_one({'codigo': codigo_cum})
    
    def validar_medicamento_cum(self, codigo_cum: str) -> Dict[str, Any]:
        """
        Valida un código CUM con reglas de negocio
        """
        medicamento = self.buscar_medicamento_cum(codigo_cum)
        
        if not medicamento:
            return {
                'valido': False,
                'codigo_devolucion': 'DE5011',
                'mensaje': f'Código CUM {codigo_cum} no existe en catálogo oficial'
            }
        
        if not medicamento.get('habilitado', True):
            return {
                'valido': False,
                'codigo_devolucion': 'DE5012',
                'mensaje': f'Código CUM {codigo_cum} se encuentra inhabilitado'
            }
        
        return {
            'valido': True,
            'codigo_cum': codigo_cum,
            'nombre': medicamento['nombre'],
            'principio_activo': medicamento.get('principio_activo'),
            'via_administracion': medicamento.get('via_administracion'),
            'es_muestra_medica': medicamento.get('es_muestra_medica', False)
        }
    
    def cargar_masivo_cum(self, datos_cum: List[Dict]) -> Dict[str, Any]:
        """
        Carga masiva de medicamentos CUM desde archivos oficiales
        """
        try:
            documentos = []
            errores = []
            
            for i, datos in enumerate(datos_cum):
                try:
                    documento = {
                        '_id': ObjectId(),
                        'codigo': datos['codigo'],
                        'nombre': datos['nombre'],
                        'descripcion': datos.get('descripcion', ''),
                        'habilitado': True,
                        
                        # Clasificación farmacológica
                        'es_muestra_medica': datos.get('es_muestra_medica') == 'SI',
                        'codigo_atc': datos.get('codigo_atc'),
                        'atc': datos.get('atc'),
                        'registro_sanitario': datos.get('registro_sanitario'),
                        
                        # Principio activo
                        'principio_activo': datos.get('principio_activo'),
                        'cantidad_principio_activo': self._convertir_decimal(datos.get('cantidad_principio_activo')),
                        'unidad_medida_principio': datos.get('unidad_medida_principio'),
                        
                        # Presentación
                        'via_administracion': datos.get('via_administracion'),
                        'cantidad_presentacion': self._convertir_decimal(datos.get('cantidad_presentacion')),
                        'unidad_medida_presentacion': datos.get('unidad_medida_presentacion'),
                        
                        # Metadatos
                        'aplicacion': datos.get('aplicacion'),
                        'valor_registro': datos.get('valor_registro'),
                        'usuario_responsable': datos.get('usuario_responsable'),
                        'fecha_actualizacion': self._convertir_fecha(datos.get('fecha_actualizacion')),
                        'is_public_private': datos.get('is_public_private'),
                        
                        'created_at': datetime.now(),
                        'updated_at': datetime.now()
                    }
                    
                    documentos.append(documento)
                    
                except Exception as e:
                    errores.append({
                        'fila': i + 1,
                        'codigo': datos.get('codigo', 'N/A'),
                        'error': str(e)
                    })
            
            if documentos:
                resultado_bulk = self.collection.insert_many(documentos, ordered=False)
                
                return {
                    'exito': True,
                    'registros_insertados': len(resultado_bulk.inserted_ids),
                    'registros_procesados': len(datos_cum),
                    'errores': errores
                }
            else:
                return {
                    'exito': False,
                    'mensaje': 'No se pudieron procesar los documentos',
                    'errores': errores
                }
                
        except BulkWriteError as e:
            logger.error(f'Error en carga masiva CUM: {str(e)}')
            return {
                'exito': False,
                'error': 'Error en operación masiva',
                'detalles': str(e)
            }
    
    def _convertir_decimal(self, valor) -> Optional[float]:
        """Convierte valor a decimal de forma segura"""
        try:
            return float(valor) if valor and str(valor).strip() else None
        except (ValueError, TypeError):
            return None
    
    def _convertir_fecha(self, valor) -> datetime:
        """Convierte valor a fecha de forma segura"""
        if isinstance(valor, datetime):
            return valor
        elif isinstance(valor, str) and valor.strip():
            try:
                return datetime.strptime(valor.strip(), '%Y-%m-%d')
            except ValueError:
                return datetime.now()
        else:
            return datetime.now()


class BDUAService:
    """
    Servicio para manejo de la Base de Datos Única de Afiliados (BDUA)
    Régimen Subsidiado y Contributivo unificado
    """
    
    def __init__(self):
        self.collection = get_collection('bdua_afiliados')
    
    def buscar_afiliado(self, tipo_documento: str, numero_documento: str, 
                       codigo_eps: str = None) -> Optional[Dict]:
        """
        Busca un afiliado en la BDUA
        """
        filtro = {
            'usuario_tipo_documento': tipo_documento,
            'usuario_numero_documento': numero_documento
        }
        
        if codigo_eps:
            filtro['codigo_eps'] = codigo_eps
        
        return self.collection.find_one(filtro)
    
    def validar_derechos_afiliado(self, tipo_documento: str, numero_documento: str,
                                fecha_atencion: datetime, codigo_eps: str = None) -> Dict[str, Any]:
        """
        Valida los derechos de un afiliado en fecha específica
        """
        afiliado = self.buscar_afiliado(tipo_documento, numero_documento, codigo_eps)
        
        if not afiliado:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': f'Afiliado {tipo_documento} {numero_documento} no encontrado en BDUA',
                'requiere_devolucion': True
            }
        
        # Validar estado de afiliación
        estado_afiliacion = afiliado.get('afiliacion_estado_afiliacion')
        if estado_afiliacion not in ['AC', 'ST']:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': f'Afiliado con estado {estado_afiliacion} en fecha de atención',
                'requiere_devolucion': True
            }
        
        # Validar fecha efectiva
        fecha_efectiva = afiliado.get('afiliacion_fecha_efectiva_bd')
        if fecha_efectiva and fecha_atencion.date() < fecha_efectiva:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': 'Atención antes de la fecha efectiva de afiliación',
                'requiere_devolucion': True
            }
        
        # Validar fecha de retiro
        fecha_retiro = afiliado.get('afiliacion_fecha_retiro')
        if fecha_retiro and fecha_atencion.date() > fecha_retiro:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': 'Atención después de la fecha de retiro',
                'requiere_devolucion': True
            }
        
        return {
            'valido': True,
            'afiliado': {
                'documento': f"{tipo_documento} {numero_documento}",
                'nombre_completo': self._construir_nombre_completo(afiliado),
                'regimen': afiliado.get('regimen'),
                'estado_afiliacion': estado_afiliacion,
                'fecha_nacimiento': afiliado.get('usuario_fecha_nacimiento'),
                'sexo': afiliado.get('usuario_sexo'),
                'nivel_sisben': afiliado.get('caracteristicas_nivel_sisben'),
                'tipo_usuario': afiliado.get('usuario_tipo_usuario')
            }
        }
    
    def cargar_masivo_bdua(self, datos_bdua: List[Dict], regimen: str) -> Dict[str, Any]:
        """
        Carga masiva de afiliados BDUA
        """
        try:
            documentos = []
            errores = []
            
            for i, datos in enumerate(datos_bdua):
                try:
                    documento = {
                        '_id': ObjectId(),
                        'id_unico': datos.get('id_unico') or f"{datos['codigo_eps']}_{datos['usuario_numero_documento']}",
                        'codigo_eps': datos['codigo_eps'],
                        'regimen': regimen,
                        'tipo_afiliacion': datos.get('tipo_afiliacion'),
                        
                        # Datos básicos usuario
                        'usuario_tipo_documento': datos['usuario_tipo_documento'],
                        'usuario_numero_documento': datos['usuario_numero_documento'],
                        'usuario_primer_apellido': datos.get('usuario_primer_apellido'),
                        'usuario_segundo_apellido': datos.get('usuario_segundo_apellido'),
                        'usuario_primer_nombre': datos.get('usuario_primer_nombre'),
                        'usuario_segundo_nombre': datos.get('usuario_segundo_nombre'),
                        'usuario_fecha_nacimiento': self._convertir_fecha_nacimiento(datos.get('usuario_fecha_nacimiento')),
                        'usuario_sexo': datos['usuario_sexo'],
                        'usuario_tipo_usuario': datos.get('usuario_tipo_usuario'),
                        
                        # Cotizante (si aplica)
                        'cotizante_tipo_documento': datos.get('cotizante_tipo_documento'),
                        'cotizante_numero_documento': datos.get('cotizante_numero_documento'),
                        
                        # Datos familiares
                        'familia_parentesco': self._convertir_entero(datos.get('familia_parentesco')),
                        'familia_id_cabeza_familia': datos.get('familia_id_cabeza_familia'),
                        'familia_tipo_subsidio': self._convertir_entero(datos.get('familia_tipo_subsidio')),
                        
                        # Ubicación geográfica
                        'ubicacion_departamento': datos.get('ubicacion_departamento'),
                        'ubicacion_municipio': datos.get('ubicacion_municipio'),
                        'ubicacion_zona': datos.get('ubicacion_zona'),
                        
                        # Características especiales
                        'caracteristicas_discapacidad': datos.get('caracteristicas_discapacidad'),
                        'caracteristicas_etnia_poblacion': datos.get('caracteristicas_etnia_poblacion'),
                        'caracteristicas_nivel_sisben': datos.get('caracteristicas_nivel_sisben'),
                        'caracteristicas_puntaje_sisben': datos.get('caracteristicas_puntaje_sisben'),
                        'caracteristicas_ficha_sisben': datos.get('caracteristicas_ficha_sisben'),
                        
                        # Estado afiliación
                        'afiliacion_fecha_afiliacion': self._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_afiliacion')),
                        'afiliacion_fecha_efectiva_bd': self._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_efectiva_bd')),
                        'afiliacion_fecha_retiro': self._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_retiro')),
                        'afiliacion_causal_retiro': datos.get('afiliacion_causal_retiro'),
                        'afiliacion_fecha_retiro_bd': self._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_retiro_bd')),
                        'afiliacion_tipo_traslado': datos.get('afiliacion_tipo_traslado'),
                        'afiliacion_estado_traslado': datos.get('afiliacion_estado_traslado'),
                        'afiliacion_estado_afiliacion': datos.get('afiliacion_estado_afiliacion', 'AC'),
                        'afiliacion_fecha_ultima_novedad': self._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_ultima_novedad')),
                        'afiliacion_fecha_defuncion': self._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_defuncion')),
                        
                        # Datos contributivo (si aplica)
                        'contributivo_codigo_entidad': datos.get('contributivo_codigo_entidad'),
                        'contributivo_subred': datos.get('contributivo_subred'),
                        'contributivo_ibc': self._convertir_decimal(datos.get('contributivo_ibc')),
                        
                        # Metadatos
                        'metadata_archivo_origen': datos.get('metadata_archivo_origen'),
                        'metadata_fecha_carga': datetime.now(),
                        'metadata_fecha_actualizacion': datetime.now(),
                        'metadata_version_bdua': datos.get('metadata_version_bdua'),
                        'metadata_observaciones': datos.get('metadata_observaciones'),
                        
                        'created_at': datetime.now(),
                        'updated_at': datetime.now()
                    }
                    
                    documentos.append(documento)
                    
                except Exception as e:
                    errores.append({
                        'fila': i + 1,
                        'documento': datos.get('usuario_numero_documento', 'N/A'),
                        'error': str(e)
                    })
            
            if documentos:
                resultado_bulk = self.collection.insert_many(documentos, ordered=False)
                
                return {
                    'exito': True,
                    'registros_insertados': len(resultado_bulk.inserted_ids),
                    'registros_procesados': len(datos_bdua),
                    'errores': errores
                }
            else:
                return {
                    'exito': False,
                    'mensaje': 'No se pudieron procesar los documentos',
                    'errores': errores
                }
                
        except BulkWriteError as e:
            logger.error(f'Error en carga masiva BDUA: {str(e)}')
            return {
                'exito': False,
                'error': 'Error en operación masiva',
                'detalles': str(e)
            }
    
    def _construir_nombre_completo(self, afiliado: Dict) -> str:
        """Construye el nombre completo del afiliado"""
        nombres = []
        if afiliado.get('usuario_primer_nombre'):
            nombres.append(afiliado['usuario_primer_nombre'])
        if afiliado.get('usuario_segundo_nombre'):
            nombres.append(afiliado['usuario_segundo_nombre'])
        if afiliado.get('usuario_primer_apellido'):
            nombres.append(afiliado['usuario_primer_apellido'])
        if afiliado.get('usuario_segundo_apellido'):
            nombres.append(afiliado['usuario_segundo_apellido'])
        return ' '.join(nombres)
    
    def _convertir_fecha_nacimiento(self, valor) -> Optional[datetime]:
        """Convierte fecha de nacimiento de forma segura"""
        if not valor:
            return None
        
        if isinstance(valor, datetime):
            return valor
        
        try:
            if isinstance(valor, str):
                # Intentar varios formatos
                formatos = ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y']
                for formato in formatos:
                    try:
                        return datetime.strptime(valor.strip(), formato)
                    except ValueError:
                        continue
        except Exception:
            pass
        
        return None
    
    def _convertir_entero(self, valor) -> Optional[int]:
        """Convierte valor a entero de forma segura"""
        try:
            return int(valor) if valor and str(valor).strip() else None
        except (ValueError, TypeError):
            return None
    
    def _convertir_decimal(self, valor) -> Optional[float]:
        """Convierte valor a decimal de forma segura"""
        try:
            return float(valor) if valor and str(valor).strip() else None
        except (ValueError, TypeError):
            return None
