# -*- coding: utf-8 -*-
# apps/contratacion/views_mongodb_cups.py
"""
Vistas NoSQL puras para gestión de servicios CUPS contractuales
Sin Django ORM - MongoDB directo
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser, MultiPartParser
from django.http import HttpResponse
from datetime import datetime
import pandas as pd
import io

from .services_mongodb_cups import servicio_cups_contractual
from .renderers import MongoJSONRenderer

import logging
logger = logging.getLogger('neuraudit.contratacion')


class ServiciosCUPSContractualesAPIView(APIView):
    """
    API NoSQL pura para gestión de servicios CUPS en contratos
    """
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]
    parser_classes = [JSONParser]
    
    def get(self, request):
        """
        GET /api/contratacion/mongodb/servicios-cups/
        Buscar tarifas CUPS contractuales
        
        Query params:
        - contrato_id: ID del contrato
        - codigo_cups: Código CUPS específico
        - prestador_nit: NIT del prestador
        - fecha_servicio: Fecha para validar vigencia (YYYY-MM-DD)
        """
        try:
            contrato_id = request.query_params.get('contrato_id')
            codigo_cups = request.query_params.get('codigo_cups')
            prestador_nit = request.query_params.get('prestador_nit')
            fecha_servicio = request.query_params.get('fecha_servicio')
            
            # Convertir fecha si se proporciona
            if fecha_servicio:
                fecha_servicio = datetime.strptime(fecha_servicio, '%Y-%m-%d').date()
            
            # Buscar tarifas
            tarifas = servicio_cups_contractual.buscar_tarifas_contractuales(
                contrato_id=contrato_id,
                codigo_cups=codigo_cups,
                prestador_nit=prestador_nit,
                fecha_servicio=fecha_servicio
            )
            
            return Response({
                'success': True,
                'count': len(tarifas),
                'results': tarifas
            })
            
        except Exception as e:
            logger.error(f"Error buscando tarifas CUPS: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """
        POST /api/contratacion/mongodb/servicios-cups/
        Agregar servicios CUPS a un contrato
        
        Body:
        {
            "contrato_id": "...",
            "servicios": [
                {
                    "codigo_cups": "...",
                    "descripcion": "...",
                    "valor_negociado": 0,
                    "aplica_copago": false,
                    "requiere_autorizacion": false,
                    "restricciones": {...}
                }
            ]
        }
        """
        try:
            contrato_id = request.data.get('contrato_id')
            servicios = request.data.get('servicios', [])
            
            if not contrato_id:
                return Response({
                    'success': False,
                    'error': 'contrato_id es requerido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not servicios:
                return Response({
                    'success': False,
                    'error': 'Lista de servicios está vacía'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Agregar usuario actual a cada servicio
            usuario_id = str(request.user.id) if request.user.is_authenticated else 'anonimo'
            for servicio in servicios:
                servicio['usuario_id'] = usuario_id
            
            # Procesar servicios
            resultado = servicio_cups_contractual.agregar_servicios_cups_masivo(
                contrato_id=contrato_id,
                servicios=servicios
            )
            
            if resultado['success']:
                return Response(resultado, status=status.HTTP_201_CREATED)
            else:
                return Response(resultado, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error agregando servicios CUPS: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ValidacionTarifaCUPSAPIView(APIView):
    """
    API para validar tarifas CUPS facturadas vs contractuales
    """
    permission_classes = [AllowAny]
    renderer_classes = [MongoJSONRenderer]
    
    def post(self, request):
        """
        POST /api/contratacion/mongodb/validar-tarifa-cups/
        
        Body:
        {
            "contrato_id": "...",
            "codigo_cups": "...",
            "valor_facturado": 0,
            "fecha_servicio": "YYYY-MM-DD"
        }
        """
        try:
            contrato_id = request.data.get('contrato_id')
            codigo_cups = request.data.get('codigo_cups')
            valor_facturado = float(request.data.get('valor_facturado', 0))
            fecha_servicio = request.data.get('fecha_servicio')
            
            if not all([contrato_id, codigo_cups, fecha_servicio]):
                return Response({
                    'success': False,
                    'error': 'Todos los campos son requeridos'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Convertir fecha
            fecha_servicio = datetime.strptime(fecha_servicio, '%Y-%m-%d').date()
            
            # Validar tarifa
            resultado = servicio_cups_contractual.validar_tarifa_vs_contractual(
                contrato_id=contrato_id,
                codigo_cups=codigo_cups,
                valor_facturado=valor_facturado,
                fecha_servicio=fecha_servicio
            )
            
            return Response(resultado)
            
        except Exception as e:
            logger.error(f"Error validando tarifa: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EstadisticasContratoAPIView(APIView):
    """
    API para obtener estadísticas de servicios CUPS de un contrato
    """
    permission_classes = [AllowAny]
    renderer_classes = [MongoJSONRenderer]
    
    def get(self, request, contrato_id):
        """
        GET /api/contratacion/mongodb/estadisticas-contrato/{contrato_id}/
        """
        try:
            estadisticas = servicio_cups_contractual.obtener_estadisticas_contrato(contrato_id)
            
            return Response({
                'success': True,
                'data': estadisticas
            })
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ImportarServiciosCUPSAPIView(APIView):
    """
    API para importar servicios CUPS desde Excel
    """
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser]
    
    def post(self, request):
        """
        POST /api/contratacion/mongodb/importar-servicios-cups/
        
        Form data:
        - contrato_id: ID del contrato
        - archivo: Archivo Excel con servicios
        - hoja: Nombre de la hoja (default: Sheet1)
        """
        try:
            contrato_id = request.data.get('contrato_id')
            archivo = request.FILES.get('archivo')
            hoja = request.data.get('hoja', 'Sheet1')
            
            if not contrato_id or not archivo:
                return Response({
                    'success': False,
                    'error': 'contrato_id y archivo son requeridos'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Leer Excel
            df = pd.read_excel(archivo, sheet_name=hoja)
            
            # Mapear columnas esperadas
            columnas_requeridas = ['codigo_cups', 'descripcion', 'valor_negociado']
            columnas_faltantes = [col for col in columnas_requeridas if col not in df.columns]
            
            if columnas_faltantes:
                return Response({
                    'success': False,
                    'error': f'Columnas faltantes en Excel: {columnas_faltantes}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Convertir DataFrame a lista de servicios
            servicios = []
            for _, row in df.iterrows():
                servicio = {
                    'codigo_cups': str(row['codigo_cups']).strip(),
                    'descripcion': str(row['descripcion']),
                    'valor_negociado': float(row['valor_negociado']),
                    'aplica_copago': bool(row.get('aplica_copago', False)),
                    'requiere_autorizacion': bool(row.get('requiere_autorizacion', False)),
                    'restricciones': {
                        'sexo': row.get('restriccion_sexo', 'AMBOS'),
                        'ambito': row.get('restriccion_ambito', 'AMBOS'),
                        'edad_minima': int(row.get('edad_minima')) if pd.notna(row.get('edad_minima')) else None,
                        'edad_maxima': int(row.get('edad_maxima')) if pd.notna(row.get('edad_maxima')) else None
                    }
                }
                servicios.append(servicio)
            
            # Agregar usuario
            usuario_id = str(request.user.id) if request.user.is_authenticated else 'importacion'
            for servicio in servicios:
                servicio['usuario_id'] = usuario_id
            
            # Procesar servicios
            resultado = servicio_cups_contractual.agregar_servicios_cups_masivo(
                contrato_id=contrato_id,
                servicios=servicios
            )
            
            resultado['total_filas_excel'] = len(df)
            
            return Response(resultado)
            
        except Exception as e:
            logger.error(f"Error importando servicios: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExportarTarifarioAPIView(APIView):
    """
    API para exportar tarifario contractual a Excel
    """
    permission_classes = [AllowAny]
    
    def get(self, request, contrato_id):
        """
        GET /api/contratacion/mongodb/exportar-tarifario/{contrato_id}/
        """
        try:
            # Obtener tarifas
            tarifas = servicio_cups_contractual.exportar_tarifario_contractual(contrato_id)
            
            if not tarifas:
                return Response({
                    'success': False,
                    'error': 'No se encontraron tarifas para este contrato'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Crear DataFrame
            df = pd.DataFrame(tarifas)
            
            # Reordenar columnas
            columnas_orden = [
                'codigo_cups', 'descripcion', 'valor_negociado', 
                'valor_referencia', 'porcentaje_variacion',
                'manual_referencia', 'requiere_autorizacion',
                'aplica_copago', 'aplica_cuota_moderadora',
                'restricciones', 'vigencia_desde', 'vigencia_hasta'
            ]
            
            # Filtrar solo columnas que existen
            columnas_existentes = [col for col in columnas_orden if col in df.columns]
            df = df[columnas_existentes]
            
            # Crear archivo Excel en memoria
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df.to_excel(writer, sheet_name='Tarifario CUPS', index=False)
                
                # Obtener worksheet
                worksheet = writer.sheets['Tarifario CUPS']
                
                # Formato para encabezados
                header_format = writer.book.add_format({
                    'bold': True,
                    'bg_color': '#4472C4',
                    'font_color': 'white',
                    'border': 1
                })
                
                # Aplicar formato a encabezados
                for col_num, value in enumerate(df.columns.values):
                    worksheet.write(0, col_num, value, header_format)
                
                # Ajustar ancho de columnas
                worksheet.set_column('A:A', 12)  # Código CUPS
                worksheet.set_column('B:B', 60)  # Descripción
                worksheet.set_column('C:E', 15)  # Valores
            
            # Preparar respuesta
            output.seek(0)
            response = HttpResponse(
                output.read(),
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename=tarifario_contrato_{contrato_id}.xlsx'
            
            return response
            
        except Exception as e:
            logger.error(f"Error exportando tarifario: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)