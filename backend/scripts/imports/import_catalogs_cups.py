#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para importar catálogo CUPS desde archivo TXT oficial del Ministerio de Salud
"""

import os
import django
import csv
from datetime import datetime
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from apps.catalogs.models import CatalogoCUPSOficial


def parse_si_no(value):
    """Convierte 'S'/'N' a True/False"""
    if value and value.strip().upper() == 'S':
        return True
    return False


def parse_int(value):
    """Convierte string a int, retorna None si está vacío"""
    if value and value.strip():
        try:
            return int(value.strip())
        except ValueError:
            return None
    return None


def parse_datetime(value):
    """Convierte string datetime a objeto datetime"""
    if value and value.strip():
        try:
            # Formato: 2025-05-03 01:47:52 PM
            return datetime.strptime(value.strip(), '%Y-%m-%d %I:%M:%S %p')
        except ValueError:
            try:
                # Intentar otro formato
                return datetime.strptime(value.strip(), '%Y-%m-%d %H:%M:%S')
            except ValueError:
                return datetime.now()
    return datetime.now()


def import_cups_from_txt(file_path):
    """Importa catálogo CUPS desde archivo TXT"""
    
    print(f"Iniciando importación de CUPS desde: {file_path}")
    
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
        batch = []
        batch_size = 500
        
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
                        'aplicacion': row.get('Aplicacion', '').strip() or None,
                        'uso_codigo_cup': row.get('Extra_I:UsoCodigoCUP', '').strip() or None,
                        'es_quirurgico': parse_si_no(row.get('Extra_II:Qx', '')),
                        'numero_minimo': parse_int(row.get('Extra_III:NroMinimo', '')),
                        'numero_maximo': parse_int(row.get('Extra_IV:NroMaximo', '')),
                        'diagnostico_requerido': parse_si_no(row.get('Extra_V:DxRequerido', '')),
                        'sexo': row.get('Extra_VI:Sexo', '').strip() or None,
                        'ambito': row.get('Extra_VII:Ambito', '').strip() or None,
                        'estancia': row.get('Extra_VIII:Estancia', '').strip() or None,
                        'cobertura': row.get('Extra_IX:Cobertura', '').strip() or None,
                        'duplicado': row.get('Extra_X:Duplicado', '').strip() or None,
                        'valor_registro': row.get('ValorRegistro', '').strip() or None,
                        'usuario_responsable': row.get('UsuarioResponsable', '').strip() or None,
                        'fecha_actualizacion': parse_datetime(row.get('Fecha_Actualizacion', '')),
                        'is_public_private': row.get('IsPublicPrivate', '').strip() or None,
                    }
                    
                    # Crear o actualizar registro
                    obj, created = CatalogoCUPSOficial.objects.update_or_create(
                        codigo=codigo,
                        defaults=datos
                    )
                    
                    if created:
                        registros_creados += 1
                    else:
                        registros_actualizados += 1
                    
                    # Mostrar progreso
                    if total_registros % 1000 == 0:
                        print(f"Procesados: {total_registros} registros...")
                    
                except Exception as e:
                    print(f"Error en registro {total_registros}: {str(e)}")
                    registros_con_error += 1
                    continue
    
    # Mostrar resumen
    print("\n=== RESUMEN DE IMPORTACIÓN CUPS ===")
    print(f"Total registros procesados: {total_registros:,}")
    print(f"Registros creados: {registros_creados:,}")
    print(f"Registros actualizados: {registros_actualizados:,}")
    print(f"Registros con error: {registros_con_error:,}")
    print("===================================\n")


if __name__ == "__main__":
    # Ruta del archivo CUPS
    archivo_cups = "../context/TablaReferencia_CUPSRips__1.txt"
    
    # Verificar si existe
    if os.path.exists(archivo_cups):
        import_cups_from_txt(archivo_cups)
    else:
        print(f"ERROR: No se encontró el archivo {archivo_cups}")
        print("Por favor verifica la ruta del archivo.")