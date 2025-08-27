#!/usr/bin/env python
"""
Script para limpiar colecciones de radicaciones y unificar en una sola
"""

from pymongo import MongoClient

def limpiar_y_unificar():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    
    # Mostrar estado actual
    collections = db.list_collection_names()
    rad_collections = [col for col in collections if 'radicacion' in col.lower()]
    
    print("📋 ESTADO ACTUAL:")
    for col in rad_collections:
        count = db[col].count_documents({})
        print(f"  - {col}: {count} documentos")
    
    # Confirmar limpieza
    print("\n🗑️ LIMPIANDO COLECCIONES DE RADICACIONES...")
    
    # Borrar colecciones antiguas
    if 'neuraudit_radicacion_cuentas' in collections:
        db['neuraudit_radicacion_cuentas'].drop()
        print("  ✅ Borrada: neuraudit_radicacion_cuentas")
    
    if 'radicaciones_cuentas_medicas' in collections:
        db['radicaciones_cuentas_medicas'].drop()
        print("  ✅ Borrada: radicaciones_cuentas_medicas")
    
    # Crear nueva colección limpia con índices optimizados
    radicaciones = db['radicaciones_cuentas_medicas']
    
    # Crear índices importantes
    radicaciones.create_index([("prestador_nit", 1), ("fecha_radicacion", -1)])
    radicaciones.create_index([("numero_radicado", 1)], unique=True)
    radicaciones.create_index([("numero_factura", 1), ("prestador_nit", 1)], unique=True)
    radicaciones.create_index([("contrato_id", 1)])
    radicaciones.create_index([("estado", 1)])
    
    print("  ✅ Creada colección limpia: radicaciones_cuentas_medicas")
    print("  ✅ Índices optimizados creados")
    
    print("\n🎯 RESULTADO:")
    print("  - Una sola colección unificada: radicaciones_cuentas_medicas")
    print("  - Estructura nueva con soporte para contratos")
    print("  - Índices optimizados para búsquedas rápidas")
    print("  - Sin datos de prueba antiguos")

if __name__ == "__main__":
    limpiar_y_unificar()