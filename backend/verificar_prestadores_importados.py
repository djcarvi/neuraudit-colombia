#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import django

# Setup Django
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuraudit.settings')
django.setup()

from apps.contratacion.models import Prestador
from datetime import datetime

print("=== VERIFICACIÓN DETALLADA DE PRESTADORES IMPORTADOS ===\n")

# Obtener últimos 20 prestadores importados
ultimos_prestadores = Prestador.objects.order_by('-created_at')[:20]

print(f"Total de prestadores en la base de datos: {Prestador.objects.count()}\n")
print("--- ÚLTIMOS 20 PRESTADORES IMPORTADOS ---\n")

for i, prestador in enumerate(ultimos_prestadores, 1):
    print(f"{i}. PRESTADOR #{prestador.id}")
    print(f"   NIT: '{prestador.nit}'")
    print(f"   Razón Social: '{prestador.razon_social}'")
    print(f"   Código Habilitación: '{prestador.codigo_habilitacion}'")
    print(f"   Tipo: '{prestador.tipo_prestador}'")
    print(f"   Departamento: '{prestador.departamento}'")
    print(f"   Ciudad: '{prestador.ciudad}'")
    print(f"   Dirección: '{prestador.direccion}'")
    print(f"   Teléfono: '{prestador.telefono}'")
    print(f"   Email: '{prestador.email}'")
    print(f"   Estado: '{prestador.estado}'")
    print(f"   Creado: {prestador.created_at}")
    print("-" * 50)

# Verificar si hay problemas con los datos
print("\n=== ANÁLISIS DE PROBLEMAS ===\n")

# Verificar NITs vacíos o problemáticos
nits_vacios = Prestador.objects.filter(nit='').count()
nits_solo_digito = Prestador.objects.filter(nit__regex=r'^[0-9]{1}$').count()

print(f"Prestadores con NIT vacío: {nits_vacios}")
print(f"Prestadores con NIT de solo 1 dígito: {nits_solo_digito}")

# Verificar razones sociales problemáticas
razon_vacia = Prestador.objects.filter(razon_social='').count()
print(f"Prestadores con razón social vacía: {razon_vacia}")

# Mostrar algunos ejemplos de NITs problemáticos
print("\n--- Ejemplos de NITs importados ---")
nits_muestra = Prestador.objects.values_list('nit', 'razon_social').order_by('-created_at')[:10]
for nit, razon in nits_muestra:
    print(f"   NIT: '{nit}' -> Razón Social: '{razon}'")

print("\n=== FIN DE VERIFICACIÓN ===")