# -*- coding: utf-8 -*-
# apps/radicacion/engine_asignacion.py

"""
Motor de Asignación Automática Equitativa - NeurAudit Colombia
Asigna pre-glosas a auditores según perfiles profesionales y carga de trabajo
conforme a la Resolución 2284 de 2023
"""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Any, Optional, Tuple
import logging
from django.db.models import Q, Sum, Count, Avg
from django.contrib.auth.models import User

# Models
from .models_auditoria import (
    PreGlosa, AsignacionAuditoria, TrazabilidadAuditoria
)
from .codigos_oficiales_resolucion_2284 import CAUSALES_GLOSA_OFICIALES

logger = logging.getLogger(__name__)


class EngineAsignacionEquitativa:
    """
    Motor de asignación equitativa de pre-glosas a auditores
    según perfiles profesionales y distribución de carga de trabajo
    """
    
    def __init__(self):
        self.auditores_disponibles = {}
        self.cargas_trabajo_actual = {}
        self.especializaciones_auditor = {}
        
    def asignar_pre_glosas_automaticamente(self, pre_glosas_ids: List[str], 
                                         forzar_reasignacion: bool = False) -> Dict[str, Any]:
        """
        Asigna automáticamente pre-glosas a auditores según criterios equitativos
        """
        resultado = {
            'fecha_asignacion': datetime.now(),
            'total_pre_glosas': len(pre_glosas_ids),
            'asignaciones_creadas': [],
            'auditores_asignados': {},
            'criterios_aplicados': [],
            'estadisticas': {
                'pre_glosas_administrativas': 0,
                'pre_glosas_medicas': 0,
                'valor_total_asignado': Decimal('0.00')
            }
        }

        try:
            # 1. Cargar pre-glosas a asignar
            pre_glosas = PreGlosa.objects.filter(_id__in=pre_glosas_ids)
            
            if not forzar_reasignacion:
                # Filtrar solo las no asignadas
                pre_glosas = pre_glosas.filter(estado='PENDIENTE_AUDITORIA')
            
            if not pre_glosas.exists():
                return {**resultado, 'mensaje': 'No hay pre-glosas disponibles para asignar'}

            # 2. Clasificar pre-glosas por perfil requerido
            pre_glosas_por_perfil = self._clasificar_pre_glosas_por_perfil(pre_glosas)
            resultado['criterios_aplicados'].append('Clasificación por perfil profesional requerido')

            # 3. Obtener auditores disponibles por perfil
            auditores_disponibles = self._obtener_auditores_disponibles()
            resultado['criterios_aplicados'].append('Identificación de auditores disponibles por perfil')

            # 4. Calcular cargas de trabajo actuales
            cargas_actuales = self._calcular_cargas_trabajo_actuales(auditores_disponibles)
            resultado['criterios_aplicados'].append('Cálculo de cargas de trabajo actuales')

            # 5. Asignar por perfil con distribución equitativa
            for perfil, pre_glosas_perfil in pre_glosas_por_perfil.items():
                if not pre_glosas_perfil:
                    continue
                
                auditores_perfil = auditores_disponibles.get(perfil, [])
                if not auditores_perfil:
                    logger.warning(f'No hay auditores disponibles para perfil {perfil}')
                    continue

                # Distribuir equitativamente
                distribuciones = self._distribuir_equitativamente(
                    pre_glosas_perfil, auditores_perfil, cargas_actuales
                )
                
                # Crear asignaciones
                for auditor_username, pre_glosas_asignadas in distribuciones.items():
                    if pre_glosas_asignadas:
                        asignacion = self._crear_asignacion_individual(
                            auditor_username, perfil, pre_glosas_asignadas
                        )
                        resultado['asignaciones_creadas'].append(asignacion)
                        
                        if auditor_username not in resultado['auditores_asignados']:
                            resultado['auditores_asignados'][auditor_username] = {
                                'perfil': perfil,
                                'total_pre_glosas': 0,
                                'valor_total': Decimal('0.00'),
                                'categorias': {}
                            }
                        
                        resultado['auditores_asignados'][auditor_username]['total_pre_glosas'] += len(pre_glosas_asignadas)
                        resultado['auditores_asignados'][auditor_username]['valor_total'] += sum(
                            pg['valor_glosado_sugerido'] for pg in pre_glosas_asignadas
                        )

            # 6. Actualizar estadísticas
            resultado['estadisticas']['pre_glosas_administrativas'] = len(
                pre_glosas_por_perfil.get('AUDITOR_ADMINISTRATIVO', [])
            )
            resultado['estadisticas']['pre_glosas_medicas'] = len(
                pre_glosas_por_perfil.get('AUDITOR_MEDICO', [])
            )
            resultado['estadisticas']['valor_total_asignado'] = sum(
                auditor['valor_total'] for auditor in resultado['auditores_asignados'].values()
            )

            # 7. Registrar trazabilidad
            self._registrar_trazabilidad_asignacion(resultado)
            
            resultado['exito'] = True
            resultado['mensaje'] = f"Asignación completada: {len(resultado['asignaciones_creadas'])} asignaciones creadas"

        except Exception as e:
            logger.error(f'Error en asignación automática: {str(e)}')
            resultado['exito'] = False
            resultado['error'] = str(e)

        return resultado

    def _clasificar_pre_glosas_por_perfil(self, pre_glosas) -> Dict[str, List[Dict]]:
        """
        Clasifica pre-glosas según el perfil de auditor requerido
        """
        clasificacion = {
            'AUDITOR_ADMINISTRATIVO': [],
            'AUDITOR_MEDICO': []
        }

        for pre_glosa in pre_glosas:
            perfil_requerido = self._determinar_perfil_requerido(pre_glosa.categoria_glosa)
            
            pre_glosa_data = {
                'id': str(pre_glosa._id),
                'categoria_glosa': pre_glosa.categoria_glosa,
                'codigo_glosa': pre_glosa.codigo_glosa,
                'valor_glosado_sugerido': pre_glosa.valor_glosado_sugerido,
                'prioridad_revision': pre_glosa.prioridad_revision,
                'num_factura': pre_glosa.num_factura,
                'prestador_nit': pre_glosa.prestador_nit,
                'fecha_generacion': pre_glosa.fecha_generacion,
                'complejidad': self._evaluar_complejidad_pre_glosa(pre_glosa)
            }
            
            clasificacion[perfil_requerido].append(pre_glosa_data)

        return clasificacion

    def _obtener_auditores_disponibles(self) -> Dict[str, List[Dict]]:
        """
        Obtiene auditores disponibles organizados por perfil profesional
        """
        from django.contrib.auth.models import Group
        
        auditores_disponibles = {
            'AUDITOR_ADMINISTRATIVO': [],
            'AUDITOR_MEDICO': []
        }

        try:
            # Obtener auditores administrativos
            grupo_admin = Group.objects.get(name='Auditores Administrativos')
            auditores_admin = User.objects.filter(
                groups=grupo_admin,
                is_active=True
            )
            
            for auditor in auditores_admin:
                perfil_auditor = self._obtener_perfil_detallado_auditor(auditor.username, 'ADMINISTRATIVO')
                auditores_disponibles['AUDITOR_ADMINISTRATIVO'].append(perfil_auditor)

            # Obtener auditores médicos
            grupo_medico = Group.objects.get(name='Auditores Médicos')
            auditores_medicos = User.objects.filter(
                groups=grupo_medico,
                is_active=True
            )
            
            for auditor in auditores_medicos:
                perfil_auditor = self._obtener_perfil_detallado_auditor(auditor.username, 'MEDICO')
                auditores_disponibles['AUDITOR_MEDICO'].append(perfil_auditor)

        except Group.DoesNotExist:
            logger.warning('Grupos de auditores no configurados en el sistema')
            # Usar auditores por defecto para desarrollo
            auditores_disponibles = {
                'AUDITOR_ADMINISTRATIVO': [
                    {
                        'username': 'auditor.admin1',
                        'nombre_completo': 'Auditor Administrativo 1',
                        'especialidad': 'FACTURACION',
                        'experiencia_años': 5,
                        'disponible': True,
                        'horario': 'DIURNO'
                    },
                    {
                        'username': 'auditor.admin2',
                        'nombre_completo': 'Auditor Administrativo 2',
                        'especialidad': 'TARIFAS',
                        'experiencia_años': 3,
                        'disponible': True,
                        'horario': 'DIURNO'
                    }
                ],
                'AUDITOR_MEDICO': [
                    {
                        'username': 'auditor.medico1',
                        'nombre_completo': 'Dr. Médico Auditor 1',
                        'especialidad': 'MEDICINA_INTERNA',
                        'experiencia_años': 8,
                        'disponible': True,
                        'horario': 'DIURNO'
                    },
                    {
                        'username': 'auditor.medico2',
                        'nombre_completo': 'Dr. Médico Auditor 2',
                        'especialidad': 'CIRUGIA',
                        'experiencia_años': 10,
                        'disponible': True,
                        'horario': 'DIURNO'
                    }
                ]
            }

        return auditores_disponibles

    def _calcular_cargas_trabajo_actuales(self, auditores_disponibles: Dict) -> Dict[str, Dict]:
        """
        Calcula la carga de trabajo actual de cada auditor
        """
        cargas_trabajo = {}
        
        # Período de cálculo: últimos 30 días
        fecha_inicio = datetime.now() - timedelta(days=30)
        
        for perfil, auditores in auditores_disponibles.items():
            for auditor in auditores:
                username = auditor['username']
                
                # Asignaciones activas
                asignaciones_activas = AsignacionAuditoria.objects.filter(
                    auditor_username=username,
                    estado__in=['ASIGNADA', 'EN_PROCESO'],
                    fecha_asignacion__gte=fecha_inicio
                ).aggregate(
                    total_pre_glosas=Sum('total_pre_glosas'),
                    valor_total=Sum('valor_total_asignado'),
                    total_asignaciones=Count('_id')
                )
                
                # Pre-glosas auditadas recientemente
                pre_glosas_auditadas = PreGlosa.objects.filter(
                    auditado_por=username,
                    fecha_auditoria__gte=fecha_inicio
                ).aggregate(
                    total_auditadas=Count('_id'),
                    valor_auditado=Sum('valor_glosado_sugerido')
                )
                
                # Calcular métricas de rendimiento
                rendimiento = self._calcular_rendimiento_auditor(
                    username, fecha_inicio
                )
                
                cargas_trabajo[username] = {
                    'perfil': perfil,
                    'carga_actual': {
                        'pre_glosas_pendientes': asignaciones_activas['total_pre_glosas'] or 0,
                        'valor_pendiente': asignaciones_activas['valor_total'] or Decimal('0.00'),
                        'asignaciones_activas': asignaciones_activas['total_asignaciones'] or 0
                    },
                    'rendimiento_reciente': {
                        'pre_glosas_auditadas': pre_glosas_auditadas['total_auditadas'] or 0,
                        'valor_auditado': pre_glosas_auditadas['valor_auditado'] or Decimal('0.00'),
                        'promedio_diario': rendimiento['promedio_diario'],
                        'tiempo_promedio_auditoria': rendimiento['tiempo_promedio']
                    },
                    'capacidad_estimada': self._estimar_capacidad_auditor(auditor, rendimiento),
                    'especializacion': auditor.get('especialidad', 'GENERAL'),
                    'disponible': auditor.get('disponible', True)
                }

        return cargas_trabajo

    def _distribuir_equitativamente(self, pre_glosas: List[Dict], 
                                  auditores: List[Dict], 
                                  cargas_actuales: Dict) -> Dict[str, List[Dict]]:
        """
        Distribuye pre-glosas equitativamente entre auditores disponibles
        """
        distribuciones = {}
        
        # Filtrar auditores disponibles
        auditores_disponibles = [
            a for a in auditores 
            if cargas_actuales.get(a['username'], {}).get('disponible', True)
        ]
        
        if not auditores_disponibles:
            return distribuciones

        # Ordenar pre-glosas por prioridad y complejidad
        pre_glosas_ordenadas = sorted(
            pre_glosas,
            key=lambda x: (
                self._convertir_prioridad_a_numero(x['prioridad_revision']),
                x['complejidad'],
                x['valor_glosado_sugerido']
            ),
            reverse=True
        )

        # Algoritmo de distribución Round Robin ponderado
        indices_auditores = {auditor['username']: 0 for auditor in auditores_disponibles}
        
        for pre_glosa in pre_glosas_ordenadas:
            # Encontrar auditor con menor carga ajustada
            auditor_seleccionado = self._seleccionar_auditor_optimo(
                auditores_disponibles, cargas_actuales, pre_glosa
            )
            
            if auditor_seleccionado:
                username = auditor_seleccionado['username']
                if username not in distribuciones:
                    distribuciones[username] = []
                
                distribuciones[username].append(pre_glosa)
                
                # Actualizar carga simulada para siguiente asignación
                if username in cargas_actuales:
                    cargas_actuales[username]['carga_actual']['pre_glosas_pendientes'] += 1
                    cargas_actuales[username]['carga_actual']['valor_pendiente'] += pre_glosa['valor_glosado_sugerido']

        return distribuciones

    def _seleccionar_auditor_optimo(self, auditores_disponibles: List[Dict],
                                  cargas_actuales: Dict, pre_glosa: Dict) -> Optional[Dict]:
        """
        Selecciona el auditor óptimo para una pre-glosa específica
        """
        if not auditores_disponibles:
            return None

        # Calcular puntuación para cada auditor
        puntuaciones = []
        
        for auditor in auditores_disponibles:
            username = auditor['username']
            carga = cargas_actuales.get(username, {})
            
            # Factor de carga de trabajo (menor carga = mayor puntuación)
            carga_actual = carga.get('carga_actual', {}).get('pre_glosas_pendientes', 0)
            factor_carga = max(1, 10 - carga_actual)  # Escala 1-10
            
            # Factor de especialización
            factor_especializacion = self._calcular_factor_especializacion(
                auditor, pre_glosa
            )
            
            # Factor de rendimiento
            rendimiento = carga.get('rendimiento_reciente', {})
            promedio_diario = rendimiento.get('promedio_diario', 1)
            factor_rendimiento = min(10, promedio_diario)  # Cap en 10
            
            # Factor de capacidad
            capacidad = carga.get('capacidad_estimada', {})
            utilizacion_actual = capacidad.get('utilizacion_actual', 0)
            factor_capacidad = max(1, 10 - (utilizacion_actual * 10))  # Escala 1-10
            
            # Puntuación total ponderada
            puntuacion_total = (
                factor_carga * 0.4 +           # 40% peso en carga actual
                factor_especializacion * 0.3 +  # 30% peso en especialización
                factor_rendimiento * 0.2 +      # 20% peso en rendimiento
                factor_capacidad * 0.1          # 10% peso en capacidad
            )
            
            puntuaciones.append({
                'auditor': auditor,
                'puntuacion': puntuacion_total,
                'factores': {
                    'carga': factor_carga,
                    'especializacion': factor_especializacion,
                    'rendimiento': factor_rendimiento,
                    'capacidad': factor_capacidad
                }
            })

        # Seleccionar auditor con mayor puntuación
        mejor_auditor = max(puntuaciones, key=lambda x: x['puntuacion'])
        return mejor_auditor['auditor']

    def _determinar_perfil_requerido(self, categoria_glosa: str) -> str:
        """
        Determina el perfil de auditor requerido según la categoría de glosa
        """
        categoria_info = CAUSALES_GLOSA_OFICIALES.get(categoria_glosa, {})
        perfil = categoria_info.get('perfil_auditor', 'ADMINISTRATIVO')
        
        if perfil == 'MEDICO':
            return 'AUDITOR_MEDICO'
        else:
            return 'AUDITOR_ADMINISTRATIVO'

    def _evaluar_complejidad_pre_glosa(self, pre_glosa) -> int:
        """
        Evalúa la complejidad de una pre-glosa (1-10, siendo 10 la más compleja)
        """
        complejidad = 5  # Complejidad base
        
        # Factor por categoría
        if pre_glosa.categoria_glosa == 'CL':  # Calidad médica
            complejidad += 3
        elif pre_glosa.categoria_glosa in ['CO', 'AU']:  # Cobertura, Autorizaciones
            complejidad += 2
        elif pre_glosa.categoria_glosa in ['TA', 'SO']:  # Tarifas, Soportes
            complejidad += 1
        
        # Factor por valor
        if pre_glosa.valor_glosado_sugerido > 1000000:
            complejidad += 2
        elif pre_glosa.valor_glosado_sugerido > 500000:
            complejidad += 1
        
        # Factor por prioridad
        if pre_glosa.prioridad_revision == 'ALTA':
            complejidad += 1

        return min(10, max(1, complejidad))

    def _crear_asignacion_individual(self, auditor_username: str, perfil: str, 
                                   pre_glosas: List[Dict]) -> Dict:
        """
        Crea una asignación individual para un auditor
        """
        pre_glosas_ids = [pg['id'] for pg in pre_glosas]
        valor_total = sum(pg['valor_glosado_sugerido'] for pg in pre_glosas)
        
        asignacion = AsignacionAuditoria.objects.create(
            auditor_username=auditor_username,
            auditor_perfil=perfil,
            pre_glosas_ids=pre_glosas_ids,
            total_pre_glosas=len(pre_glosas),
            valor_total_asignado=valor_total,
            fecha_limite_auditoria=datetime.now() + timedelta(days=10)  # 10 días para auditoría
        )
        
        # Actualizar estado de las pre-glosas
        PreGlosa.objects.filter(_id__in=pre_glosas_ids).update(
            estado='ASIGNADA_AUDITORIA',
            auditado_por=auditor_username,
            perfil_auditor=perfil
        )
        
        return {
            'asignacion_id': str(asignacion._id),
            'auditor_username': auditor_username,
            'perfil': perfil,
            'total_pre_glosas': len(pre_glosas),
            'valor_total': float(valor_total),
            'fecha_limite': asignacion.fecha_limite_auditoria,
            'pre_glosas_asignadas': pre_glosas_ids
        }

    # Métodos auxiliares

    def _obtener_perfil_detallado_auditor(self, username: str, tipo: str) -> Dict:
        """
        Obtiene perfil detallado de un auditor (en producción desde BD de recursos humanos)
        """
        # En desarrollo, usar perfiles simulados
        perfiles_simulados = {
            'auditor.admin1': {
                'username': 'auditor.admin1',
                'nombre_completo': 'Auditor Administrativo 1',
                'especialidad': 'FACTURACION',
                'experiencia_años': 5,
                'disponible': True,
                'horario': 'DIURNO'
            },
            'auditor.admin2': {
                'username': 'auditor.admin2',
                'nombre_completo': 'Auditor Administrativo 2',
                'especialidad': 'TARIFAS',
                'experiencia_años': 3,
                'disponible': True,
                'horario': 'DIURNO'
            },
            'auditor.medico1': {
                'username': 'auditor.medico1',
                'nombre_completo': 'Dr. Médico Auditor 1',
                'especialidad': 'MEDICINA_INTERNA',
                'experiencia_años': 8,
                'disponible': True,
                'horario': 'DIURNO'
            },
            'auditor.medico2': {
                'username': 'auditor.medico2',
                'nombre_completo': 'Dr. Médico Auditor 2',
                'especialidad': 'CIRUGIA',
                'experiencia_años': 10,
                'disponible': True,
                'horario': 'DIURNO'
            }
        }
        
        return perfiles_simulados.get(username, {
            'username': username,
            'nombre_completo': f'{tipo} {username}',
            'especialidad': 'GENERAL',
            'experiencia_años': 3,
            'disponible': True,
            'horario': 'DIURNO'
        })

    def _calcular_rendimiento_auditor(self, username: str, fecha_inicio: datetime) -> Dict:
        """
        Calcula métricas de rendimiento de un auditor
        """
        pre_glosas_auditadas = PreGlosa.objects.filter(
            auditado_por=username,
            fecha_auditoria__gte=fecha_inicio
        )
        
        total_auditadas = pre_glosas_auditadas.count()
        dias_transcurridos = max(1, (datetime.now() - fecha_inicio).days)
        
        return {
            'total_auditadas': total_auditadas,
            'promedio_diario': total_auditadas / dias_transcurridos,
            'tiempo_promedio': 2.5  # Horas promedio por pre-glosa (estimado)
        }

    def _estimar_capacidad_auditor(self, auditor: Dict, rendimiento: Dict) -> Dict:
        """
        Estima la capacidad de trabajo de un auditor
        """
        experiencia = auditor.get('experiencia_años', 3)
        promedio_diario = rendimiento.get('promedio_diario', 1)
        
        # Capacidad base según experiencia
        capacidad_base = min(15, 8 + experiencia)  # 8-15 pre-glosas por día
        
        # Ajustar por rendimiento histórico
        capacidad_ajustada = (capacidad_base + promedio_diario) / 2
        
        return {
            'capacidad_diaria_estimada': capacidad_ajustada,
            'utilizacion_actual': min(1.0, promedio_diario / capacidad_ajustada),
            'disponibilidad_adicional': max(0, capacidad_ajustada - promedio_diario)
        }

    def _calcular_factor_especializacion(self, auditor: Dict, pre_glosa: Dict) -> float:
        """
        Calcula factor de especialización del auditor para la pre-glosa
        """
        especialidad = auditor.get('especialidad', 'GENERAL')
        categoria = pre_glosa.get('categoria_glosa', '')
        
        # Mapeo de especialidades a categorías de glosa
        especializaciones_glosas = {
            'FACTURACION': ['FA'],
            'TARIFAS': ['TA'],
            'MEDICINA_INTERNA': ['CL', 'CO'],
            'CIRUGIA': ['CL', 'AU'],
            'GENERAL': ['FA', 'TA', 'SO', 'AU', 'CO', 'CL', 'SA']
        }
        
        categorias_especialidad = especializaciones_glosas.get(especialidad, [])
        
        if categoria in categorias_especialidad:
            if especialidad == 'GENERAL':
                return 5.0  # Factor neutro
            else:
                return 8.0  # Factor alto por especialización
        else:
            return 3.0  # Factor bajo por no especialización

    def _convertir_prioridad_a_numero(self, prioridad: str) -> int:
        """
        Convierte prioridad textual a número para ordenamiento
        """
        prioridades = {'ALTA': 3, 'MEDIA': 2, 'BAJA': 1}
        return prioridades.get(prioridad, 2)

    def _registrar_trazabilidad_asignacion(self, resultado: Dict):
        """
        Registra la trazabilidad de la asignación automática
        """
        try:
            descripcion = (
                f"Asignación automática completada: "
                f"{len(resultado['asignaciones_creadas'])} asignaciones a "
                f"{len(resultado['auditores_asignados'])} auditores"
            )
            
            # En un sistema real, registrar trazabilidad por transacción
            # Por ahora, solo log
            logger.info(f"Asignación automática: {descripcion}")
            
        except Exception as e:
            logger.error(f'Error registrando trazabilidad de asignación: {str(e)}')

    # Métodos públicos para consultas

    def obtener_estadisticas_asignacion(self, fecha_desde: Optional[datetime] = None) -> Dict:
        """
        Obtiene estadísticas de asignación para dashboard
        """
        if not fecha_desde:
            fecha_desde = datetime.now() - timedelta(days=30)

        asignaciones = AsignacionAuditoria.objects.filter(
            fecha_asignacion__gte=fecha_desde
        )

        estadisticas = {
            'total_asignaciones': asignaciones.count(),
            'por_auditor': {},
            'por_perfil': {
                'AUDITOR_ADMINISTRATIVO': 0,
                'AUDITOR_MEDICO': 0
            },
            'valor_total_asignado': Decimal('0.00'),
            'promedio_pre_glosas_por_asignacion': 0,
            'distribucion_cargas': []
        }

        for asignacion in asignaciones:
            # Por auditor
            auditor = asignacion.auditor_username
            if auditor not in estadisticas['por_auditor']:
                estadisticas['por_auditor'][auditor] = {
                    'total_asignaciones': 0,
                    'total_pre_glosas': 0,
                    'valor_total': Decimal('0.00'),
                    'perfil': asignacion.auditor_perfil
                }
            
            estadisticas['por_auditor'][auditor]['total_asignaciones'] += 1
            estadisticas['por_auditor'][auditor]['total_pre_glosas'] += asignacion.total_pre_glosas
            estadisticas['por_auditor'][auditor]['valor_total'] += asignacion.valor_total_asignado

            # Por perfil
            estadisticas['por_perfil'][asignacion.auditor_perfil] += asignacion.total_pre_glosas
            estadisticas['valor_total_asignado'] += asignacion.valor_total_asignado

        if asignaciones.exists():
            estadisticas['promedio_pre_glosas_por_asignacion'] = (
                sum(a.total_pre_glosas for a in asignaciones) / asignaciones.count()
            )

        return estadisticas

    def reasignar_pre_glosas_vencidas(self) -> Dict:
        """
        Reasigna pre-glosas con asignaciones vencidas
        """
        fecha_vencimiento = datetime.now() - timedelta(days=12)  # 2 días de gracia
        
        asignaciones_vencidas = AsignacionAuditoria.objects.filter(
            fecha_limite_auditoria__lt=fecha_vencimiento,
            estado__in=['ASIGNADA', 'EN_PROCESO']
        )

        pre_glosas_a_reasignar = []
        for asignacion in asignaciones_vencidas:
            pre_glosas_ids = asignacion.pre_glosas_ids
            pre_glosas_a_reasignar.extend(pre_glosas_ids)
            
            # Marcar asignación como vencida
            asignacion.estado = 'VENCIDA'
            asignacion.save()

        if pre_glosas_a_reasignar:
            # Reasignar automáticamente
            resultado = self.asignar_pre_glosas_automaticamente(
                pre_glosas_a_reasignar, 
                forzar_reasignacion=True
            )
            resultado['asignaciones_vencidas'] = len(asignaciones_vencidas)
            return resultado
        
        return {
            'mensaje': 'No hay asignaciones vencidas para reasignar',
            'asignaciones_vencidas': 0
        }