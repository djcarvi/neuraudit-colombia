# -*- coding: utf-8 -*-
# apps/contratacion/services_mongodb_cups.py
"""
Servicio MongoDB puro para gestión de servicios CUPS en contratos
Implementación NoSQL directa sin ORM
"""

from pymongo import MongoClient, ASCENDING, DESCENDING, UpdateOne, InsertOne
from pymongo.errors import BulkWriteError, DuplicateKeyError
from bson import ObjectId
from datetime import datetime, date
from decimal import Decimal
from typing import Dict, List, Optional, Any
import logging

from apps.core.mongodb_config import get_mongodb, get_collection

logger = logging.getLogger('neuraudit.contratacion')


class ServiciosCUPSContractualesNoSQL:
    """
    Gestión NoSQL pura de servicios CUPS en contratos con tarifas negociadas
    """
    
    def __init__(self):
        self.db = get_mongodb().db
        self.contratos = self.db.contratos
        self.tarifarios_cups = self.db.tarifarios_cups_contractuales
        self.catalogo_cups = self.db.catalogo_cups_oficial
        self.tarifarios_iss = self.db.tarifario_iss_2001
        self.tarifarios_soat = self.db.tarifario_soat_2025
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Asegurar índices para óptimo rendimiento"""
        try:
            # Índices para tarifarios CUPS contractuales
            self.tarifarios_cups.create_index([
                ("contrato_id", ASCENDING),
                ("codigo_cups", ASCENDING)
            ], unique=True, name="idx_contrato_cups")
            
            self.tarifarios_cups.create_index([
                ("contrato_id", ASCENDING),
                ("estado", ASCENDING),
                ("vigencia_desde", DESCENDING)
            ], name="idx_contrato_vigencia")
            
            self.tarifarios_cups.create_index([
                ("codigo_cups", ASCENDING),
                ("estado", ASCENDING)
            ], name="idx_cups_estado")
            
            logger.info("✅ Índices MongoDB creados para tarifarios CUPS contractuales")
        except Exception as e:
            logger.warning(f"⚠️ Error creando índices: {str(e)}")
    
    def agregar_servicios_cups_masivo(self, contrato_id: str, servicios: List[Dict]) -> Dict[str, Any]:
        """
        Agregar múltiples servicios CUPS a un contrato con sus tarifas
        
        Args:
            contrato_id: ObjectId del contrato
            servicios: Lista de diccionarios con estructura:
                {
                    'codigo_cups': str,
                    'descripcion': str,
                    'valor_negociado': float,
                    'aplica_copago': bool,
                    'requiere_autorizacion': bool,
                    'restricciones': {...}
                }
        
        Returns:
            Resultado de la operación masiva
        """
        try:
            # Verificar contrato existe
            contrato = self.contratos.find_one({"_id": ObjectId(contrato_id)})
            if not contrato:
                return {
                    'success': False,
                    'error': f'Contrato {contrato_id} no encontrado'
                }
            
            # Obtener valores de referencia ISS/SOAT para comparación
            codigos_cups = [s['codigo_cups'] for s in servicios]
            valores_referencia = self._obtener_valores_referencia(codigos_cups, contrato.get('manual_tarifario'))
            
            # Preparar operaciones bulk
            operaciones = []
            timestamp = datetime.now()
            
            for servicio in servicios:
                codigo_cups = servicio['codigo_cups']
                
                # Calcular variación respecto a tarifa de referencia
                valor_referencia = valores_referencia.get(codigo_cups, {}).get('valor', 0)
                valor_negociado = float(servicio['valor_negociado'])
                porcentaje_variacion = 0
                if valor_referencia > 0:
                    porcentaje_variacion = ((valor_negociado - valor_referencia) / valor_referencia) * 100
                
                doc_tarifa = {
                    '_id': ObjectId(),
                    'contrato_id': ObjectId(contrato_id),
                    'numero_contrato': contrato['numero_contrato'],
                    'prestador_nit': contrato['prestador']['nit'],
                    'codigo_cups': codigo_cups,
                    'descripcion': servicio.get('descripcion', ''),
                    
                    # Valores tarifarios
                    'valor_negociado': valor_negociado,
                    'valor_referencia': valor_referencia,
                    'manual_referencia': contrato.get('manual_tarifario', 'ISS_2001'),
                    'porcentaje_variacion': round(porcentaje_variacion, 2),
                    
                    # Configuración financiera
                    'aplica_copago': servicio.get('aplica_copago', False),
                    'aplica_cuota_moderadora': servicio.get('aplica_cuota_moderadora', False),
                    'requiere_autorizacion': servicio.get('requiere_autorizacion', False),
                    
                    # Restricciones
                    'restricciones': servicio.get('restricciones', {
                        'sexo': 'AMBOS',
                        'ambito': 'AMBOS',
                        'edad_minima': None,
                        'edad_maxima': None
                    }),
                    
                    # Vigencia
                    'vigencia_desde': contrato['fecha_inicio'],
                    'vigencia_hasta': contrato['fecha_fin'],
                    'estado': 'ACTIVO',
                    
                    # Metadata
                    'created_at': timestamp,
                    'updated_at': timestamp,
                    'created_by': servicio.get('usuario_id', 'sistema')
                }
                
                # Usar ReplaceOne para actualizar si ya existe
                operaciones.append(
                    UpdateOne(
                        {
                            'contrato_id': ObjectId(contrato_id),
                            'codigo_cups': codigo_cups
                        },
                        {'$set': doc_tarifa},
                        upsert=True
                    )
                )
            
            # Ejecutar operaciones bulk
            resultado = self.tarifarios_cups.bulk_write(operaciones, ordered=False)
            
            # Actualizar lista de servicios en el contrato
            self.contratos.update_one(
                {"_id": ObjectId(contrato_id)},
                {
                    "$addToSet": {
                        "servicios_contratados": {"$each": codigos_cups}
                    },
                    "$set": {
                        "updated_at": timestamp,
                        "total_servicios_cups": len(codigos_cups)
                    }
                }
            )
            
            return {
                'success': True,
                'insertados': resultado.upserted_count,
                'actualizados': resultado.modified_count,
                'total_procesados': len(servicios),
                'contrato_actualizado': True
            }
            
        except BulkWriteError as bwe:
            return {
                'success': False,
                'error': 'Error en operación masiva',
                'detalles': bwe.details
            }
        except Exception as e:
            logger.error(f"Error agregando servicios CUPS: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _obtener_valores_referencia(self, codigos_cups: List[str], manual_tarifario: str) -> Dict[str, Dict]:
        """
        Obtener valores de referencia ISS o SOAT para lista de CUPS
        """
        valores_ref = {}
        
        if manual_tarifario == 'SOAT_2025':
            # Buscar en SOAT
            referencias = self.tarifarios_soat.find(
                {'codigo': {'$in': codigos_cups}},
                {'codigo': 1, 'valor_calculado': 1, 'descripcion': 1}
            )
            for ref in referencias:
                valores_ref[ref['codigo']] = {
                    'valor': float(ref.get('valor_calculado', 0)),
                    'descripcion': ref.get('descripcion', ''),
                    'manual': 'SOAT_2025'
                }
        else:
            # Por defecto ISS 2001
            referencias = self.tarifarios_iss.find(
                {'codigo': {'$in': codigos_cups}},
                {'codigo': 1, 'valor_referencia_actual': 1, 'descripcion': 1, 'uvr': 1}
            )
            for ref in referencias:
                # Usar valor_referencia_actual que ya calcula UVR * $1,270
                valores_ref[ref['codigo']] = {
                    'valor': float(ref.get('valor_referencia_actual', 0)),
                    'descripcion': ref.get('descripcion', ''),
                    'manual': 'ISS_2001',
                    'uvr': float(ref.get('uvr', 0)) if ref.get('uvr') else None
                }
        
        return valores_ref
    
    def buscar_tarifas_contractuales(
        self, 
        contrato_id: Optional[str] = None,
        codigo_cups: Optional[str] = None,
        prestador_nit: Optional[str] = None,
        fecha_servicio: Optional[date] = None
    ) -> List[Dict]:
        """
        Buscar tarifas CUPS contractuales con múltiples criterios
        """
        filtro = {}
        
        if contrato_id:
            filtro['contrato_id'] = ObjectId(contrato_id)
        
        if codigo_cups:
            filtro['codigo_cups'] = codigo_cups
        
        if prestador_nit:
            filtro['prestador_nit'] = prestador_nit
        
        if fecha_servicio:
            filtro['vigencia_desde'] = {'$lte': fecha_servicio}
            filtro['vigencia_hasta'] = {'$gte': fecha_servicio}
            filtro['estado'] = 'ACTIVO'
        
        # Pipeline de agregación para incluir datos relacionados
        pipeline = [
            {'$match': filtro},
            {
                '$lookup': {
                    'from': 'catalogo_cups_oficial',
                    'localField': 'codigo_cups',
                    'foreignField': 'codigo',
                    'as': 'info_cups'
                }
            },
            {
                '$unwind': {
                    'path': '$info_cups',
                    'preserveNullAndEmptyArrays': True
                }
            },
            {
                '$project': {
                    '_id': 1,
                    'contrato_id': 1,
                    'numero_contrato': 1,
                    'codigo_cups': 1,
                    'descripcion': 1,
                    'valor_negociado': 1,
                    'valor_referencia': 1,
                    'porcentaje_variacion': 1,
                    'requiere_autorizacion': 1,
                    'restricciones': 1,
                    'estado': 1,
                    # Información del catálogo CUPS
                    'es_quirurgico': '$info_cups.es_quirurgico',
                    'ambito_aplicacion': '$info_cups.ambito',
                    'sexo_aplicable': '$info_cups.sexo'
                }
            },
            {'$limit': 100}  # Limitar resultados
        ]
        
        try:
            resultados = list(self.tarifarios_cups.aggregate(pipeline))
            
            # Convertir ObjectId a string para serialización
            for res in resultados:
                res['_id'] = str(res['_id'])
                res['contrato_id'] = str(res['contrato_id'])
            
            return resultados
            
        except Exception as e:
            logger.error(f"Error buscando tarifas contractuales: {str(e)}")
            return []
    
    def validar_tarifa_vs_contractual(
        self,
        contrato_id: str,
        codigo_cups: str,
        valor_facturado: float,
        fecha_servicio: date
    ) -> Dict[str, Any]:
        """
        Validar tarifa facturada contra valor contractual
        Retorna información para posibles glosas TA
        """
        try:
            # Buscar tarifa contractual vigente
            tarifa = self.tarifarios_cups.find_one({
                'contrato_id': ObjectId(contrato_id),
                'codigo_cups': codigo_cups,
                'estado': 'ACTIVO',
                'vigencia_desde': {'$lte': fecha_servicio},
                'vigencia_hasta': {'$gte': fecha_servicio}
            })
            
            if not tarifa:
                return {
                    'valido': False,
                    'glosa_aplicable': 'TA0301',  # Servicio no contratado
                    'descripcion_glosa': 'Servicio CUPS no incluido en contrato',
                    'codigo_cups': codigo_cups,
                    'valor_facturado': valor_facturado
                }
            
            valor_contractual = float(tarifa['valor_negociado'])
            diferencia = valor_facturado - valor_contractual
            porcentaje_diferencia = (diferencia / valor_contractual * 100) if valor_contractual > 0 else 0
            
            # Validar diferencias
            if diferencia > 0:
                if porcentaje_diferencia > 10:  # Tolerancia del 10%
                    return {
                        'valido': False,
                        'glosa_aplicable': 'TA0101',  # Tarifa mayor a la contratada
                        'descripcion_glosa': f'Tarifa facturada excede valor contractual en {porcentaje_diferencia:.1f}%',
                        'codigo_cups': codigo_cups,
                        'valor_facturado': valor_facturado,
                        'valor_contractual': valor_contractual,
                        'diferencia': diferencia,
                        'porcentaje_diferencia': round(porcentaje_diferencia, 2),
                        'requiere_autorizacion': tarifa.get('requiere_autorizacion', False)
                    }
            
            # Validar restricciones
            restricciones_violadas = []
            restricciones = tarifa.get('restricciones', {})
            
            # Aquí se validarían restricciones adicionales si se proporcionan
            # Por ejemplo: sexo, edad, ámbito, etc.
            
            return {
                'valido': True,
                'codigo_cups': codigo_cups,
                'valor_facturado': valor_facturado,
                'valor_contractual': valor_contractual,
                'diferencia': diferencia,
                'porcentaje_diferencia': round(porcentaje_diferencia, 2),
                'requiere_autorizacion': tarifa.get('requiere_autorizacion', False),
                'restricciones': restricciones,
                'observaciones': 'Tarifa dentro de parámetros contractuales'
            }
            
        except Exception as e:
            logger.error(f"Error validando tarifa contractual: {str(e)}")
            return {
                'valido': False,
                'error': str(e)
            }
    
    def obtener_estadisticas_contrato(self, contrato_id: str) -> Dict[str, Any]:
        """
        Obtener estadísticas de servicios CUPS de un contrato
        """
        pipeline = [
            {'$match': {'contrato_id': ObjectId(contrato_id)}},
            {
                '$facet': {
                    'resumen': [
                        {
                            '$group': {
                                '_id': None,
                                'total_servicios': {'$sum': 1},
                                'valor_promedio': {'$avg': '$valor_negociado'},
                                'valor_minimo': {'$min': '$valor_negociado'},
                                'valor_maximo': {'$max': '$valor_negociado'},
                                'requieren_autorizacion': {
                                    '$sum': {'$cond': ['$requiere_autorizacion', 1, 0]}
                                }
                            }
                        }
                    ],
                    'por_tipo': [
                        {
                            '$lookup': {
                                'from': 'catalogo_cups_oficial',
                                'localField': 'codigo_cups',
                                'foreignField': 'codigo',
                                'as': 'info_cups'
                            }
                        },
                        {'$unwind': '$info_cups'},
                        {
                            '$group': {
                                '_id': {
                                    '$cond': ['$info_cups.es_quirurgico', 'Quirúrgico', 'No Quirúrgico']
                                },
                                'cantidad': {'$sum': 1},
                                'valor_total': {'$sum': '$valor_negociado'}
                            }
                        }
                    ],
                    'variaciones_extremas': [
                        {'$match': {'$or': [
                            {'porcentaje_variacion': {'$gte': 20}},
                            {'porcentaje_variacion': {'$lte': -20}}
                        ]}},
                        {'$sort': {'porcentaje_variacion': -1}},
                        {'$limit': 10},
                        {
                            '$project': {
                                'codigo_cups': 1,
                                'descripcion': 1,
                                'valor_negociado': 1,
                                'valor_referencia': 1,
                                'porcentaje_variacion': 1
                            }
                        }
                    ]
                }
            }
        ]
        
        try:
            resultado = list(self.tarifarios_cups.aggregate(pipeline))[0]
            
            return {
                'contrato_id': contrato_id,
                'resumen': resultado['resumen'][0] if resultado['resumen'] else {},
                'distribucion_tipos': resultado['por_tipo'],
                'servicios_variacion_extrema': resultado['variaciones_extremas'],
                'fecha_analisis': datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas: {str(e)}")
            return {}
    
    def exportar_tarifario_contractual(self, contrato_id: str) -> List[Dict]:
        """
        Exportar tarifario completo de un contrato para revisión/Excel
        """
        try:
            tarifas = list(self.tarifarios_cups.find(
                {'contrato_id': ObjectId(contrato_id), 'estado': 'ACTIVO'},
                {'_id': 0}  # Excluir _id para exportación
            ).sort('codigo_cups', 1))
            
            # Convertir ObjectId y Decimals para serialización
            for tarifa in tarifas:
                tarifa['contrato_id'] = str(tarifa['contrato_id'])
                tarifa['valor_negociado'] = float(tarifa['valor_negociado'])
                tarifa['valor_referencia'] = float(tarifa.get('valor_referencia', 0))
                tarifa['vigencia_desde'] = tarifa['vigencia_desde'].isoformat()
                tarifa['vigencia_hasta'] = tarifa['vigencia_hasta'].isoformat()
            
            return tarifas
            
        except Exception as e:
            logger.error(f"Error exportando tarifario: {str(e)}")
            return []


# Instancia global del servicio
servicio_cups_contractual = ServiciosCUPSContractualesNoSQL()