#!/usr/bin/env python
import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.models import User
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken

# Get test user
user = User.objects.filter(username='test.eps').first()
if not user:
    print("❌ No se encontró el usuario test.eps")
    exit(1)

# Generate JWT token
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

print(f"✅ Usuario: {user.username}")
print(f"✅ Token generado")

# Test the endpoint
radicacion_id = "68a8f59c160b41846ed833fe"
url = f"http://localhost:8003/api/radicacion/{radicacion_id}/servicios-rips/"

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

print(f"\n🌐 Llamando endpoint: {url}")

try:
    response = requests.get(url, headers=headers)
    print(f"📊 Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Respuesta exitosa:")
        print(f"   - Total servicios: {data.get('total_servicios', 0)}")
        print(f"   - Estadísticas:")
        for tipo, cantidad in data.get('estadisticas', {}).items():
            if cantidad > 0:
                print(f"     • {tipo}: {cantidad}")
    else:
        print(f"❌ Error: {response.text}")
        
except Exception as e:
    print(f"❌ Error haciendo request: {str(e)}")