# -*- coding: utf-8 -*-
# apps/radicacion/document_parser.py

"""
Parser de Documentos - NeurAudit Colombia
Extrae información automáticamente de archivos XML (facturas) y JSON (RIPS)
según Resolución 2284 de 2023

Funcionalidades:
- Extracción automática de datos de factura electrónica XML DIAN
- Extracción automática de datos de RIPS JSON MinSalud
- Validación de estructura y contenido
- Generación de resumen de datos extraídos
"""

import json
import xml.etree.ElementTree as ET
from datetime import datetime
from decimal import Decimal
from typing import Dict, List, Any, Optional
import re
import logging
from .cross_validation_service import CrossValidationService

logger = logging.getLogger('apps.radicacion.parser')


class DocumentParser:
    """Parser principal para documentos de radicación"""
    
    @staticmethod
    def _extract_sector_salud_from_attached(root) -> Dict[str, Any]:
        """
        Extrae datos del sector salud específicamente de un AttachedDocument
        """
        sector_salud = {}
        
        try:
            # Buscar CustomTagGeneral en las extensiones del AttachedDocument
            custom_tag = root.find('.//CustomTagGeneral')
            if custom_tag is not None:
                logger.info("🏥 CustomTagGeneral encontrado en AttachedDocument")
                
                # Buscar dentro de Interoperabilidad -> Group -> Collection -> AdditionalInformation
                additional_infos = custom_tag.findall('.//AdditionalInformation')
                
                for info in additional_infos:
                    name_elem = info.find('Name')
                    value_elem = info.find('Value')
                    
                    if name_elem is not None and value_elem is not None:
                        name = name_elem.text
                        value = value_elem.text if value_elem.text else ''
                        
                        # También extraer atributos de Value si existen
                        value_attrs = value_elem.attrib
                        
                        logger.info(f"🏥 AdditionalInformation - {name}: {value}")
                        
                        if name == 'CODIGO_PRESTADOR':
                            sector_salud['codigo_prestador'] = value
                        elif name == 'MODALIDAD_PAGO':
                            sector_salud['modalidad_pago'] = value
                            if 'schemeID' in value_attrs:
                                sector_salud['modalidad_pago_codigo'] = value_attrs['schemeID']
                        elif name == 'COBERTURA_PLAN_BENEFICIOS':
                            sector_salud['cobertura_plan_beneficios'] = value
                            if 'schemeID' in value_attrs:
                                sector_salud['cobertura_codigo'] = value_attrs['schemeID']
                        elif name == 'NUMERO_CONTRATO':
                            sector_salud['numero_contrato'] = value
                        elif name == 'NUMERO_POLIZA':
                            sector_salud['numero_poliza'] = value
            
        except Exception as e:
            logger.error(f"Error extrayendo sector salud de AttachedDocument: {e}")
        
        return sector_salud
    
    @staticmethod
    def _extract_sector_salud_from_invoice(inner_root) -> Dict[str, Any]:
        """
        Extrae datos del sector salud específicamente de una factura interna (Invoice)
        """
        sector_salud = {}
        
        try:
            # Buscar CustomTagGeneral en las extensiones de la factura interna
            custom_tag = inner_root.find('.//CustomTagGeneral')
            if custom_tag is not None:
                logger.info("🏥 CustomTagGeneral encontrado en factura interna")
                
                # Buscar dentro de Interoperabilidad -> Group -> Collection -> AdditionalInformation
                additional_infos = custom_tag.findall('.//AdditionalInformation')
                logger.info(f"🏥 AdditionalInformation encontrados: {len(additional_infos)}")
                
                for info in additional_infos:
                    name_elem = info.find('Name')
                    value_elem = info.find('Value')
                    
                    if name_elem is not None and value_elem is not None:
                        name = name_elem.text
                        value = value_elem.text if value_elem.text else ''
                        
                        # También extraer atributos de Value si existen
                        value_attrs = value_elem.attrib
                        
                        logger.info(f"🏥 AdditionalInformation - {name}: {value}")
                        
                        if name == 'CODIGO_PRESTADOR':
                            sector_salud['codigo_prestador'] = value
                        elif name == 'MODALIDAD_PAGO':
                            sector_salud['modalidad_pago'] = value
                            if 'schemeID' in value_attrs:
                                sector_salud['modalidad_pago_codigo'] = value_attrs['schemeID']
                        elif name == 'COBERTURA_PLAN_BENEFICIOS':
                            sector_salud['cobertura_plan_beneficios'] = value
                            if 'schemeID' in value_attrs:
                                sector_salud['cobertura_codigo'] = value_attrs['schemeID']
                        elif name == 'NUMERO_CONTRATO':
                            sector_salud['numero_contrato'] = value
                        elif name == 'NUMERO_POLIZA':
                            sector_salud['numero_poliza'] = value
            else:
                logger.warning("🏥 CustomTagGeneral NO encontrado en factura interna")
            
        except Exception as e:
            logger.error(f"Error extrayendo sector salud de factura interna: {e}")
        
        return sector_salud
    
    @staticmethod
    def parse_factura_xml(xml_content: str) -> Dict[str, Any]:
        """
        Extrae información de factura electrónica XML DIAN
        Maneja tanto XMLs directos como AttachedDocuments con CDATA
        
        Args:
            xml_content: Contenido del archivo XML
            
        Returns:
            Dict con información extraída
        """
        result = {
            'success': True,
            'errors': [],
            'data': {},
            'warnings': []
        }
        
        try:
            root = ET.fromstring(xml_content)
            
            # Debug: Log del tipo de documento encontrado
            logger.info(f"🔍 TIPO DE DOCUMENTO XML: {root.tag}")
            
            # Verificar si es un AttachedDocument con factura en CDATA
            if root.tag.endswith('AttachedDocument') or 'AttachedDocument' in root.tag:
                logger.info("🔍 DETECTADO AttachedDocument - Extrayendo factura desde CDATA")
                
                # PRIMERO extraer datos del sector salud del AttachedDocument (antes del CDATA)
                sector_salud_data = DocumentParser._extract_sector_salud_from_attached(root)
                logger.info(f"🏥 Sector salud desde AttachedDocument: {sector_salud_data}")
                
                # Buscar el contenido CDATA dentro de cbc:Description
                description_elements = root.findall('.//cbc:Description', {
                    'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
                })
                
                # También buscar sin namespace como fallback
                if not description_elements:
                    description_elements = root.findall('.//Description')
                
                logger.info(f"🔍 CDATA Description elementos encontrados: {len(description_elements)}")
                
                for desc_elem in description_elements:
                    if desc_elem.text and desc_elem.text.strip().startswith('<?xml'):
                        logger.info("✅ ENCONTRADA factura XML en CDATA - Procesando...")
                        # Extraer y parsear la factura real desde CDATA
                        invoice_xml = desc_elem.text.strip()
                        logger.info(f"📄 Factura extraída de CDATA: {len(invoice_xml)} caracteres")
                        
                        # Parsear recursivamente la factura extraída
                        inner_result = DocumentParser.parse_factura_xml(invoice_xml)
                        
                        # Combinar datos del sector salud del AttachedDocument con los de la factura interna
                        if inner_result.get('success'):
                            # Los datos del sector salud ya deberían estar en inner_result['data']['sector_salud']
                            # desde la llamada recursiva, pero si también hay en AttachedDocument, combinar
                            if sector_salud_data:
                                inner_result['data']['sector_salud'].update(sector_salud_data)
                                logger.info(f"🏥 Datos del sector salud combinados: {inner_result['data']['sector_salud']}")
                            else:
                                logger.info(f"🏥 Datos del sector salud desde factura interna: {inner_result['data']['sector_salud']}")
                        
                        return inner_result
                
                # Si no encontramos CDATA válido, intentar parsear como XML normal
                logger.warning("⚠️ No se encontró factura válida en CDATA - Procesando como XML normal")
            else:
                logger.info("🔍 DOCUMENTO DIRECTO (NO AttachedDocument) - Procesando como factura normal")
            
            # Procesamiento normal del XML
            
            # Namespaces comunes de facturas DIAN
            namespaces = {
                'fe': 'http://www.dian.gov.co/contratos/facturaelectronica/v1',
                'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                'ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2'
            }
            
            # Auto-detectar namespaces del documento
            detected_namespaces = {}
            for elem in root.iter():
                if elem.tag.startswith('{'):
                    ns = elem.tag[1:elem.tag.index('}')]
                    tag_name = elem.tag.split('}')[1] if '}' in elem.tag else elem.tag
                    
                    if 'CommonAggregateComponents' in ns and 'cac' not in detected_namespaces:
                        detected_namespaces['cac'] = ns
                        namespaces['cac'] = ns
                    elif 'CommonBasicComponents' in ns and 'cbc' not in detected_namespaces:
                        detected_namespaces['cbc'] = ns
                        namespaces['cbc'] = ns
            
            # Log namespaces detectados para debug
            logger.info(f"Namespaces detectados en XML: {detected_namespaces}")
            
            # Intentar sin namespaces si no se detectan
            use_namespaces = namespaces if detected_namespaces else {}
            
            # Extraer información básica de la factura
            data = result['data']
            
            # Número de factura
            numero_factura = DocumentParser._get_xml_text(
                root, './/cbc:ID', namespaces
            )
            if numero_factura:
                data['numero_factura'] = numero_factura
            else:
                result['errors'].append("No se encontró número de factura")
            
            # Fecha de expedición
            fecha_expedicion = DocumentParser._get_xml_text(
                root, './/cbc:IssueDate', namespaces
            )
            if fecha_expedicion:
                try:
                    data['fecha_expedicion'] = datetime.strptime(fecha_expedicion, '%Y-%m-%d').date()
                except ValueError:
                    result['warnings'].append(f"Formato de fecha inválido: {fecha_expedicion}")
                    data['fecha_expedicion'] = fecha_expedicion
            
            # CUFE (Código Único de Facturación Electrónica)
            cufe = DocumentParser._get_xml_text(
                root, './/cbc:UUID', namespaces
            )
            if cufe:
                data['cufe'] = cufe
            
            # Información del prestador (supplier)
            prestador_nit = DocumentParser._get_xml_text(
                root, './/cac:AccountingSupplierParty//cbc:CompanyID', namespaces
            )
            if prestador_nit:
                data['prestador_nit'] = prestador_nit.replace('-', '').replace('.', '')
            
            # Múltiples selectores para razón social con logging
            def extract_prestador_nombre():
                selectors = [
                    './/cac:AccountingSupplierParty//cbc:RegistrationName',
                    './/cac:AccountingSupplierParty//cac:Party//cac:PartyName//cbc:Name', 
                    './/cac:AccountingSupplierParty//cac:Party//cac:PartyLegalEntity//cbc:RegistrationName',
                    './/cbc:RegistrationName',
                    './/RegistrationName',  # Sin namespace
                    './/PartyName//Name'    # Sin namespace
                ]
                
                for selector in selectors:
                    value = DocumentParser._get_xml_text(root, selector, use_namespaces)
                    if not value and use_namespaces:
                        # Intentar sin namespaces
                        simple_selector = selector.replace('cac:', '').replace('cbc:', '')
                        value = DocumentParser._get_xml_text(root, simple_selector, {})
                    
                    if value:
                        logger.info(f"Razón social encontrada con selector {selector}: {value}")
                        return value.strip()
                
                logger.warning("No se pudo extraer razón social con ningún selector")
                return None
            
            prestador_nombre = extract_prestador_nombre()
            if prestador_nombre:
                data['prestador_nombre'] = prestador_nombre
            
            # Información del pagador (customer) - EPS
            eps_nit = DocumentParser._get_xml_text(
                root, './/cac:AccountingCustomerParty//cbc:CompanyID', namespaces
            )
            if eps_nit:
                data['eps_nit'] = eps_nit.replace('-', '').replace('.', '')
            
            eps_nombre = DocumentParser._get_xml_text(
                root, './/cac:AccountingCustomerParty//cbc:RegistrationName', namespaces
            )
            if eps_nombre:
                data['eps_nombre'] = eps_nombre
            
            # Valores monetarios completos según estructura DIAN
            def extract_monetary_value(xpath_expr):
                logger.error(f"🔍 BUSCANDO: {xpath_expr}")
                logger.error(f"🔍 USE_NAMESPACES: {use_namespaces}")
                
                # Intentar con namespaces detectados
                value = DocumentParser._get_xml_text(root, xpath_expr, use_namespaces)
                logger.error(f"🔍 RESULTADO con namespaces: {value}")
                
                # Si no encuentra con namespaces, intentar sin namespaces
                if not value and use_namespaces:
                    xpath_simple = xpath_expr.replace('cac:', '').replace('cbc:', '').replace('//', '//')
                    value = DocumentParser._get_xml_text(root, xpath_simple, {})
                    logger.error(f"🔍 RESULTADO sin namespaces ({xpath_simple}): {value}")
                
                # Si aún no encuentra, buscar por nombre de tag solamente
                if not value:
                    tag_name = xpath_expr.split('/')[-1].replace('cbc:', '').replace('cac:', '')
                    elements = root.findall(f'.//{tag_name}')
                    logger.error(f"🔍 BÚSQUEDA directa {tag_name}: {len(elements)} elementos")
                    if elements:
                        value = elements[0].text
                        logger.error(f"🔍 VALOR directo {tag_name}: {value}")
                
                if value:
                    try:
                        clean_value = str(value).replace(',', '').replace(' ', '').strip()
                        logger.error(f"✅ EXTRAÍDO {xpath_expr}: {value} -> {clean_value}")
                        return Decimal(clean_value)
                    except Exception as e:
                        logger.error(f"❌ Error convirtiendo valor {value}: {e}")
                        return None
                else:
                    logger.error(f"❌ NO ENCONTRADO: {xpath_expr}")
                return None
            
            # Valor bruto (sin impuestos)
            data['valor_bruto'] = extract_monetary_value('.//cac:LegalMonetaryTotal/cbc:LineExtensionAmount')
            
            # Valor sin impuestos
            data['valor_sin_impuestos'] = extract_monetary_value('.//cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount')
            
            # Valor con impuestos incluidos
            data['valor_con_impuestos'] = extract_monetary_value('.//cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount')
            
            # Valor prepagado (anticipos, copagos)
            data['valor_prepagado'] = extract_monetary_value('.//cac:LegalMonetaryTotal/cbc:PrepaidAmount')
            
            # Valor final a pagar (PayableAmount) - ESTE ES EL VALOR REAL
            data['valor_total'] = extract_monetary_value('.//cac:LegalMonetaryTotal/cbc:PayableAmount')
            
            # Si no encuentra PayableAmount, usar TaxInclusiveAmount como fallback
            if not data['valor_total']:
                data['valor_total'] = (
                    extract_monetary_value('.//cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount') or
                    extract_monetary_value('.//cbc:PayableAmount') or 
                    extract_monetary_value('.//cbc:TaxInclusiveAmount')
                )
            
            # Información adicional de totales - SIEMPRE generar resumen
            data['resumen_monetario'] = {
                'valor_bruto': float(data.get('valor_bruto') or 0),
                'valor_sin_impuestos': float(data.get('valor_sin_impuestos') or 0), 
                'valor_con_impuestos': float(data.get('valor_con_impuestos') or 0),
                'valor_prepagado': float(data.get('valor_prepagado') or 0),
                'valor_final_pagar': float(data.get('valor_total') or 0),
                'extraction_success': bool(data.get('valor_total')),
                'total_fields_found': sum(1 for v in [
                    data.get('valor_bruto'), 
                    data.get('valor_sin_impuestos'),
                    data.get('valor_con_impuestos'),
                    data.get('valor_prepagado'),
                    data.get('valor_total')
                ] if v is not None)
            }
            
            # Moneda
            moneda = DocumentParser._get_xml_text(
                root, './/cbc:DocumentCurrencyCode', namespaces
            )
            if moneda:
                data['moneda'] = moneda
            
            # Información del Sector Salud
            data['sector_salud'] = {}
            
            # Buscar en CustomTagGeneral (estructura de facturas del sector salud)
            logger.info("🏥 INICIANDO BÚSQUEDA DE DATOS DEL SECTOR SALUD")
            
            # Primero buscar en el documento actual
            custom_tag = root.find('.//CustomTagGeneral')
            logger.info(f"🏥 CustomTagGeneral en documento principal: {'Encontrado' if custom_tag is not None else 'NO encontrado'}")
            
            # Si no se encuentra y es un AttachedDocument, buscar en el CDATA
            if custom_tag is None and (root.tag.endswith('AttachedDocument') or 'AttachedDocument' in root.tag):
                logger.info("🏥 Buscando CustomTagGeneral en CDATA de AttachedDocument")
                # Buscar en el contenido CDATA de la factura interna
                description_elements = root.findall('.//cbc:Description', namespaces) or root.findall('.//Description')
                logger.info(f"🏥 Description elements para CDATA: {len(description_elements)}")
                
                for desc_elem in description_elements:
                    if desc_elem.text and desc_elem.text.strip().startswith('<?xml'):
                        try:
                            inner_xml = desc_elem.text.strip()
                            inner_root = ET.fromstring(inner_xml)
                            custom_tag = inner_root.find('.//CustomTagGeneral')
                            if custom_tag is not None:
                                logger.info("🏥 CustomTagGeneral encontrado en factura interna CDATA")
                                break
                        except Exception as e:
                            logger.error(f"Error parsing inner XML: {e}")
            
            # También buscar en las extensiones del documento principal
            if custom_tag is None:
                logger.info("🏥 Buscando CustomTagGeneral en extensiones del documento principal")
                extensions = root.findall('.//ext:UBLExtensions//ext:UBLExtension//ext:ExtensionContent', {
                    'ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2'
                }) or root.findall('.//UBLExtensions//UBLExtension//ExtensionContent')
                
                logger.info(f"🏥 Extensiones encontradas: {len(extensions)}")
                for i, ext in enumerate(extensions):
                    logger.info(f"🏥 Revisando extensión {i+1}/{len(extensions)}")
                    # Buscar CustomTagGeneral directamente en esta extensión
                    custom_tag_in_ext = ext.find('.//CustomTagGeneral')
                    if custom_tag_in_ext is not None:
                        custom_tag = custom_tag_in_ext
                        logger.info(f"🏥 ✅ CustomTagGeneral encontrado en extensión {i+1}")
                        break
                    
                    # También buscar en cualquier parte de la extensión con find_all
                    all_children = list(ext.iter())
                    logger.info(f"🏥 Extensión {i+1} tiene {len(all_children)} elementos")
                    for child in all_children:
                        if 'CustomTagGeneral' in str(child.tag):
                            custom_tag = child
                            logger.info(f"🏥 ✅ CustomTagGeneral encontrado vía iteración en extensión {i+1}")
                            break
                    if custom_tag is not None:
                        break
            
            if custom_tag is not None:
                logger.info("🏥 CustomTagGeneral encontrado - Extrayendo datos del sector salud")
                
                # Debug: mostrar la estructura del CustomTagGeneral
                import xml.etree.ElementTree as ET_debug
                custom_tag_xml = ET_debug.tostring(custom_tag, encoding='unicode')[:500]
                logger.info(f"🏥 CustomTagGeneral content (primeros 500 chars): {custom_tag_xml}")
                
                # Buscar dentro de Interoperabilidad -> Group -> Collection -> AdditionalInformation
                additional_infos = custom_tag.findall('.//AdditionalInformation')
                logger.info(f"🏥 AdditionalInformation elementos encontrados: {len(additional_infos)}")
                
                # Si no encontramos con .//AdditionalInformation, probar con namespaces
                if len(additional_infos) == 0:
                    # Intentar con namespaces automáticamente detectados
                    ns_map = {}
                    for elem in custom_tag.iter():
                        if elem.tag.startswith('{'):
                            ns_uri = elem.tag[1:elem.tag.index('}')]
                            if ns_uri not in ns_map.values():
                                ns_key = f"ns{len(ns_map)}"
                                ns_map[ns_key] = ns_uri
                    
                    logger.info(f"🏥 Namespaces detectados en CustomTagGeneral: {ns_map}")
                    
                    # Probar con namespaces
                    if ns_map:
                        ns_prefix = list(ns_map.keys())[0]  # Usar el primer namespace
                        ns_paths = [
                            f'.//{ns_prefix}:AdditionalInformation',
                            f'.//{ns_prefix}:Interoperabilidad//{ns_prefix}:AdditionalInformation',
                            f'.//{ns_prefix}:Group//{ns_prefix}:AdditionalInformation',
                            f'.//{ns_prefix}:Collection//{ns_prefix}:AdditionalInformation'
                        ]
                        
                        for path in ns_paths:
                            test_infos = custom_tag.findall(path, ns_map)
                            logger.info(f"🏥 Probando path con namespace '{path}': {len(test_infos)} elementos")
                            if len(test_infos) > 0:
                                additional_infos = test_infos
                                break
                    
                    # Fallback: intentar sin namespaces también
                    if len(additional_infos) == 0:
                        specific_paths = [
                            './/Interoperabilidad//AdditionalInformation',
                            './/Group//AdditionalInformation', 
                            './/Collection//AdditionalInformation',
                            './/Interoperabilidad//Group//Collection//AdditionalInformation'
                        ]
                        
                        for path in specific_paths:
                            test_infos = custom_tag.findall(path)
                            logger.info(f"🏥 Probando path sin namespace '{path}': {len(test_infos)} elementos")
                            if len(test_infos) > 0:
                                additional_infos = test_infos
                                break
                
                # Usar namespaces para extraer Name y Value también
                ns_map_for_extraction = {}
                if len(additional_infos) > 0:
                    # Detectar namespaces de los elementos encontrados
                    for elem in additional_infos[0].iter():
                        if elem.tag.startswith('{'):
                            ns_uri = elem.tag[1:elem.tag.index('}')]
                            if ns_uri not in ns_map_for_extraction.values():
                                ns_key = f"ns{len(ns_map_for_extraction)}"
                                ns_map_for_extraction[ns_key] = ns_uri
                
                logger.info(f"🏥 Namespaces para extracción: {ns_map_for_extraction}")
                
                for info in additional_infos:
                    # Intentar con y sin namespace para Name y Value
                    name_elem = None
                    value_elem = None
                    
                    if ns_map_for_extraction:
                        ns_prefix = list(ns_map_for_extraction.keys())[0]
                        name_elem = info.find(f'{ns_prefix}:Name', ns_map_for_extraction)
                        value_elem = info.find(f'{ns_prefix}:Value', ns_map_for_extraction)
                    
                    # Fallback sin namespace
                    if name_elem is None:
                        name_elem = info.find('Name')
                    if value_elem is None:
                        value_elem = info.find('Value')
                    
                    if name_elem is not None and value_elem is not None:
                        name = name_elem.text
                        value = value_elem.text if value_elem.text else ''
                        
                        # También extraer atributos de Value si existen
                        value_attrs = value_elem.attrib
                        
                        logger.info(f"🏥 AdditionalInformation - {name}: {value}")
                        
                        if name == 'CODIGO_PRESTADOR':
                            data['sector_salud']['codigo_prestador'] = value
                        elif name == 'MODALIDAD_PAGO':
                            # Extraer tanto el texto como el schemeID
                            data['sector_salud']['modalidad_pago'] = value
                            if 'schemeID' in value_attrs:
                                data['sector_salud']['modalidad_pago_codigo'] = value_attrs['schemeID']
                        elif name == 'COBERTURA_PLAN_BENEFICIOS':
                            data['sector_salud']['cobertura_plan_beneficios'] = value
                            if 'schemeID' in value_attrs:
                                data['sector_salud']['cobertura_codigo'] = value_attrs['schemeID']
                        elif name == 'NUMERO_CONTRATO':
                            data['sector_salud']['numero_contrato'] = value
                        elif name == 'NUMERO_POLIZA':
                            data['sector_salud']['numero_poliza'] = value
            
            # También buscar con la estructura anterior por si acaso
            industry_codes = root.findall('.//cbc:IndustryClassificationCode', namespaces) or \
                            root.findall('.//IndustryClassificationCode', {})
            
            if industry_codes and not data['sector_salud']:
                logger.info(f"🏥 IndustryClassificationCode encontrados: {len(industry_codes)}")
                
                for code_elem in industry_codes:
                    list_name = code_elem.get('listName', '')
                    code_value = code_elem.text if code_elem.text else ''
                    logger.info(f"🏥 IndustryClassificationCode - listName: {list_name}, value: {code_value}")
                    
                    if list_name == 'ModalidadPago':
                        data['sector_salud']['modalidad_pago'] = code_value
                    elif list_name == 'CoberturaServicio':
                        data['sector_salud']['cobertura_plan_beneficios'] = code_value
            
            # Buscar documentos adicionales
            additional_docs = root.findall('.//cac:AdditionalDocumentReference', namespaces) or \
                             root.findall('.//AdditionalDocumentReference', {})
            
            logger.info(f"📄 AdditionalDocumentReference encontrados: {len(additional_docs)}")
            
            for doc in additional_docs:
                doc_type = DocumentParser._get_xml_text(doc, './cbc:DocumentTypeCode', namespaces) or \
                          DocumentParser._get_xml_text(doc, './DocumentTypeCode', {})
                doc_id = DocumentParser._get_xml_text(doc, './cbc:ID', namespaces) or \
                        DocumentParser._get_xml_text(doc, './ID', {})
                
                logger.info(f"📄 AdditionalDocumentReference - type: {doc_type}, id: {doc_id}")
                
                if doc_type == '395' and doc_id:  # Contrato
                    data['sector_salud']['numero_contrato'] = doc_id
                elif doc_type == '396' and doc_id:  # Póliza
                    data['sector_salud']['numero_poliza'] = doc_id
            
            # Copago, cuota moderadora, cuota recuperación, pagos compartidos
            allowances = root.findall('.//cac:AllowanceCharge', namespaces) or \
                        root.findall('.//AllowanceCharge', {})
            
            logger.info(f"💰 AllowanceCharge encontrados: {len(allowances)}")
            
            for allowance in allowances:
                charge_indicator = DocumentParser._get_xml_text(allowance, './cbc:ChargeIndicator', namespaces) or \
                                 DocumentParser._get_xml_text(allowance, './ChargeIndicator', {})
                reason_code = DocumentParser._get_xml_text(allowance, './cbc:AllowanceChargeReasonCode', namespaces) or \
                             DocumentParser._get_xml_text(allowance, './AllowanceChargeReasonCode', {})
                amount = DocumentParser._get_xml_text(allowance, './cbc:Amount', namespaces) or \
                        DocumentParser._get_xml_text(allowance, './Amount', {})
                
                logger.info(f"💰 AllowanceCharge - charge: {charge_indicator}, reason: {reason_code}, amount: {amount}")
                
                if reason_code and amount:
                    try:
                        amount_decimal = Decimal(amount.replace(',', ''))
                        if reason_code == '01':  # Copago
                            data['sector_salud']['copago'] = float(amount_decimal)
                        elif reason_code == '02':  # Cuota moderadora
                            data['sector_salud']['cuota_moderadora'] = float(amount_decimal)
                        elif reason_code == '03':  # Cuota recuperación
                            data['sector_salud']['cuota_recuperacion'] = float(amount_decimal)
                        elif reason_code == '04':  # Pagos compartidos
                            data['sector_salud']['pagos_compartidos'] = float(amount_decimal)
                    except Exception as e:
                        logger.error(f"Error procesando AllowanceCharge: {e}")
            
            # Buscar PrepaidPayment (Recaudos: copago, cuota moderadora, anticipo, pago compartido)
            prepaid_payments = root.findall('.//cac:PrepaidPayment', namespaces) or \
                             root.findall('.//PrepaidPayment', {})
            
            # Si no se encuentra y es un AttachedDocument, buscar en el CDATA
            if not prepaid_payments and (root.tag.endswith('AttachedDocument') or 'AttachedDocument' in root.tag):
                description_elements = root.findall('.//cbc:Description', namespaces) or root.findall('.//Description')
                
                for desc_elem in description_elements:
                    if desc_elem.text and desc_elem.text.strip().startswith('<?xml'):
                        try:
                            inner_xml = desc_elem.text.strip()
                            inner_root = ET.fromstring(inner_xml)
                            prepaid_payments = inner_root.findall('.//cac:PrepaidPayment', namespaces) or \
                                             inner_root.findall('.//PrepaidPayment', {})
                            if prepaid_payments:
                                logger.info("💰 PrepaidPayment encontrado en factura interna CDATA")
                                break
                        except Exception as e:
                            logger.error(f"Error parsing inner XML for PrepaidPayment: {e}")
            
            if prepaid_payments:
                logger.info(f"💰 PrepaidPayment encontrados: {len(prepaid_payments)}")
                total_recaudo = 0
                recaudos_detalle = []
                
                for prepaid in prepaid_payments:
                    amount_elem = prepaid.find('.//cbc:PaidAmount', namespaces) or \
                                 prepaid.find('.//PaidAmount', {})
                    id_elem = prepaid.find('.//cbc:ID', namespaces) or \
                             prepaid.find('.//ID', {})
                    date_elem = prepaid.find('.//cbc:ReceivedDate', namespaces) or \
                               prepaid.find('.//ReceivedDate', {})
                    
                    if amount_elem is not None and amount_elem.text:
                        try:
                            amount = float(amount_elem.text.replace(',', ''))
                            total_recaudo += amount
                            
                            recaudo_info = {
                                'monto': amount,
                                'moneda': amount_elem.get('currencyID', 'COP')
                            }
                            
                            if id_elem is not None:
                                recaudo_info['id'] = id_elem.text
                                recaudo_info['tipo_codigo'] = id_elem.get('schemeID', '')
                                
                                # Mapear el tipo según schemeID
                                tipo_map = {
                                    '01': 'Copago',
                                    '02': 'Cuota Moderadora',
                                    '03': 'Cuota Recuperación',
                                    '04': 'Pago Compartido',
                                    '05': 'Anticipo'
                                }
                                recaudo_info['tipo'] = tipo_map.get(recaudo_info['tipo_codigo'], 'Recaudo')
                            
                            if date_elem is not None and date_elem.text:
                                recaudo_info['fecha'] = date_elem.text
                            
                            recaudos_detalle.append(recaudo_info)
                            logger.info(f"💰 Recaudo encontrado: {recaudo_info}")
                            
                        except Exception as e:
                            logger.error(f"Error procesando PrepaidPayment: {e}")
                
                if total_recaudo > 0:
                    data['sector_salud']['total_recaudo'] = total_recaudo
                    data['sector_salud']['recaudos_detalle'] = recaudos_detalle
                    logger.info(f"💰 Total recaudo: ${total_recaudo:,.2f}")
            
            # Líneas de factura (resumen)
            lineas = root.findall('.//cac:InvoiceLine', namespaces)
            data['total_lineas'] = len(lineas)
            
            # Período facturado (si está disponible)
            periodo_inicio = DocumentParser._get_xml_text(
                root, './/cac:InvoicePeriod/cbc:StartDate', namespaces
            )
            periodo_fin = DocumentParser._get_xml_text(
                root, './/cac:InvoicePeriod/cbc:EndDate', namespaces
            )
            
            if periodo_inicio and periodo_fin:
                data['periodo_facturado'] = {
                    'inicio': periodo_inicio,
                    'fin': periodo_fin
                }
            
            # DEBUG: Verificar si encontramos LegalMonetaryTotal
            legal_monetary_elements = root.findall('.//cac:LegalMonetaryTotal', namespaces)
            if not legal_monetary_elements:
                legal_monetary_elements = root.findall('.//LegalMonetaryTotal')
            
            logger.error(f"🔍 DEBUG: LegalMonetaryTotal encontrados: {len(legal_monetary_elements)}")
            
            if legal_monetary_elements:
                for i, elem in enumerate(legal_monetary_elements):
                    logger.error(f"🔍 DEBUG LegalMonetaryTotal #{i}:")
                    for child in elem:
                        tag_name = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                        logger.error(f"   - {tag_name}: {child.text}")
            else:
                # Buscar cualquier elemento que contenga "Amount"
                all_amount_elements = []
                for elem in root.iter():
                    tag_name = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
                    if 'Amount' in tag_name and elem.text:
                        all_amount_elements.append((tag_name, elem.text))
                
                logger.error(f"🔍 DEBUG: Elementos con 'Amount' encontrados: {len(all_amount_elements)}")
                for tag, value in all_amount_elements[:10]:  # Solo primeros 10
                    logger.error(f"   - {tag}: {value}")
            
            logger.info(f"Factura XML parseada exitosamente: {numero_factura}")
            
        except ET.ParseError as e:
            result['success'] = False
            result['errors'].append(f"Error de formato XML: {str(e)}")
            logger.error(f"Error parseando XML: {str(e)}")
        except Exception as e:
            result['success'] = False
            result['errors'].append(f"Error inesperado: {str(e)}")
            logger.error(f"Error inesperado parseando XML: {str(e)}")
        
        # Log final del sector salud extraído (siempre ejecutar)
        sector_salud_final = result.get('data', {}).get('sector_salud', {})
        logger.info(f"🏥 RESULTADO FINAL SECTOR SALUD: {sector_salud_final}")
        if sector_salud_final:
            logger.info(f"🏥 CAMPOS ENCONTRADOS: {list(sector_salud_final.keys())}")
        else:
            logger.warning("🏥 NO SE ENCONTRARON DATOS DEL SECTOR SALUD")
        
        return result
    
    @staticmethod
    def parse_rips_json(json_content: str) -> Dict[str, Any]:
        """
        Extrae información de RIPS JSON MinSalud
        
        Args:
            json_content: Contenido del archivo JSON
            
        Returns:
            Dict con información extraída
        """
        result = {
            'success': True,
            'errors': [],
            'data': {},
            'warnings': [],
            'statistics': {}
        }
        
        try:
            if isinstance(json_content, str):
                rips_data = json.loads(json_content)
            else:
                rips_data = json_content
            
            data = result['data']
            stats = result['statistics']
            
            # Información de la transacción
            data['prestador_nit'] = rips_data.get('numDocumentoIdObligado')
            data['numero_factura'] = rips_data.get('numFactura')
            data['tipo_nota'] = rips_data.get('tipoNota')
            data['numero_nota'] = rips_data.get('numNota')
            
            # Procesar usuarios y servicios
            usuarios = rips_data.get('usuarios', [])
            
            # IMPORTANTE: Guardar usuarios en data para que estén disponibles
            data['usuarios'] = usuarios
            
            if not usuarios:
                result['errors'].append("No se encontraron usuarios en el RIPS")
                result['success'] = False
                return result
            
            # Estadísticas generales
            stats['total_usuarios'] = len(usuarios)
            
            # Contadores por tipo de servicio
            contadores_servicios = {
                'consultas': 0,
                'procedimientos': 0,
                'urgencias': 0,
                'hospitalizacion': 0,
                'medicamentos': 0,
                'otros_servicios': 0,
                'recien_nacidos': 0
            }
            
            valor_total_calculado = Decimal('0.00')
            regimenes_encontrados = set()
            tipos_usuario_encontrados = set()
            
            # Análisis detallado de usuarios y servicios
            for usuario in usuarios:
                servicios = usuario.get('servicios', {})
                
                # Recopilar información demográfica
                regimen = usuario.get('tipoUsuario')
                if regimen:
                    regimenes_encontrados.add(regimen)
                
                tipo_usuario = usuario.get('tipoUsuario')
                if tipo_usuario:
                    tipos_usuario_encontrados.add(tipo_usuario)
                
                # Contar servicios por tipo
                for tipo_servicio, servicios_lista in servicios.items():
                    if isinstance(servicios_lista, list):
                        count = len(servicios_lista)
                        if tipo_servicio in contadores_servicios:
                            contadores_servicios[tipo_servicio] += count
                        
                        # Sumar valores monetarios
                        for servicio in servicios_lista:
                            vr_servicio = servicio.get('vrServicio', 0)
                            if vr_servicio:
                                try:
                                    valor_total_calculado += Decimal(str(vr_servicio))
                                except:
                                    result['warnings'].append(f"Valor inválido en servicio: {vr_servicio}")
            
            # Asignar estadísticas
            stats.update(contadores_servicios)
            stats['valor_total_calculado'] = valor_total_calculado
            stats['regimenes'] = list(regimenes_encontrados)
            stats['tipos_usuario'] = list(tipos_usuario_encontrados)
            
            # Determinar tipo predominante de servicio con lógica mejorada
            # Priorizar por tipo de servicio, no solo por cantidad
            if contadores_servicios['hospitalizacion'] > 0:
                tipo_servicio_principal = 'hospitalizacion'
            elif contadores_servicios['urgencias'] > 0:
                tipo_servicio_principal = 'urgencias'
            elif contadores_servicios['recien_nacidos'] > 0:
                tipo_servicio_principal = 'recien_nacidos'
            elif contadores_servicios['procedimientos'] > 0:
                tipo_servicio_principal = 'procedimientos'
            elif contadores_servicios['consultas'] > 0:
                tipo_servicio_principal = 'consultas'
            elif contadores_servicios['medicamentos'] > 0:
                tipo_servicio_principal = 'medicamentos'
            elif contadores_servicios['otros_servicios'] > 0:
                tipo_servicio_principal = 'otros_servicios'
            else:
                # Si no hay servicios, por defecto consultas
                tipo_servicio_principal = 'consultas'
            
            data['tipo_servicio_principal'] = tipo_servicio_principal
            
            # Determinar modalidad de pago (inferida)
            total_servicios = sum(contadores_servicios.values())
            if contadores_servicios['hospitalizacion'] > 0:
                data['modalidad_inferida'] = 'HOSPITALIZACION'
            elif contadores_servicios['urgencias'] > 0:
                data['modalidad_inferida'] = 'URGENCIAS'
            elif contadores_servicios['consultas'] > total_servicios * 0.7:
                data['modalidad_inferida'] = 'AMBULATORIO'
            else:
                data['modalidad_inferida'] = 'MIXTO'
            
            # Período inferido (de las fechas de atención)
            fechas_atencion = []
            for usuario in usuarios:
                servicios = usuario.get('servicios', {})
                for tipo_servicios in servicios.values():
                    if isinstance(tipo_servicios, list):
                        for servicio in tipo_servicios:
                            fecha = (servicio.get('fechaAtencion') or 
                                   servicio.get('fechaInicioAtencion') or
                                   servicio.get('fechaConsulta'))
                            if fecha:
                                try:
                                    fechas_atencion.append(datetime.strptime(fecha[:10], '%Y-%m-%d').date())
                                except:
                                    continue
            
            if fechas_atencion:
                data['fecha_atencion_minima'] = min(fechas_atencion)
                data['fecha_atencion_maxima'] = max(fechas_atencion)
                
                # Período inferido
                fecha_min = min(fechas_atencion)
                data['periodo_inferido'] = fecha_min.strftime('%Y-%m')
            
            logger.info(f"RIPS JSON parseado exitosamente: {data.get('numero_factura')}")
            
        except json.JSONDecodeError as e:
            result['success'] = False
            result['errors'].append(f"Error de formato JSON: {str(e)}")
            logger.error(f"Error parseando JSON: {str(e)}")
        except Exception as e:
            result['success'] = False
            result['errors'].append(f"Error inesperado: {str(e)}")
            logger.error(f"Error inesperado parseando JSON: {str(e)}")
        
        return result
    
    @staticmethod
    def extract_combined_info(factura_xml: str, rips_json: str) -> Dict[str, Any]:
        """
        Extrae y combina información de factura XML y RIPS JSON
        
        Args:
            factura_xml: Contenido XML de la factura
            rips_json: Contenido JSON del RIPS
            
        Returns:
            Dict con información combinada y validada
        """
        result = {
            'success': True,
            'errors': [],
            'warnings': [],
            'data': {},
            'factura_info': {},
            'rips_info': {},
            'consistency_check': {}
        }
        
        # Parsear factura XML
        factura_result = DocumentParser.parse_factura_xml(factura_xml)
        result['factura_info'] = factura_result
        
        # Parsear RIPS JSON
        rips_result = DocumentParser.parse_rips_json(rips_json)
        result['rips_info'] = rips_result
        
        # Verificar si ambos fueron exitosos
        if not factura_result['success'] or not rips_result['success']:
            result['success'] = False
            result['errors'].extend(factura_result.get('errors', []))
            result['errors'].extend(rips_result.get('errors', []))
            return result
        
        # Combinar información
        factura_data = factura_result['data']
        rips_data = rips_result['data']
        combined_data = result['data']
        
        # Información del prestador (priorizar RIPS, luego XML)
        combined_data['prestador_nit'] = (rips_data.get('prestador_nit') or 
                                         factura_data.get('prestador_nit'))
        combined_data['prestador_nombre'] = factura_data.get('prestador_nombre')
        
        # Información de la factura
        combined_data['numero_factura'] = (rips_data.get('numero_factura') or 
                                          factura_data.get('numero_factura'))
        combined_data['fecha_expedicion'] = factura_data.get('fecha_expedicion')
        combined_data['cufe'] = factura_data.get('cufe')
        
        # Valores monetarios
        combined_data['valor_total_factura'] = factura_data.get('valor_total')
        combined_data['valor_total_rips'] = rips_result['statistics'].get('valor_total_calculado')
        
        # IMPORTANTE: Incluir resumen monetario completo
        combined_data['resumen_monetario'] = factura_data.get('resumen_monetario', {})
        
        # Incluir información del sector salud
        combined_data['sector_salud'] = factura_data.get('sector_salud')
        
        # Información de servicios
        combined_data['tipo_servicio_principal'] = rips_data.get('tipo_servicio_principal')
        combined_data['modalidad_pago_inferida'] = rips_data.get('modalidad_inferida')
        combined_data['periodo_facturado'] = (rips_data.get('periodo_inferido') or 
                                             factura_data.get('periodo_facturado'))
        
        # Estadísticas
        combined_data['estadisticas'] = rips_result.get('statistics', {})
        
        # Datos RIPS originales para extraer información del paciente
        combined_data['rips_data'] = rips_result.get('data', {})
        
        # DEBUG: Verificar usuarios
        logger.info(f"📊 RIPS result keys: {list(rips_result.keys())}")
        logger.info(f"📊 RIPS data keys: {list(rips_data.keys())}")
        logger.info(f"📊 Usuarios en rips_result: {len(rips_result.get('data', {}).get('usuarios', []))}")
        
        # Verificación de consistencia
        consistency = result['consistency_check']
        
        # Verificar NIT del prestador
        if (factura_data.get('prestador_nit') and rips_data.get('prestador_nit') and
            factura_data['prestador_nit'] != rips_data['prestador_nit']):
            consistency['nit_inconsistente'] = {
                'xml': factura_data['prestador_nit'],
                'rips': rips_data['prestador_nit']
            }
            result['warnings'].append("NIT del prestador difiere entre XML y RIPS")
        
        # Verificar número de factura
        if (factura_data.get('numero_factura') and rips_data.get('numero_factura') and
            factura_data['numero_factura'] != rips_data['numero_factura']):
            consistency['factura_inconsistente'] = {
                'xml': factura_data['numero_factura'],
                'rips': rips_data['numero_factura']
            }
            result['warnings'].append("Número de factura difiere entre XML y RIPS")
        
        # Verificar valores monetarios
        if (combined_data.get('valor_total_factura') and combined_data.get('valor_total_rips')):
            diferencia = abs(combined_data['valor_total_factura'] - combined_data['valor_total_rips'])
            tolerancia = combined_data['valor_total_factura'] * Decimal('0.01')  # 1% tolerancia
            
            if diferencia > tolerancia:
                consistency['valor_inconsistente'] = {
                    'diferencia': float(diferencia),
                    'factura': float(combined_data['valor_total_factura']),
                    'rips': float(combined_data['valor_total_rips'])
                }
                result['warnings'].append(f"Diferencia significativa entre valores: ${diferencia}")
        
        return result
    
    @staticmethod
    def _get_xml_text(root, xpath: str, namespaces: Dict[str, str]) -> Optional[str]:
        """Obtiene texto de un elemento XML con manejo de errores"""
        try:
            element = root.find(xpath, namespaces)
            return element.text if element is not None else None
        except Exception:
            return None


class FileProcessor:
    """Procesador de archivos para radicación"""
    
    @staticmethod
    def process_uploaded_files(files: Dict) -> Dict[str, Any]:
        """
        Procesa archivos subidos y extrae información automáticamente
        
        Args:
            files: Dict con archivos {'factura_xml': file, 'rips_json': file, 'cuv_file': file, ...}
            
        Returns:
            Dict con información extraída y validaciones
        """
        result = {
            'success': True,
            'extracted_data': {},
            'file_info': {},
            'validation_summary': {},
            'cross_validation': {},
            'ready_to_radicate': False
        }
        
        factura_content = None
        rips_content = None
        cuv_content = None
        soportes_nombres = []
        
        # Procesar factura XML
        if 'factura_xml' in files:
            factura_file = files['factura_xml']
            try:
                factura_content = factura_file.read().decode('utf-8')
                result['file_info']['factura_xml'] = {
                    'name': factura_file.name,
                    'size': len(factura_content),
                    'processed': True
                }
            except Exception as e:
                result['file_info']['factura_xml'] = {
                    'name': factura_file.name,
                    'error': str(e),
                    'processed': False
                }
                result['success'] = False
        
        # Procesar RIPS JSON
        if 'rips_json' in files:
            rips_file = files['rips_json']
            try:
                rips_content = rips_file.read().decode('utf-8')
                result['file_info']['rips_json'] = {
                    'name': rips_file.name,
                    'size': len(rips_content),
                    'processed': True
                }
            except Exception as e:
                result['file_info']['rips_json'] = {
                    'name': rips_file.name,
                    'error': str(e),
                    'processed': False
                }
                result['success'] = False
        
        # Procesar archivo CUV
        datos_cuv = None
        if 'cuv_file' in files:
            cuv_file = files['cuv_file']
            try:
                cuv_content = cuv_file.read().decode('utf-8')
                result['file_info']['cuv_file'] = {
                    'name': cuv_file.name,
                    'size': len(cuv_content),
                    'processed': True
                }
                
                # Parsear CUV
                cross_validator = CrossValidationService()
                datos_cuv = cross_validator.parsear_archivo_cuv(cuv_content)
                
                # Agregar CUV a extracted_data para guardar en BD
                if datos_cuv.get('codigo_unico_validacion'):
                    result['extracted_data']['codigo_unico_validacion'] = datos_cuv['codigo_unico_validacion']
                    result['extracted_data']['fecha_validacion_minsalud'] = datos_cuv.get('fecha_validacion')
                
            except Exception as e:
                result['file_info']['cuv_file'] = {
                    'name': cuv_file.name,
                    'error': str(e),
                    'processed': False
                }
                logger.error(f"Error procesando CUV: {str(e)}")
        
        # Recolectar nombres de soportes PDF
        # Nota: files aquí es un dict-like de Django request.FILES
        # Para archivos múltiples con el mismo nombre, usar getlist()
        if hasattr(files, 'getlist'):
            # Es un QueryDict de Django
            soportes_list = files.getlist('soportes_adicionales')
            for soporte in soportes_list:
                if hasattr(soporte, 'name'):
                    soportes_nombres.append(soporte.name)
                    logger.info(f"Soporte para validación: {soporte.name}")
        else:
            # Es un dict normal (para testing)
            for key in files.keys():
                if (key.startswith('soporte') or key == 'soportes_adicionales') and key != 'cuv_file':
                    archivo = files[key]
                    if hasattr(archivo, 'name'):
                        soportes_nombres.append(archivo.name)
        
        # Si ambos archivos principales están disponibles, extraer información combinada
        if factura_content and rips_content:
            combined_result = DocumentParser.extract_combined_info(factura_content, rips_content)
            result['extracted_data'] = combined_result['data']
            
            # Realizar validaciones cruzadas
            if combined_result['success']:
                cross_validator = CrossValidationService()
                
                # Preparar datos para validación
                datos_xml = combined_result['factura_info']['data']
                datos_rips = combined_result['rips_info']['data']
                
                # Ejecutar validación cruzada
                cross_validation_result = cross_validator.validar_coherencia_completa(
                    datos_xml=datos_xml,
                    datos_rips=datos_rips,
                    datos_cuv=datos_cuv,
                    archivos_soportes=soportes_nombres
                )
                
                result['cross_validation'] = cross_validation_result
                
                # Actualizar validation_summary con resultados de validación cruzada
                result['validation_summary'] = {
                    'consistency_issues': len(combined_result.get('warnings', [])),
                    'extraction_errors': len(combined_result.get('errors', [])),
                    'cross_validation_errors': len(cross_validation_result.get('errores', [])),
                    'cross_validation_warnings': len(cross_validation_result.get('advertencias', [])),
                    'ready_to_radicate': (
                        combined_result['success'] and 
                        len(combined_result.get('errors', [])) == 0 and
                        cross_validation_result['valido']
                    )
                }
                
                # Si hay errores de validación cruzada, no está listo para radicar
                if not cross_validation_result['valido']:
                    result['ready_to_radicate'] = False
                    result['success'] = False
                    
                    # Agregar errores al resultado principal
                    if 'errors' not in result:
                        result['errors'] = []
                    result['errors'].extend(cross_validation_result['errores'])
                else:
                    result['ready_to_radicate'] = result['validation_summary']['ready_to_radicate']
            else:
                result['validation_summary'] = {
                    'consistency_issues': len(combined_result.get('warnings', [])),
                    'extraction_errors': len(combined_result.get('errors', [])),
                    'ready_to_radicate': False
                }
                result['ready_to_radicate'] = False
        
        return result


class DataMapper:
    """Mapea datos extraídos a choices válidos del modelo"""
    
    # Mapeo de tipos de servicios detectados a choices válidos
    TIPO_SERVICIO_MAP = {
        'consultas': 'AMBULATORIO',
        'procedimientos': 'AMBULATORIO',  # Procedimientos pueden ser ambulatorios, no solo cirugías
        'medicamentos': 'MEDICAMENTOS',
        'urgencias': 'URGENCIAS',
        'hospitalizacion': 'HOSPITALIZACION',
        'otros_servicios': 'APOYO_DIAGNOSTICO',
        'recien_nacidos': 'HOSPITALIZACION',
        # Valores alternativos
        'ambulatorio': 'AMBULATORIO',
        'cirugia': 'CIRUGIA',
        'odontologia': 'ODONTOLOGIA',
        'terapias': 'TERAPIAS',
        'transporte': 'TRANSPORTE'
    }
    
    # Mapeo de modalidades de pago
    MODALIDAD_PAGO_MAP = {
        'evento': 'EVENTO',
        'capitacion': 'CAPITACION', 
        'global': 'GLOBAL_PROSPECTIVO',
        'mixto': 'EVENTO',  # MIXTO se mapea a EVENTO por defecto
        'paquete': 'GRUPO_DIAGNOSTICO',
        # Valores alternativos
        'pago_evento': 'EVENTO',
        'pago_por_evento': 'EVENTO',
        'global_prospectivo': 'GLOBAL_PROSPECTIVO',  
        'grupo_diagnostico': 'GRUPO_DIAGNOSTICO'
    }
    
    @staticmethod
    def map_tipo_servicio(valor_detectado: str) -> str:
        """Mapea tipo de servicio detectado a choice válido"""
        if not valor_detectado:
            return 'AMBULATORIO'  # Default
        
        valor_lower = valor_detectado.lower().strip()
        return DataMapper.TIPO_SERVICIO_MAP.get(valor_lower, 'AMBULATORIO')
    
    @staticmethod
    def map_modalidad_pago(valor_detectado: str) -> str:
        """Mapea modalidad de pago detectada a choice válido"""
        if not valor_detectado:
            return 'EVENTO'  # Default
        
        valor_lower = valor_detectado.lower().strip()
        return DataMapper.MODALIDAD_PAGO_MAP.get(valor_lower, 'EVENTO')
    
    @staticmethod
    def extract_patient_data_from_rips(rips_data: dict) -> dict:
        """Extrae datos del paciente desde RIPS - Solo identificadores únicos"""
        # Mantener compatibilidad hacia atrás con un solo paciente por defecto
        patient_data = {
            'paciente_tipo_documento': 'CC',
            'paciente_numero_documento': '0000000000',
            'paciente_codigo_sexo': 'M',
            'paciente_codigo_edad': '001'  # Default: 1 año
        }
        
        # Buscar en usuarios RIPS el primer usuario válido
        usuarios = rips_data.get('usuarios', [])
        if usuarios and len(usuarios) > 0:
            primer_usuario = usuarios[0]
            
            # Tipo y número de documento (ÚNICOS - no cambian entre prestadores)
            tipo_doc = primer_usuario.get('tipoDocumentoIdentificacion', '').strip()
            if tipo_doc:
                patient_data['paciente_tipo_documento'] = tipo_doc
                
            num_doc = primer_usuario.get('numDocumentoIdentificacion', '').strip()
            if num_doc:
                patient_data['paciente_numero_documento'] = num_doc
            
            # Código de sexo (estándar RIPS)
            sexo = primer_usuario.get('codSexo', '').upper().strip()
            if not sexo:
                # Fallback a campo sexo si codSexo no existe
                sexo = primer_usuario.get('sexo', '').upper().strip()
            
            if sexo in ['M', 'F', 'I']:  # Incluir I (Indeterminado)
                patient_data['paciente_codigo_sexo'] = sexo
            elif sexo in ['MASCULINO', 'MALE', '1']:
                patient_data['paciente_codigo_sexo'] = 'M'
            elif sexo in ['FEMENINO', 'FEMALE', '2']:
                patient_data['paciente_codigo_sexo'] = 'F'
            elif sexo in ['INDETERMINADO', '3']:
                patient_data['paciente_codigo_sexo'] = 'I'
            
            # Calcular edad desde fecha nacimiento (más confiable que nombres)
            fecha_nac = primer_usuario.get('fechaNacimiento')
            if fecha_nac:
                try:
                    from datetime import datetime, date
                    if isinstance(fecha_nac, str):
                        if 'T' in fecha_nac:
                            fecha_clean = fecha_nac.split('T')[0]
                        else:
                            fecha_clean = fecha_nac
                        fecha_nacimiento = datetime.strptime(fecha_clean, '%Y-%m-%d').date()
                        
                        # Calcular edad en años
                        today = date.today()
                        edad = today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
                        patient_data['paciente_codigo_edad'] = f"{edad:03d}"  # Formato 001, 025, etc.
                except:
                    pass  # Mantener valor por defecto
        
        return patient_data
    
    @staticmethod
    def extract_multiple_patients_from_rips(rips_data: dict, max_patients: int = 5) -> list:
        """Extrae múltiples pacientes desde RIPS - Máximo 5 usuarios"""
        patients_list = []
        usuarios = rips_data.get('usuarios', [])
        
        # Limitar a los primeros max_patients usuarios
        for i, usuario in enumerate(usuarios[:max_patients]):
            patient = {
                'tipo_documento': usuario.get('tipoDocumentoIdentificacion', 'CC').strip(),
                'numero_documento': usuario.get('numDocumentoIdentificacion', '').strip(),
                'fecha_nacimiento': usuario.get('fechaNacimiento', ''),
                'sexo': 'M',  # Default
                'edad': 0
            }
            
            # Código de sexo (estándar RIPS)
            sexo = usuario.get('codSexo', '').upper().strip()
            if not sexo:
                sexo = usuario.get('sexo', '').upper().strip()
            
            if sexo in ['M', 'F', 'I']:  # M=Masculino, F=Femenino, I=Indeterminado
                patient['sexo'] = sexo
            elif sexo in ['MASCULINO', 'MALE', '1']:
                patient['sexo'] = 'M'
            elif sexo in ['FEMENINO', 'FEMALE', '2']:
                patient['sexo'] = 'F'
            elif sexo in ['INDETERMINADO', '3']:
                patient['sexo'] = 'I'
            
            # Calcular edad desde fecha nacimiento
            fecha_nac = patient['fecha_nacimiento']
            if fecha_nac:
                try:
                    from datetime import datetime, date
                    if isinstance(fecha_nac, str):
                        if 'T' in fecha_nac:
                            fecha_clean = fecha_nac.split('T')[0]
                        else:
                            fecha_clean = fecha_nac
                        fecha_nacimiento = datetime.strptime(fecha_clean, '%Y-%m-%d').date()
                        
                        # Calcular edad en años
                        today = date.today()
                        edad = today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
                        patient['edad'] = edad
                        patient['fecha_nacimiento_formateada'] = fecha_nacimiento.strftime('%d/%m/%Y')
                except:
                    patient['fecha_nacimiento_formateada'] = fecha_nac[:10] if len(fecha_nac) >= 10 else fecha_nac
            
            patients_list.append(patient)
        
        return patients_list