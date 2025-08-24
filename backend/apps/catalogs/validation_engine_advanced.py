# -*- coding: utf-8 -*-
# apps/catalogs/validation_engine_advanced.py

"""
Motor de Validación Avanzado NeurAudit Colombia
Implementa reglas específicas de la Resolución 2284 de 2023
para auditoría automática integral de cuentas médicas
"""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Any, Optional, Tuple
import logging

# Models
from .models import (
    CatalogoCUPSOficial, CatalogoCUMOficial, CatalogoIUMOficial,
    CatalogoDispositivosOficial, BDUAAfiliados
)
from apps.contratacion.models import (
    TarifariosCUPS, TarifariosMedicamentos, TarifariosDispositivos
)
from apps.radicacion.models_rips_oficial import (
    RIPSTransaccionOficial as RIPSTransaccion, RIPSUsuarioOficial as RIPSUsuario, RIPSConsulta, RIPSProcedimiento,
    RIPSUrgencia, RIPSHospitalizacion, RIPSOtrosServicios, RIPSMedicamento
)

logger = logging.getLogger(__name__)


class ValidationEngineAdvanced:
    """
    Motor de validación avanzado según Resolución 2284 de 2023
    Implementa todas las causales de glosa y devolución oficial
    """
    
    def __init__(self):
        self.validaciones_realizadas = []
        self.glosas_generadas = []
        self.devoluciones_generadas = []
        
        # Configuración de reglas según Resolution 2284
        self.PLAZOS_RADICACION = {
            'FACTURAS': 22,  # días hábiles
            'RESPUESTA_DEVOLUCION': 5,
            'RESPUESTA_GLOSA': 5
        }
        
        self.CAUSALES_DEVOLUCION = {
            'DE16': 'Persona corresponde a otro responsable de pago',
            'DE44': 'Prestador no hace parte de la red integral',
            'DE50': 'Factura ya pagada o en trámite de pago',
            'DE56': 'No radicación de soportes dentro de los 22 días hábiles'
        }
        
        self.CAUSALES_GLOSA = {
            'FA': 'Facturación - Diferencias en cantidades/valores',
            'TA': 'Tarifas - Diferencias en valores pactados',
            'SO': 'Soportes - Ausencia o inconsistencia documentos',
            'AU': 'Autorizaciones - Servicios no autorizados',
            'CO': 'Cobertura - Servicios no incluidos en plan',
            'CL': 'Calidad - Pertinencia médica cuestionable',
            'SA': 'Seguimiento acuerdos - Incumplimiento indicadores'
        }

    def validar_transaccion_rips_completa(self, transaccion_id: str) -> Dict[str, Any]:
        """
        Validación completa de una transacción RIPS según Resolution 2284
        """
        try:
            transaccion = RIPSTransaccion.objects.get(_id=transaccion_id)
        except RIPSTransaccion.DoesNotExist:
            return {'error': f'Transacción {transaccion_id} no encontrada'}

        resultado = {
            'transaccion_id': transaccion_id,
            'num_factura': transaccion.num_factura,
            'prestador_nit': transaccion.num_documento_id_obligado,
            'fecha_validacion': datetime.now(),
            'estado_validacion': 'PROCESANDO',
            'resumen': {
                'total_usuarios': 0,
                'total_servicios': 0,
                'usuarios_validos': 0,
                'servicios_validos': 0,
                'valor_total_facturado': Decimal('0.00'),
                'valor_total_glosas': Decimal('0.00'),
                'valor_total_devoluciones': Decimal('0.00'),
                'valor_neto_aprobado': Decimal('0.00')
            },
            'devoluciones': [],
            'glosas_por_usuario': [],
            'validaciones_detalle': [],
            'recomendaciones_auditoria': []
        }

        # 1. Validaciones a nivel de transacción
        self._validar_nivel_transaccion(transaccion, resultado)
        
        # 2. Validar usuarios y sus servicios
        usuarios = RIPSUsuario.objects.filter(transaccion_id=transaccion_id)
        resultado['resumen']['total_usuarios'] = usuarios.count()
        
        for usuario in usuarios:
            validacion_usuario = self._validar_usuario_completo(usuario, transaccion)
            resultado['glosas_por_usuario'].append(validacion_usuario)
            
            # Acumular estadísticas
            if validacion_usuario['usuario_valido']:
                resultado['resumen']['usuarios_validos'] += 1
            
            resultado['resumen']['total_servicios'] += validacion_usuario['total_servicios']
            resultado['resumen']['servicios_validos'] += validacion_usuario['servicios_validos']
            resultado['resumen']['valor_total_facturado'] += validacion_usuario['valor_total_usuario']
            resultado['resumen']['valor_total_glosas'] += validacion_usuario['valor_total_glosas']

        # 3. Determinar estado final
        resultado['estado_validacion'] = self._determinar_estado_final(resultado)
        resultado['resumen']['valor_neto_aprobado'] = (
            resultado['resumen']['valor_total_facturado'] - 
            resultado['resumen']['valor_total_glosas'] -
            resultado['resumen']['valor_total_devoluciones']
        )

        # 4. Generar recomendaciones de auditoría
        resultado['recomendaciones_auditoria'] = self._generar_recomendaciones(resultado)

        return resultado

    def _validar_nivel_transaccion(self, transaccion: RIPSTransaccion, resultado: Dict):
        """
        Validaciones a nivel de transacción completa
        """
        # DE56: Validar plazo de radicación (22 días hábiles)
        if self._excede_plazo_radicacion(transaccion.fecha_radicacion):
            resultado['devoluciones'].append({
                'codigo': 'DE56',
                'descripcion': self.CAUSALES_DEVOLUCION['DE56'],
                'valor_afectado': transaccion.valor_total_facturado,
                'nivel': 'TRANSACCION',
                'critico': True
            })
            resultado['resumen']['valor_total_devoluciones'] += transaccion.valor_total_facturado

        # DE44: Validar que prestador esté en red (pendiente integración)
        # DE50: Validar que factura no esté duplicada
        facturas_duplicadas = RIPSTransaccion.objects.filter(
            num_factura=transaccion.num_factura,
            num_documento_id_obligado=transaccion.num_documento_id_obligado
        ).exclude(_id=transaccion._id)
        
        if facturas_duplicadas.exists():
            resultado['devoluciones'].append({
                'codigo': 'DE50',
                'descripcion': self.CAUSALES_DEVOLUCION['DE50'],
                'valor_afectado': transaccion.valor_total_facturado,
                'nivel': 'TRANSACCION',
                'critico': True
            })

    def _validar_usuario_completo(self, usuario: RIPSUsuario, transaccion: RIPSTransaccion) -> Dict:
        """
        Validación completa de un usuario y todos sus servicios
        """
        validacion = {
            'usuario_id': str(getattr(usuario, 'id', str(usuario))),
            'documento': f"{getattr(usuario, 'tipoDocumento', '')}-{getattr(usuario, 'numeroDocumento', '')}",
            'usuario_valido': True,
            'total_servicios': 0,
            'servicios_validos': 0,
            'valor_total_usuario': Decimal('0.00'),
            'valor_total_glosas': Decimal('0.00'),
            'glosas_usuario': [],
            'validaciones_bdua': {},
            'servicios_detalle': []
        }

        # 1. Validar derechos en BDUA
        validacion['validaciones_bdua'] = self._validar_derechos_usuario_bdua(
            getattr(usuario, 'tipoDocumento', ''),
            getattr(usuario, 'numeroDocumento', ''),
            transaccion.fechaRadicacion.date()
        )

        if not validacion['validaciones_bdua']['tiene_derechos']:
            validacion['usuario_valido'] = False
            return validacion  # Usuario sin derechos, no validar servicios

        # 2. Validar servicios embebidos del usuario
        if hasattr(usuario, 'servicios') and usuario.servicios:
            tipos_servicios = [
                ('consultas', 'consultas'),
                ('procedimientos', 'procedimientos'),
                ('urgencias', 'urgencias'),
                ('hospitalizacion', 'hospitalizacion'),
                ('otrosServicios', 'otrosServicios'),
                ('medicamentos', 'medicamentos'),
                ('recienNacidos', 'recienNacidos')
            ]

            for tipo_nombre, attr_name in tipos_servicios:
                servicios = getattr(usuario.servicios, attr_name, None)
                if servicios:
                    validacion['total_servicios'] += len(servicios)
                    
                    for servicio in servicios:
                        validacion_servicio = self._validar_servicio_individual(servicio, tipo_nombre, usuario)
                        validacion['servicios_detalle'].append(validacion_servicio)
                        
                        if validacion_servicio['servicio_valido']:
                            validacion['servicios_validos'] += 1
                        
                        validacion['valor_total_usuario'] += validacion_servicio['valor_servicio']
                        validacion['valor_total_glosas'] += validacion_servicio['valor_glosado']
                        
                        if validacion_servicio['glosas']:
                            validacion['glosas_usuario'].extend(validacion_servicio['glosas'])

        return validacion

    def _validar_derechos_usuario_bdua(self, tipo_documento: str, numero_documento: str, fecha_atencion) -> Dict:
        """
        Validación de derechos del usuario en BDUA
        """
        try:
            afiliado = BDUAAfiliados.objects.get(
                tipo_documento_identificacion=tipo_documento,
                numero_documento_identificacion=numero_documento
            )
            
            # Validar estado de afiliación en fecha
            tiene_derechos = afiliado.estado_afiliacion == 'ACTIVO'
            
            # Validar vigencia de afiliación
            if afiliado.fecha_afiliacion and fecha_atencion < afiliado.fecha_afiliacion:
                tiene_derechos = False
            
            return {
                'usuario_encontrado': True,
                'tiene_derechos': tiene_derechos,
                'regimen': afiliado.regimen,
                'eps_codigo': afiliado.eps_codigo,
                'estado_afiliacion': afiliado.estado_afiliacion,
                'fecha_afiliacion': afiliado.fecha_afiliacion,
                'observaciones': []
            }
            
        except BDUAAfiliados.DoesNotExist:
            return {
                'usuario_encontrado': False,
                'tiene_derechos': False,
                'causal_devolucion': 'DE16',
                'mensaje': f'Usuario {tipo_documento} {numero_documento} no encontrado en BDUA',
                'observaciones': ['Usuario no existe en base de datos única de afiliados']
            }

    def _validar_servicio_individual(self, servicio, tipo_servicio: str, usuario: RIPSUsuario) -> Dict:
        """
        Validación individual de un servicio
        """
        validacion = {
            'servicio_id': str(servicio._id),
            'tipo_servicio': tipo_servicio,
            'servicio_valido': True,
            'valor_servicio': getattr(servicio, 'vr_servicio', Decimal('0.00')),
            'valor_glosado': Decimal('0.00'),
            'glosas': [],
            'validaciones_tecnicas': []
        }

        # Validaciones específicas por tipo de servicio
        if tipo_servicio == 'consultas':
            self._validar_consulta(servicio, validacion, usuario)
        elif tipo_servicio == 'procedimientos':
            self._validar_procedimiento(servicio, validacion, usuario)
        elif tipo_servicio == 'urgencias':
            self._validar_urgencia(servicio, validacion, usuario)
        elif tipo_servicio == 'hospitalizacion':
            self._validar_hospitalizacion(servicio, validacion, usuario)
        elif tipo_servicio == 'medicamentos':
            self._validar_medicamento(servicio, validacion, usuario)
        elif tipo_servicio == 'otrosServicios':
            self._validar_otro_servicio(servicio, validacion, usuario)

        return validacion

    def _validar_consulta(self, consulta: RIPSConsulta, validacion: Dict, usuario: RIPSUsuario):
        """
        Validaciones específicas para consultas
        """
        # CL0101: Validar código CUPS existe
        try:
            cups_oficial = CatalogoCUPSOficial.objects.get(codigo_cups=consulta.cod_consulta)
            validacion['validaciones_tecnicas'].append({
                'tipo': 'CODIGO_CUPS',
                'valido': True,
                'descripcion': cups_oficial.descripcion
            })
        except CatalogoCUPSOficial.DoesNotExist:
            validacion['servicio_valido'] = False
            validacion['glosas'].append({
                'codigo': 'FA0101',
                'descripcion': f'Código CUPS {consulta.cod_consulta} no existe en catálogo oficial',
                'valor_glosado': consulta.vr_servicio,
                'categoria': 'FACTURACION'
            })
            validacion['valor_glosado'] += consulta.vr_servicio

        # CL0102: Validar pertinencia médica básica
        if consulta.cod_diagnostico_principal:
            pertinencia = self._validar_pertinencia_consulta_diagnostico(
                consulta.cod_consulta, consulta.cod_diagnostico_principal
            )
            if not pertinencia['pertinente']:
                validacion['glosas'].append({
                    'codigo': 'CL0102',
                    'descripcion': f'Consulta {consulta.cod_consulta} no pertinente para diagnóstico {consulta.cod_diagnostico_principal}',
                    'valor_glosado': consulta.vr_servicio * Decimal('0.5'),  # Glosa parcial
                    'categoria': 'CALIDAD'
                })
                validacion['valor_glosado'] += consulta.vr_servicio * Decimal('0.5')

        # TA0101: Validar tarifa contractual
        self._validar_tarifa_cups(consulta.cod_consulta, consulta.vr_servicio, validacion)

    def _validar_procedimiento(self, procedimiento: RIPSProcedimiento, validacion: Dict, usuario: RIPSUsuario):
        """
        Validaciones específicas para procedimientos
        """
        # AU0101: Validar autorización si es requerida
        if self._requiere_autorizacion_cups(procedimiento.cod_procedimiento):
            if not procedimiento.num_autorizacion:
                validacion['glosas'].append({
                    'codigo': 'AU0101',
                    'descripcion': f'Procedimiento {procedimiento.cod_procedimiento} requiere autorización',
                    'valor_glosado': procedimiento.vr_servicio,
                    'categoria': 'AUTORIZACION'
                })
                validacion['valor_glosado'] += procedimiento.vr_servicio

        # CL0201: Validar diagnóstico coherente con procedimiento
        coherencia = self._validar_coherencia_procedimiento_diagnostico(
            procedimiento.cod_procedimiento, procedimiento.cod_diagnostico_principal
        )
        if not coherencia['coherente']:
            validacion['glosas'].append({
                'codigo': 'CL0201',
                'descripcion': f'Procedimiento {procedimiento.cod_procedimiento} no coherente con diagnóstico {procedimiento.cod_diagnostico_principal}',
                'valor_glosado': procedimiento.vr_servicio * Decimal('0.3'),
                'categoria': 'CALIDAD'
            })
            validacion['valor_glosado'] += procedimiento.vr_servicio * Decimal('0.3')

        # Validar tarifa
        self._validar_tarifa_cups(procedimiento.cod_procedimiento, procedimiento.vr_servicio, validacion)

    def _validar_medicamento(self, medicamento: RIPSMedicamento, validacion: Dict, usuario: RIPSUsuario):
        """
        Validaciones específicas para medicamentos
        """
        # FA0201: Validar código CUM
        try:
            cum_oficial = CatalogoCUMOficial.objects.get(codigo_cum=medicamento.cod_medicamento)
            validacion['validaciones_tecnicas'].append({
                'tipo': 'CODIGO_CUM',
                'valido': True,
                'descripcion': cum_oficial.nombre_medicamento
            })
        except CatalogoCUMOficial.DoesNotExist:
            validacion['glosas'].append({
                'codigo': 'FA0201',
                'descripcion': f'Código CUM {medicamento.cod_medicamento} no existe',
                'valor_glosado': medicamento.vr_servicio,
                'categoria': 'FACTURACION'
            })
            validacion['valor_glosado'] += medicamento.vr_servicio

        # CO0201: Validar cobertura POS
        if hasattr(medicamento, 'cod_medicamento'):
            cobertura = self._validar_cobertura_pos_medicamento(medicamento.cod_medicamento)
            if not cobertura['cubierto']:
                validacion['glosas'].append({
                    'codigo': 'CO0201',
                    'descripcion': f'Medicamento {medicamento.cod_medicamento} no cubierto por POS',
                    'valor_glosado': medicamento.vr_servicio,
                    'categoria': 'COBERTURA'
                })
                validacion['valor_glosado'] += medicamento.vr_servicio

    def _validar_tarifa_cups(self, codigo_cups: str, valor_facturado: Decimal, validacion: Dict):
        """
        Validar tarifa CUPS contra tarifario contractual
        """
        try:
            # Buscar tarifa en contratos (pendiente implementar lógica de contrato específico)
            tarifa_contractual = TarifariosCUPS.objects.filter(
                codigo_cups=codigo_cups,
                estado='ACTIVO'
            ).first()
            
            if tarifa_contractual:
                diferencia = valor_facturado - tarifa_contractual.valor_unitario
                if abs(diferencia) > Decimal('1.00'):  # Tolerancia de $1
                    validacion['glosas'].append({
                        'codigo': 'TA0101',
                        'descripcion': f'Diferencia tarifaria CUPS {codigo_cups}: Facturado ${valor_facturado}, Contractual ${tarifa_contractual.valor_unitario}',
                        'valor_glosado': abs(diferencia),
                        'categoria': 'TARIFA'
                    })
                    validacion['valor_glosado'] += abs(diferencia)
        except Exception as e:
            logger.warning(f'Error validando tarifa CUPS {codigo_cups}: {str(e)}')

    def _excede_plazo_radicacion(self, fecha_radicacion: datetime) -> bool:
        """
        Verifica si excede los 22 días hábiles para radicación
        """
        # Lógica simplificada - en producción calcular días hábiles
        fecha_limite = fecha_radicacion - timedelta(days=30)  # Aproximación
        return datetime.now() > fecha_limite + timedelta(days=22)

    def _requiere_autorizacion_cups(self, codigo_cups: str) -> bool:
        """
        Determina si un código CUPS requiere autorización previa
        """
        # Códigos que típicamente requieren autorización
        codigos_autorizacion = ['05', '06', '07', '08', '89']  # Cirugía, anestesia, etc.
        return codigo_cups[:2] in codigos_autorizacion if codigo_cups else False

    def _validar_pertinencia_consulta_diagnostico(self, codigo_consulta: str, codigo_diagnostico: str) -> Dict:
        """
        Validar pertinencia médica básica entre consulta y diagnóstico
        """
        # Lógica simplificada - en producción usar matrices de pertinencia médica
        pertinencias_basicas = {
            '890350': ['Z00', 'R', 'I10'],  # Medicina general: chequeos, síntomas, hipertensión
            '890394': ['N40', 'N39', 'R31'],  # Urología: próstata, orina, síntomas renales
            '890280': ['M17', 'M16', 'Z54']   # Ortopedia: artritis, prótesis, seguimiento
        }
        
        diagnosticos_validos = pertinencias_basicas.get(codigo_consulta, [])
        pertinente = any(codigo_diagnostico.startswith(diag) for diag in diagnosticos_validos)
        
        return {
            'pertinente': pertinente,
            'observaciones': [] if pertinente else ['Consulta no pertinente para diagnóstico']
        }

    def _validar_coherencia_procedimiento_diagnostico(self, codigo_procedimiento: str, codigo_diagnostico: str) -> Dict:
        """
        Validar coherencia entre procedimiento y diagnóstico
        """
        # Lógica simplificada de coherencia
        coherencias_basicas = {
            '901236': ['N40', 'N20', 'N30'],  # Procedimientos urológicos
            '893815': ['I', 'J', 'R'],        # Procedimientos generales
            '902049': ['S70', 'S72', 'T']     # Procedimientos traumatología
        }
        
        diagnosticos_coherentes = coherencias_basicas.get(codigo_procedimiento, [])
        coherente = any(codigo_diagnostico.startswith(diag) for diag in diagnosticos_coherentes)
        
        return {
            'coherente': coherente,
            'observaciones': [] if coherente else ['Procedimiento no coherente con diagnóstico']
        }

    def _validar_cobertura_pos_medicamento(self, codigo_cum: str) -> Dict:
        """
        Validar cobertura POS del medicamento
        """
        try:
            medicamento = CatalogoCUMOficial.objects.get(codigo_cum=codigo_cum)
            # En producción consultar lista oficial POS
            cubierto = medicamento.pos_no_pos == 'POS' if hasattr(medicamento, 'pos_no_pos') else True
            
            return {
                'cubierto': cubierto,
                'observaciones': [] if cubierto else ['Medicamento no incluido en POS']
            }
        except CatalogoCUMOficial.DoesNotExist:
            return {
                'cubierto': False,
                'observaciones': ['Código CUM no encontrado']
            }

    def _determinar_estado_final(self, resultado: Dict) -> str:
        """
        Determina el estado final de la validación
        """
        if resultado['devoluciones']:
            return 'DEVUELTO'
        elif resultado['resumen']['valor_total_glosas'] > 0:
            return 'GLOSADO'
        else:
            return 'APROBADO'

    def _generar_recomendaciones(self, resultado: Dict) -> List[Dict]:
        """
        Genera recomendaciones para el equipo de auditoría
        """
        recomendaciones = []
        
        # Recomendación por alta tasa de glosas
        tasa_glosas = (resultado['resumen']['valor_total_glosas'] / 
                      max(resultado['resumen']['valor_total_facturado'], Decimal('1.00'))) * 100
        
        if tasa_glosas > 30:
            recomendaciones.append({
                'tipo': 'ALTA_TASA_GLOSAS',
                'descripcion': f'Tasa de glosas alta ({tasa_glosas:.1f}%). Revisar facturación del prestador.',
                'prioridad': 'ALTA'
            })
        
        # Recomendación por servicios de alta complejidad
        servicios_alta_complejidad = sum(1 for usuario in resultado['glosas_por_usuario'] 
                                       for servicio in usuario['servicios_detalle']
                                       if servicio.get('valor_servicio', 0) > 500000)
        
        if servicios_alta_complejidad > 5:
            recomendaciones.append({
                'tipo': 'REVISION_ALTA_COMPLEJIDAD',
                'descripcion': f'{servicios_alta_complejidad} servicios de alta complejidad requieren revisión médica.',
                'prioridad': 'MEDIA'
            })
        
        return recomendaciones

    # Métodos adicionales de validación específica
    def _validar_urgencia(self, urgencia: RIPSUrgencia, validacion: Dict, usuario: RIPSUsuario):
        """Validaciones específicas para urgencias"""
        # Validar coherencia entre diagnóstico de ingreso y egreso
        if urgencia.cod_diagnostico_principal != urgencia.cod_diagnostico_principal_e:
            # Esto es normal, pero validar que sea lógico
            pass
        
        # Validar tiempo de estancia
        if urgencia.fecha_egreso and urgencia.fecha_inicio_atencion:
            estancia = (urgencia.fecha_egreso - urgencia.fecha_inicio_atencion).days
            if estancia > 7:  # Urgencia muy larga
                validacion['validaciones_tecnicas'].append({
                    'tipo': 'ESTANCIA_PROLONGADA',
                    'valido': False,
                    'observacion': f'Estancia en urgencias de {estancia} días requiere justificación'
                })

    def _validar_hospitalizacion(self, hospitalizacion: RIPSHospitalizacion, validacion: Dict, usuario: RIPSUsuario):
        """Validaciones específicas para hospitalización"""
        # Validar estancia vs diagnóstico
        if hospitalizacion.fecha_egreso and hospitalizacion.fecha_inicio_atencion:
            estancia = (hospitalizacion.fecha_egreso - hospitalizacion.fecha_inicio_atencion).days
            
            # Validar estancia mínima/máxima según diagnóstico
            estancia_esperada = self._obtener_estancia_esperada(hospitalizacion.cod_diagnostico_principal_e)
            if estancia > estancia_esperada * 2:
                validacion['glosas'].append({
                    'codigo': 'CL0301',
                    'descripcion': f'Estancia hospitalaria excesiva: {estancia} días para diagnóstico {hospitalizacion.cod_diagnostico_principal_e}',
                    'valor_glosado': Decimal('0'),  # Revisión médica requerida
                    'categoria': 'CALIDAD'
                })

    def _validar_otro_servicio(self, otro_servicio: RIPSOtrosServicios, validacion: Dict, usuario: RIPSUsuario):
        """Validaciones específicas para otros servicios"""
        # Validar código de tecnología
        if otro_servicio.cod_tecnologia_salud:
            # Validar contra catálogo (pendiente implementar)
            pass
        
        # Validar cantidad vs tipo de servicio
        if otro_servicio.cantidad_os and otro_servicio.cantidad_os > 100:
            validacion['validaciones_tecnicas'].append({
                'tipo': 'CANTIDAD_EXCESIVA',
                'valido': False,
                'observacion': f'Cantidad excesiva de {otro_servicio.nom_tecnologia_salud}: {otro_servicio.cantidad_os}'
            })

    def _obtener_estancia_esperada(self, codigo_diagnostico: str) -> int:
        """
        Obtiene estancia hospitalaria esperada según diagnóstico
        """
        # Estancias promedio por grupo diagnóstico (simplificado)
        estancias_diagnosticos = {
            'S70': 5,   # Traumatismos cadera
            'I21': 7,   # Infarto agudo
            'J44': 4,   # EPOC
            'N40': 2,   # Hiperplasia prostática
            'Z51': 1    # Atención para procedimientos
        }
        
        for codigo, estancia in estancias_diagnosticos.items():
            if codigo_diagnostico.startswith(codigo):
                return estancia
        
        return 3  # Estancia promedio general