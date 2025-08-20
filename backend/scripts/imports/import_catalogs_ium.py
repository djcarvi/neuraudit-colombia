#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para importar catálogo IUM desde archivo TXT oficial del Ministerio de Salud
"""

import os
import django
import csv
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from apps.catalogs.models import CatalogoIUMOficial


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


def import_ium_from_txt(file_path):
    """Importa catálogo IUM desde archivo TXT"""
    
    print(f"Iniciando importación de IUM desde: {file_path}")
    
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
                        'nombre': row.get('Nombre', '').strip() or None,
                        'descripcion': row.get('Descripcion', '').strip() or None,
                        'habilitado': row.get('Habilitado', '').strip().upper() == 'SI',
                        
                        # Jerarquía IUM
                        'ium_nivel_i': row.get('Extra_I:IUMNivelI', '').strip() or None,
                        'ium_nivel_ii': row.get('Extra_II:IUMNivelII', '').strip() or None,
                        'ium_nivel_iii': row.get('Extra_III:IUMNivelIII', '').strip() or None,
                        
                        # Principio activo
                        'principio_activo': row.get('Extra_IV:PrincipioActivo', '').strip() or None,
                        'codigo_principio_activo': row.get('Extra_V:CodigoPrincipioActivo', '').strip() or None,
                        
                        # Forma farmacéutica
                        'forma_farmaceutica': row.get('Extra_VI:FormaFarmaceutica', '').strip() or None,
                        'codigo_forma_farmaceutica': row.get('Extra_VII:CodigoFormaFarmaceutica', '').strip() or None,
                        'codigo_forma_comercializacion': row.get('Extra_VIII:CodigoFormaComercializacion', '').strip() or None,
                        
                        # Condiciones
                        'condicion_registro_muestra': row.get('Extra_IX:CondicionRegistroMuestra', '').strip() or None,
                        'unidad_empaque': row.get('Extra_X:UnidadEmpaque', '').strip() or None,
                        
                        # Metadatos
                        'valor_registro': row.get('ValorRegistro', '').strip() or None,
                        'usuario_responsable': row.get('UsuarioResponsable', '').strip() or None,
                        'fecha_actualizacion': parse_datetime(row.get('Fecha_Actualizacion', '')),
                        'is_public_private': row.get('IsPublicPrivate', '').strip() or None,
                    }
                    
                    # Crear o actualizar registro
                    obj, created = CatalogoIUMOficial.objects.update_or_create(
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
    print("\n=== RESUMEN DE IMPORTACIÓN IUM ===")
    print(f"Total registros procesados: {total_registros:,}")
    print(f"Registros creados: {registros_creados:,}")
    print(f"Registros actualizados: {registros_actualizados:,}")
    print(f"Registros con error: {registros_con_error:,}")
    print("===================================\n")


if __name__ == "__main__":
    # Ruta del archivo IUM
    archivo_ium = "../context/TablaReferencia_IUM__1.txt"
    
    # Verificar si existe
    if os.path.exists(archivo_ium):
        import_ium_from_txt(archivo_ium)
    else:
        print(f"ERROR: No se encontró el archivo {archivo_ium}")
        print("Por favor verifica la ruta del archivo.")