# -*- coding: utf-8 -*-
# apps/catalogs/validation_engine.py

"""
Motor de Validación Integral NeurAudit Colombia
Valida códigos CUPS, CUM, IUM, Dispositivos contra catálogos oficiales
y tarifas contra contratos vigentes según Resolución 2284 de 2023
"""

from datetime import datetime
from decimal import Decimal
from typing import Dict, List, Any, Optional

# Models
from .models import (
    CatalogoCUPSOficial, CatalogoCUMOficial, CatalogoIUMOficial,
    CatalogoDispositivosOficial, BDUAAfiliados
)
from apps.contratacion.models import (
    TarifariosCUPS, TarifariosMedicamentos, TarifariosDispositivos
)


class ValidationEngine:
    """
    Motor de validación integral para auditoría automática
    """
    
    def __init__(self):
        self.validaciones_realizadas = []
        self.errores_encontrados = []
        
    def validar_cuenta_completa(self, datos_cuenta: Dict) -> Dict[str, Any]:
        """
        Validación completa de una cuenta médica
        """
        resultado = {
            'cuenta_valida': True,
            'devoluciones': [],
            'glosas': [],
            'validaciones_detalle': [],
            'resumen_financiero': {
                'valor_total_facturado': Decimal('0.00'),
                'valor_total_glosas': Decimal('0.00'),
                'valor_total_devoluciones': Decimal('0.00'),
                'valor_neto_pagable': Decimal('0.00')
            }
        }
        
        # 1. Validar BDUA (derechos del usuario)
        if 'usuario' in datos_cuenta:
            validacion_bdua = self._validar_derechos_bdua(
                datos_cuenta['usuario']['tipo_documento'],
                datos_cuenta['usuario']['numero_documento'],
                datos_cuenta.get('fecha_atencion', datetime.now().date())
            )
            resultado['validaciones_detalle'].append(validacion_bdua)
            
            if not validacion_bdua['valido']:
                resultado['devoluciones'].append({
                    'codigo': validacion_bdua['causal_devolucion'],
                    'descripcion': validacion_bdua['mensaje'],
                    'valor_afectado': datos_cuenta.get('valor_total', 0)
                })
                resultado['cuenta_valida'] = False
        
        # 2. Validar códigos CUPS
        if 'procedimientos' in datos_cuenta:
            for procedimiento in datos_cuenta['procedimientos']:
                validacion_cups = self._validar_codigo_cups(
                    procedimiento['codigo'],
                    datos_cuenta.get('contrato_numero'),
                    procedimiento.get('valor_unitario', 0),
                    datos_cuenta.get('fecha_atencion')
                )
                resultado['validaciones_detalle'].append(validacion_cups)
                
                if not validacion_cups['codigo_valido']:
                    resultado['glosas'].append({
                        'codigo': 'FA0101',
                        'descripcion': f'Código CUPS {procedimiento["codigo"]} no válido',
                        'valor_glosado': procedimiento.get('valor_unitario', 0)
                    })
                elif validacion_cups.get('diferencia_tarifa', 0) != 0:
                    resultado['glosas'].append({
                        'codigo': 'TA0101',
                        'descripción': f'Diferencia tarifaria CUPS {procedimiento["codigo"]}',
                        'valor_glosado': abs(validacion_cups['diferencia_tarifa'])
                    })
        
        # 3. Validar códigos CUM/IUM
        if 'medicamentos' in datos_cuenta:
            for medicamento in datos_cuenta['medicamentos']:
                validacion_med = self._validar_codigo_medicamento(
                    medicamento.get('codigo_cum'),
                    medicamento.get('codigo_ium'),
                    datos_cuenta.get('contrato_numero'),
                    medicamento.get('valor_unitario', 0),
                    datos_cuenta.get('fecha_atencion')
                )
                resultado['validaciones_detalle'].append(validacion_med)
                
                if not validacion_med['codigo_valido']:
                    codigo_usado = medicamento.get('codigo_cum') or medicamento.get('codigo_ium')
                    resultado['glosas'].append({
                        'codigo': 'FA0201',
                        'descripcion': f'Código medicamento {codigo_usado} no válido',
                        'valor_glosado': medicamento.get('valor_unitario', 0)
                    })
        
        # 4. Calcular resumen financiero
        resultado['resumen_financiero'] = self._calcular_resumen_financiero(
            datos_cuenta, resultado['glosas'], resultado['devoluciones']
        )
        
        return resultado
    
    def _validar_derechos_bdua(self, tipo_documento: str, numero_documento: str, fecha_atencion) -> Dict:
        """
        Validar derechos del usuario en BDUA
        """
        try:
            afiliado = BDUAAfiliados.objects.get(
                usuario_tipo_documento=tipo_documento,
                usuario_numero_documento=numero_documento
            )
            
            return afiliado.validar_derechos_en_fecha(fecha_atencion)
            
        except BDUAAfiliados.DoesNotExist:
            return {
                'valido': False,
                'causal_devolucion': 'DE1601',
                'mensaje': f'Usuario {tipo_documento} {numero_documento} no encontrado en BDUA'
            }
    
    def _validar_codigo_cups(self, codigo: str, contrato_numero: Optional[str], 
                           valor_facturado: Decimal, fecha_servicio) -> Dict:
        """
        Validar código CUPS contra catálogo oficial y tarifa contractual
        """
        resultado = {
            'tipo_validacion': 'CUPS',
            'codigo': codigo,
            'codigo_valido': False,
            'tarifa_valida': False,
            'diferencia_tarifa': Decimal('0.00'),
            'observaciones': []
        }
        
        # 1. Validar contra catálogo oficial
        try:
            cups_oficial = CatalogoCUPSOficial.objects.get(
                codigo=codigo, 
                habilitado=True
            )
            resultado['codigo_valido'] = True
            resultado['observaciones'].append('Código CUPS válido en catálogo oficial')
            
            # 2. Validar tarifa contractual si hay contrato
            if contrato_numero:
                try:
                    tarifa = TarifariosCUPS.objects.get(
                        codigo_cups=codigo,
                        contrato_numero=contrato_numero,
                        estado='ACTIVO',
                        vigencia_desde__lte=fecha_servicio,
                        vigencia_hasta__gte=fecha_servicio
                    )
                    
                    resultado['tarifa_valida'] = True
                    resultado['valor_contractual'] = tarifa.valor_unitario
                    resultado['diferencia_tarifa'] = valor_facturado - tarifa.valor_unitario
                    
                    if resultado['diferencia_tarifa'] == 0:
                        resultado['observaciones'].append('Tarifa contractual correcta')
                    else:
                        resultado['observaciones'].append(f'Diferencia tarifaria: ${resultado["diferencia_tarifa"]}')
                        
                except TarifariosCUPS.DoesNotExist:
                    resultado['observaciones'].append('Tarifa CUPS no encontrada en contrato')
                    
        except CatalogoCUPSOficial.DoesNotExist:
            resultado['observaciones'].append('Código CUPS no encontrado en catálogo oficial')
        
        return resultado
    
    def _validar_codigo_medicamento(self, codigo_cum: Optional[str], codigo_ium: Optional[str],
                                  contrato_numero: Optional[str], valor_facturado: Decimal, 
                                  fecha_servicio) -> Dict:
        """
        Validar código CUM/IUM contra catálogos oficiales y tarifa contractual
        """
        resultado = {
            'tipo_validacion': 'MEDICAMENTO',
            'codigo_cum': codigo_cum,
            'codigo_ium': codigo_ium,
            'codigo_valido': False,
            'tarifa_valida': False,
            'diferencia_tarifa': Decimal('0.00'),
            'observaciones': []
        }
        
        # Validar CUM si está presente
        if codigo_cum:
            try:
                cum_oficial = CatalogoCUMOficial.objects.get(
                    codigo=codigo_cum,
                    habilitado=True
                )
                resultado['codigo_valido'] = True
                resultado['observaciones'].append('Código CUM válido en catálogo oficial')
                
                # Validar tarifa contractual
                if contrato_numero:
                    self._validar_tarifa_medicamento(
                        resultado, 'CUM', codigo_cum, contrato_numero, 
                        valor_facturado, fecha_servicio
                    )
                    
            except CatalogoCUMOficial.DoesNotExist:
                resultado['observaciones'].append('Código CUM no encontrado en catálogo oficial')
        
        # Validar IUM si está presente y CUM no es válido
        if codigo_ium and not resultado['codigo_valido']:
            try:
                ium_oficial = CatalogoIUMOficial.objects.get(
                    codigo=codigo_ium,
                    habilitado=True
                )
                resultado['codigo_valido'] = True
                resultado['observaciones'].append('Código IUM válido en catálogo oficial')
                
                # Validar tarifa contractual
                if contrato_numero:
                    self._validar_tarifa_medicamento(
                        resultado, 'IUM', codigo_ium, contrato_numero,
                        valor_facturado, fecha_servicio
                    )
                    
            except CatalogoIUMOficial.DoesNotExist:
                resultado['observaciones'].append('Código IUM no encontrado en catálogo oficial')
        
        return resultado
    
    def _validar_tarifa_medicamento(self, resultado: Dict, tipo_codigo: str, codigo: str,
                                  contrato_numero: str, valor_facturado: Decimal, fecha_servicio):
        """
        Validar tarifa de medicamento contractual
        """
        filtro = {
            'contrato_numero': contrato_numero,
            'estado': 'ACTIVO',
            'vigencia_desde__lte': fecha_servicio,
            'vigencia_hasta__gte': fecha_servicio
        }
        
        if tipo_codigo == 'CUM':
            filtro['codigo_cum'] = codigo
        else:
            filtro['codigo_ium'] = codigo
        
        try:
            tarifa = TarifariosMedicamentos.objects.get(**filtro)
            resultado['tarifa_valida'] = True
            resultado['valor_contractual'] = tarifa.valor_unitario
            resultado['diferencia_tarifa'] = valor_facturado - tarifa.valor_unitario
            
            if resultado['diferencia_tarifa'] == 0:
                resultado['observaciones'].append('Tarifa contractual correcta')
            else:
                resultado['observaciones'].append(f'Diferencia tarifaria: ${resultado["diferencia_tarifa"]}')
                
        except TarifariosMedicamentos.DoesNotExist:
            resultado['observaciones'].append(f'Tarifa {tipo_codigo} no encontrada en contrato')
    
    def _calcular_resumen_financiero(self, datos_cuenta: Dict, glosas: List, devoluciones: List) -> Dict:
        """
        Calcular resumen financiero de la validación
        """
        valor_total = Decimal(str(datos_cuenta.get('valor_total', 0)))
        valor_glosas = sum(Decimal(str(g.get('valor_glosado', 0))) for g in glosas)
        valor_devoluciones = sum(Decimal(str(d.get('valor_afectado', 0))) for d in devoluciones)
        
        return {
            'valor_total_facturado': valor_total,
            'valor_total_glosas': valor_glosas,
            'valor_total_devoluciones': valor_devoluciones,
            'valor_neto_pagable': valor_total - valor_glosas - valor_devoluciones
        }


# Instancia global del motor de validación
validation_engine = ValidationEngine()