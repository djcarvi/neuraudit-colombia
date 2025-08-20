"""
Servicios para Radicación de Cuentas Médicas - NeurAudit Colombia

Servicios de validación y procesamiento según estructuras reales
basadas en los archivos de muestra A01E5687
"""

import json
import xml.etree.ElementTree as ET
import hashlib
import boto3
from django.conf import settings
from django.utils import timezone
from django.core.files.storage import default_storage
from .models import RadicacionCuentaMedica, DocumentoSoporte, ValidacionRIPS
import requests
import logging

logger = logging.getLogger('apps.radicacion')


class DocumentStorageService:
    """
    Servicio para almacenamiento de documentos en Digital Ocean Spaces
    """
    
    def __init__(self):
        self.client = boto3.client(
            's3',
            aws_access_key_id=settings.DO_SPACES_ACCESS_KEY,
            aws_secret_access_key=settings.DO_SPACES_SECRET_KEY,
            endpoint_url=settings.DO_SPACES_ENDPOINT_URL,
            region_name=settings.DO_SPACES_REGION
        )
        self.bucket_name = settings.DO_SPACES_BUCKET_NAME
    
    def upload_document(self, file, file_path, content_type='application/octet-stream'):
        """
        Sube documento a Digital Ocean Spaces
        """
        try:
            # Subir archivo
            self.client.upload_fileobj(
                file,
                self.bucket_name,
                file_path,
                ExtraArgs={
                    'ContentType': content_type,
                    'ACL': 'private'  # Solo acceso privado
                }
            )
            
            # Retornar URL
            url = f"{settings.DO_SPACES_ENDPOINT_URL}/{self.bucket_name}/{file_path}"
            return url
            
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            raise Exception(f"Error al subir documento: {str(e)}")
    
    def delete_document(self, file_path):
        """
        Elimina documento de Digital Ocean Spaces
        """
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=file_path)
            return True
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            return False
    
    def generate_file_path(self, radicacion, tipo_documento, filename):
        """
        Genera ruta del archivo siguiendo nomenclatura de Resolución 2284
        """
        year = timezone.now().year
        month = timezone.now().month
        
        # Estructura: /year/month/nit/radicado/tipo_documento/filename
        return f"{year}/{month:02d}/{radicacion.pss_nit}/{radicacion.numero_radicado}/{tipo_documento}/{filename}"


class RIPSValidationService:
    """
    Servicio para validación de RIPS según estructura real del archivo A01E5687.json
    """
    
    @staticmethod
    def validate_rips_structure(rips_content):
        """
        Valida estructura RIPS basada en el ejemplo real A01E5687.json
        """
        try:
            rips_data = json.loads(rips_content) if isinstance(rips_content, str) else rips_content
            
            errors = []
            warnings = []
            
            # Validar campos obligatorios nivel raíz
            required_root_fields = ['numDocumentoIdObligado', 'numFactura', 'usuarios']
            for field in required_root_fields:
                if field not in rips_data:
                    errors.append(f"Campo obligatorio faltante: {field}")
            
            # Validar estructura de usuarios
            if 'usuarios' in rips_data and isinstance(rips_data['usuarios'], list):
                total_registros = len(rips_data['usuarios'])
                registros_validos = 0
                
                for i, usuario in enumerate(rips_data['usuarios']):
                    registro_errors = RIPSValidationService._validate_usuario_structure(usuario, i)
                    errors.extend(registro_errors)
                    
                    if not registro_errors:
                        registros_validos += 1
                
                return {
                    'es_valido': len(errors) == 0,
                    'errores_encontrados': errors,
                    'advertencias': warnings,
                    'total_registros': total_registros,
                    'registros_validos': registros_validos,
                    'registros_con_errores': total_registros - registros_validos,
                    'estructura_valida': True
                }
            else:
                errors.append("Campo 'usuarios' debe ser una lista")
                
            return {
                'es_valido': False,
                'errores_encontrados': errors,
                'advertencias': warnings,
                'total_registros': 0,
                'registros_validos': 0,
                'registros_con_errores': 0,
                'estructura_valida': False
            }
            
        except json.JSONDecodeError as e:
            return {
                'es_valido': False,
                'errores_encontrados': [f"JSON inválido: {str(e)}"],
                'advertencias': [],
                'total_registros': 0,
                'registros_validos': 0,
                'registros_con_errores': 0,
                'estructura_valida': False
            }
        except Exception as e:
            return {
                'es_valido': False,
                'errores_encontrados': [f"Error de validación: {str(e)}"],
                'advertencias': [],
                'total_registros': 0,
                'registros_validos': 0,
                'registros_con_errores': 0,
                'estructura_valida': False
            }
    
    @staticmethod
    def _validate_usuario_structure(usuario, index):
        """
        Valida estructura de usuario según ejemplo A01E5687.json
        """
        errors = []
        
        # Campos obligatorios del usuario
        required_fields = [
            'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion', 
            'tipoUsuario', 'fechaNacimiento', 'codSexo', 'consecutivo'
        ]
        
        for field in required_fields:
            if field not in usuario:
                errors.append(f"Usuario {index}: Campo obligatorio '{field}' faltante")
        
        # Validar servicios si existen
        if 'servicios' in usuario:
            if 'procedimientos' in usuario['servicios']:
                for j, proc in enumerate(usuario['servicios']['procedimientos']):
                    proc_errors = RIPSValidationService._validate_procedimiento_structure(proc, index, j)
                    errors.extend(proc_errors)
        
        return errors
    
    @staticmethod
    def _validate_procedimiento_structure(procedimiento, usuario_index, proc_index):
        """
        Valida estructura de procedimiento según ejemplo
        """
        errors = []
        
        required_fields = [
            'codPrestador', 'fechaInicioAtencion', 'codProcedimiento',
            'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
            'codDiagnosticoPrincipal', 'vrServicio', 'consecutivo'
        ]
        
        for field in required_fields:
            if field not in procedimiento:
                errors.append(f"Usuario {usuario_index}, Procedimiento {proc_index}: Campo '{field}' faltante")
        
        return errors
    
    @staticmethod
    def validate_with_minsalud_api(rips_content):
        """
        Valida RIPS con API del MinSalud (simulado por ahora)
        """
        # Por ahora simulamos la validación, después implementar API real
        validation_url = settings.NEURAUDIT_SETTINGS.get('RIPS_VALIDATION_URL')
        
        if not validation_url:
            return {
                'codigo_validacion': 'SIM-' + hashlib.md5(str(timezone.now()).encode()).hexdigest()[:8],
                'estado': 'VALIDO',
                'respuesta_api': {'status': 'simulated', 'message': 'Validación simulada exitosa'}
            }
        
        try:
            # Implementar llamada real a API MinSalud cuando esté disponible
            response = requests.post(
                validation_url,
                json={'rips_data': rips_content},
                timeout=30
            )
            
            if response.status_code == 200:
                api_response = response.json()
                return {
                    'codigo_validacion': api_response.get('codigo_validacion'),
                    'estado': api_response.get('estado', 'VALIDO'),
                    'respuesta_api': api_response
                }
            else:
                return {
                    'codigo_validacion': None,
                    'estado': 'ERROR',
                    'respuesta_api': {'error': f'HTTP {response.status_code}'}
                }
                
        except Exception as e:
            logger.error(f"Error validating RIPS with MinSalud API: {str(e)}")
            return {
                'codigo_validacion': None,
                'estado': 'ERROR',
                'respuesta_api': {'error': str(e)}
            }


class FacturaValidationService:
    """
    Servicio para validación de facturas electrónicas según estructura XML real
    """
    
    @staticmethod
    def validate_factura_structure(xml_content, numero_factura_esperado=None):
        """
        Valida estructura de factura electrónica basada en A01E5687.xml
        Incluye validación de coincidencia de número de factura
        """
        try:
            # Parsear XML
            root = ET.fromstring(xml_content)
            
            errors = []
            warnings = []
            
            # Namespaces según estructura real
            namespaces = {
                'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                'cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2'
            }
            
            # Validar elementos obligatorios
            required_elements = [
                ('.//cbc:ID', 'Número de factura'),
                ('.//cbc:IssueDate', 'Fecha de emisión'),
                ('.//cbc:DocumentCurrencyCode', 'Código de moneda'),
                ('.//cac:AccountingSupplierParty', 'Proveedor'),
                ('.//cac:AccountingCustomerParty', 'Cliente'),
                ('.//cac:LegalMonetaryTotal', 'Totales monetarios')
            ]
            
            for xpath, description in required_elements:
                if root.find(xpath, namespaces) is None:
                    errors.append(f"Elemento obligatorio faltante: {description}")
            
            # Validar firma digital
            signature_elements = root.findall('.//ds:Signature', {'ds': 'http://www.w3.org/2000/09/xmldsig#'})
            if not signature_elements:
                errors.append("Factura no tiene firma digital")
            
            # Validar CUFE
            cufe_element = root.find('.//cbc:UUID[@schemeName="CUFE-SHA384"]', namespaces)
            if cufe_element is None:
                errors.append("CUFE no encontrado")
            
            # Extraer información clave
            factura_info = FacturaValidationService._extract_factura_info(root, namespaces)
            
            # VALIDACIÓN CRÍTICA: Verificar coincidencia de número de factura
            if numero_factura_esperado and factura_info.get('numero'):
                # Limpiar números para comparación (quitar prefijos si existen)
                numero_xml = factura_info['numero'].strip()
                numero_esperado = numero_factura_esperado.strip()
                
                if numero_xml != numero_esperado:
                    errors.insert(0, f"CRÍTICO: Número de factura no coincide. XML: {numero_xml}, Esperado: {numero_esperado}")
                    logger.error(f"Número de factura no coincide - XML: {numero_xml}, Esperado: {numero_esperado}")
                else:
                    logger.info(f"Número de factura validado correctamente: {numero_xml}")
            
            return {
                'estructura_valida': len(errors) == 0,
                'errores': errors,
                'advertencias': warnings,
                'factura_info': factura_info,
                'numero_factura_validado': numero_factura_esperado == factura_info.get('numero') if numero_factura_esperado else None
            }
            
        except ET.ParseError as e:
            return {
                'estructura_valida': False,
                'errores': [f"XML inválido: {str(e)}"],
                'advertencias': [],
                'factura_info': {}
            }
        except Exception as e:
            return {
                'estructura_valida': False,
                'errores': [f"Error de validación: {str(e)}"],
                'advertencias': [],
                'factura_info': {}
            }
    
    @staticmethod
    def _extract_factura_info(root, namespaces):
        """
        Extrae información clave de la factura XML
        """
        info = {}
        
        try:
            # Información básica
            info['numero'] = root.find('.//cbc:ID', namespaces).text if root.find('.//cbc:ID', namespaces) is not None else None
            info['fecha_emision'] = root.find('.//cbc:IssueDate', namespaces).text if root.find('.//cbc:IssueDate', namespaces) is not None else None
            info['moneda'] = root.find('.//cbc:DocumentCurrencyCode', namespaces).text if root.find('.//cbc:DocumentCurrencyCode', namespaces) is not None else None
            
            # Proveedor (PSS)
            supplier_nit = root.find('.//cac:AccountingSupplierParty//cbc:CompanyID', namespaces)
            if supplier_nit is not None:
                info['proveedor_nit'] = supplier_nit.text
            
            supplier_name = root.find('.//cac:AccountingSupplierParty//cbc:RegistrationName', namespaces)
            if supplier_name is not None:
                info['proveedor_nombre'] = supplier_name.text
            
            # Cliente (EPS)
            customer_nit = root.find('.//cac:AccountingCustomerParty//cbc:CompanyID', namespaces)
            if customer_nit is not None:
                info['cliente_nit'] = customer_nit.text
            
            # Totales
            total_amount = root.find('.//cac:LegalMonetaryTotal/cbc:PayableAmount', namespaces)
            if total_amount is not None:
                info['valor_total'] = float(total_amount.text)
            
            # CUFE
            cufe = root.find('.//cbc:UUID[@schemeName="CUFE-SHA384"]', namespaces)
            if cufe is not None:
                info['cufe'] = cufe.text
            
        except Exception as e:
            logger.error(f"Error extracting factura info: {str(e)}")
        
        return info


class RadicacionService:
    """
    Servicio principal para gestión de radicaciones
    """
    
    def __init__(self):
        self.storage_service = DocumentStorageService()
        self.rips_validator = RIPSValidationService()
        self.factura_validator = FacturaValidationService()
    
    def create_radicacion(self, data, user):
        """
        Crea una nueva radicación en estado borrador
        """
        try:
            # Validar que el usuario puede radicar
            if not user.can_radicate:
                raise ValueError("Usuario no autorizado para radicar cuentas")
            
            # Asignar usuario radicador
            data['usuario_radicador'] = user
            
            # Crear radicación
            radicacion = RadicacionCuentaMedica.objects.create(**data)
            
            logger.info(f"Radicación creada: {radicacion.numero_radicado} por {user.username}")
            
            return radicacion
            
        except Exception as e:
            logger.error(f"Error creating radicacion: {str(e)}")
            raise
    
    def upload_document(self, radicacion, archivo, tipo_documento, observaciones=None):
        """
        Sube un documento de soporte a la radicación
        """
        try:
            # Generar hash del archivo
            archivo.seek(0)
            file_content = archivo.read()
            file_hash = hashlib.sha256(file_content).hexdigest()
            archivo.seek(0)
            
            # Generar nombre de archivo según nomenclatura
            documento_temp = DocumentoSoporte(
                radicacion=radicacion,
                tipo_documento=tipo_documento,
                nombre_archivo=archivo.name
            )
            nomenclature_filename = documento_temp.get_nomenclature_filename()
            
            # Generar ruta de almacenamiento
            file_path = self.storage_service.generate_file_path(
                radicacion, tipo_documento, nomenclature_filename
            )
            
            # Subir a Digital Ocean Spaces
            file_url = self.storage_service.upload_document(
                archivo, file_path, archivo.content_type
            )
            
            # Crear registro de documento
            documento = DocumentoSoporte.objects.create(
                radicacion=radicacion,
                tipo_documento=tipo_documento,
                nombre_archivo=nomenclature_filename,
                archivo_url=file_url,
                archivo_hash=file_hash,
                archivo_size=len(file_content),
                mime_type=archivo.content_type,
                extension=archivo.name.split('.')[-1].lower(),
                observaciones=observaciones or ''
            )
            
            # Validar documento según tipo
            self._validate_uploaded_document(documento, file_content)
            
            logger.info(f"Documento subido: {tipo_documento} para radicación {radicacion.numero_radicado}")
            
            return documento
            
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            raise
    
    def _validate_uploaded_document(self, documento, file_content):
        """
        Valida documento subido según su tipo
        """
        try:
            if documento.tipo_documento == 'RIPS':
                # Validar RIPS
                validation_result = self.rips_validator.validate_rips_structure(file_content.decode('utf-8'))
                
                # Crear registro de validación RIPS
                ValidacionRIPS.objects.create(
                    documento=documento,
                    es_valido=validation_result['es_valido'],
                    errores_encontrados=validation_result['errores_encontrados'],
                    advertencias=validation_result['advertencias'],
                    total_registros=validation_result['total_registros'],
                    registros_validos=validation_result['registros_validos'],
                    registros_con_errores=validation_result['registros_con_errores']
                )
                
                # Actualizar estado del documento
                documento.estado = 'VALIDADO' if validation_result['es_valido'] else 'RECHAZADO'
                documento.validacion_resultado = validation_result
                documento.save()
                
            elif documento.tipo_documento == 'FACTURA':
                # Validar factura electrónica con verificación de número
                validation_result = self.factura_validator.validate_factura_structure(
                    file_content.decode('utf-8'),
                    numero_factura_esperado=documento.radicacion.factura_numero
                )
                
                # Si el número no coincide, rechazar automáticamente
                if validation_result.get('numero_factura_validado') == False:
                    documento.estado = 'RECHAZADO'
                    documento.validacion_resultado = validation_result
                    documento.validacion_resultado['rechazo_critico'] = 'Número de factura no coincide'
                else:
                    documento.estado = 'VALIDADO' if validation_result['estructura_valida'] else 'RECHAZADO'
                    documento.validacion_resultado = validation_result
                
                documento.save()
                
                # Actualizar información de la radicación con datos de la factura
                if validation_result['estructura_valida'] and validation_result['factura_info']:
                    self._update_radicacion_from_factura(documento.radicacion, validation_result['factura_info'])
            
            else:
                # Para otros tipos de documento, solo validar formato
                format_validation = documento.validate_format()
                documento.estado = 'VALIDADO' if not format_validation['errors'] else 'RECHAZADO'
                documento.validacion_resultado = format_validation
                documento.save()
                
        except Exception as e:
            logger.error(f"Error validating document {documento.id}: {str(e)}")
            documento.estado = 'RECHAZADO'
            documento.validacion_resultado = {'errors': [str(e)]}
            documento.save()
    
    def _update_radicacion_from_factura(self, radicacion, factura_info):
        """
        Actualiza información de la radicación basada en los datos de la factura
        """
        try:
            update_fields = []
            
            if factura_info.get('numero') and not radicacion.factura_numero:
                radicacion.factura_numero = factura_info['numero']
                update_fields.append('factura_numero')
            
            if factura_info.get('valor_total') and not radicacion.factura_valor_total:
                radicacion.factura_valor_total = factura_info['valor_total']
                update_fields.append('factura_valor_total')
            
            if factura_info.get('proveedor_nit') and radicacion.pss_nit != factura_info['proveedor_nit']:
                logger.warning(f"NIT inconsistente en radicación {radicacion.numero_radicado}: {radicacion.pss_nit} vs {factura_info['proveedor_nit']}")
            
            if update_fields:
                radicacion.save(update_fields=update_fields)
                
        except Exception as e:
            logger.error(f"Error updating radicacion from factura: {str(e)}")
    
    def radicate_cuenta(self, radicacion_id):
        """
        Ejecuta el proceso de radicación de una cuenta
        """
        try:
            radicacion = RadicacionCuentaMedica.objects.get(id=radicacion_id)
            
            # Verificar si puede radicar
            can_radicate, message = radicacion.can_radicate()
            if not can_radicate:
                raise ValueError(message)
            
            # Ejecutar radicación
            numero_radicado = radicacion.radicate()
            
            logger.info(f"Cuenta radicada exitosamente: {numero_radicado}")
            
            return radicacion
            
        except RadicacionCuentaMedica.DoesNotExist:
            raise ValueError("Radicación no encontrada")
        except Exception as e:
            logger.error(f"Error radicating cuenta {radicacion_id}: {str(e)}")
            raise