# -*- coding: utf-8 -*-
# apps/radicacion/views_validation.py

"""
APIs Avanzadas de Validación RIPS - NeurAudit Colombia
Integra el motor de auditoría avanzado para validación automática
según Resolución 2284 de 2023
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import transaction
import json
import logging
from datetime import datetime
from typing import Dict, Any

# Models
from .models_rips_oficial import RIPSTransaccionOficial as RIPSTransaccion, RIPSUsuario
from apps.catalogs.validation_engine_advanced import ValidationEngineAdvanced

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validar_transaccion_rips(request):
    """
    API para validación completa de una transacción RIPS
    
    POST /api/radicacion/validar-transaccion/
    {
        "transaccion_id": "64f8a1234567890abcdef123"
    }
    """
    try:
        data = request.data
        transaccion_id = data.get('transaccion_id')
        
        if not transaccion_id:
            return Response(
                {'error': 'transaccion_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Inicializar motor de validación
        validation_engine = ValidationEngineAdvanced()
        
        # Ejecutar validación completa
        resultado_validacion = validation_engine.validar_transaccion_rips_completa(transaccion_id)
        
        if 'error' in resultado_validacion:
            return Response(
                resultado_validacion,
                status=status.HTTP_404_NOT_FOUND
            )

        # Registrar auditoría
        _registrar_auditoria_validacion(request.user, transaccion_id, resultado_validacion)

        return Response({
            'success': True,
            'resultado_validacion': resultado_validacion,
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error validando transacción RIPS: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validar_lote_transacciones(request):
    """
    API para validación en lote de múltiples transacciones RIPS
    
    POST /api/radicacion/validar-lote/
    {
        "transacciones_ids": ["64f8a1234567890abcdef123", "64f8a1234567890abcdef124"],
        "configuracion": {
            "incluir_recomendaciones": true,
            "nivel_detalle": "completo"
        }
    }
    """
    try:
        data = request.data
        transacciones_ids = data.get('transacciones_ids', [])
        configuracion = data.get('configuracion', {})
        
        if not transacciones_ids:
            return Response(
                {'error': 'transacciones_ids es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(transacciones_ids) > 50:  # Límite para evitar timeout
            return Response(
                {'error': 'Máximo 50 transacciones por lote'},
                status=status.HTTP_400_BAD_REQUEST
            )

        validation_engine = ValidationEngineAdvanced()
        resultados = []
        resumen_lote = {
            'total_transacciones': len(transacciones_ids),
            'transacciones_aprobadas': 0,
            'transacciones_glosadas': 0,
            'transacciones_devueltas': 0,
            'valor_total_lote': 0,
            'valor_total_glosas': 0,
            'valor_total_devoluciones': 0
        }

        for transaccion_id in transacciones_ids:
            resultado = validation_engine.validar_transaccion_rips_completa(transaccion_id)
            
            if 'error' not in resultado:
                resultados.append(resultado)
                
                # Acumular estadísticas del lote
                if resultado['estado_validacion'] == 'APROBADO':
                    resumen_lote['transacciones_aprobadas'] += 1
                elif resultado['estado_validacion'] == 'GLOSADO':
                    resumen_lote['transacciones_glosadas'] += 1
                elif resultado['estado_validacion'] == 'DEVUELTO':
                    resumen_lote['transacciones_devueltas'] += 1
                
                resumen_lote['valor_total_lote'] += float(resultado['resumen']['valor_total_facturado'])
                resumen_lote['valor_total_glosas'] += float(resultado['resumen']['valor_total_glosas'])
                resumen_lote['valor_total_devoluciones'] += float(resultado['resumen']['valor_total_devoluciones'])

        # Registrar auditoría del lote
        _registrar_auditoria_lote(request.user, transacciones_ids, resumen_lote)

        return Response({
            'success': True,
            'resumen_lote': resumen_lote,
            'resultados_detalle': resultados,
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error validando lote de transacciones: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_estadisticas_validacion(request):
    """
    API para obtener estadísticas de validación
    
    GET /api/radicacion/estadisticas-validacion/?prestador_nit=123456789&fecha_desde=2025-07-01&fecha_hasta=2025-07-31
    """
    try:
        # Parámetros de filtro
        prestador_nit = request.GET.get('prestador_nit')
        fecha_desde = request.GET.get('fecha_desde')
        fecha_hasta = request.GET.get('fecha_hasta')
        
        # Construir filtros
        filtros = {}
        if prestador_nit:
            filtros['num_documento_id_obligado'] = prestador_nit
        if fecha_desde:
            filtros['fecha_radicacion__gte'] = fecha_desde
        if fecha_hasta:
            filtros['fecha_radicacion__lte'] = fecha_hasta

        # Obtener transacciones
        transacciones = RIPSTransaccion.objects.filter(**filtros)
        
        estadisticas = {
            'periodo': {
                'fecha_desde': fecha_desde,
                'fecha_hasta': fecha_hasta
            },
            'totales': {
                'transacciones': transacciones.count(),
                'usuarios': RIPSUsuario.objects.filter(
                    transaccion_id__in=[str(t._id) for t in transacciones]
                ).count(),
                'valor_total_facturado': float(sum(t.valor_total_facturado for t in transacciones))
            },
            'por_estado': {
                'procesado': transacciones.filter(estado_procesamiento='PROCESADO').count(),
                'validando': transacciones.filter(estado_procesamiento='VALIDANDO').count(),
                'validado': transacciones.filter(estado_procesamiento='VALIDADO').count(),
                'error': transacciones.filter(estado_procesamiento='ERROR').count()
            },
            'top_prestadores': _obtener_top_prestadores(transacciones),
            'servicios_mas_frecuentes': _obtener_servicios_frecuentes(transacciones)
        }

        return Response({
            'success': True,
            'estadisticas': estadisticas,
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error obteniendo estadísticas: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validar_usuario_individual(request):
    """
    API para validación de un usuario específico dentro de una transacción
    
    POST /api/radicacion/validar-usuario/
    {
        "usuario_id": "64f8a1234567890abcdef125",
        "validaciones_especificas": ["bdua", "servicios", "tarifas"]
    }
    """
    try:
        data = request.data
        usuario_id = data.get('usuario_id')
        validaciones_especificas = data.get('validaciones_especificas', [])
        
        if not usuario_id:
            return Response(
                {'error': 'usuario_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener usuario
        try:
            usuario = RIPSUsuario.objects.get(_id=usuario_id)
            transaccion = RIPSTransaccion.objects.get(_id=usuario.transaccion_id)
        except (RIPSUsuario.DoesNotExist, RIPSTransaccion.DoesNotExist):
            return Response(
                {'error': 'Usuario o transacción no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

        validation_engine = ValidationEngineAdvanced()
        resultado_usuario = validation_engine._validar_usuario_completo(usuario, transaccion)

        # Filtrar validaciones si se especifica
        if validaciones_especificas:
            resultado_filtrado = {}
            for validacion in validaciones_especificas:
                if validacion in resultado_usuario:
                    resultado_filtrado[validacion] = resultado_usuario[validacion]
            resultado_usuario = resultado_filtrado

        return Response({
            'success': True,
            'usuario_validacion': resultado_usuario,
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error validando usuario individual: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generar_reporte_auditoria(request):
    """
    API para generar reporte de auditoría detallado
    
    POST /api/radicacion/reporte-auditoria/
    {
        "transaccion_id": "64f8a1234567890abcdef123",
        "tipo_reporte": "completo",
        "incluir_graficos": true,
        "formato": "json"
    }
    """
    try:
        data = request.data
        transaccion_id = data.get('transaccion_id')
        tipo_reporte = data.get('tipo_reporte', 'completo')
        incluir_graficos = data.get('incluir_graficos', False)
        formato = data.get('formato', 'json')
        
        if not transaccion_id:
            return Response(
                {'error': 'transaccion_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener validación completa
        validation_engine = ValidationEngineAdvanced()
        resultado_validacion = validation_engine.validar_transaccion_rips_completa(transaccion_id)
        
        if 'error' in resultado_validacion:
            return Response(resultado_validacion, status=status.HTTP_404_NOT_FOUND)

        # Generar reporte estructurado
        reporte = {
            'metadata': {
                'transaccion_id': transaccion_id,
                'fecha_generacion': datetime.now().isoformat(),
                'generado_por': request.user.username,
                'tipo_reporte': tipo_reporte
            },
            'resumen_ejecutivo': _generar_resumen_ejecutivo(resultado_validacion),
            'detalle_validaciones': resultado_validacion,
            'recomendaciones_accion': _generar_recomendaciones_accion(resultado_validacion),
            'metricas_auditoria': _calcular_metricas_auditoria(resultado_validacion)
        }

        if incluir_graficos:
            reporte['datos_graficos'] = _generar_datos_graficos(resultado_validacion)

        return Response({
            'success': True,
            'reporte_auditoria': reporte,
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error generando reporte de auditoría: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Funciones auxiliares

def _registrar_auditoria_validacion(user, transaccion_id: str, resultado: Dict):
    """
    Registra la validación realizada para auditoría
    """
    try:
        # En producción, crear registro en tabla de auditoría
        logger.info(f'Validación RIPS realizada por {user.username} en transacción {transaccion_id}: {resultado["estado_validacion"]}')
    except Exception as e:
        logger.error(f'Error registrando auditoría: {str(e)}')


def _registrar_auditoria_lote(user, transacciones_ids: list, resumen: Dict):
    """
    Registra la validación en lote para auditoría
    """
    try:
        logger.info(f'Validación lote realizada por {user.username}: {len(transacciones_ids)} transacciones')
    except Exception as e:
        logger.error(f'Error registrando auditoría lote: {str(e)}')


def _obtener_top_prestadores(transacciones) -> list:
    """
    Obtiene los prestadores con más transacciones
    """
    prestadores = {}
    for transaccion in transacciones:
        nit = transaccion.num_documento_id_obligado
        if nit not in prestadores:
            prestadores[nit] = {
                'nit': nit,
                'total_transacciones': 0,
                'valor_total': 0
            }
        prestadores[nit]['total_transacciones'] += 1
        prestadores[nit]['valor_total'] += float(transaccion.valor_total_facturado)
    
    return sorted(prestadores.values(), key=lambda x: x['total_transacciones'], reverse=True)[:10]


def _obtener_servicios_frecuentes(transacciones) -> list:
    """
    Obtiene los servicios más frecuentes
    """
    servicios_stats = {}
    for transaccion in transacciones:
        stats = transaccion.estadisticas_servicios
        for tipo_servicio, cantidad in stats.items():
            if tipo_servicio not in servicios_stats:
                servicios_stats[tipo_servicio] = 0
            servicios_stats[tipo_servicio] += cantidad
    
    return [{'tipo': k, 'cantidad': v} for k, v in sorted(servicios_stats.items(), key=lambda x: x[1], reverse=True)]


def _generar_resumen_ejecutivo(resultado_validacion: Dict) -> Dict:
    """
    Genera resumen ejecutivo de la validación
    """
    resumen = resultado_validacion['resumen']
    
    return {
        'estado_final': resultado_validacion['estado_validacion'],
        'valor_aprobado': float(resumen['valor_neto_aprobado']),
        'porcentaje_aprobado': (float(resumen['valor_neto_aprobado']) / max(float(resumen['valor_total_facturado']), 1)) * 100,
        'total_glosas': len([g for usuario in resultado_validacion['glosas_por_usuario'] for g in usuario['glosas_usuario']]),
        'total_devoluciones': len(resultado_validacion['devoluciones']),
        'principales_hallazgos': _extraer_principales_hallazgos(resultado_validacion)
    }


def _generar_recomendaciones_accion(resultado_validacion: Dict) -> List[Dict]:
    """
    Genera recomendaciones de acción específicas
    """
    recomendaciones = []
    
    # Recomendaciones basadas en devoluciones
    for devolucion in resultado_validacion['devoluciones']:
        if devolucion['codigo'] == 'DE56':
            recomendaciones.append({
                'tipo': 'PROCESO',
                'prioridad': 'ALTA',
                'accion': 'Implementar alertas tempranas de vencimiento de plazos de radicación',
                'responsable': 'Gestión Documental'
            })
        elif devolucion['codigo'] == 'DE50':
            recomendaciones.append({
                'tipo': 'SISTEMA',
                'prioridad': 'ALTA',
                'accion': 'Verificar controles de duplicados en el sistema de radicación',
                'responsable': 'TI'
            })
    
    # Recomendaciones basadas en patrones de glosas
    categorias_glosas = {}
    for usuario in resultado_validacion['glosas_por_usuario']:
        for glosa in usuario['glosas_usuario']:
            categoria = glosa.get('categoria', 'OTROS')
            categorias_glosas[categoria] = categorias_glosas.get(categoria, 0) + 1
    
    if categorias_glosas.get('FACTURACION', 0) > 5:
        recomendaciones.append({
            'tipo': 'CAPACITACION',
            'prioridad': 'MEDIA',
            'accion': 'Capacitar al prestador en codificación CUPS/CUM',
            'responsable': 'Auditoría Médica'
        })
    
    return recomendaciones


def _calcular_metricas_auditoria(resultado_validacion: Dict) -> Dict:
    """
    Calcula métricas específicas de auditoría
    """
    resumen = resultado_validacion['resumen']
    
    return {
        'tasa_aprobacion': (resumen['servicios_validos'] / max(resumen['total_servicios'], 1)) * 100,
        'tasa_glosas': (float(resumen['valor_total_glosas']) / max(float(resumen['valor_total_facturado']), 1)) * 100,
        'valor_promedio_servicio': float(resumen['valor_total_facturado']) / max(resumen['total_servicios'], 1),
        'eficiencia_auditoria': {
            'tiempo_procesamiento': 'N/A',  # Implementar medición de tiempo
            'servicios_por_minuto': 'N/A'
        }
    }


def _generar_datos_graficos(resultado_validacion: Dict) -> Dict:
    """
    Genera datos para gráficos del reporte
    """
    return {
        'distribucion_servicios': {
            'labels': ['Consultas', 'Procedimientos', 'Urgencias', 'Hospitalización', 'Medicamentos', 'Otros'],
            'values': []  # Extraer de estadísticas
        },
        'estados_validacion': {
            'aprobados': resultado_validacion['resumen']['servicios_validos'],
            'glosados': resultado_validacion['resumen']['total_servicios'] - resultado_validacion['resumen']['servicios_validos'],
            'devueltos': len(resultado_validacion['devoluciones'])
        },
        'valores_financieros': {
            'facturado': float(resultado_validacion['resumen']['valor_total_facturado']),
            'glosas': float(resultado_validacion['resumen']['valor_total_glosas']),
            'aprobado': float(resultado_validacion['resumen']['valor_neto_aprobado'])
        }
    }


def _extraer_principales_hallazgos(resultado_validacion: Dict) -> List[str]:
    """
    Extrae los principales hallazgos de la validación
    """
    hallazgos = []
    
    # Hallazgos de devoluciones
    for devolucion in resultado_validacion['devoluciones']:
        hallazgos.append(f"Devolución {devolucion['codigo']}: {devolucion['descripcion']}")
    
    # Hallazgos de glosas más frecuentes
    glosas_por_codigo = {}
    for usuario in resultado_validacion['glosas_por_usuario']:
        for glosa in usuario['glosas_usuario']:
            codigo = glosa['codigo']
            glosas_por_codigo[codigo] = glosas_por_codigo.get(codigo, 0) + 1
    
    for codigo, cantidad in sorted(glosas_por_codigo.items(), key=lambda x: x[1], reverse=True)[:3]:
        hallazgos.append(f"Glosa {codigo} repetida {cantidad} veces")
    
    return hallazgos[:5]  # Máximo 5 hallazgos principales