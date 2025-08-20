# -*- coding: utf-8 -*-
"""
Servicio de Analytics NoSQL para NeurAudit Colombia
Agregaciones y análisis para dashboard ejecutivo
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging
from .mongodb_service import MongoDBService
from bson import ObjectId
import pandas as pd

logger = logging.getLogger('neuraudit.services.analytics')


class AnalyticsService:
    """
    Servicio de análisis y agregaciones MongoDB
    Optimizado para dashboards con 2M de afiliados
    """
    
    def __init__(self):
        self.mongo = MongoDBService()
        self.db = self.mongo.db
    
    def dashboard_ejecutivo(self, fecha_inicio: datetime, fecha_fin: datetime) -> Dict[str, Any]:
        """
        Genera métricas para el dashboard ejecutivo
        Optimizado para respuesta rápida con agregaciones MongoDB
        """
        try:
            # Ejecutar agregaciones en paralelo usando $facet
            pipeline = [
                {
                    '$match': {
                        'fecha_radicacion': {
                            '$gte': fecha_inicio,
                            '$lte': fecha_fin
                        }
                    }
                },
                {
                    '$facet': {
                        # KPIs principales
                        'kpis': [
                            {
                                '$group': {
                                    '_id': None,
                                    'total_radicaciones': {'$sum': 1},
                                    'valor_total_radicado': {'$sum': '$valor_total'},
                                    'valor_promedio': {'$avg': '$valor_total'},
                                    'total_facturas': {'$sum': '$cantidad_facturas'},
                                    'total_usuarios': {'$sum': '$estadisticas.total_usuarios'}
                                }
                            }
                        ],
                        
                        # Tendencia diaria
                        'tendencia_diaria': [
                            {
                                '$group': {
                                    '_id': {
                                        '$dateToString': {
                                            'format': '%Y-%m-%d',
                                            'date': '$fecha_radicacion'
                                        }
                                    },
                                    'radicaciones': {'$sum': 1},
                                    'valor': {'$sum': '$valor_total'}
                                }
                            },
                            {'$sort': {'_id': 1}},
                            {'$limit': 30}
                        ],
                        
                        # Top 10 prestadores por valor
                        'top_prestadores': [
                            {
                                '$group': {
                                    '_id': '$prestador_nit',
                                    'razon_social': {'$first': '$prestador_nombre'},
                                    'total_radicado': {'$sum': '$valor_total'},
                                    'cantidad': {'$sum': 1}
                                }
                            },
                            {'$sort': {'total_radicado': -1}},
                            {'$limit': 10}
                        ],
                        
                        # Estado de radicaciones
                        'estados': [
                            {
                                '$group': {
                                    '_id': '$estado_procesamiento',
                                    'cantidad': {'$sum': 1},
                                    'valor': {'$sum': '$valor_total'}
                                }
                            }
                        ],
                        
                        # Glosas por tipo
                        'glosas_resumen': [
                            {'$unwind': '$glosas_aplicadas'},
                            {
                                '$group': {
                                    '_id': '$glosas_aplicadas.tipo_glosa',
                                    'cantidad': {'$sum': 1},
                                    'valor_glosado': {'$sum': '$glosas_aplicadas.valor'}
                                }
                            },
                            {'$sort': {'valor_glosado': -1}}
                        ]
                    }
                }
            ]
            
            # Ejecutar agregación
            resultado = list(self.db.radicaciones.aggregate(
                pipeline,
                allowDiskUse=True
            ))[0]
            
            # Procesar resultados
            kpis = resultado['kpis'][0] if resultado['kpis'] else {}
            
            # Calcular métricas adicionales
            if kpis:
                total_radicado = kpis.get('valor_total_radicado', 0)
                
                # Obtener valor glosado total
                valor_glosado = sum(g.get('valor_glosado', 0) 
                                  for g in resultado.get('glosas_resumen', []))
                
                kpis['porcentaje_glosa'] = (valor_glosado / total_radicado * 100) if total_radicado > 0 else 0
                kpis['valor_neto'] = total_radicado - valor_glosado
            
            return {
                'kpis': kpis,
                'tendencia': resultado.get('tendencia_diaria', []),
                'prestadores': resultado.get('top_prestadores', []),
                'estados': resultado.get('estados', []),
                'glosas': resultado.get('glosas_resumen', [])
            }
            
        except Exception as e:
            logger.error(f"Error en dashboard ejecutivo: {str(e)}")
            return {}
    
    def analisis_prestador(self, prestador_nit: str, periodo: int = 6) -> Dict[str, Any]:
        """
        Análisis detallado de un prestador específico
        
        Args:
            prestador_nit: NIT del prestador
            periodo: Meses a analizar (default 6)
        """
        fecha_inicio = datetime.now() - timedelta(days=periodo * 30)
        
        pipeline = [
            {
                '$match': {
                    'prestador_nit': prestador_nit,
                    'fecha_radicacion': {'$gte': fecha_inicio}
                }
            },
            {
                '$facet': {
                    # Información general
                    'info_general': [
                        {
                            '$group': {
                                '_id': None,
                                'razon_social': {'$first': '$prestador_nombre'},
                                'total_radicaciones': {'$sum': 1},
                                'valor_total': {'$sum': '$valor_total'},
                                'promedio_radicacion': {'$avg': '$valor_total'},
                                'total_servicios': {'$sum': '$estadisticas.total_servicios'}
                            }
                        }
                    ],
                    
                    # Tendencia mensual
                    'tendencia_mensual': [
                        {
                            '$group': {
                                '_id': {
                                    '$dateToString': {
                                        'format': '%Y-%m',
                                        'date': '$fecha_radicacion'
                                    }
                                },
                                'radicaciones': {'$sum': 1},
                                'valor': {'$sum': '$valor_total'},
                                'servicios': {'$sum': '$estadisticas.total_servicios'}
                            }
                        },
                        {'$sort': {'_id': 1}}
                    ],
                    
                    # Distribución de servicios
                    'distribucion_servicios': [
                        {
                            '$project': {
                                'consultas': '$estadisticas.distribucion_servicios.consultas',
                                'procedimientos': '$estadisticas.distribucion_servicios.procedimientos',
                                'medicamentos': '$estadisticas.distribucion_servicios.medicamentos',
                                'urgencias': '$estadisticas.distribucion_servicios.urgencias',
                                'hospitalizacion': '$estadisticas.distribucion_servicios.hospitalizacion'
                            }
                        },
                        {
                            '$group': {
                                '_id': None,
                                'consultas': {'$sum': '$consultas'},
                                'procedimientos': {'$sum': '$procedimientos'},
                                'medicamentos': {'$sum': '$medicamentos'},
                                'urgencias': {'$sum': '$urgencias'},
                                'hospitalizacion': {'$sum': '$hospitalizacion'}
                            }
                        }
                    ],
                    
                    # Análisis de glosas
                    'analisis_glosas': [
                        {'$unwind': '$glosas_aplicadas'},
                        {
                            '$group': {
                                '_id': '$glosas_aplicadas.tipo_glosa',
                                'cantidad': {'$sum': 1},
                                'valor': {'$sum': '$glosas_aplicadas.valor'}
                            }
                        },
                        {'$sort': {'valor': -1}},
                        {'$limit': 5}
                    ],
                    
                    # Tiempos de respuesta
                    'tiempos_respuesta': [
                        {
                            '$match': {
                                'glosas_aplicadas': {'$exists': True, '$ne': []}
                            }
                        },
                        {
                            '$project': {
                                'tiempo_respuesta': {
                                    '$subtract': ['$fecha_respuesta_glosas', '$fecha_aplicacion_glosas']
                                }
                            }
                        },
                        {
                            '$group': {
                                '_id': None,
                                'promedio_dias': {
                                    '$avg': {
                                        '$divide': ['$tiempo_respuesta', 1000 * 60 * 60 * 24]
                                    }
                                },
                                'max_dias': {
                                    '$max': {
                                        '$divide': ['$tiempo_respuesta', 1000 * 60 * 60 * 24]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
        
        try:
            resultado = list(self.db.radicaciones.aggregate(pipeline))[0]
            
            # Calcular indicadores adicionales
            info = resultado['info_general'][0] if resultado['info_general'] else {}
            
            if info:
                # Tasa de glosa
                total_glosas = sum(g.get('valor', 0) 
                                 for g in resultado.get('analisis_glosas', []))
                info['tasa_glosa'] = (total_glosas / info['valor_total'] * 100) if info['valor_total'] > 0 else 0
                
                # Calcular tendencia (crecimiento/decrecimiento)
                tendencia = resultado.get('tendencia_mensual', [])
                if len(tendencia) >= 2:
                    ultimo_mes = tendencia[-1]['valor']
                    penultimo_mes = tendencia[-2]['valor']
                    info['tendencia_porcentaje'] = ((ultimo_mes - penultimo_mes) / penultimo_mes * 100) if penultimo_mes > 0 else 0
            
            return {
                'informacion_general': info,
                'tendencia': resultado.get('tendencia_mensual', []),
                'servicios': resultado.get('distribucion_servicios', [{}])[0],
                'glosas': resultado.get('analisis_glosas', []),
                'tiempos': resultado.get('tiempos_respuesta', [{}])[0]
            }
            
        except Exception as e:
            logger.error(f"Error en análisis prestador: {str(e)}")
            return {}
    
    def reporte_auditores(self, fecha_inicio: datetime, fecha_fin: datetime) -> List[Dict]:
        """
        Genera reporte de productividad de auditores
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
                '$group': {
                    '_id': {
                        'auditor_id': '$auditor.id',
                        'auditor_nombre': '$auditor.nombre',
                        'perfil': '$auditor.perfil'
                    },
                    'total_glosas': {'$sum': 1},
                    'valor_glosado': {'$sum': '$valor_glosado'},
                    'tipos_glosa': {'$addToSet': '$tipo_glosa'},
                    'promedio_glosa': {'$avg': '$valor_glosado'}
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'auditor_id': '$_id.auditor_id',
                    'nombre': '$_id.auditor_nombre',
                    'perfil': '$_id.perfil',
                    'total_glosas': 1,
                    'valor_glosado': 1,
                    'promedio_glosa': 1,
                    'diversidad_glosas': {'$size': '$tipos_glosa'}
                }
            },
            {
                '$sort': {'valor_glosado': -1}
            }
        ]
        
        try:
            auditores = list(self.db.glosas_oficiales.aggregate(pipeline))
            
            # Calcular métricas adicionales
            if auditores:
                total_general = sum(a['valor_glosado'] for a in auditores)
                
                for auditor in auditores:
                    auditor['participacion'] = (auditor['valor_glosado'] / total_general * 100) if total_general > 0 else 0
                    
                    # Calcular eficiencia (glosas por día laboral)
                    dias_laborales = (fecha_fin - fecha_inicio).days * 5/7  # Aproximado
                    auditor['glosas_por_dia'] = auditor['total_glosas'] / dias_laborales if dias_laborales > 0 else 0
            
            return auditores
            
        except Exception as e:
            logger.error(f"Error en reporte auditores: {str(e)}")
            return []
    
    def proyeccion_recaudo(self, periodo_meses: int = 3) -> Dict[str, Any]:
        """
        Proyecta el recaudo esperado basado en históricos
        """
        fecha_inicio = datetime.now() - timedelta(days=periodo_meses * 30)
        
        pipeline = [
            {
                '$match': {
                    'fecha_radicacion': {'$gte': fecha_inicio}
                }
            },
            {
                '$group': {
                    '_id': {
                        'mes': {'$month': '$fecha_radicacion'},
                        'año': {'$year': '$fecha_radicacion'}
                    },
                    'radicado': {'$sum': '$valor_total'},
                    'glosado': {'$sum': '$valor_total_glosado'},
                    'pagado': {'$sum': '$valor_pagado'},
                    'cantidad': {'$sum': 1}
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'periodo': {
                        '$concat': [
                            {'$toString': '$_id.año'},
                            '-',
                            {'$cond': [
                                {'$lt': ['$_id.mes', 10]},
                                {'$concat': ['0', {'$toString': '$_id.mes'}]},
                                {'$toString': '$_id.mes'}
                            ]}
                        ]
                    },
                    'radicado': 1,
                    'glosado': 1,
                    'pagado': 1,
                    'neto': {'$subtract': ['$radicado', '$glosado']},
                    'tasa_glosa': {
                        '$multiply': [
                            {'$divide': ['$glosado', '$radicado']},
                            100
                        ]
                    },
                    'tasa_pago': {
                        '$cond': [
                            {'$gt': [{'$subtract': ['$radicado', '$glosado']}, 0]},
                            {
                                '$multiply': [
                                    {'$divide': [
                                        '$pagado',
                                        {'$subtract': ['$radicado', '$glosado']}
                                    ]},
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            {'$sort': {'periodo': 1}}
        ]
        
        try:
            historico = list(self.db.radicaciones.aggregate(pipeline))
            
            if not historico:
                return {'error': 'Sin datos históricos para proyección'}
            
            # Calcular promedios para proyección
            promedio_radicado = sum(h['radicado'] for h in historico) / len(historico)
            promedio_tasa_glosa = sum(h['tasa_glosa'] for h in historico) / len(historico)
            promedio_tasa_pago = sum(h['tasa_pago'] for h in historico) / len(historico)
            
            # Generar proyección próximos 3 meses
            proyeccion = []
            fecha_actual = datetime.now()
            
            for i in range(1, 4):
                fecha_proyeccion = fecha_actual + timedelta(days=i * 30)
                radicado_proyectado = promedio_radicado * (1 + (i * 0.02))  # 2% crecimiento mensual
                glosado_proyectado = radicado_proyectado * (promedio_tasa_glosa / 100)
                neto_proyectado = radicado_proyectado - glosado_proyectado
                pagado_proyectado = neto_proyectado * (promedio_tasa_pago / 100)
                
                proyeccion.append({
                    'periodo': fecha_proyeccion.strftime('%Y-%m'),
                    'radicado_proyectado': radicado_proyectado,
                    'glosado_proyectado': glosado_proyectado,
                    'neto_proyectado': neto_proyectado,
                    'pagado_proyectado': pagado_proyectado,
                    'es_proyeccion': True
                })
            
            return {
                'historico': historico,
                'proyeccion': proyeccion,
                'resumen': {
                    'promedio_mensual_radicado': promedio_radicado,
                    'tasa_glosa_promedio': promedio_tasa_glosa,
                    'tasa_pago_promedio': promedio_tasa_pago,
                    'recaudo_proyectado_trimestre': sum(p['pagado_proyectado'] for p in proyeccion)
                }
            }
            
        except Exception as e:
            logger.error(f"Error en proyección recaudo: {str(e)}")
            return {}
    
    def alertas_vencimientos(self, dias_anticipacion: int = 5) -> List[Dict]:
        """
        Genera alertas de vencimientos próximos
        """
        fecha_limite = datetime.now() + timedelta(days=dias_anticipacion)
        
        alertas = []
        
        # Alertas de respuesta a glosas
        pipeline_glosas = [
            {
                '$match': {
                    'estado': 'APLICADA',
                    'fecha_limite_respuesta': {'$lte': fecha_limite},
                    'respuesta_prestador': None
                }
            },
            {
                '$lookup': {
                    'from': 'facturas_radicadas',
                    'localField': 'factura_id',
                    'foreignField': '_id',
                    'as': 'factura'
                }
            },
            {'$unwind': '$factura'},
            {
                '$project': {
                    'tipo_alerta': {'$literal': 'GLOSA_POR_VENCER'},
                    'codigo_glosa': 1,
                    'valor_glosado': 1,
                    'fecha_limite': '$fecha_limite_respuesta',
                    'dias_restantes': {
                        '$divide': [
                            {'$subtract': ['$fecha_limite_respuesta', datetime.now()]},
                            1000 * 60 * 60 * 24
                        ]
                    },
                    'prestador': '$factura.prestador_nombre',
                    'factura': '$factura.numero_factura'
                }
            },
            {'$sort': {'dias_restantes': 1}},
            {'$limit': 50}
        ]
        
        try:
            glosas_por_vencer = list(self.db.glosas_oficiales.aggregate(pipeline_glosas))
            
            for glosa in glosas_por_vencer:
                glosa['_id'] = str(glosa['_id'])
                glosa['prioridad'] = 'ALTA' if glosa['dias_restantes'] <= 2 else 'MEDIA'
                glosa['mensaje'] = f"Glosa {glosa['codigo_glosa']} por ${glosa['valor_glosado']:,.0f} vence en {int(glosa['dias_restantes'])} días"
                
            alertas.extend(glosas_por_vencer)
            
            # TODO: Agregar otras alertas (pagos pendientes, conciliaciones, etc.)
            
            return sorted(alertas, key=lambda x: x['dias_restantes'])
            
        except Exception as e:
            logger.error(f"Error generando alertas: {str(e)}")
            return []