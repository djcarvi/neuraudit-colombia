#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import django

# Setup Django
sys.path.insert(0, '/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuraudit.settings')
django.setup()

from apps.contratacion.models import Prestador
from datetime import datetime

print("=== VERIFICACIÓN DE IMPORTACIÓN DE PRESTADORES ===\n")

# Contar total de prestadores
total = Prestador.objects.count()
print(f"Total de prestadores en la base de datos: {total}")

# Mostrar últimos 10 prestadores creados
print("\n--- Últimos 10 prestadores importados ---")
ultimos_prestadores = Prestador.objects.order_by('-created_at')[:10]

for i, prestador in enumerate(ultimos_prestadores, 1):
    print(f"\n{i}. {prestador.razon_social}")
    print(f"   NIT: {prestador.nit}")
    print(f"   Código: {prestador.codigo_habilitacion}")
    print(f"   Tipo: {prestador.tipo_prestador}")
    print(f"   Departamento: {prestador.departamento}")
    print(f"   Ciudad: {prestador.ciudad}")
    print(f"   Estado: {prestador.estado}")
    print(f"   Creado: {prestador.created_at}")

# Contar por tipo de prestador
print("\n--- Distribución por tipo de prestador ---")
from django.db.models import Count
tipos = Prestador.objects.values('tipo_prestador').annotate(cantidad=Count('tipo_prestador')).order_by('-cantidad')
for tipo in tipos:
    print(f"   {tipo['tipo_prestador']}: {tipo['cantidad']}")

# Verificar duplicados
print("\n--- Verificación de NITs duplicados ---")
from django.db.models import Count
duplicados = Prestador.objects.values('nit').annotate(cantidad=Count('nit')).filter(cantidad__gt=1)
if duplicados:
    print(f"   Se encontraron {len(duplicados)} NITs duplicados:")
    for dup in duplicados[:5]:  # Mostrar solo los primeros 5
        print(f"   - NIT {dup['nit']}: {dup['cantidad']} registros")
else:
    print("   No se encontraron NITs duplicados ✓")

# Verificar prestadores creados hoy
hoy = datetime.now().date()
prestadores_hoy = Prestador.objects.filter(created_at__date=hoy).count()
print(f"\n--- Prestadores creados hoy: {prestadores_hoy} ---")

print("\n=== FIN DE VERIFICACIÓN ===")