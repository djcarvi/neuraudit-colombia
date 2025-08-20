#!/usr/bin/env python
"""
Script mejorado para poblar datos de auditoría desde las radicaciones existentes
Incluye validación de número de factura y procesamiento del CUV
"""

import os
import sys
import django
import json
import xml.etree.ElementTree as ET
from decimal import Decimal
from datetime import datetime

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica, DocumentoSoporte
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado
from apps.radicacion.services import RIPSValidationService, FacturaValidationService
from bson import ObjectId
from django.db import models
import logging

logger = logging.getLogger('populate_audit')


def validar_numero_factura_xml(xml_content, numero_esperado):
    """
    Valida que el número de factura en el XML coincida con el esperado
    """
    try:
        root = ET.fromstring(xml_content)
        namespaces = {
            'cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        }
        
        numero_xml_element = root.find('.//cbc:ID', namespaces)
        if numero_xml_element is not None:
            numero_xml = numero_xml_element.text.strip()
            return numero_xml == numero_esperado.strip(), numero_xml
        
        return False, None
        
    except Exception as e:
        logger.error(f"Error validando XML: {str(e)}")
        return False, None


def extract_services_from_rips(rips_content):
    """
    Extrae servicios del JSON RIPS según estructura real
    """
    try:
        rips_data = json.loads(rips_content) if isinstance(rips_content, str) else rips_content
        servicios_list = []
        
        # Validar estructura básica
        if 'numFactura' in rips_data:
            print(f"    - Número factura en RIPS: {rips_data['numFactura']}")
        
        # Iterar por usuarios
        for usuario in rips_data.get('usuarios', []):
            # Extraer información del paciente
            paciente_info = {
                'tipo_documento': usuario.get('tipoDocumentoIdentificacion'),
                'numero_documento': usuario.get('numDocumentoIdentificacion'),
                'fecha_nacimiento': usuario.get('fechaNacimiento'),
                'sexo_biologico': usuario.get('codSexo'),
                'tipo_usuario': usuario.get('tipoUsuario')
            }
            
            # Procesar servicios
            servicios = usuario.get('servicios', {})
            
            # Consultas
            for consulta in servicios.get('consultas', []):
                servicios_list.append({
                    'tipo_servicio': 'CONSULTA',
                    'codigo': consulta.get('codConsulta'),
                    'descripcion': f"Consulta médica - Modalidad: {consulta.get('modalidadGrupoServicioTecSal', 'Presencial')}",
                    'valor_servicio': Decimal(str(consulta.get('vrServicio', 0))),
                    'fecha_inicio': consulta.get('fechaInicioAtencion'),
                    'detalle_json': {
                        **consulta, 
                        'paciente': paciente_info,
                        'diagnostico_principal': consulta.get('codDiagnosticoPrincipal'),
                        'diagnosticos_relacionados': [
                            consulta.get('codDiagnosticoRelacionado1'),
                            consulta.get('codDiagnosticoRelacionado2'),
                            consulta.get('codDiagnosticoRelacionado3')
                        ]
                    }
                })
            
            # Procedimientos
            for proc in servicios.get('procedimientos', []):
                servicios_list.append({
                    'tipo_servicio': 'PROCEDIMIENTO',
                    'codigo': proc.get('codProcedimiento'),
                    'descripcion': f"Procedimiento - Ámbito: {proc.get('ambitoRealizacion', '')}",
                    'valor_servicio': Decimal(str(proc.get('vrServicio', 0))),
                    'fecha_inicio': proc.get('fechaInicioAtencion'),
                    'detalle_json': {
                        **proc, 
                        'paciente': paciente_info,
                        'diagnostico_principal': proc.get('codDiagnosticoPrincipal')
                    }
                })
            
            # Medicamentos
            for med in servicios.get('medicamentos', []):
                valor_unitario = Decimal(str(med.get('vrUnitMedicamento', 0)))
                cantidad = Decimal(str(med.get('numUnidMedicamento', 1)))
                servicios_list.append({
                    'tipo_servicio': 'MEDICAMENTO',
                    'codigo': med.get('codMedicamento', ''),
                    'descripcion': f"Medicamento - Tipo: {med.get('tipoMedicamento', '')} - Cantidad: {cantidad}",
                    'valor_servicio': valor_unitario * cantidad,
                    'detalle_json': {
                        **med, 
                        'paciente': paciente_info,
                        'valor_unitario': float(valor_unitario),
                        'cantidad': float(cantidad),
                        'presentacion': med.get('formFarmaceutica', ''),
                        'concentracion': med.get('concMedicamento', ''),
                        'unidad_medida': med.get('uniMedidaMedicamento', '')
                    }
                })
            
            # Otros servicios
            for otro in servicios.get('otrosServicios', []):
                servicios_list.append({
                    'tipo_servicio': 'OTRO_SERVICIO',
                    'codigo': otro.get('codServicio'),
                    'descripcion': f"Otro servicio - Tipo: {otro.get('tipoOS', '')}",
                    'valor_servicio': Decimal(str(otro.get('vrServicio', 0))),
                    'detalle_json': {**otro, 'paciente': paciente_info}
                })
            
            # Urgencias
            for urgencia in servicios.get('urgencias', []):
                servicios_list.append({
                    'tipo_servicio': 'URGENCIA',
                    'codigo': urgencia.get('codCausaMotivo', 'URG'),
                    'descripcion': f"Atención de urgencias - Causa: {urgencia.get('causaMotivoAtencion', '')}",
                    'fecha_inicio': urgencia.get('fechaInicioAtencion'),
                    'fecha_fin': urgencia.get('fechaSalida'),
                    'condicion_egreso': urgencia.get('condicionDestinoUsuarioEgreso'),
                    'detalle_json': {
                        **urgencia, 
                        'paciente': paciente_info,
                        'diagnostico_principal': urgencia.get('codDiagnosticoPrincipal'),
                        'triage': urgencia.get('triage', '')
                    }
                })
            
            # Hospitalizaciones
            for hosp in servicios.get('hospitalizacion', []):
                servicios_list.append({
                    'tipo_servicio': 'HOSPITALIZACION',
                    'codigo': hosp.get('codCausaMotivo', 'HOSP'),
                    'descripcion': f"Hospitalización - Vía ingreso: {hosp.get('viaIngresoServicioSalud', '')}",
                    'fecha_inicio': hosp.get('fechaInicioAtencion'),
                    'fecha_fin': hosp.get('fechaEgreso'),
                    'condicion_egreso': hosp.get('condicionDestinoUsuarioEgreso'),
                    'detalle_json': {
                        **hosp,
                        'paciente': paciente_info,
                        'diagnostico_principal': hosp.get('codDiagnosticoPrincipal'),
                        'diagnostico_egreso': hosp.get('codDiagnosticoPrincipalEgreso')
                    }
                })
            
            # Recién nacidos
            for rn in servicios.get('recienNacidos', []):
                servicios_list.append({
                    'tipo_servicio': 'RECIEN_NACIDO',
                    'codigo': 'RN001',
                    'descripcion': f"Atención recién nacido - Peso: {rn.get('peso', '')}g",
                    'tipo_documento': rn.get('tipoDocumentoIdentificacion'),
                    'numero_documento': rn.get('numDocumentoIdentificacion'),
                    'fecha_nacimiento': rn.get('fechaNacimiento'),
                    'sexo_biologico': rn.get('sexo'),
                    'detalle_json': {
                        **rn,
                        'edad_gestacional': rn.get('edadGestacional', ''),
                        'peso': rn.get('peso', ''),
                        'diagnostico_rn': rn.get('codDiagnosticoRecienNacido', '')
                    }
                })
        
        print(f"    - Total servicios extraídos: {len(servicios_list)}")
        return servicios_list
        
    except Exception as e:
        print(f"Error extrayendo servicios del RIPS: {str(e)}")
        return []


def simular_datos_cuv(radicacion):
    """
    Simula datos del CUV para pruebas
    """
    # En producción, esto vendría de la validación real con MinSalud
    return {
        'codigo': f"SIM{radicacion.id}bafc8bc501552c80d6403bff0b7d18a3ed9d2783275efec98bccca409eb74adb6221cda9aa858c5a32738ce92db",
        'proceso_id': f"SIM-{radicacion.numero_radicado[-6:]}",
        'fecha_validacion': datetime.now(),
        'resultado': {
            'ResultState': True,
            'NumFactura': radicacion.factura_numero,
            'FechaRadicacion': datetime.now().isoformat(),
            'ResultadosValidacion': []
        }
    }


def populate_audit_data():
    """
    Pobla las tablas de auditoría con datos de radicaciones existentes
    """
    print("=== Iniciando población de datos de auditoría V2 ===")
    print("Incluye validación de número de factura y procesamiento del CUV")
    
    # Limpiar datos existentes
    print("\nLimpiando datos anteriores...")
    ServicioFacturado.objects.all().delete()
    FacturaRadicada.objects.all().delete()
    
    # Obtener radicaciones
    radicaciones = RadicacionCuentaMedica.objects.filter(
        estado__in=['RADICADA', 'EN_AUDITORIA', 'BORRADOR']
    ).order_by('-created_at')
    
    print(f"\nEncontradas {radicaciones.count()} radicaciones para procesar")
    
    facturas_creadas = 0
    servicios_creados = 0
    errores_validacion = 0
    
    for radicacion in radicaciones:
        print(f"\n{'='*60}")
        print(f"Procesando radicación: {radicacion.numero_radicado}")
        print(f"  - Estado: {radicacion.estado}")
        print(f"  - Factura: {radicacion.factura_numero}")
        print(f"  - Prestador: {radicacion.pss_nombre}")
        
        try:
            # Buscar documento de factura XML
            factura_doc = DocumentoSoporte.objects.filter(
                radicacion_id=str(radicacion.id),
                tipo_documento='FACTURA'
            ).first()
            
            # Validar número de factura si existe el XML
            numero_validado = False
            if factura_doc and factura_doc.validacion_resultado:
                factura_info = factura_doc.validacion_resultado.get('factura_info', {})
                numero_xml = factura_info.get('numero', '')
                if numero_xml:
                    numero_validado = numero_xml.strip() == radicacion.factura_numero.strip()
                    if not numero_validado:
                        print(f"  ⚠️  ERROR: Número factura no coincide!")
                        print(f"     XML: {numero_xml}")
                        print(f"     Esperado: {radicacion.factura_numero}")
                        errores_validacion += 1
                    else:
                        print(f"  ✓ Número factura validado: {numero_xml}")
            
            # Simular datos del CUV
            cuv_data = simular_datos_cuv(radicacion)
            
            # Actualizar radicación con CUV (si el modelo lo permite)
            if hasattr(radicacion, 'cuv_codigo'):
                radicacion.cuv_codigo = cuv_data['codigo']
                radicacion.cuv_proceso_id = cuv_data['proceso_id']
                radicacion.cuv_fecha_validacion = cuv_data['fecha_validacion']
                radicacion.cuv_resultado = cuv_data['resultado']
                radicacion.save()
                print(f"  ✓ CUV asignado: {cuv_data['proceso_id']}")
            
            # Crear información embebida de la radicación
            radicacion_info = {
                'numero_radicacion': radicacion.numero_radicado,
                'fecha_radicacion': radicacion.fecha_radicacion.isoformat() if radicacion.fecha_radicacion else None,
                'prestador_nombre': radicacion.pss_nombre,
                'prestador_nit': radicacion.pss_nit,
                'modalidad_pago': radicacion.modalidad_pago,
                'tipo_servicio': radicacion.tipo_servicio,
                'cuv_codigo': cuv_data['codigo'],
                'cuv_proceso_id': cuv_data['proceso_id'],
                'numero_factura_validado': numero_validado
            }
            
            # Crear FacturaRadicada
            factura = FacturaRadicada.objects.create(
                radicacion_id=str(radicacion.id),
                radicacion_info=radicacion_info,
                numero_factura=radicacion.factura_numero,
                fecha_expedicion=radicacion.factura_fecha_expedicion.date(),
                valor_total=radicacion.factura_valor_total,
                estado_auditoria='PENDIENTE' if numero_validado or not factura_doc else 'CON_ERRORES'
            )
            facturas_creadas += 1
            print(f"  ✓ Factura creada en auditoría")
            
            # Buscar documento RIPS
            rips_doc = DocumentoSoporte.objects.filter(
                radicacion_id=str(radicacion.id),
                tipo_documento='RIPS'
            ).first()
            
            servicios = []
            
            if rips_doc and rips_doc.validacion_resultado:
                print(f"  - Procesando RIPS desde validación...")
                # Por ahora usar datos simulados, en producción se leería el archivo real
                servicios = []
            
            # Si no hay servicios del RIPS, generar datos de ejemplo
            if not servicios:
                print(f"  - Generando servicios de ejemplo...")
                
                if radicacion.tipo_servicio == 'AMBULATORIO':
                    servicios = [
                        {
                            'tipo_servicio': 'CONSULTA',
                            'codigo': '890201',
                            'descripcion': 'Consulta médica general',
                            'valor_servicio': Decimal('50000'),
                            'detalle_json': {
                                'diagnostico_principal': radicacion.diagnostico_principal,
                                'modalidad': 'Presencial',
                                'finalidad_consulta': '10',
                                'paciente': {
                                    'tipo_documento': radicacion.paciente_tipo_documento,
                                    'numero_documento': radicacion.paciente_numero_documento,
                                    'edad': radicacion.paciente_codigo_edad,
                                    'sexo': radicacion.paciente_codigo_sexo
                                }
                            }
                        },
                        {
                            'tipo_servicio': 'PROCEDIMIENTO',
                            'codigo': '902210',
                            'descripcion': 'Toma de muestra sangre venosa',
                            'valor_servicio': Decimal('25000'),
                            'detalle_json': {
                                'ambito_realizacion': '01',
                                'finalidad': '2'
                            }
                        },
                        {
                            'tipo_servicio': 'PROCEDIMIENTO',
                            'codigo': '903841',
                            'descripcion': 'Hemograma IV (hemoglobina hematocrito)',
                            'valor_servicio': Decimal('35000'),
                            'detalle_json': {
                                'ambito_realizacion': '01',
                                'finalidad': '1'
                            }
                        }
                    ]
                elif radicacion.tipo_servicio == 'URGENCIAS':
                    servicios = [
                        {
                            'tipo_servicio': 'URGENCIA',
                            'codigo': 'URG001',
                            'descripcion': 'Atención de urgencias - Triage II',
                            'valor_servicio': Decimal('150000'),
                            'fecha_inicio': radicacion.fecha_atencion_inicio,
                            'fecha_fin': radicacion.fecha_atencion_fin,
                            'detalle_json': {
                                'diagnostico_principal': radicacion.diagnostico_principal,
                                'triage': 'II',
                                'causa_externa': '13',
                                'condicion_destino': '1'
                            }
                        }
                    ]
                elif radicacion.tipo_servicio == 'MEDICAMENTOS':
                    servicios = [
                        {
                            'tipo_servicio': 'MEDICAMENTO',
                            'codigo': '20067422',
                            'descripcion': 'ACETAMINOFEN 500MG TABLETA',
                            'valor_servicio': Decimal('15000'),
                            'detalle_json': {
                                'cantidad': 30,
                                'valor_unitario': 500,
                                'tipo_medicamento': 'POS',
                                'forma_farmaceutica': 'TABLETA',
                                'concentracion': '500',
                                'unidad_medida': 'mg',
                                'via_administracion': 'Oral'
                            }
                        },
                        {
                            'tipo_servicio': 'MEDICAMENTO',
                            'codigo': '20011295',
                            'descripcion': 'IBUPROFENO 400MG TABLETA',
                            'valor_servicio': Decimal('18000'),
                            'detalle_json': {
                                'cantidad': 20,
                                'valor_unitario': 900,
                                'tipo_medicamento': 'POS',
                                'forma_farmaceutica': 'TABLETA',
                                'concentracion': '400',
                                'unidad_medida': 'mg',
                                'via_administracion': 'Oral'
                            }
                        }
                    ]
                else:
                    # Generar servicios genéricos
                    servicios = [
                        {
                            'tipo_servicio': 'OTRO_SERVICIO',
                            'codigo': 'SRV001',
                            'descripcion': f'Servicio de {radicacion.tipo_servicio}',
                            'valor_servicio': radicacion.factura_valor_total / 2,
                            'detalle_json': {
                                'tipo_servicio': radicacion.tipo_servicio
                            }
                        }
                    ]
            
            # Crear información embebida de la factura
            factura_info = {
                'numero_factura': factura.numero_factura,
                'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                'valor_total': float(factura.valor_total)
            }
            
            # Crear servicios
            for servicio_data in servicios:
                servicio = ServicioFacturado.objects.create(
                    factura_id=str(factura.id),
                    factura_info=factura_info,
                    **servicio_data
                )
                servicios_creados += 1
            
            # Actualizar contadores en la factura
            actualizar_contadores_factura(factura)
            
            print(f"  ✓ Creados {len(servicios)} servicios")
            
        except Exception as e:
            print(f"  ✗ Error procesando radicación {radicacion.numero_radicado}: {str(e)}")
            import traceback
            traceback.print_exc()
            continue
    
    print(f"\n{'='*60}")
    print(f"=== Población completada ===")
    print(f"Facturas creadas: {facturas_creadas}")
    print(f"Servicios creados: {servicios_creados}")
    print(f"Errores de validación: {errores_validacion}")
    
    # Mostrar resumen
    print("\n=== Resumen de datos para auditoría ===")
    for factura in FacturaRadicada.objects.all().order_by('-created_at')[:5]:
        print(f"\nFactura: {factura.numero_factura}")
        print(f"  - Radicación: {factura.radicacion_info.get('numero_radicacion')}")
        print(f"  - Prestador: {factura.radicacion_info.get('prestador_nombre')}")
        print(f"  - Valor: ${factura.valor_total:,.2f}")
        print(f"  - CUV: {factura.radicacion_info.get('cuv_proceso_id')}")
        print(f"  - Número validado: {'✓' if factura.radicacion_info.get('numero_factura_validado') else '✗'}")
        print(f"  - Estado auditoría: {factura.estado_auditoria}")
        print(f"  - Servicios: C:{factura.total_consultas} P:{factura.total_procedimientos} M:{factura.total_medicamentos}")


def actualizar_contadores_factura(factura):
    """
    Actualiza los contadores de servicios en la factura
    """
    contadores = ServicioFacturado.objects.filter(
        factura_id=str(factura.id)
    ).values('tipo_servicio').annotate(
        total=models.Count('tipo_servicio'),
        valor=models.Sum('valor_servicio')
    )
    
    # Resetear contadores
    factura.total_consultas = 0
    factura.total_procedimientos = 0
    factura.total_medicamentos = 0
    factura.total_otros_servicios = 0
    factura.total_urgencias = 0
    factura.total_hospitalizaciones = 0
    factura.total_recien_nacidos = 0
    
    factura.valor_consultas = Decimal('0')
    factura.valor_procedimientos = Decimal('0')
    factura.valor_medicamentos = Decimal('0')
    factura.valor_otros_servicios = Decimal('0')
    
    for contador in contadores:
        tipo = contador['tipo_servicio']
        total = contador['total']
        valor = contador['valor'] or Decimal('0')
        
        if tipo == 'CONSULTA':
            factura.total_consultas = total
            factura.valor_consultas = valor
        elif tipo == 'PROCEDIMIENTO':
            factura.total_procedimientos = total
            factura.valor_procedimientos = valor
        elif tipo == 'MEDICAMENTO':
            factura.total_medicamentos = total
            factura.valor_medicamentos = valor
        elif tipo == 'URGENCIA':
            factura.total_urgencias = total
        elif tipo == 'HOSPITALIZACION':
            factura.total_hospitalizaciones = total
        elif tipo == 'RECIEN_NACIDO':
            factura.total_recien_nacidos = total
        else:
            factura.total_otros_servicios += total
            factura.valor_otros_servicios += valor
    
    factura.save()


if __name__ == "__main__":
    # Configurar logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    populate_audit_data()