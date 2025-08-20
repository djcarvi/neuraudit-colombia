# -*- coding: utf-8 -*-
"""
Servicios NoSQL para NeurAudit Colombia
Lógica de negocio optimizada para MongoDB
"""

from .mongodb_service import MongoDBService
from .rips_processor import RIPSProcessor
from .glosas_engine import GlosasEngine
from .analytics_service import AnalyticsService

__all__ = [
    'MongoDBService',
    'RIPSProcessor',
    'GlosasEngine',
    'AnalyticsService'
]

# Versión del paquete
__version__ = '1.0.0'