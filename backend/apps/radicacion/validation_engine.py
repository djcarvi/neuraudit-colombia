# -*- coding: utf-8 -*-
# apps/radicacion/validation_engine.py

"""
Motor de Validación Automática - NeurAudit Colombia
Validaciones según Resolución 2284 de 2023 del MinSalud

Implementa las validaciones obligatorias para:
- Estructura RIPS JSON oficial
- Factura electrónica XML DIAN
- Validación BDUA de usuarios
- Verificación de prestadores habilitados
- Cumplimiento de plazos legales (22 días hábiles)
"""

import json
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Any, Tuple
import re
import logging

from django.utils import timezone
from django.conf import settings

from apps.catalogs.models import (
    BDUAAfiliados, Prestadores, CatalogoCUPSOficial,
    CatalogoCUMOficial, CatalogoIUMOficial
)
from .codigos_oficiales_resolucion_2284 import CAUSALES_DEVOLUCION_OFICIALES

logger = logging.getLogger('apps.radicacion.validation')


class ValidationEngine:
    """
    Motor de validación automática para radicaciones
    Cumple estrictamente con Resolución 2284 de 2023
    """
    
    def __init__(self):
        self.validation_errors = []
        self.validation_warnings = []
        self.statistics = {
            'total_usuarios': 0,
            'total_servicios': 0,
            'valor_total_validado': Decimal('0.00'),
            'usuarios_sin_derechos': 0,
            'codigos_cups_invalidos': 0,
            'medicamentos_invalidos': 0
        }
    
    def validate_complete_radicacion(self, radicacion_data: Dict) -> Dict[str, Any]:
        """
        Validación completa de una radicación según Resolución 2284
        
        Args:
            radicacion_data: Datos de la radicación incluyendo archivos
            
        Returns:
            Dict con resultado de validación y causales de devolución
        """
        logger.info(f"Iniciando validación completa de radicación")
        
        validation_result = {
            'es_valida': True,
            'causales_devolucion': [],
            'errores_criticos': [],
            'advertencias': [],
            'estadisticas': {},
            'requiere_devolucion': False,
            'codigo_devolucion_principal': None,
            'tiempo_limite_cumplido': True
        }
        
        try:
            # 1. Validar plazos legales (22 días hábiles)
            self._validate_legal_deadlines(radicacion_data, validation_result)
            
            # 2. Validar prestador habilitado
            self._validate_prestador_habilitado(radicacion_data, validation_result)
            
            # 3. Validar estructura RIPS JSON
            if 'rips_json' in radicacion_data:
                self._validate_rips_structure(radicacion_data['rips_json'], validation_result)
            
            # 4. Validar factura electrónica XML
            if 'factura_xml' in radicacion_data:
                self._validate_factura_electronica(radicacion_data['factura_xml'], validation_result)
            
            # 5. Validar usuarios BDUA
            if 'rips_json' in radicacion_data:
                self._validate_usuarios_bdua(radicacion_data['rips_json'], validation_result)
            
            # 6. Validar códigos CUPS/CUM/IUM
            if 'rips_json' in radicacion_data:
                self._validate_medical_codes(radicacion_data['rips_json'], validation_result)
            
            # 7. Validar consistencia factura vs RIPS
            if 'factura_xml' in radicacion_data and 'rips_json' in radicacion_data:
                self._validate_factura_rips_consistency(
                    radicacion_data['factura_xml'], 
                    radicacion_data['rips_json'], 
                    validation_result
                )
            
            # 8. Aplicar reglas específicas de devolución
            self._apply_devolution_rules(validation_result)
            
            # 9. Generar estadísticas finales
            validation_result['estadisticas'] = self.statistics
            
            logger.info(f"Validación completada. Válida: {validation_result['es_valida']}")
            
        except Exception as e:
            logger.error(f"Error durante validación: {str(e)}")
            validation_result['es_valida'] = False
            validation_result['errores_criticos'].append(f"Error interno de validación: {str(e)}")
            
        return validation_result
    
    def _validate_legal_deadlines(self, radicacion_data: Dict, result: Dict):
        """Valida cumplimiento de plazos legales según Art. 8 Resolución 2284"""
        try:
            fecha_expedicion = radicacion_data.get('fecha_expedicion_factura')
            fecha_radicacion = radicacion_data.get('fecha_radicacion', timezone.now())
            
            if fecha_expedicion:
                if isinstance(fecha_expedicion, str):
                    fecha_expedicion = datetime.strptime(fecha_expedicion, '%Y-%m-%d').date()
                
                # Calcular días hábiles (sin fines de semana)
                dias_transcurridos = self._calculate_business_days(fecha_expedicion, fecha_radicacion.date())
                
                if dias_transcurridos > 22:
                    result['es_valida'] = False
                    result['requiere_devolucion'] = True
                    result['codigo_devolucion_principal'] = 'DE56'
                    result['causales_devolucion'].append({
                        'codigo': 'DE56',
                        'descripcion': CODIGOS_DEVOLUCION['DE56'],
                        'detalle': f'Radicación fuera de plazo: {dias_transcurridos} días hábiles'
                    })
                    result['tiempo_limite_cumplido'] = False
                elif dias_transcurridos > 20:
                    result['advertencias'].append({
                        'tipo': 'PLAZO_CERCANO',
                        'mensaje': f'Radicación cerca del límite: {dias_transcurridos}/22 días hábiles'
                    })
                    
        except Exception as e:
            logger.error(f"Error validando plazos legales: {str(e)}")
            result['advertencias'].append({
                'tipo': 'ERROR_VALIDACION_PLAZO',
                'mensaje': 'No se pudo validar el cumplimiento de plazos'
            })
    
    def _validate_prestador_habilitado(self, radicacion_data: Dict, result: Dict):
        """Valida que el prestador esté habilitado y haga parte de la red"""
        try:
            nit_prestador = radicacion_data.get('nit_prestador')
            
            if not nit_prestador:
                result['errores_criticos'].append("NIT del prestador no proporcionado")
                return
            
            try:
                prestador = Prestadores.objects.get(nit=nit_prestador, estado='ACTIVO')
                
                # Verificar habilitación vigente
                if prestador.fecha_habilitacion and prestador.fecha_habilitacion > timezone.now().date():
                    result['es_valida'] = False
                    result['requiere_devolucion'] = True
                    result['codigo_devolucion_principal'] = 'DE44'
                    result['causales_devolucion'].append({
                        'codigo': 'DE44',
                        'descripcion': CODIGOS_DEVOLUCION['DE44'],
                        'detalle': f'Prestador {nit_prestador} no está habilitado'
                    })
                
            except Prestadores.DoesNotExist:
                result['es_valida'] = False
                result['requiere_devolucion'] = True
                result['codigo_devolucion_principal'] = 'DE44'
                result['causales_devolucion'].append({
                    'codigo': 'DE44',
                    'descripcion': CODIGOS_DEVOLUCION['DE44'],
                    'detalle': f'Prestador {nit_prestador} no hace parte de la red integral'
                })
                
        except Exception as e:
            logger.error(f"Error validando prestador: {str(e)}")
            result['errores_criticos'].append(f"Error validando prestador: {str(e)}")
    
    def _validate_rips_structure(self, rips_content: str, result: Dict):
        """Valida estructura oficial RIPS JSON según MinSalud"""
        try:
            if isinstance(rips_content, str):
                rips_data = json.loads(rips_content)
            else:
                rips_data = rips_content
            
            # Validar estructura básica transacción -> usuarios -> servicios
            if 'numDocumentoIdObligado' not in rips_data:
                result['errores_criticos'].append("RIPS: Falta numDocumentoIdObligado en transacción")
                result['es_valida'] = False
                return
            
            if 'numFactura' not in rips_data:
                result['errores_criticos'].append("RIPS: Falta numFactura en transacción")
                result['es_valida'] = False
                return
            
            usuarios = rips_data.get('usuarios', [])
            if not usuarios:
                result['errores_criticos'].append("RIPS: No se encontraron usuarios en la transacción")
                result['es_valida'] = False
                return
            
            total_servicios = 0
            for usuario in usuarios:
                # Validar estructura de usuario
                campos_requeridos = [
                    'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                    'fechaNacimiento', 'codSexo'
                ]
                
                for campo in campos_requeridos:
                    if campo not in usuario:
                        result['errores_criticos'].append(f"RIPS Usuario: Falta campo {campo}")
                        result['es_valida'] = False
                
                # Contar servicios por tipo
                servicios = usuario.get('servicios', {})
                total_servicios += sum([
                    len(servicios.get('consultas', [])),
                    len(servicios.get('procedimientos', [])),
                    len(servicios.get('urgencias', [])),
                    len(servicios.get('hospitalizacion', [])),
                    len(servicios.get('medicamentos', [])),
                    len(servicios.get('otrosServicios', [])),
                    len(servicios.get('recienNacidos', []))
                ])
            
            self.statistics['total_usuarios'] = len(usuarios)
            self.statistics['total_servicios'] = total_servicios
            
            # Validar que haya al menos un servicio
            if total_servicios == 0:
                result['errores_criticos'].append("RIPS: No se encontraron servicios en ningún usuario")
                result['es_valida'] = False
            
        except json.JSONDecodeError as e:
            result['errores_criticos'].append(f"RIPS: Formato JSON inválido: {str(e)}")
            result['es_valida'] = False
        except Exception as e:
            logger.error(f"Error validando estructura RIPS: {str(e)}")
            result['errores_criticos'].append(f"Error validando RIPS: {str(e)}")
    
    def _validate_factura_electronica(self, factura_xml: str, result: Dict):
        """Valida estructura de factura electrónica XML DIAN"""
        try:
            root = ET.fromstring(factura_xml)
            
            # Buscar namespace específico de factura electrónica DIAN
            namespaces = {
                'fe': 'http://www.dian.gov.co/contratos/facturaelectronica/v1',
                'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
            }
            
            # Validar elementos obligatorios según DIAN
            elementos_obligatorios = [
                './/cbc:ID',  # Número de factura
                './/cbc:IssueDate',  # Fecha de expedición
                './/cac:InvoiceLine',  # Líneas de factura
                './/cac:LegalMonetaryTotal/cbc:LineExtensionAmount'  # Valor total
            ]
            
            for elemento in elementos_obligatorios:
                if root.find(elemento, namespaces) is None:
                    result['errores_criticos'].append(f"Factura XML: Falta elemento obligatorio {elemento}")
                    result['es_valida'] = False
            
            # Validar CUFE (Código Único de Facturación Electrónica)
            cufe = root.find('.//cbc:UUID', namespaces)
            if cufe is None:
                result['advertencias'].append({
                    'tipo': 'CUFE_FALTANTE',
                    'mensaje': 'Factura XML no contiene CUFE válido'
                })
            
        except ET.ParseError as e:
            result['errores_criticos'].append(f"Factura XML: Formato XML inválido: {str(e)}")
            result['es_valida'] = False
        except Exception as e:
            logger.error(f"Error validando factura electrónica: {str(e)}")
            result['errores_criticos'].append(f"Error validando factura XML: {str(e)}")
    
    def _validate_usuarios_bdua(self, rips_content: str, result: Dict):
        """Valida usuarios contra BDUA para verificar derechos"""
        try:
            if isinstance(rips_content, str):
                rips_data = json.loads(rips_content)
            else:
                rips_data = rips_content
            
            usuarios = rips_data.get('usuarios', [])
            usuarios_sin_derechos = 0
            
            for usuario in usuarios:
                tipo_doc = usuario.get('tipoDocumentoIdentificacion')
                num_doc = usuario.get('numDocumentoIdentificacion')
                fecha_atencion = usuario.get('fechaConsulta') or usuario.get('fechaAtencion')
                
                if not tipo_doc or not num_doc:
                    continue
                
                try:
                    # Buscar usuario en BDUA
                    afiliado = BDUAAfiliados.objects.get(
                        usuario_tipo_documento=tipo_doc,
                        usuario_numero_documento=num_doc,
                        codigo_eps='23678'  # EPS Familiar
                    )
                    
                    # Validar derechos en fecha de atención
                    if fecha_atencion:
                        validacion_derechos = afiliado.validar_derechos_en_fecha(fecha_atencion)
                        
                        if not validacion_derechos['valido']:
                            usuarios_sin_derechos += 1
                            result['causales_devolucion'].append({
                                'codigo': validacion_derechos['causal_devolucion'],
                                'descripcion': CODIGOS_DEVOLUCION.get(
                                    validacion_derechos['causal_devolucion'], 
                                    'Usuario sin derechos válidos'
                                ),
                                'detalle': f"Usuario {num_doc}: {validacion_derechos['mensaje']}",
                                'usuario_afectado': num_doc
                            })
                    
                except BDUAAfiliados.DoesNotExist:
                    usuarios_sin_derechos += 1
                    result['causales_devolucion'].append({
                        'codigo': 'DE16',
                        'descripcion': CODIGOS_DEVOLUCION['DE16'],
                        'detalle': f'Usuario {num_doc} no encontrado en BDUA de EPS Familiar',
                        'usuario_afectado': num_doc
                    })
            
            self.statistics['usuarios_sin_derechos'] = usuarios_sin_derechos
            
            # Si más del 10% de usuarios sin derechos, devolver completa
            if len(usuarios) > 0 and (usuarios_sin_derechos / len(usuarios)) > 0.1:
                result['es_valida'] = False
                result['requiere_devolucion'] = True
                result['codigo_devolucion_principal'] = 'DE16'
                
        except Exception as e:
            logger.error(f"Error validando usuarios BDUA: {str(e)}")
            result['errores_criticos'].append(f"Error validando BDUA: {str(e)}")
    
    def _validate_medical_codes(self, rips_content: str, result: Dict):
        """Valida códigos CUPS, CUM, IUM contra catálogos oficiales"""
        try:
            if isinstance(rips_content, str):
                rips_data = json.loads(rips_content)
            else:
                rips_data = rips_content
            
            codigos_cups_invalidos = 0
            medicamentos_invalidos = 0
            
            usuarios = rips_data.get('usuarios', [])
            
            for usuario in usuarios:
                servicios = usuario.get('servicios', {})
                
                # Validar códigos CUPS en consultas y procedimientos
                for consulta in servicios.get('consultas', []):
                    codigo_cups = consulta.get('codConsulta')
                    if codigo_cups and not self._validate_cups_code(codigo_cups):
                        codigos_cups_invalidos += 1
                        result['advertencias'].append({
                            'tipo': 'CODIGO_CUPS_INVALIDO',
                            'mensaje': f'Código CUPS {codigo_cups} no encontrado en catálogo oficial',
                            'usuario': usuario.get('numDocumentoIdentificacion')
                        })
                
                for procedimiento in servicios.get('procedimientos', []):
                    codigo_cups = procedimiento.get('codProcedimiento')
                    if codigo_cups and not self._validate_cups_code(codigo_cups):
                        codigos_cups_invalidos += 1
                
                # Validar códigos CUM/IUM en medicamentos
                for medicamento in servicios.get('medicamentos', []):
                    codigo_cum = medicamento.get('codMedicamento')
                    tipo_codigo = medicamento.get('tipoMedicamentoCodigo', 'CUM')
                    
                    if codigo_cum:
                        if tipo_codigo == 'CUM' and not self._validate_cum_code(codigo_cum):
                            medicamentos_invalidos += 1
                        elif tipo_codigo == 'IUM' and not self._validate_ium_code(codigo_cum):
                            medicamentos_invalidos += 1
            
            self.statistics['codigos_cups_invalidos'] = codigos_cups_invalidos
            self.statistics['medicamentos_invalidos'] = medicamentos_invalidos
            
        except Exception as e:
            logger.error(f"Error validando códigos médicos: {str(e)}")
            result['errores_criticos'].append(f"Error validando códigos: {str(e)}")
    
    def _validate_factura_rips_consistency(self, factura_xml: str, rips_content: str, result: Dict):
        """Valida consistencia entre valores de factura y RIPS"""
        try:
            # Parsear factura XML
            root = ET.fromstring(factura_xml)
            namespaces = {
                'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
            }
            
            # Obtener valor total de factura
            valor_factura_elem = root.find('.//cac:LegalMonetaryTotal/cbc:LineExtensionAmount', namespaces)
            if valor_factura_elem is not None:
                valor_factura = Decimal(valor_factura_elem.text)
            else:
                result['advertencias'].append({
                    'tipo': 'VALOR_FACTURA_NO_ENCONTRADO',
                    'mensaje': 'No se pudo extraer valor total de la factura XML'
                })
                return
            
            # Calcular valor total RIPS
            if isinstance(rips_content, str):
                rips_data = json.loads(rips_content)
            else:
                rips_data = rips_content
            
            valor_rips_total = Decimal('0.00')
            usuarios = rips_data.get('usuarios', [])
            
            for usuario in usuarios:
                servicios = usuario.get('servicios', {})
                
                # Sumar valores de todos los tipos de servicios
                for tipo_servicio in ['consultas', 'procedimientos', 'urgencias', 'hospitalizacion', 'medicamentos', 'otrosServicios']:
                    for servicio in servicios.get(tipo_servicio, []):
                        vr_servicio = servicio.get('vrServicio', 0)
                        if vr_servicio:
                            valor_rips_total += Decimal(str(vr_servicio))
            
            self.statistics['valor_total_validado'] = valor_rips_total
            
            # Validar consistencia con tolerancia del 1%
            diferencia = abs(valor_factura - valor_rips_total)
            tolerancia = valor_factura * Decimal('0.01')
            
            if diferencia > tolerancia:
                result['advertencias'].append({
                    'tipo': 'INCONSISTENCIA_VALORES',
                    'mensaje': f'Diferencia entre factura (${valor_factura}) y RIPS (${valor_rips_total}): ${diferencia}',
                    'requiere_verificacion': True
                })
                
        except Exception as e:
            logger.error(f"Error validando consistencia factura-RIPS: {str(e)}")
            result['advertencias'].append({
                'tipo': 'ERROR_CONSISTENCIA',
                'mensaje': f'No se pudo validar consistencia: {str(e)}'
            })
    
    def _apply_devolution_rules(self, result: Dict):
        """Aplica reglas específicas de devolución según Resolución 2284"""
        
        # Si hay causales críticas, marcar para devolución
        causales_criticas = ['DE16', 'DE44', 'DE50', 'DE56']
        
        for causal in result['causales_devolucion']:
            if causal['codigo'] in causales_criticas:
                result['requiere_devolucion'] = True
                if not result['codigo_devolucion_principal']:
                    result['codigo_devolucion_principal'] = causal['codigo']
                break
        
        # Reglas adicionales según estadísticas
        stats = self.statistics
        
        if stats['usuarios_sin_derechos'] > 0 and stats['total_usuarios'] > 0:
            porcentaje_sin_derechos = (stats['usuarios_sin_derechos'] / stats['total_usuarios']) * 100
            
            if porcentaje_sin_derechos > 50:  # Si más del 50% sin derechos
                result['requiere_devolucion'] = True
                result['codigo_devolucion_principal'] = 'DE16'
    
    def _validate_cups_code(self, codigo: str) -> bool:
        """Valida código CUPS contra catálogo oficial"""
        try:
            return CatalogoCUPSOficial.objects.filter(
                codigo=codigo, 
                habilitado=True
            ).exists()
        except Exception:
            return False
    
    def _validate_cum_code(self, codigo: str) -> bool:
        """Valida código CUM contra catálogo oficial"""
        try:
            return CatalogoCUMOficial.objects.filter(
                codigo=codigo, 
                habilitado=True
            ).exists()
        except Exception:
            return False
    
    def _validate_ium_code(self, codigo: str) -> bool:
        """Valida código IUM contra catálogo oficial"""
        try:
            return CatalogoIUMOficial.objects.filter(
                codigo=codigo, 
                habilitado=True
            ).exists()
        except Exception:
            return False
    
    def _calculate_business_days(self, start_date, end_date) -> int:
        """Calcula días hábiles entre dos fechas (excluyendo fines de semana)"""
        business_days = 0
        current_date = start_date
        
        while current_date < end_date:
            if current_date.weekday() < 5:  # Lunes=0, Viernes=4
                business_days += 1
            current_date += timedelta(days=1)
            
        return business_days


class RIPSValidator:
    """Validador específico para estructura RIPS JSON"""
    
    @staticmethod
    def validate_rips_json_structure(rips_data: Dict) -> Dict[str, Any]:
        """
        Valida estructura RIPS JSON según formato oficial MinSalud
        
        Returns:
            Dict con resultado de validación
        """
        errors = []
        warnings = []
        
        # Validar estructura raíz
        required_root_fields = [
            'numDocumentoIdObligado',
            'numFactura', 
            'usuarios'
        ]
        
        for field in required_root_fields:
            if field not in rips_data:
                errors.append(f"Campo requerido faltante en raíz: {field}")
        
        # Validar usuarios
        usuarios = rips_data.get('usuarios', [])
        if not usuarios:
            errors.append("No se encontraron usuarios en el RIPS")
        
        for i, usuario in enumerate(usuarios):
            errors.extend(RIPSValidator._validate_usuario_structure(usuario, i))
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings,
            'statistics': {
                'total_usuarios': len(usuarios),
                'total_servicios': sum([
                    len(u.get('servicios', {}).get('consultas', [])) +
                    len(u.get('servicios', {}).get('procedimientos', [])) +
                    len(u.get('servicios', {}).get('urgencias', [])) +
                    len(u.get('servicios', {}).get('hospitalizacion', [])) +
                    len(u.get('servicios', {}).get('medicamentos', [])) +
                    len(u.get('servicios', {}).get('otrosServicios', [])) +
                    len(u.get('servicios', {}).get('recienNacidos', []))
                    for u in usuarios
                ])
            }
        }
    
    @staticmethod
    def _validate_usuario_structure(usuario: Dict, index: int) -> List[str]:
        """Valida estructura de un usuario individual"""
        errors = []
        
        required_usuario_fields = [
            'tipoDocumentoIdentificacion',
            'numDocumentoIdentificacion',
            'fechaNacimiento',
            'codSexo'
        ]
        
        for field in required_usuario_fields:
            if field not in usuario:
                errors.append(f"Usuario {index}: Campo requerido faltante: {field}")
        
        # Validar servicios si existen
        servicios = usuario.get('servicios', {})
        if servicios:
            for tipo_servicio in ['consultas', 'procedimientos', 'urgencias', 'hospitalizacion', 'medicamentos', 'otrosServicios', 'recienNacidos']:
                if tipo_servicio in servicios:
                    services_list = servicios[tipo_servicio]
                    if not isinstance(services_list, list):
                        errors.append(f"Usuario {index}: {tipo_servicio} debe ser una lista")
        
        return errors