# -*- coding: utf-8 -*-
"""
Servicio MongoDB nativo para NeurAudit Colombia
Servicios avanzados con agregaciones y consultas específicas usando PyMongo
Django MongoDB Backend + MongoDB Native Operations
"""

from pymongo import MongoClient
from django.conf import settings
from apps.core.mongodb_settings import MONGODB_URI, MONGODB_DATABASE
from bson import ObjectId
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Optional, Any
from decimal import Decimal

logger = logging.getLogger(__name__)

class MongoDBService:
    """
    Servicio nativo MongoDB para operaciones avanzadas
    Complementa Django MongoDB Backend con agregaciones nativas
    """
    
    def __init__(self):
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client[MONGODB_DATABASE]
    
    def close_connection(self):
        """Cierra la conexión MongoDB"""
        if self.client:
            self.client.close()
    
    # =======================================
    # SERVICIOS CATÁLOGOS
    # =======================================
    
    def buscar_codigo_cups(self, codigo: str, incluir_inactivos: bool = False) -> Optional[Dict]:
        """
        Búsqueda nativa de código CUPS con rendimiento optimizado
        """
        try:
            query = {"codigo": codigo}
            if not incluir_inactivos:
                query["habilitado"] = True
            
            result = self.db.catalogo_cups_oficial.find_one(query)
            if result:
                result['_id'] = str(result['_id'])  # Convertir ObjectId a string
            return result
        except Exception as e:
            logger.error(f"Error búsqueda CUPS {codigo}: {e}")
            return None
    
    def buscar_medicamento_cum_ium(self, codigo: str, tipo: str = "CUM") -> Optional[Dict]:
        """
        Búsqueda unificada CUM/IUM con validación cruzada
        """
        try:
            if tipo.upper() == "CUM":
                result = self.db.catalogo_cum_oficial.find_one({"codigo": codigo, "habilitado": True})
            else:  # IUM
                result = self.db.catalogo_ium_oficial.find_one({"codigo": codigo, "habilitado": True})
            
            if result:
                result['_id'] = str(result['_id'])
            return result
        except Exception as e:
            logger.error(f"Error búsqueda {tipo} {codigo}: {e}")
            return None
    
    def validar_bdua_usuario(self, tipo_doc: str, num_doc: str, fecha_atencion: str) -> Dict:
        """
        Validación avanzada BDUA con lógica de derechos
        """
        try:
            fecha_atencion_dt = datetime.strptime(fecha_atencion, '%Y-%m-%d').date()
            
            # Búsqueda en BDUA unificado
            usuario_bdua = self.db.bdua_afiliados.find_one({
                "usuario_tipo_documento": tipo_doc,
                "usuario_numero_documento": num_doc
            })
            
            if not usuario_bdua:
                return {
                    "tiene_derechos": False,
                    "causal_devolucion": "DE1601",
                    "mensaje": "Usuario no encontrado en BDUA",
                    "eps_actual": None
                }
            
            # Validar derechos en fecha específica
            if fecha_atencion_dt < usuario_bdua.get('afiliacion_fecha_efectiva_bd'):
                return {
                    "tiene_derechos": False,
                    "causal_devolucion": "DE1601", 
                    "mensaje": "Atención antes de fecha efectiva",
                    "eps_actual": usuario_bdua.get('codigo_eps')
                }
            
            # Verificar si hay fecha de retiro
            fecha_retiro = usuario_bdua.get('afiliacion_fecha_retiro')
            if fecha_retiro and fecha_atencion_dt > fecha_retiro:
                return {
                    "tiene_derechos": False,
                    "causal_devolucion": "DE1601",
                    "mensaje": "Atención después de fecha de retiro",
                    "eps_actual": usuario_bdua.get('codigo_eps')
                }
            
            # Verificar EPS
            if usuario_bdua.get('codigo_eps') != 'EPS037':  # EPS Familiar
                return {
                    "tiene_derechos": False,
                    "causal_devolucion": "DE1601",
                    "mensaje": f"Usuario pertenece a {usuario_bdua.get('codigo_eps')}",
                    "eps_actual": usuario_bdua.get('codigo_eps')
                }
            
            return {
                "tiene_derechos": True,
                "regimen": usuario_bdua.get('regimen'),
                "estado_afiliacion": usuario_bdua.get('afiliacion_estado_afiliacion'),
                "eps_actual": usuario_bdua.get('codigo_eps'),
                "nivel_sisben": usuario_bdua.get('caracteristicas_nivel_sisben'),
                "tipo_usuario": usuario_bdua.get('usuario_tipo_usuario')
            }
            
        except Exception as e:
            logger.error(f"Error validación BDUA {tipo_doc}-{num_doc}: {e}")
            return {
                "tiene_derechos": False,
                "causal_devolucion": "ERROR_SISTEMA",
                "mensaje": "Error en validación BDUA",
                "eps_actual": None
            }
    
    # =======================================
    # SERVICIOS RIPS
    # =======================================
    
    def obtener_estadisticas_prestador(self, prestador_nit: str, desde: datetime, hasta: datetime) -> Dict:
        """
        Estadísticas avanzadas por prestador usando agregaciones MongoDB
        """
        try:
            pipeline = [
                {
                    "$match": {
                        "prestadorNit": prestador_nit,
                        "fechaRadicacion": {
                            "$gte": desde,
                            "$lte": hasta
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$estadoProcesamiento",
                        "total_facturas": {"$sum": 1},
                        "valor_total": {"$sum": "$estadisticasTransaccion.valorTotalFacturado"},
                        "total_servicios": {"$sum": "$estadisticasTransaccion.totalServicios"},
                        "valor_glosado": {"$sum": "$estadisticasTransaccion.valorGlosado"}
                    }
                },
                {
                    "$project": {
                        "estado": "$_id",
                        "total_facturas": 1,
                        "valor_total": 1,
                        "total_servicios": 1,
                        "valor_glosado": 1,
                        "porcentaje_glosas": {
                            "$cond": [
                                {"$gt": ["$valor_total", 0]},
                                {"$multiply": [{"$divide": ["$valor_glosado", "$valor_total"]}, 100]},
                                0
                            ]
                        }
                    }
                }
            ]
            
            resultados = list(self.db.rips_transacciones.aggregate(pipeline))
            
            # Calcular totales
            total_facturas = sum(r.get('total_facturas', 0) for r in resultados)
            total_valor = sum(r.get('valor_total', 0) for r in resultados)
            total_glosado = sum(r.get('valor_glosado', 0) for r in resultados)
            
            return {
                "prestador_nit": prestador_nit,
                "periodo": {"desde": desde.isoformat(), "hasta": hasta.isoformat()},
                "totales": {
                    "facturas": total_facturas,
                    "valor_total": float(total_valor),
                    "valor_glosado": float(total_glosado),
                    "porcentaje_glosas": round((total_glosado / total_valor * 100) if total_valor > 0 else 0, 2)
                },
                "por_estado": resultados
            }
            
        except Exception as e:
            logger.error(f"Error estadísticas prestador {prestador_nit}: {e}")
            return {}
    
    def detectar_preglosas_automaticas(self, transaccion_id: str) -> Dict:
        """
        Detección automática de pre-glosas usando reglas de negocio
        """
        try:
            transaccion = self.db.rips_transacciones.find_one({"_id": ObjectId(transaccion_id)})
            if not transaccion:
                return {"error": "Transacción no encontrada"}
            
            pre_glosas = []
            usuarios = transaccion.get('usuarios', [])
            
            for usuario in usuarios:
                servicios = usuario.get('servicios', {})
                
                # Revisar consultas
                for consulta in servicios.get('consultas', []):
                    # Validar código CUPS
                    cups_valido = self.buscar_codigo_cups(consulta.get('codConsulta'))
                    if not cups_valido:
                        pre_glosas.append({
                            "tipo": "CO0001",
                            "descripcion": "Código CUPS no válido o inhabilitado",
                            "servicio": consulta,
                            "valor_glosa": consulta.get('vrServicio', 0)
                        })
                    
                    # Validar BDUA
                    validacion_bdua = self.validar_bdua_usuario(
                        consulta.get('tipoDocumentoIdentificacion'),
                        consulta.get('numDocumentoIdentificacion'),
                        consulta.get('fechaAtencion')[:10]  # Solo fecha
                    )
                    
                    if not validacion_bdua.get('tiene_derechos'):
                        pre_glosas.append({
                            "tipo": "CO0002",
                            "descripcion": "Usuario sin derechos en fecha de atención",
                            "servicio": consulta,
                            "valor_glosa": consulta.get('vrServicio', 0),
                            "causal_devolucion": validacion_bdua.get('causal_devolucion')
                        })
                
                # Similar para medicamentos, procedimientos, etc.
            
            valor_total_glosas = sum(g.get('valor_glosa', 0) for g in pre_glosas)
            
            return {
                "transaccion_id": transaccion_id,
                "total_preglosas": len(pre_glosas),
                "valor_total_glosas": valor_total_glosas,
                "preglosas": pre_glosas,
                "requiere_auditoria": len(pre_glosas) > 0,
                "fecha_analisis": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error detección pre-glosas {transaccion_id}: {e}")
            return {"error": str(e)}
    
    # =======================================
    # SERVICIOS AUDITORÍA
    # =======================================
    
    def obtener_balance_cargas_auditores(self) -> List[Dict]:
        """
        Balance de cargas de trabajo por auditor
        """
        try:
            pipeline = [
                {
                    "$match": {
                        "preAuditoria.asignacion.auditor_username": {"$exists": True},
                        "estadoProcesamiento": {"$in": ["ASIGNADO_AUDITORIA", "AUDITORIA"]}
                    }
                },
                {
                    "$group": {
                        "_id": "$preAuditoria.asignacion.auditor_username",
                        "total_asignadas": {"$sum": 1},
                        "valor_total": {"$sum": "$estadisticasTransaccion.valorTotalFacturado"},
                        "en_auditoria": {
                            "$sum": {"$cond": [{"$eq": ["$estadoProcesamiento", "AUDITORIA"]}, 1, 0]}
                        }
                    }
                },
                {
                    "$project": {
                        "auditor": "$_id",
                        "total_asignadas": 1,
                        "valor_total": 1,
                        "en_auditoria": 1,
                        "pendientes": {"$subtract": ["$total_asignadas", "$en_auditoria"]}
                    }
                },
                {"$sort": {"total_asignadas": -1}}
            ]
            
            return list(self.db.rips_transacciones.aggregate(pipeline))
            
        except Exception as e:
            logger.error(f"Error balance cargas auditores: {e}")
            return []
    
    def asignar_auditoria_automatica(self, transaccion_id: str, criterios: Dict) -> Dict:
        """
        Asignación automática equitativa de auditorías
        """
        try:
            # Obtener balance actual
            balance_auditores = self.obtener_balance_cargas_auditores()
            
            # Seleccionar auditor con menor carga
            auditor_seleccionado = min(balance_auditores, key=lambda x: x['total_asignadas']) if balance_auditores else None
            
            if not auditor_seleccionado:
                return {"error": "No hay auditores disponibles"}
            
            # Actualizar transacción con asignación
            resultado = self.db.rips_transacciones.update_one(
                {"_id": ObjectId(transaccion_id)},
                {
                    "$set": {
                        "preAuditoria.asignacion": {
                            "auditor_username": auditor_seleccionado['auditor'],
                            "fecha_asignacion": datetime.now(),
                            "criterios_aplicados": criterios,
                            "tipo_asignacion": "AUTOMATICA"
                        },
                        "estadoProcesamiento": "ASIGNADO_AUDITORIA"
                    }
                }
            )
            
            if resultado.modified_count > 0:
                return {
                    "success": True,
                    "auditor_asignado": auditor_seleccionado['auditor'],
                    "transaccion_id": transaccion_id,
                    "fecha_asignacion": datetime.now().isoformat()
                }
            else:
                return {"error": "No se pudo actualizar la asignación"}
                
        except Exception as e:
            logger.error(f"Error asignación automática {transaccion_id}: {e}")
            return {"error": str(e)}

# Instancia singleton del servicio
mongodb_service = MongoDBService()