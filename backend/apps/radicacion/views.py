"""
Vistas para Radicación de Cuentas Médicas - NeurAudit Colombia

API REST para el proceso completo de radicación según Resolución 2284 de 2023
Incluye upload de documentos, validaciones RIPS y gestión de estados
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from django.http import JsonResponse

from .models import RadicacionCuentaMedica, DocumentoSoporte, ValidacionRIPS
from .serializers import (
    RadicacionCuentaMedicaSerializer, RadicacionCreateSerializer, 
    RadicacionListSerializer, DocumentoSoporteSerializer, 
    DocumentoUploadSerializer, ValidacionRIPSSerializer
)
from .services import RadicacionService
from .engine_preauditoria import EnginePreAuditoria
from .validation_engine import ValidationEngine, RIPSValidator
from .document_parser import DocumentParser, FileProcessor, DataMapper
from .mongodb_soporte_service import get_soporte_service
from .storage_service import StorageService
from .soporte_classifier import SoporteClassifier
from apps.authentication.models import User
from apps.catalogs.models import Prestadores, BDUAAfiliados

import logging
import json
import os
from datetime import datetime, timedelta
from django.conf import settings

logger = logging.getLogger('apps.radicacion')


class RadicacionCuentaMedicaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión completa de radicaciones de cuentas médicas
    
    Funcionalidades:
    - CRUD completo de radicaciones
    - Upload de documentos por tipo
    - Validación automática RIPS y facturas
    - Proceso de radicación
    - Consultas filtradas por usuario, estado, fechas
    """
    
    queryset = RadicacionCuentaMedica.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado', 'modalidad_pago', 'tipo_servicio', 'pss_nit']
    
    def get_serializer_class(self):
        """Serializer dinámico según acción"""
        if self.action == 'create':
            return RadicacionCreateSerializer
        elif self.action == 'list':
            return RadicacionListSerializer
        return RadicacionCuentaMedicaSerializer
    
    def get_queryset(self):
        """
        Filtra queryset según rol del usuario
        PSS solo ve sus propias radicaciones
        EPS ve todas las radicaciones
        """
        user = self.request.user
        queryset = RadicacionCuentaMedica.objects.select_related('usuario_radicador').prefetch_related('documentos')
        
        if user.is_pss_user:
            # PSS solo ve sus propias radicaciones
            queryset = queryset.filter(usuario_radicador=user)
        elif user.role in ['AUDITOR_MEDICO', 'AUDITOR_ADMINISTRATIVO']:
            # Auditores ven solo las que están en auditoría
            queryset = queryset.filter(estado='EN_AUDITORIA')
        
        # Filtros adicionales por parámetros
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
        
        fecha_desde = self.request.query_params.get('fecha_desde')
        if fecha_desde:
            queryset = queryset.filter(created_at__gte=fecha_desde)
        
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        if fecha_hasta:
            queryset = queryset.filter(created_at__lte=fecha_hasta)
        
        # Búsqueda por texto
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(numero_radicado__icontains=search) |
                Q(factura_numero__icontains=search) |
                Q(pss_nombre__icontains=search) |
                Q(paciente_nombres__icontains=search) |
                Q(paciente_apellidos__icontains=search) |
                Q(paciente_numero_documento__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Crea nueva radicación en estado borrador
        Solo usuarios PSS con rol RADICADOR pueden crear
        """
        if not request.user.can_radicate:
            return Response(
                {'error': 'No tiene permisos para crear radicaciones'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Crear radicación usando el servicio
        try:
            radicacion_service = RadicacionService()
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            radicacion = radicacion_service.create_radicacion(
                serializer.validated_data,
                request.user
            )
            
            # Retornar radicación creada con serializer simple para evitar ObjectId
            result_serializer = RadicacionCreateSerializer(radicacion)
            
            logger.info(f"Radicación creada: {radicacion.numero_radicado} por {request.user.username}")
            
            return Response(result_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error creating radicacion: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_document(self, request, pk=None):
        """
        Upload de documento de soporte a la radicación
        
        POST /api/radicacion/{id}/upload_document/
        Form data:
        - archivo: File
        - tipo_documento: TIPO_DOCUMENTO_CHOICES
        - observaciones: string (opcional)
        """
        radicacion = self.get_object()
        
        # Verificar permisos
        if request.user != radicacion.usuario_radicador and not request.user.is_eps_user:
            return Response(
                {'error': 'No tiene permisos para subir documentos a esta radicación'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validar que la radicación esté en estado borrador
        if radicacion.estado != 'BORRADOR':
            return Response(
                {'error': 'Solo se pueden subir documentos a radicaciones en borrador'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Validar datos del formulario
            upload_serializer = DocumentoUploadSerializer(data=request.data)
            upload_serializer.is_valid(raise_exception=True)
            
            # Subir documento usando el servicio
            radicacion_service = RadicacionService()
            
            documento = radicacion_service.upload_document(
                radicacion=radicacion,
                archivo=upload_serializer.validated_data['archivo'],
                tipo_documento=upload_serializer.validated_data['tipo_documento'],
                observaciones=upload_serializer.validated_data.get('observaciones')
            )
            
            # Retornar documento creado
            documento_serializer = DocumentoSoporteSerializer(documento)
            
            logger.info(f"Documento subido: {documento.tipo_documento} para radicación {radicacion.numero_radicado}")
            
            return Response(documento_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def radicate(self, request, pk=None):
        """
        Ejecuta el proceso de radicación
        Cambia estado de BORRADOR a RADICADA
        
        POST /api/radicacion/{id}/radicate/
        """
        radicacion = self.get_object()
        
        # Verificar permisos
        if request.user != radicacion.usuario_radicador:
            return Response(
                {'error': 'Solo el usuario radicador puede radicar la cuenta'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Ejecutar radicación usando el servicio
            radicacion_service = RadicacionService()
            radicacion_updated = radicacion_service.radicate_cuenta(radicacion.id)
            
            # Retornar radicación actualizada
            serializer = RadicacionCuentaMedicaSerializer(radicacion_updated)
            
            logger.info(f"Cuenta radicada: {radicacion_updated.numero_radicado}")
            
            return Response({
                'message': f'Cuenta radicada exitosamente con número {radicacion_updated.numero_radicado}',
                'radicacion': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error radicating cuenta: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """
        Lista todos los documentos de una radicación
        
        GET /api/radicacion/{id}/documents/
        """
        radicacion = self.get_object()
        documentos = radicacion.documentos.all().order_by('tipo_documento', '-created_at')
        
        serializer = DocumentoSoporteSerializer(documentos, many=True)
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def validation_summary(self, request, pk=None):
        """
        Resumen completo de validaciones de la radicación
        
        GET /api/radicacion/{id}/validation_summary/
        """
        radicacion = self.get_object()
        
        # Obtener validaciones de documentos
        validations = radicacion.validate_documents()
        
        # Información de documentos por tipo
        documentos_info = {}
        for documento in radicacion.documentos.all():
            tipo = documento.tipo_documento
            if tipo not in documentos_info:
                documentos_info[tipo] = []
            
            doc_info = {
                'id': str(documento.id),
                'nombre': documento.nombre_archivo,
                'estado': documento.estado,
                'validacion_resultado': documento.validacion_resultado,
                'created_at': documento.created_at
            }
            
            # Información específica de RIPS
            if tipo == 'RIPS' and hasattr(documento, 'validacion_rips'):
                rips_validation = ValidacionRIPSSerializer(documento.validacion_rips).data
                doc_info['validacion_rips'] = rips_validation
            
            documentos_info[tipo].append(doc_info)
        
        return Response({
            'radicacion_id': str(radicacion.id),
            'numero_radicado': radicacion.numero_radicado,
            'estado': radicacion.estado,
            'can_radicate': radicacion.can_radicate(),
            'validation_summary': validations,
            'documentos_por_tipo': documentos_info,
            'required_documents': radicacion.get_required_soportes()
        })
    
    @action(detail=True, methods=['get'])
    def soportes_clasificados(self, request, pk=None):
        """
        Obtiene soportes clasificados según Resolución 2284/2023
        
        GET /api/radicacion/{id}/soportes_clasificados/
        """
        radicacion = self.get_object()
        
        try:
            # Obtener servicio MongoDB
            soporte_service = get_soporte_service()
            
            # Clasificar todos los soportes si no están clasificados
            clasificacion_result = soporte_service.clasificar_batch(str(radicacion.id))
            
            # Obtener soportes clasificados agrupados
            soportes_data = soporte_service.obtener_soportes_clasificados(str(radicacion.id))
            
            return Response({
                'success': True,
                'radicacion_id': str(radicacion.id),
                'numero_radicado': radicacion.numero_radicado,
                'clasificacion_batch': clasificacion_result,
                'soportes_clasificados': soportes_data
            })
            
        except Exception as e:
            logger.error(f"Error obteniendo soportes clasificados: {str(e)}")
            return Response(
                {'error': f'Error obteniendo soportes clasificados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Estadísticas para dashboard de radicación
        
        GET /api/radicacion/dashboard_stats/
        """
        user = request.user
        
        # Base queryset según rol
        if user.is_pss_user:
            base_queryset = RadicacionCuentaMedica.objects.filter(usuario_radicador=user)
        else:
            base_queryset = RadicacionCuentaMedica.objects.all()
        
        # Estadísticas por estado
        stats_by_estado = base_queryset.values('estado').annotate(
            count=Count('id')
        ).order_by('estado')
        
        # Estadísticas por fechas (últimos 30 días)
        fecha_limite = timezone.now() - timezone.timedelta(days=30)
        recent_queryset = base_queryset.filter(created_at__gte=fecha_limite)
        
        # Radicaciones próximas a vencer (5 días)
        fecha_vencimiento = timezone.now() + timezone.timedelta(days=5)
        proximas_vencer = base_queryset.filter(
            estado='BORRADOR',
            fecha_limite_radicacion__lte=fecha_vencimiento
        ).count()
        
        # Radicaciones vencidas
        vencidas = base_queryset.filter(
            estado='BORRADOR',
            fecha_limite_radicacion__lt=timezone.now()
        ).count()
        
        return Response({
            'total_radicaciones': base_queryset.count(),
            'stats_by_estado': list(stats_by_estado),
            'radicaciones_ultimo_mes': recent_queryset.count(),
            'proximas_vencer': proximas_vencer,
            'vencidas': vencidas,
            'fecha_consulta': timezone.now()
        })
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """
        Exporta listado de radicaciones a Excel
        
        GET /api/radicacion/export/
        """
        try:
            from openpyxl import Workbook
            from django.http import HttpResponse
            from io import BytesIO
            
            # Obtener queryset con filtros aplicados
            queryset = self.filter_queryset(self.get_queryset())
            
            # Crear libro Excel
            wb = Workbook()
            ws = wb.active
            ws.title = "Radicaciones"
            
            # Headers
            headers = [
                'N° Radicado', 'Fecha Radicación', 'Prestador NIT', 'Prestador Nombre',
                'N° Factura', 'Valor Total', 'Estado', 'Días Transcurridos',
                'Usuario Radicador', 'Modalidad Pago', 'Tipo Servicio'
            ]
            ws.append(headers)
            
            # Datos
            for radicacion in queryset:
                dias = (timezone.now() - radicacion.created_at).days
                ws.append([
                    radicacion.numero_radicado,
                    radicacion.created_at.strftime('%Y-%m-%d %H:%M'),
                    radicacion.pss_nit,
                    radicacion.pss_nombre,
                    radicacion.factura_numero,
                    float(radicacion.factura_valor_total or 0),
                    radicacion.estado,
                    dias,
                    radicacion.usuario_radicador.username,
                    radicacion.modalidad_pago,
                    radicacion.tipo_servicio
                ])
            
            # Guardar en memoria
            virtual_workbook = BytesIO()
            wb.save(virtual_workbook)
            virtual_workbook.seek(0)
            
            # Preparar respuesta
            response = HttpResponse(
                virtual_workbook.getvalue(),
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename=radicaciones_{timezone.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
            
            return response
            
        except Exception as e:
            logger.error(f"Error exportando radicaciones: {str(e)}")
            return Response(
                {'error': f'Error exportando: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Descarga PDF de radicación con todos sus documentos
        
        GET /api/radicacion/{id}/download/
        """
        radicacion = self.get_object()
        
        try:
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet
            from reportlab.lib.units import inch
            from io import BytesIO
            from django.http import HttpResponse
            
            # Crear buffer
            buffer = BytesIO()
            
            # Crear documento PDF
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            elements = []
            styles = getSampleStyleSheet()
            
            # Título
            elements.append(Paragraph(f"Radicación {radicacion.numero_radicado}", styles['Title']))
            elements.append(Spacer(1, 0.5*inch))
            
            # Información general
            data = [
                ['Fecha Radicación:', radicacion.created_at.strftime('%Y-%m-%d %H:%M')],
                ['Prestador:', f"{radicacion.pss_nombre} (NIT: {radicacion.pss_nit})"],
                ['Factura:', radicacion.factura_numero],
                ['Valor Total:', f"${radicacion.factura_valor_total:,.2f}"],
                ['Estado:', radicacion.estado],
                ['Modalidad:', radicacion.get_modalidad_pago_display()],
                ['Tipo Servicio:', radicacion.get_tipo_servicio_display()]
            ]
            
            t = Table(data, colWidths=[2*inch, 4*inch])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.grey),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(t)
            elements.append(Spacer(1, 0.5*inch))
            
            # Documentos
            elements.append(Paragraph("Documentos Soportes", styles['Heading2']))
            elements.append(Spacer(1, 0.2*inch))
            
            doc_data = [['Tipo', 'Nombre Archivo', 'Estado', 'Fecha']]
            for doc in radicacion.documentos.all():
                doc_data.append([
                    doc.get_tipo_documento_display(),
                    doc.nombre_archivo,
                    doc.estado,
                    doc.created_at.strftime('%Y-%m-%d')
                ])
            
            doc_table = Table(doc_data, colWidths=[2*inch, 2.5*inch, 1*inch, 1.5*inch])
            doc_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(doc_table)
            
            # Generar PDF
            doc.build(elements)
            
            # Preparar respuesta
            buffer.seek(0)
            response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename=radicacion_{radicacion.numero_radicado}.pdf'
            
            return response
            
        except Exception as e:
            logger.error(f"Error generando PDF: {str(e)}")
            return Response(
                {'error': f'Error generando PDF: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def create_with_files(self, request):
        """
        Crea radicación completa con archivos en un solo paso
        Este endpoint se usa en el paso 3 para crear la radicación Y subir archivos a Digital Ocean
        
        POST /api/radicacion/create_with_files/
        """
        if not request.user.can_radicate:
            return Response(
                {'error': 'No tiene permisos para radicar cuentas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Extraer datos de radicación del FormData
            radicacion_data_json = request.data.get('radicacion_data')
            if not radicacion_data_json:
                return Response(
                    {'error': 'No se proporcionaron datos de radicación'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            import json
            radicacion_data = json.loads(radicacion_data_json)
            
            # Validar archivos requeridos
            files = request.FILES
            if 'factura_xml' not in files or 'rips_json' not in files or 'cuv_file' not in files:
                return Response({
                    'error': 'Se requieren archivos factura_xml, rips_json y cuv_file',
                    'required_files': ['factura_xml', 'rips_json', 'cuv_file']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 1. Procesar y validar archivos (sin almacenar aún)
            processor_result = FileProcessor.process_uploaded_files(files)
            
            if not processor_result['success']:
                return Response({
                    'error': 'Error procesando archivos',
                    'details': processor_result,
                    'errors': processor_result.get('errors', processor_result.get('errores', [])),
                    'cross_validation': processor_result.get('cross_validation', {})
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar validación cruzada
            cross_validation = processor_result.get('cross_validation', {})
            if not cross_validation.get('valido', False):
                return Response({
                    'error': 'Los archivos no pasaron la validación cruzada',
                    'cross_validation': cross_validation,
                    'errors': cross_validation.get('errores', [])
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. Almacenar archivos en Digital Ocean Spaces
            extracted_data = processor_result['extracted_data']
            nit_prestador = extracted_data.get('prestador_nit', 'sin_nit')
            storage_service = StorageService(nit_prestador=nit_prestador, radicacion_id=None)  # Aún no tenemos radicacion_id
            
            archivos_para_almacenar = {
                'factura_xml': files.get('factura_xml'),
                'rips_json': files.get('rips_json'),
                'soportes': []
            }
            
            # Recolectar soportes - LIMPIAR para evitar archivos fantasma
            archivos_para_almacenar['soportes'] = []  # Inicializar lista vacía
            
            # Primero agregar el CUV como soporte
            cuv_file = files.get('cuv_file')
            if cuv_file:
                archivos_para_almacenar['soportes'].append(cuv_file)
                logger.info(f"📎 CUV agregado como soporte: {cuv_file.name}")
            
            # Luego agregar soportes adicionales - DEPURACIÓN
            logger.info(f"🔍 DEBUG - Archivos en request.FILES: {list(files.keys())}")
            logger.info(f"🔍 DEBUG - request.FILES completo: {files}")
            
            # Usar un método más directo para obtener soportes
            soportes_adicionales = []
            for key in files:
                if key == 'soportes_adicionales':
                    # Solo tomar el primer archivo con este key
                    archivo = files[key]
                    if hasattr(archivo, 'read') and hasattr(archivo, 'name'):
                        soportes_adicionales.append(archivo)
                        logger.info(f"📎 Soporte adicional encontrado: {archivo.name} ({archivo.size} bytes)")
            
            # Si no encontramos con el método anterior, intentar getlist pero con validación
            if not soportes_adicionales and 'soportes_adicionales' in files:
                soportes_list = request.FILES.getlist('soportes_adicionales')
                logger.info(f"📎 Soportes adicionales recibidos vía getlist: {len(soportes_list)}")
                
                # Validar que no sean duplicados por tamaño y nombre
                vistos = set()
                for idx, soporte in enumerate(soportes_list):
                    if hasattr(soporte, 'read') and hasattr(soporte, 'name'):
                        identificador = f"{soporte.name}-{soporte.size}"
                        if identificador not in vistos:
                            vistos.add(identificador)
                            soportes_adicionales.append(soporte)
                            logger.info(f"  - Soporte {idx+1}: {soporte.name} ({soporte.size} bytes)")
                        else:
                            logger.warning(f"  - Soporte {idx+1} DUPLICADO IGNORADO: {soporte.name}")
            
            # Agregar soportes adicionales únicos
            archivos_para_almacenar['soportes'].extend(soportes_adicionales)
            
            logger.info(f"📤 Almacenando archivos en Digital Ocean Spaces para {nit_prestador}")
            logger.info(f"📋 Total de archivos a almacenar: XML={1 if archivos_para_almacenar.get('factura_xml') else 0}, RIPS={1 if archivos_para_almacenar.get('rips_json') else 0}, Soportes={len(archivos_para_almacenar.get('soportes', []))}")
            storage_results = storage_service.almacenar_multiples_archivos(archivos_para_almacenar)
            logger.info(f"📋 Storage results: {storage_results['resumen']}")
            
            # Verificar si realmente hubo errores de almacenamiento
            archivos_almacenados = storage_results['resumen'].get('archivos_almacenados', 0)
            total_archivos = storage_results['resumen'].get('total_archivos', 0)
            
            if archivos_almacenados < total_archivos:
                # Solo fallar si no se pudieron almacenar todos los archivos
                logger.error(f"Solo se almacenaron {archivos_almacenados} de {total_archivos} archivos")
                return Response({
                    'error': f'Error almacenando archivos: solo {archivos_almacenados} de {total_archivos} se almacenaron correctamente',
                    'storage_results': storage_results
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # 3. Crear la radicación en la base de datos
            radicacion_service = RadicacionService()
            
            # Agregar usuario radicador
            radicacion_data['usuario_radicador'] = request.user.id
            
            # Agregar rutas de archivos almacenados
            if storage_results['factura']:
                radicacion_data['factura_url'] = storage_results['factura']['url']
            if storage_results['rips']:
                radicacion_data['rips_url'] = storage_results['rips']['url']
            
            serializer = RadicacionCreateSerializer(data=radicacion_data)
            serializer.is_valid(raise_exception=True)
            
            radicacion = radicacion_service.create_radicacion(
                serializer.validated_data,
                request.user
            )
            
            # 4. Los soportes ya fueron clasificados y almacenados en Digital Ocean Spaces
            # No es necesario registrarlos nuevamente ya que storage_service se encargó de todo
            # La información de clasificación ya está en storage_results['soportes']
            
            # 5. Procesar RIPS si fue almacenado pero no procesado aún
            if storage_results.get('rips') and storage_results['rips'].get('almacenado'):
                rips_result = storage_results['rips']
                if not rips_result.get('procesamiento_mongodb'):
                    try:
                        logger.info(f"🔄 Procesando RIPS para radicación {radicacion.id}")
                        # Volver a procesar el RIPS con el ID de radicación correcto
                        procesamiento_resultado = storage_service.procesar_y_guardar_rips(
                            rips_result.get('rips_data', {}),
                            str(radicacion.id),
                            rips_result.get('path_almacenamiento', '')
                        )
                        logger.info(f"✅ RIPS procesado post-radicación: {procesamiento_resultado['usuarios_procesados']} usuarios")
                    except Exception as e:
                        logger.error(f"Error procesando RIPS post-radicación: {str(e)}")
            
            logger.info(f"✅ Radicación creada exitosamente: {radicacion.numero_radicado}")
            
            # Retornar radicación creada
            result_serializer = RadicacionCuentaMedicaSerializer(radicacion)
            
            # Asegurar que todos los IDs están serializados como strings
            response_data = {
                'success': True,
                'numero_radicado': radicacion.numero_radicado,
                'radicacion': result_serializer.data,
                'storage_summary': storage_results['resumen'],
                'message': f'Cuenta radicada exitosamente con número {radicacion.numero_radicado}'
            }
            
            # Convertir cualquier ObjectId a string en la respuesta
            import json
            from bson import ObjectId
            
            def convert_objectid(obj):
                """Convierte ObjectIds a strings recursivamente"""
                if isinstance(obj, ObjectId):
                    return str(obj)
                elif isinstance(obj, dict):
                    return {k: convert_objectid(v) for k, v in obj.items()}
                elif isinstance(obj, list):
                    return [convert_objectid(item) for item in obj]
                return obj
            
            response_data = convert_objectid(response_data)
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback
            logger.error(f"Error creando radicación con archivos: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'error': f'Error interno: {str(e)}',
                'type': type(e).__name__
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def process_files(self, request):
        """
        Procesa archivos XML y JSON automáticamente extrayendo información
        Endpoint inteligente que evita duplicar datos que ya están en los archivos
        
        POST /api/radicacion/process_files/
        Files: factura_xml, rips_json, soportes_adicionales
        """
        if not request.user.can_radicate:
            return Response(
                {'error': 'No tiene permisos para radicar cuentas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        files = request.FILES
        
        # Debug: log archivos recibidos
        logger.info(f"Archivos recibidos: {list(files.keys())}")
        for key, file in files.items():
            logger.info(f"  {key}: {type(file)} - {getattr(file, 'name', 'sin nombre')}")
        
        # Validar archivos requeridos
        if 'factura_xml' not in files or 'rips_json' not in files:
            return Response({
                'error': 'Se requieren archivos factura_xml y rips_json',
                'required_files': ['factura_xml', 'rips_json'],
                'optional_files': ['soportes_adicionales']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Procesar archivos y extraer información automáticamente
            processor_result = FileProcessor.process_uploaded_files(files)
            
            if not processor_result['success']:
                logger.error(f"Error en processor_result: {processor_result}")
                return Response({
                    'error': 'Error procesando archivos',
                    'details': processor_result,
                    'errors': processor_result.get('errors', []),
                    'validation_summary': processor_result.get('validation_summary', {}),
                    'cross_validation': processor_result.get('cross_validation', {}),
                    'suggestion': 'Verifique que los archivos tengan formato válido XML/JSON'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            extracted_data = processor_result['extracted_data']
            
            # Mapear choices a valores válidos del modelo
            tipo_servicio_mapeado = DataMapper.map_tipo_servicio(extracted_data.get('tipo_servicio_principal'))
            modalidad_pago_mapeada = DataMapper.map_modalidad_pago(extracted_data.get('modalidad_pago_inferida'))
            
            # Extraer datos del paciente desde RIPS
            patient_data = DataMapper.extract_patient_data_from_rips(extracted_data.get('rips_data', {}))
            
            # Extraer múltiples pacientes (primeros 5)
            rips_data = extracted_data.get('rips_data', {})
            logger.info(f"RIPS data disponible: {bool(rips_data)}")
            logger.info(f"Usuarios en RIPS: {len(rips_data.get('usuarios', []))}")
            
            multiple_patients = DataMapper.extract_multiple_patients_from_rips(rips_data, max_patients=5)
            logger.info(f"Pacientes múltiples extraídos: {len(multiple_patients)}")
            
            # IMPORTANTE: Verificar si la validación cruzada pasó
            cross_validation = processor_result.get('cross_validation', {})
            validation_passed = cross_validation.get('valido', False)
            
            # NO almacenar archivos en este paso - Solo procesar y validar
            logger.info("📋 Procesamiento y validación completados - NO se almacenan archivos aún")
            logger.info("💾 Los archivos se almacenarán cuando el usuario confirme la radicación en el paso 3")
            
            # Preparar lista de archivos para mostrar en el frontend
            archivos_procesados = {
                'factura_xml': {
                    'nombre': files.get('factura_xml').name if 'factura_xml' in files else None,
                    'tamaño': files.get('factura_xml').size if 'factura_xml' in files else None
                },
                'rips_json': {
                    'nombre': files.get('rips_json').name if 'rips_json' in files else None,
                    'tamaño': files.get('rips_json').size if 'rips_json' in files else None
                },
                'cuv_file': {
                    'nombre': files.get('cuv_file').name if 'cuv_file' in files else None,
                    'tamaño': files.get('cuv_file').size if 'cuv_file' in files else None
                },
                'soportes': []
            }
            
            # Listar soportes procesados
            if 'soportes_adicionales' in files:
                soportes_list = request.FILES.getlist('soportes_adicionales')
                for soporte in soportes_list:
                    archivos_procesados['soportes'].append({
                        'nombre': soporte.name,
                        'tamaño': soporte.size
                    })
            
            # Respuesta con información extraída automáticamente
            response_data = {
                'success': validation_passed,  # Cambiar success basado en validación
                'extracted_info': {
                    'prestador': {
                        'nit': extracted_data.get('prestador_nit'),
                        'nombre': extracted_data.get('prestador_nombre')
                    },
                    'factura': {
                        'numero': extracted_data.get('numero_factura'),
                        'fecha_expedicion': extracted_data.get('fecha_expedicion'),
                        'cufe': extracted_data.get('cufe'),
                        'valor_total': float(extracted_data.get('valor_total_factura') or 0),
                        'resumen_monetario': extracted_data.get('resumen_monetario', {}),
                        'sector_salud': extracted_data.get('sector_salud')
                    },
                    'servicios': {
                        'tipo_principal': tipo_servicio_mapeado,
                        'modalidad_inferida': modalidad_pago_mapeada,
                        'periodo_facturado': extracted_data.get('periodo_facturado'),
                        'estadisticas': extracted_data.get('estadisticas', {}),
                        'detalle_completo': {
                            'consultas': extracted_data.get('estadisticas', {}).get('consultas', 0),
                            'procedimientos': extracted_data.get('estadisticas', {}).get('procedimientos', 0),
                            'medicamentos': extracted_data.get('estadisticas', {}).get('medicamentos', 0),
                            'urgencias': extracted_data.get('estadisticas', {}).get('urgencias', 0),
                            'hospitalizacion': extracted_data.get('estadisticas', {}).get('hospitalizacion', 0),
                            'otros_servicios': extracted_data.get('estadisticas', {}).get('otros_servicios', 0),
                            'recien_nacidos': extracted_data.get('estadisticas', {}).get('recien_nacidos', 0)
                        }
                    },
                    'paciente': patient_data,
                    'pacientes_multiples': multiple_patients,  # Lista de hasta 5 pacientes
                    'rips_data': extracted_data.get('rips_data', {})  # Incluir datos RIPS completos
                },
                'file_info': processor_result['file_info'],
                'ready_to_create': processor_result['ready_to_radicate'],
                'cross_validation': cross_validation,  # Agregar resultados de validación cruzada
                'message': 'Información extraída automáticamente de los archivos' if validation_passed else 'Archivos procesados pero con errores de validación',
                'mapped_data': {
                    'tipo_servicio_original': extracted_data.get('tipo_servicio_principal'),
                    'tipo_servicio_mapeado': tipo_servicio_mapeado,
                    'modalidad_original': extracted_data.get('modalidad_pago_inferida'),
                    'modalidad_mapeada': modalidad_pago_mapeada
                },
                # Información de archivos procesados (pero NO almacenados aún)
                'archivos_procesados': archivos_procesados,
                'almacenamiento_pendiente': True,  # Indicar que el almacenamiento está pendiente
                'mensaje_almacenamiento': 'Los archivos se almacenarán al confirmar la radicación en el paso 3'
            }
            
            logger.info(f"Archivos procesados para {extracted_data.get('prestador_nit')}: {extracted_data.get('numero_factura')}")
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error procesando archivos: {str(e)}")
            return Response({
                'error': f'Error interno procesando archivos: {str(e)}',
                'suggestion': 'Contacte al administrador si el problema persiste'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentoSoporteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta de documentos de soporte
    Solo lectura, los documentos se crean via RadicacionViewSet.upload_document
    """
    
    queryset = DocumentoSoporte.objects.all()
    serializer_class = DocumentoSoporteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo_documento', 'estado', 'radicacion']
    
    def get_queryset(self):
        """Filtrar documentos según permisos del usuario"""
        user = self.request.user
        
        if user.is_pss_user:
            # PSS solo ve documentos de sus radicaciones
            return DocumentoSoporte.objects.filter(radicacion__usuario_radicador=user)
        
        return DocumentoSoporte.objects.all()
    
    @action(detail=True, methods=['get'])
    def validation_detail(self, request, pk=None):
        """
        Detalle completo de validación de un documento
        
        GET /api/documentos/{id}/validation_detail/
        """
        documento = self.get_object()
        
        result = {
            'documento_id': str(documento.id),
            'tipo_documento': documento.tipo_documento,
            'estado': documento.estado,
            'validacion_resultado': documento.validacion_resultado
        }
        
        # Información específica de RIPS
        if documento.tipo_documento == 'RIPS' and hasattr(documento, 'validacion_rips'):
            result['validacion_rips'] = ValidacionRIPSSerializer(documento.validacion_rips).data
        
        return Response(result)


class ValidacionRIPSViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta de validaciones RIPS con MinSalud
    """
    
    queryset = ValidacionRIPS.objects.all()
    serializer_class = ValidacionRIPSSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado_validacion', 'es_valido']
    
    def get_queryset(self):
        """Filtrar validaciones según permisos del usuario"""
        user = self.request.user
        
        if user.is_pss_user:
            # PSS solo ve validaciones de sus documentos
            return ValidacionRIPS.objects.filter(
                documento__radicacion__usuario_radicador=user
            )
        
        return ValidacionRIPS.objects.all()
    
    @action(detail=True, methods=['post'])
    def revalidate(self, request, pk=None):
        """
        Re-ejecuta validación RIPS con MinSalud
        
        POST /api/validaciones-rips/{id}/revalidate/
        """
        validacion = self.get_object()
        
        # Solo permitir revalidación a documentos con errores
        if validacion.es_valido:
            return Response(
                {'error': 'El documento ya está validado correctamente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Aquí implementaríamos la revalidación con MinSalud
            # Por ahora simulamos el proceso
            
            validacion.estado_validacion = 'REVALIDANDO'
            validacion.save()
            
            logger.info(f"Revalidación RIPS iniciada para documento {validacion.documento.id}")
            
            return Response({
                'message': 'Revalidación iniciada',
                'validacion_id': str(validacion.id)
            })
            
        except Exception as e:
            logger.error(f"Error revalidating RIPS: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )