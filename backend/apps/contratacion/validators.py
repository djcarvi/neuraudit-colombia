# -*- coding: utf-8 -*-
"""
Validadores de negocio según Resolución 2284 de 2023
Ministerio de Salud y Protección Social - Colombia
"""

from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Tuple, Optional

from .models import TarifariosCUPS, TarifariosMedicamentos, TarifariosDispositivos
from apps.catalogs.models import CatalogoCUPSOficial, CatalogoCUMOficial, CatalogoDispositivosOficial, Contratos


class ValidadorResolucion2284:
    """
    Validador principal para cumplimiento de Resolución 2284 de 2023
    """
    
    # Valores mínimos según resolución (ISS 2001 + incrementos)
    VALOR_MINIMO_ISS_2001 = Decimal('1000.00')  # Valor base mínimo
    VALOR_MAXIMO_SOAT_2025 = Decimal('50000000.00')  # Valor tope máximo
    
    # Plazos legales en días hábiles
    PLAZO_RADICACION_SOPORTES = 22
    PLAZO_DEVOLUCION_EPS = 5
    PLAZO_RESPUESTA_PSS_DEVOLUCION = 5
    PLAZO_RESPUESTA_PSS_GLOSA = 5
    PLAZO_RATIFICACION_EPS = 5
    PLAZO_PAGO_PRIMER_50_PORCIENTO = 5

    @classmethod
    def validar_tarifa_cups(cls, codigo_cups: str, valor_unitario: Decimal, 
                           contrato_numero: str, fecha_servicio: datetime.date = None) -> Dict:
        """
        Validar tarifa CUPS según Resolución 2284
        
        Returns:
            Dict con resultado de validación
        """
        resultado = {
            'valido': True,
            'errores': [],
            'advertencias': [],
            'codigo': codigo_cups,
            'tipo': 'CUPS'
        }
        
        # Validar existencia en catálogo oficial
        try:
            cups_oficial = CatalogoCUPSOficial.objects.get(codigo=codigo_cups, habilitado=True)
        except CatalogoCUPSOficial.DoesNotExist:
            resultado['errores'].append(
                f"Código CUPS {codigo_cups} no existe en catálogo oficial MinSalud"
            )
            resultado['valido'] = False
            return resultado
        
        # Validar rango de valores
        if valor_unitario < cls.VALOR_MINIMO_ISS_2001:
            resultado['errores'].append(
                f"Valor ${valor_unitario} por debajo del mínimo ISS 2001 (${cls.VALOR_MINIMO_ISS_2001})"
            )
            resultado['valido'] = False
        
        if valor_unitario > cls.VALOR_MAXIMO_SOAT_2025:
            resultado['advertencias'].append(
                f"Valor ${valor_unitario} excede el tope SOAT 2025 (${cls.VALOR_MAXIMO_SOAT_2025})"
            )
        
        # Validar vigencia del contrato
        try:
            contrato = Contratos.objects.get(numero_contrato=contrato_numero, estado='VIGENTE')
            fecha_servicio = fecha_servicio or datetime.now().date()
            
            if fecha_servicio < contrato.fecha_inicio:
                resultado['errores'].append(
                    f"Servicio prestado antes del inicio del contrato ({contrato.fecha_inicio})"
                )
                resultado['valido'] = False
            
            if contrato.fecha_fin and fecha_servicio > contrato.fecha_fin:
                resultado['errores'].append(
                    f"Servicio prestado después del fin del contrato ({contrato.fecha_fin})"
                )
                resultado['valido'] = False
                
        except Contratos.DoesNotExist:
            resultado['advertencias'].append(
                f"Contrato {contrato_numero} no encontrado en sistema"
            )
        
        # Validar tarifa contractual específica
        try:
            tarifa_contractual = TarifariosCUPS.objects.get(
                codigo_cups=codigo_cups,
                contrato_numero=contrato_numero,
                estado='ACTIVO'
            )
            
            # Comparar con valor contractual
            diferencia = abs(valor_unitario - tarifa_contractual.valor_unitario)
            porcentaje_diferencia = (diferencia / tarifa_contractual.valor_unitario) * 100
            
            if porcentaje_diferencia > 1:  # Margen de error del 1%
                resultado['advertencias'].append(
                    f"Diferencia de {porcentaje_diferencia:.2f}% con tarifa contractual "
                    f"(${tarifa_contractual.valor_unitario})"
                )
                
        except TarifariosCUPS.DoesNotExist:
            resultado['advertencias'].append(
                f"No existe tarifa contractual para CUPS {codigo_cups} en contrato {contrato_numero}"
            )
        
        return resultado

    @classmethod
    def validar_tarifa_medicamento(cls, codigo_cum: str, codigo_ium: str, 
                                 valor_unitario: Decimal, contrato_numero: str) -> Dict:
        """
        Validar tarifa de medicamento según Resolución 2284
        """
        resultado = {
            'valido': True,
            'errores': [],
            'advertencias': [],
            'codigo': codigo_cum or codigo_ium,
            'tipo': 'MEDICAMENTO'
        }
        
        # Validar existencia en catálogo oficial
        medicamento = None
        if codigo_cum:
            try:
                medicamento = CatalogoCUMOficial.objects.get(codigo=codigo_cum, habilitado=True)
            except CatalogoCUMOficial.DoesNotExist:
                resultado['errores'].append(
                    f"Código CUM {codigo_cum} no existe en catálogo oficial"
                )
                resultado['valido'] = False
        
        # Validaciones específicas para medicamentos
        if medicamento:
            # Validar restricciones del medicamento
            # Nota: Los campos exactos dependen del modelo CatalogoCUMOficial
            # Se pueden agregar validaciones específicas según los campos disponibles
            pass
        
        return resultado

    @classmethod
    def validar_plazos_legales(cls, fecha_evento: datetime.date, 
                             tipo_plazo: str) -> Dict:
        """
        Validar cumplimiento de plazos legales según Resolución 2284
        
        Args:
            fecha_evento: Fecha del evento a validar
            tipo_plazo: Tipo de plazo (radicacion, devolucion, respuesta_glosa, etc.)
        """
        resultado = {
            'valido': True,
            'dias_transcurridos': 0,
            'dias_limite': 0,
            'estado': 'VIGENTE'
        }
        
        plazos = {
            'radicacion_soportes': cls.PLAZO_RADICACION_SOPORTES,
            'devolucion_eps': cls.PLAZO_DEVOLUCION_EPS,
            'respuesta_devolucion': cls.PLAZO_RESPUESTA_PSS_DEVOLUCION,
            'respuesta_glosa': cls.PLAZO_RESPUESTA_PSS_GLOSA,
            'ratificacion_eps': cls.PLAZO_RATIFICACION_EPS,
            'pago_primer_50': cls.PLAZO_PAGO_PRIMER_50_PORCIENTO
        }
        
        if tipo_plazo not in plazos:
            resultado['valido'] = False
            resultado['error'] = f"Tipo de plazo '{tipo_plazo}' no reconocido"
            return resultado
        
        dias_limite = plazos[tipo_plazo]
        fecha_actual = datetime.now().date()
        dias_transcurridos = (fecha_actual - fecha_evento).days
        
        resultado['dias_limite'] = dias_limite
        resultado['dias_transcurridos'] = dias_transcurridos
        
        if dias_transcurridos > dias_limite:
            resultado['valido'] = False
            resultado['estado'] = 'VENCIDO'
        elif dias_transcurridos >= (dias_limite - 1):
            resultado['estado'] = 'POR_VENCER'
        
        return resultado

    @classmethod
    def validar_factura_electronica(cls, xml_factura: str) -> Dict:
        """
        Validar estructura de factura electrónica según DIAN y MinSalud
        """
        resultado = {
            'valido': True,
            'errores': [],
            'advertencias': []
        }
        
        # Validaciones básicas de XML (implementación simplificada)
        if not xml_factura or len(xml_factura) < 100:
            resultado['errores'].append("XML de factura incompleto o inválido")
            resultado['valido'] = False
        
        # Aquí se implementarían validaciones más específicas del XML
        # como verificar estructura DIAN, campos obligatorios, etc.
        
        return resultado

    @classmethod
    def validar_rips(cls, json_rips: dict) -> Dict:
        """
        Validar estructura RIPS según MinSalud
        """
        resultado = {
            'valido': True,
            'errores': [],
            'advertencias': []
        }
        
        campos_obligatorios = [
            'numeroRadicado', 'fechaExpedicion', 'codigoEPS',
            'servicios', 'valorTotal'
        ]
        
        for campo in campos_obligatorios:
            if campo not in json_rips:
                resultado['errores'].append(f"Campo obligatorio '{campo}' faltante en RIPS")
                resultado['valido'] = False
        
        return resultado

    @classmethod
    def validar_autorizacion_previa(cls, codigo_servicio: str, 
                                  tipo_servicio: str, valor: Decimal) -> Dict:
        """
        Validar si el servicio requiere autorización previa
        """
        resultado = {
            'requiere_autorizacion': False,
            'motivo': '',
            'valor_limite': Decimal('0')
        }
        
        # Servicios que siempre requieren autorización
        servicios_autorizacion = [
            # Procedimientos de alto costo
            '890201', '890202', '890301',  # Cirugías complejas
            '870101', '870102',  # UTI
            # Medicamentos alto costo
            '99001', '99002'  # No POS
        ]
        
        if codigo_servicio in servicios_autorizacion:
            resultado['requiere_autorizacion'] = True
            resultado['motivo'] = 'Servicio de alto costo según resolución'
        
        # Validar por valor
        if valor > Decimal('1000000'):  # 1 millón
            resultado['requiere_autorizacion'] = True
            resultado['motivo'] = 'Valor excede límite de autorización automática'
            resultado['valor_limite'] = Decimal('1000000')
        
        return resultado


class ValidadorContractual:
    """
    Validaciones específicas contractuales
    """
    
    @classmethod
    def validar_cobertura_servicio(cls, codigo_servicio: str, tipo_servicio: str,
                                 contrato_numero: str, ambito: str = 'AMBULATORIO') -> Dict:
        """
        Validar si el servicio está cubierto por el contrato
        """
        resultado = {
            'cubierto': True,
            'observaciones': []
        }
        
        try:
            contrato = Contratos.objects.get(numero_contrato=contrato_numero)
            
            # Validar ámbito de atención
            # Nota: El modelo Contratos actual no tiene campo ambitos_atencion
            # Se puede implementar según la estructura específica del contrato
            pass
            
            # Validar nivel de atención
            if hasattr(contrato, 'nivel_atencion_maximo'):
                # Implementar lógica de validación por nivel
                pass
                
        except Contratos.DoesNotExist:
            resultado['cubierto'] = False
            resultado['observaciones'].append("Contrato no encontrado")
        
        return resultado


# Funciones de utilidad para validaciones rápidas

def validar_facturacion_basica(codigo: str, valor: Decimal, tipo: str = 'CUPS') -> bool:
    """
    Validación básica rápida para facturación
    """
    if tipo == 'CUPS':
        resultado = ValidadorResolucion2284.validar_tarifa_cups(codigo, valor, 'DEFAULT')
    else:
        resultado = {'valido': True}
    
    return resultado['valido']


def calcular_glosa_automatica(valor_facturado: Decimal, valor_contractual: Decimal,
                            tolerance_percent: float = 1.0) -> Optional[Dict]:
    """
    Calcular si se debe generar glosa automática por diferencia de valores
    """
    if not valor_contractual or valor_contractual == 0:
        return None
    
    diferencia = abs(valor_facturado - valor_contractual)
    porcentaje = (diferencia / valor_contractual) * 100
    
    if porcentaje > tolerance_percent:
        return {
            'generar_glosa': True,
            'codigo_glosa': 'TA0201',  # Diferencia en valor pactado
            'valor_diferencia': diferencia,
            'porcentaje_diferencia': porcentaje,
            'observacion': f'Diferencia del {porcentaje:.2f}% respecto al valor contractual'
        }
    
    return None