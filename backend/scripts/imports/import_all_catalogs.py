#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script maestro para importar TODOS los catálogos oficiales del Ministerio de Salud
- CUPS: ~450,000 códigos de procedimientos
- CUM: ~950,000 medicamentos (2 archivos)
- IUM: ~500,000 identificadores únicos
- Dispositivos Médicos: ~2,000 dispositivos (normal y libertad vigilada)
"""

import os
import sys
import django
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()


def ejecutar_importacion(script_name, descripcion):
    """Ejecuta un script de importación individual"""
    print(f"\n{'='*80}")
    print(f"📋 {descripcion}")
    print(f"{'='*80}")
    
    try:
        # Importar y ejecutar el módulo
        if script_name == 'import_catalogs_cups':
            from import_catalogs_cups import import_cups_from_txt
            archivo = "../context/TablaReferencia_CUPSRips__1.txt"
            if os.path.exists(archivo):
                import_cups_from_txt(archivo)
            else:
                print(f"❌ ERROR: No se encontró {archivo}")
                
        elif script_name == 'import_catalogs_cum':
            from import_catalogs_cum import import_cum_from_txt
            archivos = [
                ("../context/TablaReferencia_CatalogoCUMs__1.txt", 1),
                ("../context/TablaReferencia_CatalogoCUMs__2.txt", 2)
            ]
            for archivo, num in archivos:
                if os.path.exists(archivo):
                    import_cum_from_txt(archivo, num)
                else:
                    print(f"❌ ERROR: No se encontró {archivo}")
                    
        elif script_name == 'import_catalogs_ium':
            from import_catalogs_ium import import_ium_from_txt
            archivo = "../context/TablaReferencia_IUM__1.txt"
            if os.path.exists(archivo):
                import_ium_from_txt(archivo)
            else:
                print(f"❌ ERROR: No se encontró {archivo}")
                
        elif script_name == 'import_catalogs_dispositivos':
            from import_catalogs_dispositivos import import_dispositivos_from_txt
            archivos = [
                ("../context/TablaReferencia_DispositivosMedicos__1.txt", False),
                ("../context/TablaReferencia_DispositivosMedicosLibertadVigilada__1.txt", True)
            ]
            for archivo, es_vigilada in archivos:
                if os.path.exists(archivo):
                    import_dispositivos_from_txt(archivo, es_vigilada)
                else:
                    print(f"❌ ERROR: No se encontró {archivo}")
                    
        print(f"✅ {descripcion} - COMPLETADO")
        
    except Exception as e:
        print(f"❌ ERROR en {descripcion}: {str(e)}")
        import traceback
        traceback.print_exc()


def main():
    """Función principal que ejecuta todas las importaciones"""
    print(f"\n{'='*80}")
    print("🏥 IMPORTACIÓN DE CATÁLOGOS OFICIALES - NEURAUDIT COLOMBIA")
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}")
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('manage.py'):
        print("❌ ERROR: Este script debe ejecutarse desde el directorio backend/")
        sys.exit(1)
    
    # Lista de importaciones a ejecutar
    importaciones = [
        ('import_catalogs_cups', 'Importación de CUPS (~450,000 procedimientos)'),
        ('import_catalogs_cum', 'Importación de CUM (~950,000 medicamentos)'),
        ('import_catalogs_ium', 'Importación de IUM (~500,000 identificadores)'),
        ('import_catalogs_dispositivos', 'Importación de Dispositivos Médicos (~2,000 dispositivos)'),
    ]
    
    # Confirmar con el usuario
    print("\n⚠️  ADVERTENCIA: Este proceso puede tomar varios minutos.")
    print("📊 Se importarán aproximadamente 1.9 millones de registros.")
    print("\n¿Desea continuar con la importación? (s/n): ", end='')
    
    respuesta = input().strip().lower()
    if respuesta != 's':
        print("\n❌ Importación cancelada por el usuario.")
        return
    
    # Ejecutar cada importación
    inicio = datetime.now()
    
    for script, descripcion in importaciones:
        ejecutar_importacion(script, descripcion)
    
    # Mostrar resumen final
    fin = datetime.now()
    duracion = fin - inicio
    
    print(f"\n{'='*80}")
    print("📊 RESUMEN FINAL DE IMPORTACIÓN")
    print(f"{'='*80}")
    print(f"⏱️  Tiempo total: {duracion}")
    print(f"📅 Finalizado: {fin.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"\n✅ Importación de catálogos completada exitosamente.")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    main()