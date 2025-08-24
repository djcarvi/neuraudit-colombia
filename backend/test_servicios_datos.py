#!/usr/bin/env python
import requests
import json
from pprint import pprint

# Leer token del archivo
with open("auth_token.txt", "r") as f:
    token = f.read().strip()

# ID de radicación proporcionado
radicacion_id = "68a8f59c160b41846ed833fe"

# Hacer petición
url = f"http://localhost:8003/api/radicacion/{radicacion_id}/servicios-rips/"
headers = {"Authorization": f"Bearer {token}"}

try:
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        
        # Buscar el primer servicio con datos
        for tipo_servicio, servicios in data.get('servicios_por_tipo', {}).items():
            if servicios and len(servicios) > 0:
                print(f"\n=== PRIMER SERVICIO DE TIPO {tipo_servicio} ===")
                servicio = servicios[0]
                
                # Mostrar estructura completa
                print("\nESTRUCTURA COMPLETA DEL SERVICIO:")
                pprint(servicio)
                
                # Verificar detalle_json
                if 'detalle_json' in servicio:
                    print("\n\nCAMPOS EN detalle_json:")
                    for key, value in servicio['detalle_json'].items():
                        print(f"  {key}: {value}")
                else:
                    print("\n¡NO HAY detalle_json!")
                
                break
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"Error: {e}")