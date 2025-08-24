#!/usr/bin/env python
import requests
import json

# Leer token
with open("auth_token.txt", "r") as f:
    token = f.read().strip()

# Buscar radicaciones
url = "http://localhost:8003/api/radicacion/"
headers = {"Authorization": f"Bearer {token}"}

response = requests.get(url, headers=headers)
if response.status_code == 200:
    data = response.json()
    if data and isinstance(data, list) and len(data) > 0:
        print(f"Encontradas {len(data)} radicaciones")
        # Tomar la primera
        radicacion = data[0]
        print(f"\nPrimera radicación:")
        print(f"ID: {radicacion.get('id')}")
        print(f"Número: {radicacion.get('numero_radicado')}")
        print(f"Factura: {radicacion.get('factura_numero')}")
        
        # Guardar ID
        with open("radicacion_id.txt", "w") as f:
            f.write(radicacion.get('id'))
    else:
        print("No hay radicaciones")
else:
    print(f"Error: {response.status_code}")
    print(response.text)