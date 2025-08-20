#!/usr/bin/env python
"""
Script para verificar el estado de las radicaciones
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica, DocumentoSoporte
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado


def check_status():
    print("=== ESTADO ACTUAL DEL SISTEMA ===\n")
    
    # Verificar radicaciones
    total_rad = RadicacionCuentaMedica.objects.count()
    print(f"Total radicaciones: {total_rad}")
    
    # Por estado
    print("\nRadicaciones por estado:")
    for estado, nombre in RadicacionCuentaMedica.ESTADO_CHOICES:
        count = RadicacionCuentaMedica.objects.filter(estado=estado).count()
        if count > 0:
            print(f"  - {nombre} ({estado}): {count}")
    
    # Mostrar algunas radicaciones
    print("\nÚltimas 5 radicaciones:")
    for rad in RadicacionCuentaMedica.objects.all().order_by('-created_at')[:5]:
        docs = DocumentoSoporte.objects.filter(radicacion=rad)
        rips = docs.filter(tipo_documento='RIPS').exists()
        print(f"  - {rad.numero_radicado}")
        print(f"    Estado: {rad.estado}")
        print(f"    Factura: {rad.factura_numero}")
        print(f"    Prestador: {rad.pss_nombre}")
        print(f"    Documentos: {docs.count()} (RIPS: {'Sí' if rips else 'No'})")
    
    # Verificar datos de auditoría
    print("\n=== DATOS DE AUDITORÍA ===")
    total_fact = FacturaRadicada.objects.count()
    total_serv = ServicioFacturado.objects.count()
    
    print(f"Total facturas en auditoría: {total_fact}")
    print(f"Total servicios en auditoría: {total_serv}")
    
    # Si queremos radicar algunas para prueba
    print("\n=== OPCIONES ===")
    print("1. Para radicar cuentas en borrador, ejecute:")
    print("   python radicar_cuentas_borrador.py")
    print("\n2. Para poblar datos de auditoría, ejecute:")
    print("   python populate_audit_from_radicacion.py")


if __name__ == "__main__":
    check_status()