#!/usr/bin/env python
# Script para generar salida de ejemplo del servicio para debugging

servicio = {
    'cantidad': 30,
    'codTecnologiaSalud': '19965499-11',
    'codigo': '19965499-11',
    'descripcion': 'LOSARTAN TABLETAS DE LIBERACION MODIFICADA 50 mg',
    'detalle_json': {
        'autorizacion': None,
        'fecha_atencion': '2025-06-24T05:00:00+00:00',
        'fecha_nacimiento': '1972-04-21',
        'municipio_residencia': '70215',
        'sexo': 'M',
        'tipo_documento': 'CC',
        'tipo_unidad': '168',
        'usuario_documento': '19873372',
        'zona_residencia': '02'
    },
    'glosas_aplicadas': [],
    'id': 'None',
    'nomTecnologiaSalud': 'LOSARTAN TABLETAS DE LIBERACION MODIFICADA 50 mg',
    'tiene_glosa': False,
    'valor_total': 0,
    'valor_unitario': 0,
    'vrServicio': 0
}

print("Los datos están llegando correctamente del backend.")
print("\nProbando las condiciones del modal:")

# Verificar condición para mostrar datos personales
if (servicio.get('detalle_json', {}).get('fecha_nacimiento') or 
    servicio.get('detalle_json', {}).get('sexo') or 
    servicio.get('detalle_json', {}).get('municipio_residencia') or 
    servicio.get('detalle_json', {}).get('zona_residencia')):
    print("✅ La condición para mostrar 'Datos Personales' SÍ se cumple")
    
    if servicio.get('detalle_json', {}).get('fecha_nacimiento'):
        print(f"  - fecha_nacimiento: {servicio['detalle_json']['fecha_nacimiento']}")
    if servicio.get('detalle_json', {}).get('sexo'):
        print(f"  - sexo: {servicio['detalle_json']['sexo']}")
    if servicio.get('detalle_json', {}).get('municipio_residencia'):
        print(f"  - municipio_residencia: {servicio['detalle_json']['municipio_residencia']}")
    if servicio.get('detalle_json', {}).get('zona_residencia'):
        print(f"  - zona_residencia: {servicio['detalle_json']['zona_residencia']}")
else:
    print("❌ La condición para mostrar 'Datos Personales' NO se cumple")