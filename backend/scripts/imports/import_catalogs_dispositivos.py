#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para importar catálogo de Dispositivos Médicos desde archivos TXT oficiales del Ministerio de Salud
"""

import os
import django
import csv
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from apps.catalogs.models import CatalogoDispositivosOficial


def parse_date(value):
    """Convierte string date a objeto date"""
    if value and value.strip():
        try:
            # Formato: 2024-04-04
            return datetime.strptime(value.strip(), '%Y-%m-%d').date()
        except ValueError:
            return None
    return None


def parse_datetime(value):
    """Convierte string datetime a objeto datetime"""
    if value and value.strip():
        try:
            # Formato: 2024-04-04 12:14:12 PM
            return datetime.strptime(value.strip(), '%Y-%m-%d %I:%M:%S %p')
        except ValueError:
            try:
                # Intentar otro formato
                return datetime.strptime(value.strip(), '%Y-%m-%d %H:%M:%S')
            except ValueError:
                return datetime.now()
    return datetime.now()


def import_dispositivos_from_txt(file_path, es_libertad_vigilada=False):
    """Importa catálogo de Dispositivos Médicos desde archivo TXT"""
    
    tipo_dispositivo = "Libertad Vigilada" if es_libertad_vigilada else "Normal"
    print(f"Iniciando importación de Dispositivos Médicos ({tipo_dispositivo}) desde: {file_path}")
    
    # Verificar que el archivo existe
    if not os.path.exists(file_path):
        print(f"ERROR: El archivo {file_path} no existe")
        return
    
    # Contadores
    total_registros = 0
    registros_creados = 0
    registros_actualizados = 0
    registros_con_error = 0
    
    # Leer archivo con encoding utf-8-sig para manejar BOM
    with open(file_path, 'r', encoding='utf-8-sig') as file:
        # Leer primera línea para identificar delimitador
        primera_linea = file.readline()
        if ';' in primera_linea:
            delimiter = ';'
        else:
            delimiter = '\t'
        
        # Reiniciar archivo
        file.seek(0)
        
        # Crear reader CSV
        reader = csv.DictReader(file, delimiter=delimiter)
        
        # Procesar en lotes para mejor rendimiento
        with transaction.atomic():
            for row in reader:
                total_registros += 1
                
                try:
                    # Extraer y limpiar datos
                    codigo = row.get('Codigo', '').strip()
                    
                    if not codigo:
                        print(f"Registro sin código en línea {total_registros}")
                        registros_con_error += 1
                        continue
                    
                    # Preparar datos para el modelo
                    datos = {
                        'codigo': codigo,
                        'nombre': row.get('Nombre', '').strip(),
                        'descripcion': row.get('Descripcion', '').strip(),
                        'habilitado': row.get('Habilitado', '').strip().upper() == 'SI',
                        'es_libertad_vigilada': es_libertad_vigilada,  # Marcar el tipo
                        'version_mipres': row.get('Extra_I:VersionMIPRES', '').strip() or None,
                        'fecha_mipres': parse_date(row.get('Extra_II:FechaMIPRES', '')),
                        'aplicacion': row.get('Aplicacion', '').strip() or None,
                        'valor_registro': row.get('ValorRegistro', '').strip() or None,
                        'usuario_responsable': row.get('UsuarioResponsable', '').strip() or None,
                        'fecha_actualizacion': parse_datetime(row.get('Fecha_Actualizacion', '')),
                        'is_public_private': row.get('IsPublicPrivate', '').strip() or None,
                    }
                    
                    # Crear o actualizar registro
                    obj, created = CatalogoDispositivosOficial.objects.update_or_create(
                        codigo=codigo,
                        defaults=datos
                    )
                    
                    if created:
                        registros_creados += 1
                    else:
                        registros_actualizados += 1
                    
                    # Mostrar progreso
                    if total_registros % 100 == 0:
                        print(f"Procesados: {total_registros} registros...")
                    
                except Exception as e:
                    print(f"Error en registro {total_registros}: {str(e)}")
                    registros_con_error += 1
                    continue
    
    # Mostrar resumen
    print(f"\n=== RESUMEN DE IMPORTACIÓN DISPOSITIVOS MÉDICOS ({tipo_dispositivo.upper()}) ===")
    print(f"Total registros procesados: {total_registros:,}")
    print(f"Registros creados: {registros_creados:,}")
    print(f"Registros actualizados: {registros_actualizados:,}")
    print(f"Registros con error: {registros_con_error:,}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    # Rutas de los archivos de Dispositivos
    archivos_dispositivos = [
        ("../context/TablaReferencia_DispositivosMedicos__1.txt", False),  # Dispositivos normales
        ("../context/TablaReferencia_DispositivosMedicosLibertadVigilada__1.txt", True)  # Libertad vigilada
    ]
    
    # Importar cada archivo
    for archivo, es_vigilada in archivos_dispositivos:
        if os.path.exists(archivo):
            import_dispositivos_from_txt(archivo, es_vigilada)
        else:
            print(f"ERROR: No se encontró el archivo {archivo}")
            print("Por favor verifica la ruta del archivo.")