#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.conciliacion.models import CasoConciliacion

print("=== CASOS DE CONCILIACION NOSQL ===")
casos = CasoConciliacion.objects.all()

for caso in casos:
    print(f"ID: {caso.id}")
    print(f"Radicacion: {caso.numero_radicacion}")
    print(f"Estado: {caso.estado}")
    print(f"Prestador: {caso.prestador_info.get('razon_social', 'N/A')}")
    print(f"Total Glosas: {caso.resumen_financiero.get('total_glosas', 0)}")
    print(f"Valor Glosado: ${caso.resumen_financiero.get('valor_total_glosado', 0):,.0f}")
    print(f"Facturas embebidas: {len(caso.facturas)}")
    
    # Mostrar estructura NoSQL embebida
    if caso.facturas:
        primera_factura = caso.facturas[0]
        print(f"Primera factura: {primera_factura.get('numero_factura')}")
        if primera_factura.get('servicios'):
            primer_servicio = primera_factura['servicios'][0]
            print(f"Primer servicio: {primer_servicio.get('descripcion')}")
            if primer_servicio.get('glosas_aplicadas'):
                primera_glosa = primer_servicio['glosas_aplicadas'][0]
                print(f"Primera glosa: {primera_glosa.get('codigo_glosa')} - ${primera_glosa.get('valor_glosado'):,.0f}")
                
                # Verificar si hay respuesta PSS
                if primera_glosa.get('respuesta_prestador'):
                    respuesta = primera_glosa['respuesta_prestador']
                    print(f"Respuesta PSS: {respuesta.get('tipo_respuesta')} - Aceptado: ${respuesta.get('valor_aceptado', 0):,.0f}")
    
    print("=" * 50)

print(f"\nTotal casos creados: {casos.count()}")
print("✅ Sistema NoSQL funcionando correctamente!")