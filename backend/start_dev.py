#!/usr/bin/env python
"""
Start script for NeurAudit development server
Port 8003 (backend) and CORS configured for 3003 (frontend)
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    print("🏥 Iniciando NeurAudit Colombia Backend...")
    print("📡 Puerto: 8003")
    print("🌐 CORS configurado para frontend en puerto 3003")
    print("🔗 Base URL: http://localhost:8003")
    print("📋 API Endpoints disponibles:")
    print("   - /api/auth/ - Autenticación")
    print("   - /api/radicacion/ - Radicación de cuentas médicas")
    print("   - /admin/ - Panel administrativo")
    print("-" * 50)
    
    # Ejecutar servidor en puerto 8003
    execute_from_command_line(['manage.py', 'runserver', '8003'])