import requests
import json

BASE_URL = "http://localhost:8003/api"

print("=== PASO 1: AUTENTICACIÓN ===\n")

# Autenticar usuario PSS
login_data = {
    "username": "test.pss",
    "password": "simple123", 
    "nit": "123456789-0"
}

print(f"Intentando login con: {login_data}")
response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)

if response.status_code == 200:
    auth_data = response.json()
    print(f"\n✓ Autenticación exitosa")
    print(f"  - Usuario: {auth_data.get('user', {}).get('username', 'N/A')}")
    print(f"  - NIT: {auth_data.get('user', {}).get('nit', 'N/A')}")
    print(f"  - Token: {auth_data.get('access', '')[:50]}...")
    
    # Guardar token para siguiente paso
    with open('token.txt', 'w') as f:
        f.write(auth_data.get('access', ''))
    print("\n✓ Token guardado en token.txt")
else:
    print(f"\n✗ Error autenticación: {response.status_code}")
    print(f"Respuesta: {response.text}")
