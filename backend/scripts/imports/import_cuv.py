#!/usr/bin/env python
"""
Script para importar el CUV (Código Único de Medicamentos) desde archivo TXT o JSON
Según la Resolución 2284 de 2023
"""

import os
import sys
import django
import json
import csv
from decimal import Decimal

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neuraudit_colombia.settings')
django.setup()

from django_mongodb_backend.fields import ObjectIdAutoField
from django.db import models


class MedicamentoCUV(models.Model):
    """
    Modelo para almacenar el Código Único de Medicamentos
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # Identificación del medicamento
    codigo_cuv = models.CharField(max_length=20, unique=True, help_text="Código CUV del medicamento")
    codigo_atc = models.CharField(max_length=20, blank=True, help_text="Código ATC")
    
    # Descripción
    principio_activo = models.CharField(max_length=500)
    forma_farmaceutica = models.CharField(max_length=200)
    concentracion = models.CharField(max_length=200)
    unidad_medida = models.CharField(max_length=50)
    
    # Presentación comercial
    nombre_comercial = models.CharField(max_length=300, blank=True)
    laboratorio = models.CharField(max_length=200, blank=True)
    registro_invima = models.CharField(max_length=50, blank=True)
    
    # Clasificación
    tipo_medicamento = models.CharField(max_length=50, help_text="PBS, NO PBS, etc.")
    grupo_terapeutico = models.CharField(max_length=200, blank=True)
    via_administracion = models.CharField(max_length=100)
    
    # Valores de referencia
    valor_maximo_regulado = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Valor máximo regulado por MinSalud"
    )
    valor_referencia = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Valor de referencia para auditoría"
    )
    
    # Control
    estado = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVO', 'Activo'),
            ('INACTIVO', 'Inactivo'),
            ('SUSPENDIDO', 'Suspendido')
        ],
        default='ACTIVO'
    )
    fecha_vigencia_desde = models.DateField(null=True, blank=True)
    fecha_vigencia_hasta = models.DateField(null=True, blank=True)
    
    # Metadatos
    observaciones = models.TextField(blank=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    version_cuv = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'neuraudit_medicamento_cuv'
        verbose_name = 'Medicamento CUV'
        verbose_name_plural = 'Medicamentos CUV'
        indexes = [
            models.Index(fields=['codigo_cuv']),
            models.Index(fields=['principio_activo']),
            models.Index(fields=['tipo_medicamento']),
            models.Index(fields=['estado'])
        ]
    
    def __str__(self):
        return f"{self.codigo_cuv} - {self.principio_activo} {self.concentracion}"


def import_cuv_from_txt(file_path):
    """
    Importa CUV desde archivo TXT con formato delimitado
    Formato esperado: codigo|principio_activo|forma_farmaceutica|concentracion|...
    """
    print(f"Importando CUV desde archivo TXT: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"Error: El archivo {file_path} no existe")
        return
    
    imported = 0
    errors = 0
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            # Leer encabezado si existe
            header = file.readline().strip()
            print(f"Encabezado detectado: {header}")
            
            for line_num, line in enumerate(file, 2):
                try:
                    # Parsear línea (ajustar según formato real)
                    parts = line.strip().split('|')
                    
                    if len(parts) < 6:
                        print(f"Línea {line_num}: Formato incorrecto - {line.strip()}")
                        errors += 1
                        continue
                    
                    # Crear o actualizar medicamento
                    medicamento, created = MedicamentoCUV.objects.update_or_create(
                        codigo_cuv=parts[0],
                        defaults={
                            'principio_activo': parts[1],
                            'forma_farmaceutica': parts[2],
                            'concentracion': parts[3],
                            'unidad_medida': parts[4],
                            'tipo_medicamento': parts[5] if len(parts) > 5 else 'NO ESPECIFICADO',
                            'via_administracion': parts[6] if len(parts) > 6 else '',
                            'valor_maximo_regulado': Decimal(parts[7]) if len(parts) > 7 and parts[7] else None,
                        }
                    )
                    
                    if created:
                        imported += 1
                        if imported % 100 == 0:
                            print(f"  Importados: {imported} medicamentos...")
                    
                except Exception as e:
                    print(f"Error en línea {line_num}: {str(e)}")
                    errors += 1
                    
    except Exception as e:
        print(f"Error general: {str(e)}")
    
    print(f"\nImportación completada:")
    print(f"  - Medicamentos importados: {imported}")
    print(f"  - Errores: {errors}")


def import_cuv_from_json(file_path):
    """
    Importa CUV desde archivo JSON
    """
    print(f"Importando CUV desde archivo JSON: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"Error: El archivo {file_path} no existe")
        return
    
    imported = 0
    errors = 0
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
            # El JSON puede ser una lista de medicamentos o un objeto con metadatos
            medicamentos = data if isinstance(data, list) else data.get('medicamentos', [])
            
            print(f"Total de medicamentos a procesar: {len(medicamentos)}")
            
            for idx, med_data in enumerate(medicamentos):
                try:
                    # Mapear campos del JSON al modelo
                    medicamento, created = MedicamentoCUV.objects.update_or_create(
                        codigo_cuv=med_data.get('codigo_cuv', med_data.get('codigo')),
                        defaults={
                            'codigo_atc': med_data.get('codigo_atc', ''),
                            'principio_activo': med_data.get('principio_activo', ''),
                            'forma_farmaceutica': med_data.get('forma_farmaceutica', ''),
                            'concentracion': med_data.get('concentracion', ''),
                            'unidad_medida': med_data.get('unidad_medida', ''),
                            'nombre_comercial': med_data.get('nombre_comercial', ''),
                            'laboratorio': med_data.get('laboratorio', ''),
                            'registro_invima': med_data.get('registro_invima', ''),
                            'tipo_medicamento': med_data.get('tipo_medicamento', 'NO ESPECIFICADO'),
                            'grupo_terapeutico': med_data.get('grupo_terapeutico', ''),
                            'via_administracion': med_data.get('via_administracion', ''),
                            'valor_maximo_regulado': Decimal(str(med_data.get('valor_maximo_regulado', 0))) if med_data.get('valor_maximo_regulado') else None,
                            'valor_referencia': Decimal(str(med_data.get('valor_referencia', 0))) if med_data.get('valor_referencia') else None,
                            'estado': med_data.get('estado', 'ACTIVO'),
                            'observaciones': med_data.get('observaciones', ''),
                            'version_cuv': med_data.get('version_cuv', '')
                        }
                    )
                    
                    if created:
                        imported += 1
                        if imported % 100 == 0:
                            print(f"  Importados: {imported} medicamentos...")
                    
                except Exception as e:
                    print(f"Error en medicamento {idx}: {str(e)}")
                    errors += 1
                    
    except json.JSONDecodeError as e:
        print(f"Error al parsear JSON: {str(e)}")
    except Exception as e:
        print(f"Error general: {str(e)}")
    
    print(f"\nImportación completada:")
    print(f"  - Medicamentos importados: {imported}")
    print(f"  - Errores: {errors}")


def generate_sample_cuv():
    """
    Genera datos de muestra del CUV para pruebas
    """
    print("Generando datos de muestra del CUV...")
    
    sample_medicamentos = [
        {
            'codigo_cuv': 'CUV001',
            'codigo_atc': 'N02BE01',
            'principio_activo': 'ACETAMINOFEN',
            'forma_farmaceutica': 'TABLETA',
            'concentracion': '500',
            'unidad_medida': 'mg',
            'tipo_medicamento': 'PBS',
            'via_administracion': 'ORAL',
            'valor_maximo_regulado': Decimal('50.00'),
            'valor_referencia': Decimal('45.00')
        },
        {
            'codigo_cuv': 'CUV002',
            'codigo_atc': 'M01AE01',
            'principio_activo': 'IBUPROFENO',
            'forma_farmaceutica': 'TABLETA',
            'concentracion': '400',
            'unidad_medida': 'mg',
            'tipo_medicamento': 'PBS',
            'via_administracion': 'ORAL',
            'valor_maximo_regulado': Decimal('80.00'),
            'valor_referencia': Decimal('75.00')
        },
        {
            'codigo_cuv': 'CUV003',
            'codigo_atc': 'A02BC01',
            'principio_activo': 'OMEPRAZOL',
            'forma_farmaceutica': 'CAPSULA',
            'concentracion': '20',
            'unidad_medida': 'mg',
            'tipo_medicamento': 'PBS',
            'via_administracion': 'ORAL',
            'valor_maximo_regulado': Decimal('120.00'),
            'valor_referencia': Decimal('110.00')
        },
        {
            'codigo_cuv': 'CUV004',
            'codigo_atc': 'J01CR02',
            'principio_activo': 'AMOXICILINA + ACIDO CLAVULANICO',
            'forma_farmaceutica': 'TABLETA',
            'concentracion': '875/125',
            'unidad_medida': 'mg',
            'tipo_medicamento': 'PBS',
            'via_administracion': 'ORAL',
            'valor_maximo_regulado': Decimal('350.00'),
            'valor_referencia': Decimal('320.00')
        },
        {
            'codigo_cuv': 'CUV005',
            'codigo_atc': 'R03AC02',
            'principio_activo': 'SALBUTAMOL',
            'forma_farmaceutica': 'INHALADOR',
            'concentracion': '100',
            'unidad_medida': 'mcg/dosis',
            'tipo_medicamento': 'PBS',
            'via_administracion': 'INHALATORIA',
            'valor_maximo_regulado': Decimal('15000.00'),
            'valor_referencia': Decimal('14000.00')
        }
    ]
    
    imported = 0
    for med_data in sample_medicamentos:
        medicamento, created = MedicamentoCUV.objects.update_or_create(
            codigo_cuv=med_data['codigo_cuv'],
            defaults=med_data
        )
        if created:
            imported += 1
    
    print(f"Medicamentos de muestra creados: {imported}")


def search_medicamento(termino):
    """
    Busca medicamentos en el CUV
    """
    print(f"\nBuscando medicamentos con término: '{termino}'")
    
    medicamentos = MedicamentoCUV.objects.filter(
        models.Q(codigo_cuv__icontains=termino) |
        models.Q(principio_activo__icontains=termino) |
        models.Q(nombre_comercial__icontains=termino)
    )[:10]
    
    if medicamentos:
        print(f"\nEncontrados {medicamentos.count()} medicamentos:")
        for med in medicamentos:
            print(f"  - {med.codigo_cuv}: {med.principio_activo} {med.concentracion}{med.unidad_medida}")
            print(f"    Forma: {med.forma_farmaceutica}, Tipo: {med.tipo_medicamento}")
            if med.valor_maximo_regulado:
                print(f"    Valor máximo: ${med.valor_maximo_regulado:,.2f}")
    else:
        print("No se encontraron medicamentos")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Importar CUV de medicamentos')
    parser.add_argument('--file', help='Archivo a importar (TXT o JSON)')
    parser.add_argument('--format', choices=['txt', 'json'], help='Formato del archivo')
    parser.add_argument('--sample', action='store_true', help='Generar datos de muestra')
    parser.add_argument('--search', help='Buscar medicamento por término')
    
    args = parser.parse_args()
    
    if args.sample:
        generate_sample_cuv()
    elif args.search:
        search_medicamento(args.search)
    elif args.file:
        if args.format == 'json' or args.file.endswith('.json'):
            import_cuv_from_json(args.file)
        else:
            import_cuv_from_txt(args.file)
    else:
        print("Uso:")
        print("  python import_cuv.py --sample                    # Generar datos de muestra")
        print("  python import_cuv.py --file archivo.txt          # Importar desde TXT")
        print("  python import_cuv.py --file archivo.json         # Importar desde JSON")
        print("  python import_cuv.py --search acetaminofen       # Buscar medicamento")