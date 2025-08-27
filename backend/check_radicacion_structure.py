#!/usr/bin/env python
"""
Script para ver la estructura de datos de radicaciones en MongoDB
"""

from pymongo import MongoClient

def check_structure():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['neuraudit_colombia_db']
    radicaciones = db['radicaciones_cuentas_medicas']
    
    # Ver estructura de una radicación
    rad = radicaciones.find_one()
    if rad:
        print('📋 ESTRUCTURA DE DATOS MONGODB:')
        for key, value in rad.items():
            if key != '_id':
                value_str = str(value)[:100] if len(str(value)) > 100 else str(value)
                print(f'  {key}: {type(value).__name__} = {value_str}')
    else:
        print('❌ No hay radicaciones en MongoDB')

if __name__ == "__main__":
    check_structure()