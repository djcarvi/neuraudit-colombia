#!/usr/bin/env python
"""
Test simple - envía archivos y deja que el backend haga todo
"""
import os
import requests

BASE_URL = "http://localhost:8003/api"
ARCHIVOS_DIR = "/home/adrian_carvajal/Analí®/neuraudit_react/context/prueba_radicar"

# 1. Login
print("=== LOGIN ===")
login_response = requests.post(f"{BASE_URL}/auth/login/", json={
    "username": "test.pss",
    "password": "simple123", 
    "nit": "123456789-0",
    "user_type": "pss"
})

if login_response.status_code != 200:
    print(f"Error login: {login_response.text}")
    exit(1)

token = login_response.json()['access']
print("✓ Login exitoso")

# 2. Crear radicación con archivos
print("\n=== CREANDO RADICACIÓN CON ARCHIVOS ===")
headers = {"Authorization": f"Bearer {token}"}

# Datos mínimos de radicación
import json
radicacion_data = {
    "observaciones": "Test de radicación con archivos reales"
}

# Preparar archivos con los nombres correctos
files = []
with open(os.path.join(ARCHIVOS_DIR, "A01E5687.xml"), 'rb') as f:
    files.append(('factura_xml', ('A01E5687.xml', f.read(), 'text/xml')))

with open(os.path.join(ARCHIVOS_DIR, "A01E5687.json"), 'rb') as f:
    files.append(('rips_json', ('A01E5687.json', f.read(), 'application/json')))

with open(os.path.join(ARCHIVOS_DIR, "ResultadosMSPS_RFFV303_ID779996_A_CUV.json"), 'rb') as f:
    files.append(('cuv_file', ('CUV.json', f.read(), 'application/json')))

# PDFs como soportes adicionales
for pdf in ["CRC_901019681_A01E5687.pdf", "EPI_901019681_A01E5687.pdf", 
            "HEV_901019681_A01E5687.pdf", "TNA_901019681_A01E5687.pdf"]:
    with open(os.path.join(ARCHIVOS_DIR, pdf), 'rb') as f:
        files.append(('soportes_adicionales', (pdf, f.read(), 'application/pdf')))

# Agregar los datos de radicación como FormData
files.append(('radicacion_data', (None, json.dumps(radicacion_data), 'application/json')))

# Enviar todo
response = requests.post(
    f"{BASE_URL}/radicacion/create_with_files/",
    headers=headers,
    files=files
)

print(f"Status: {response.status_code}")
print(f"Response: {response.text[:1000]}...")

if response.status_code in [200, 201]:
    print("\n✓ Radicación creada exitosamente")
else:
    print(f"\n✗ Error: {response.status_code}")