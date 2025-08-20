# -*- coding: utf-8 -*-
"""
Servicio MongoDB Nativo para NeurAudit Colombia
Manejo de operaciones de alto rendimiento para 2M de afiliados
"""

from pymongo import MongoClient, InsertOne, UpdateOne, ReplaceOne
from pymongo.errors import BulkWriteError, ConnectionFailure
from django.conf import settings
from bson import ObjectId
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger('neuraudit.services')


class MongoDBService:
    """
    Servicio NoSQL puro para operaciones de alto rendimiento
    Necesario para manejar 2M de afiliados eficientemente
    """
    _instance = None
    _client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._client is None:
            try:
                self._client = MongoClient(
                    settings.MONGODB_URI,
                    maxPoolSize=100,  # Para 50 auditores concurrentes
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=10000,
                    socketTimeoutMS=20000,
                    retryWrites=True,
                    w='majority'
                )
                self.db = self._client[settings.MONGODB_DATABASE]
                # Verificar conexión
                self._client.server_info()
                logger.info(f"Conectado a MongoDB: {settings.MONGODB_DATABASE}")
            except ConnectionFailure as e:
                logger.error(f"Error conectando a MongoDB: {str(e)}")
                raise
    
    def get_collection(self, collection_name: str):
        """Obtener una colección específica"""
        return self.db[collection_name]
    
    def procesar_radicacion_masiva(self, registros_rips: List[Dict]) -> Dict[str, Any]:
        """
        Procesar miles de registros RIPS sin saturar Django ORM
        Optimizado para archivos con miles de usuarios
        """
        try:
            # Preparar operaciones bulk
            operaciones = []
            for registro in registros_rips:
                # Agregar metadata de procesamiento
                registro['fecha_procesamiento'] = datetime.now()
                registro['estado_procesamiento'] = 'PENDIENTE'
                operaciones.append(InsertOne(registro))
            
            # Ejecutar en lotes de 1000 para no saturar memoria
            resultados = {
                'insertados': 0,
                'errores': 0,
                'detalles_errores': []
            }
            
            for i in range(0, len(operaciones), 1000):
                lote = operaciones[i:i+1000]
                try:
                    resultado = self.db.rips_transacciones.bulk_write(
                        lote,
                        ordered=False  # Procesamiento paralelo
                    )
                    resultados['insertados'] += resultado.inserted_count
                except BulkWriteError as bwe:
                    resultados['errores'] += len(bwe.details['writeErrors'])
                    resultados['detalles_errores'].extend(bwe.details['writeErrors'])
                    # Continuar con registros válidos
                    resultados['insertados'] += bwe.details['nInserted']
            
            logger.info(f"Radicación masiva completada: {resultados['insertados']} registros")
            return resultados
            
        except Exception as e:
            logger.error(f"Error en radicación masiva: {str(e)}")
            raise
    
    def buscar_afiliado_eficiente(self, tipo_doc: str, num_doc: str) -> Optional[Dict]:
        """
        Búsqueda optimizada de afiliado usando índices
        """
        try:
            # Usar proyección para traer solo campos necesarios
            afiliado = self.db.bdua_afiliados.find_one(
                {
                    'tipo_documento': tipo_doc,
                    'numero_documento': num_doc
                },
                {
                    '_id': 1,
                    'nombres': 1,
                    'apellidos': 1,
                    'fecha_nacimiento': 1,
                    'regimen': 1,
                    'estado': 1,
                    'eps_actual': 1
                }
            )
            return afiliado
        except Exception as e:
            logger.error(f"Error buscando afiliado: {str(e)}")
            return None
    
    def agregacion_dashboard(self, fecha_inicio: datetime, fecha_fin: datetime) -> Dict[str, Any]:
        """
        Agregaciones complejas para dashboard ejecutivo
        Optimizado para mostrar KPIs en tiempo real
        """
        pipeline = [
            {
                "$match": {
                    "fecha_radicacion": {
                        "$gte": fecha_inicio,
                        "$lte": fecha_fin
                    }
                }
            },
            {
                "$facet": {
                    # Métricas por estado
                    "por_estado": [
                        {
                            "$group": {
                                "_id": "$estado_procesamiento",
                                "cantidad": {"$sum": 1},
                                "valor_total": {"$sum": "$valor_total"}
                            }
                        }
                    ],
                    # Métricas por prestador
                    "top_prestadores": [
                        {
                            "$group": {
                                "_id": "$prestador_nit",
                                "razon_social": {"$first": "$prestador_nombre"},
                                "total_radicado": {"$sum": "$valor_total"},
                                "cantidad_facturas": {"$sum": 1}
                            }
                        },
                        {"$sort": {"total_radicado": -1}},
                        {"$limit": 10}
                    ],
                    # Métricas de glosas
                    "resumen_glosas": [
                        {"$unwind": "$glosas_aplicadas"},
                        {
                            "$group": {
                                "_id": "$glosas_aplicadas.tipo_glosa",
                                "cantidad": {"$sum": 1},
                                "valor_glosado": {"$sum": "$glosas_aplicadas.valor"}
                            }
                        }
                    ],
                    # Totales generales
                    "totales": [
                        {
                            "$group": {
                                "_id": None,
                                "total_radicaciones": {"$sum": 1},
                                "valor_total_radicado": {"$sum": "$valor_total"},
                                "promedio_por_radicacion": {"$avg": "$valor_total"}
                            }
                        }
                    ]
                }
            }
        ]
        
        try:
            resultado = list(self.db.radicaciones.aggregate(
                pipeline,
                allowDiskUse=True  # Para agregaciones grandes
            ))[0]
            
            return {
                'estados': resultado.get('por_estado', []),
                'top_prestadores': resultado.get('top_prestadores', []),
                'glosas': resultado.get('resumen_glosas', []),
                'totales': resultado.get('totales', [{}])[0]
            }
        except Exception as e:
            logger.error(f"Error en agregación dashboard: {str(e)}")
            return {}
    
    def validar_cups_masivo(self, codigos_cups: List[str]) -> Dict[str, Dict]:
        """
        Validación masiva de códigos CUPS
        Retorna diccionario con información de cada código
        """
        try:
            # Buscar todos los códigos en una sola consulta
            cups_encontrados = self.db.catalogs_cups.find(
                {'codigo': {'$in': codigos_cups}},
                {'codigo': 1, 'descripcion': 1, 'estado': 1, 'valor_soat': 1}
            )
            
            # Convertir a diccionario para búsqueda O(1)
            resultado = {}
            for cup in cups_encontrados:
                resultado[cup['codigo']] = {
                    'valido': True,
                    'descripcion': cup['descripcion'],
                    'estado': cup['estado'],
                    'valor_soat': cup.get('valor_soat', 0)
                }
            
            # Marcar códigos no encontrados
            for codigo in codigos_cups:
                if codigo not in resultado:
                    resultado[codigo] = {
                        'valido': False,
                        'descripcion': 'Código no encontrado en catálogo',
                        'estado': 'INVALIDO'
                    }
            
            return resultado
            
        except Exception as e:
            logger.error(f"Error validando CUPS: {str(e)}")
            return {}
    
    def actualizar_estado_masivo(self, filtro: Dict, actualizacion: Dict) -> int:
        """
        Actualización masiva de documentos
        Útil para cambios de estado en lote
        """
        try:
            resultado = self.db.radicaciones.update_many(
                filtro,
                {
                    '$set': actualizacion,
                    '$push': {
                        'trazabilidad': {
                            'evento': 'ACTUALIZACION_MASIVA',
                            'fecha': datetime.now(),
                            'cambios': actualizacion
                        }
                    }
                }
            )
            return resultado.modified_count
        except Exception as e:
            logger.error(f"Error en actualización masiva: {str(e)}")
            return 0
    
    def crear_indices_optimizados(self):
        """
        Crear índices para optimizar consultas frecuentes
        Ejecutar solo una vez en setup inicial
        """
        indices = [
            # Índice para búsquedas de afiliados
            {
                'collection': 'bdua_afiliados',
                'index': [('tipo_documento', 1), ('numero_documento', 1)],
                'unique': True
            },
            # Índice para radicaciones por prestador y fecha
            {
                'collection': 'radicaciones',
                'index': [('prestador_nit', 1), ('fecha_radicacion', -1)]
            },
            # Índice para búsquedas por estado
            {
                'collection': 'radicaciones',
                'index': [('estado_procesamiento', 1)]
            },
            # Índice para CUPS
            {
                'collection': 'catalogs_cups',
                'index': [('codigo', 1)],
                'unique': True
            },
            # Índice texto para búsquedas
            {
                'collection': 'radicaciones',
                'index': [('$**', 'text')]
            }
        ]
        
        for idx in indices:
            try:
                collection = self.db[idx['collection']]
                options = {'unique': idx.get('unique', False)} if 'unique' in idx else {}
                collection.create_index(idx['index'], **options)
                logger.info(f"Índice creado en {idx['collection']}: {idx['index']}")
            except Exception as e:
                logger.warning(f"Error creando índice: {str(e)}")
    
    def close(self):
        """Cerrar conexión MongoDB"""
        if self._client:
            self._client.close()
            logger.info("Conexión MongoDB cerrada")