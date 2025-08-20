# -*- coding: utf-8 -*-
# apps/core/mongodb_config.py

"""
Configuración MongoDB Nativa - NeurAudit Colombia
PyMongo directo para verdadero enfoque NoSQL
"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class MongoDBConfig:
    """
    Configuración y conexión MongoDB nativa
    """
    
    def __init__(self):
        self.client = None
        self.db = None
        self._connect()
    
    def _connect(self):
        """
        Establece conexión con MongoDB
        """
        try:
            # Configuración desde settings de Django
            mongodb_uri = getattr(settings, 'MONGODB_URI', 'mongodb://localhost:27017/')
            database_name = getattr(settings, 'MONGODB_DATABASE', 'neuraudit_colombia_db')
            
            # Configuración de conexión optimizada
            self.client = MongoClient(
                mongodb_uri,
                # Configuración de pool de conexiones
                maxPoolSize=50,
                minPoolSize=10,
                maxIdleTimeMS=30000,
                
                # Configuración de escritura
                w='majority',
                wtimeoutMS=5000,
                
                # Configuración de lectura
                readPreference='primaryPreferred',
                
                # Configuración de timeout
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                socketTimeoutMS=20000,
                
                # Configuración de retry
                retryWrites=True,
                retryReads=True
            )
            
            # Verificar conexión
            self.client.admin.command('ping')
            self.db = self.client[database_name]
            
            logger.info(f'✅ Conexión MongoDB establecida: {database_name}')
            
            # Crear índices al conectar
            self._crear_indices_basicos()
            
        except ConnectionFailure as e:
            logger.error(f'❌ Error conectando a MongoDB: {str(e)}')
            raise
        except Exception as e:
            logger.error(f'❌ Error configurando MongoDB: {str(e)}')
            raise

    def _crear_indices_basicos(self):
        """
        Crea índices básicos para optimización
        """
        try:
            # Índices para RIPS
            self.db.rips_transacciones.create_index([
                ("numFactura", 1),
                ("prestadorNit", 1)
            ], unique=True)
            
            self.db.rips_transacciones.create_index([
                ("fechaRadicacion", -1)
            ])
            
            self.db.rips_transacciones.create_index([
                ("estadoProcesamiento", 1)
            ])
            
            # Índices para usuarios dentro de RIPS (subdocumentos)
            self.db.rips_transacciones.create_index([
                ("usuarios.numeroDocumento", 1)
            ])
            
            # Índices para catálogos
            self.db.catalogos_cups.create_index([
                ("codigo", 1)
            ], unique=True)
            
            self.db.catalogos_cum.create_index([
                ("codigoCum", 1)
            ], unique=True)
            
            # Índices para BDUA
            self.db.bdua_afiliados.create_index([
                ("tipoDocumento", 1),
                ("numeroDocumento", 1)
            ], unique=True)
            
            self.db.bdua_afiliados.create_index([
                ("regimen", 1),
                ("estadoAfiliacion", 1)
            ])
            
            # Índices para asignaciones
            self.db.asignaciones_auditoria.create_index([
                ("fechaAsignacion", -1)
            ])
            
            self.db.asignaciones_auditoria.create_index([
                ("distribucionAuditores.auditor", 1)
            ])
            
            logger.info('✅ Índices MongoDB creados correctamente')
            
        except Exception as e:
            logger.warning(f'⚠️ Error creando índices: {str(e)}')

    def get_collection(self, collection_name: str):
        """
        Obtiene una colección específica
        """
        if not self.db:
            self._connect()
        return self.db[collection_name]

    def close_connection(self):
        """
        Cierra la conexión MongoDB
        """
        if self.client:
            self.client.close()
            logger.info('🔌 Conexión MongoDB cerrada')


# Instancia global de MongoDB
mongodb_instance = None

def get_mongodb():
    """
    Obtiene instancia singleton de MongoDB
    """
    global mongodb_instance
    if mongodb_instance is None:
        mongodb_instance = MongoDBConfig()
    return mongodb_instance

def get_collection(collection_name: str):
    """
    Shortcut para obtener una colección
    """
    return get_mongodb().get_collection(collection_name)