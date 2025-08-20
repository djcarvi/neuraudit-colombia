# -*- coding: utf-8 -*-
# apps/radicacion/services_rips.py

"""
Servicios MongoDB nativos para RIPS - NeurAudit Colombia
Procesamiento, validación y análisis de transacciones RIPS
"""

from apps.core.services.mongodb_service import mongodb_service
from apps.catalogs.services import catalogs_service
from bson import ObjectId
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from decimal import Decimal
import json
import logging

logger = logging.getLogger(__name__)

class RIPSService:
    """
    Servicios especializados para procesamiento RIPS
    """
    
    def __init__(self):
        self.mongodb = mongodb_service
        self.catalogs = catalogs_service
    
    # =======================================
    # PROCESAMIENTO TRANSACCIONES RIPS
    # =======================================
    
    def procesar_transaccion_rips(self, archivo_rips: Dict, prestador_info: Dict) -> Dict:
        """
        Procesamiento completo de transacción RIPS desde JSON
        """
        try:
            # Validar estructura básica
            if not self._validar_estructura_rips(archivo_rips):
                return {
                    "success": False,
                    "error": "Estructura RIPS inválida",
                    "causal_devolucion": "DE0001"
                }
            
            # Crear documento transacción base
            transaccion_doc = {
                "numFactura": archivo_rips.get('numFactura'),
                "prestadorNit": prestador_info.get('nit'),
                "prestadorRazonSocial": prestador_info.get('razon_social'),
                "fechaRadicacion": datetime.now(),
                "estadoProcesamiento": "RADICADO",
                "usuarios": [],
                "archivoRIPSOriginal": archivo_rips.get('archivo_path'),
                "tamanoArchivo": archivo_rips.get('tamaño_bytes')
            }
            
            # Procesar usuarios y servicios
            usuarios_procesados = []
            estadisticas_globales = {
                "totalUsuarios": 0,
                "totalServicios": 0,
                "valorTotalFacturado": Decimal('0.00'),
                "distribucionServicios": {}
            }
            
            for usuario_data in archivo_rips.get('usuarios', []):
                usuario_procesado = self._procesar_usuario_rips(usuario_data)
                usuarios_procesados.append(usuario_procesado)
                
                # Actualizar estadísticas
                if usuario_procesado.get('estadisticasUsuario'):
                    stats = usuario_procesado['estadisticasUsuario']
                    estadisticas_globales['totalServicios'] += stats.get('totalServicios', 0)
                    estadisticas_globales['valorTotalFacturado'] += Decimal(str(stats.get('valorTotal', 0)))
            
            estadisticas_globales['totalUsuarios'] = len(usuarios_procesados)
            
            # Asignar datos procesados
            transaccion_doc['usuarios'] = usuarios_procesados
            transaccion_doc['estadisticasTransaccion'] = estadisticas_globales
            
            # Insertar en MongoDB
            resultado = self.mongodb.db.rips_transacciones.insert_one(transaccion_doc)
            transaccion_id = str(resultado.inserted_id)
            
            # Ejecutar pre-auditoría automática
            pre_auditoria = self.ejecutar_preauditoria_automatica(transaccion_id)
            
            return {
                "success": True,
                "transaccion_id": transaccion_id,
                "num_factura": archivo_rips.get('numFactura'),
                "total_usuarios": estadisticas_globales['totalUsuarios'],
                "total_servicios": estadisticas_globales['totalServicios'],
                "valor_total": float(estadisticas_globales['valorTotalFacturado']),
                "pre_auditoria": pre_auditoria
            }
            
        except Exception as e:
            logger.error(f"Error procesamiento RIPS: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _validar_estructura_rips(self, archivo_rips: Dict) -> bool:
        """
        Validación básica estructura RIPS JSON
        """
        campos_requeridos = ['numFactura', 'usuarios']
        return all(campo in archivo_rips for campo in campos_requeridos)
    
    def _procesar_usuario_rips(self, usuario_data: Dict) -> Dict:
        """
        Procesa un usuario individual con todos sus servicios
        """
        try:
            usuario_doc = {
                "tipoDocumento": usuario_data.get('tipoDocumento'),
                "numeroDocumento": usuario_data.get('numeroDocumento'),
                "datosPersonales": {
                    "fechaNacimiento": datetime.strptime(usuario_data.get('fechaNacimiento'), '%Y-%m-%d').date(),
                    "sexo": usuario_data.get('sexo'),
                    "municipioResidencia": usuario_data.get('municipioResidencia'),
                    "zonaResidencia": usuario_data.get('zonaResidencia', 'U')
                },
                "servicios": {},
                "estadisticasUsuario": {
                    "totalServicios": 0,
                    "valorTotal": Decimal('0.00'),
                    "serviciosValidados": 0,
                    "serviciosGlosados": 0,
                    "valorGlosado": Decimal('0.00')
                }
            }
            
            # Procesar cada tipo de servicio
            tipos_servicio = ['consultas', 'procedimientos', 'medicamentos', 'urgencias', 
                            'hospitalizacion', 'recienNacidos', 'otrosServicios']
            
            for tipo in tipos_servicio:
                if tipo in usuario_data:
                    servicios_procesados = self._procesar_servicios_tipo(usuario_data[tipo], tipo)
                    usuario_doc['servicios'][tipo] = servicios_procesados
                    
                    # Actualizar estadísticas usuario
                    for servicio in servicios_procesados:
                        usuario_doc['estadisticasUsuario']['totalServicios'] += 1
                        valor_servicio = Decimal(str(servicio.get('vrServicio', 0)))
                        usuario_doc['estadisticasUsuario']['valorTotal'] += valor_servicio
            
            # Validar BDUA
            validacion_bdua = self._validar_bdua_usuario(usuario_doc)
            usuario_doc['validacionBDUA'] = validacion_bdua
            
            return usuario_doc
            
        except Exception as e:
            logger.error(f"Error procesando usuario RIPS: {e}")
            return {}
    
    def _procesar_servicios_tipo(self, servicios: List[Dict], tipo: str) -> List[Dict]:
        """
        Procesa servicios de un tipo específico con validaciones
        """
        servicios_procesados = []
        
        for servicio in servicios:
            servicio_doc = servicio.copy()
            servicio_doc['estadoValidacion'] = 'PENDIENTE'
            servicio_doc['glosas'] = []
            servicio_doc['observaciones'] = ""
            
            # Validaciones específicas por tipo
            if tipo in ['consultas', 'procedimientos']:
                codigo_cups = servicio.get('codConsulta') or servicio.get('codProcedimiento')
                if codigo_cups:
                    validacion_cups = self.catalogs.validar_codigo_cups(codigo_cups)
                    if not validacion_cups.get('valido'):
                        servicio_doc['glosas'].append('CO0001')
                        servicio_doc['observaciones'] = validacion_cups.get('mensaje')
            
            elif tipo == 'medicamentos':
                codigo_cum = servicio.get('codTecnologiaSalud')
                if codigo_cum:
                    validacion_med = self.catalogs.validar_medicamento_pos_nopos(codigo_cum)
                    if not validacion_med.get('valido'):
                        servicio_doc['glosas'].append(validacion_med.get('causal_glosa'))
                        servicio_doc['observaciones'] = validacion_med.get('mensaje')
            
            servicios_procesados.append(servicio_doc)
        
        return servicios_procesados
    
    def _validar_bdua_usuario(self, usuario_doc: Dict) -> Dict:
        """
        Validación BDUA para usuario específico
        """
        try:
            # Tomar fecha de cualquier servicio para validación
            fecha_atencion = None
            servicios = usuario_doc.get('servicios', {})
            
            for tipo_servicio, lista_servicios in servicios.items():
                if lista_servicios and len(lista_servicios) > 0:
                    fecha_atencion = lista_servicios[0].get('fechaAtencion')
                    if fecha_atencion:
                        # Extraer solo la fecha (YYYY-MM-DD)
                        fecha_atencion = fecha_atencion[:10]
                        break
            
            if not fecha_atencion:
                return {
                    "tieneDerechos": False,
                    "observaciones": "No se encontró fecha de atención válida"
                }
            
            # Validar en BDUA
            validacion = self.catalogs.validar_usuario_integral(
                usuario_doc.get('tipoDocumento'),
                usuario_doc.get('numeroDocumento'),
                fecha_atencion
            )
            
            return {
                "tieneDerechos": validacion.get('tiene_derechos', False),
                "regimen": validacion.get('regimen'),
                "epsActual": validacion.get('eps_actual'),
                "fechaValidacion": datetime.now(),
                "observaciones": validacion.get('mensaje', '')
            }
            
        except Exception as e:
            logger.error(f"Error validación BDUA usuario: {e}")
            return {
                "tieneDerechos": False,
                "observaciones": f"Error en validación: {str(e)}"
            }
    
    # =======================================
    # PRE-AUDITORÍA AUTOMÁTICA
    # =======================================
    
    def ejecutar_preauditoria_automatica(self, transaccion_id: str) -> Dict:
        """
        Ejecuta pre-auditoría automática completa
        """
        try:
            # Detección de pre-glosas
            preglosas = self.mongodb.detectar_preglosas_automaticas(transaccion_id)
            
            # Detección de devoluciones
            devoluciones = self._detectar_devoluciones_automaticas(transaccion_id)
            
            # Determinar si requiere auditoría humana
            requiere_auditoria = (
                preglosas.get('total_preglosas', 0) > 0 or 
                len(devoluciones.get('causales', [])) == 0  # Si no hay devoluciones, continúa a auditoría
            )
            
            # Actualizar transacción con resultados
            pre_auditoria_doc = {
                "preDevolucion": devoluciones,
                "preGlosas": {
                    "total": preglosas.get('total_preglosas', 0),
                    "valorTotal": preglosas.get('valor_total_glosas', 0),
                    "detalle": preglosas.get('preglosas', [])
                },
                "fechaPreAuditoria": datetime.now()
            }
            
            # Si hay devoluciones, cambiar estado
            nuevo_estado = "VALIDANDO"
            if devoluciones.get('requiere_devolucion'):
                nuevo_estado = "DEVUELTO"
            elif requiere_auditoria:
                nuevo_estado = "PRE_AUDITORIA"
            
            # Actualizar en MongoDB
            self.mongodb.db.rips_transacciones.update_one(
                {"_id": ObjectId(transaccion_id)},
                {
                    "$set": {
                        "preAuditoria": pre_auditoria_doc,
                        "estadoProcesamiento": nuevo_estado
                    }
                }
            )
            
            return {
                "transaccion_id": transaccion_id,
                "requiere_auditoria": requiere_auditoria,
                "devoluciones": devoluciones,
                "preglosas": preglosas,
                "estado_final": nuevo_estado
            }
            
        except Exception as e:
            logger.error(f"Error pre-auditoría automática {transaccion_id}: {e}")
            return {"error": str(e)}
    
    def _detectar_devoluciones_automaticas(self, transaccion_id: str) -> Dict:
        """
        Detecta causales de devolución automática
        """
        try:
            transaccion = self.mongodb.db.rips_transacciones.find_one({"_id": ObjectId(transaccion_id)})
            if not transaccion:
                return {"error": "Transacción no encontrada"}
            
            causales_devolucion = []
            
            # DE16: Verificar BDUA de usuarios
            usuarios_sin_derechos = 0
            for usuario in transaccion.get('usuarios', []):
                validacion_bdua = usuario.get('validacionBDUA', {})
                if not validacion_bdua.get('tieneDerechos'):
                    usuarios_sin_derechos += 1
            
            if usuarios_sin_derechos > 0:
                causales_devolucion.append({
                    "codigo": "DE16",
                    "descripcion": f"{usuarios_sin_derechos} usuarios sin derechos en BDUA",
                    "usuarios_afectados": usuarios_sin_derechos
                })
            
            # DE44: Verificar si prestador está en red
            prestador_nit = transaccion.get('prestadorNit')
            if prestador_nit:
                prestador_en_red = self.mongodb.db.prestadores.find_one({
                    "nit": prestador_nit,
                    "estado": "ACTIVO"
                })
                if not prestador_en_red:
                    causales_devolucion.append({
                        "codigo": "DE44",
                        "descripcion": "Prestador no hace parte de la red",
                        "prestador_nit": prestador_nit
                    })
            
            # DE56: Verificar radicación dentro de 22 días hábiles (simplificado)
            fecha_radicacion = transaccion.get('fechaRadicacion')
            if fecha_radicacion:
                dias_transcurridos = (datetime.now() - fecha_radicacion).days
                if dias_transcurridos > 25:  # Aproximado 22 días hábiles
                    causales_devolucion.append({
                        "codigo": "DE56",
                        "descripcion": "Radicación fuera del plazo de 22 días hábiles",
                        "dias_transcurridos": dias_transcurridos
                    })
            
            return {
                "requiere_devolucion": len(causales_devolucion) > 0,
                "total_causales": len(causales_devolucion),
                "causales": causales_devolucion
            }
            
        except Exception as e:
            logger.error(f"Error detección devoluciones {transaccion_id}: {e}")
            return {"error": str(e)}
    
    # =======================================
    # CONSULTAS Y REPORTES
    # =======================================
    
    def obtener_transacciones_prestador(self, prestador_nit: str, filtros: Dict = None) -> List[Dict]:
        """
        Obtiene transacciones de un prestador con filtros
        """
        try:
            query = {"prestadorNit": prestador_nit}
            
            # Aplicar filtros
            if filtros:
                if filtros.get('estado'):
                    query["estadoProcesamiento"] = filtros['estado']
                if filtros.get('fecha_desde'):
                    query["fechaRadicacion"] = {"$gte": datetime.strptime(filtros['fecha_desde'], '%Y-%m-%d')}
                if filtros.get('fecha_hasta'):
                    if "fechaRadicacion" not in query:
                        query["fechaRadicacion"] = {}
                    query["fechaRadicacion"]["$lte"] = datetime.strptime(filtros['fecha_hasta'], '%Y-%m-%d')
            
            transacciones = list(self.mongodb.db.rips_transacciones.find(query).sort("fechaRadicacion", -1))
            
            # Convertir ObjectId a string
            for transaccion in transacciones:
                transaccion['_id'] = str(transaccion['_id'])
            
            return transacciones
            
        except Exception as e:
            logger.error(f"Error consulta transacciones prestador {prestador_nit}: {e}")
            return []
    
    def obtener_dashboard_auditoria(self, filtros: Dict = None) -> Dict:
        """
        Dashboard de auditoría con métricas agregadas
        """
        try:
            # Pipeline de agregación para estadísticas
            pipeline = [
                {"$match": filtros or {}},
                {
                    "$group": {
                        "_id": "$estadoProcesamiento",
                        "total_transacciones": {"$sum": 1},
                        "valor_total": {"$sum": "$estadisticasTransaccion.valorTotalFacturado"},
                        "total_servicios": {"$sum": "$estadisticasTransaccion.totalServicios"}
                    }
                }
            ]
            
            estadisticas_estado = list(self.mongodb.db.rips_transacciones.aggregate(pipeline))
            
            # Balance de cargas auditores
            balance_auditores = self.mongodb.obtener_balance_cargas_auditores()
            
            return {
                "estadisticas_por_estado": estadisticas_estado,
                "balance_auditores": balance_auditores,
                "fecha_generacion": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error dashboard auditoría: {e}")
            return {}

# Instancia del servicio
rips_service = RIPSService()