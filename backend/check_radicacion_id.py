#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica

# Buscar la radicación por número
numero_radicado = "RAD-900397985-20250822-01"
radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)

print(f"Radicación: {numero_radicado}")
print(f"ID en MongoDB: {radicacion.id}")
print(f"Factura número: {radicacion.factura_numero}")
print(f"Estado: {radicacion.estado}")
print(f"\nUSA ESTE ID EN EL FRONTEND: {radicacion.id}")