# -*- coding: utf-8 -*-
# apps/catalogs/views_tarifarios.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q, Count, Avg
from django.http import HttpResponse
import csv
import json

from .models import TarifarioISS2001, TarifarioSOAT2025
from .serializers_tarifarios import (
    TarifarioISS2001Serializer, TarifarioSOAT2025Serializer,
    TarifarioISS2001ListSerializer, TarifarioSOAT2025ListSerializer
)
from .renderers import MongoJSONRenderer

class TarifarioISS2001ViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para tarifarios oficiales ISS 2001
    Solo lectura - datos oficiales inmutables
    """
    queryset = TarifarioISS2001.objects.all()
    serializer_class = TarifarioISS2001Serializer
    permission_classes = [AllowAny]  # Datos públicos oficiales
    renderer_classes = [MongoJSONRenderer]  # Handle ObjectId serialization
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TarifarioISS2001ListSerializer
        return TarifarioISS2001Serializer
    
    def get_queryset(self):
        queryset = TarifarioISS2001.objects.all()
        
        # Filtros por parámetros URL
        search = self.request.query_params.get('search', None)
        tipo_servicio = self.request.query_params.get('tipo_servicio', None)
        con_contratos_activos = self.request.query_params.get('con_contratos_activos', None)
        uso_frecuente = self.request.query_params.get('uso_frecuente', None)
        
        # Búsqueda por código o descripción
        if search:
            queryset = queryset.filter(
                Q(codigo__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        
        # Filtro por tipo de servicio
        if tipo_servicio:
            queryset = queryset.filter(tipo=tipo_servicio)
        
        # Filtro por contratos activos
        if con_contratos_activos == 'true':
            queryset = queryset.filter(contratos_activos__gt=0)
        
        # Filtro por uso frecuente
        if uso_frecuente == 'true':
            queryset = queryset.filter(uso_frecuente=True)
        
        # Ordenamiento por defecto
        return queryset.order_by('codigo')
    
    def list(self, request, *args, **kwargs):
        """Listado con estadísticas agregadas"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Paginación
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            
            # Estadísticas para el queryset filtrado
            stats = self._calcular_estadisticas(queryset)
            
            result = self.get_paginated_response(serializer.data)
            result.data['stats'] = stats
            return result
        
        serializer = self.get_serializer(queryset, many=True)
        stats = self._calcular_estadisticas(queryset)
        
        return Response({
            'results': serializer.data,
            'count': queryset.count(),
            'stats': stats
        })
    
    def _calcular_estadisticas(self, queryset):
        """Calcular estadísticas del queryset"""
        total = queryset.count()
        
        # Estadísticas por tipo
        stats_por_tipo = queryset.values('tipo').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return {
            'total': total,
            'quirurgicos': queryset.filter(tipo='quirurgico').count(),
            'diagnosticos': queryset.filter(tipo='diagnostico').count(), 
            'consultas': queryset.filter(tipo='consulta').count(),
            'internacion': queryset.filter(tipo='internacion').count(),
            'con_contratos': queryset.filter(contratos_activos__gt=0).count(),
            'uso_frecuente': queryset.filter(uso_frecuente=True).count(),
            'distribucion_por_tipo': list(stats_por_tipo)
        }
    
    @action(detail=False, methods=['get'])
    def buscar_similares(self, request):
        """Buscar tarifa similar en SOAT por descripción ISS"""
        codigo_iss = request.query_params.get('codigo_iss', None)
        descripcion = request.query_params.get('descripcion', None)
        
        if not codigo_iss and not descripcion:
            return Response({'error': 'Debe proporcionar código ISS o descripción'}, status=400)
        
        # Si se proporciona código ISS, buscar su descripción
        if codigo_iss and not descripcion:
            try:
                iss_item = TarifarioISS2001.objects.get(codigo=codigo_iss)
                descripcion = iss_item.descripcion
            except TarifarioISS2001.DoesNotExist:
                return Response({'error': 'Código ISS no encontrado'}, status=404)
        
        # Normalizar descripción para búsqueda
        import re
        import unicodedata
        
        # Remover acentos y normalizar texto
        def normalizar_texto(texto):
            texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('utf-8')
            return texto.lower()
        
        descripcion_normalizada = normalizar_texto(descripcion)
        
        # Palabras a ignorar (stop words médicas)
        stop_words = {'de', 'la', 'el', 'con', 'por', 'para', 'en', 'y', 'o', 'del', 'al', 'los', 'las', 'un', 'una'}
        
        # Extraer palabras clave relevantes
        palabras = re.findall(r'\b\w+\b', descripcion_normalizada)
        palabras_importantes = [p for p in palabras if len(p) > 3 and p not in stop_words]
        
        # Identificar términos médicos clave (ej: resección, extracción, consulta, etc)
        terminos_medicos_clave = []
        terminos_medicos = ['reseccion', 'extraccion', 'extirpacion', 'consulta', 'cirugia', 'procedimiento', 
                           'intervencion', 'operacion', 'tratamiento', 'examen', 'estudio', 'biopsia',
                           'endoscopia', 'ecografia', 'radiografia', 'tomografia', 'resonancia']
        
        for palabra in palabras_importantes:
            if any(termino in palabra for termino in terminos_medicos):
                terminos_medicos_clave.append(palabra)
        
        # Buscar en SOAT por similitud de descripción
        from django.db.models import Value, F, Case, When, IntegerField
        from django.db.models.functions import Lower
        
        # Empezar con todos los registros SOAT
        queryset = TarifarioSOAT2025.objects.all()
        
        # Crear query Q para buscar palabras clave
        q_filter = Q()
        
        # Priorizar términos médicos clave
        if terminos_medicos_clave:
            for termino in terminos_medicos_clave:
                q_filter |= Q(descripcion__icontains=termino)
        
        # Luego agregar otras palabras importantes
        for palabra in palabras_importantes[:8]:  # Limitar a 8 palabras más importantes
            if palabra not in terminos_medicos_clave:
                q_filter |= Q(descripcion__icontains=palabra)
        
        # Aplicar filtro
        if q_filter:
            resultados = queryset.filter(q_filter)
            
            # Calcular relevancia basada en coincidencias
            # Contar cuántas palabras clave coinciden
            relevancia_annotations = {}
            for i, palabra in enumerate(palabras_importantes[:5]):
                relevancia_annotations[f'match_{i}'] = Case(
                    When(descripcion__icontains=palabra, then=1),
                    default=0,
                    output_field=IntegerField()
                )
            
            if relevancia_annotations:
                resultados = resultados.annotate(**relevancia_annotations)
                # Ordenar por suma de coincidencias
                order_by_expr = sum(F(f'match_{i}') for i in range(len(palabras_importantes[:5])))
                resultados = resultados.annotate(relevancia=order_by_expr).order_by('-relevancia')
            
            resultados = resultados.distinct()[:10]
        else:
            resultados = queryset.none()
        
        # Serializar resultados
        from .serializers_tarifarios import TarifarioSOAT2025Serializer
        serializer = TarifarioSOAT2025Serializer(resultados, many=True)
        
        return Response({
            'descripcion_buscada': descripcion,
            'palabras_clave': palabras_importantes,
            'resultados': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Exportar tarifarios ISS 2001"""
        formato = request.query_params.get('formato', 'csv')
        queryset = self.filter_queryset(self.get_queryset())
        
        if formato == 'csv':
            return self._export_csv(queryset, 'tarifario_iss_2001')
        elif formato == 'json':
            return self._export_json(queryset, 'tarifario_iss_2001')
        else:
            return Response(
                {'error': 'Formato no soportado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _export_csv(self, queryset, filename):
        """Exportar a CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Código', 'Descripción', 'Tipo', 'UVR', 'Valor UVR 2001', 
            'Valor Calculado', 'Contratos Activos', 'Uso Frecuente'
        ])
        
        for obj in queryset:
            writer.writerow([
                obj.codigo, obj.descripcion, obj.tipo, obj.uvr,
                obj.valor_uvr_2001, obj.valor_calculado,
                obj.contratos_activos, obj.uso_frecuente
            ])
        
        return response
    
    def _export_json(self, queryset, filename):
        """Exportar a JSON"""
        serializer = TarifarioISS2001ListSerializer(queryset, many=True)
        
        response = HttpResponse(
            json.dumps(serializer.data, indent=2, ensure_ascii=False),
            content_type='application/json'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}.json"'
        
        return response

class TarifarioSOAT2025ViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para tarifarios oficiales SOAT 2025  
    Solo lectura - datos oficiales inmutables
    """
    queryset = TarifarioSOAT2025.objects.all()
    serializer_class = TarifarioSOAT2025Serializer
    permission_classes = [AllowAny]  # Datos públicos oficiales
    renderer_classes = [MongoJSONRenderer]  # Handle ObjectId serialization
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TarifarioSOAT2025ListSerializer
        return TarifarioSOAT2025Serializer
    
    def get_queryset(self):
        queryset = TarifarioSOAT2025.objects.all()
        
        # Filtros por parámetros URL
        search = self.request.query_params.get('search', None)
        tipo_servicio = self.request.query_params.get('tipo_servicio', None)
        con_contratos_activos = self.request.query_params.get('con_contratos_activos', None)
        uso_frecuente = self.request.query_params.get('uso_frecuente', None)
        grupo_quirurgico = self.request.query_params.get('grupo_quirurgico', None)
        
        # Búsqueda por código o descripción
        if search:
            queryset = queryset.filter(
                Q(codigo__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        
        # Filtro por tipo de servicio
        if tipo_servicio:
            queryset = queryset.filter(tipo=tipo_servicio)
        
        # Filtro por grupo quirúrgico
        if grupo_quirurgico:
            queryset = queryset.filter(grupo_quirurgico=grupo_quirurgico)
        
        # Filtro por contratos activos
        if con_contratos_activos == 'true':
            queryset = queryset.filter(contratos_activos__gt=0)
        
        # Filtro por uso frecuente
        if uso_frecuente == 'true':
            queryset = queryset.filter(uso_frecuente=True)
        
        # Ordenamiento por defecto
        return queryset.order_by('codigo')
    
    def list(self, request, *args, **kwargs):
        """Listado con estadísticas agregadas"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Paginación
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            
            # Estadísticas para el queryset filtrado
            stats = self._calcular_estadisticas(queryset)
            
            result = self.get_paginated_response(serializer.data)
            result.data['stats'] = stats
            return result
        
        serializer = self.get_serializer(queryset, many=True)
        stats = self._calcular_estadisticas(queryset)
        
        return Response({
            'results': serializer.data,
            'count': queryset.count(),
            'stats': stats
        })
    
    def _calcular_estadisticas(self, queryset):
        """Calcular estadísticas del queryset"""
        total = queryset.count()
        
        # Estadísticas por tipo
        stats_por_tipo = queryset.values('tipo').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return {
            'total': total,
            'quirurgicos': queryset.filter(tipo='procedimientos_quirurgicos').count(),
            'diagnosticos': queryset.filter(tipo='examenes_diagnosticos').count(),
            'laboratorio': queryset.filter(tipo='laboratorio_clinico').count(),
            'consultas': queryset.filter(tipo='consultas').count(),
            'estancias': queryset.filter(tipo='estancias').count(),
            'con_contratos': queryset.filter(contratos_activos__gt=0).count(),
            'uso_frecuente': queryset.filter(uso_frecuente=True).count(),
            'distribucion_por_tipo': list(stats_por_tipo)
        }
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Exportar tarifarios SOAT 2025"""
        formato = request.query_params.get('formato', 'csv')
        queryset = self.filter_queryset(self.get_queryset())
        
        if formato == 'csv':
            return self._export_csv(queryset, 'tarifario_soat_2025')
        elif formato == 'json':
            return self._export_json(queryset, 'tarifario_soat_2025')
        else:
            return Response(
                {'error': 'Formato no soportado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _export_csv(self, queryset, filename):
        """Exportar a CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Código', 'Descripción', 'Tipo', 'Grupo Q.', 'UVB', 'Valor 2025 UVB',
            'Valor Calculado', 'Sección', 'Contratos Activos', 'Uso Frecuente'
        ])
        
        for obj in queryset:
            writer.writerow([
                obj.codigo, obj.descripcion, obj.tipo, obj.grupo_quirurgico,
                obj.uvb, obj.valor_2025_uvb, obj.valor_calculado, 
                obj.seccion_manual, obj.contratos_activos, obj.uso_frecuente
            ])
        
        return response
    
    def _export_json(self, queryset, filename):
        """Exportar a JSON"""
        serializer = TarifarioSOAT2025ListSerializer(queryset, many=True)
        
        response = HttpResponse(
            json.dumps(serializer.data, indent=2, ensure_ascii=False),
            content_type='application/json'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}.json"'
        
        return response