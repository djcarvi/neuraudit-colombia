# -*- coding: utf-8 -*-
"""
Procesador RIPS NoSQL para NeurAudit Colombia
Manejo eficiente de archivos RIPS con miles de registros
"""

from typing import Dict, List, Any, Tuple
from datetime import datetime
import json
import logging
from .mongodb_service import MongoDBService
from bson import ObjectId

logger = logging.getLogger('neuraudit.services.rips')


class RIPSProcessor:
    """
    Procesamiento NoSQL puro para archivos RIPS
    Optimizado para manejar archivos de prestadores grandes
    """
    
    def __init__(self):
        self.mongo = MongoDBService()
        self.db = self.mongo.db
        
    def procesar_archivo_rips(self, archivo_json: Dict) -> Dict[str, Any]:
        """
        Procesa un archivo RIPS completo con validaciones
        
        Args:
            archivo_json: Diccionario con estructura RIPS
            
        Returns:
            Dict con resultados del procesamiento
        """
        inicio = datetime.now()
        resultado = {
            'exitosos': 0,
            'errores': 0,
            'advertencias': 0,
            'detalles': [],
            'transaccion_id': None,
            'tiempo_procesamiento': 0
        }
        
        try:
            # Extraer información básica
            num_factura = archivo_json.get('numFactura')
            prestador_nit = archivo_json.get('codPrestador')
            
            # Crear documento de transacción principal
            transaccion = {
                '_id': ObjectId(),
                'numero_factura': num_factura,
                'prestador_nit': prestador_nit,
                'fecha_radicacion': datetime.now(),
                'estado_procesamiento': 'EN_PROCESO',
                'archivo_original': archivo_json,
                'usuarios': [],
                'estadisticas': {
                    'total_usuarios': 0,
                    'total_servicios': 0,
                    'valor_total': 0,
                    'distribucion_servicios': {}
                },
                'validaciones': {
                    'bdua': {'pendientes': 0, 'validados': 0, 'rechazados': 0},
                    'cups': {'pendientes': 0, 'validados': 0, 'rechazados': 0},
                    'tarifas': {'pendientes': 0, 'validados': 0, 'rechazados': 0}
                },
                'trazabilidad': [{
                    'evento': 'INICIO_PROCESAMIENTO',
                    'fecha': datetime.now(),
                    'detalles': f'Procesando factura {num_factura}'
                }]
            }
            
            # Procesar usuarios y sus servicios
            usuarios_procesados = self._procesar_usuarios(archivo_json.get('usuarios', []))
            transaccion['usuarios'] = usuarios_procesados['usuarios']
            transaccion['estadisticas'] = usuarios_procesados['estadisticas']
            transaccion['validaciones'] = usuarios_procesados['validaciones']
            
            # Guardar transacción
            self.db.rips_transacciones.insert_one(transaccion)
            resultado['transaccion_id'] = str(transaccion['_id'])
            resultado['exitosos'] = usuarios_procesados['estadisticas']['total_servicios']
            
            # Iniciar validaciones asíncronas
            self._iniciar_validaciones_async(transaccion['_id'])
            
            # Actualizar estado
            self.db.rips_transacciones.update_one(
                {'_id': transaccion['_id']},
                {
                    '$set': {'estado_procesamiento': 'VALIDANDO'},
                    '$push': {
                        'trazabilidad': {
                            'evento': 'PROCESAMIENTO_COMPLETADO',
                            'fecha': datetime.now(),
                            'detalles': f'Procesados {resultado["exitosos"]} servicios'
                        }
                    }
                }
            )
            
        except Exception as e:
            logger.error(f"Error procesando RIPS: {str(e)}")
            resultado['errores'] += 1
            resultado['detalles'].append({
                'tipo': 'ERROR_GENERAL',
                'mensaje': str(e)
            })
        
        finally:
            fin = datetime.now()
            resultado['tiempo_procesamiento'] = (fin - inicio).total_seconds()
            
        return resultado
    
    def _procesar_usuarios(self, usuarios: List[Dict]) -> Dict[str, Any]:
        """
        Procesa lista de usuarios con sus servicios
        Estructura optimizada para consultas NoSQL
        """
        resultado = {
            'usuarios': [],
            'estadisticas': {
                'total_usuarios': 0,
                'total_servicios': 0,
                'valor_total': 0,
                'distribucion_servicios': {
                    'consultas': 0,
                    'procedimientos': 0,
                    'medicamentos': 0,
                    'urgencias': 0,
                    'hospitalizacion': 0,
                    'otros': 0
                }
            },
            'validaciones': {
                'bdua': {'pendientes': 0, 'validados': 0, 'rechazados': 0},
                'cups': {'pendientes': 0, 'validados': 0, 'rechazados': 0},
                'tarifas': {'pendientes': 0, 'validados': 0, 'rechazados': 0}
            }
        }
        
        for usuario_data in usuarios:
            usuario_procesado = {
                '_id': ObjectId(),
                'tipo_documento': usuario_data.get('tipoDocumentoIdentificacion'),
                'numero_documento': usuario_data.get('numDocumentoIdentificacion'),
                'datos_personales': {
                    'primer_apellido': usuario_data.get('primerApellido'),
                    'segundo_apellido': usuario_data.get('segundoApellido'),
                    'primer_nombre': usuario_data.get('primerNombre'),
                    'segundo_nombre': usuario_data.get('segundoNombre'),
                    'fecha_nacimiento': usuario_data.get('fechaNacimiento'),
                    'sexo': usuario_data.get('sexo'),
                    'tipo_usuario': usuario_data.get('tipoUsuario'),
                    'municipio_residencia': usuario_data.get('codMunicipioResidencia')
                },
                'servicios': self._estructurar_servicios(usuario_data),
                'validacion_bdua': {
                    'estado': 'PENDIENTE',
                    'fecha_validacion': None,
                    'tiene_derechos': None,
                    'regimen': None,
                    'eps_actual': None
                },
                'estadisticas_usuario': {
                    'total_servicios': 0,
                    'valor_total': 0
                }
            }
            
            # Calcular estadísticas del usuario
            for tipo_servicio, servicios in usuario_procesado['servicios'].items():
                cantidad = len(servicios)
                usuario_procesado['estadisticas_usuario']['total_servicios'] += cantidad
                resultado['estadisticas']['distribucion_servicios'][tipo_servicio] = \
                    resultado['estadisticas']['distribucion_servicios'].get(tipo_servicio, 0) + cantidad
                
                for servicio in servicios:
                    valor = servicio.get('valorTotal', 0)
                    usuario_procesado['estadisticas_usuario']['valor_total'] += valor
                    resultado['estadisticas']['valor_total'] += valor
            
            resultado['usuarios'].append(usuario_procesado)
            resultado['estadisticas']['total_usuarios'] += 1
            resultado['estadisticas']['total_servicios'] += usuario_procesado['estadisticas_usuario']['total_servicios']
            resultado['validaciones']['bdua']['pendientes'] += 1
            
        return resultado
    
    def _estructurar_servicios(self, usuario_data: Dict) -> Dict[str, List]:
        """
        Estructura servicios por tipo para consultas eficientes
        """
        servicios = {
            'consultas': [],
            'procedimientos': [],
            'medicamentos': [],
            'urgencias': [],
            'hospitalizacion': [],
            'otros': [],
            'recien_nacidos': []
        }
        
        # Procesar consultas
        if 'consultas' in usuario_data:
            for consulta in usuario_data['consultas']:
                servicios['consultas'].append({
                    '_id': ObjectId(),
                    'fecha_consulta': consulta.get('fechaConsulta'),
                    'tipo_consulta': consulta.get('tipoConsulta'),
                    'codigo_consulta': consulta.get('codConsulta'),
                    'finalidad': consulta.get('finalidadConsulta'),
                    'causa_externa': consulta.get('causaExterna'),
                    'diagnostico_principal': consulta.get('codDiagnosticoPrincipal'),
                    'diagnosticos_relacionados': [
                        consulta.get('codDiagnosticoRelacionado1'),
                        consulta.get('codDiagnosticoRelacionado2'),
                        consulta.get('codDiagnosticoRelacionado3')
                    ],
                    'tipo_diagnostico': consulta.get('tipoDiagnosticoPrincipal'),
                    'valor_consulta': consulta.get('valorConsulta', 0),
                    'valor_total': consulta.get('valorTotal', 0),
                    'validaciones': {
                        'cups': {'estado': 'PENDIENTE', 'mensaje': ''},
                        'tarifa': {'estado': 'PENDIENTE', 'mensaje': ''}
                    }
                })
        
        # Procesar procedimientos
        if 'procedimientos' in usuario_data:
            for proc in usuario_data['procedimientos']:
                servicios['procedimientos'].append({
                    '_id': ObjectId(),
                    'fecha_procedimiento': proc.get('fechaProcedimiento'),
                    'numero_autorizacion': proc.get('numAutorizacion'),
                    'codigo_procedimiento': proc.get('codProcedimiento'),
                    'via_acceso': proc.get('viaAcceso'),
                    'modalidad': proc.get('modalidadProcedimiento'),
                    'grupo_servicios': proc.get('grupoServicios'),
                    'codigo_servicio': proc.get('codServicio'),
                    'finalidad': proc.get('finalidadProcedimiento'),
                    'personal_atiende': proc.get('personalAtiende'),
                    'diagnostico_principal': proc.get('codDiagnosticoPrincipal'),
                    'diagnostico_relacionado': proc.get('codDiagnosticoRelacionado'),
                    'complicacion': proc.get('codComplicacion'),
                    'valor_procedimiento': proc.get('valorProcedimiento', 0),
                    'validaciones': {
                        'cups': {'estado': 'PENDIENTE', 'mensaje': ''},
                        'autorizacion': {'estado': 'PENDIENTE', 'mensaje': ''},
                        'tarifa': {'estado': 'PENDIENTE', 'mensaje': ''}
                    }
                })
        
        # Procesar medicamentos
        if 'medicamentos' in usuario_data:
            for med in usuario_data['medicamentos']:
                servicios['medicamentos'].append({
                    '_id': ObjectId(),
                    'numero_autorizacion': med.get('numAutorizacion'),
                    'codigo_medicamento': med.get('codMedicamento'),
                    'tipo_medicamento': med.get('tipoMedicamento'),
                    'descripcion': med.get('descripcionMedicamento'),
                    'forma_farmaceutica': med.get('formaFarmaceutica'),
                    'concentracion': med.get('concentracionMedicamento'),
                    'unidad_medida': med.get('unidadMedida'),
                    'cantidad': med.get('cantidadMedicamento', 0),
                    'valor_unitario': med.get('valorUnitario', 0),
                    'valor_total': med.get('valorTotal', 0),
                    'validaciones': {
                        'cum': {'estado': 'PENDIENTE', 'mensaje': ''},
                        'autorizacion': {'estado': 'PENDIENTE', 'mensaje': ''},
                        'tarifa': {'estado': 'PENDIENTE', 'mensaje': ''}
                    }
                })
        
        # TODO: Procesar otros tipos de servicios (urgencias, hospitalización, etc.)
        
        return servicios
    
    def _iniciar_validaciones_async(self, transaccion_id: ObjectId):
        """
        Inicia validaciones asíncronas contra catálogos
        En producción esto debería usar Celery
        """
        # Por ahora solo marcamos como pendiente
        logger.info(f"Validaciones pendientes para transacción {transaccion_id}")
        
    def consultar_estado_transaccion(self, transaccion_id: str) -> Dict[str, Any]:
        """
        Consulta el estado actual de una transacción RIPS
        """
        try:
            transaccion = self.db.rips_transacciones.find_one(
                {'_id': ObjectId(transaccion_id)},
                {
                    'numero_factura': 1,
                    'estado_procesamiento': 1,
                    'estadisticas': 1,
                    'validaciones': 1,
                    'fecha_radicacion': 1,
                    'trazabilidad': {'$slice': -5}  # Últimos 5 eventos
                }
            )
            
            if transaccion:
                transaccion['_id'] = str(transaccion['_id'])
                return transaccion
            
            return {'error': 'Transacción no encontrada'}
            
        except Exception as e:
            logger.error(f"Error consultando transacción: {str(e)}")
            return {'error': str(e)}