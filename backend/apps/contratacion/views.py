# -*- coding: utf-8 -*-
# apps/contratacion/views.py

from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FileUploadParser
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q
from datetime import datetime
import pandas as pd
import os
from decimal import Decimal

# Custom renderer for MongoDB ObjectId handling
from .renderers import MongoJSONRenderer

# Models
from .models import (
    TarifariosCUPS, TarifariosMedicamentos, TarifariosDispositivos,
    Prestador, ModalidadPago, Contrato, CatalogoCUPS, CatalogoCUM,
    CatalogoIUM, CatalogoDispositivos, TarifarioPersonalizado,
    PaqueteServicios, TarifarioPaquete
)

# Serializers
from .serializers import (
    TarifariosCUPSSerializer, TarifariosMedicamentosSerializer,
    TarifariosDispositivosSerializer, ValidacionTarifaSerializer,
    ResultadoValidacionTarifaSerializer, PrestadorSerializer,
    ModalidadPagoSerializer, ContratoListSerializer, ContratoDetailSerializer,
    CatalogoCUPSSerializer, CatalogoCUMSerializer, TarifarioCreateSerializer,
    CatalogoIUMSerializer, CatalogoDispositivosSerializer,
    TarifarioPersonalizadoSerializer, PaqueteServiciosSerializer,
    TarifarioPaqueteSerializer, ValidacionTarifaExtendidaSerializer
)


class TarifariosCUPSViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de tarifarios CUPS contractuales
    """
    queryset = TarifariosCUPS.objects.all()
    serializer_class = TarifariosCUPSSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]  # Usar renderer personalizado para ObjectId
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contrato_numero', 'estado', 'restricciones_ambito', 'requiere_autorizacion']
    search_fields = ['codigo_cups', 'descripcion']
    ordering_fields = ['codigo_cups', 'valor_unitario', 'vigencia_desde']
    ordering = ['codigo_cups']
    
    @action(detail=False, methods=['post'])
    def validar_tarifa(self, request):
        """
        Validación de tarifa CUPS contractual
        """
        serializer = ValidacionTarifaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        codigo = serializer.validated_data['codigo']
        contrato_numero = serializer.validated_data['contrato_numero']
        valor_facturado = serializer.validated_data['valor_facturado']
        fecha_servicio = serializer.validated_data['fecha_servicio']
        
        try:
            tarifa = TarifariosCUPS.objects.get(
                codigo_cups=codigo,
                contrato_numero=contrato_numero,
                estado='ACTIVO',
                vigencia_desde__lte=fecha_servicio,
                vigencia_hasta__gte=fecha_servicio
            )
            
            diferencia = valor_facturado - tarifa.valor_unitario
            
            resultado = {
                'codigo': codigo,
                'tipo_codigo': 'CUPS',
                'tarifa_encontrada': True,
                'valor_contractual': tarifa.valor_unitario,
                'valor_facturado': valor_facturado,
                'diferencia': diferencia,
                'requiere_autorizacion': tarifa.requiere_autorizacion,
                'restricciones_aplicables': [],
                'observaciones': 'Tarifa encontrada y válida' if diferencia == 0 else f'Diferencia de ${diferencia}'
            }
            
            response_serializer = ResultadoValidacionTarifaSerializer(resultado)
            return Response(response_serializer.data)
            
        except TarifariosCUPS.DoesNotExist:
            resultado = {
                'codigo': codigo,
                'tipo_codigo': 'CUPS',
                'tarifa_encontrada': False,
                'valor_facturado': valor_facturado,
                'observaciones': f'Tarifa CUPS {codigo} no encontrada en contrato {contrato_numero}'
            }
            
            response_serializer = ResultadoValidacionTarifaSerializer(resultado)
            return Response(response_serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_contrato(self, request):
        """
        Tarifarios por contrato específico
        """
        contrato_numero = request.query_params.get('contrato', None)
        if not contrato_numero:
            return Response(
                {'error': 'Parámetro contrato es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tarifarios = TarifariosCUPS.objects.filter(
            contrato_numero=contrato_numero,
            estado='ACTIVO'
        )
        
        serializer = self.get_serializer(tarifarios, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
    def importar_excel(self, request):
        """
        Importar tarifarios CUPS desde archivo Excel
        """
        if 'archivo' not in request.FILES:
            return Response(
                {'error': 'Archivo Excel es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        archivo = request.FILES['archivo']
        prestador_nit = request.data.get('prestador_nit')
        hoja = request.data.get('hoja', 'Sheet1')
        skip_rows = int(request.data.get('skip_rows', 0))
        
        # Validar prestador
        try:
            prestador = Prestador.objects.get(nit=prestador_nit)
        except Prestador.DoesNotExist:
            return Response(
                {'error': f'Prestador con NIT {prestador_nit} no encontrado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Guardar archivo temporalmente
            temp_file = f'/tmp/{archivo.name}'
            with open(temp_file, 'wb+') as destination:
                for chunk in archivo.chunks():
                    destination.write(chunk)
            
            # Leer Excel
            df = pd.read_excel(temp_file, sheet_name=hoja, skiprows=skip_rows)
            
            # Procesar importación
            exitosos, errores, detalles_errores = self._procesar_importacion_cups(
                df, prestador, request.user
            )
            
            # Limpiar archivo temporal
            os.remove(temp_file)
            
            return Response({
                'mensaje': 'Importación completada',
                'registros_exitosos': exitosos,
                'registros_con_error': errores,
                'total_procesados': len(df),
                'errores': detalles_errores[:10]  # Solo primeros 10 errores
            })
            
        except Exception as e:
            return Response(
                {'error': f'Error procesando archivo: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _procesar_importacion_cups(self, df, prestador, usuario):
        """Procesar importación de tarifarios CUPS"""
        exitosos = 0
        errores = 0
        detalles_errores = []
        
        # Detectar columnas automáticamente
        columnas = self._detectar_columnas_cups(df.columns)
        
        if not columnas:
            return 0, len(df), ['No se pudieron detectar las columnas requeridas']
        
        for index, row in df.iterrows():
            try:
                codigo_cups = str(row[columnas['codigo']]).strip()
                descripcion = str(row[columnas['descripcion']]).strip()
                
                # Obtener valores monetarios
                valor_iss = self._limpiar_valor(row.get(columnas.get('valor_iss'), 0))
                valor_soat = self._limpiar_valor(row.get(columnas.get('valor_soat'), 0))
                valor_particular = self._limpiar_valor(row.get(columnas.get('valor_particular'), 0))
                
                # Usar el mayor valor como unitario
                valor_unitario = max(valor_iss, valor_soat, valor_particular)
                
                if valor_unitario == 0:
                    valor_unitario = valor_iss or valor_soat or valor_particular
                
                # Verificar que el código CUPS existe en el catálogo oficial
                # Si no existe, se podría crear o marcar como pendiente de validación
                
                # Crear/actualizar tarifa CUPS contractual
                TarifariosCUPS.objects.update_or_create(
                    codigo_cups=codigo_cups,
                    contrato_numero=f"IMPORT_{prestador.nit}",
                    defaults={
                        'descripcion': descripcion,
                        'valor_unitario': valor_unitario,
                        'estado': 'ACTIVO',
                        'vigencia_desde': datetime.now().date(),
                        'vigencia_hasta': None,  # Sin fecha fin por defecto
                        'created_by': usuario
                    }
                )
                
                exitosos += 1
                
            except Exception as e:
                errores += 1
                detalles_errores.append(f'Fila {index + 1}: {str(e)}')
        
        return exitosos, errores, detalles_errores
    
    def _detectar_columnas_cups(self, columnas):
        """Detectar automáticamente las columnas para CUPS"""
        columnas_lower = [col.lower() for col in columnas]
        
        mapeo = {}
        
        # Detectar código CUPS
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['codigo', 'cups', 'cod']):
                mapeo['codigo'] = columnas[i]
                break
        
        # Detectar descripción
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['descripcion', 'desc', 'nombre', 'procedimiento']):
                mapeo['descripcion'] = columnas[i]
                break
        
        # Detectar valores
        for i, col in enumerate(columnas_lower):
            if any(word in col for word in ['iss', 'valor_iss']):
                mapeo['valor_iss'] = columnas[i]
            elif any(word in col for word in ['soat', 'valor_soat']):
                mapeo['valor_soat'] = columnas[i]
            elif any(word in col for word in ['particular', 'valor_particular', 'privado']):
                mapeo['valor_particular'] = columnas[i]
        
        return mapeo if 'codigo' in mapeo and 'descripcion' in mapeo else None
    
    def _limpiar_valor(self, valor):
        """Limpiar y convertir valores monetarios"""
        if pd.isna(valor) or valor == '':
            return Decimal('0')
        
        # Convertir a string y limpiar
        valor_str = str(valor).replace(',', '').replace('$', '').replace(' ', '')
        
        try:
            return Decimal(valor_str)
        except:
            return Decimal('0')


class TarifariosMedicamentosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de tarifarios de medicamentos contractuales
    """
    queryset = TarifariosMedicamentos.objects.all()
    serializer_class = TarifariosMedicamentosSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]  # Usar renderer personalizado para ObjectId
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contrato_numero', 'estado', 'es_pos', 'es_no_pos', 'requiere_autorizacion']
    search_fields = ['codigo_cum', 'codigo_ium', 'descripcion', 'principio_activo']
    ordering_fields = ['codigo_cum', 'codigo_ium', 'valor_unitario', 'vigencia_desde']
    ordering = ['codigo_cum']
    
    @action(detail=False, methods=['post'])
    def validar_tarifa(self, request):
        """
        Validación de tarifa de medicamento contractual
        """
        serializer = ValidacionTarifaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        codigo = serializer.validated_data['codigo']
        tipo_codigo = serializer.validated_data['tipo_codigo']
        contrato_numero = serializer.validated_data['contrato_numero']
        valor_facturado = serializer.validated_data['valor_facturado']
        fecha_servicio = serializer.validated_data['fecha_servicio']
        
        # Buscar por CUM o IUM según el tipo
        filtro = {}
        if tipo_codigo == 'CUM':
            filtro['codigo_cum'] = codigo
        elif tipo_codigo == 'IUM':
            filtro['codigo_ium'] = codigo
        else:
            return Response(
                {'error': 'tipo_codigo debe ser CUM o IUM para medicamentos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        filtro.update({
            'contrato_numero': contrato_numero,
            'estado': 'ACTIVO',
            'vigencia_desde__lte': fecha_servicio,
            'vigencia_hasta__gte': fecha_servicio
        })
        
        try:
            tarifa = TarifariosMedicamentos.objects.get(**filtro)
            
            diferencia = valor_facturado - tarifa.valor_unitario
            
            resultado = {
                'codigo': codigo,
                'tipo_codigo': tipo_codigo,
                'tarifa_encontrada': True,
                'valor_contractual': tarifa.valor_unitario,
                'valor_facturado': valor_facturado,
                'diferencia': diferencia,
                'requiere_autorizacion': tarifa.requiere_autorizacion,
                'restricciones_aplicables': [],
                'observaciones': 'Tarifa encontrada y válida' if diferencia == 0 else f'Diferencia de ${diferencia}'
            }
            
            response_serializer = ResultadoValidacionTarifaSerializer(resultado)
            return Response(response_serializer.data)
            
        except TarifariosMedicamentos.DoesNotExist:
            resultado = {
                'codigo': codigo,
                'tipo_codigo': tipo_codigo,
                'tarifa_encontrada': False,
                'valor_facturado': valor_facturado,
                'observaciones': f'Tarifa {tipo_codigo} {codigo} no encontrada en contrato {contrato_numero}'
            }
            
            response_serializer = ResultadoValidacionTarifaSerializer(resultado)
            return Response(response_serializer.data)


class TarifariosDispositivosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de tarifarios de dispositivos contractuales
    """
    queryset = TarifariosDispositivos.objects.all()
    serializer_class = TarifariosDispositivosSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]  # Usar renderer personalizado para ObjectId
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contrato_numero', 'estado', 'requiere_autorizacion']
    search_fields = ['codigo_dispositivo', 'descripcion']
    ordering_fields = ['codigo_dispositivo', 'valor_unitario', 'vigencia_desde']
    ordering = ['codigo_dispositivo']
    
    @action(detail=False, methods=['post'])
    def validar_tarifa(self, request):
        """
        Validación de tarifa de dispositivo contractual
        """
        serializer = ValidacionTarifaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        codigo = serializer.validated_data['codigo']
        contrato_numero = serializer.validated_data['contrato_numero']
        valor_facturado = serializer.validated_data['valor_facturado']
        fecha_servicio = serializer.validated_data['fecha_servicio']
        
        try:
            tarifa = TarifariosDispositivos.objects.get(
                codigo_dispositivo=codigo,
                contrato_numero=contrato_numero,
                estado='ACTIVO',
                vigencia_desde__lte=fecha_servicio,
                vigencia_hasta__gte=fecha_servicio
            )
            
            diferencia = valor_facturado - tarifa.valor_unitario
            
            resultado = {
                'codigo': codigo,
                'tipo_codigo': 'DISPOSITIVO',
                'tarifa_encontrada': True,
                'valor_contractual': tarifa.valor_unitario,
                'valor_facturado': valor_facturado,
                'diferencia': diferencia,
                'requiere_autorizacion': tarifa.requiere_autorizacion,
                'restricciones_aplicables': [tarifa.restricciones_uso] if tarifa.restricciones_uso else [],
                'observaciones': 'Tarifa encontrada y válida' if diferencia == 0 else f'Diferencia de ${diferencia}'
            }
            
            response_serializer = ResultadoValidacionTarifaSerializer(resultado)
            return Response(response_serializer.data)
            
        except TarifariosDispositivos.DoesNotExist:
            resultado = {
                'codigo': codigo,
                'tipo_codigo': 'DISPOSITIVO',
                'tarifa_encontrada': False,
                'valor_facturado': valor_facturado,
                'observaciones': f'Tarifa dispositivo {codigo} no encontrada en contrato {contrato_numero}'
            }
            
            response_serializer = ResultadoValidacionTarifaSerializer(resultado)
            return Response(response_serializer.data)


class PrestadorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de la Red de Prestadores
    """
    queryset = Prestador.objects.all()
    serializer_class = PrestadorSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]  # Usar renderer personalizado para ObjectId
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo_prestador', 'nivel_atencion', 'departamento', 'ciudad', 'estado', 'habilitado_reps']
    search_fields = ['nit', 'razon_social', 'nombre_comercial', 'codigo_habilitacion']
    ordering_fields = ['razon_social', 'created_at']
    ordering = ['razon_social']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Obtener solo prestadores activos con contrato vigente"""
        prestadores = self.queryset.filter(
            estado='ACTIVO',
            contratos__estado='VIGENTE'
        ).distinct()
        
        page = self.paginate_queryset(prestadores)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(prestadores, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def contratos(self, request, pk=None):
        """Obtener contratos de un prestador específico"""
        prestador = self.get_object()
        contratos = prestador.contratos.all()
        serializer = ContratoListSerializer(contratos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas generales de prestadores"""
        from django.db.models import Count, Q
        from datetime import datetime, timedelta
        
        # Total de prestadores
        total = self.queryset.count()
        total_mes_anterior = self.queryset.filter(
            created_at__lt=datetime.now() - timedelta(days=30)
        ).count()
        
        # Prestadores activos
        activos = self.queryset.filter(estado='ACTIVO').count()
        activos_mes_anterior = self.queryset.filter(
            estado='ACTIVO',
            created_at__lt=datetime.now() - timedelta(days=30)
        ).count()
        
        # Prestadores con contratos vigentes
        con_contratos = self.queryset.filter(
            contratos__estado='VIGENTE'
        ).distinct().count()
        con_contratos_mes_anterior = self.queryset.filter(
            contratos__estado='VIGENTE',
            contratos__created_at__lt=datetime.now() - timedelta(days=30)
        ).distinct().count()
        
        # Prestadores de alta complejidad (III y IV)
        alta_complejidad = self.queryset.filter(
            Q(nivel_atencion='III') | Q(nivel_atencion='IV')
        ).count()
        alta_complejidad_mes_anterior = self.queryset.filter(
            Q(nivel_atencion='III') | Q(nivel_atencion='IV'),
            created_at__lt=datetime.now() - timedelta(days=30)
        ).count()
        
        # Calcular porcentaje de cambio vs mes anterior
        def calcular_porcentaje_cambio(actual, anterior):
            if anterior == 0:
                return 100 if actual > 0 else 0
            return round(((actual - anterior) / anterior) * 100)
        
        # Calcular porcentaje del total
        def calcular_porcentaje_del_total(valor, total):
            if total == 0:
                return 0
            return round((valor / total) * 100)
        
        return Response({
            'total': total,
            'total_cambio': calcular_porcentaje_cambio(total, total_mes_anterior),
            'activos': activos,
            'activos_porcentaje': calcular_porcentaje_del_total(activos, total),
            'con_contratos': con_contratos,
            'con_contratos_porcentaje': calcular_porcentaje_del_total(con_contratos, total),
            'alta_complejidad': alta_complejidad,
            'alta_complejidad_porcentaje': calcular_porcentaje_del_total(alta_complejidad, total)
        })


class ModalidadPagoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Modalidades de Pago
    """
    queryset = ModalidadPago.objects.all()
    serializer_class = ModalidadPagoSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]  # Usar renderer personalizado para ObjectId
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['codigo', 'nombre']
    ordering = ['codigo']
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas de uso de modalidades"""
        from django.db.models import Count, Sum
        
        estadisticas = []
        for modalidad in self.queryset:
            contratos = Contrato.objects.filter(modalidad_principal=modalidad)
            stats = contratos.aggregate(
                total_contratos=Count('id'),
                valor_total=Sum('valor_total')
            )
            
            estadisticas.append({
                'modalidad': ModalidadPagoSerializer(modalidad).data,
                'contratos': stats['total_contratos'] or 0,
                'valor_total': float(stats['valor_total'] or 0)
            })
        
        return Response(estadisticas)


class ContratoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Contratos
    """
    queryset = Contrato.objects.all()
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]  # Usar renderer personalizado para ObjectId
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'modalidad_principal', 'prestador', 'manual_tarifario']
    search_fields = ['numero_contrato', 'prestador__razon_social', 'prestador__nit']
    ordering_fields = ['fecha_inicio', 'fecha_fin', 'valor_total', 'created_at']
    ordering = ['-fecha_inicio']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ContratoListSerializer
        return ContratoDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def vigentes(self, request):
        """Obtener contratos vigentes"""
        contratos = self.queryset.filter(estado='VIGENTE')
        
        page = self.paginate_queryset(contratos)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(contratos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_vencer(self, request):
        """Obtener contratos próximos a vencer (30 días)"""
        contratos = self.queryset.filter(estado='POR_VENCER')
        
        page = self.paginate_queryset(contratos)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(contratos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def actualizar_estado(self, request, pk=None):
        """Actualizar estado del contrato según fechas"""
        contrato = self.get_object()
        contrato.actualizar_estado()
        serializer = self.get_serializer(contrato)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def tarifarios(self, request, pk=None):
        """Obtener tarifarios de un contrato"""
        contrato = self.get_object()
        
        tarifarios_cups = TarifariosCUPS.objects.filter(
            contrato_numero=contrato.numero_contrato
        )
        tarifarios_medicamentos = TarifariosMedicamentos.objects.filter(
            contrato_numero=contrato.numero_contrato
        )
        tarifarios_dispositivos = TarifariosDispositivos.objects.filter(
            contrato_numero=contrato.numero_contrato
        )
        
        data = {
            'cups': TarifariosCUPSSerializer(tarifarios_cups, many=True).data,
            'medicamentos': TarifariosMedicamentosSerializer(tarifarios_medicamentos, many=True).data,
            'dispositivos': TarifariosDispositivosSerializer(tarifarios_dispositivos, many=True).data
        }
        
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas generales de contratos"""
        from django.db.models import Count, Sum, Q
        from datetime import date, timedelta
        
        total = self.queryset.count()
        vigentes = self.queryset.filter(estado='VIGENTE').count()
        por_vencer = self.queryset.filter(estado='POR_VENCER').count()
        
        valor_total = self.queryset.filter(
            estado__in=['VIGENTE', 'POR_VENCER']
        ).aggregate(total=Sum('valor_total'))['total'] or 0
        
        prestadores_con_contrato = Prestador.objects.filter(
            contratos__estado='VIGENTE'
        ).distinct().count()
        
        # Contar contratos por modalidad
        contratos_capitacion = self.queryset.filter(
            estado='VIGENTE',
            modalidad_principal__codigo='CAPITACION'
        ).count()
        
        # Calcular porcentaje de capitación
        porcentaje_capitacion = 0
        if vigentes > 0:
            porcentaje_capitacion = round((contratos_capitacion / vigentes) * 100)
        
        return Response({
            'total_contratos': total,
            'contratos_vigentes': vigentes,
            'contratos_por_vencer': por_vencer,
            'valor_total_contratado': float(valor_total),
            'prestadores_con_contrato': prestadores_con_contrato,
            'contratos_capitacion': contratos_capitacion,
            'porcentaje_capitacion': porcentaje_capitacion
        })


class CatalogoCUPSViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Catálogo CUPS
    """
    queryset = CatalogoCUPS.objects.all()
    serializer_class = CatalogoCUPSSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'capitulo', 'nivel_complejidad', 'activo', 'requiere_autorizacion']
    search_fields = ['codigo', 'descripcion']
    ordering_fields = ['codigo', 'descripcion']
    ordering = ['codigo']
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """Búsqueda rápida de códigos CUPS"""
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response({'error': 'La búsqueda debe tener al menos 2 caracteres'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        resultados = self.queryset.filter(
            Q(codigo__icontains=query) | Q(descripcion__icontains=query),
            activo=True
        )[:20]
        
        serializer = self.get_serializer(resultados, many=True)
        return Response(serializer.data)


class CatalogoCUMViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Catálogo CUM
    """
    queryset = CatalogoCUM.objects.all()
    serializer_class = CatalogoCUMSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['es_pos', 'es_controlado', 'activo', 'requiere_autorizacion']
    search_fields = ['codigo_cum', 'nombre_generico', 'nombre_comercial']
    ordering_fields = ['codigo_cum', 'nombre_generico']
    ordering = ['nombre_generico']
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """Búsqueda rápida de medicamentos"""
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response({'error': 'La búsqueda debe tener al menos 2 caracteres'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        resultados = self.queryset.filter(
            Q(codigo_cum__icontains=query) | 
            Q(nombre_generico__icontains=query) |
            Q(nombre_comercial__icontains=query),
            activo=True
        )[:20]
        
        serializer = self.get_serializer(resultados, many=True)
        return Response(serializer.data)