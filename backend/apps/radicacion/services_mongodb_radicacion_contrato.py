# -*- coding: utf-8 -*-
# apps/radicacion/services_mongodb_radicacion_contrato.py
"""
Servicio MongoDB para asociar contratos con radicaciones
NoSQL puro sin Django ORM
"""

from pymongo import MongoClient, ASCENDING, DESCENDING, UpdateOne
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime, date
from decimal import Decimal
from typing import Dict, List, Optional, Any, Tuple
import logging

from apps.core.mongodb_config import get_mongodb, get_collection
from apps.contratacion.services_mongodb_cups import servicio_cups_contractual

logger = logging.getLogger('neuraudit.radicacion')


class RadicacionContratoNoSQL:
    """
    Gestión NoSQL pura de radicaciones con contratos asociados
    """
    
    def __init__(self):
        self.db = get_mongodb().db
        self.radicaciones = self.db.radicaciones_cuentas_medicas
        self.contratos = self.db.contratos
        self.rips_transacciones = self.db.rips_transacciones
        self.prestadores = self.db.prestadores
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Asegurar índices para óptimo rendimiento"""
        try:
            # Índices para radicaciones con contratos
            self.radicaciones.create_index([
                ("prestador_nit", ASCENDING),
                ("contrato_id", ASCENDING),
                ("fecha_radicacion", DESCENDING)
            ], name="idx_radicacion_contrato")
            
            self.radicaciones.create_index([
                ("numero_factura", ASCENDING),
                ("prestador_nit", ASCENDING)
            ], unique=True, name="idx_factura_prestador_unique")
            
            self.radicaciones.create_index([
                ("estado", ASCENDING),
                ("contrato_id", ASCENDING)
            ], name="idx_estado_contrato")
            
            logger.info("✅ Índices MongoDB creados para radicaciones con contratos")
        except Exception as e:
            logger.warning(f"⚠️ Error creando índices: {str(e)}")
    
    def obtener_contratos_activos_prestador(self, prestador_nit: str, fecha_servicio: date = None) -> List[Dict]:
        """
        Obtener contratos activos de un prestador en una fecha específica
        """
        try:
            filtro = {
                'prestador.nit': prestador_nit,
                'estado': {'$in': ['VIGENTE', 'POR_VENCER']}
            }
            
            if fecha_servicio:
                filtro['fecha_inicio'] = {'$lte': fecha_servicio}
                filtro['fecha_fin'] = {'$gte': fecha_servicio}
            
            contratos = list(self.contratos.find(
                filtro,
                {
                    '_id': 1,
                    'numero_contrato': 1,
                    'modalidad_principal': 1,
                    'fecha_inicio': 1,
                    'fecha_fin': 1,
                    'manual_tarifario': 1,
                    'porcentaje_negociacion': 1,
                    'estado': 1
                }
            ).sort('fecha_inicio', DESCENDING))
            
            # Convertir ObjectId a string
            for contrato in contratos:
                contrato['id'] = str(contrato['_id'])
                del contrato['_id']
                # Convertir fechas a ISO format
                contrato['fecha_inicio'] = contrato['fecha_inicio'].isoformat()
                contrato['fecha_fin'] = contrato['fecha_fin'].isoformat()
            
            return contratos
            
        except Exception as e:
            logger.error(f"Error obteniendo contratos activos: {str(e)}")
            return []
    
    def _convert_date_to_datetime(self, date_obj):
        """Convertir date a datetime para MongoDB"""
        if date_obj is None:
            return None
        if isinstance(date_obj, str):
            try:
                # Intentar parsear string como fecha
                from datetime import datetime
                return datetime.strptime(date_obj, '%Y-%m-%d')
            except:
                return date_obj
        if hasattr(date_obj, 'date'):  # Es datetime
            return date_obj
        if hasattr(date_obj, 'year'):  # Es date
            from datetime import datetime
            return datetime.combine(date_obj, datetime.min.time())
        return date_obj
    
    def crear_radicacion_con_contrato(self, datos_radicacion: Dict) -> Dict[str, Any]:
        """
        Crear nueva radicación asociada a un contrato específico
        
        Args:
            datos_radicacion: Debe incluir 'contrato_id' obligatoriamente
        
        Returns:
            Resultado de la operación
        """
        try:
            # Validar contrato_id obligatorio
            contrato_id = datos_radicacion.get('contrato_id')
            if not contrato_id:
                return {
                    'success': False,
                    'error': 'El campo contrato_id es obligatorio para radicar',
                    'codigo_devolucion': 'DE9001'  # Código personalizado: Sin contrato especificado
                }
            
            # Verificar que el contrato existe y está vigente
            # Intentar primero como string, luego como ObjectId
            contrato = self.contratos.find_one({
                '_id': contrato_id,
                'estado': {'$in': ['VIGENTE', 'POR_VENCER']}
            })
            
            # Si no se encuentra como string, intentar como ObjectId
            if not contrato:
                try:
                    contrato = self.contratos.find_one({
                        '_id': ObjectId(contrato_id),
                        'estado': {'$in': ['VIGENTE', 'POR_VENCER']}
                    })
                except:
                    pass
            
            if not contrato:
                return {
                    'success': False,
                    'error': f'Contrato {contrato_id} no encontrado o no vigente',
                    'codigo_devolucion': 'DE9002'  # Código: Contrato inválido
                }
            
            # Verificar que el contrato pertenece al prestador
            if contrato['prestador']['nit'] != datos_radicacion.get('prestador_nit'):
                return {
                    'success': False,
                    'error': 'El contrato no corresponde al prestador',
                    'codigo_devolucion': 'DE9003'  # Código: Contrato no corresponde
                }
            
            # Validar valor de factura - FIX para el bug de valores no-cero
            valor_factura = Decimal(str(datos_radicacion.get('valor_factura', 0)))
            
            # IMPORTANTE: Validar que el valor sea mayor o igual a cero
            # pero NO rechazar valores cero si es intencional
            if valor_factura < 0:
                return {
                    'success': False,
                    'error': 'El valor de la factura no puede ser negativo',
                    'codigo_devolucion': 'FA0101'
                }
            
            # Si el valor es cero, marcar con flag especial
            es_factura_valor_cero = (valor_factura == 0)
            
            # Crear documento de radicación
            timestamp = datetime.now()
            numero_radicado = self._generar_numero_radicado(timestamp)
            
            doc_radicacion = {
                '_id': ObjectId(),
                'numero_radicado': numero_radicado,
                
                # Información del prestador
                'prestador_nit': datos_radicacion.get('prestador_nit'),
                'prestador_razon_social': contrato['prestador']['razon_social'],
                'prestador_codigo_habilitacion': contrato['prestador'].get('codigo_habilitacion'),
                
                # ASOCIACIÓN CON CONTRATO - NUEVO
                'contrato_id': contrato_id,  # Mantener como string para consistencia
                'numero_contrato': contrato['numero_contrato'],
                'modalidad_contrato': contrato.get('modalidad_principal'),
                'manual_tarifario': contrato.get('manual_tarifario'),
                
                # Información de la factura
                'numero_factura': datos_radicacion.get('numero_factura'),
                'fecha_expedicion': self._convert_date_to_datetime(datos_radicacion.get('fecha_expedicion')),
                'fecha_inicio_periodo': self._convert_date_to_datetime(datos_radicacion.get('fecha_inicio_periodo')),
                'fecha_fin_periodo': self._convert_date_to_datetime(datos_radicacion.get('fecha_fin_periodo')),
                
                # Valores financieros - FIX para bug de valores
                'valor_factura': float(valor_factura),
                'es_factura_valor_cero': es_factura_valor_cero,  # Flag especial
                'valor_copago': float(datos_radicacion.get('valor_copago', 0)),
                'valor_cuota_moderadora': float(datos_radicacion.get('valor_cuota_moderadora', 0)),
                'valor_neto': float(valor_factura - Decimal(str(datos_radicacion.get('valor_copago', 0))) - Decimal(str(datos_radicacion.get('valor_cuota_moderadora', 0)))),
                
                # Estado y control
                'estado': 'RADICADA',
                'fecha_radicacion': timestamp,
                'usuario_radicador': datos_radicacion.get('usuario_id'),
                
                # RIPS asociados
                'rips_transaccion_id': ObjectId(datos_radicacion.get('rips_id')) if datos_radicacion.get('rips_id') else None,
                'total_usuarios_rips': datos_radicacion.get('total_usuarios', 0),
                'total_servicios_rips': datos_radicacion.get('total_servicios', 0),
                
                # Documentos soporte
                'documentos_soporte': datos_radicacion.get('documentos', []),
                
                # Metadata
                'created_at': timestamp,
                'updated_at': timestamp,
                'ip_radicacion': datos_radicacion.get('ip_address'),
                'plataforma': 'WEB',
                
                # Validaciones pendientes
                'validaciones': {
                    'tarifas': {'estado': 'PENDIENTE', 'fecha': None, 'resultados': []},
                    'cobertura': {'estado': 'PENDIENTE', 'fecha': None, 'resultados': []},
                    'autorizaciones': {'estado': 'PENDIENTE', 'fecha': None, 'resultados': []},
                    'soportes': {'estado': 'PENDIENTE', 'fecha': None, 'resultados': []}
                }
            }
            
            # Insertar radicación
            resultado = self.radicaciones.insert_one(doc_radicacion)
            
            # Actualizar estadísticas del contrato
            self.contratos.update_one(
                {'_id': contrato_id},
                {
                    '$inc': {
                        'estadisticas.total_radicaciones': 1,
                        'estadisticas.valor_total_radicado': float(valor_factura)
                    },
                    '$set': {
                        'updated_at': timestamp
                    }
                }
            )
            
            # Si hay RIPS, asociarlo también con el contrato
            if datos_radicacion.get('rips_id'):
                self.rips_transacciones.update_one(
                    {'_id': ObjectId(datos_radicacion['rips_id'])},
                    {
                        '$set': {
                            'contrato_id': contrato_id,
                            'numero_contrato': contrato['numero_contrato'],
                            'radicacion_id': resultado.inserted_id,
                            'numero_radicado': numero_radicado
                        }
                    }
                )
            
            return {
                'success': True,
                'radicacion_id': str(resultado.inserted_id),
                'numero_radicado': numero_radicado,
                'contrato_asociado': {
                    'id': contrato_id,
                    'numero': contrato['numero_contrato'],
                    'modalidad': contrato.get('modalidad_principal')
                },
                'es_factura_valor_cero': es_factura_valor_cero,
                'mensaje': 'Radicación creada exitosamente con contrato asociado'
            }
            
        except DuplicateKeyError:
            return {
                'success': False,
                'error': 'La factura ya fue radicada anteriormente',
                'codigo_devolucion': 'DE0501'
            }
        except Exception as e:
            logger.error(f"Error creando radicación con contrato: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def listar_radicaciones(self, filtros: Dict = None, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
        """
        Listar radicaciones con paginación desde MongoDB
        """
        try:
            if filtros is None:
                filtros = {}
            
            # Calcular skip para paginación
            skip = (page - 1) * page_size
            
            # Obtener total de documentos
            total = self.radicaciones.count_documents(filtros)
            
            # Obtener radicaciones paginadas
            radicaciones = list(
                self.radicaciones.find(filtros)
                .sort('fecha_radicacion', DESCENDING)
                .skip(skip)
                .limit(page_size)
            )
            
            # Formatear resultados
            results = []
            for rad in radicaciones:
                # Convertir ObjectId a string para JSON
                rad['id'] = str(rad['_id'])
                del rad['_id']
                
                # Formatear fechas
                if 'fecha_radicacion' in rad:
                    rad['fecha_radicacion'] = rad['fecha_radicacion'].isoformat()
                if 'fecha_expedicion' in rad and rad['fecha_expedicion']:
                    if hasattr(rad['fecha_expedicion'], 'isoformat'):
                        rad['fecha_expedicion'] = rad['fecha_expedicion'].isoformat()
                if 'created_at' in rad:
                    rad['created_at'] = rad['created_at'].isoformat()
                if 'updated_at' in rad:
                    rad['updated_at'] = rad['updated_at'].isoformat()
                
                results.append(rad)
            
            return {
                'results': results,
                'total': total,
                'page': page,
                'page_size': page_size
            }
            
        except Exception as e:
            logger.error(f"Error listando radicaciones: {str(e)}")
            return {
                'results': [],
                'total': 0,
                'page': page,
                'page_size': page_size
            }
    
    def obtener_estadisticas_radicaciones(self) -> Dict[str, Any]:
        """
        Obtener estadísticas consolidadas de radicaciones desde MongoDB
        """
        try:
            # Total de radicaciones
            total_radicaciones = self.radicaciones.count_documents({})
            
            # Estadísticas por estado
            pipeline_estados = [
                {
                    '$group': {
                        '_id': '$estado',
                        'count': {'$sum': 1},
                        'valor_total': {'$sum': '$valor_factura'}
                    }
                }
            ]
            stats_by_estado = list(self.radicaciones.aggregate(pipeline_estados))
            
            # Formatear estadísticas por estado
            estados_formateados = []
            valor_total = 0
            for stat in stats_by_estado:
                estados_formateados.append({
                    'estado': stat['_id'],
                    'count': stat['count']
                })
                valor_total += stat.get('valor_total', 0)
            
            # Radicaciones del último mes
            from datetime import datetime, timedelta
            ultimo_mes = datetime.now() - timedelta(days=30)
            radicaciones_ultimo_mes = self.radicaciones.count_documents({
                'fecha_radicacion': {'$gte': ultimo_mes}
            })
            
            # Pendientes/próximas a vencer (ejemplo: más de 15 días)
            hace_15_dias = datetime.now() - timedelta(days=15)
            proximas_vencer = self.radicaciones.count_documents({
                'fecha_radicacion': {'$lte': hace_15_dias},
                'estado': {'$in': ['RADICADA', 'EN_AUDITORIA']}
            })
            
            # Vencidas (ejemplo: más de 30 días sin procesar)
            hace_30_dias = datetime.now() - timedelta(days=30)
            vencidas = self.radicaciones.count_documents({
                'fecha_radicacion': {'$lte': hace_30_dias},
                'estado': {'$in': ['RADICADA', 'EN_AUDITORIA']}
            })
            
            return {
                'total_radicaciones': total_radicaciones,
                'stats_by_estado': estados_formateados,
                'radicaciones_ultimo_mes': radicaciones_ultimo_mes,
                'proximas_vencer': proximas_vencer,
                'vencidas': vencidas,
                'valor_total': valor_total
            }
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas: {str(e)}")
            return {
                'total_radicaciones': 0,
                'stats_by_estado': [],
                'radicaciones_ultimo_mes': 0,
                'proximas_vencer': 0,
                'vencidas': 0,
                'valor_total': 0
            }
    
    def validar_tarifas_radicacion(self, radicacion_id: str) -> Dict[str, Any]:
        """
        Validar tarifas de una radicación contra el contrato asociado
        """
        try:
            # Obtener radicación con su contrato
            radicacion = self.radicaciones.find_one({'_id': ObjectId(radicacion_id)})
            if not radicacion:
                return {'success': False, 'error': 'Radicación no encontrada'}
            
            if not radicacion.get('contrato_id'):
                return {'success': False, 'error': 'Radicación sin contrato asociado'}
            
            # Obtener servicios del RIPS
            if not radicacion.get('rips_transaccion_id'):
                return {'success': False, 'error': 'Radicación sin RIPS asociado'}
            
            rips = self.rips_transacciones.find_one({'_id': radicacion['rips_transaccion_id']})
            if not rips:
                return {'success': False, 'error': 'RIPS no encontrado'}
            
            # Validar tarifas de cada servicio
            resultados_validacion = []
            total_glosas = 0
            valor_glosado = Decimal('0')
            
            # Procesar cada usuario y sus servicios
            for usuario in rips.get('usuarios', []):
                for tipo_servicio, servicios in usuario.get('servicios', {}).items():
                    for servicio in servicios:
                        codigo_cups = servicio.get('codServicio')
                        valor_facturado = float(servicio.get('vrServicio', 0))
                        
                        # Validar contra tarifario contractual
                        resultado = servicio_cups_contractual.validar_tarifa_vs_contractual(
                            contrato_id=str(radicacion['contrato_id']),
                            codigo_cups=codigo_cups,
                            valor_facturado=valor_facturado,
                            fecha_servicio=radicacion['fecha_inicio_periodo']
                        )
                        
                        if not resultado['valido']:
                            total_glosas += 1
                            valor_glosado += Decimal(str(resultado.get('diferencia', 0)))
                        
                        resultados_validacion.append({
                            'usuario': usuario['numeroDocumento'],
                            'tipo_servicio': tipo_servicio,
                            'codigo_cups': codigo_cups,
                            'validacion': resultado
                        })
            
            # Actualizar radicación con resultados
            self.radicaciones.update_one(
                {'_id': ObjectId(radicacion_id)},
                {
                    '$set': {
                        'validaciones.tarifas': {
                            'estado': 'COMPLETADO',
                            'fecha': datetime.now(),
                            'resultados': resultados_validacion,
                            'resumen': {
                                'total_servicios': len(resultados_validacion),
                                'total_glosas': total_glosas,
                                'valor_glosado': float(valor_glosado)
                            }
                        }
                    }
                }
            )
            
            return {
                'success': True,
                'total_servicios_validados': len(resultados_validacion),
                'total_glosas_generadas': total_glosas,
                'valor_total_glosado': float(valor_glosado),
                'resultados': resultados_validacion[:10]  # Primeros 10 para preview
            }
            
        except Exception as e:
            logger.error(f"Error validando tarifas: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def _generar_numero_radicado(self, timestamp: datetime) -> str:
        """Generar número único de radicado"""
        # Formato: RAD-YYYYMMDD-XXXXX
        fecha = timestamp.strftime('%Y%m%d')
        
        # Obtener el último número del día
        ultimo = self.radicaciones.find_one(
            {'numero_radicado': {'$regex': f'^RAD-{fecha}-'}},
            sort=[('numero_radicado', -1)]
        )
        
        if ultimo:
            ultimo_num = int(ultimo['numero_radicado'].split('-')[-1])
            siguiente = ultimo_num + 1
        else:
            siguiente = 1
        
        return f"RAD-{fecha}-{siguiente:05d}"
    
    def buscar_radicaciones_por_contrato(self, contrato_id: str, filtros: Dict = None) -> List[Dict]:
        """
        Buscar todas las radicaciones de un contrato específico
        """
        try:
            query = {'contrato_id': ObjectId(contrato_id)}
            
            if filtros:
                if filtros.get('estado'):
                    query['estado'] = filtros['estado']
                if filtros.get('fecha_desde'):
                    query['fecha_radicacion'] = {'$gte': filtros['fecha_desde']}
                if filtros.get('fecha_hasta'):
                    query.setdefault('fecha_radicacion', {})['$lte'] = filtros['fecha_hasta']
            
            radicaciones = list(self.radicaciones.find(
                query,
                {
                    '_id': 1,
                    'numero_radicado': 1,
                    'numero_factura': 1,
                    'fecha_radicacion': 1,
                    'valor_factura': 1,
                    'estado': 1,
                    'es_factura_valor_cero': 1,
                    'validaciones': 1
                }
            ).sort('fecha_radicacion', -1).limit(100))
            
            # Convertir ObjectId y formatear
            for rad in radicaciones:
                rad['id'] = str(rad['_id'])
                del rad['_id']
                rad['fecha_radicacion'] = rad['fecha_radicacion'].isoformat()
            
            return radicaciones
            
        except Exception as e:
            logger.error(f"Error buscando radicaciones por contrato: {str(e)}")
            return []


# Instancia global del servicio
radicacion_contrato_service = RadicacionContratoNoSQL()