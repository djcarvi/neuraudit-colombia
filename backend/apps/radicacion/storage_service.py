"""
Servicio de almacenamiento en Digital Ocean Spaces con validación y clasificación
NeurAudit Colombia - Sistema de Auditoría Médica

Este servicio maneja:
1. Validación inicial de archivos (XML, RIPS, PDF)
2. Clasificación de soportes según nomenclatura oficial
3. Almacenamiento en Digital Ocean Spaces
4. Generación de URLs firmadas para acceso seguro

Autor: Analítica Neuronal
Fecha: 21 Agosto 2025
"""

import os
import hashlib
import mimetypes
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import xml.etree.ElementTree as ET
import json
import PyPDF2
import logging

from .storage_config import RadicacionStorage, validate_storage_config
from .soporte_classifier import SoporteClassifier

logger = logging.getLogger(__name__)


class StorageService:
    """
    Servicio principal para manejo de almacenamiento con validación
    """
    
    def __init__(self, nit_prestador: str = None, radicacion_id: str = None):
        """
        Inicializa el servicio de almacenamiento
        
        Args:
            nit_prestador: NIT del prestador para organización de archivos
            radicacion_id: ID de la radicación (opcional, se usa cuando ya existe)
        """
        self.storage = RadicacionStorage()
        self.classifier = SoporteClassifier()
        self.nit_prestador = nit_prestador
        self.radicacion_id = radicacion_id  # Para asociar usuarios/servicios RIPS
        
        # Pasar NIT al storage para organización
        if nit_prestador:
            self.storage._current_nit = nit_prestador
    
    def validar_y_almacenar_archivo(self, file, tipo_archivo: str) -> Dict[str, Any]:
        """
        Valida y almacena un archivo en Digital Ocean Spaces
        
        Args:
            file: Archivo Django UploadedFile
            tipo_archivo: Tipo de archivo (xml, rips, soporte)
            
        Returns:
            Dict con resultado de validación y almacenamiento
        """
        resultado = {
            'valido': False,
            'almacenado': False,  # Agregar campo almacenado por defecto
            'errores': [],
            'warnings': [],
            'info_clasificacion': {},
            'url_almacenamiento': None,
            'hash_archivo': None,
            'metadata': {}
        }
        
        try:
            # 1. Validación básica
            if not file:
                resultado['errores'].append('No se proporcionó archivo')
                return resultado
            
            logger.info(f"🔍 Validando archivo: {file.name if hasattr(file, 'name') else 'sin nombre'} - Tipo: {tipo_archivo}")
            
            # Calcular hash del archivo
            file_content = file.read()
            file.seek(0)  # Resetear puntero
            resultado['hash_archivo'] = hashlib.sha256(file_content).hexdigest()
            
            # 2. Validación específica por tipo
            if tipo_archivo == 'xml':
                validacion = self._validar_factura_xml(file)
                resultado.update(validacion)
            elif tipo_archivo == 'rips':
                validacion = self._validar_rips_json(file)
                resultado.update(validacion)
            elif tipo_archivo == 'soporte':
                validacion = self._validar_y_clasificar_soporte(file)
                resultado.update(validacion)
            else:
                resultado['errores'].append(f'Tipo de archivo no soportado: {tipo_archivo}')
                return resultado
            
            # 3. Si es válido, almacenar en Digital Ocean Spaces
            if resultado['valido']:
                try:
                    logger.info(f"🔵 Iniciando almacenamiento de archivo válido: {file.name if hasattr(file, 'name') else 'sin nombre'}")
                    
                    # Generar nombre único manteniendo nomenclatura
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    nombre_base = os.path.splitext(file.name)[0]
                    extension = os.path.splitext(file.name)[1]
                    nombre_unico = f"{nombre_base}_{timestamp}{extension}"
                    
                    logger.info(f"🔵 Nombre único generado: {nombre_unico}")
                    
                    # Almacenar archivo
                    file.seek(0)  # Resetear puntero
                    logger.info(f"🔵 Llamando a storage.save con archivo de tamaño: {file.size}")
                    path = self.storage.save(nombre_unico, file)
                    logger.info(f"🔵 Archivo guardado en path: {path}")
                    
                    # Generar URL firmada (válida por 7 días)
                    url = self.storage.url(path, parameters={
                        'ResponseContentDisposition': f'inline; filename="{file.name}"'
                    })
                    logger.info(f"🔵 URL firmada generada: {url[:100]}...")
                    
                    resultado['url_almacenamiento'] = url
                    resultado['url'] = url  # Agregar 'url' para compatibilidad con views.py
                    resultado['path_almacenamiento'] = path
                    resultado['metadata']['tamaño_bytes'] = file.size
                    resultado['metadata']['mime_type'] = mimetypes.guess_type(file.name)[0]
                    resultado['almacenado'] = True  # IMPORTANTE: Marcar como almacenado
                    
                    logger.info(f"✅ Archivo almacenado exitosamente: {path}")
                    
                except Exception as e:
                    resultado['valido'] = False
                    resultado['almacenado'] = False
                    resultado['errores'].append(f'Error almacenando archivo: {str(e)}')
                    logger.error(f"❌ Error almacenando archivo: {str(e)}")
                    logger.error(f"❌ Tipo de excepción: {type(e).__name__}")
                    import traceback
                    logger.error(f"❌ Traceback: {traceback.format_exc()}")
            
            return resultado
            
        except Exception as e:
            resultado['errores'].append(f'Error procesando archivo: {str(e)}')
            logger.error(f"Error procesando archivo: {str(e)}")
            return resultado
    
    def _validar_factura_xml(self, file) -> Dict[str, Any]:
        """
        Valida estructura básica de factura electrónica XML
        """
        resultado = {'valido': True, 'errores': [], 'warnings': []}
        
        try:
            # Parsear XML
            tree = ET.parse(file)
            root = tree.getroot()
            
            # Validar elementos mínimos requeridos
            elementos_requeridos = {
                './/cbc:ID': 'Número de factura',
                './/cbc:IssueDate': 'Fecha de emisión',
                './/cbc:DocumentCurrencyCode': 'Código de moneda',
                './/cac:AccountingSupplierParty': 'Información del proveedor',
                './/cac:AccountingCustomerParty': 'Información del cliente',
                './/cac:LegalMonetaryTotal': 'Totales monetarios'
            }
            
            # Namespaces comunes en facturas electrónicas DIAN
            namespaces = {
                'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2'
            }
            
            for xpath, descripcion in elementos_requeridos.items():
                elemento = root.find(xpath, namespaces)
                if elemento is None:
                    resultado['warnings'].append(f'No se encontró: {descripcion}')
            
            # Extraer información básica
            resultado['metadata'] = {
                'numero_factura': root.findtext('.//cbc:ID', '', namespaces),
                'fecha_emision': root.findtext('.//cbc:IssueDate', '', namespaces),
                'moneda': root.findtext('.//cbc:DocumentCurrencyCode', '', namespaces),
                'formato': 'UBL 2.1'  # Formato estándar DIAN
            }
            
        except ET.ParseError as e:
            resultado['valido'] = False
            resultado['errores'].append(f'XML mal formado: {str(e)}')
        except Exception as e:
            resultado['valido'] = False
            resultado['errores'].append(f'Error validando XML: {str(e)}')
        
        return resultado
    
    def procesar_y_guardar_rips(self, rips_data: dict, radicacion_id: str, archivo_path: str) -> Dict[str, Any]:
        """
        Procesa y guarda todos los usuarios y servicios del RIPS en MongoDB
        
        Args:
            rips_data: Datos del RIPS ya parseados
            radicacion_id: ID de la radicación asociada
            archivo_path: Path del archivo en storage
            
        Returns:
            Dict con estadísticas del procesamiento
        """
        from .models_rips_oficial import (
            RIPSTransaccionOficial as RIPSTransaccion,
            RIPSUsuarioOficial as RIPSUsuario,
            RIPSUsuarioDatos, RIPSServiciosUsuario, RIPSConsulta, RIPSProcedimiento, 
            RIPSMedicamento, RIPSUrgencia, RIPSHospitalizacion, RIPSRecienNacido, RIPSOtrosServicios,
            RIPSEstadisticasUsuario, RIPSEstadisticasTransaccion
        )
        from django.db import transaction as db_transaction
        from decimal import Decimal
        
        resultado = {
            'transaccion_id': None,
            'usuarios_procesados': 0,
            'servicios_procesados': 0,
            'errores': []
        }
        
        try:
            logger.info(f"🔄 Procesando RIPS con estructura NoSQL embebida...")
            
            # Crear usuarios embebidos con sus servicios
            usuarios_embebidos = []
            total_servicios_global = 0
            
            for idx, usuario_data in enumerate(rips_data.get('usuarios', [])):
                try:
                    # Crear datos personales embebidos (si están disponibles)
                    datos_personales = None
                    if usuario_data.get('fechaNacimiento'):
                        try:
                            from datetime import datetime
                            fecha_nac = datetime.fromisoformat(usuario_data['fechaNacimiento']).date()
                            datos_personales = RIPSUsuarioDatos(
                                fechaNacimiento=fecha_nac,
                                sexo=usuario_data.get('codSexo', 'M'),
                                municipioResidencia=usuario_data.get('codMunicipioResidencia', ''),
                                zonaResidencia=usuario_data.get('codZonaTerritorialResidencia', 'U')
                            )
                        except:
                            logger.warning(f"No se pudieron procesar datos personales del usuario {idx}")
                    
                    # Procesar servicios embebidos
                    servicios_embebidos = None
                    total_servicios_usuario = 0
                    servicios_data = usuario_data.get('servicios', {})
                    
                    if servicios_data:
                        # Procesar consultas embebidas
                        consultas_embebidas = []
                        for consulta in servicios_data.get('consultas', []):
                            try:
                                fecha_str = consulta.get('fechaInicioAtencion', '')
                                fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else datetime.now()
                                
                                consulta_obj = RIPSConsulta(
                                    codPrestador=consulta.get('codPrestador', ''),
                                    fechaAtencion=fecha_atencion,
                                    numAutorizacion=consulta.get('numAutorizacion', ''),
                                    codConsulta=consulta.get('codConsulta', ''),
                                    modalidadGrupoServicioTecSal=consulta.get('modalidadGrupoServicioTecSal', ''),
                                    grupoServicios=consulta.get('grupoServicios', ''),
                                    codServicio=consulta.get('codServicio', ''),
                                    finalidadTecnologiaSalud=consulta.get('finalidadTecnologiaSalud', ''),
                                    causaMotivo=consulta.get('causaMotivoAtencion', ''),
                                    diagnosticoPrincipal=consulta.get('codDiagnosticoPrincipal', ''),
                                    diagnosticoRelacionado1=consulta.get('codDiagnosticoRelacionado1', ''),
                                    diagnosticoRelacionado2=consulta.get('codDiagnosticoRelacionado2', ''),
                                    diagnosticoRelacionado3=consulta.get('codDiagnosticoRelacionado3', ''),
                                    tipoDiagnosticoPrincipal=consulta.get('tipoDiagnosticoPrincipal', ''),
                                    tipoDocumentoIdentificacion=consulta.get('tipoDocumentoIdentificacion', ''),
                                    numDocumentoIdentificacion=consulta.get('numDocumentoIdentificacion', ''),
                                    vrServicio=Decimal(str(consulta.get('vrServicio', 0))),
                                    conceptoRecaudo=consulta.get('tipoPagoModerador', ''),
                                    valorPagoModerador=Decimal(str(consulta.get('valorPagoModerador', 0))),
                                    numFEPS=consulta.get('numFEVPagoModerador', ''),
                                    estadoValidacion='PENDIENTE'
                                )
                                consultas_embebidas.append(consulta_obj)
                                total_servicios_usuario += 1
                            except Exception as e:
                                logger.error(f"Error procesando consulta: {str(e)}")
                        
                        # Procesar procedimientos embebidos
                        procedimientos_embebidos = []
                        for proc in servicios_data.get('procedimientos', []):
                            try:
                                fecha_str = proc.get('fechaInicioAtencion', '')
                                fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else datetime.now()
                                
                                proc_obj = RIPSProcedimiento(
                                    codPrestador=proc.get('codPrestador', ''),
                                    fechaAtencion=fecha_atencion,
                                    numAutorizacion=proc.get('numAutorizacion', ''),
                                    codProcedimiento=proc.get('codProcedimiento', ''),
                                    viaIngresoServicioSalud=proc.get('viaIngresoServicioSalud', ''),
                                    modalidadGrupoServicioTecSal=proc.get('modalidadGrupoServicioTecSal', ''),
                                    grupoServicios=proc.get('grupoServicios', ''),
                                    codServicio=proc.get('codServicio', ''),
                                    finalidadTecnologiaSalud=proc.get('finalidadTecnologiaSalud', ''),
                                    tipoDocumentoIdentificacion=proc.get('tipoDocumentoIdentificacion', ''),
                                    numDocumentoIdentificacion=proc.get('numDocumentoIdentificacion', ''),
                                    diagnosticoPrincipal=proc.get('codDiagnosticoPrincipal', ''),
                                    diagnosticoRelacionado=proc.get('codDiagnosticoRelacionado', ''),
                                    complicacion=proc.get('codComplicacion', ''),
                                    vrServicio=Decimal(str(proc.get('vrServicio', 0))),
                                    conceptoRecaudo=proc.get('tipoPagoModerador', ''),
                                    valorPagoModerador=Decimal(str(proc.get('valorPagoModerador', 0))),
                                    numFEPS=proc.get('numFEVPagoModerador', ''),
                                    estadoValidacion='PENDIENTE'
                                )
                                procedimientos_embebidos.append(proc_obj)
                                total_servicios_usuario += 1
                            except Exception as e:
                                logger.error(f"Error procesando procedimiento: {str(e)}")
                        
                        # Procesar medicamentos embebidos
                        medicamentos_embebidos = []
                        for med in servicios_data.get('medicamentos', []):
                            try:
                                fecha_str = med.get('fechaDispensAdmon', '')
                                fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else datetime.now()
                                
                                med_obj = RIPSMedicamento(
                                    codPrestador=med.get('codPrestador', ''),
                                    fechaAtencion=fecha_atencion,
                                    numAutorizacion=med.get('numAutorizacion', ''),
                                    codTecnologiaSalud=med.get('codTecnologiaSalud', ''),
                                    nomTecnologiaSalud=med.get('nomTecnologiaSalud', ''),
                                    tipoDocumentoIdentificacion=med.get('tipoDocumentoIdentificacion', ''),
                                    numDocumentoIdentificacion=med.get('numDocumentoIdentificacion', ''),
                                    cantidadSuministrada=Decimal(str(med.get('cantidadMedicamento', 0))),
                                    tipoUnidadMedida=med.get('unidadMedida', ''),
                                    valorUnitarioTecnologia=Decimal(str(med.get('vrUnitMedicamento', 0))),
                                    vrServicio=Decimal(str(med.get('vrServicio', 0))),
                                    conceptoRecaudo=med.get('tipoPagoModerador', ''),
                                    valorPagoModerador=Decimal(str(med.get('valorPagoModerador', 0))),
                                    numFEPS=med.get('numFEVPagoModerador', ''),
                                    estadoValidacion='PENDIENTE'
                                )
                                medicamentos_embebidos.append(med_obj)
                                total_servicios_usuario += 1
                            except Exception as e:
                                logger.error(f"Error procesando medicamento: {str(e)}")
                        
                        # Procesar urgencias embebidas
                        urgencias_embebidas = []
                        for urg in servicios_data.get('urgencias', []):
                            try:
                                fecha_str = urg.get('fechaInicioAtencion', '')
                                fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else datetime.now()
                                
                                urg_obj = RIPSUrgencia(
                                    codPrestador=urg.get('codPrestador', ''),
                                    fechaAtencion=fecha_atencion,
                                    causaExterna=urg.get('causaMotivoAtencion', ''),
                                    diagnosticoPrincipal=urg.get('codDiagnosticoPrincipal', ''),
                                    diagnosticoRelacionado1=urg.get('codDiagnosticoRelacionado1', ''),
                                    diagnosticoRelacionado2=urg.get('codDiagnosticoRelacionado2', ''),
                                    diagnosticoRelacionado3=urg.get('codDiagnosticoRelacionado3', ''),
                                    destinoSalidaServicioSalud=urg.get('condicionDestino', ''),
                                    estadoSalidaServicioSalud=urg.get('estadoSalida', ''),
                                    causaMuerteDirecta=urg.get('codDiagnosticoCausaMuerte', ''),
                                    tipoDocumentoIdentificacion=urg.get('tipoDocumentoIdentificacion', ''),
                                    numDocumentoIdentificacion=urg.get('numDocumentoIdentificacion', ''),
                                    vrServicio=Decimal(str(urg.get('vrServicio', 0))),
                                    estadoValidacion='PENDIENTE'
                                )
                                urgencias_embebidas.append(urg_obj)
                                total_servicios_usuario += 1
                            except Exception as e:
                                logger.error(f"Error procesando urgencia: {str(e)}")
                        
                        # Procesar hospitalización embebida
                        hospitalizacion_embebida = []
                        for hosp in servicios_data.get('hospitalizacion', []):
                            try:
                                fecha_ingreso_str = hosp.get('fechaInicioAtencion', '')
                                fecha_ingreso = datetime.fromisoformat(fecha_ingreso_str.replace(' ', 'T')) if fecha_ingreso_str else datetime.now()
                                fecha_egreso_str = hosp.get('fechaEgreso', '')
                                fecha_egreso = datetime.fromisoformat(fecha_egreso_str.replace(' ', 'T')) if fecha_egreso_str else datetime.now()
                                
                                hosp_obj = RIPSHospitalizacion(
                                    codPrestador=hosp.get('codPrestador', ''),
                                    viaIngresoServicioSalud=hosp.get('viaIngresoServicioSalud', ''),
                                    fechaIngresoServicioSalud=fecha_ingreso,
                                    numAutorizacion=hosp.get('numAutorizacion', ''),
                                    causaExterna=hosp.get('causaMotivoAtencion', ''),
                                    diagnosticoPrincipalIngreso=hosp.get('codDiagnosticoPrincipal', ''),
                                    diagnosticoPrincipalEgreso=hosp.get('codDiagnosticoPrincipalE', ''),
                                    diagnosticoRelacionadoEgreso1=hosp.get('codDiagnosticoRelacionadoE1', ''),
                                    diagnosticoRelacionadoEgreso2=hosp.get('codDiagnosticoRelacionadoE2', ''),
                                    diagnosticoRelacionadoEgreso3=hosp.get('codDiagnosticoRelacionadoE3', ''),
                                    complicacion=hosp.get('codComplicacion', ''),
                                    condicionDestinoUsuarioEgreso=hosp.get('condicionDestinoUsuarioEgreso', ''),
                                    estadoSalidaServicioSalud=hosp.get('estadoSalida', ''),
                                    causaMuerteDirecta=hosp.get('codDiagnosticoMuerte', ''),
                                    fechaEgresoServicioSalud=fecha_egreso,
                                    tipoDocumentoIdentificacion=hosp.get('tipoDocumentoIdentificacion', ''),
                                    numDocumentoIdentificacion=hosp.get('numDocumentoIdentificacion', ''),
                                    vrServicio=Decimal(str(hosp.get('vrServicio', 0))),
                                    estadoValidacion='PENDIENTE'
                                )
                                hospitalizacion_embebida.append(hosp_obj)
                                total_servicios_usuario += 1
                            except Exception as e:
                                logger.error(f"Error procesando hospitalización: {str(e)}")
                        
                        # Procesar recién nacidos embebidos
                        recien_nacidos_embebidos = []
                        for nacido in servicios_data.get('recienNacidos', []):
                            try:
                                fecha_nac_str = nacido.get('fechaNacimiento', '')
                                fecha_nacimiento = datetime.fromisoformat(fecha_nac_str.replace(' ', 'T')) if fecha_nac_str else datetime.now()
                                
                                nacido_obj = RIPSRecienNacido(
                                    codPrestador=nacido.get('codPrestador', ''),
                                    tipoDocumentoIdentificacion=nacido.get('tipoDocumentoIdentificacion', 'RC'),
                                    numDocumentoIdentificacion=nacido.get('numDocumentoIdentificacion', ''),
                                    fechaNacimiento=fecha_nacimiento,
                                    edadGestacional=int(nacido.get('edadGestacional', 0)),
                                    numConsultasCrecimientoDesarrollo=int(nacido.get('numConsultasCPrenatal', 0)),
                                    sexo=nacido.get('codSexoBiologico', ''),
                                    peso=Decimal(str(nacido.get('peso', 0))),
                                    talla=Decimal(str(nacido.get('talla', 0))),
                                    tipoDocumentoIdentificacionMadre=nacido.get('tipoDocumentoIdentificacionMadre', ''),
                                    numDocumentoIdentificacionMadre=nacido.get('numDocumentoIdentificacionMadre', ''),
                                    estadoValidacion='PENDIENTE'
                                )
                                recien_nacidos_embebidos.append(nacido_obj)
                                total_servicios_usuario += 1
                            except Exception as e:
                                logger.error(f"Error procesando recién nacido: {str(e)}")
                        
                        # Procesar otros servicios embebidos
                        otros_servicios_embebidos = []
                        for otro in servicios_data.get('otrosServicios', []):
                            try:
                                fecha_str = otro.get('fechaSuministroTecnologia', '')
                                fecha_suministro = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else datetime.now()
                                
                                otro_obj = RIPSOtrosServicios(
                                    codPrestador=otro.get('codPrestador', ''),
                                    numAutorizacion=otro.get('numAutorizacion', ''),
                                    idMIPRES=otro.get('idMIPRES', ''),
                                    fechaAtencion=fecha_suministro,
                                    codTecnologiaSalud=otro.get('codTecnologiaSalud', ''),
                                    nomTecnologiaSalud=otro.get('nomTecnologiaSalud', ''),
                                    cantidadSuministrada=Decimal(str(otro.get('cantidadOS', 0))),
                                    tipoUnidadMedida=otro.get('tipoUnidadMedida', ''),
                                    valorUnitarioTecnologia=Decimal(str(otro.get('vrUnitOS', 0))),
                                    valorTotalTecnologia=Decimal(str(otro.get('vrServicio', 0))),
                                    tipoDocumentoIdentificacion=otro.get('tipoDocumentoIdentificacion', ''),
                                    numDocumentoIdentificacion=otro.get('numDocumentoIdentificacion', ''),
                                    conceptoRecaudo=otro.get('tipoPagoModerador', ''),
                                    valorPagoModerador=Decimal(str(otro.get('valorPagoModerador', 0))),
                                    estadoValidacion='PENDIENTE'
                                )
                                otros_servicios_embebidos.append(otro_obj)
                                total_servicios_usuario += 1
                            except Exception as e:
                                logger.error(f"Error procesando otro servicio: {str(e)}")
                        
                        # Crear servicios_embebidos con TODOS los 7 tipos de servicios
                        if any([consultas_embebidas, procedimientos_embebidos, medicamentos_embebidos, 
                               urgencias_embebidas, hospitalizacion_embebida, recien_nacidos_embebidos, otros_servicios_embebidos]):
                            servicios_embebidos = RIPSServiciosUsuario(
                                consultas=consultas_embebidas or None,
                                procedimientos=procedimientos_embebidos or None,
                                medicamentos=medicamentos_embebidos or None,
                                urgencias=urgencias_embebidas or None,
                                hospitalizacion=hospitalizacion_embebida or None,
                                recienNacidos=recien_nacidos_embebidos or None,
                                otrosServicios=otros_servicios_embebidos or None
                            )
                    
                    # Crear estadísticas del usuario
                    estadisticas_usuario = RIPSEstadisticasUsuario(
                        totalServicios=total_servicios_usuario,
                        valorTotal=Decimal('0'),  # Se calculará después
                        serviciosValidados=0,
                        serviciosGlosados=0,
                        valorGlosado=Decimal('0')
                    )
                    
                    # Crear usuario embebido
                    usuario_embebido = RIPSUsuario(
                        tipoDocumento=usuario_data.get('tipoDocumentoIdentificacion', ''),
                        numeroDocumento=usuario_data.get('numDocumentoIdentificacion', ''),
                        datosPersonales=datos_personales,
                        servicios=servicios_embebidos,
                        estadisticasUsuario=estadisticas_usuario
                    )
                    
                    usuarios_embebidos.append(usuario_embebido)
                    total_servicios_global += total_servicios_usuario
                    
                except Exception as e:
                    logger.error(f"Error procesando usuario {idx}: {str(e)}")
                    continue
            
            # Crear la transacción con usuarios embebidos
            transaccion = RIPSTransaccion.objects.create(
                numFactura=rips_data.get('numFactura', ''),
                prestadorNit=rips_data.get('numDocumentoIdObligado', ''),
                prestadorRazonSocial=rips_data.get('razonSocialPrestador', ''),
                estadoProcesamiento='VALIDADO',
                usuarios=usuarios_embebidos,
                archivoRIPSOriginal=archivo_path
            )
            
            # Calcular estadísticas
            transaccion.calcular_estadisticas()
            
            resultado['transaccion_id'] = str(transaccion.id)
            resultado['usuarios_procesados'] = len(usuarios_embebidos)
            resultado['servicios_procesados'] = total_servicios_global
            
            logger.info(f"✅ RIPS procesado con estructura NoSQL: {resultado['usuarios_procesados']} usuarios, {resultado['servicios_procesados']} servicios")
            
        except Exception as e:
            logger.error(f"Error procesando RIPS: {str(e)}")
            logger.error(f"Traceback: ", exc_info=True)
            resultado['errores'].append(str(e))
            # No hacer raise para no bloquear el flujo completo
        
        return resultado
    
    def _procesar_servicios_usuario(self, usuario_data: dict, transaccion_id: str, usuario_id: str, 
                                   num_factura: str, num_documento_usuario: str) -> int:
        """
        DEPRECATED: Este método ya no se usa con la nueva estructura NoSQL embebida
        Los servicios se procesan directamente en procesar_y_guardar_rips
        """
        return 0  # Ya no procesa nada, todo se hace embebido
        servicios_data = usuario_data.get('servicios', {})
        
        # Procesar consultas
        consultas = servicios_data.get('consultas', [])
        batch_consultas = []
        for idx, consulta in enumerate(consultas):
            try:
                fecha_str = consulta.get('fechaInicioAtencion', '')
                fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else None
                
                consulta_obj = RIPSConsulta(
                    transaccion_id=transaccion_id,
                    usuario_id=usuario_id or '',
                    num_factura=num_factura,
                    num_documento_usuario=num_documento_usuario,
                    cod_prestador=consulta.get('codPrestador', ''),
                    fecha_inicio_atencion=fecha_atencion,
                    num_autorizacion=consulta.get('numAutorizacion', ''),
                    cod_consulta=consulta.get('codConsulta', ''),
                    modalidad_grupo_servicio_tec_sal=consulta.get('modalidadGrupoServicioTecSal', ''),
                    grupo_servicios=consulta.get('grupoServicios', ''),
                    cod_servicio=int(consulta.get('codServicio', 0)),
                    finalidad_tecnologia_salud=consulta.get('finalidadTecnologiaSalud', ''),
                    causa_motivo_atencion=consulta.get('causaMotivoAtencion', ''),
                    cod_diagnostico_principal=consulta.get('codDiagnosticoPrincipal', ''),
                    cod_diagnostico_relacionado1=consulta.get('codDiagnosticoRelacionado1', ''),
                    cod_diagnostico_relacionado2=consulta.get('codDiagnosticoRelacionado2', ''),
                    cod_diagnostico_relacionado3=consulta.get('codDiagnosticoRelacionado3', ''),
                    tipo_diagnostico_principal=consulta.get('tipoDiagnosticoPrincipal', ''),
                    tipo_documento_profesional=consulta.get('tipoDocumentoIdentificacion', ''),
                    num_documento_profesional=consulta.get('numDocumentoIdentificacion', ''),
                    vr_servicio=Decimal(str(consulta.get('vrServicio', 0))),
                    concepto_recaudo=consulta.get('tipoPagoModerador', ''),
                    valor_pago_moderador=Decimal(str(consulta.get('valorPagoModerador', 0))),
                    num_fev_pago_moderador=consulta.get('numFEVPagoModerador', ''),
                    consecutivo=consulta.get('consecutivo', idx + 1)
                )
                batch_consultas.append(consulta_obj)
            except Exception as e:
                logger.error(f"Error procesando consulta {idx}: {str(e)}")
        
        if batch_consultas:
            RIPSConsulta.objects.bulk_create(batch_consultas)
            servicios_totales += len(batch_consultas)
        
        # Procesar procedimientos
        procedimientos = servicios_data.get('procedimientos', [])
        batch_procedimientos = []
        for idx, proc in enumerate(procedimientos):
            try:
                fecha_str = proc.get('fechaInicioAtencion', '')
                fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else None
                
                proc_obj = RIPSProcedimiento(
                    transaccion_id=transaccion_id,
                    usuario_id=usuario_id or '',
                    num_factura=num_factura,
                    num_documento_usuario=num_documento_usuario,
                    cod_prestador=proc.get('codPrestador', ''),
                    fecha_inicio_atencion=fecha_atencion,
                    id_mipres=proc.get('idMIPRES', ''),
                    num_autorizacion=proc.get('numAutorizacion', ''),
                    cod_procedimiento=proc.get('codProcedimiento', ''),
                    via_ingreso_servicio_salud=proc.get('viaIngresoServicioSalud', ''),
                    modalidad_grupo_servicio_tec_sal=proc.get('modalidadGrupoServicioTecSal', ''),
                    grupo_servicios=proc.get('grupoServicios', ''),
                    cod_servicio=int(proc.get('codServicio', 0)),
                    finalidad_tecnologia_salud=proc.get('finalidadTecnologiaSalud', ''),
                    tipo_documento_profesional=proc.get('tipoDocumentoIdentificacion', ''),
                    num_documento_profesional=proc.get('numDocumentoIdentificacion', ''),
                    cod_diagnostico_principal=proc.get('codDiagnosticoPrincipal', ''),
                    cod_diagnostico_relacionado=proc.get('codDiagnosticoRelacionado', ''),
                    cod_complicacion=proc.get('codComplicacion', ''),
                    vr_servicio=Decimal(str(proc.get('vrServicio', 0))),
                    concepto_recaudo=proc.get('tipoPagoModerador', ''),
                    valor_pago_moderador=Decimal(str(proc.get('valorPagoModerador', 0))),
                    num_fev_pago_moderador=proc.get('numFEVPagoModerador', ''),
                    consecutivo=proc.get('consecutivo', idx + 1)
                )
                batch_procedimientos.append(proc_obj)
            except Exception as e:
                logger.error(f"Error procesando procedimiento {idx}: {str(e)}")
        
        if batch_procedimientos:
            RIPSProcedimiento.objects.bulk_create(batch_procedimientos)
            servicios_totales += len(batch_procedimientos)
        
        # Procesar medicamentos
        medicamentos = servicios_data.get('medicamentos', [])
        batch_medicamentos = []
        for idx, med in enumerate(medicamentos):
            try:
                fecha_str = med.get('fechaDispensAdmon', '')
                fecha_dispensacion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else None
                
                med_obj = RIPSMedicamentos(
                    transaccion_id=transaccion_id,
                    usuario_id=usuario_id or '',
                    num_factura=num_factura,
                    num_documento_usuario=num_documento_usuario,
                    cod_prestador=med.get('codPrestador', ''),
                    num_autorizacion=med.get('numAutorizacion', ''),
                    id_mipres=med.get('idMIPRES', ''),
                    fecha_dispensacion=fecha_dispensacion,
                    cod_diagnostico_principal=med.get('codDiagnosticoPrincipal', ''),
                    cod_diagnostico_relacionado=med.get('codDiagnosticoRelacionado', ''),
                    tipo_medicamento=med.get('tipoMedicamento', ''),
                    cod_tecnologia_salud=med.get('codTecnologiaSalud', ''),
                    nom_tecnologia_salud=med.get('nomTecnologiaSalud', ''),
                    concentracion_medicamento=med.get('concentracionMedicamento', ''),
                    unidad_medida=med.get('unidadMedida', ''),
                    forma_farmaceutica=med.get('formaFarmaceutica', ''),
                    unidad_min_dispensacion=med.get('unidadMinDispensa', ''),
                    cantidad_medicamento=Decimal(str(med.get('cantidadMedicamento', 0))),
                    dias_tratamiento=int(med.get('diasTratamiento', 0)),
                    vr_unit_medicamento=Decimal(str(med.get('vrUnitMedicamento', 0))),
                    vr_servicio=Decimal(str(med.get('vrServicio', 0))),
                    concepto_recaudo=med.get('tipoPagoModerador', ''),
                    valor_pago_moderador=Decimal(str(med.get('valorPagoModerador', 0))),
                    num_fev_pago_moderador=med.get('numFEVPagoModerador', ''),
                    consecutivo=med.get('consecutivo', idx + 1)
                )
                batch_medicamentos.append(med_obj)
            except Exception as e:
                logger.error(f"Error procesando medicamento {idx}: {str(e)}")
        
        if batch_medicamentos:
            RIPSMedicamentos.objects.bulk_create(batch_medicamentos)
            servicios_totales += len(batch_medicamentos)
        
        # Procesar urgencias
        urgencias = servicios_data.get('urgencias', [])
        if urgencias:
            # NOTE: Ya no se necesita - servicios embebidos
            batch_urgencias = []
            for idx, urg in enumerate(urgencias):
                try:
                    fecha_str = urg.get('fechaInicioAtencion', '')
                    fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else None
                    fecha_egreso_str = urg.get('fechaEgreso', '')
                    fecha_egreso = datetime.fromisoformat(fecha_egreso_str.replace(' ', 'T')) if fecha_egreso_str else None
                    
                    urg_obj = RIPSUrgencias(
                        transaccion_id=transaccion_id,
                        usuario_id=usuario_id or '',
                        num_factura=num_factura,
                        num_documento_usuario=num_documento_usuario,
                        cod_prestador=urg.get('codPrestador', ''),
                        fecha_inicio_atencion=fecha_atencion,
                        causa_motivo_atencion=urg.get('causaMotivoAtencion', ''),
                        cod_diagnostico_principal=urg.get('codDiagnosticoPrincipal', ''),
                        cod_diagnostico_principal_e=urg.get('codDiagnosticoPrincipalE', ''),
                        cod_diagnostico_relacionado_e1=urg.get('codDiagnosticoRelacionadoE1', ''),
                        cod_diagnostico_relacionado_e2=urg.get('codDiagnosticoRelacionadoE2', ''),
                        cod_diagnostico_relacionado_e3=urg.get('codDiagnosticoRelacionadoE3', ''),
                        condicion_destino_usuario_egreso=urg.get('condicionDestino', ''),
                        cod_diagnostico_causa_muerte=urg.get('codDiagnosticoCausaMuerte', ''),
                        fecha_egreso=fecha_egreso,
                        consecutivo=urg.get('consecutivo', idx + 1)
                    )
                    batch_urgencias.append(urg_obj)
                except Exception as e:
                    logger.error(f"Error procesando urgencia {idx}: {str(e)}")
            
            if batch_urgencias:
                RIPSUrgencias.objects.bulk_create(batch_urgencias)
                servicios_totales += len(batch_urgencias)
        
        # Procesar hospitalización
        hospitalizacion = servicios_data.get('hospitalizacion', [])
        if hospitalizacion:
            # NOTE: Ya no se necesita - servicios embebidos
            batch_hospitalizacion = []
            for idx, hosp in enumerate(hospitalizacion):
                try:
                    fecha_str = hosp.get('fechaInicioAtencion', '')
                    fecha_atencion = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else None
                    fecha_egreso_str = hosp.get('fechaEgreso', '')
                    fecha_egreso = datetime.fromisoformat(fecha_egreso_str.replace(' ', 'T')) if fecha_egreso_str else None
                    
                    hosp_obj = RIPSHospitalizacion(
                        transaccion_id=transaccion_id,
                        usuario_id=usuario_id or '',
                        num_factura=num_factura,
                        num_documento_usuario=num_documento_usuario,
                        cod_prestador=hosp.get('codPrestador', ''),
                        via_ingreso_servicio_salud=hosp.get('viaIngresoServicioSalud', ''),
                        fecha_inicio_atencion=fecha_atencion,
                        num_autorizacion=hosp.get('numAutorizacion', ''),
                        causa_motivo_atencion=hosp.get('causaMotivoAtencion', ''),
                        cod_diagnostico_principal=hosp.get('codDiagnosticoPrincipal', ''),
                        cod_diagnostico_principal_e=hosp.get('codDiagnosticoPrincipalE', ''),
                        cod_diagnostico_relacionado_e1=hosp.get('codDiagnosticoRelacionadoE1', ''),
                        cod_diagnostico_relacionado_e2=hosp.get('codDiagnosticoRelacionadoE2', ''),
                        cod_diagnostico_relacionado_e3=hosp.get('codDiagnosticoRelacionadoE3', ''),
                        cod_complicacion=hosp.get('codComplicacion', ''),
                        condicion_destino_usuario_egreso=hosp.get('condicionDestinoUsuarioEgreso', ''),
                        cod_diagnostico_muerte=hosp.get('codDiagnosticoMuerte', ''),
                        fecha_egreso=fecha_egreso,
                        consecutivo=hosp.get('consecutivo', idx + 1)
                    )
                    batch_hospitalizacion.append(hosp_obj)
                except Exception as e:
                    logger.error(f"Error procesando hospitalización {idx}: {str(e)}")
            
            if batch_hospitalizacion:
                RIPSHospitalizacion.objects.bulk_create(batch_hospitalizacion)
                servicios_totales += len(batch_hospitalizacion)
        
        # Procesar otros servicios
        otros_servicios = servicios_data.get('otrosServicios', [])
        if otros_servicios:
            # NOTE: Ya no se necesita - servicios embebidos
            batch_otros = []
            for idx, otro in enumerate(otros_servicios):
                try:
                    fecha_str = otro.get('fechaSuministroTecnologia', '')
                    fecha_suministro = datetime.fromisoformat(fecha_str.replace(' ', 'T')) if fecha_str else None
                    
                    otro_obj = RIPSOtrosServicios(
                        transaccion_id=transaccion_id,
                        usuario_id=usuario_id or '',
                        num_factura=num_factura,
                        num_documento_usuario=otro.get('numDocumentoIdentificacion', num_documento_usuario),
                        cod_prestador=otro.get('codPrestador', ''),
                        num_autorizacion=otro.get('numAutorizacion', ''),
                        id_mipres=otro.get('idMIPRES', ''),
                        fecha_suministro_tecnologia=fecha_suministro,
                        tipo_os=otro.get('tipoOS', ''),
                        cod_tecnologia_salud=otro.get('codTecnologiaSalud', ''),
                        nom_tecnologia_salud=otro.get('nomTecnologiaSalud', ''),
                        cantidad_os=Decimal(str(otro.get('cantidadOS', 0))),
                        tipo_documento_profesional=otro.get('tipoDocumentoIdentificacion', ''),
                        num_documento_profesional=otro.get('numDocumentoIdentificacion', ''),
                        vr_unit_os=Decimal(str(otro.get('vrUnitOS', 0))),
                        vr_servicio=Decimal(str(otro.get('vrServicio', 0))),
                        concepto_recaudo=otro.get('tipoPagoModerador', ''),
                        valor_pago_moderador=Decimal(str(otro.get('valorPagoModerador', 0))),
                        num_fev_pago_moderador=otro.get('numFEVPagoModerador', ''),
                        consecutivo=otro.get('consecutivo', idx + 1)
                    )
                    batch_otros.append(otro_obj)
                except Exception as e:
                    logger.error(f"Error procesando otro servicio {idx}: {str(e)}")
            
            if batch_otros:
                RIPSOtrosServicios.objects.bulk_create(batch_otros)
                servicios_totales += len(batch_otros)
        
        # Procesar recién nacidos
        recien_nacidos = servicios_data.get('recienNacidos', [])
        if recien_nacidos:
            # NOTE: Ya no se necesita - servicios embebidos
            batch_nacidos = []
            for idx, nacido in enumerate(recien_nacidos):
                try:
                    fecha_nac_str = nacido.get('fechaNacimiento', '')
                    fecha_nacimiento = datetime.fromisoformat(fecha_nac_str.replace(' ', 'T')) if fecha_nac_str else None
                    fecha_egreso_str = nacido.get('fechaEgreso', '')
                    fecha_egreso = datetime.fromisoformat(fecha_egreso_str.replace(' ', 'T')) if fecha_egreso_str else None
                    
                    nacido_obj = RIPSRecienNacidos(
                        transaccion_id=transaccion_id,
                        usuario_id=usuario_id or '',
                        num_factura=num_factura,
                        num_documento_usuario=num_documento_usuario,  # Documento de la madre
                        cod_prestador=nacido.get('codPrestador', ''),
                        tipo_documento_identificacion=nacido.get('tipoDocumentoIdentificacion', 'RC'),
                        num_documento_identificacion=nacido.get('numDocumentoIdentificacion', ''),
                        fecha_nacimiento=fecha_nacimiento,
                        edad_gestacional=int(nacido.get('edadGestacional', 0)),
                        num_consultas_c_prenatal=int(nacido.get('numConsultasCPrenatal', 0)),
                        cod_sexo_biologico=nacido.get('codSexoBiologico', ''),
                        peso=int(nacido.get('peso', 0)),
                        cod_diagnostico_principal=nacido.get('codDiagnosticoPrincipal', ''),
                        condicion_destino_usuario_egreso=nacido.get('condicionDestino', ''),
                        cod_diagnostico_causa_muerte=nacido.get('codDiagnosticoCausaMuerte', ''),
                        fecha_egreso=fecha_egreso,
                        consecutivo=nacido.get('consecutivo', idx + 1)
                    )
                    batch_nacidos.append(nacido_obj)
                except Exception as e:
                    logger.error(f"Error procesando recién nacido {idx}: {str(e)}")
            
            if batch_nacidos:
                RIPSRecienNacidos.objects.bulk_create(batch_nacidos)
                servicios_totales += len(batch_nacidos)
        
        return servicios_totales
    
    def _validar_rips_json(self, file) -> Dict[str, Any]:
        """
        Valida estructura básica de RIPS JSON según estándar MinSalud
        """
        resultado = {
            'valido': True, 
            'errores': [], 
            'warnings': [],
            'metadata': {}  # Inicializar metadata vacío desde el principio
        }
        
        try:
            # Leer y parsear JSON
            content = file.read()
            file.seek(0)
            data = json.loads(content)
            
            # Validar estructura básica RIPS - debe ser un objeto
            if not isinstance(data, dict):
                resultado['valido'] = False
                resultado['errores'].append('RIPS debe ser un objeto JSON')
                return resultado
            
            # Elementos requeridos en RIPS (con nombres correctos)
            elementos_requeridos = {
                'numDocumentoIdObligado': 'NIT del prestador',
                'numFactura': 'Número de factura',  # Corregido: numFactura, no numeroFactura
                'usuarios': 'Array de usuarios'
            }
            
            for campo, descripcion in elementos_requeridos.items():
                if campo not in data:
                    resultado['valido'] = False
                    resultado['errores'].append(f'Falta campo obligatorio: {campo} ({descripcion})')
            
            # Extraer metadata básica
            if 'numDocumentoIdObligado' in data:
                resultado['metadata']['nit_prestador'] = str(data['numDocumentoIdObligado']).strip()
            
            if 'numFactura' in data:
                resultado['metadata']['numero_factura'] = str(data['numFactura']).strip()
            
            resultado['metadata']['tipo_nota'] = data.get('tipoNota', '')
            resultado['metadata']['numero_nota'] = data.get('numNota', '')
            
            # Inicializar contadores
            total_usuarios = 0
            conteo_servicios_global = {
                'consultas': 0,
                'procedimientos': 0,
                'urgencias': 0,
                'hospitalizacion': 0,
                'recienNacidos': 0,
                'medicamentos': 0,
                'otrosServicios': 0
            }
            
            # Validar usuarios
            if 'usuarios' in data:
                if not isinstance(data['usuarios'], list):
                    resultado['valido'] = False
                    resultado['errores'].append('usuarios debe ser un array')
                else:
                    usuarios = data['usuarios']
                    total_usuarios = len(usuarios)
                    
                    # Validar estructura de cada usuario
                    for idx, usuario in enumerate(usuarios):
                        if not isinstance(usuario, dict):
                            resultado['errores'].append(f'Usuario {idx} debe ser un objeto')
                            continue
                        
                        # Campos mínimos de usuario
                        campos_usuario_requeridos = {
                            'tipoDocumentoIdentificacion': 'Tipo de documento',
                            'numDocumentoIdentificacion': 'Número de documento'  # Corregido: num, no numero
                        }
                        
                        for campo, descripcion in campos_usuario_requeridos.items():
                            if campo not in usuario:
                                resultado['warnings'].append(f'Usuario {idx}: falta {campo} ({descripcion})')
                        
                        # Los servicios están DENTRO de cada usuario, no al nivel raíz
                        if 'servicios' in usuario:
                            if not isinstance(usuario['servicios'], dict):
                                resultado['errores'].append(f'Usuario {idx}: servicios debe ser un objeto')
                            else:
                                # Contar servicios por tipo para este usuario
                                servicios_usuario = usuario['servicios']
                                for tipo_servicio in conteo_servicios_global.keys():
                                    if tipo_servicio in servicios_usuario:
                                        if isinstance(servicios_usuario[tipo_servicio], list):
                                            conteo_servicios_global[tipo_servicio] += len(servicios_usuario[tipo_servicio])
                                        else:
                                            resultado['warnings'].append(f'Usuario {idx}: {tipo_servicio} debe ser un array')
                        else:
                            resultado['warnings'].append(f'Usuario {idx}: no tiene objeto servicios')
            
            # Calcular total de servicios
            total_servicios = sum(conteo_servicios_global.values())
            
            # Actualizar metadata con los totales
            resultado['metadata']['total_usuarios'] = total_usuarios
            resultado['metadata']['servicios_por_tipo'] = conteo_servicios_global
            resultado['metadata']['total_servicios'] = total_servicios
            
            # Validaciones adicionales
            if total_usuarios == 0:
                resultado['warnings'].append('No hay usuarios en el RIPS')
            
            if total_servicios == 0:
                resultado['warnings'].append('No se encontraron servicios en el RIPS')
            
            # Guardar los datos completos del RIPS para procesamiento posterior
            resultado['rips_data'] = data
            
            logger.info(f"RIPS validado: {total_usuarios} usuarios, {total_servicios} servicios, NIT: {resultado['metadata'].get('nit_prestador', 'N/A')}")
            
        except json.JSONDecodeError as e:
            resultado['valido'] = False
            resultado['errores'].append(f'JSON mal formado: {str(e)}')
        except Exception as e:
            resultado['valido'] = False
            resultado['errores'].append(f'Error validando RIPS: {str(e)}')
            logger.error(f"Error completo validando RIPS: {str(e)}", exc_info=True)
        
        return resultado
    
    def _validar_y_clasificar_soporte(self, file) -> Dict[str, Any]:
        """
        Valida y clasifica soportes PDF según nomenclatura oficial
        """
        resultado = {'valido': True, 'errores': [], 'warnings': []}
        
        try:
            # Caso especial: CUV (archivo JSON)
            if 'CUV' in file.name.upper() and (file.name.lower().endswith('.json') or file.name.lower().endswith('.txt')):
                logger.info(f"📋 Procesando archivo CUV: {file.name}")
                resultado['info_clasificacion'] = {
                    'codigo': 'CUV',
                    'categoria': 'DOCUMENTOS_BASICOS',
                    'nombre': 'Código Único de Validación MinSalud',
                    'es_valido': True,
                    'errores': []
                }
                resultado['metadata'] = {'tipo_archivo': 'CUV'}
                return resultado
            
            # Clasificar según nomenclatura
            info_clasificacion = self.classifier.classify_soporte_type(file.name)
            resultado['info_clasificacion'] = info_clasificacion
            
            # Validar nomenclatura
            if not info_clasificacion['es_valido']:
                resultado['warnings'].extend(info_clasificacion.get('errores', []))
            
            # Validar que sea PDF
            if not file.name.lower().endswith('.pdf'):
                resultado['valido'] = False
                resultado['errores'].append('Soportes deben ser archivos PDF')
                return resultado
            
            # Validar PDF básico
            try:
                pdf_reader = PyPDF2.PdfReader(file)
                num_paginas = len(pdf_reader.pages)
                
                resultado['metadata'] = {
                    'numero_paginas': num_paginas,
                    'codigo_soporte': info_clasificacion['codigo'],
                    'categoria': info_clasificacion['categoria'],
                    'nombre_tipo': info_clasificacion['nombre'],
                    'es_multiusuario': info_clasificacion.get('es_multiusuario', False)
                }
                
                # Verificar que no esté encriptado
                if pdf_reader.is_encrypted:
                    resultado['warnings'].append('PDF está encriptado')
                
                # Verificar tamaño razonable (máx 50MB)
                if file.size > 50 * 1024 * 1024:
                    resultado['warnings'].append('Archivo muy grande (>50MB)')
                
            except Exception as e:
                resultado['valido'] = False
                resultado['errores'].append(f'PDF corrupto o inválido: {str(e)}')
            
        except Exception as e:
            resultado['valido'] = False
            resultado['errores'].append(f'Error clasificando soporte: {str(e)}')
        
        return resultado
    
    def almacenar_multiples_archivos(self, archivos: Dict[str, Any]) -> Dict[str, List[Dict]]:
        """
        Almacena múltiples archivos de una radicación
        
        Args:
            archivos: Dict con llaves 'factura_xml', 'rips_json', 'soportes'
            
        Returns:
            Dict con resultados por tipo de archivo
        """
        logger.info(f"🔷 almacenar_multiples_archivos recibió: {list(archivos.keys())}")
        logger.info(f"🔷 StorageService tiene radicacion_id: {hasattr(self, 'radicacion_id') and self.radicacion_id}")
        for key, value in archivos.items():
            if key == 'soportes':
                logger.info(f"  - {key}: {len(value) if isinstance(value, list) else 'no es lista'} archivos")
            else:
                logger.info(f"  - {key}: {'Presente' if value else 'Ausente'} - {type(value).__name__}")
                if value and hasattr(value, 'name'):
                    logger.info(f"    Nombre: {value.name}, Tamaño: {value.size}")
        
        resultados = {
            'factura': None,
            'rips': None,
            'soportes': [],
            'resumen': {
                'total_archivos': 0,
                'archivos_validos': 0,
                'archivos_con_errores': 0,
                'archivos_con_warnings': 0,
                'errores': 0,  # Para compatibilidad
                'archivos_almacenados': 0
            }
        }
        
        # Procesar factura XML
        if 'factura_xml' in archivos:
            resultado_factura = self.validar_y_almacenar_archivo(
                archivos['factura_xml'], 'xml'
            )
            resultados['factura'] = resultado_factura
            resultados['resumen']['total_archivos'] += 1
            if resultado_factura['valido']:
                resultados['resumen']['archivos_validos'] += 1
            if resultado_factura['errores']:
                resultados['resumen']['archivos_con_errores'] += 1
                resultados['resumen']['errores'] += 1
            if resultado_factura['warnings']:
                resultados['resumen']['archivos_con_warnings'] += 1
            if resultado_factura.get('almacenado', False):
                resultados['resumen']['archivos_almacenados'] += 1
                logger.info(f"✅ Factura XML marcada como almacenada")
        
        # Procesar RIPS JSON
        if 'rips_json' in archivos and archivos['rips_json']:
            logger.info("📝 Procesando RIPS JSON...")
            resultado_rips = self.validar_y_almacenar_archivo(
                archivos['rips_json'], 'rips'
            )
            resultados['rips'] = resultado_rips
            resultados['resumen']['total_archivos'] += 1
            if resultado_rips['valido']:
                resultados['resumen']['archivos_validos'] += 1
            if resultado_rips['errores']:
                resultados['resumen']['archivos_con_errores'] += 1
                resultados['resumen']['errores'] += 1
                logger.error(f"❌ RIPS con errores: {resultado_rips['errores']}")
            if resultado_rips['warnings']:
                resultados['resumen']['archivos_con_warnings'] += 1
            if resultado_rips.get('almacenado', False):
                resultados['resumen']['archivos_almacenados'] += 1
                logger.info(f"✅ RIPS JSON marcado como almacenado")
                
                # Si el RIPS se almacenó correctamente y tenemos radicacion_id,
                # procesar y guardar usuarios/servicios en MongoDB
                if hasattr(self, 'radicacion_id') and self.radicacion_id:
                    try:
                        rips_data = resultado_rips.get('rips_data')
                        if rips_data:
                            logger.info(f"🔄 Procesando usuarios y servicios del RIPS para auditoría...")
                            procesamiento_resultado = self.procesar_y_guardar_rips(
                                rips_data,
                                self.radicacion_id,
                                resultado_rips.get('path_almacenamiento', '')
                            )
                            resultado_rips['procesamiento_mongodb'] = procesamiento_resultado
                            logger.info(f"✅ RIPS procesado en MongoDB: {procesamiento_resultado['usuarios_procesados']} usuarios")
                    except Exception as e:
                        logger.error(f"Error procesando RIPS en MongoDB: {str(e)}")
                        resultado_rips['warnings'].append(f"No se pudo procesar RIPS en MongoDB: {str(e)}")
            else:
                logger.warning(f"⚠️ RIPS JSON NO se almacenó. Válido: {resultado_rips['valido']}")
        
        # Procesar soportes adicionales
        if 'soportes' in archivos:
            soportes_list = archivos['soportes']
            if not isinstance(soportes_list, list):
                soportes_list = [soportes_list]
            
            logger.info(f"📎 Procesando {len(soportes_list)} soportes adicionales...")
            for idx, soporte in enumerate(soportes_list):
                logger.info(f"  - Procesando soporte {idx+1}: {soporte.name if hasattr(soporte, 'name') else 'sin nombre'}")
                resultado_soporte = self.validar_y_almacenar_archivo(
                    soporte, 'soporte'
                )
                # Asegurar estructura completa para soportes
                if 'info_clasificacion' in resultado_soporte:
                    resultado_soporte['clasificacion'] = resultado_soporte['info_clasificacion']
                    resultado_soporte['nombre_archivo'] = soporte.name if hasattr(soporte, 'name') else 'sin_nombre'
                    resultado_soporte['url'] = resultado_soporte.get('url_almacenamiento', '')
                
                resultados['soportes'].append(resultado_soporte)
                resultados['resumen']['total_archivos'] += 1
                if resultado_soporte['valido']:
                    resultados['resumen']['archivos_validos'] += 1
                if resultado_soporte['errores']:
                    resultados['resumen']['archivos_con_errores'] += 1
                    resultados['resumen']['errores'] += 1
                    logger.error(f"    ❌ Soporte con errores: {resultado_soporte['errores']}")
                if resultado_soporte['warnings']:
                    resultados['resumen']['archivos_con_warnings'] += 1
                if resultado_soporte.get('almacenado', False):
                    resultados['resumen']['archivos_almacenados'] += 1
                    logger.info(f"    ✅ Soporte almacenado correctamente")
                else:
                    logger.warning(f"    ⚠️ Soporte NO almacenado. Válido: {resultado_soporte['valido']}")
        
        # Agregar estadísticas de clasificación
        if resultados['soportes']:
            estadisticas = self.classifier.generar_estadisticas(
                [s['info_clasificacion'] for s in resultados['soportes']]
            )
            resultados['resumen']['estadisticas_clasificacion'] = estadisticas
        
        # Log final de resumen
        logger.info(f"📊 Resumen almacenamiento: {resultados['resumen']['archivos_almacenados']} de {resultados['resumen']['total_archivos']} archivos almacenados exitosamente")
        
        return resultados
    
    def obtener_url_firmada(self, path: str, expiracion_segundos: int = 3600) -> str:
        """
        Genera una URL firmada para acceso temporal a un archivo
        
        Args:
            path: Path del archivo en el storage
            expiracion_segundos: Tiempo de validez de la URL (default 1 hora)
            
        Returns:
            URL firmada
        """
        try:
            # Configurar expiración temporal
            self.storage.querystring_expire = expiracion_segundos
            
            # Generar URL firmada
            url = self.storage.url(path)
            
            # Restaurar expiración por defecto
            self.storage.querystring_expire = 3600
            
            return url
            
        except Exception as e:
            logger.error(f"Error generando URL firmada: {str(e)}")
            return None
    
    def eliminar_archivo(self, path: str) -> bool:
        """
        Elimina un archivo del storage
        
        Args:
            path: Path del archivo a eliminar
            
        Returns:
            True si se eliminó correctamente
        """
        try:
            self.storage.delete(path)
            logger.info(f"Archivo eliminado: {path}")
            return True
        except Exception as e:
            logger.error(f"Error eliminando archivo: {str(e)}")
            return False