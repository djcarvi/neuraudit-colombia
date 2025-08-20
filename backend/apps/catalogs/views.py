# -*- coding: utf-8 -*-
# apps/catalogs/views.py

"""
Vistas API REST para catálogos - NeurAudit Colombia
APIs con Django MongoDB Backend y servicios nativos
"""

from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from datetime import datetime
import logging

# Models
from .models import (
    CatalogoCUPSOficial, CatalogoCUMOficial, CatalogoIUMOficial,
    CatalogoDispositivosOficial, BDUAAfiliados, Prestadores, Contratos
)

# Serializers
from .serializers import (
    CatalogoCUPSOficialSerializer, CatalogoCUMOficialSerializer,
    CatalogoIUMOficialSerializer, CatalogoDispositivosOficialSerializer,
    BDUAAfiliadosSerializer, BDUAAfiliadosSearchSerializer,
    BDUAValidacionDerechosSerializer, PrestadoresSerializer, ContratosSerializer,
    BusquedaCUPSRequestSerializer, BusquedaMedicamentoRequestSerializer,
    ValidacionCUPSRequestSerializer, ValidacionBDUARequestSerializer
)

# Services
from .services import catalogs_service
from apps.core.services.mongodb_service import mongodb_service

logger = logging.getLogger(__name__)


class CatalogoCUPSOficialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para catálogo CUPS oficial
    
    Endpoints:
    - GET /api/catalogs/cups/ - Lista paginada
    - GET /api/catalogs/cups/{id}/ - Detalle por ID
    - POST /api/catalogs/cups/buscar/ - Búsqueda avanzada
    - POST /api/catalogs/cups/validar/ - Validación con contexto
    """
    queryset = CatalogoCUPSOficial.objects.filter(habilitado=True)
    serializer_class = CatalogoCUPSOficialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['habilitado', 'es_quirurgico', 'sexo', 'ambito', 'cobertura']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering_fields = ['codigo', 'nombre', 'fecha_actualizacion']
    ordering = ['codigo']
    
    @action(detail=False, methods=['post'])
    def buscar(self, request):
        """
        Búsqueda avanzada de códigos CUPS con filtros
        """
        serializer = BusquedaCUPSRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Usar servicio nativo
        resultados = catalogs_service.buscar_cups_avanzado(
            termino=data.get('termino', ''),
            filtros={
                'es_quirurgico': data.get('es_quirurgico'),
                'sexo': data.get('sexo'),
                'ambito': data.get('ambito')
            }
        )
        
        # Limitar resultados
        resultados = resultados[:data.get('limit', 100)]
        
        return Response({
            'count': len(resultados),
            'results': resultados
        })
    
    @action(detail=False, methods=['post'])
    def validar(self, request):
        """
        Validación de código CUPS con contexto clínico
        """
        serializer = ValidacionCUPSRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Validar con servicio
        validacion = catalogs_service.validar_codigo_cups(
            codigo=data['codigo'],
            contexto={
                'sexo_paciente': data.get('sexo_paciente'),
                'ambito': data.get('ambito')
            }
        )
        
        return Response(validacion)

    @action(detail=False, methods=['get'])
    def buscar_codigo(self, request):
        """
        Búsqueda específica por código CUPS
        """
        codigo = request.query_params.get('codigo', None)
        if not codigo:
            return Response(
                {'error': 'Parámetro codigo es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cups = CatalogoCUPSOficial.objects.get(codigo=codigo, habilitado=True)
            serializer = self.get_serializer(cups)
            return Response(serializer.data)
        except CatalogoCUPSOficial.DoesNotExist:
            return Response(
                {'error': f'Código CUPS {codigo} no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Estadísticas del catálogo CUPS
        """
        total = CatalogoCUPSOficial.objects.count()
        habilitados = CatalogoCUPSOficial.objects.filter(habilitado=True).count()
        quirurgicos = CatalogoCUPSOficial.objects.filter(es_quirurgico=True, habilitado=True).count()
        
        return Response({
            'total_procedimientos': total,
            'procedimientos_habilitados': habilitados,
            'procedimientos_quirurgicos': quirurgicos,
            'procedimientos_no_quirurgicos': habilitados - quirurgicos
        })
    
    @method_decorator(cache_page(60 * 15))  # Cache 15 minutos
    def list(self, request, *args, **kwargs):
        """Lista con cache para mejorar rendimiento"""
        return super().list(request, *args, **kwargs)


class CatalogoCUMOficialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta del cat�logo oficial CUM
    """
    queryset = CatalogoCUMOficial.objects.filter(habilitado=True)
    serializer_class = CatalogoCUMOficialSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['habilitado', 'es_muestra_medica', 'codigo_atc', 'via_administracion']
    search_fields = ['codigo', 'nombre', 'principio_activo', 'registro_sanitario']
    ordering_fields = ['codigo', 'nombre', 'fecha_actualizacion']
    ordering = ['codigo']

    @action(detail=False, methods=['get'])
    def buscar_codigo(self, request):
        """
        B�squeda espec�fica por c�digo CUM
        """
        codigo = request.query_params.get('codigo', None)
        if not codigo:
            return Response(
                {'error': 'Par�metro codigo es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cum = CatalogoCUMOficial.objects.get(codigo=codigo, habilitado=True)
            serializer = self.get_serializer(cum)
            return Response(serializer.data)
        except CatalogoCUMOficial.DoesNotExist:
            return Response(
                {'error': f'C�digo CUM {codigo} no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def buscar_principio_activo(self, request):
        """
        B�squeda por principio activo
        """
        principio = request.query_params.get('principio', None)
        if not principio:
            return Response(
                {'error': 'Par�metro principio es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        medicamentos = CatalogoCUMOficial.objects.filter(
            principio_activo__icontains=principio,
            habilitado=True
        )[:50]  # Limitar a 50 resultados
        
        serializer = self.get_serializer(medicamentos, many=True)
        return Response(serializer.data)


class CatalogoIUMOficialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta del cat�logo oficial IUM
    """
    queryset = CatalogoIUMOficial.objects.filter(habilitado=True)
    serializer_class = CatalogoIUMOficialSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['habilitado', 'ium_nivel_i', 'codigo_forma_farmaceutica', 'unidad_empaque']
    search_fields = ['codigo', 'nombre', 'principio_activo', 'forma_farmaceutica']
    ordering_fields = ['codigo', 'fecha_actualizacion']
    ordering = ['codigo']

    @action(detail=False, methods=['get'])
    def buscar_codigo(self, request):
        """
        B�squeda espec�fica por c�digo IUM
        """
        codigo = request.query_params.get('codigo', None)
        if not codigo:
            return Response(
                {'error': 'Par�metro codigo es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ium = CatalogoIUMOficial.objects.get(codigo=codigo, habilitado=True)
            serializer = self.get_serializer(ium)
            return Response(serializer.data)
        except CatalogoIUMOficial.DoesNotExist:
            return Response(
                {'error': f'C�digo IUM {codigo} no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class CatalogoDispositivosOficialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta del cat�logo oficial de Dispositivos M�dicos
    """
    queryset = CatalogoDispositivosOficial.objects.filter(habilitado=True)
    serializer_class = CatalogoDispositivosOficialSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['habilitado', 'version_mipres']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering_fields = ['codigo', 'nombre', 'fecha_actualizacion']
    ordering = ['codigo']

    @action(detail=False, methods=['get'])
    def buscar_codigo(self, request):
        """
        B�squeda espec�fica por c�digo de dispositivo
        """
        codigo = request.query_params.get('codigo', None)
        if not codigo:
            return Response(
                {'error': 'Par�metro codigo es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            dispositivo = CatalogoDispositivosOficial.objects.get(codigo=codigo, habilitado=True)
            serializer = self.get_serializer(dispositivo)
            return Response(serializer.data)
        except CatalogoDispositivosOficial.DoesNotExist:
            return Response(
                {'error': f'C�digo de dispositivo {codigo} no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class BDUAAfiliadosViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta de BDUA Afiliados
    Solo lectura por seguridad de datos personales
    """
    queryset = BDUAAfiliados.objects.all()
    serializer_class = BDUAAfiliadosSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'regimen', 'codigo_eps', 'afiliacion_estado_afiliacion',
        'usuario_tipo_documento', 'usuario_sexo', 'ubicacion_departamento',
        'ubicacion_municipio', 'caracteristicas_nivel_sisben'
    ]
    search_fields = ['usuario_numero_documento', 'usuario_primer_nombre', 'usuario_primer_apellido']
    ordering_fields = ['usuario_numero_documento', 'afiliacion_fecha_efectiva_bd']
    ordering = ['usuario_numero_documento']

    @action(detail=False, methods=['post'])
    def buscar_afiliado(self, request):
        """
        B�squeda espec�fica de afiliado por documento
        """
        serializer = BDUAAfiliadosSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        tipo_documento = serializer.validated_data['tipo_documento']
        numero_documento = serializer.validated_data['numero_documento']
        
        try:
            afiliado = BDUAAfiliados.objects.get(
                usuario_tipo_documento=tipo_documento,
                usuario_numero_documento=numero_documento
            )
            response_serializer = BDUAAfiliadosSerializer(afiliado)
            return Response(response_serializer.data)
        except BDUAAfiliados.DoesNotExist:
            return Response(
                {'error': f'Afiliado con documento {tipo_documento} {numero_documento} no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def validar_derechos(self, request):
        """
        Validaci�n de derechos de un afiliado en fecha espec�fica
        """
        serializer = BDUAAfiliadosSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        tipo_documento = serializer.validated_data['tipo_documento']
        numero_documento = serializer.validated_data['numero_documento']
        fecha_atencion = serializer.validated_data.get('fecha_atencion', datetime.now().date())
        
        try:
            afiliado = BDUAAfiliados.objects.get(
                usuario_tipo_documento=tipo_documento,
                usuario_numero_documento=numero_documento
            )
            
            # Usar el m�todo de validaci�n del modelo
            resultado = afiliado.validar_derechos_en_fecha(fecha_atencion)
            
            response_serializer = BDUAValidacionDerechosSerializer(resultado)
            return Response(response_serializer.data)
            
        except BDUAAfiliados.DoesNotExist:
            return Response({
                'valido': False,
                'causal_devolucion': 'DE1601',
                'mensaje': f'Usuario con documento {tipo_documento} {numero_documento} no encontrado en BDUA'
            })

    @action(detail=False, methods=['get'])
    def estadisticas_regimen(self, request):
        """
        Estad�sticas por r�gimen
        """
        from django.db.models import Count
        
        estadisticas = BDUAAfiliados.objects.values('regimen').annotate(
            total=Count('id')
        ).order_by('regimen')
        
        return Response({
            'estadisticas_por_regimen': list(estadisticas),
            'total_afiliados': BDUAAfiliados.objects.count()
        })


class PrestadoresViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gesti�n de Prestadores
    """
    queryset = Prestadores.objects.all()
    serializer_class = PrestadoresSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo_prestador', 'categoria', 'estado', 'contacto_departamento']
    search_fields = ['nit', 'razon_social', 'numero_documento']
    ordering_fields = ['nit', 'razon_social', 'fecha_habilitacion']
    ordering = ['razon_social']

    @action(detail=False, methods=['get'])
    def buscar_nit(self, request):
        """
        B�squeda espec�fica por NIT
        """
        nit = request.query_params.get('nit', None)
        if not nit:
            return Response(
                {'error': 'Par�metro nit es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            prestador = Prestadores.objects.get(nit=nit)
            serializer = self.get_serializer(prestador)
            return Response(serializer.data)
        except Prestadores.DoesNotExist:
            return Response(
                {'error': f'Prestador con NIT {nit} no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class ContratosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gesti�n de Contratos
    """
    queryset = Contratos.objects.all()
    serializer_class = ContratosSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['prestador_nit', 'tipo_contrato', 'estado', 'eps_codigo']
    search_fields = ['numero_contrato', 'prestador_nit']
    ordering_fields = ['numero_contrato', 'fecha_inicio', 'fecha_fin']
    ordering = ['-fecha_inicio']

    @action(detail=False, methods=['get'])
    def vigentes(self, request):
        """
        Contratos vigentes
        """
        from datetime import date
        contratos_vigentes = Contratos.objects.filter(
            estado='VIGENTE',
            fecha_inicio__lte=date.today(),
            fecha_fin__gte=date.today()
        )
        
        serializer = self.get_serializer(contratos_vigentes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def por_prestador(self, request):
        """
        Contratos por prestador espec�fico
        """
        nit = request.query_params.get('nit', None)
        if not nit:
            return Response(
                {'error': 'Par�metro nit es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contratos = Contratos.objects.filter(prestador_nit=nit)
        serializer = self.get_serializer(contratos, many=True)
        return Response(serializer.data)


class ValidationEngineViewSet(viewsets.ViewSet):
    """
    ViewSet para el motor de validación integral
    """
    
    @action(detail=False, methods=['post'])
    def validar_cuenta_completa(self, request):
        """
        Validación completa de una cuenta médica
        Incluye: BDUA, CUPS, CUM/IUM, Dispositivos y tarifas contractuales
        """
        datos_cuenta = request.data
        
        # Validaciones básicas de entrada
        if not datos_cuenta:
            return Response(
                {'error': 'Datos de cuenta requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            resultado = validation_engine.validar_cuenta_completa(datos_cuenta)
            return Response(resultado)
            
        except Exception as e:
            return Response(
                {'error': f'Error en validación: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def validar_codigo_individual(self, request):
        """
        Validación individual de un código (CUPS, CUM, IUM, Dispositivo)
        """
        codigo = request.data.get('codigo')
        tipo_codigo = request.data.get('tipo', 'CUPS')  # CUPS, CUM, IUM, DISPOSITIVO
        
        if not codigo:
            return Response(
                {'error': 'Código es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if tipo_codigo == 'CUPS':
                resultado = CatalogoCUPSOficial.objects.filter(
                    codigo=codigo, habilitado=True
                ).exists()
            elif tipo_codigo == 'CUM':
                resultado = CatalogoCUMOficial.objects.filter(
                    codigo=codigo, habilitado=True
                ).exists()
            elif tipo_codigo == 'IUM':
                resultado = CatalogoIUMOficial.objects.filter(
                    codigo=codigo, habilitado=True
                ).exists()
            elif tipo_codigo == 'DISPOSITIVO':
                resultado = CatalogoDispositivosOficial.objects.filter(
                    codigo=codigo, habilitado=True
                ).exists()
            else:
                return Response(
                    {'error': 'Tipo de código no válido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response({
                'codigo': codigo,
                'tipo': tipo_codigo,
                'valido': resultado,
                'mensaje': 'Código válido' if resultado else 'Código no encontrado'
            })
            
        except Exception as e:
            return Response(
                {'error': f'Error en validación: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def estadisticas_catalogo(self, request):
        """
        Estadísticas consolidadas de todos los catálogos
        """
        try:
            estadisticas = {
                'cups': {
                    'total': CatalogoCUPSOficial.objects.count(),
                    'habilitados': CatalogoCUPSOficial.objects.filter(habilitado=True).count(),
                    'quirurgicos': CatalogoCUPSOficial.objects.filter(es_quirurgico=True, habilitado=True).count()
                },
                'cum': {
                    'total': CatalogoCUMOficial.objects.count(),
                    'habilitados': CatalogoCUMOficial.objects.filter(habilitado=True).count(),
                    'muestras_medicas': CatalogoCUMOficial.objects.filter(es_muestra_medica=True, habilitado=True).count()
                },
                'ium': {
                    'total': CatalogoIUMOficial.objects.count(),
                    'habilitados': CatalogoIUMOficial.objects.filter(habilitado=True).count()
                },
                'dispositivos': {
                    'total': CatalogoDispositivosOficial.objects.count(),
                    'habilitados': CatalogoDispositivosOficial.objects.filter(habilitado=True).count()
                },
                'bdua': {
                    'total_afiliados': BDUAAfiliados.objects.count(),
                    'subsidiado': BDUAAfiliados.objects.filter(regimen='SUBSIDIADO').count(),
                    'contributivo': BDUAAfiliados.objects.filter(regimen='CONTRIBUTIVO').count(),
                    'activos': BDUAAfiliados.objects.filter(afiliacion_estado_afiliacion='AC').count()
                }
            }
            
            return Response(estadisticas)
            
        except Exception as e:
            return Response(
                {'error': f'Error obteniendo estadísticas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )