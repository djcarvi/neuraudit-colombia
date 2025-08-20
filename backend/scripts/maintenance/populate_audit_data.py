#!/usr/bin/env python
"""
Script para poblar datos de auditoría desde las radicaciones existentes
Crea las estructuras de FacturaRadicada y ServicioFacturado sin modificar radicación
"""

import os
import sys
import django
import json
from decimal import Decimal

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuraudit_colombia.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica, DocumentoSoporte
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado
from bson import ObjectId


def extract_services_from_rips(rips_content):
    """
    Extrae servicios del JSON RIPS para crear ServicioFacturado
    """
    try:
        rips_data = json.loads(rips_content) if isinstance(rips_content, str) else rips_content
        servicios_list = []
        
        # Iterar por usuarios
        for usuario in rips_data.get('usuarios', []):
            # Extraer información del paciente
            paciente_info = {
                'tipo_documento': usuario.get('tipoDocumentoIdentificacion'),
                'numero_documento': usuario.get('numDocumentoIdentificacion'),
                'fecha_nacimiento': usuario.get('fechaNacimiento'),
                'sexo_biologico': usuario.get('codSexo')
            }
            
            # Procesar servicios
            servicios = usuario.get('servicios', {})
            
            # Consultas
            for consulta in servicios.get('consultas', []):
                servicios_list.append({
                    'tipo_servicio': 'CONSULTA',
                    'codigo': consulta.get('codConsulta'),
                    'descripcion': f"Consulta médica - {consulta.get('codConsulta')}",
                    'valor_servicio': Decimal(str(consulta.get('vrServicio', 0))),
                    'fecha_inicio': consulta.get('fechaInicioAtencion'),
                    'detalle_json': {**consulta, 'paciente': paciente_info}
                })
            
            # Procedimientos
            for proc in servicios.get('procedimientos', []):
                servicios_list.append({
                    'tipo_servicio': 'PROCEDIMIENTO',
                    'codigo': proc.get('codProcedimiento'),
                    'descripcion': f"Procedimiento - {proc.get('codProcedimiento')}",
                    'valor_servicio': Decimal(str(proc.get('vrServicio', 0))),
                    'fecha_inicio': proc.get('fechaInicioAtencion'),
                    'detalle_json': {**proc, 'paciente': paciente_info}
                })
            
            # Medicamentos
            for med in servicios.get('medicamentos', []):
                servicios_list.append({
                    'tipo_servicio': 'MEDICAMENTO',
                    'codigo': med.get('codPrestador'),
                    'descripcion': f"Medicamento - Cantidad: {med.get('numUnidMedicamento', 0)}",
                    'valor_servicio': Decimal(str(med.get('vrUnitMedicamento', 0))) * Decimal(str(med.get('numUnidMedicamento', 1))),
                    'detalle_json': {**med, 'paciente': paciente_info}
                })
            
            # Otros servicios
            for otro in servicios.get('otrosServicios', []):
                servicios_list.append({
                    'tipo_servicio': 'OTRO_SERVICIO',
                    'codigo': otro.get('codServicio'),
                    'descripcion': f"Otro servicio - {otro.get('codServicio')}",
                    'valor_servicio': Decimal(str(otro.get('vrServicio', 0))),
                    'detalle_json': {**otro, 'paciente': paciente_info}
                })
            
            # Urgencias
            for urgencia in servicios.get('urgencias', []):
                servicios_list.append({
                    'tipo_servicio': 'URGENCIA',
                    'codigo': urgencia.get('codCausaMotivo'),
                    'descripcion': f"Atención de urgencias",
                    'fecha_inicio': urgencia.get('fechaInicioAtencion'),
                    'fecha_fin': urgencia.get('fechaSalida'),
                    'condicion_egreso': urgencia.get('condicionDestinoUsuarioEgreso'),
                    'detalle_json': {**urgencia, 'paciente': paciente_info}
                })
            
            # Hospitalizaciones
            for hosp in servicios.get('hospitalizacion', []):
                servicios_list.append({
                    'tipo_servicio': 'HOSPITALIZACION',
                    'codigo': hosp.get('codCausaMotivo'),
                    'descripcion': f"Hospitalización",
                    'fecha_inicio': hosp.get('fechaInicioAtencion'),
                    'fecha_fin': hosp.get('fechaEgreso'),
                    'condicion_egreso': hosp.get('condicionDestinoUsuarioEgreso'),
                    'detalle_json': {**hosp, 'paciente': paciente_info}
                })
            
            # Recién nacidos
            for rn in servicios.get('recienNacidos', []):
                servicios_list.append({
                    'tipo_servicio': 'RECIEN_NACIDO',
                    'codigo': 'RN',
                    'descripcion': f"Atención recién nacido",
                    'tipo_documento': rn.get('tipoDocumentoIdentificacion'),
                    'numero_documento': rn.get('numDocumentoIdentificacion'),
                    'fecha_nacimiento': rn.get('fechaNacimiento'),
                    'sexo_biologico': rn.get('sexo'),
                    'detalle_json': rn
                })
        
        return servicios_list
        
    except Exception as e:
        print(f"Error extrayendo servicios del RIPS: {str(e)}")
        return []


def populate_audit_data():
    """
    Pobla las tablas de auditoría con datos de radicaciones existentes
    """
    print("=== Iniciando población de datos de auditoría ===")
    
    # Limpiar datos existentes
    print("Limpiando datos anteriores...")
    ServicioFacturado.objects.all().delete()
    FacturaRadicada.objects.all().delete()
    
    # Obtener radicaciones
    radicaciones = RadicacionCuentaMedica.objects.filter(
        estado__in=['RADICADA', 'EN_AUDITORIA']
    ).order_by('-created_at')
    
    print(f"Encontradas {radicaciones.count()} radicaciones para procesar")
    
    facturas_creadas = 0
    servicios_creados = 0
    
    for radicacion in radicaciones:
        print(f"\nProcesando radicación: {radicacion.numero_radicado}")
        
        try:
            # Crear información embebida de la radicación
            radicacion_info = {
                'numero_radicacion': radicacion.numero_radicado,
                'fecha_radicacion': radicacion.fecha_radicacion.isoformat() if radicacion.fecha_radicacion else None,
                'prestador_nombre': radicacion.pss_nombre,
                'prestador_nit': radicacion.pss_nit,
                'modalidad_pago': radicacion.modalidad_pago,
                'tipo_servicio': radicacion.tipo_servicio
            }
            
            # Crear FacturaRadicada
            factura = FacturaRadicada.objects.create(
                radicacion_id=str(radicacion.id),
                radicacion_info=radicacion_info,
                numero_factura=radicacion.factura_numero,
                fecha_expedicion=radicacion.factura_fecha_expedicion.date(),
                valor_total=radicacion.factura_valor_total,
                estado_auditoria='PENDIENTE'
            )
            facturas_creadas += 1
            
            # Buscar documento RIPS
            rips_doc = radicacion.documentos.filter(tipo_documento='RIPS').first()
            
            if rips_doc:
                print(f"  - Procesando RIPS...")
                # Por ahora simular la lectura del contenido RIPS
                # En producción, descargarías el archivo desde Digital Ocean
                
                # Simular servicios de ejemplo basados en el tipo de servicio
                servicios_mock = []
                
                if radicacion.tipo_servicio == 'AMBULATORIO':
                    servicios_mock = [
                        {
                            'tipo_servicio': 'CONSULTA',
                            'codigo': '890201',
                            'descripcion': 'Consulta médica general',
                            'valor_servicio': Decimal('50000'),
                            'detalle_json': {
                                'diagnostico_principal': radicacion.diagnostico_principal,
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
                            'descripcion': 'Toma de muestra sangre',
                            'valor_servicio': Decimal('25000'),
                            'detalle_json': {}
                        }
                    ]
                elif radicacion.tipo_servicio == 'URGENCIAS':
                    servicios_mock = [
                        {
                            'tipo_servicio': 'URGENCIA',
                            'codigo': 'URG001',
                            'descripcion': 'Atención de urgencias',
                            'valor_servicio': Decimal('150000'),
                            'fecha_inicio': radicacion.fecha_atencion_inicio,
                            'fecha_fin': radicacion.fecha_atencion_fin,
                            'detalle_json': {
                                'diagnostico_principal': radicacion.diagnostico_principal,
                                'triage': 'II'
                            }
                        }
                    ]
                elif radicacion.tipo_servicio == 'MEDICAMENTOS':
                    servicios_mock = [
                        {
                            'tipo_servicio': 'MEDICAMENTO',
                            'codigo': 'MED123',
                            'descripcion': 'Acetaminofén 500mg x 30 tabletas',
                            'valor_servicio': Decimal('15000'),
                            'detalle_json': {
                                'cantidad': 30,
                                'via_administracion': 'Oral'
                            }
                        },
                        {
                            'tipo_servicio': 'MEDICAMENTO',
                            'codigo': 'MED456',
                            'descripcion': 'Ibuprofeno 400mg x 20 tabletas',
                            'valor_servicio': Decimal('18000'),
                            'detalle_json': {
                                'cantidad': 20,
                                'via_administracion': 'Oral'
                            }
                        }
                    ]
                else:
                    # Generar servicios genéricos
                    servicios_mock = [
                        {
                            'tipo_servicio': 'OTRO_SERVICIO',
                            'codigo': 'SRV001',
                            'descripcion': f'Servicio de {radicacion.tipo_servicio}',
                            'valor_servicio': radicacion.factura_valor_total / 2,
                            'detalle_json': {}
                        }
                    ]
                
                # Crear información embebida de la factura
                factura_info = {
                    'numero_factura': factura.numero_factura,
                    'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                    'valor_total': float(factura.valor_total)
                }
                
                # Crear servicios
                for servicio_data in servicios_mock:
                    servicio = ServicioFacturado.objects.create(
                        factura_id=str(factura.id),
                        factura_info=factura_info,
                        **servicio_data
                    )
                    servicios_creados += 1
                
                # Actualizar contadores en la factura
                contadores = ServicioFacturado.objects.filter(factura_id=str(factura.id)).values('tipo_servicio').annotate(
                    total=models.Count('tipo_servicio'),
                    valor=models.Sum('valor_servicio')
                )
                
                for contador in contadores:
                    tipo = contador['tipo_servicio']
                    if tipo == 'CONSULTA':
                        factura.total_consultas = contador['total']
                        factura.valor_consultas = contador['valor']
                    elif tipo == 'PROCEDIMIENTO':
                        factura.total_procedimientos = contador['total']
                        factura.valor_procedimientos = contador['valor']
                    elif tipo == 'MEDICAMENTO':
                        factura.total_medicamentos = contador['total']
                        factura.valor_medicamentos = contador['valor']
                    elif tipo == 'URGENCIA':
                        factura.total_urgencias = contador['total']
                    elif tipo == 'HOSPITALIZACION':
                        factura.total_hospitalizaciones = contador['total']
                    else:
                        factura.total_otros_servicios += contador['total']
                        factura.valor_otros_servicios += contador['valor']
                
                factura.save()
                
                print(f"  - Creados {len(servicios_mock)} servicios")
            else:
                print(f"  - No se encontró documento RIPS")
        
        except Exception as e:
            print(f"  - Error procesando radicación {radicacion.numero_radicado}: {str(e)}")
            continue
    
    print(f"\n=== Población completada ===")
    print(f"Facturas creadas: {facturas_creadas}")
    print(f"Servicios creados: {servicios_creados}")
    
    # Mostrar resumen
    print("\n=== Resumen de datos ===")
    for factura in FacturaRadicada.objects.all()[:5]:
        print(f"\nFactura: {factura.numero_factura}")
        print(f"  - Radicación: {factura.radicacion_info.get('numero_radicacion')}")
        print(f"  - Prestador: {factura.radicacion_info.get('prestador_nombre')}")
        print(f"  - Valor: ${factura.valor_total:,.2f}")
        print(f"  - Servicios: C:{factura.total_consultas} P:{factura.total_procedimientos} M:{factura.total_medicamentos}")


if __name__ == "__main__":
    # Importar también models para tener acceso a agregaciones
    from django.db import models
    populate_audit_data()