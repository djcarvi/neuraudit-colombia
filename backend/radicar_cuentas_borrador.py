#!/usr/bin/env python
"""
Script para radicar cuentas en borrador
"""

import os
import sys
import django
from datetime import datetime

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from apps.radicacion.models import RadicacionCuentaMedica, DocumentoSoporte
from apps.radicacion.models_servicios import ServicioRIPS, ResumenServiciosRadicacion
from apps.radicacion.services_rips_processor import RIPSLargeFileProcessor


def radicar_cuentas_borrador(limite=None):
    """
    Radica cuentas que están en borrador
    """
    print("=== RADICANDO CUENTAS EN BORRADOR ===\n")
    
    # Obtener cuentas en borrador
    query = RadicacionCuentaMedica.objects.filter(estado='BORRADOR')
    if limite:
        query = query[:limite]
    
    cuentas = list(query)
    print(f"Encontradas {len(cuentas)} cuentas en borrador")
    
    radicadas = 0
    errores = 0
    
    for cuenta in cuentas:
        print(f"\nProcesando: {cuenta.numero_radicado}")
        print(f"  Factura: {cuenta.factura_numero}")
        print(f"  Prestador: {cuenta.pss_nombre}")
        
        try:
            # Simular que tiene documentos válidos
            print("  - Simulando documentos RIPS y Factura...")
            
            # Crear documento RIPS simulado
            rips_doc = DocumentoSoporte.objects.create(
                radicacion=cuenta,
                tipo_documento='RIPS',
                nombre_archivo=f'RIPS_{cuenta.factura_numero}.json',
                archivo_url=f'https://spaces.example.com/rips/{cuenta.id}.json',
                archivo_hash='simulated_hash_rips',
                archivo_size=1024 * 50,  # 50KB simulado
                mime_type='application/json',
                extension='json',
                estado='VALIDADO',
                validacion_resultado={
                    'es_valido': True,
                    'total_registros': 10,
                    'registros_validos': 10
                }
            )
            
            # Crear documento Factura simulado
            factura_doc = DocumentoSoporte.objects.create(
                radicacion=cuenta,
                tipo_documento='FACTURA',
                nombre_archivo=f'FE_{cuenta.factura_numero}.xml',
                archivo_url=f'https://spaces.example.com/facturas/{cuenta.id}.xml',
                archivo_hash='simulated_hash_factura',
                archivo_size=1024 * 20,  # 20KB simulado
                mime_type='application/xml',
                extension='xml',
                estado='VALIDADO',
                validacion_resultado={
                    'estructura_valida': True,
                    'factura_info': {
                        'numero': cuenta.factura_numero,
                        'valor_total': float(cuenta.factura_valor_total)
                    }
                }
            )
            
            print("  - Procesando servicios del RIPS...")
            
            # Procesar RIPS para generar servicios
            processor = RIPSLargeFileProcessor()
            processor.procesar_archivo_rips(rips_doc, limite_usuarios=10)
            
            # Simular CUV
            cuenta.cuv_codigo = f"SIM{str(cuenta.id)[-8:]}bafc8bc501552c80d6403bff0b7d18a3ed9d2783275efec98bccca409eb"
            cuenta.cuv_proceso_id = f"DEMO-{cuenta.numero_radicado[-6:]}"
            cuenta.cuv_fecha_validacion = timezone.now()
            cuenta.cuv_resultado = {
                'ResultState': True,
                'NumFactura': cuenta.factura_numero,
                'FechaRadicacion': timezone.now().isoformat()
            }
            
            # Cambiar estado a RADICADA
            cuenta.estado = 'RADICADA'
            cuenta.fecha_radicacion = timezone.now()
            cuenta.save()
            
            print(f"  ✓ Radicada exitosamente con CUV: {cuenta.cuv_proceso_id}")
            radicadas += 1
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
            errores += 1
    
    print(f"\n=== RESUMEN ===")
    print(f"Cuentas radicadas: {radicadas}")
    print(f"Errores: {errores}")
    
    # Verificar servicios creados
    if radicadas > 0:
        print("\n=== SERVICIOS CREADOS ===")
        for cuenta in RadicacionCuentaMedica.objects.filter(estado='RADICADA').order_by('-fecha_radicacion')[:5]:
            resumen = ResumenServiciosRadicacion.objects.filter(radicacion=cuenta).first()
            if resumen:
                print(f"\n{cuenta.numero_radicado}:")
                print(f"  Total servicios: {resumen.total_servicios}")
                print(f"  Usuarios únicos: {resumen.total_usuarios_unicos}")
                print(f"  Valor total: ${resumen.valor_total_servicios:,.2f}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Radicar cuentas en borrador')
    parser.add_argument('--limite', type=int, help='Límite de cuentas a radicar')
    
    args = parser.parse_args()
    
    radicar_cuentas_borrador(limite=args.limite)