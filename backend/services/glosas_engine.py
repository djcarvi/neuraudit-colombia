# -*- coding: utf-8 -*-
"""
Motor de Glosas NoSQL para NeurAudit Colombia
Implementación de la Resolución 2284 de 2023
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging
from .mongodb_service import MongoDBService
from bson import ObjectId

logger = logging.getLogger('neuraudit.services.glosas')


class GlosasEngine:
    """
    Motor de glosas optimizado para procesar validaciones masivas
    según la Resolución 2284 de 2023
    """
    
    # Catálogo de códigos de glosa según resolución
    CODIGOS_GLOSA = {
        'FA': {  # Facturación
            'nombre': 'Facturación',
            'codigos': {
                'FA0101': 'Estancia no corresponde con el servicio',
                'FA0201': 'Consulta no corresponde con el servicio',
                'FA0301': 'Honorarios no corresponden con el servicio',
                'FA0501': 'Derechos de sala no corresponden',
                'FA0601': 'Dispositivos médicos no corresponden',
                'FA0701': 'Medicamentos no corresponden',
                'FA0801': 'Apoyo diagnóstico no corresponde',
                # ... más códigos
            }
        },
        'TA': {  # Tarifas
            'nombre': 'Tarifas',
            'codigos': {
                'TA0101': 'Tarifa de estancia diferente a la pactada',
                'TA0201': 'Tarifa de consulta diferente a la pactada',
                'TA0301': 'Honorarios diferentes a lo pactado',
                'TA0701': 'Tarifa medicamentos diferente a la pactada',
                # ... más códigos
            }
        },
        'SO': {  # Soportes
            'nombre': 'Soportes',
            'codigos': {
                'SO0101': 'Sin soporte de estancia',
                'SO0201': 'Sin soporte de consulta',
                'SO0601': 'Sin soporte de dispositivos médicos',
                'SO0701': 'Sin soporte de medicamentos',
                'SO3401': 'Sin epicrisis o resumen de atención',
                # ... más códigos
            }
        },
        'AU': {  # Autorizaciones
            'nombre': 'Autorizaciones',
            'codigos': {
                'AU0101': 'Días de estancia no autorizados',
                'AU0201': 'Consulta no autorizada',
                'AU0701': 'Medicamento no autorizado',
                'AU2101': 'Sin número de autorización',
                # ... más códigos
            }
        },
        'CO': {  # Cobertura
            'nombre': 'Cobertura',
            'codigos': {
                'CO0101': 'Estancia no incluida en cobertura',
                'CO0201': 'Consulta no incluida en cobertura',
                'CO0701': 'Medicamento no incluido en cobertura',
                # ... más códigos
            }
        },
        'CL': {  # Calidad/Pertinencia
            'nombre': 'Calidad',
            'codigos': {
                'CL0101': 'Estancia no pertinente',
                'CL0201': 'Consulta no pertinente',
                'CL0701': 'Medicamento no pertinente',
                'CL5301': 'No es atención de urgencia',
                # ... más códigos
            }
        },
        'SA': {  # Seguimiento de Acuerdos
            'nombre': 'Seguimiento de Acuerdos',
            'codigos': {
                'SA5401': 'Incumplimiento indicadores de seguimiento',
                'SA5501': 'Ajuste frente a desviación nota técnica',
                'SA5601': 'Incumplimiento indicadores calidad',
                # ... más códigos
            }
        }
    }
    
    def __init__(self):
        self.mongo = MongoDBService()
        self.db = self.mongo.db
    
    def aplicar_glosa(self, servicio_id: str, glosa_data: Dict) -> Dict[str, Any]:
        """
        Aplica una glosa a un servicio específico
        
        Args:
            servicio_id: ID del servicio a glosar
            glosa_data: {
                'codigo_glosa': 'FA0101',
                'valor_glosado': 50000,
                'observaciones': 'Descripción detallada',
                'auditor_id': 'user_id',
                'tipo_servicio': 'consulta',
                'factura_id': 'id_factura'
            }
        
        Returns:
            Dict con resultado de la operación
        """
        try:
            # Validar código de glosa
            tipo_glosa = glosa_data['codigo_glosa'][:2]
            if tipo_glosa not in self.CODIGOS_GLOSA:
                return {
                    'success': False,
                    'error': f'Tipo de glosa {tipo_glosa} no válido'
                }
            
            # Crear documento de glosa
            glosa = {
                '_id': ObjectId(),
                'servicio_id': ObjectId(servicio_id),
                'factura_id': ObjectId(glosa_data['factura_id']),
                'codigo_glosa': glosa_data['codigo_glosa'],
                'tipo_glosa': tipo_glosa,
                'descripcion': self._obtener_descripcion_glosa(glosa_data['codigo_glosa']),
                'valor_glosado': glosa_data['valor_glosado'],
                'observaciones': glosa_data['observaciones'],
                'auditor': {
                    'id': glosa_data['auditor_id'],
                    'nombre': glosa_data.get('auditor_nombre', ''),
                    'perfil': glosa_data.get('auditor_perfil', 'AUDITOR_MEDICO')
                },
                'fecha_aplicacion': datetime.now(),
                'estado': 'APLICADA',
                'estado_conciliacion': 'PENDIENTE',
                'respuesta_prestador': None,
                'fecha_limite_respuesta': datetime.now() + timedelta(days=5),  # 5 días hábiles
                'historial': [{
                    'evento': 'GLOSA_APLICADA',
                    'fecha': datetime.now(),
                    'usuario': glosa_data['auditor_id'],
                    'detalles': f'Glosa {glosa_data["codigo_glosa"]} aplicada'
                }]
            }
            
            # Insertar glosa
            resultado = self.db.glosas_oficiales.insert_one(glosa)
            
            # Actualizar el servicio
            self._actualizar_servicio_con_glosa(
                servicio_id,
                glosa_data['factura_id'],
                glosa_data['tipo_servicio'],
                glosa
            )
            
            # Actualizar estadísticas de la factura
            self._actualizar_estadisticas_factura(glosa_data['factura_id'])
            
            # Registrar en trazabilidad
            self._registrar_trazabilidad(glosa)
            
            return {
                'success': True,
                'glosa_id': str(resultado.inserted_id),
                'mensaje': f'Glosa {glosa_data["codigo_glosa"]} aplicada exitosamente'
            }
            
        except Exception as e:
            logger.error(f"Error aplicando glosa: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def procesar_glosas_automaticas(self, factura_id: str) -> Dict[str, Any]:
        """
        Procesa glosas automáticas basadas en reglas predefinidas
        Útil para validaciones masivas de cumplimiento normativo
        """
        resultado = {
            'glosas_aplicadas': 0,
            'valor_total_glosado': 0,
            'detalles': []
        }
        
        try:
            # Obtener factura con todos sus servicios
            factura = self.db.facturas_radicadas.find_one({'_id': ObjectId(factura_id)})
            if not factura:
                return {'error': 'Factura no encontrada'}
            
            # Reglas de glosas automáticas
            reglas = self._obtener_reglas_automaticas()
            
            # Evaluar cada servicio contra las reglas
            for tipo_servicio in ['consultas', 'procedimientos', 'medicamentos']:
                servicios = factura.get(tipo_servicio, [])
                
                for servicio in servicios:
                    glosas_servicio = self._evaluar_reglas_servicio(
                        servicio,
                        tipo_servicio,
                        reglas
                    )
                    
                    for glosa in glosas_servicio:
                        # Aplicar glosa automática
                        glosa['auditor_id'] = 'sistema.automatico'
                        glosa['auditor_nombre'] = 'Sistema Automático'
                        glosa['factura_id'] = factura_id
                        glosa['tipo_servicio'] = tipo_servicio
                        
                        aplicacion = self.aplicar_glosa(str(servicio['_id']), glosa)
                        
                        if aplicacion['success']:
                            resultado['glosas_aplicadas'] += 1
                            resultado['valor_total_glosado'] += glosa['valor_glosado']
                            resultado['detalles'].append({
                                'servicio_id': str(servicio['_id']),
                                'codigo_glosa': glosa['codigo_glosa'],
                                'valor': glosa['valor_glosado']
                            })
            
            return resultado
            
        except Exception as e:
            logger.error(f"Error en glosas automáticas: {str(e)}")
            return {'error': str(e)}
    
    def consultar_glosas_auditor(self, auditor_id: str, filtros: Dict = None) -> List[Dict]:
        """
        Consulta glosas aplicadas por un auditor específico
        con filtros opcionales
        """
        query = {'auditor.id': auditor_id}
        
        if filtros:
            if 'fecha_inicio' in filtros and 'fecha_fin' in filtros:
                query['fecha_aplicacion'] = {
                    '$gte': filtros['fecha_inicio'],
                    '$lte': filtros['fecha_fin']
                }
            
            if 'estado' in filtros:
                query['estado'] = filtros['estado']
            
            if 'tipo_glosa' in filtros:
                query['tipo_glosa'] = filtros['tipo_glosa']
        
        # Agregación para obtener información completa
        pipeline = [
            {'$match': query},
            {
                '$lookup': {
                    'from': 'facturas_radicadas',
                    'localField': 'factura_id',
                    'foreignField': '_id',
                    'as': 'factura_info'
                }
            },
            {'$unwind': '$factura_info'},
            {
                '$project': {
                    'codigo_glosa': 1,
                    'descripcion': 1,
                    'valor_glosado': 1,
                    'fecha_aplicacion': 1,
                    'estado': 1,
                    'estado_conciliacion': 1,
                    'factura': {
                        'numero': '$factura_info.numero_factura',
                        'prestador': '$factura_info.prestador_nombre'
                    }
                }
            },
            {'$sort': {'fecha_aplicacion': -1}},
            {'$limit': 100}
        ]
        
        try:
            glosas = list(self.db.glosas_oficiales.aggregate(pipeline))
            
            # Convertir ObjectId a string
            for glosa in glosas:
                glosa['_id'] = str(glosa['_id'])
            
            return glosas
            
        except Exception as e:
            logger.error(f"Error consultando glosas: {str(e)}")
            return []
    
    def obtener_estadisticas_glosas(self, fecha_inicio: datetime, fecha_fin: datetime) -> Dict[str, Any]:
        """
        Obtiene estadísticas agregadas de glosas para dashboard
        """
        pipeline = [
            {
                '$match': {
                    'fecha_aplicacion': {
                        '$gte': fecha_inicio,
                        '$lte': fecha_fin
                    }
                }
            },
            {
                '$facet': {
                    # Por tipo de glosa
                    'por_tipo': [
                        {
                            '$group': {
                                '_id': '$tipo_glosa',
                                'cantidad': {'$sum': 1},
                                'valor_total': {'$sum': '$valor_glosado'}
                            }
                        },
                        {'$sort': {'valor_total': -1}}
                    ],
                    # Por estado
                    'por_estado': [
                        {
                            '$group': {
                                '_id': '$estado_conciliacion',
                                'cantidad': {'$sum': 1},
                                'valor_total': {'$sum': '$valor_glosado'}
                            }
                        }
                    ],
                    # Por auditor (top 10)
                    'por_auditor': [
                        {
                            '$group': {
                                '_id': '$auditor.nombre',
                                'cantidad': {'$sum': 1},
                                'valor_total': {'$sum': '$valor_glosado'}
                            }
                        },
                        {'$sort': {'valor_total': -1}},
                        {'$limit': 10}
                    ],
                    # Totales
                    'totales': [
                        {
                            '$group': {
                                '_id': None,
                                'total_glosas': {'$sum': 1},
                                'valor_total': {'$sum': '$valor_glosado'},
                                'promedio_glosa': {'$avg': '$valor_glosado'}
                            }
                        }
                    ]
                }
            }
        ]
        
        try:
            resultado = list(self.db.glosas_oficiales.aggregate(pipeline))[0]
            return {
                'por_tipo': resultado.get('por_tipo', []),
                'por_estado': resultado.get('por_estado', []),
                'top_auditores': resultado.get('por_auditor', []),
                'totales': resultado.get('totales', [{}])[0]
            }
            
        except Exception as e:
            logger.error(f"Error en estadísticas de glosas: {str(e)}")
            return {}
    
    def _obtener_descripcion_glosa(self, codigo: str) -> str:
        """Obtiene la descripción de un código de glosa"""
        tipo = codigo[:2]
        if tipo in self.CODIGOS_GLOSA:
            return self.CODIGOS_GLOSA[tipo]['codigos'].get(
                codigo,
                'Código de glosa no especificado'
            )
        return 'Código de glosa no válido'
    
    def _actualizar_servicio_con_glosa(self, servicio_id: str, factura_id: str, 
                                      tipo_servicio: str, glosa: Dict):
        """Actualiza el servicio con la información de la glosa"""
        # Actualizar en la colección de servicios facturados
        self.db.servicios_facturados.update_one(
            {'_id': ObjectId(servicio_id)},
            {
                '$set': {
                    'tiene_glosa': True,
                    'valor_glosado': glosa['valor_glosado']
                },
                '$push': {
                    'glosas': {
                        'glosa_id': glosa['_id'],
                        'codigo': glosa['codigo_glosa'],
                        'valor': glosa['valor_glosado'],
                        'fecha': glosa['fecha_aplicacion']
                    }
                }
            }
        )
    
    def _actualizar_estadisticas_factura(self, factura_id: str):
        """Actualiza las estadísticas de glosas en la factura"""
        # Calcular totales de glosas
        pipeline = [
            {'$match': {'factura_id': ObjectId(factura_id)}},
            {
                '$group': {
                    '_id': None,
                    'total_glosas': {'$sum': 1},
                    'valor_total_glosado': {'$sum': '$valor_glosado'}
                }
            }
        ]
        
        estadisticas = list(self.db.glosas_oficiales.aggregate(pipeline))
        
        if estadisticas:
            self.db.facturas_radicadas.update_one(
                {'_id': ObjectId(factura_id)},
                {
                    '$set': {
                        'total_glosas': estadisticas[0]['total_glosas'],
                        'valor_total_glosado': estadisticas[0]['valor_total_glosado'],
                        'estado_auditoria': 'CON_GLOSAS'
                    }
                }
            )
    
    def _registrar_trazabilidad(self, glosa: Dict):
        """Registra la aplicación de glosa en trazabilidad"""
        trazabilidad = {
            'tipo_evento': 'GLOSA_APLICADA',
            'fecha': datetime.now(),
            'entidad': 'glosas_oficiales',
            'entidad_id': glosa['_id'],
            'usuario_id': glosa['auditor']['id'],
            'detalles': {
                'codigo_glosa': glosa['codigo_glosa'],
                'valor': glosa['valor_glosado'],
                'servicio_id': glosa['servicio_id']
            }
        }
        
        self.db.trazabilidad_auditoria.insert_one(trazabilidad)
    
    def _obtener_reglas_automaticas(self) -> List[Dict]:
        """
        Obtiene las reglas de glosas automáticas configuradas
        En producción estas vendrían de una colección de configuración
        """
        return [
            {
                'tipo': 'SO3401',
                'descripcion': 'Sin epicrisis para hospitalización',
                'condicion': lambda s, t: t == 'hospitalizacion' and not s.get('tiene_epicrisis'),
                'valor_glosa': lambda s: s.get('valor_total', 0)
            },
            {
                'tipo': 'AU2101',
                'descripcion': 'Sin número de autorización',
                'condicion': lambda s, t: not s.get('numero_autorizacion'),
                'valor_glosa': lambda s: s.get('valor_total', 0)
            },
            {
                'tipo': 'TA0701',
                'descripcion': 'Tarifa medicamento supera tope',
                'condicion': lambda s, t: t == 'medicamentos' and s.get('valor_unitario', 0) > s.get('valor_tope', 999999),
                'valor_glosa': lambda s: s.get('valor_unitario', 0) - s.get('valor_tope', 0)
            }
        ]
    
    def _evaluar_reglas_servicio(self, servicio: Dict, tipo_servicio: str, 
                                reglas: List[Dict]) -> List[Dict]:
        """Evalúa un servicio contra las reglas de glosas automáticas"""
        glosas = []
        
        for regla in reglas:
            if regla['condicion'](servicio, tipo_servicio):
                glosas.append({
                    'codigo_glosa': regla['tipo'],
                    'valor_glosado': regla['valor_glosa'](servicio),
                    'observaciones': f"Glosa automática: {regla['descripcion']}"
                })
        
        return glosas