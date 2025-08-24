#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.models import User

# Obtener token
user = User.objects.filter(username='test.eps').first()
if user:
    token = user.auth_token()
    print(f"Token obtenido para usuario: {user.username}")
    print(f"\nPrueba el siguiente comando:")
    print(f'curl -H "Authorization: Bearer {token}" http://localhost:8003/api/radicacion/68a8f29b160b41846ed833fc/servicios-rips/')
else:
    print("No se encontró el usuario test.eps")