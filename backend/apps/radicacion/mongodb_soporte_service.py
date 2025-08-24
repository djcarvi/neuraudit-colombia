"""
Servicio MongoDB para Clasificación de Soportes
NeurAudit Colombia - Arquitectura NoSQL Pura

Este servicio maneja la clasificación de soportes directamente en MongoDB
sin depender del ORM de Django, usando PyMongo para operaciones NoSQL puras.

Autor: Analítica Neuronal
Fecha: 21 Agosto 2025
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
from bson import ObjectId
import pymongo
from pymongo import MongoClient, UpdateOne
from django.conf import settings

from .soporte_classifier import SoporteClassifier, CODIGOS_SOPORTES, CATEGORIAS_PRINCIPALES


class MongoDBSoporteService:
    """
    Servicio NoSQL puro para manejo de soportes en MongoDB
    """
    
    def __init__(self):
        # Conexión MongoDB directa
        mongodb_settings = getattr(settings, 'DATABASES', {}).get('default', {})
        host = mongodb_settings.get('HOST', 'mongodb://localhost:27017/')
        db_name = mongodb_settings.get('NAME', 'neuraudit_colombia_db')
        
        self.client = MongoClient(host)
        self.db = self.client[db_name]
        self.collection = self.db.neuraudit_documentos_soporte
        self.classifier = SoporteClassifier()
        
        # Asegurar índices para búsquedas eficientes
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """
        Crea índices MongoDB para optimizar consultas
        """
        # Índices compuestos para búsquedas frecuentes
        self.collection.create_index([
            ("radicacion_id", 1),
            ("codigo_soporte", 1),
            ("categoria_soporte", 1)
        ])
        
        # Índice para nomenclatura válida
        self.collection.create_index([("nomenclatura_valida", 1)])
        
        # Índice para número de factura extraído
        self.collection.create_index([("numero_factura_extracted", 1)])
        
        # Índice de texto para búsquedas
        self.collection.create_index([("nombre_archivo", "text")])
    
    def clasificar_soporte(self, documento_id: str, force: bool = False) -> Dict[str, Any]:
        """
        Clasifica un soporte según nomenclatura oficial
        
        Args:
            documento_id: ID del documento a clasificar
            force: Forzar reclasificación aunque ya esté clasificado
            
        Returns:
            Dict con resultado de clasificación
        """
        # Buscar documento
        documento = self.collection.find_one({"_id": ObjectId(documento_id)})
        
        if not documento:
            return {"success": False, "error": "Documento no encontrado"}
        
        # Si ya está clasificado y no se fuerza, retornar existente
        if documento.get("codigo_soporte") and not force:
            return {
                "success": True,
                "already_classified": True,
                "clasificacion": {
                    "codigo": documento.get("codigo_soporte"),
                    "categoria": documento.get("categoria_soporte"),
                    "nomenclatura_valida": documento.get("nomenclatura_valida")
                }
            }
        
        # Clasificar usando el nombre del archivo
        nombre_archivo = documento.get("nombre_archivo", "")
        info = self.classifier.parse_soporte_filename(nombre_archivo)
        
        # Preparar actualización
        update_data = {
            "codigo_soporte": info.codigo,
            "categoria_soporte": info.categoria,
            "numero_factura_extracted": info.numero_factura,
            "es_multiusuario": info.es_multiusuario,
            "nomenclatura_valida": info.nomenclatura_valida,
            "clasificacion_fecha": datetime.now(),
            "clasificacion_version": "1.0"
        }
        
        if info.es_multiusuario:
            update_data["tipo_documento_usuario"] = info.tipo_documento_usuario
            update_data["numero_documento_usuario"] = info.numero_documento_usuario
        
        if info.errores:
            update_data["errores_nomenclatura"] = info.errores
        
        # Actualizar documento
        result = self.collection.update_one(
            {"_id": ObjectId(documento_id)},
            {"$set": update_data}
        )
        
        return {
            "success": result.modified_count > 0,
            "clasificacion": {
                "codigo": info.codigo,
                "categoria": info.categoria,
                "nombre": info.nombre,
                "nomenclatura_valida": info.nomenclatura_valida,
                "es_multiusuario": info.es_multiusuario,
                "errores": info.errores
            }
        }
    
    def clasificar_batch(self, radicacion_id: str) -> Dict[str, Any]:
        """
        Clasifica todos los soportes de una radicación
        
        Args:
            radicacion_id: ID de la radicación
            
        Returns:
            Dict con resultados del batch
        """
        # Buscar todos los documentos de la radicación
        documentos = list(self.collection.find({
            "radicacion_id": ObjectId(radicacion_id)
        }))
        
        if not documentos:
            return {
                "success": False,
                "error": "No se encontraron documentos para esta radicación"
            }
        
        # Preparar operaciones bulk
        bulk_operations = []
        clasificados = 0
        errores = 0
        
        for doc in documentos:
            # Solo clasificar si no tiene código
            if not doc.get("codigo_soporte"):
                nombre_archivo = doc.get("nombre_archivo", "")
                info = self.classifier.parse_soporte_filename(nombre_archivo)
                
                update_data = {
                    "codigo_soporte": info.codigo,
                    "categoria_soporte": info.categoria,
                    "numero_factura_extracted": info.numero_factura,
                    "es_multiusuario": info.es_multiusuario,
                    "nomenclatura_valida": info.nomenclatura_valida,
                    "clasificacion_fecha": datetime.now()
                }
                
                if info.es_multiusuario:
                    update_data["tipo_documento_usuario"] = info.tipo_documento_usuario
                    update_data["numero_documento_usuario"] = info.numero_documento_usuario
                
                if info.errores:
                    update_data["errores_nomenclatura"] = info.errores
                    errores += 1
                else:
                    clasificados += 1
                
                bulk_operations.append(
                    UpdateOne(
                        {"_id": doc["_id"]},
                        {"$set": update_data}
                    )
                )
        
        # Ejecutar operaciones bulk si hay alguna
        if bulk_operations:
            result = self.collection.bulk_write(bulk_operations)
            
            return {
                "success": True,
                "total_documentos": len(documentos),
                "clasificados": clasificados,
                "con_errores": errores,
                "ya_clasificados": len(documentos) - len(bulk_operations),
                "modificados": result.modified_count
            }
        
        return {
            "success": True,
            "message": "Todos los documentos ya estaban clasificados",
            "total_documentos": len(documentos)
        }
    
    def obtener_soportes_clasificados(self, radicacion_id: str) -> Dict[str, Any]:
        """
        Obtiene todos los soportes clasificados de una radicación
        agrupados por categoría
        
        Args:
            radicacion_id: ID de la radicación
            
        Returns:
            Dict con soportes agrupados por categoría
        """
        # Pipeline de agregación para agrupar por categoría
        pipeline = [
            # Filtrar por radicación
            {
                "$match": {
                    "radicacion_id": ObjectId(radicacion_id)
                }
            },
            # Agregar información de categoría
            {
                "$addFields": {
                    "categoria_info": {
                        "$switch": {
                            "branches": [
                                {
                                    "case": {"$eq": ["$categoria_soporte", cat]},
                                    "then": info
                                }
                                for cat, info in CATEGORIAS_PRINCIPALES.items()
                            ],
                            "default": {
                                "nombre": "❓ Sin Categoría",
                                "descripcion": "Soporte no clasificado",
                                "orden": 99
                            }
                        }
                    }
                }
            },
            # Agrupar por categoría
            {
                "$group": {
                    "_id": "$categoria_soporte",
                    "categoria_info": {"$first": "$categoria_info"},
                    "soportes": {
                        "$push": {
                            "_id": {"$toString": "$_id"},
                            "codigo": "$codigo_soporte",
                            "nombre_archivo": "$nombre_archivo",
                            "tipo_documento": "$tipo_documento",
                            "nomenclatura_valida": "$nomenclatura_valida",
                            "es_multiusuario": "$es_multiusuario",
                            "numero_factura": "$numero_factura_extracted",
                            "errores": "$errores_nomenclatura",
                            "archivo_size": "$archivo_size",
                            "created_at": "$created_at"
                        }
                    },
                    "total": {"$sum": 1},
                    "validos": {
                        "$sum": {
                            "$cond": ["$nomenclatura_valida", 1, 0]
                        }
                    }
                }
            },
            # Ordenar por orden de categoría
            {
                "$sort": {
                    "categoria_info.orden": 1
                }
            }
        ]
        
        # Ejecutar agregación
        resultado = list(self.collection.aggregate(pipeline))
        
        # Generar estadísticas
        total_soportes = sum(cat["total"] for cat in resultado)
        total_validos = sum(cat["validos"] for cat in resultado)
        
        # Verificar soportes obligatorios
        soportes_por_codigo = {}
        for cat in resultado:
            for soporte in cat["soportes"]:
                codigo = soporte.get("codigo", "")
                if codigo:
                    soportes_por_codigo[codigo] = soporte
        
        # Determinar tipo de servicio desde la radicación
        # (esto vendría de la colección de radicaciones)
        tipo_servicio = "AMBULATORIO"  # Por defecto
        
        obligatorios = self.classifier.get_soportes_obligatorios(tipo_servicio)
        faltantes = [cod for cod in obligatorios if cod not in soportes_por_codigo]
        
        return {
            "success": True,
            "radicacion_id": radicacion_id,
            "categorias": resultado,
            "estadisticas": {
                "total_soportes": total_soportes,
                "soportes_validos": total_validos,
                "soportes_invalidos": total_soportes - total_validos,
                "porcentaje_validez": (total_validos / total_soportes * 100) if total_soportes > 0 else 0,
                "soportes_obligatorios": obligatorios,
                "soportes_faltantes": faltantes,
                "cumple_obligatorios": len(faltantes) == 0
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def buscar_por_nomenclatura(self, patron: str) -> List[Dict]:
        """
        Busca soportes por patrón en nomenclatura
        
        Args:
            patron: Patrón de búsqueda (ej: "EPI_", "9999999999")
            
        Returns:
            Lista de soportes encontrados
        """
        # Búsqueda por texto o regex
        query = {
            "$or": [
                {"nombre_archivo": {"$regex": patron, "$options": "i"}},
                {"codigo_soporte": patron.upper()},
                {"numero_factura_extracted": patron}
            ]
        }
        
        # Proyección de campos relevantes
        projection = {
            "_id": 1,
            "nombre_archivo": 1,
            "codigo_soporte": 1,
            "categoria_soporte": 1,
            "numero_factura_extracted": 1,
            "nomenclatura_valida": 1,
            "radicacion_id": 1
        }
        
        resultados = list(self.collection.find(query, projection).limit(100))
        
        # Convertir ObjectId a string
        for doc in resultados:
            doc["_id"] = str(doc["_id"])
            if "radicacion_id" in doc:
                doc["radicacion_id"] = str(doc["radicacion_id"])
        
        return resultados
    
    def generar_reporte_clasificacion(self, fecha_inicio: datetime = None, fecha_fin: datetime = None) -> Dict[str, Any]:
        """
        Genera reporte de clasificación de soportes
        
        Args:
            fecha_inicio: Fecha inicial del reporte
            fecha_fin: Fecha final del reporte
            
        Returns:
            Dict con estadísticas del reporte
        """
        # Filtro de fechas
        match_stage = {}
        if fecha_inicio or fecha_fin:
            date_filter = {}
            if fecha_inicio:
                date_filter["$gte"] = fecha_inicio
            if fecha_fin:
                date_filter["$lte"] = fecha_fin
            match_stage["created_at"] = date_filter
        
        # Pipeline de agregación para reporte
        pipeline = [
            {"$match": match_stage} if match_stage else {"$match": {}},
            {
                "$facet": {
                    # Por categoría
                    "por_categoria": [
                        {
                            "$group": {
                                "_id": "$categoria_soporte",
                                "total": {"$sum": 1},
                                "validos": {
                                    "$sum": {"$cond": ["$nomenclatura_valida", 1, 0]}
                                }
                            }
                        }
                    ],
                    # Por código
                    "por_codigo": [
                        {
                            "$group": {
                                "_id": "$codigo_soporte",
                                "total": {"$sum": 1},
                                "validos": {
                                    "$sum": {"$cond": ["$nomenclatura_valida", 1, 0]}
                                }
                            }
                        },
                        {"$sort": {"total": -1}},
                        {"$limit": 20}
                    ],
                    # Totales generales
                    "totales": [
                        {
                            "$group": {
                                "_id": None,
                                "total_documentos": {"$sum": 1},
                                "total_validos": {
                                    "$sum": {"$cond": ["$nomenclatura_valida", 1, 0]}
                                },
                                "total_multiusuario": {
                                    "$sum": {"$cond": ["$es_multiusuario", 1, 0]}
                                }
                            }
                        }
                    ]
                }
            }
        ]
        
        # Ejecutar agregación
        resultado = list(self.collection.aggregate(pipeline))[0]
        
        # Procesar resultados
        totales = resultado["totales"][0] if resultado["totales"] else {
            "total_documentos": 0,
            "total_validos": 0,
            "total_multiusuario": 0
        }
        
        return {
            "periodo": {
                "inicio": fecha_inicio.isoformat() if fecha_inicio else None,
                "fin": fecha_fin.isoformat() if fecha_fin else None
            },
            "totales": totales,
            "por_categoria": resultado["por_categoria"],
            "por_codigo": resultado["por_codigo"],
            "porcentaje_validez": (
                totales["total_validos"] / totales["total_documentos"] * 100
            ) if totales["total_documentos"] > 0 else 0,
            "generado_en": datetime.now().isoformat()
        }


# Instancia singleton del servicio
_soporte_service = None

def get_soporte_service() -> MongoDBSoporteService:
    """
    Obtiene instancia singleton del servicio de soportes
    """
    global _soporte_service
    if _soporte_service is None:
        _soporte_service = MongoDBSoporteService()
    return _soporte_service