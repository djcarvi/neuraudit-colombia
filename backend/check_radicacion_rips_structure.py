#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica
from pymongo import MongoClient
from django.conf import settings
import json

# Buscar la radicación
numero_radicado = "RAD-900397985-20250822-01"
print(f"\n🔍 Buscando radicación: {numero_radicado}")

try:
    radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
    print(f"✅ Radicación encontrada:")
    print(f"   - ID: {radicacion.id}")
    print(f"   - Estado: {radicacion.estado}")
    print(f"   - Factura: {radicacion.factura_numero}")
    
    # Conectar directamente a MongoDB
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    # Buscar en la colección de radicaciones
    radicacion_doc = db.radicacion_radicacioncuentamedica.find_one({"numero_radicado": numero_radicado})
    
    if radicacion_doc:
        print(f"\n📊 Documento MongoDB encontrado")
        
        # Verificar estructura RIPS
        if 'rips_data' in radicacion_doc:
            print(f"\n📋 RIPS Data:")
            print(f"   - Tipo: {type(radicacion_doc['rips_data'])}")
            
            if isinstance(radicacion_doc['rips_data'], dict):
                # Mostrar claves principales
                print(f"   - Claves principales: {list(radicacion_doc['rips_data'].keys())}")
                
                # Verificar archivos
                if 'archivos' in radicacion_doc['rips_data']:
                    archivos = radicacion_doc['rips_data']['archivos']
                    print(f"\n   📁 Archivos RIPS:")
                    for tipo, contenido in archivos.items():
                        if isinstance(contenido, list) and len(contenido) > 0:
                            print(f"      - {tipo}: {len(contenido)} registros")
                            # Mostrar primer registro como ejemplo
                            if len(contenido) > 0:
                                print(f"        Ejemplo: {json.dumps(contenido[0], indent=2, default=str)[:200]}...")
                
                # Verificar usuarios
                if 'usuarios' in radicacion_doc['rips_data']:
                    usuarios = radicacion_doc['rips_data']['usuarios']
                    print(f"\n   👥 Usuarios: {len(usuarios)} registros")
                    if len(usuarios) > 0:
                        print(f"      Ejemplo: {json.dumps(usuarios[0], indent=2, default=str)[:200]}...")
        else:
            print(f"\n❌ No se encontró rips_data en el documento")
            
        # Verificar si hay datos en otras estructuras
        print(f"\n🔍 Verificando otras estructuras de datos:")
        for key in radicacion_doc.keys():
            if 'rips' in key.lower() or 'servicio' in key.lower():
                print(f"   - {key}: {type(radicacion_doc[key])}")
                if isinstance(radicacion_doc[key], (list, dict)):
                    print(f"     Contenido: {str(radicacion_doc[key])[:100]}...")
    
    # Verificar el endpoint servicios-rips
    print(f"\n🌐 Probando endpoint servicios-rips:")
    from apps.radicacion.views import RadicacionCuentaMedicaViewSet
    from django.test import RequestFactory
    from apps.authentication.models import User
    
    # Obtener usuario de prueba
    user = User.objects.filter(username='test.eps').first()
    if user:
        factory = RequestFactory()
        request = factory.get(f'/api/radicacion/{radicacion.id}/servicios-rips/')
        request.user = user
        
        viewset = RadicacionCuentaMedicaViewSet()
        viewset.request = request
        viewset.kwargs = {'pk': str(radicacion.id)}
        
        response = viewset.servicios_rips(request, pk=str(radicacion.id))
        print(f"   - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.data
            print(f"   - Total servicios: {data.get('total_servicios', 0)}")
            if 'servicios_por_tipo' in data:
                for tipo, servicios in data['servicios_por_tipo'].items():
                    if servicios:
                        print(f"   - {tipo}: {len(servicios)} servicios")
    
except RadicacionCuentaMedica.DoesNotExist:
    print(f"❌ No se encontró la radicación: {numero_radicado}")
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()