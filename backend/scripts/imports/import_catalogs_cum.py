#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para importar catálogo CUM desde archivos TXT oficiales del Ministerio de Salud
Nota: Se deben importar ambos archivos CUM (1 y 2)
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
from apps.catalogs.models import CatalogoCUMOficial


def parse_decimal(value):
    """Convierte string a decimal, retorna None si está vacío"""
    if value and value.strip():
        try:
            # Reemplazar coma por punto si es necesario
            clean_value = value.strip().replace(',', '.')
            return Decimal(clean_value)
        except:
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


def clean_multi_value_field(value):
    """Limpia campos que tienen múltiples valores con //"""
    if not value:
        return None
    # Tomar solo el primer valor si hay múltiples
    parts = value.split('//')
    if parts:
        return parts[0].strip()
    return value.strip()


def import_cum_from_txt(file_path, archivo_numero):
    """Importa catálogo CUM desde archivo TXT"""
    
    print(f"\nIniciando importación de CUM archivo {archivo_numero} desde: {file_path}")
    
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
                        'es_muestra_medica': row.get('Extra_I:IndicadorMuestraMedica', '').strip().upper() == 'SI',
                        'codigo_atc': row.get('Extra_II:Cod_ATC', '').strip() or None,
                        'atc': row.get('Extra_III:ATC', '').strip() or None,
                        'registro_sanitario': row.get('Extra_IV:RegistroSanitario', '').strip() or None,
                        'principio_activo': clean_multi_value_field(row.get('Extra_V:PrincipioActivo', '')),
                        'cantidad_principio_activo': parse_decimal(clean_multi_value_field(row.get('Extra_VI:CantidadPrincipioActivo', ''))),
                        'unidad_medida_principio': clean_multi_value_field(row.get('Extra_VII:UnidadMedidaPrincipioActivo', '')),
                        'via_administracion': row.get('Extra_VIII:ViaAdministracion', '').strip() or None,
                        'cantidad_presentacion': parse_decimal(row.get('Extra_IX:CantidadPresentacion', '')),
                        'unidad_medida_presentacion': row.get('Extra_X:UnidadMedidaPresentacion', '').strip() or None,
                        'aplicacion': row.get('Aplicacion', '').strip() or None,
                        'valor_registro': row.get('ValorRegistro', '').strip() or None,
                        'usuario_responsable': row.get('UsuarioResponsable', '').strip() or None,
                        'fecha_actualizacion': parse_datetime(row.get('Fecha_Actualizacion', '')),
                        'is_public_private': row.get('IsPublicPrivate', '').strip() or None,
                    }
                    
                    # Crear o actualizar registro
                    obj, created = CatalogoCUMOficial.objects.update_or_create(
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
                    print(f"Datos del registro: {row}")
                    registros_con_error += 1
                    continue
    
    # Mostrar resumen
    print(f"\n=== RESUMEN DE IMPORTACIÓN CUM ARCHIVO {archivo_numero} ===")
    print(f"Total registros procesados: {total_registros:,}")
    print(f"Registros creados: {registros_creados:,}")
    print(f"Registros actualizados: {registros_actualizados:,}")
    print(f"Registros con error: {registros_con_error:,}")
    print("=" * 50 + "\n")
    
    return {
        'total': total_registros,
        'creados': registros_creados,
        'actualizados': registros_actualizados,
        'errores': registros_con_error
    }


if __name__ == "__main__":
    # Rutas de los archivos CUM
    archivos_cum = [
        ("../context/TablaReferencia_CatalogoCUMs__1.txt", 1),
        ("../context/TablaReferencia_CatalogoCUMs__2.txt", 2)
    ]
    
    # Totales generales
    totales = {
        'total': 0,
        'creados': 0,
        'actualizados': 0,
        'errores': 0
    }
    
    # Importar cada archivo
    for archivo, numero in archivos_cum:
        if os.path.exists(archivo):
            resultado = import_cum_from_txt(archivo, numero)
            if resultado:
                totales['total'] += resultado['total']
                totales['creados'] += resultado['creados']
                totales['actualizados'] += resultado['actualizados']
                totales['errores'] += resultado['errores']
        else:
            print(f"ERROR: No se encontró el archivo {archivo}")
    
    # Mostrar resumen total
    print("\n" + "=" * 60)
    print("=== RESUMEN TOTAL DE IMPORTACIÓN CUM ===")
    print(f"Total registros procesados: {totales['total']:,}")
    print(f"Total registros creados: {totales['creados']:,}")
    print(f"Total registros actualizados: {totales['actualizados']:,}")
    print(f"Total registros con error: {totales['errores']:,}")
    print("=" * 60)