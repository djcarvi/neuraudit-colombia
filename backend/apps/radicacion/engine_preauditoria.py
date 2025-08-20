# -*- coding: utf-8 -*-
# apps/radicacion/engine_preauditoria.py

"""
Motor de Pre-auditoría Automática - NeurAudit Colombia
Genera pre-devoluciones y pre-glosas automáticas según Resolución 2284
que requieren aprobación humana antes de ser oficiales
"""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Any, Optional
import logging

# Models
from .models_rips_oficial import RIPSTransaccion, RIPSUsuario
from .models_auditoria import (
    PreDevolucion, PreGlosa, TrazabilidadAuditoria,
    AsignacionAuditoria
)
from apps.catalogs.models import BDUAAfiliados
from apps.catalogs.validation_engine_advanced import ValidationEngineAdvanced

logger = logging.getLogger(__name__)


class EnginePreAuditoria:
    """
    Motor de pre-auditoría automática que genera sugerencias
    para revisión y aprobación humana
    """
    
    def __init__(self):
        self.validation_engine = ValidationEngineAdvanced()
        self.pre_devoluciones_generadas = []
        self.pre_glosas_generadas = []
        
    def procesar_transaccion_completa(self, transaccion_id: str, usuario_revisor: str = 'SISTEMA') -> Dict[str, Any]:
        """
        Procesa una transacción completa:
        1. Genera pre-devoluciones automáticas
        2. Si pasa pre-devolución, genera pre-glosas automáticas
        """
        try:
            transaccion = RIPSTransaccion.objects.get(_id=transaccion_id)
        except RIPSTransaccion.DoesNotExist:
            return {'error': f'Transacción {transaccion_id} no encontrada'}

        resultado = {
            'transaccion_id': transaccion_id,
            'num_factura': transaccion.num_factura,
            'prestador_nit': transaccion.num_documento_id_obligado,
            'fecha_procesamiento': datetime.now(),
            'fase_actual': 'PRE_DEVOLUCION',
            'pre_devoluciones': [],
            'pre_glosas': [],
            'resumen': {
                'requiere_devolucion': False,
                'total_pre_devoluciones': 0,
                'valor_total_pre_devoluciones': Decimal('0.00'),
                'total_pre_glosas': 0,
                'valor_total_pre_glosas': Decimal('0.00'),
                'estado_siguiente': 'PENDIENTE_REVISION_DEVOLUCION'
            }
        }

        # FASE 1: Generar pre-devoluciones automáticas
        pre_devoluciones = self._generar_pre_devoluciones_automaticas(transaccion)
        resultado['pre_devoluciones'] = pre_devoluciones
        resultado['resumen']['total_pre_devoluciones'] = len(pre_devoluciones)
        
        for pre_dev in pre_devoluciones:
            resultado['resumen']['valor_total_pre_devoluciones'] += pre_dev['valor_afectado']
            
        if pre_devoluciones:
            resultado['resumen']['requiere_devolucion'] = True
            # Registrar trazabilidad
            self._registrar_trazabilidad(
                transaccion_id, 'PRE_DEVOLUCION_GENERADA',
                usuario_revisor, f"{len(pre_devoluciones)} pre-devoluciones generadas automáticamente"
            )
        else:
            # FASE 2: Si no hay devoluciones, generar pre-glosas
            resultado['fase_actual'] = 'PRE_GLOSA'
            pre_glosas = self._generar_pre_glosas_automaticas(transaccion)
            resultado['pre_glosas'] = pre_glosas
            resultado['resumen']['total_pre_glosas'] = len(pre_glosas)
            resultado['resumen']['estado_siguiente'] = 'PENDIENTE_ASIGNACION_AUDITORIA'
            
            for pre_glosa in pre_glosas:
                resultado['resumen']['valor_total_pre_glosas'] += pre_glosa['valor_glosado_sugerido']
            
            if pre_glosas:
                # Asignar automáticamente a auditores
                self._asignar_pre_glosas_a_auditores(pre_glosas)
                
                self._registrar_trazabilidad(
                    transaccion_id, 'PRE_GLOSA_GENERADA',
                    usuario_revisor, f"{len(pre_glosas)} pre-glosas generadas automáticamente"
                )

        return resultado

    def _generar_pre_devoluciones_automaticas(self, transaccion: RIPSTransaccion) -> List[Dict]:
        """
        Genera pre-devoluciones automáticas según causales normativas
        """
        pre_devoluciones = []
        
        # DE56: Validar plazo de radicación (22 días hábiles)
        if self._validar_de56_plazo_radicacion(transaccion):
            pre_dev = self._crear_pre_devolucion(
                transaccion, 'DE56',
                'No radicación de soportes dentro de los 22 días hábiles',
                transaccion.valor_total_facturado,
                {
                    'fecha_factura': transaccion.fecha_radicacion.isoformat(),
                    'dias_transcurridos': self._calcular_dias_habiles_transcurridos(transaccion.fecha_radicacion),
                    'fecha_limite': self._calcular_fecha_limite_radicacion(transaccion.fecha_radicacion)
                },
                f"Factura radicada fuera del plazo legal de 22 días hábiles. "
                f"Se recomienda aplicar devolución total por extemporaneidad."
            )
            pre_devoluciones.append(pre_dev)

        # DE50: Validar facturas duplicadas
        if self._validar_de50_factura_duplicada(transaccion):
            facturas_duplicadas = self._encontrar_facturas_duplicadas(transaccion)
            pre_dev = self._crear_pre_devolucion(
                transaccion, 'DE50',
                'Factura ya pagada o en trámite de pago',
                transaccion.valor_total_facturado,
                {
                    'facturas_duplicadas': facturas_duplicadas,
                    'criterio_duplicacion': 'numero_factura + nit_prestador'
                },
                f"Se encontraron {len(facturas_duplicadas)} facturas con el mismo número. "
                f"Verificar estado de pago antes de procesar."
            )
            pre_devoluciones.append(pre_dev)

        # DE16: Validar usuarios sin derechos en BDUA
        usuarios_sin_derechos = self._validar_de16_usuarios_sin_derechos(transaccion)
        if usuarios_sin_derechos:
            valor_afectado = self._calcular_valor_usuarios_sin_derechos(transaccion, usuarios_sin_derechos)
            pre_dev = self._crear_pre_devolucion(
                transaccion, 'DE16',
                'Persona corresponde a otro responsable de pago',
                valor_afectado,
                {
                    'usuarios_sin_derechos': usuarios_sin_derechos,
                    'total_usuarios_afectados': len(usuarios_sin_derechos)
                },
                f"{len(usuarios_sin_derechos)} usuarios no encontrados en BDUA o sin derechos vigentes. "
                f"Valor afectado: ${valor_afectado:,.2f}"
            )
            pre_devoluciones.append(pre_dev)

        # DE44: Validar prestador en red (pendiente integración con maestro de prestadores)
        # Esta validación requiere integración con el sistema de habilitación

        return pre_devoluciones

    def _generar_pre_glosas_automaticas(self, transaccion: RIPSTransaccion) -> List[Dict]:
        """
        Genera pre-glosas automáticas para transacciones que pasaron pre-devolución
        """
        pre_glosas = []
        
        # Obtener usuarios de la transacción
        usuarios = RIPSUsuario.objects.filter(transaccion_id=str(transaccion._id))
        
        for usuario in usuarios:
            # Validar cada usuario con el motor avanzado
            validacion_usuario = self.validation_engine._validar_usuario_completo(usuario, transaccion)
            
            # Convertir hallazgos a pre-glosas
            for glosa_hallazgo in validacion_usuario.get('glosas_usuario', []):
                pre_glosa = self._crear_pre_glosa_desde_hallazgo(
                    transaccion, usuario, glosa_hallazgo, validacion_usuario
                )
                pre_glosas.append(pre_glosa)

        return pre_glosas

    def _crear_pre_devolucion(self, transaccion: RIPSTransaccion, codigo_causal: str,
                            descripcion: str, valor_afectado: Decimal, evidencia: Dict,
                            fundamentacion: str) -> Dict:
        """
        Crea una pre-devolución en la base de datos
        """
        pre_devolucion = PreDevolucion.objects.create(
            transaccion_id=str(transaccion._id),
            num_factura=transaccion.num_factura,
            prestador_nit=transaccion.num_documento_id_obligado,
            codigo_causal=codigo_causal,
            descripcion_causal=descripcion,
            valor_afectado=valor_afectado,
            evidencia_automatica=evidencia,
            fundamentacion_tecnica=fundamentacion,
            fecha_limite_revision=datetime.now() + timedelta(days=5)  # 5 días hábiles
        )
        
        return {
            'id': str(pre_devolucion._id),
            'codigo_causal': codigo_causal,
            'descripcion_causal': descripcion,
            'valor_afectado': valor_afectado,
            'evidencia_automatica': evidencia,
            'fundamentacion_tecnica': fundamentacion,
            'estado': 'PENDIENTE_REVISION',
            'fecha_generacion': pre_devolucion.fecha_generacion,
            'fecha_limite_revision': pre_devolucion.fecha_limite_revision
        }

    def _crear_pre_glosa_desde_hallazgo(self, transaccion: RIPSTransaccion, usuario: RIPSUsuario,
                                      glosa_hallazgo: Dict, validacion_usuario: Dict) -> Dict:
        """
        Crea una pre-glosa desde un hallazgo del motor de validación
        """
        # Determinar prioridad de revisión
        prioridad = self._determinar_prioridad_pre_glosa(glosa_hallazgo)
        
        # Determinar qué tipo de auditor requiere
        perfil_requerido = self._determinar_perfil_auditor_requerido(glosa_hallazgo['categoria'])
        
        pre_glosa = PreGlosa.objects.create(
            transaccion_id=str(transaccion._id),
            usuario_id=str(usuario._id),
            num_factura=transaccion.num_factura,
            prestador_nit=transaccion.num_documento_id_obligado,
            codigo_glosa=glosa_hallazgo['codigo'],
            categoria_glosa=glosa_hallazgo['categoria'],
            descripcion_hallazgo=glosa_hallazgo['descripcion'],
            valor_glosado_sugerido=glosa_hallazgo['valor_glosado'],
            evidencia_tecnica={
                'validacion_usuario': validacion_usuario,
                'hallazgo_original': glosa_hallazgo
            },
            prioridad_revision=prioridad
        )
        
        return {
            'id': str(pre_glosa._id),
            'codigo_glosa': glosa_hallazgo['codigo'],
            'categoria_glosa': glosa_hallazgo['categoria'],
            'descripcion_hallazgo': glosa_hallazgo['descripcion'],
            'valor_glosado_sugerido': glosa_hallazgo['valor_glosado'],
            'prioridad_revision': prioridad,
            'perfil_auditor_requerido': perfil_requerido,
            'estado': 'PENDIENTE_AUDITORIA',
            'fecha_generacion': pre_glosa.fecha_generacion
        }

    def _asignar_pre_glosas_a_auditores(self, pre_glosas: List[Dict]):
        """
        Asigna pre-glosas automáticamente a auditores según carga de trabajo
        """
        # Separar por tipo de auditor requerido
        pre_glosas_administrativas = [pg for pg in pre_glosas 
                                    if self._determinar_perfil_auditor_requerido(pg['categoria_glosa']) == 'AUDITOR_ADMINISTRATIVO']
        pre_glosas_medicas = [pg for pg in pre_glosas 
                            if self._determinar_perfil_auditor_requerido(pg['categoria_glosa']) == 'AUDITOR_MEDICO']
        
        # Asignar administrativas
        if pre_glosas_administrativas:
            auditor_admin = self._obtener_auditor_menos_cargado('AUDITOR_ADMINISTRATIVO')
            if auditor_admin:
                self._crear_asignacion_auditoria(auditor_admin, pre_glosas_administrativas, 'AUDITOR_ADMINISTRATIVO')
        
        # Asignar médicas
        if pre_glosas_medicas:
            auditor_medico = self._obtener_auditor_menos_cargado('AUDITOR_MEDICO')
            if auditor_medico:
                self._crear_asignacion_auditoria(auditor_medico, pre_glosas_medicas, 'AUDITOR_MEDICO')

    def _crear_asignacion_auditoria(self, auditor_username: str, pre_glosas: List[Dict], perfil: str):
        """
        Crea una asignación de auditoría
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
            auditado_por=auditor_username
        )

    # Métodos de validación específica

    def _validar_de56_plazo_radicacion(self, transaccion: RIPSTransaccion) -> bool:
        """
        Valida si se excedió el plazo de 22 días hábiles para radicación
        """
        # Lógica simplificada - en producción calcular días hábiles exactos
        dias_transcurridos = (datetime.now() - transaccion.fecha_radicacion).days
        return dias_transcurridos > 30  # Aproximación de 22 días hábiles

    def _validar_de50_factura_duplicada(self, transaccion: RIPSTransaccion) -> bool:
        """
        Valida si existe factura duplicada
        """
        duplicadas = RIPSTransaccion.objects.filter(
            num_factura=transaccion.num_factura,
            num_documento_id_obligado=transaccion.num_documento_id_obligado
        ).exclude(_id=transaccion._id)
        
        return duplicadas.exists()

    def _encontrar_facturas_duplicadas(self, transaccion: RIPSTransaccion) -> List[Dict]:
        """
        Encuentra facturas duplicadas
        """
        duplicadas = RIPSTransaccion.objects.filter(
            num_factura=transaccion.num_factura,
            num_documento_id_obligado=transaccion.num_documento_id_obligado
        ).exclude(_id=transaccion._id)
        
        return [
            {
                'transaccion_id': str(dup._id),
                'fecha_radicacion': dup.fecha_radicacion.isoformat(),
                'estado': dup.estado_procesamiento,
                'valor': float(dup.valor_total_facturado)
            }
            for dup in duplicadas
        ]

    def _validar_de16_usuarios_sin_derechos(self, transaccion: RIPSTransaccion) -> List[Dict]:
        """
        Valida usuarios sin derechos en BDUA
        """
        usuarios_sin_derechos = []
        usuarios = RIPSUsuario.objects.filter(transaccion_id=str(transaccion._id))
        
        for usuario in usuarios:
            try:
                afiliado = BDUAAfiliados.objects.get(
                    tipo_documento_identificacion=usuario.tipo_documento_identificacion,
                    numero_documento_identificacion=usuario.num_documento_identificacion
                )
                
                # Verificar vigencia de derechos
                if afiliado.estado_afiliacion != 'ACTIVO':
                    usuarios_sin_derechos.append({
                        'usuario_id': str(usuario._id),
                        'documento': f"{usuario.tipo_documento_identificacion}-{usuario.num_documento_identificacion}",
                        'motivo': f"Estado de afiliación: {afiliado.estado_afiliacion}",
                        'valor_usuario': float(usuario.valor_total_usuario)
                    })
                    
            except BDUAAfiliados.DoesNotExist:
                usuarios_sin_derechos.append({
                    'usuario_id': str(usuario._id),
                    'documento': f"{usuario.tipo_documento_identificacion}-{usuario.num_documento_identificacion}",
                    'motivo': 'Usuario no encontrado en BDUA',
                    'valor_usuario': float(usuario.valor_total_usuario)
                })
        
        return usuarios_sin_derechos

    def _calcular_valor_usuarios_sin_derechos(self, transaccion: RIPSTransaccion, usuarios_sin_derechos: List[Dict]) -> Decimal:
        """
        Calcula el valor total afectado por usuarios sin derechos
        """
        return sum(Decimal(str(usuario['valor_usuario'])) for usuario in usuarios_sin_derechos)

    def _calcular_dias_habiles_transcurridos(self, fecha_inicial: datetime) -> int:
        """
        Calcula días hábiles transcurridos (aproximación)
        """
        return (datetime.now() - fecha_inicial).days

    def _calcular_fecha_limite_radicacion(self, fecha_factura: datetime) -> str:
        """
        Calcula fecha límite de radicación (22 días hábiles)
        """
        return (fecha_factura + timedelta(days=30)).isoformat()  # Aproximación

    def _determinar_prioridad_pre_glosa(self, glosa_hallazgo: Dict) -> str:
        """
        Determina prioridad de revisión según el hallazgo
        """
        valor = glosa_hallazgo.get('valor_glosado', 0)
        categoria = glosa_hallazgo.get('categoria', '')
        
        # Alta prioridad: glosas de calidad o valores altos
        if categoria == 'CL' or valor > 500000:
            return 'ALTA'
        # Media prioridad: glosas administrativas importantes
        elif categoria in ['AU', 'CO'] or valor > 100000:
            return 'MEDIA'
        else:
            return 'BAJA'

    def _determinar_perfil_auditor_requerido(self, categoria_glosa: str) -> str:
        """
        Determina qué tipo de auditor requiere la glosa
        """
        auditor_medico_categorias = ['CL', 'SA']  # Calidad y Seguimiento Acuerdos
        
        if categoria_glosa in auditor_medico_categorias:
            return 'AUDITOR_MEDICO'
        else:
            return 'AUDITOR_ADMINISTRATIVO'

    def _obtener_auditor_menos_cargado(self, perfil: str) -> Optional[str]:
        """
        Obtiene el auditor con menor carga de trabajo
        """
        # En producción, consultar tabla de auditores activos y su carga actual
        # Por ahora, retornar auditor por defecto según perfil
        auditores_default = {
            'AUDITOR_ADMINISTRATIVO': 'auditor.admin',
            'AUDITOR_MEDICO': 'auditor.medico'
        }
        
        return auditores_default.get(perfil)

    def _registrar_trazabilidad(self, transaccion_id: str, evento: str, usuario: str, descripcion: str):
        """
        Registra evento en la trazabilidad de auditoría
        """
        try:
            transaccion = RIPSTransaccion.objects.get(_id=transaccion_id)
            
            TrazabilidadAuditoria.objects.create(
                transaccion_id=transaccion_id,
                num_factura=transaccion.num_factura,
                evento=evento,
                usuario=usuario,
                descripcion=descripcion,
                origen='AUTOMATICO'
            )
        except Exception as e:
            logger.error(f'Error registrando trazabilidad: {str(e)}')

    # Métodos públicos para interfaz humana

    def obtener_pre_devoluciones_pendientes(self, prestador_nit: Optional[str] = None) -> List[Dict]:
        """
        Obtiene pre-devoluciones pendientes de revisión humana
        """
        filtros = {'estado': 'PENDIENTE_REVISION'}
        if prestador_nit:
            filtros['prestador_nit'] = prestador_nit
        
        pre_devoluciones = PreDevolucion.objects.filter(**filtros).order_by('-fecha_generacion')
        
        return [
            {
                'id': str(pd._id),
                'num_factura': pd.num_factura,
                'prestador_nit': pd.prestador_nit,
                'codigo_causal': pd.codigo_causal,
                'descripcion_causal': pd.descripcion_causal,
                'valor_afectado': float(pd.valor_afectado),
                'fundamentacion_tecnica': pd.fundamentacion_tecnica,
                'fecha_generacion': pd.fecha_generacion,
                'fecha_limite_revision': pd.fecha_limite_revision,
                'evidencia_automatica': pd.evidencia_automatica
            }
            for pd in pre_devoluciones
        ]

    def obtener_pre_glosas_asignadas(self, auditor_username: str) -> List[Dict]:
        """
        Obtiene pre-glosas asignadas a un auditor específico
        """
        pre_glosas = PreGlosa.objects.filter(
            auditado_por=auditor_username,
            estado__in=['PENDIENTE_AUDITORIA', 'ASIGNADA_AUDITORIA']
        ).order_by('-prioridad_revision', '-fecha_generacion')
        
        return [
            {
                'id': str(pg._id),
                'num_factura': pg.num_factura,
                'prestador_nit': pg.prestador_nit,
                'codigo_glosa': pg.codigo_glosa,
                'categoria_glosa': pg.categoria_glosa,
                'descripcion_hallazgo': pg.descripcion_hallazgo,
                'valor_glosado_sugerido': float(pg.valor_glosado_sugerido),
                'prioridad_revision': pg.prioridad_revision,
                'fecha_generacion': pg.fecha_generacion,
                'evidencia_tecnica': pg.evidencia_tecnica
            }
            for pg in pre_glosas
        ]