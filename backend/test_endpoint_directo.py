#!/usr/bin/env python
import os
import django
from django.test import RequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.views import RadicacionCuentaMedicaViewSet
from apps.authentication.models import User

# Crear request factory
factory = RequestFactory()

# Obtener usuario
user = User.objects.filter(username='test.eps').first()
if not user:
    print("❌ No se encontró el usuario test.eps")
    exit(1)

# Crear request simulado
request = factory.get('/api/radicacion/68a8f29b160b41846ed833fc/servicios-rips/')
request.user = user

# Crear viewset y ejecutar
viewset = RadicacionCuentaMedicaViewSet()
viewset.request = request
viewset.kwargs = {'pk': '68a8f29b160b41846ed833fc'}

try:
    response = viewset.servicios_rips(request, pk='68a8f29b160b41846ed833fc')
    print(f"✅ Status: {response.status_code}")
    if response.status_code == 200:
        data = response.data
        print(f"   Total servicios: {data.get('total_servicios', 0)}")
        print(f"   Estadísticas:")
        for tipo, cantidad in data.get('estadisticas', {}).items():
            if cantidad > 0:
                print(f"     - {tipo}: {cantidad}")
    else:
        print(f"❌ Error: {response.data}")
except Exception as e:
    print(f"❌ Error ejecutando endpoint: {str(e)}")
    import traceback
    traceback.print_exc()