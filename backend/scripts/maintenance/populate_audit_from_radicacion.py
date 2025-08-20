#!/usr/bin/env python
"""
Script para poblar datos de auditoría desde los servicios ya procesados en radicación
Este es el flujo correcto: Radicación procesa RIPS → Auditoría usa esos datos
"""

import os
import sys
import django
from decimal import Decimal
from datetime import datetime
import logging

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from django.db.models import Sum, Count, Q
from apps.radicacion.models import RadicacionCuentaMedica, DocumentoSoporte
from apps.radicacion.models_servicios import ServicioRIPS, ResumenServiciosRadicacion
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado
from apps.radicacion.services_rips_processor import RIPSLargeFileProcessor

logger = logging.getLogger('populate_audit')


def procesar_radicaciones_para_auditoria(limite=None):
    """
    Proceso principal para poblar datos de auditoría
    """
    print("=== POBLANDO DATOS DE AUDITORÍA DESDE RADICACIÓN ===")
    print("Flujo: Radicación (RIPS procesados) → Auditoría")
    
    # Limpiar datos existentes (para demo)
    print("\nLimpiando datos de auditoría existentes...")
    ServicioFacturado.objects.all().delete()
    FacturaRadicada.objects.all().delete()
    
    # Obtener radicaciones
    query = RadicacionCuentaMedica.objects.filter(
        estado__in=['RADICADA', 'EN_AUDITORIA']
    ).order_by('-created_at')
    
    if limite:
        query = query[:limite]
    
    radicaciones = list(query)
    print(f"\nEncontradas {len(radicaciones)} radicaciones")
    
    stats = {
        'radicaciones_procesadas': 0,
        'facturas_creadas': 0,
        'servicios_copiados': 0,
        'sin_rips': 0,
        'errores': 0
    }
    
    for idx, radicacion in enumerate(radicaciones, 1):
        print(f"\n{'='*60}")
        print(f"[{idx}/{len(radicaciones)}] Radicación: {radicacion.numero_radicado}")
        print(f"  Prestador: {radicacion.pss_nombre}")
        print(f"  Factura: {radicacion.factura_numero}")
        
        try:
            procesar_radicacion_individual(radicacion, stats)
            stats['radicaciones_procesadas'] += 1
            
        except Exception as e:
            logger.error(f"Error procesando {radicacion.numero_radicado}: {str(e)}")
            print(f"  ✗ Error: {str(e)}")
            stats['errores'] += 1
    
    # Mostrar resumen
    mostrar_resumen(stats)


@transaction.atomic
def procesar_radicacion_individual(radicacion, stats):
    """
    Procesa una radicación individual para auditoría
    """
    # Verificar si ya tiene servicios procesados
    resumen = ResumenServiciosRadicacion.objects.filter(
        radicacion=radicacion
    ).first()
    
    if not resumen:
        print("  - No hay servicios procesados, verificando RIPS...")
        
        # Buscar documento RIPS
        rips_doc = DocumentoSoporte.objects.filter(
            radicacion=radicacion,
            tipo_documento='RIPS'
        ).first()
        
        if rips_doc:
            print(f"  - Procesando RIPS: {rips_doc.nombre_archivo}")
            processor = RIPSLargeFileProcessor()
            
            # Procesar con límite para demo
            processor.procesar_archivo_rips(rips_doc, limite_usuarios=50)
            
            # Obtener resumen actualizado
            resumen = ResumenServiciosRadicacion.objects.get(radicacion=radicacion)
        else:
            print("  - No se encontró archivo RIPS")
            stats['sin_rips'] += 1
            return
    
    print(f"  - Servicios en radicación: {resumen.total_servicios:,}")
    print(f"  - Valor total: ${resumen.valor_total_servicios:,.2f}")
    
    # Crear FacturaRadicada para auditoría
    factura_info = {
        'numero_radicacion': radicacion.numero_radicado,
        'fecha_radicacion': radicacion.fecha_radicacion.isoformat() if radicacion.fecha_radicacion else None,
        'prestador_nombre': radicacion.pss_nombre,
        'prestador_nit': radicacion.pss_nit,
        'modalidad_pago': radicacion.modalidad_pago,
        'tipo_servicio': radicacion.tipo_servicio,
        'cuv_codigo': radicacion.cuv_codigo if hasattr(radicacion, 'cuv_codigo') else '',
        'cuv_proceso_id': radicacion.cuv_proceso_id if hasattr(radicacion, 'cuv_proceso_id') else ''
    }
    
    factura_auditoria = FacturaRadicada.objects.create(
        radicacion_id=str(radicacion.id),
        radicacion_info=factura_info,
        numero_factura=radicacion.factura_numero,
        fecha_expedicion=radicacion.factura_fecha_expedicion.date(),
        valor_total=radicacion.factura_valor_total,
        estado_auditoria='PENDIENTE',
        # Copiar totales del resumen
        total_consultas=resumen.total_consultas,
        total_procedimientos=resumen.total_procedimientos,
        total_medicamentos=resumen.total_medicamentos,
        total_otros_servicios=resumen.total_otros_servicios,
        total_urgencias=resumen.total_urgencias,
        total_hospitalizaciones=resumen.total_hospitalizaciones,
        valor_consultas=resumen.valor_total_consultas,
        valor_procedimientos=resumen.valor_total_procedimientos,
        valor_medicamentos=resumen.valor_total_medicamentos
    )
    stats['facturas_creadas'] += 1
    
    # Copiar servicios de radicación a auditoría
    print("  - Copiando servicios para auditoría...")
    servicios_copiados = copiar_servicios_para_auditoria(
        radicacion,
        factura_auditoria,
        limite=1000  # Limitar para demo
    )
    
    stats['servicios_copiados'] += servicios_copiados
    print(f"  ✓ Servicios copiados: {servicios_copiados}")


def copiar_servicios_para_auditoria(radicacion, factura_auditoria, limite=None):
    """
    Copia servicios desde radicación a auditoría
    """
    # Obtener servicios de radicación
    query = ServicioRIPS.objects.filter(
        radicacion=radicacion
    ).order_by('tipo_servicio', 'codigo_servicio')
    
    if limite:
        query = query[:limite]
    
    servicios_rips = list(query)
    
    # Crear información de factura para embedding
    factura_info = {
        'numero_factura': factura_auditoria.numero_factura,
        'fecha_expedicion': factura_auditoria.fecha_expedicion.isoformat(),
        'valor_total': float(factura_auditoria.valor_total)
    }
    
    # Crear servicios para auditoría en lotes
    batch = []
    servicios_creados = 0
    
    for servicio_rips in servicios_rips:
        # Crear servicio para auditoría
        servicio_audit = ServicioFacturado(
            factura_id=str(factura_auditoria.id),
            factura_info=factura_info,
            tipo_servicio=servicio_rips.tipo_servicio,
            codigo=servicio_rips.codigo_servicio,
            descripcion=servicio_rips.descripcion_servicio,
            valor_servicio=servicio_rips.valor_total,
            fecha_inicio=servicio_rips.fecha_inicio,
            fecha_fin=servicio_rips.fecha_fin,
            condicion_egreso='',
            # Información del paciente si es necesaria
            tipo_documento=servicio_rips.usuario_tipo_documento,
            numero_documento=servicio_rips.usuario_numero_documento,
            # Detalle completo del RIPS
            detalle_json={
                'datos_rips': servicio_rips.datos_rips_completos,
                'diagnostico_principal': servicio_rips.diagnostico_principal,
                'diagnosticos_relacionados': servicio_rips.diagnosticos_relacionados,
                'usuario_consecutivo': servicio_rips.usuario_consecutivo,
                'tiene_inconsistencias': servicio_rips.tiene_inconsistencias,
                'inconsistencias': servicio_rips.inconsistencias
            },
            tiene_glosa=False
        )
        
        batch.append(servicio_audit)
        
        # Guardar en lotes
        if len(batch) >= 1000:
            ServicioFacturado.objects.bulk_create(batch)
            servicios_creados += len(batch)
            batch = []
    
    # Guardar último lote
    if batch:
        ServicioFacturado.objects.bulk_create(batch)
        servicios_creados += len(batch)
    
    return servicios_creados


def mostrar_resumen(stats):
    """
    Muestra resumen del procesamiento
    """
    print(f"\n{'='*60}")
    print("=== RESUMEN DE PROCESAMIENTO ===")
    print(f"Radicaciones procesadas: {stats['radicaciones_procesadas']}")
    print(f"Facturas creadas en auditoría: {stats['facturas_creadas']}")
    print(f"Servicios copiados: {stats['servicios_copiados']:,}")
    print(f"Radicaciones sin RIPS: {stats['sin_rips']}")
    print(f"Errores: {stats['errores']}")
    
    # Estadísticas de auditoría
    print("\n=== ESTADÍSTICAS DE AUDITORÍA ===")
    
    total_facturas = FacturaRadicada.objects.count()
    total_servicios = ServicioFacturado.objects.count()
    
    print(f"Total facturas en auditoría: {total_facturas:,}")
    print(f"Total servicios en auditoría: {total_servicios:,}")
    
    # Facturas por estado
    print("\n=== FACTURAS POR ESTADO ===")
    por_estado = FacturaRadicada.objects.values(
        'estado_auditoria'
    ).annotate(
        cantidad=Count('id'),
        valor=Sum('valor_total')
    ).order_by('estado_auditoria')
    
    for estado in por_estado:
        print(f"{estado['estado_auditoria']}: {estado['cantidad']} facturas, ${estado['valor']:,.2f}")
    
    # Top prestadores
    print("\n=== TOP 5 PRESTADORES POR VALOR ===")
    top_prestadores = FacturaRadicada.objects.values(
        'radicacion_info__prestador_nombre'
    ).annotate(
        cantidad_facturas=Count('id'),
        valor_total=Sum('valor_total')
    ).order_by('-valor_total')[:5]
    
    for idx, prestador in enumerate(top_prestadores, 1):
        nombre = prestador['radicacion_info__prestador_nombre']
        cantidad = prestador['cantidad_facturas']
        valor = prestador['valor_total']
        print(f"{idx}. {nombre}: {cantidad} facturas, ${valor:,.2f}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Poblar datos de auditoría desde servicios procesados en radicación'
    )
    parser.add_argument(
        '--limite',
        type=int,
        help='Límite de radicaciones a procesar'
    )
    
    args = parser.parse_args()
    
    # Configurar logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    procesar_radicaciones_para_auditoria(limite=args.limite)