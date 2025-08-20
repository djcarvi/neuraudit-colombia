# -*- coding: utf-8 -*-
"""
ViewSets para importación masiva de tarifarios según plantilla NeurAudit
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from datetime import datetime
import pandas as pd
import os
import time

from .models import (
    Prestador, TarifariosCUPS, TarifariosMedicamentos, TarifariosDispositivos
)
from .serializers import (
    ImportacionTarifarioSerializer, ResultadoImportacionSerializer,
    PreviewImportacionSerializer, ResultadoPreviewSerializer
)
from apps.catalogs.models import CatalogoCUPSOficial, CatalogoCUMOficial, CatalogoDispositivosOficial

User = get_user_model()


class ImportacionTarifariosViewSet(viewsets.ViewSet):
    """
    ViewSet para importación masiva de tarifarios desde Excel
    Siguiendo estándares NeurAudit Colombia
    """
    permission_classes = [AllowAny]  # Para desarrollo - cambiar a IsAuthenticated en producción
    parser_classes = [MultiPartParser]

    @action(detail=False, methods=['post'])
    def preview(self, request):
        """
        Vista previa del archivo Excel antes de importar
        """
        serializer = PreviewImportacionSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        archivo = serializer.validated_data['archivo']
        hoja = serializer.validated_data['hoja_excel']
        skip_rows = serializer.validated_data['filas_saltar']
        preview_rows = serializer.validated_data['filas_preview']

        try:
            # Guardar archivo temporalmente
            temp_file = f'/tmp/preview_{int(time.time())}_{archivo.name}'
            with open(temp_file, 'wb+') as destination:
                for chunk in archivo.chunks():
                    destination.write(chunk)

            # Leer Excel para preview
            df = pd.read_excel(temp_file, sheet_name=hoja, skiprows=skip_rows)
            
            # Detectar columnas automáticamente
            columnas_detectadas = self._detectar_todas_columnas(df.columns)
            
            # Crear muestra de datos
            muestra_datos = []
            for i, row in df.head(preview_rows).iterrows():
                fila = {}
                for col in df.columns:
                    fila[col] = str(row[col]) if not pd.isna(row[col]) else ''
                muestra_datos.append(fila)

            # Validar estructura
            estructura_valida = len(columnas_detectadas) >= 2  # Al menos código y descripción
            
            observaciones = []
            if not estructura_valida:
                observaciones.append("No se detectaron suficientes columnas requeridas")
            
            # Limpiar archivo temporal
            os.remove(temp_file)

            resultado = {
                'columnas_detectadas': columnas_detectadas,
                'muestra_datos': muestra_datos,
                'total_filas': len(df),
                'estructura_valida': estructura_valida,
                'observaciones': observaciones,
                'columnas_requeridas': ['codigo', 'descripcion'],
                'columnas_opcionales': ['valor_iss', 'valor_soat', 'valor_particular', 'principio_activo']
            }

            response_serializer = ResultadoPreviewSerializer(resultado)
            return Response(response_serializer.data)

        except Exception as e:
            return Response(
                {'error': f'Error procesando archivo: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def importar(self, request):
        """
        Importar tarifarios masivamente desde Excel
        """
        start_time = time.time()
        
        serializer = ImportacionTarifarioSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar prestador
        prestador_nit = serializer.validated_data['prestador_nit']
        try:
            prestador = Prestador.objects.get(nit=prestador_nit)
        except Prestador.DoesNotExist:
            return Response(
                {'error': f'Prestador con NIT {prestador_nit} no encontrado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        archivo = serializer.validated_data['archivo']
        tipo_tarifario = serializer.validated_data['tipo_tarifario']
        contrato_numero = serializer.validated_data.get('contrato_numero', f'IMPORT_{prestador_nit}')
        hoja = serializer.validated_data['hoja_excel']
        skip_rows = serializer.validated_data['filas_saltar']
        validar_catalogo = serializer.validated_data['validar_catalogo_oficial']
        sobrescribir = serializer.validated_data['sobrescribir_existentes']

        try:
            # Guardar archivo temporalmente
            temp_file = f'/tmp/import_{int(time.time())}_{archivo.name}'
            with open(temp_file, 'wb+') as destination:
                for chunk in archivo.chunks():
                    destination.write(chunk)

            # Leer Excel
            df = pd.read_excel(temp_file, sheet_name=hoja, skiprows=skip_rows)

            # Obtener usuario para la importación
            usuario = request.user if request.user.is_authenticated else None
            if not usuario:
                # Crear usuario de prueba para desarrollo
                try:
                    usuario = User.objects.get(email='admin@neuraudit.com')
                except User.DoesNotExist:
                    # Usar el primer usuario disponible
                    usuario = User.objects.first()
                    if not usuario:
                        return Response(
                            {'error': 'No hay usuarios disponibles en el sistema'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )

            # Procesar según tipo
            if tipo_tarifario == 'cups':
                resultado = self._procesar_cups(
                    df, prestador, contrato_numero, usuario, 
                    validar_catalogo, sobrescribir
                )
            elif tipo_tarifario == 'medicamentos':
                resultado = self._procesar_medicamentos(
                    df, prestador, contrato_numero, usuario,
                    validar_catalogo, sobrescribir
                )
            elif tipo_tarifario == 'dispositivos':
                resultado = self._procesar_dispositivos(
                    df, prestador, contrato_numero, usuario,
                    validar_catalogo, sobrescribir
                )

            # Limpiar archivo temporal
            os.remove(temp_file)

            # Calcular tiempo de procesamiento
            tiempo_total = time.time() - start_time
            resultado['tiempo_procesamiento'] = f"{tiempo_total:.2f} segundos"

            response_serializer = ResultadoImportacionSerializer(resultado)
            return Response(response_serializer.data)

        except Exception as e:
            return Response(
                {'error': f'Error procesando archivo: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _procesar_cups(self, df, prestador, contrato_numero, usuario, validar_catalogo, sobrescribir):
        """Procesar importación de tarifarios CUPS"""
        exitosos = 0
        errores = 0
        duplicados = 0
        sin_catalogo = 0
        detalles_errores = []
        advertencias = []

        # Detectar columnas
        columnas = self._detectar_columnas_cups(df.columns)
        
        if not columnas:
            return {
                'mensaje': 'Error en estructura del archivo',
                'total_procesados': 0,
                'registros_exitosos': 0,
                'registros_con_error': len(df),
                'registros_duplicados': 0,
                'registros_sin_catalogo': 0,
                'errores': ['No se pudieron detectar las columnas requeridas'],
                'advertencias': [],
                'estadisticas': {}
            }

        for index, row in df.iterrows():
            try:
                codigo_cups = str(row[columnas['codigo']]).strip().upper()
                descripcion = str(row[columnas['descripcion']]).strip()

                # Validar catálogo oficial si está habilitado
                if validar_catalogo:
                    try:
                        cups_oficial = CatalogoCUPSOficial.objects.get(codigo=codigo_cups, habilitado=True)
                    except CatalogoCUPSOficial.DoesNotExist:
                        sin_catalogo += 1
                        advertencias.append(f'Código CUPS {codigo_cups} no existe en catálogo oficial')
                        # Continuar con la importación pero marcar advertencia

                # Obtener valores monetarios
                valor_iss = self._limpiar_valor(row.get(columnas.get('valor_iss'), 0))
                valor_soat = self._limpiar_valor(row.get(columnas.get('valor_soat'), 0))
                valor_particular = self._limpiar_valor(row.get(columnas.get('valor_particular'), 0))

                # Determinar valor unitario (prioridad: particular > soat > iss)
                valor_unitario = valor_particular or valor_soat or valor_iss
                
                if valor_unitario <= 0:
                    errores += 1
                    detalles_errores.append(f'Fila {index + 1}: Sin valor unitario válido')
                    continue

                # Verificar si ya existe
                existente = TarifariosCUPS.objects.filter(
                    codigo_cups=codigo_cups,
                    contrato_numero=contrato_numero
                ).first()

                if existente and not sobrescribir:
                    duplicados += 1
                    continue

                # Crear/actualizar tarifa
                TarifariosCUPS.objects.update_or_create(
                    codigo_cups=codigo_cups,
                    contrato_numero=contrato_numero,
                    defaults={
                        'descripcion': descripcion,
                        'valor_unitario': valor_unitario,
                        'estado': 'ACTIVO',
                        'vigencia_desde': datetime.now().date(),
                        'vigencia_hasta': None,
                        'created_by': usuario
                    }
                )

                exitosos += 1

            except Exception as e:
                errores += 1
                detalles_errores.append(f'Fila {index + 1}: {str(e)}')

        return {
            'mensaje': f'Importación de tarifarios CUPS completada',
            'total_procesados': len(df),
            'registros_exitosos': exitosos,
            'registros_con_error': errores,
            'registros_duplicados': duplicados,
            'registros_sin_catalogo': sin_catalogo,
            'errores': detalles_errores[:10],
            'advertencias': advertencias[:10],
            'estadisticas': {
                'prestador': prestador.nombre,
                'contrato': contrato_numero,
                'tipo': 'CUPS'
            }
        }

    def _procesar_medicamentos(self, df, prestador, contrato_numero, usuario, validar_catalogo, sobrescribir):
        """Procesar importación de tarifarios de medicamentos"""
        # Similar a CUPS pero para medicamentos
        return {
            'mensaje': 'Funcionalidad en desarrollo',
            'total_procesados': 0,
            'registros_exitosos': 0,
            'registros_con_error': 0,
            'registros_duplicados': 0,
            'registros_sin_catalogo': 0,
            'errores': [],
            'advertencias': [],
            'estadisticas': {}
        }

    def _procesar_dispositivos(self, df, prestador, contrato_numero, usuario, validar_catalogo, sobrescribir):
        """Procesar importación de tarifarios de dispositivos"""
        # Similar a CUPS pero para dispositivos
        return {
            'mensaje': 'Funcionalidad en desarrollo',
            'total_procesados': 0,
            'registros_exitosos': 0,
            'registros_con_error': 0,
            'registros_duplicados': 0,
            'registros_sin_catalogo': 0,
            'errores': [],
            'advertencias': [],
            'estadisticas': {}
        }

    def _detectar_todas_columnas(self, columnas):
        """Detectar automáticamente todas las columnas posibles"""
        columnas_lower = [col.lower() for col in columnas]
        mapeo = {}

        # Patrones de detección
        patrones = {
            'codigo': ['codigo', 'cod', 'cups', 'cum', 'ium'],
            'descripcion': ['descripcion', 'desc', 'nombre', 'procedimiento'],
            'valor_iss': ['iss', 'valor_iss'],
            'valor_soat': ['soat', 'valor_soat'],
            'valor_particular': ['particular', 'privado', 'valor_particular'],
            'principio_activo': ['principio', 'activo', 'generico']
        }

        for campo, palabras_clave in patrones.items():
            for i, col in enumerate(columnas_lower):
                if any(palabra in col for palabra in palabras_clave):
                    mapeo[campo] = columnas[i]
                    break

        return mapeo

    def _detectar_columnas_cups(self, columnas):
        """Detectar columnas específicas para CUPS"""
        mapeo = self._detectar_todas_columnas(columnas)
        return mapeo if 'codigo' in mapeo and 'descripcion' in mapeo else None

    def _limpiar_valor(self, valor):
        """Limpiar y convertir valores monetarios"""
        if pd.isna(valor) or valor == '':
            return 0
        
        valor_str = str(valor).replace(',', '').replace('$', '').replace(' ', '')
        
        try:
            return float(valor_str)
        except:
            return 0