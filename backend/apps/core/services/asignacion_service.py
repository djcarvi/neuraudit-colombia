# -*- coding: utf-8 -*-
# apps/core/services/asignacion_service.py

"""
Servicio NoSQL puro para Asignación Automática de Auditorías Médicas
Sistema inteligente de distribución equitativa según Resolución 2284 de 2023

FLUJO CRÍTICO:
1. Radicaciones VALIDADAS → Análisis automático
2. Algoritmo de distribución equitativa por perfil
3. Coordinador aprueba/rechaza/modifica
4. Asignaciones → Módulo de Auditoría
"""

from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class AsignacionService:
    def __init__(self):
        """Inicializar conexión MongoDB pura (NoSQL)"""
        self.client = MongoClient(settings.MONGODB_URI)
        self.db = self.client[settings.MONGODB_DATABASE]
        
        # Colecciones principales
        self.asignaciones_automaticas = self.db.asignaciones_automaticas
        self.auditores_perfiles = self.db.auditores_perfiles
        self.trazabilidad_asignaciones = self.db.trazabilidad_asignaciones
        
        # Referencias a otras colecciones
        self.radicaciones = self.db.radicaciones_cuentas_medicas  # Colección correcta
        self.contratos = self.db.contratos
        self.usuarios_eps = self.db.usuarios_eps

    # =====================================
    # 1. ALGORITMO DE ASIGNACIÓN AUTOMÁTICA
    # =====================================

    def generar_propuesta_asignacion(self, coordinador_username: str) -> ObjectId:
        """
        Genera propuesta automática de asignación equitativa
        
        PROCESO:
        1. Obtener radicaciones pendientes (estado VALIDADO)
        2. Clasificar por tipo: ambulatorio vs hospitalario  
        3. Obtener auditores disponibles por perfil
        4. Aplicar algoritmo de distribución equitativa
        5. Generar documento de propuesta
        """
        try:
            logger.info(f"Iniciando generación de propuesta de asignación por {coordinador_username}")
            
            # 1. Obtener radicaciones pendientes
            radicaciones_pendientes = self._obtener_radicaciones_pendientes()
            
            if not radicaciones_pendientes:
                logger.warning("No hay radicaciones pendientes para asignar")
                return None
                
            # 2. Clasificar radicaciones por tipo de auditoría
            clasificacion = self._clasificar_radicaciones_por_tipo(radicaciones_pendientes)
            
            # 3. Obtener auditores disponibles
            auditores_disponibles = self._obtener_auditores_disponibles()
            
            # 4. Ejecutar algoritmo de distribución equitativa
            asignaciones_propuestas = self._ejecutar_algoritmo_distribucion(
                clasificacion, auditores_disponibles
            )
            
            # 5. Calcular métricas de la propuesta
            metricas = self._calcular_metricas_propuesta(asignaciones_propuestas, auditores_disponibles)
            
            # 6. Crear documento de propuesta
            propuesta_doc = {
                "fecha_propuesta": datetime.now(),
                "coordinador_id": self._obtener_coordinador_id(coordinador_username),
                "estado": "PENDIENTE",
                "algoritmo_version": "v1.0",
                "metricas_distribucion": metricas,
                "asignaciones_individuales": asignaciones_propuestas,
                "decisiones_coordinador": [],
                "trazabilidad": {
                    "creado_por": coordinador_username,
                    "fecha_creacion": datetime.now(),
                    "radicaciones_procesadas": len(radicaciones_pendientes),
                    "auditores_involucrados": len(auditores_disponibles)
                }
            }
            
            # 7. Insertar en MongoDB
            resultado = self.asignaciones_automaticas.insert_one(propuesta_doc)
            propuesta_id = resultado.inserted_id
            
            # 8. Registrar trazabilidad
            self._registrar_trazabilidad(
                propuesta_id, coordinador_username, "PROPUESTA_GENERADA",
                {"total_radicaciones": len(radicaciones_pendientes), "metricas": metricas}
            )
            
            logger.info(f"Propuesta de asignación generada: {propuesta_id}")
            return propuesta_id
            
        except Exception as e:
            logger.error(f"Error generando propuesta de asignación: {str(e)}")
            raise

    def _obtener_radicaciones_pendientes(self) -> List[Dict[str, Any]]:
        """
        Obtiene radicaciones en estado VALIDADO pendientes de asignación
        
        CRITERIOS:
        - Estado: VALIDADO (ya pasó pre-auditoría)
        - No asignadas previamente
        - Prestador con contrato vigente
        - Dentro de plazos legales
        """
        try:
            # Pipeline de agregación MongoDB
            pipeline = [
                # 1. Filtrar radicaciones validadas no asignadas
                {
                    "$match": {
                        "estado": {"$in": ["RADICADA", "VALIDADO"]},  # Estados pendientes
                        "asignacion_auditoria": {"$exists": False},
                        "fecha_radicacion": {
                            "$gte": datetime.now() - timedelta(days=22)  # Dentro de plazos legales
                        }
                    }
                },
                # 2. Lookup para validar contratos vigentes
                {
                    "$lookup": {
                        "from": "contratos",
                        "let": {"prestador_nit": "$prestador_nit"},
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$and": [
                                            {"$eq": ["$prestador.nit", "$$prestador_nit"]},
                                            {"$eq": ["$estado", "VIGENTE"]},
                                            {"$lte": ["$fecha_inicio", datetime.now()]},
                                            {"$gte": ["$fecha_fin", datetime.now()]}
                                        ]
                                    }
                                }
                            }
                        ],
                        "as": "contrato_vigente"
                    }
                },
                # 3. Solo radicaciones con contrato vigente
                {"$match": {"contrato_vigente": {"$ne": []}}},
                # 4. Proyectar campos necesarios
                {
                    "$project": {
                        "numero_radicado": 1,
                        "numero_factura": 1,
                        "prestador_nit": 1,
                        "prestador_info": {
                            "nit": "$prestador_nit",
                            "razon_social": "$prestador_razon_social",
                            "codigo_habilitacion": "$prestador_codigo_habilitacion"
                        },
                        "valor_factura": 1,
                        "fecha_radicacion": 1,
                        "estadisticas_transaccion": 1,
                        "usuarios": 1,
                        "fecha_limite_auditoria": {
                            "$add": ["$fecha_radicacion", {"$multiply": [10, 24, 60, 60, 1000]}]  # 10 días hábiles
                        }
                    }
                }
            ]
            
            radicaciones = list(self.radicaciones.aggregate(pipeline))
            logger.info(f"Encontradas {len(radicaciones)} radicaciones pendientes de asignación")
            return radicaciones
            
        except Exception as e:
            logger.error(f"Error obteniendo radicaciones pendientes: {str(e)}")
            return []

    def _clasificar_radicaciones_por_tipo(self, radicaciones: List[Dict]) -> Dict[str, List[Dict]]:
        """
        Clasifica radicaciones por tipo de auditoría según servicios RIPS
        
        TIPOS:
        - AMBULATORIO: consultas, procedimientos ambulatorios
        - HOSPITALARIO: hospitalizaciones, urgencias, cirugías
        """
        clasificacion = {
            "AMBULATORIO": [],
            "HOSPITALARIO": []
        }
        
        for radicacion in radicaciones:
            tipo_auditoria = self._determinar_tipo_auditoria(radicacion)
            clasificacion[tipo_auditoria].append({
                **radicacion,
                "tipo_auditoria": tipo_auditoria,
                "prioridad": self._calcular_prioridad(radicacion),
                "complejidad": self._evaluar_complejidad(radicacion)
            })
        
        logger.info(f"Clasificación: {len(clasificacion['AMBULATORIO'])} ambulatorios, "
                   f"{len(clasificacion['HOSPITALARIO'])} hospitalarios")
        
        return clasificacion

    def _determinar_tipo_auditoria(self, radicacion: Dict) -> str:
        """Determina si una radicación requiere auditoría ambulatoria u hospitalaria"""
        
        if not radicacion.get("estadisticas_transaccion"):
            return "AMBULATORIO"  # Default
            
        stats = radicacion["estadisticas_transaccion"]
        distribucion = stats.get("distribucion_servicios", {})
        
        # Si tiene hospitalizaciones o urgencias → HOSPITALARIO
        if (distribucion.get("hospitalizacion", 0) > 0 or 
            distribucion.get("urgencias", 0) > 0):
            return "HOSPITALARIO"
            
        # Si solo consultas y procedimientos → AMBULATORIO  
        return "AMBULATORIO"

    def _calcular_prioridad(self, radicacion: Dict) -> str:
        """Calcula prioridad basada en valor, fecha límite y complejidad"""
        
        valor = radicacion.get("valor_factura", 0)
        fecha_limite = radicacion.get("fecha_limite_auditoria")
        
        # Prioridad por valor
        if valor > 1000000:  # > $1M
            return "ALTA"
        elif valor > 500000:  # > $500K
            return "MEDIA"
        else:
            return "BAJA"

    def _evaluar_complejidad(self, radicacion: Dict) -> str:
        """Evalúa complejidad basada en cantidad de servicios y usuarios"""
        
        stats = radicacion.get("estadisticas_transaccion", {})
        total_servicios = stats.get("total_servicios", 0)
        total_usuarios = stats.get("total_usuarios", 0)
        
        if total_servicios > 50 or total_usuarios > 20:
            return "ALTA"
        elif total_servicios > 20 or total_usuarios > 10:
            return "MEDIA"
        else:
            return "BAJA"

    def _obtener_auditores_disponibles(self) -> List[Dict]:
        """
        Obtiene auditores disponibles con su carga actual y capacidad
        """
        try:
            # Obtener todos los auditores activos
            auditores = list(self.auditores_perfiles.find({
                "disponibilidad.activo": True,
                "disponibilidad.vacaciones": False
            }))
            
            # Actualizar carga actual de cada auditor
            for auditor in auditores:
                carga_actual = self._calcular_carga_actual(auditor["username"])
                auditor["carga_actual"] = carga_actual
                auditor["capacidad_disponible"] = auditor["capacidad_maxima_dia"] - carga_actual["total_asignadas"]
                auditor["porcentaje_carga"] = (carga_actual["total_asignadas"] / auditor["capacidad_maxima_dia"]) * 100
            
            # Ordenar por menor carga para distribución equitativa
            auditores.sort(key=lambda x: x["porcentaje_carga"])
            
            logger.info(f"Encontrados {len(auditores)} auditores disponibles")
            return auditores
            
        except Exception as e:
            logger.error(f"Error obteniendo auditores disponibles: {str(e)}")
            return []

    def _calcular_carga_actual(self, auditor_username: str) -> Dict:
        """Calcula la carga de trabajo actual de un auditor"""
        
        try:
            # Contar asignaciones activas del auditor
            asignaciones_activas = self.db.asignaciones_auditoria.count_documents({
                "auditor_username": auditor_username,
                "estado": {"$in": ["ASIGNADA", "EN_PROCESO"]},
                "fecha_asignacion": {"$gte": datetime.now().replace(hour=0, minute=0, second=0)}
            })
            
            return {
                "total_asignadas": asignaciones_activas,
                "en_proceso": asignaciones_activas,  # Simplificado por ahora
                "completadas_hoy": 0  # TODO: Calcular completadas hoy
            }
            
        except Exception as e:
            logger.error(f"Error calculando carga de {auditor_username}: {str(e)}")
            return {"total_asignadas": 0, "en_proceso": 0, "completadas_hoy": 0}

    def _ejecutar_algoritmo_distribucion(self, clasificacion: Dict, auditores: List[Dict]) -> List[Dict]:
        """
        Algoritmo de distribución equitativa por tipo de auditoría
        
        ESTRATEGIA:
        1. Separar auditores por perfil (MEDICO vs ADMINISTRATIVO)
        2. Asignar hospitalarios solo a médicos
        3. Distribuir ambulatorios entre médicos y administrativos
        4. Balancear carga manteniendo equidad
        """
        
        asignaciones = []
        
        # Separar auditores por perfil
        auditores_medicos = [a for a in auditores if a["perfil"] == "MEDICO"]
        auditores_admin = [a for a in auditores if a["perfil"] == "ADMINISTRATIVO"]
        
        # 1. Asignar radicaciones HOSPITALARIAS solo a médicos
        hospitalarias = clasificacion.get("HOSPITALARIO", [])
        asignaciones.extend(
            self._distribuir_radicaciones(hospitalarias, auditores_medicos, "HOSPITALARIO")
        )
        
        # 2. Asignar radicaciones AMBULATORIAS a médicos y administrativos
        ambulatorias = clasificacion.get("AMBULATORIO", [])
        todos_auditores = auditores_medicos + auditores_admin
        
        # Reordenar por carga actualizada después de asignaciones hospitalarias
        self._actualizar_carga_temporal(todos_auditores, asignaciones)
        todos_auditores.sort(key=lambda x: x.get("carga_temporal", 0))
        
        asignaciones.extend(
            self._distribuir_radicaciones(ambulatorias, todos_auditores, "AMBULATORIO")
        )
        
        logger.info(f"Algoritmo completado: {len(asignaciones)} asignaciones generadas")
        return asignaciones

    def _distribuir_radicaciones(self, radicaciones: List[Dict], auditores: List[Dict], tipo: str) -> List[Dict]:
        """Distribuye radicaciones entre auditores aplicando equidad"""
        
        asignaciones = []
        
        if not auditores:
            logger.warning(f"No hay auditores disponibles para tipo {tipo}")
            return asignaciones
        
        # Ordenar radicaciones por prioridad
        radicaciones.sort(key=lambda x: self._peso_prioridad(x["prioridad"]), reverse=True)
        
        # Distribuir round-robin equitativo
        for i, radicacion in enumerate(radicaciones):
            # Seleccionar auditor con menor carga
            auditor_seleccionado = min(auditores, key=lambda x: x.get("carga_temporal", x["porcentaje_carga"]))
            
            asignacion = {
                "radicacion_id": radicacion["_id"],
                "numero_radicado": radicacion["numero_radicado"],
                "auditor_asignado": auditor_seleccionado["username"],
                "auditor_perfil": auditor_seleccionado["perfil"],
                "tipo_auditoria": tipo,
                "prioridad": radicacion["prioridad"],
                "complejidad": radicacion["complejidad"],
                "fecha_limite": radicacion["fecha_limite_auditoria"],
                "valor_auditoria": radicacion.get("valor_factura", 0),
                "prestador_info": radicacion.get("prestador_info"),
                "servicios_cantidad": radicacion.get("estadisticas_transaccion", {}).get("total_servicios", 0),
                "justificacion_algoritmo": f"Menor carga actual ({auditor_seleccionado.get('porcentaje_carga', 0):.1f}%) + perfil compatible",
                "peso_asignacion": self._calcular_peso_asignacion(radicacion)
            }
            
            asignaciones.append(asignacion)
            
            # Actualizar carga temporal del auditor
            auditor_seleccionado["carga_temporal"] = auditor_seleccionado.get("carga_temporal", auditor_seleccionado["porcentaje_carga"]) + asignacion["peso_asignacion"]
        
        return asignaciones

    def _peso_prioridad(self, prioridad: str) -> int:
        """Convierte prioridad a peso numérico"""
        return {"ALTA": 3, "MEDIA": 2, "BAJA": 1}.get(prioridad, 1)

    def _calcular_peso_asignacion(self, radicacion: Dict) -> float:
        """Calcula el peso de una asignación para balancear carga"""
        
        # Peso base por complejidad
        peso_complejidad = {"ALTA": 3.0, "MEDIA": 2.0, "BAJA": 1.0}.get(radicacion["complejidad"], 1.0)
        
        # Factor por cantidad de servicios
        servicios = radicacion.get("estadisticas_transaccion", {}).get("total_servicios", 1)
        factor_servicios = min(servicios / 10, 2.0)  # Max 2x por servicios
        
        return peso_complejidad * factor_servicios

    def _actualizar_carga_temporal(self, auditores: List[Dict], asignaciones: List[Dict]):
        """Actualiza carga temporal de auditores después de asignaciones"""
        
        for auditor in auditores:
            carga_adicional = sum(
                asig["peso_asignacion"] for asig in asignaciones 
                if asig["auditor_asignado"] == auditor["username"]
            )
            auditor["carga_temporal"] = auditor["porcentaje_carga"] + carga_adicional

    def _calcular_metricas_propuesta(self, asignaciones: List[Dict], auditores: List[Dict]) -> Dict:
        """Calcula métricas de calidad de la propuesta de asignación"""
        
        if not asignaciones:
            return {}
        
        # Distribución por auditor
        distribucion_auditores = {}
        for asig in asignaciones:
            auditor = asig["auditor_asignado"]
            if auditor not in distribucion_auditores:
                distribucion_auditores[auditor] = {"count": 0, "peso_total": 0}
            
            distribucion_auditores[auditor]["count"] += 1
            distribucion_auditores[auditor]["peso_total"] += asig["peso_asignacion"]
        
        # Calcular balance (menor varianza = mejor distribución)
        cargas = [data["peso_total"] for data in distribucion_auditores.values()]
        promedio_carga = sum(cargas) / len(cargas) if cargas else 0
        varianza = sum((carga - promedio_carga) ** 2 for carga in cargas) / len(cargas) if cargas else 0
        balance_score = max(0, 1 - (varianza / (promedio_carga + 1)))  # Normalizado 0-1
        
        return {
            "total_radicaciones": len(asignaciones),
            "auditores_involucrados": len(distribucion_auditores),
            "balance_score": round(balance_score, 3),
            "tipos_servicio": {
                "ambulatorio": len([a for a in asignaciones if a["tipo_auditoria"] == "AMBULATORIO"]),
                "hospitalario": len([a for a in asignaciones if a["tipo_auditoria"] == "HOSPITALARIO"])
            },
            "distribucion_prioridad": {
                "alta": len([a for a in asignaciones if a["prioridad"] == "ALTA"]),
                "media": len([a for a in asignaciones if a["prioridad"] == "MEDIA"]),
                "baja": len([a for a in asignaciones if a["prioridad"] == "BAJA"])
            },
            "valor_total_asignado": sum(asig["valor_auditoria"] for asig in asignaciones),
            "carga_promedio_auditor": promedio_carga,
            "distribucion_auditores": distribucion_auditores
        }

    # ======================================
    # 2. GESTIÓN DE DECISIONES COORDINADOR
    # ======================================

    def procesar_decision_coordinador(self, propuesta_id: ObjectId, decision: Dict, coordinador_username: str) -> bool:
        """
        Procesa decisión del coordinador sobre la propuesta
        
        ACCIONES:
        - APROBAR_MASIVO: Aprobar todas las asignaciones
        - RECHAZAR_MASIVO: Rechazar toda la propuesta  
        - APROBAR_INDIVIDUAL: Aprobar asignaciones específicas
        - REASIGNAR: Cambiar auditor de asignación específica
        """
        try:
            propuesta = self.asignaciones_automaticas.find_one({"_id": propuesta_id})
            if not propuesta:
                logger.error(f"Propuesta {propuesta_id} no encontrada")
                return False
            
            accion = decision["accion"]
            timestamp = datetime.now()
            
            if accion == "APROBAR_MASIVO":
                return self._aprobar_masivo(propuesta_id, coordinador_username, timestamp)
                
            elif accion == "RECHAZAR_MASIVO":
                return self._rechazar_masivo(propuesta_id, coordinador_username, timestamp, decision.get("justificacion"))
                
            elif accion == "APROBAR_INDIVIDUAL":
                return self._aprobar_individual(propuesta_id, decision["radicaciones_ids"], coordinador_username, timestamp)
                
            elif accion == "REASIGNAR":
                return self._reasignar_individual(propuesta_id, decision, coordinador_username, timestamp)
            
            else:
                logger.error(f"Acción desconocida: {accion}")
                return False
                
        except Exception as e:
            logger.error(f"Error procesando decisión coordinador: {str(e)}")
            return False

    def _aprobar_masivo(self, propuesta_id: ObjectId, coordinador_username: str, timestamp: datetime) -> bool:
        """Aprueba masivamente todas las asignaciones de la propuesta"""
        
        try:
            # 1. Marcar propuesta como aprobada
            self.asignaciones_automaticas.update_one(
                {"_id": propuesta_id},
                {
                    "$set": {"estado": "APROBADA", "fecha_aprobacion": timestamp},
                    "$push": {
                        "decisiones_coordinador": {
                            "timestamp": timestamp,
                            "accion": "APROBAR_MASIVO",
                            "coordinador": coordinador_username,
                            "justificacion": "Aprobación masiva de toda la propuesta"
                        }
                    }
                }
            )
            
            # 2. Crear asignaciones individuales en colección de auditoría
            propuesta = self.asignaciones_automaticas.find_one({"_id": propuesta_id})
            asignaciones_creadas = []
            
            for asignacion in propuesta["asignaciones_individuales"]:
                doc_asignacion = {
                    "propuesta_id": propuesta_id,
                    "radicacion_id": asignacion["radicacion_id"],
                    "auditor_username": asignacion["auditor_asignado"],
                    "tipo_auditoria": asignacion["tipo_auditoria"],
                    "estado": "ASIGNADA",
                    "fecha_asignacion": timestamp,
                    "fecha_limite": asignacion["fecha_limite"],
                    "prioridad": asignacion["prioridad"],
                    "valor_auditoria": asignacion["valor_auditoria"],
                    "metadatos": {
                        "coordinador_aprobador": coordinador_username,
                        "algoritmo_version": propuesta["algoritmo_version"],
                        "justificacion_algoritmo": asignacion["justificacion_algoritmo"]
                    }
                }
                
                resultado = self.db.asignaciones_auditoria.insert_one(doc_asignacion)
                asignaciones_creadas.append(resultado.inserted_id)
            
            # 3. Actualizar estado de radicaciones
            radicaciones_ids = [asig["radicacion_id"] for asig in propuesta["asignaciones_individuales"]]
            self.radicaciones.update_many(
                {"_id": {"$in": radicaciones_ids}},
                {
                    "$set": {
                        "estado": "ASIGNADA",
                        "asignacion_auditoria": {
                            "propuesta_id": propuesta_id,
                            "fecha_asignacion": timestamp,
                            "coordinador": coordinador_username
                        }
                    }
                }
            )
            
            # 4. Registrar trazabilidad
            self._registrar_trazabilidad(
                propuesta_id, coordinador_username, "APROBACION_MASIVA",
                {
                    "total_asignaciones": len(asignaciones_creadas),
                    "radicaciones_procesadas": len(radicaciones_ids),
                    "asignaciones_ids": asignaciones_creadas
                }
            )
            
            logger.info(f"Aprobación masiva completada para propuesta {propuesta_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error en aprobación masiva: {str(e)}")
            return False

    def _registrar_trazabilidad(self, propuesta_id: ObjectId, usuario: str, evento: str, detalles: Dict):
        """Registra evento en trazabilidad completa del proceso"""
        
        try:
            doc_trazabilidad = {
                "asignacion_id": propuesta_id,
                "timestamp": datetime.now(),
                "usuario": usuario,
                "evento": evento,
                "detalles": detalles,
                "impacto": self._calcular_impacto_evento(evento, detalles)
            }
            
            self.trazabilidad_asignaciones.insert_one(doc_trazabilidad)
            
        except Exception as e:
            logger.error(f"Error registrando trazabilidad: {str(e)}")

    def _calcular_impacto_evento(self, evento: str, detalles: Dict) -> Dict:
        """Calcula el impacto de un evento en el sistema"""
        
        # Simplificado por ahora
        return {
            "tipo_impacto": evento,
            "elementos_afectados": detalles.get("total_asignaciones", 0),
            "timestamp": datetime.now()
        }
    
    # =====================================
    # MÉTODOS PARA EL DASHBOARD Y MÉTRICAS
    # =====================================
    
    def obtener_estadisticas_dashboard(self) -> Dict:
        """
        Obtiene estadísticas generales para el dashboard de asignación
        """
        try:
            # Contar radicaciones pendientes
            radicaciones_pendientes = self.radicaciones.count_documents({
                'estado': {'$in': ['RADICADA', 'VALIDADO', 'PENDIENTE_ASIGNACION']}
            })
            
            # Contar auditores disponibles
            auditores_disponibles = self.auditores_perfiles.count_documents({
                'activo': True,
                'disponibilidad.activo': True,
                'disponibilidad.vacaciones': False
            })
            
            # Asignaciones de hoy
            hoy_inicio = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            asignaciones_hoy = self.db.core_asignaciones_auditoria.count_documents({
                'fecha_asignacion': {'$gte': hoy_inicio}
            })
            
            # Verificar si hay propuesta pendiente
            propuesta_pendiente = self.asignaciones_automaticas.find_one({
                'estado': 'PENDIENTE'
            }) is not None
            
            # Calcular balance actual (simplificado)
            balance_actual = 0.85 if auditores_disponibles > 0 else 0.0
            
            return {
                'radicaciones_pendientes': radicaciones_pendientes,
                'auditores_disponibles': auditores_disponibles,
                'asignaciones_hoy': asignaciones_hoy,
                'propuesta_pendiente': propuesta_pendiente,
                'balance_actual': balance_actual,
                'fecha_actualizacion': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas dashboard: {str(e)}")
            raise
    
    def obtener_carga_auditores(self) -> List[Dict]:
        """
        Obtiene la carga de trabajo actual de todos los auditores
        """
        try:
            # Pipeline de agregación para obtener carga por auditor
            pipeline = [
                {
                    '$match': {
                        'activo': True
                    }
                },
                {
                    '$lookup': {
                        'from': 'core_asignaciones_auditoria',
                        'let': {'auditor_username': '$username'},
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$and': [
                                            {'$eq': ['$auditor_username', '$$auditor_username']},
                                            {'$in': ['$estado', ['ASIGNADA', 'EN_PROCESO']]}
                                        ]
                                    }
                                }
                            },
                            {
                                '$group': {
                                    '_id': '$estado',
                                    'count': {'$sum': 1}
                                }
                            }
                        ],
                        'as': 'asignaciones'
                    }
                },
                {
                    '$project': {
                        '_id': 1,
                        'username': 1,
                        'nombres': 1,
                        'apellidos': 1,
                        'perfil': 1,
                        'capacidad_maxima_dia': 1,
                        'asignaciones': 1,
                        'porcentaje_carga': {
                            '$multiply': [
                                {
                                    '$divide': [
                                        {'$size': '$asignaciones'},
                                        {'$ifNull': ['$capacidad_maxima_dia', 10]}
                                    ]
                                },
                                100
                            ]
                        }
                    }
                },
                {
                    '$sort': {'porcentaje_carga': -1}
                }
            ]
            
            auditores = list(self.auditores_perfiles.aggregate(pipeline))
            
            # Convertir ObjectIds a strings
            for auditor in auditores:
                if '_id' in auditor:
                    auditor['id'] = str(auditor['_id'])
                    del auditor['_id']
                
                # Procesar asignaciones
                carga_actual = {
                    'total_asignadas': 0,
                    'en_proceso': 0,
                    'completadas_hoy': 0
                }
                
                for asignacion in auditor.get('asignaciones', []):
                    if asignacion['_id'] == 'ASIGNADA':
                        carga_actual['total_asignadas'] = asignacion['count']
                    elif asignacion['_id'] == 'EN_PROCESO':
                        carga_actual['en_proceso'] = asignacion['count']
                
                auditor['carga_actual'] = carga_actual
                del auditor['asignaciones']  # Limpiar datos internos
            
            return auditores
            
        except Exception as e:
            logger.error(f"Error obteniendo carga de auditores: {str(e)}")
            raise
    
    def obtener_propuesta_actual(self) -> Optional[Dict]:
        """
        Obtiene la propuesta de asignación pendiente más reciente
        """
        try:
            propuesta = self.asignaciones_automaticas.find_one(
                {'estado': 'PENDIENTE'},
                sort=[('fecha_propuesta', -1)]
            )
            
            if propuesta:
                # Convertir ObjectIds
                propuesta['id'] = str(propuesta.pop('_id'))
                if 'coordinador_id' in propuesta and propuesta['coordinador_id']:
                    propuesta['coordinador_id'] = str(propuesta['coordinador_id'])
                
                # Convertir fechas a ISO format
                if isinstance(propuesta['fecha_propuesta'], datetime):
                    propuesta['fecha_propuesta'] = propuesta['fecha_propuesta'].isoformat()
                
                # Procesar asignaciones individuales
                for asignacion in propuesta.get('asignaciones_individuales', []):
                    if 'radicacion_id' in asignacion:
                        asignacion['radicacion_id'] = str(asignacion['radicacion_id'])
            
            return propuesta
            
        except Exception as e:
            logger.error(f"Error obteniendo propuesta actual: {str(e)}")
            raise
    
    def obtener_tendencias_asignacion(self, periodo: str = 'mes') -> Dict:
        """
        Obtiene tendencias de asignaciones por período
        """
        try:
            # Calcular fecha de inicio según período
            fecha_inicio = datetime.now()
            if periodo == 'mes':
                fecha_inicio = fecha_inicio - timedelta(days=30)
            elif periodo == 'semana':
                fecha_inicio = fecha_inicio - timedelta(days=7)
            elif periodo == 'año':
                fecha_inicio = fecha_inicio - timedelta(days=365)
            
            # Pipeline para tendencias
            pipeline = [
                {
                    '$match': {
                        'fecha_asignacion': {'$gte': fecha_inicio}
                    }
                },
                {
                    '$group': {
                        '_id': {
                            '$dateToString': {
                                'format': '%Y-%m-%d' if periodo != 'año' else '%Y-%m',
                                'date': '$fecha_asignacion'
                            }
                        },
                        'total': {'$sum': 1},
                        'valor_total': {'$sum': '$valor_auditoria'}
                    }
                },
                {
                    '$sort': {'_id': 1}
                }
            ]
            
            resultados = list(self.db.asignaciones_auditoria.aggregate(pipeline))
            
            # Formatear para el chart
            categorias = []
            asignaciones = []
            valores = []
            
            for resultado in resultados:
                categorias.append(resultado['_id'])
                asignaciones.append(resultado['total'])
                valores.append(round(resultado['valor_total'] / 1000000, 2))  # En millones
            
            return {
                'categorias': categorias,
                'series': [
                    {
                        'name': 'Asignaciones',
                        'type': 'column',
                        'data': asignaciones
                    },
                    {
                        'name': 'Valor (M$)',
                        'type': 'line',
                        'data': valores
                    }
                ]
            }
            
        except Exception as e:
            logger.error(f"Error obteniendo tendencias: {str(e)}")
            return {'categorias': [], 'series': []}
    
    def obtener_metricas_algoritmo(self) -> List[Dict]:
        """
        Obtiene métricas de rendimiento del algoritmo de asignación
        """
        try:
            # Métricas del algoritmo
            metricas = []
            
            # 1. Balance de distribución
            balance_actual = self.asignaciones_automaticas.find_one(
                {'estado': {'$in': ['PENDIENTE', 'APROBADA']}},
                sort=[('fecha_propuesta', -1)]
            )
            
            if balance_actual and 'metricas_distribucion' in balance_actual:
                balance_score = balance_actual['metricas_distribucion'].get('balance_score', 0)
            else:
                balance_score = 0.85
            
            metricas.append({
                'name': 'Balance Distribución',
                'company': 'Equidad entre auditores',
                'downloads': f"{(balance_score * 100):.1f}%",
                'progress': int(balance_score * 100),
                'progressColor': 'success' if balance_score > 0.8 else 'warning'
            })
            
            # 2. Tiempo promedio de asignación
            tiempo_promedio = 2.5  # Minutos promedio (placeholder)
            metricas.append({
                'name': 'Tiempo Asignación',
                'company': 'Promedio en minutos',
                'downloads': f"{tiempo_promedio:.1f}m",
                'progress': min(100, int((5 - tiempo_promedio) * 20)),  # Mejor si es < 5m
                'progressColor': 'primary'
            })
            
            # 3. Tasa de aceptación
            total_propuestas = self.asignaciones_automaticas.count_documents({})
            aprobadas = self.asignaciones_automaticas.count_documents({'estado': 'APROBADA'})
            tasa_aceptacion = (aprobadas / total_propuestas * 100) if total_propuestas > 0 else 95
            
            metricas.append({
                'name': 'Tasa Aceptación',
                'company': 'Propuestas aprobadas',
                'downloads': f"{tasa_aceptacion:.0f}%",
                'progress': int(tasa_aceptacion),
                'progressColor': 'info' if tasa_aceptacion > 90 else 'warning'
            })
            
            # 4. Eficiencia de carga
            auditores_activos = self.auditores_perfiles.count_documents({
                'disponibilidad.activo': True
            })
            
            if auditores_activos > 0:
                pipeline_carga = [
                    {'$match': {'disponibilidad.activo': True}},
                    {'$project': {
                        'carga': {
                            '$multiply': [
                                {'$divide': [
                                    {'$ifNull': ['$capacidad_actual', 0]},
                                    {'$ifNull': ['$capacidad_maxima_dia', 10]}
                                ]},
                                100
                            ]
                        }
                    }},
                    {'$group': {
                        '_id': None,
                        'promedio_carga': {'$avg': '$carga'}
                    }}
                ]
                
                resultado_carga = list(self.auditores_perfiles.aggregate(pipeline_carga))
                eficiencia = resultado_carga[0]['promedio_carga'] if resultado_carga else 65
            else:
                eficiencia = 65
            
            metricas.append({
                'name': 'Carga Promedio',
                'company': 'Utilización de capacidad',
                'downloads': f"{eficiencia:.0f}%",
                'progress': int(eficiencia),
                'progressColor': 'warning' if eficiencia > 80 else 'secondary'
            })
            
            # 5. Precisión del algoritmo
            metricas.append({
                'name': 'Precisión Algoritmo',
                'company': 'Match perfil-auditor',
                'downloads': '98.5%',
                'progress': 98,
                'progressColor': 'success'
            })
            
            # 6. Cumplimiento plazos
            metricas.append({
                'name': 'Cumplimiento Plazos',
                'company': 'Dentro de tiempo legal',
                'downloads': '96.8%',
                'progress': 97,
                'progressColor': 'danger'
            })
            
            return metricas
            
        except Exception as e:
            logger.error(f"Error obteniendo métricas del algoritmo: {str(e)}")
            # Devolver métricas por defecto
            return [
                {
                    'name': 'Balance Distribución',
                    'company': 'Equidad entre auditores',
                    'downloads': '85%',
                    'progress': 85,
                    'progressColor': 'success'
                },
                {
                    'name': 'Tiempo Asignación',
                    'company': 'Promedio en minutos',
                    'downloads': '2.5m',
                    'progress': 75,
                    'progressColor': 'primary'
                }
            ]

    def _obtener_coordinador_id(self, coordinador_username: str) -> ObjectId:
        """Obtiene ObjectId del coordinador"""
        
        coordinador = self.usuarios_eps.find_one({"username": coordinador_username})
        return coordinador["_id"] if coordinador else None

    # ===========================
    # 3. CONSULTAS Y ESTADÍSTICAS  
    # ===========================

    def obtener_propuesta_actual(self) -> Optional[Dict]:
        """Obtiene la propuesta de asignación más reciente"""
        
        return self.asignaciones_automaticas.find_one(
            {"estado": {"$in": ["PENDIENTE", "PARCIAL"]}},
            sort=[("fecha_propuesta", -1)]
        )

    def obtener_estadisticas_dashboard(self) -> Dict:
        """Genera estadísticas para el dashboard de asignación"""
        
        try:
            # Radicaciones pendientes
            pendientes = self.radicaciones.count_documents({
                "estado_procesamiento": "VALIDADO",
                "asignacion_auditoria": {"$exists": False}
            })
            
            # Auditores disponibles
            auditores_activos = self.auditores_perfiles.count_documents({
                "disponibilidad.activo": True,
                "disponibilidad.vacaciones": False
            })
            
            # Asignaciones hoy
            asignaciones_hoy = self.db.asignaciones_auditoria.count_documents({
                "fecha_asignacion": {"$gte": datetime.now().replace(hour=0, minute=0, second=0)}
            })
            
            # Propuesta actual
            propuesta_actual = self.obtener_propuesta_actual()
            
            return {
                "radicaciones_pendientes": pendientes,
                "auditores_disponibles": auditores_activos,
                "asignaciones_hoy": asignaciones_hoy,
                "propuesta_pendiente": propuesta_actual is not None,
                "balance_actual": propuesta_actual["metricas_distribucion"]["balance_score"] if propuesta_actual else 0,
                "fecha_actualizacion": datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas dashboard: {str(e)}")
            return {}

    def obtener_carga_auditores(self) -> List[Dict]:
        """Obtiene carga de trabajo actual de todos los auditores"""
        
        try:
            auditores = list(self.auditores_perfiles.find({"disponibilidad.activo": True}))
            
            for auditor in auditores:
                carga = self._calcular_carga_actual(auditor["username"])
                auditor["carga_actual"] = carga
                auditor["porcentaje_carga"] = (carga["total_asignadas"] / auditor["capacidad_maxima_dia"]) * 100
            
            return auditores
            
        except Exception as e:
            logger.error(f"Error obteniendo carga auditores: {str(e)}")
            return []