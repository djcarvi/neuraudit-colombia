#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica

rad = RadicacionCuentaMedica.objects.filter(id='68a8f29b160b41846ed833fc').first()
if rad:
    print(f"✅ Radicación encontrada: {rad.numero_radicado}")
    print(f"   Factura: {rad.factura_numero}")
    print(f"   Prestador: {rad.pss_nit}")
    print(f"   Estado: {rad.estado}")
else:
    print("❌ No se encontró la radicación con ese ID")
    print("\nRadicaciones disponibles:")
    for r in RadicacionCuentaMedica.objects.all()[:5]:
        print(f"   ID: {r.id} - Numero: {r.numero_radicado} - Factura: {r.factura_numero}")