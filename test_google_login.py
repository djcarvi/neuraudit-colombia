#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append('/home/adrian_carvajal/Analí®/neuraudit/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.views import google_login_view
from django.test import RequestFactory
import json

# Crear un request de prueba
factory = RequestFactory()
data = {
    "id_token": "test_token_12345",
    "user_data": {
        "email": "test@gmail.com",
        "name": "Test User",
        "sub": "12345"
    }
}

request = factory.post('/api/auth/google-login/', 
                      data=json.dumps(data),
                      content_type='application/json')

print("=== TEST DIRECTO ===")
print(f"Request data: {request.body}")
print(f"Request META: {request.META}")

# Intentar procesar directamente
from rest_framework.parsers import JSONParser
from io import BytesIO
stream = BytesIO(request.body)
parsed_data = JSONParser().parse(stream)
print(f"Parsed data: {parsed_data}")
print(f"id_token: {parsed_data.get('id_token')}")