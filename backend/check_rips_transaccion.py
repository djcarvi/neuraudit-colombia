#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_rips_oficial import RIPSTransaccionOficial
from pymongo import MongoClient
from django.conf import settings

# Buscar la radicación
numero_radicado = "RAD-900397985-20250822-01"
print(f"\n🔍 Buscando radicación: {numero_radicado}")

try:
    radicacion = RadicacionCuentaMedica.objects.get(numero_radicado=numero_radicado)
    print(f"✅ Radicación encontrada:")
    print(f"   - ID: {radicacion.id}")
    print(f"   - Factura número: {radicacion.factura_numero}")
    print(f"   - PSS NIT: {radicacion.pss_nit}")
    print(f"   - Estado: {radicacion.estado}")
    
    # Buscar transacción RIPS con los criterios del código
    print(f"\n🔍 Buscando transacción RIPS con:")
    print(f"   - numFactura: {radicacion.factura_numero}")
    print(f"   - prestadorNit: {radicacion.pss_nit}")
    
    rips_transaccion = RIPSTransaccionOficial.objects.filter(
        numFactura=radicacion.factura_numero,
        prestadorNit=radicacion.pss_nit
    ).first()
    
    if rips_transaccion:
        print(f"\n✅ Transacción RIPS encontrada:")
        print(f"   - ID: {rips_transaccion.id}")
        print(f"   - Cantidad usuarios: {len(rips_transaccion.usuarios) if rips_transaccion.usuarios else 0}")
        
        # Contar servicios
        total_servicios = 0
        if rips_transaccion.usuarios:
            for usuario in rips_transaccion.usuarios:
                if usuario.servicios:
                    if usuario.servicios.consultas:
                        total_servicios += len(usuario.servicios.consultas)
                    if usuario.servicios.procedimientos:
                        total_servicios += len(usuario.servicios.procedimientos)
                    if usuario.servicios.medicamentos:
                        total_servicios += len(usuario.servicios.medicamentos)
        
        print(f"   - Total servicios encontrados: {total_servicios}")
    else:
        print(f"\n❌ No se encontró transacción RIPS")
        
        # Buscar todas las transacciones para ver qué hay
        print(f"\n📊 Buscando todas las transacciones RIPS:")
        todas = RIPSTransaccionOficial.objects.all()[:5]
        for t in todas:
            print(f"   - numFactura: {t.numFactura}, prestadorNit: {t.prestadorNit}")
        
        # Verificar directamente en MongoDB
        print(f"\n🔍 Verificando directamente en MongoDB:")
        client = MongoClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_DATABASE]
        
        # Buscar en la colección de transacciones
        transacciones = db.radicacion_ripstransaccionoficial.find_one({
            "numFactura": radicacion.factura_numero,
            "prestadorNit": radicacion.pss_nit
        })
        
        if transacciones:
            print(f"   ✅ Encontrada en MongoDB directamente")
        else:
            print(f"   ❌ No encontrada en MongoDB")
            
            # Buscar con solo el número de factura
            trans_factura = db.radicacion_ripstransaccionoficial.find_one({
                "numFactura": radicacion.factura_numero
            })
            if trans_factura:
                print(f"   ⚠️  Encontrada con número de factura pero NIT diferente:")
                print(f"      - NIT en transacción: {trans_factura.get('prestadorNit')}")
                print(f"      - NIT en radicación: {radicacion.pss_nit}")
    
except RadicacionCuentaMedica.DoesNotExist:
    print(f"❌ No se encontró la radicación: {numero_radicado}")
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()