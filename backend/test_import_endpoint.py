#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.contratacion.models import Prestador, TarifariosCUPS
from django.contrib.auth import get_user_model

User = get_user_model()

# Verificar prestadores
print("=== VERIFICANDO PRESTADORES ===")
prestadores = Prestador.objects.all()
print(f"Total prestadores: {prestadores.count()}")

for p in prestadores[:5]:
    print(f"- {p.nit}: {p.razon_social}")

# Verificar usuarios
print("\n=== VERIFICANDO USUARIOS ===")
usuarios = User.objects.all()
print(f"Total usuarios: {usuarios.count()}")

# Verificar tarifarios existentes
print("\n=== VERIFICANDO TARIFARIOS CUPS ===")
tarifarios = TarifariosCUPS.objects.all()
print(f"Total tarifarios CUPS: {tarifarios.count()}")

# Verificar si hay errores en los logs recientes
print("\n=== BUSCANDO ERRORES EN LOGS ===")
try:
    with open('/home/adrian_carvajal/Analí®/neuraudit_react/backend/logs/neuraudit.log', 'r') as f:
        lines = f.readlines()
        # Buscar líneas con "import" en las últimas 100 líneas
        for line in lines[-100:]:
            if 'import' in line.lower() or 'ImportacionTarifarios' in line:
                print(line.strip())
except Exception as e:
    print(f"Error leyendo logs: {e}")

print("\n=== INFORMACIÓN DEL ENDPOINT ===")
print("Endpoint correcto: POST /api/contratacion/importacion/importar/")
print("Endpoint de preview: POST /api/contratacion/importacion/preview/")