# -*- coding: utf-8 -*-
# apps/catalogs/services.py

"""
Servicios MongoDB nativos para catálogos oficiales - NeurAudit Colombia
Servicios especializados para CUPS, CUM, IUM, Dispositivos y BDUA
"""

from apps.core.services.mongodb_service import mongodb_service
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class CatalogsService:
    """
    Servicios especializados para catálogos oficiales
    """
    
    def __init__(self):
        self.mongodb = mongodb_service
    
    # =======================================
    # SERVICIOS CUPS
    # =======================================
    
    def buscar_cups_avanzado(self, termino: str, filtros: Dict = None) -> List[Dict]:
        """
        Búsqueda avanzada de códigos CUPS con filtros
        """
        try:
            query = {"habilitado": True}
            
            # Búsqueda por código o descripción
            if termino:
                query["$or"] = [
                    {"codigo": {"$regex": termino, "$options": "i"}},
                    {"nombre": {"$regex": termino, "$options": "i"}},
                    {"descripcion": {"$regex": termino, "$options": "i"}}
                ]
            
            # Aplicar filtros adicionales
            if filtros:
                if filtros.get('es_quirurgico') is not None:
                    query["es_quirurgico"] = filtros['es_quirurgico']
                if filtros.get('sexo'):
                    query["sexo"] = {"$in": [filtros['sexo'], 'Z']}  # Z = ambos sexos
                if filtros.get('ambito'):
                    query["ambito"] = {"$in": [filtros['ambito'], 'Z']}  # Z = ambos ámbitos
            
            resultados = list(self.mongodb.db.catalogo_cups_oficial.find(query).limit(100))
            
            # Convertir ObjectId a string
            for resultado in resultados:
                resultado['_id'] = str(resultado['_id'])
            
            return resultados
            
        except Exception as e:
            logger.error(f"Error búsqueda CUPS avanzada: {e}")
            return []
    
    def validar_codigo_cups(self, codigo: str, contexto: Dict = None) -> Dict:
        """
        Validación integral de código CUPS con contexto clínico
        """
        try:
            cups = self.mongodb.buscar_codigo_cups(codigo)
            
            if not cups:
                return {
                    "valido": False,
                    "mensaje": "Código CUPS no encontrado",
                    "causal_glosa": "CO0001"
                }
            
            # Validaciones contextuales
            validaciones = []
            
            if contexto:
                # Validar sexo del paciente
                if contexto.get('sexo_paciente') and cups.get('sexo') not in ['Z', contexto['sexo_paciente']]:
                    validaciones.append({
                        "tipo": "restriccion_sexo",
                        "mensaje": f"Procedimiento no aplica para sexo {contexto['sexo_paciente']}",
                        "causal_glosa": "CL0101"
                    })
                
                # Validar ámbito
                if contexto.get('ambito') and cups.get('ambito') not in ['Z', contexto['ambito']]:
                    validaciones.append({
                        "tipo": "restriccion_ambito", 
                        "mensaje": f"Procedimiento no aplica para ámbito {contexto['ambito']}",
                        "causal_glosa": "CL0102"
                    })
            
            return {
                "valido": len(validaciones) == 0,
                "codigo": codigo,
                "descripcion": cups.get('nombre'),
                "es_quirurgico": cups.get('es_quirurgico', False),
                "restricciones": cups,
                "validaciones": validaciones
            }
            
        except Exception as e:
            logger.error(f"Error validación CUPS {codigo}: {e}")
            return {"valido": False, "mensaje": "Error en validación"}
    
    # =======================================
    # SERVICIOS MEDICAMENTOS
    # =======================================
    
    def buscar_medicamento_unificado(self, termino: str, tipo: str = "AMBOS") -> List[Dict]:
        """
        Búsqueda unificada en CUM e IUM con scoring
        """
        try:
            resultados = []
            
            # Búsqueda en CUM
            if tipo in ["CUM", "AMBOS"]:
                query_cum = {
                    "habilitado": True,
                    "$or": [
                        {"codigo": {"$regex": termino, "$options": "i"}},
                        {"nombre": {"$regex": termino, "$options": "i"}},
                        {"principio_activo": {"$regex": termino, "$options": "i"}}
                    ]
                }
                
                medicamentos_cum = list(self.mongodb.db.catalogo_cum_oficial.find(query_cum).limit(50))
                for med in medicamentos_cum:
                    med['_id'] = str(med['_id'])
                    med['tipo_catalogo'] = 'CUM'
                    med['score'] = self._calcular_score_busqueda(termino, med)
                    resultados.append(med)
            
            # Búsqueda en IUM
            if tipo in ["IUM", "AMBOS"]:
                query_ium = {
                    "habilitado": True,
                    "$or": [
                        {"codigo": {"$regex": termino, "$options": "i"}},
                        {"nombre": {"$regex": termino, "$options": "i"}},
                        {"principio_activo": {"$regex": termino, "$options": "i"}}
                    ]
                }
                
                medicamentos_ium = list(self.mongodb.db.catalogo_ium_oficial.find(query_ium).limit(50))
                for med in medicamentos_ium:
                    med['_id'] = str(med['_id'])
                    med['tipo_catalogo'] = 'IUM'
                    med['score'] = self._calcular_score_busqueda(termino, med)
                    resultados.append(med)
            
            # Ordenar por score descendente
            resultados.sort(key=lambda x: x.get('score', 0), reverse=True)
            
            return resultados[:100]  # Top 100 resultados
            
        except Exception as e:
            logger.error(f"Error búsqueda medicamento unificada: {e}")
            return []
    
    def _calcular_score_busqueda(self, termino: str, medicamento: Dict) -> float:
        """
        Calcula score de relevancia para búsquedas
        """
        score = 0.0
        termino_lower = termino.lower()
        
        # Score por coincidencia exacta en código (máxima prioridad)
        if medicamento.get('codigo', '').lower() == termino_lower:
            score += 100
        elif termino_lower in medicamento.get('codigo', '').lower():
            score += 50
        
        # Score por coincidencia en nombre
        if termino_lower in medicamento.get('nombre', '').lower():
            score += 30
        
        # Score por coincidencia en principio activo
        if termino_lower in medicamento.get('principio_activo', '').lower():
            score += 20
        
        return score
    
    def validar_medicamento_pos_nopos(self, codigo_cum: str, tipo_usuario: str = "C") -> Dict:
        """
        Validación POS/No POS según tipo de usuario
        """
        try:
            medicamento = self.mongodb.buscar_medicamento_cum_ium(codigo_cum, "CUM")
            
            if not medicamento:
                return {
                    "valido": False,
                    "mensaje": "Medicamento no encontrado",
                    "causal_glosa": "CO0003"
                }
            
            # Lógica POS/No POS (simplificada)
            es_pos = medicamento.get('es_muestra_medica', False) == False
            
            # Para régimen contributivo
            if tipo_usuario == "C" and not es_pos:
                return {
                    "valido": False,
                    "mensaje": "Medicamento No POS no cubierto para régimen contributivo",
                    "causal_glosa": "CO0004",
                    "requiere_mipres": True
                }
            
            return {
                "valido": True,
                "es_pos": es_pos,
                "medicamento": medicamento,
                "requiere_mipres": not es_pos
            }
            
        except Exception as e:
            logger.error(f"Error validación POS/No POS {codigo_cum}: {e}")
            return {"valido": False, "mensaje": "Error en validación"}
    
    # =======================================
    # SERVICIOS BDUA
    # =======================================
    
    def validar_usuario_integral(self, tipo_doc: str, num_doc: str, fecha_atencion: str, 
                               prestador_nit: str = None) -> Dict:
        """
        Validación integral BDUA con verificación de red
        """
        try:
            # Validación BDUA básica
            validacion_bdua = self.mongodb.validar_bdua_usuario(tipo_doc, num_doc, fecha_atencion)
            
            if not validacion_bdua.get('tiene_derechos'):
                return validacion_bdua
            
            # Validaciones adicionales
            validaciones_extra = []
            
            # Verificar si prestador está en red (si se proporciona)
            if prestador_nit:
                prestador_en_red = self._verificar_prestador_red(prestador_nit)
                if not prestador_en_red:
                    validaciones_extra.append({
                        "tipo": "prestador_red",
                        "mensaje": "Prestador no hace parte de la red",
                        "causal_devolucion": "DE44"
                    })
            
            # Combinar resultados
            validacion_bdua['validaciones_adicionales'] = validaciones_extra
            validacion_bdua['validacion_completa'] = len(validaciones_extra) == 0
            
            return validacion_bdua
            
        except Exception as e:
            logger.error(f"Error validación integral usuario {tipo_doc}-{num_doc}: {e}")
            return {"error": str(e)}
    
    def _verificar_prestador_red(self, prestador_nit: str) -> bool:
        """
        Verifica si prestador está en la red de EPS Familiar
        """
        try:
            prestador = self.mongodb.db.prestadores.find_one({
                "nit": prestador_nit,
                "estado": "ACTIVO"
            })
            return prestador is not None
        except Exception as e:
            logger.error(f"Error verificación red prestador {prestador_nit}: {e}")
            return False
    
    def obtener_estadisticas_bdua(self, filtros: Dict = None) -> Dict:
        """
        Estadísticas agregadas BDUA por régimen, departamento, etc.
        """
        try:
            pipeline = [
                {"$match": filtros or {}},
                {
                    "$group": {
                        "_id": {
                            "regimen": "$regimen",
                            "estado": "$afiliacion_estado_afiliacion",
                            "departamento": "$ubicacion_departamento"
                        },
                        "total_afiliados": {"$sum": 1}
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "regimen": "$_id.regimen",
                            "departamento": "$_id.departamento"
                        },
                        "por_estado": {
                            "$push": {
                                "estado": "$_id.estado",
                                "total": "$total_afiliados"
                            }
                        },
                        "total_departamento": {"$sum": "$total_afiliados"}
                    }
                }
            ]
            
            resultados = list(self.mongodb.db.bdua_afiliados.aggregate(pipeline))
            return {"estadisticas": resultados}
            
        except Exception as e:
            logger.error(f"Error estadísticas BDUA: {e}")
            return {}

# Instancia del servicio
catalogs_service = CatalogsService()