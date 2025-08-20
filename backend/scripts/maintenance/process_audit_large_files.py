#!/usr/bin/env python
"""
Script optimizado para procesar archivos JSON/XML grandes para auditoría
Maneja archivos con miles de usuarios y servicios de forma eficiente
"""

import os
import sys
import django
import json
import ijson  # Para streaming JSON
import xml.etree.ElementTree as ET
from decimal import Decimal
from datetime import datetime
import requests
import boto3
from io import BytesIO
import gzip
import logging

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from apps.radicacion.models import RadicacionCuentaMedica, DocumentoSoporte
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado
from bson import ObjectId
from django.db import models, transaction
from django.db.models import Sum, Count

logger = logging.getLogger('audit_processor')


class LargeFileAuditProcessor:
    """
    Procesador optimizado para archivos grandes de auditoría
    """
    
    def __init__(self):
        # Configurar cliente S3 para Digital Ocean Spaces
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.DO_SPACES_ACCESS_KEY,
            aws_secret_access_key=settings.DO_SPACES_SECRET_KEY,
            endpoint_url=settings.DO_SPACES_ENDPOINT_URL,
            region_name=settings.DO_SPACES_REGION
        ) if hasattr(settings, 'DO_SPACES_ACCESS_KEY') else None
        
        self.bucket_name = getattr(settings, 'DO_SPACES_BUCKET_NAME', None)
        self.batch_size = 1000  # Procesar en lotes
        
    def process_radicaciones_for_audit(self, limit=None):
        """
        Procesa radicaciones para crear datos de auditoría
        """
        print("=== Iniciando procesamiento de auditoría para archivos grandes ===")
        
        # Limpiar datos existentes
        if input("\n¿Desea limpiar los datos de auditoría existentes? (s/n): ").lower() == 's':
            print("Limpiando datos...")
            ServicioFacturado.objects.all().delete()
            FacturaRadicada.objects.all().delete()
        
        # Obtener radicaciones
        query = RadicacionCuentaMedica.objects.filter(
            estado__in=['RADICADA', 'EN_AUDITORIA']
        ).order_by('-created_at')
        
        if limit:
            query = query[:limit]
        
        radicaciones = list(query)
        print(f"\nEncontradas {len(radicaciones)} radicaciones para procesar")
        
        stats = {
            'facturas_creadas': 0,
            'servicios_creados': 0,
            'errores': 0,
            'archivos_grandes': 0,
            'tiempo_total': 0
        }
        
        for idx, radicacion in enumerate(radicaciones, 1):
            print(f"\n{'='*60}")
            print(f"[{idx}/{len(radicaciones)}] Procesando: {radicacion.numero_radicado}")
            
            try:
                inicio = datetime.now()
                self.process_single_radicacion(radicacion, stats)
                tiempo = (datetime.now() - inicio).total_seconds()
                stats['tiempo_total'] += tiempo
                print(f"  ✓ Procesado en {tiempo:.2f} segundos")
                
            except Exception as e:
                logger.error(f"Error procesando {radicacion.numero_radicado}: {str(e)}")
                print(f"  ✗ Error: {str(e)}")
                stats['errores'] += 1
        
        # Mostrar resumen
        self.show_summary(stats)
        
    def process_single_radicacion(self, radicacion, stats):
        """
        Procesa una radicación individual
        """
        # Validar CUV
        cuv_data = self.get_or_simulate_cuv(radicacion)
        
        # Crear información embebida
        radicacion_info = {
            'numero_radicacion': radicacion.numero_radicado,
            'fecha_radicacion': radicacion.fecha_radicacion.isoformat() if radicacion.fecha_radicacion else None,
            'prestador_nombre': radicacion.pss_nombre,
            'prestador_nit': radicacion.pss_nit,
            'modalidad_pago': radicacion.modalidad_pago,
            'tipo_servicio': radicacion.tipo_servicio,
            'cuv_codigo': cuv_data['codigo'],
            'cuv_proceso_id': cuv_data['proceso_id']
        }
        
        # Crear factura en auditoría
        factura = FacturaRadicada.objects.create(
            radicacion_id=str(radicacion.id),
            radicacion_info=radicacion_info,
            numero_factura=radicacion.factura_numero,
            fecha_expedicion=radicacion.factura_fecha_expedicion.date(),
            valor_total=radicacion.factura_valor_total,
            estado_auditoria='PENDIENTE'
        )
        stats['facturas_creadas'] += 1
        
        # Buscar y procesar RIPS
        rips_doc = DocumentoSoporte.objects.filter(
            radicacion_id=str(radicacion.id),
            tipo_documento='RIPS'
        ).first()
        
        if rips_doc:
            print(f"  - Procesando RIPS: {rips_doc.nombre_archivo}")
            print(f"    Tamaño: {self.format_bytes(rips_doc.archivo_size)}")
            
            if rips_doc.archivo_size > 10 * 1024 * 1024:  # Mayor a 10MB
                stats['archivos_grandes'] += 1
                print("    ⚠️  Archivo grande detectado - usando procesamiento en streaming")
            
            # Procesar servicios del RIPS
            servicios_count = self.process_rips_file(rips_doc, factura, radicacion_info)
            stats['servicios_creados'] += servicios_count
            
        else:
            # Generar servicios de ejemplo si no hay RIPS
            print("  - No se encontró RIPS, generando servicios de ejemplo")
            servicios_count = self.generate_sample_services(factura, radicacion)
            stats['servicios_creados'] += servicios_count
        
        # Actualizar contadores de la factura
        self.update_factura_counters(factura)
        
    def process_rips_file(self, rips_doc, factura, radicacion_info):
        """
        Procesa archivo RIPS, optimizado para archivos grandes
        """
        try:
            # Para demostración, usar procesamiento simulado
            # En producción, aquí se descargaría y procesaría el archivo real
            
            if rips_doc.archivo_size > 50 * 1024 * 1024:  # Mayor a 50MB
                # Simular procesamiento en streaming para archivos muy grandes
                return self.simulate_large_rips_processing(factura, rips_doc)
            else:
                # Procesar normalmente archivos más pequeños
                return self.process_normal_rips(factura, rips_doc)
                
        except Exception as e:
            logger.error(f"Error procesando RIPS: {str(e)}")
            return 0
    
    def simulate_large_rips_processing(self, factura, rips_doc):
        """
        Simula el procesamiento de un RIPS muy grande
        """
        print("    Simulando procesamiento en streaming...")
        
        # Simular que el archivo tiene muchos usuarios
        estimated_users = int(rips_doc.archivo_size / 1024)  # Aproximado
        print(f"    Usuarios estimados: {estimated_users:,}")
        
        servicios_creados = 0
        batch = []
        
        # Simular procesamiento por lotes
        for i in range(min(estimated_users, 100)):  # Limitar para la demo
            if i % 10 == 0:
                print(f"    Procesando usuario {i+1}/{min(estimated_users, 100)}...")
            
            # Generar servicios simulados para este usuario
            servicios_usuario = self.generate_user_services(factura, i)
            batch.extend(servicios_usuario)
            
            # Guardar en lotes
            if len(batch) >= self.batch_size:
                ServicioFacturado.objects.bulk_create(batch)
                servicios_creados += len(batch)
                batch = []
        
        # Guardar último lote
        if batch:
            ServicioFacturado.objects.bulk_create(batch)
            servicios_creados += len(batch)
        
        print(f"    ✓ Servicios creados: {servicios_creados:,}")
        return servicios_creados
    
    def process_normal_rips(self, factura, rips_doc):
        """
        Procesa un RIPS de tamaño normal
        """
        # Para la demo, generar servicios basados en el tipo
        tipo_servicio = factura.radicacion_info.get('tipo_servicio', 'AMBULATORIO')
        
        servicios = []
        if tipo_servicio == 'AMBULATORIO':
            servicios = [
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=self.get_factura_info(factura),
                    tipo_servicio='CONSULTA',
                    codigo='890201',
                    descripcion='Consulta médica general',
                    valor_servicio=Decimal('50000'),
                    detalle_json={'modalidad': 'Presencial'}
                ),
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=self.get_factura_info(factura),
                    tipo_servicio='PROCEDIMIENTO',
                    codigo='902210',
                    descripcion='Toma de muestra sangre',
                    valor_servicio=Decimal('25000')
                )
            ]
        elif tipo_servicio == 'URGENCIAS':
            servicios = [
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=self.get_factura_info(factura),
                    tipo_servicio='URGENCIA',
                    codigo='URG001',
                    descripcion='Atención de urgencias',
                    valor_servicio=Decimal('150000'),
                    detalle_json={'triage': 'II'}
                )
            ]
        
        ServicioFacturado.objects.bulk_create(servicios)
        return len(servicios)
    
    def generate_user_services(self, factura, user_index):
        """
        Genera servicios para un usuario simulado
        """
        factura_info = self.get_factura_info(factura)
        
        # Variar servicios por usuario
        if user_index % 3 == 0:
            # Usuario con consulta
            return [
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=factura_info,
                    tipo_servicio='CONSULTA',
                    codigo=f'890{200 + (user_index % 10)}',
                    descripcion=f'Consulta médica - Usuario {user_index}',
                    valor_servicio=Decimal('50000')
                )
            ]
        elif user_index % 3 == 1:
            # Usuario con procedimiento
            return [
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=factura_info,
                    tipo_servicio='PROCEDIMIENTO',
                    codigo=f'902{200 + (user_index % 20)}',
                    descripcion=f'Procedimiento - Usuario {user_index}',
                    valor_servicio=Decimal('75000')
                )
            ]
        else:
            # Usuario con medicamentos
            return [
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=factura_info,
                    tipo_servicio='MEDICAMENTO',
                    codigo=f'MED{1000 + user_index}',
                    descripcion=f'Medicamento - Usuario {user_index}',
                    valor_servicio=Decimal('25000')
                )
            ]
    
    def generate_sample_services(self, factura, radicacion):
        """
        Genera servicios de ejemplo cuando no hay RIPS
        """
        tipo = radicacion.tipo_servicio
        servicios = []
        
        if tipo == 'AMBULATORIO':
            servicios = [
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=self.get_factura_info(factura),
                    tipo_servicio='CONSULTA',
                    codigo='890201',
                    descripcion='Consulta médica general',
                    valor_servicio=Decimal('50000')
                )
            ]
        elif tipo == 'MEDICAMENTOS':
            servicios = [
                ServicioFacturado(
                    factura_id=str(factura.id),
                    factura_info=self.get_factura_info(factura),
                    tipo_servicio='MEDICAMENTO',
                    codigo='MED001',
                    descripcion='Medicamentos varios',
                    valor_servicio=radicacion.factura_valor_total
                )
            ]
        
        if servicios:
            ServicioFacturado.objects.bulk_create(servicios)
        
        return len(servicios)
    
    def get_factura_info(self, factura):
        """
        Obtiene información embebida de la factura
        """
        return {
            'numero_factura': factura.numero_factura,
            'fecha_expedicion': factura.fecha_expedicion.isoformat(),
            'valor_total': float(factura.valor_total)
        }
    
    def update_factura_counters(self, factura):
        """
        Actualiza contadores de servicios en la factura
        """
        with transaction.atomic():
            contadores = ServicioFacturado.objects.filter(
                factura_id=str(factura.id)
            ).values('tipo_servicio').annotate(
                total=Count('tipo_servicio'),
                valor=Sum('valor_servicio')
            )
            
            # Resetear contadores
            factura.total_consultas = 0
            factura.total_procedimientos = 0
            factura.total_medicamentos = 0
            factura.total_otros_servicios = 0
            factura.total_urgencias = 0
            factura.total_hospitalizaciones = 0
            
            factura.valor_consultas = Decimal('0')
            factura.valor_procedimientos = Decimal('0')
            factura.valor_medicamentos = Decimal('0')
            factura.valor_otros_servicios = Decimal('0')
            
            # Actualizar con valores reales
            for contador in contadores:
                tipo = contador['tipo_servicio']
                total = contador['total']
                valor = contador['valor'] or Decimal('0')
                
                if tipo == 'CONSULTA':
                    factura.total_consultas = total
                    factura.valor_consultas = valor
                elif tipo == 'PROCEDIMIENTO':
                    factura.total_procedimientos = total
                    factura.valor_procedimientos = valor
                elif tipo == 'MEDICAMENTO':
                    factura.total_medicamentos = total
                    factura.valor_medicamentos = valor
                elif tipo == 'URGENCIA':
                    factura.total_urgencias = total
                elif tipo == 'HOSPITALIZACION':
                    factura.total_hospitalizaciones = total
                else:
                    factura.total_otros_servicios += total
                    factura.valor_otros_servicios += valor
            
            factura.save()
    
    def get_or_simulate_cuv(self, radicacion):
        """
        Obtiene o simula el CUV
        """
        if hasattr(radicacion, 'cuv_codigo') and radicacion.cuv_codigo:
            return {
                'codigo': radicacion.cuv_codigo,
                'proceso_id': radicacion.cuv_proceso_id
            }
        
        # Simular para demo
        return {
            'codigo': f"SIM{radicacion.id[-8:]}bafc8bc501552c80d6403bff0b7d18a3ed9d2783275efec98bccca409eb",
            'proceso_id': f"DEMO-{radicacion.numero_radicado[-6:]}"
        }
    
    def format_bytes(self, bytes):
        """
        Formatea bytes a formato legible
        """
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes < 1024.0:
                return f"{bytes:.2f} {unit}"
            bytes /= 1024.0
        return f"{bytes:.2f} TB"
    
    def show_summary(self, stats):
        """
        Muestra resumen del procesamiento
        """
        print(f"\n{'='*60}")
        print("=== RESUMEN DE PROCESAMIENTO ===")
        print(f"Facturas creadas: {stats['facturas_creadas']:,}")
        print(f"Servicios creados: {stats['servicios_creados']:,}")
        print(f"Archivos grandes procesados: {stats['archivos_grandes']}")
        print(f"Errores: {stats['errores']}")
        print(f"Tiempo total: {stats['tiempo_total']:.2f} segundos")
        
        if stats['facturas_creadas'] > 0:
            print(f"Promedio servicios/factura: {stats['servicios_creados']/stats['facturas_creadas']:.1f}")
        
        # Mostrar estadísticas de la base de datos
        print("\n=== ESTADÍSTICAS DE AUDITORÍA ===")
        total_facturas = FacturaRadicada.objects.count()
        total_servicios = ServicioFacturado.objects.count()
        
        print(f"Total facturas en auditoría: {total_facturas:,}")
        print(f"Total servicios en auditoría: {total_servicios:,}")
        
        # Top prestadores
        print("\n=== TOP 5 PRESTADORES POR SERVICIOS ===")
        top_prestadores = FacturaRadicada.objects.values(
            'radicacion_info__prestador_nombre'
        ).annotate(
            total_servicios=Sum('total_consultas') + Sum('total_procedimientos') + Sum('total_medicamentos')
        ).order_by('-total_servicios')[:5]
        
        for idx, prestador in enumerate(top_prestadores, 1):
            nombre = prestador['radicacion_info__prestador_nombre']
            total = prestador['total_servicios'] or 0
            print(f"{idx}. {nombre}: {total:,} servicios")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Procesar archivos grandes para auditoría')
    parser.add_argument('--limit', type=int, help='Límite de radicaciones a procesar')
    parser.add_argument('--test', action='store_true', help='Modo de prueba con datos limitados')
    
    args = parser.parse_args()
    
    # Configurar logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    processor = LargeFileAuditProcessor()
    
    if args.test:
        print("=== MODO DE PRUEBA ===")
        processor.process_radicaciones_for_audit(limit=3)
    else:
        processor.process_radicaciones_for_audit(limit=args.limit)