# -*- coding: utf-8 -*-
# apps/radicacion/views_preauditoria.py

"""
APIs para Pre-auditoría con Interfaz Humana - NeurAudit Colombia
Maneja el flujo: Radicación → Pre-devolución → Revisión humana → Pre-glosas → Auditoría humana
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from datetime import datetime
import logging

# Models
from .models_rips_oficial import RIPSTransaccionOficial as RIPSTransaccion
from .models_auditoria import (
    PreDevolucion, DevolucionOficial, PreGlosa, GlosaOficial,
    AsignacionAuditoria, TrazabilidadAuditoria
)
from .engine_preauditoria import EnginePreAuditoria

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def procesar_transaccion_preauditoria(request):
    """
    Inicia el proceso de pre-auditoría automática para una transacción radicada
    
    POST /api/radicacion/procesar-preauditoria/
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

        # Inicializar motor de pre-auditoría
        engine = EnginePreAuditoria()
        
        # Procesar transacción completa
        resultado = engine.procesar_transaccion_completa(transaccion_id, request.user.username)
        
        if 'error' in resultado:
            return Response(resultado, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'success': True,
            'resultado_preauditoria': resultado,
            'mensaje': f"Pre-auditoría completada. Fase actual: {resultado['fase_actual']}",
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error en pre-auditoría: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_pre_devoluciones_pendientes(request):
    """
    Obtiene pre-devoluciones pendientes de revisión humana
    
    GET /api/radicacion/pre-devoluciones-pendientes/?prestador_nit=123456789&prioridad=alta
    """
    try:
        prestador_nit = request.GET.get('prestador_nit')
        prioridad = request.GET.get('prioridad')
        
        engine = EnginePreAuditoria()
        pre_devoluciones = engine.obtener_pre_devoluciones_pendientes(prestador_nit)
        
        # Filtrar por prioridad si se especifica
        if prioridad:
            # Lógica de prioridad basada en valor y causal
            if prioridad.lower() == 'alta':
                pre_devoluciones = [pd for pd in pre_devoluciones 
                                  if pd['valor_afectado'] > 1000000 or pd['codigo_causal'] in ['DE16', 'DE56']]

        return Response({
            'success': True,
            'pre_devoluciones': pre_devoluciones,
            'total': len(pre_devoluciones),
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error obteniendo pre-devoluciones: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def revisar_pre_devolucion(request):
    """
    Interfaz humana para revisar y decidir sobre una pre-devolución
    
    POST /api/radicacion/revisar-pre-devolucion/
    {
        "pre_devolucion_id": "64f8a1234567890abcdef124",
        "decision": "APROBAR",
        "observaciones": "Evidencia clara de extemporaneidad",
        "valor_modificado": 850000.00,
        "descripcion_modificada": "Devolución parcial por extemporaneidad"
    }
    """
    try:
        data = request.data
        pre_devolucion_id = data.get('pre_devolucion_id')
        decision = data.get('decision')  # APROBAR, RECHAZAR, MODIFICAR
        observaciones = data.get('observaciones', '')
        valor_modificado = data.get('valor_modificado')
        descripcion_modificada = data.get('descripcion_modificada')
        
        if not pre_devolucion_id or not decision:
            return Response(
                {'error': 'pre_devolucion_id y decision son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if decision not in ['APROBAR', 'RECHAZAR', 'MODIFICAR']:
            return Response(
                {'error': 'decision debe ser APROBAR, RECHAZAR o MODIFICAR'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener pre-devolución
        try:
            pre_devolucion = PreDevolucion.objects.get(_id=pre_devolucion_id)
        except PreDevolucion.DoesNotExist:
            return Response(
                {'error': 'Pre-devolución no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

        if pre_devolucion.estado != 'PENDIENTE_REVISION':
            return Response(
                {'error': 'Pre-devolución ya fue revisada'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Actualizar pre-devolución
            pre_devolucion.revisado_por = request.user.username
            pre_devolucion.fecha_revision = datetime.now()
            pre_devolucion.observaciones_revisor = observaciones
            pre_devolucion.decision_revisor = decision
            
            if decision == 'APROBAR':
                pre_devolucion.estado = 'APROBADA'
                # Crear devolución oficial
                devolucion_oficial = DevolucionOficial.objects.create(
                    pre_devolucion_id=str(pre_devolucion._id),
                    transaccion_id=pre_devolucion.transaccion_id,
                    num_factura=pre_devolucion.num_factura,
                    prestador_nit=pre_devolucion.prestador_nit,
                    codigo_causal=pre_devolucion.codigo_causal,
                    descripcion_causal=pre_devolucion.descripcion_causal,
                    valor_devuelto=pre_devolucion.valor_afectado,
                    fundamentacion_oficial=f"{pre_devolucion.fundamentacion_tecnica}\n\nRevisión: {observaciones}",
                    aprobada_por=request.user.username
                )
                mensaje_resultado = "Devolución aprobada y generada oficialmente"
                
            elif decision == 'MODIFICAR':
                pre_devolucion.estado = 'MODIFICADA'
                pre_devolucion.valor_afectado_final = valor_modificado or pre_devolucion.valor_afectado
                pre_devolucion.descripcion_final = descripcion_modificada or pre_devolucion.descripcion_causal
                
                # Crear devolución oficial con valores modificados
                devolucion_oficial = DevolucionOficial.objects.create(
                    pre_devolucion_id=str(pre_devolucion._id),
                    transaccion_id=pre_devolucion.transaccion_id,
                    num_factura=pre_devolucion.num_factura,
                    prestador_nit=pre_devolucion.prestador_nit,
                    codigo_causal=pre_devolucion.codigo_causal,
                    descripcion_causal=descripcion_modificada or pre_devolucion.descripcion_causal,
                    valor_devuelto=valor_modificado or pre_devolucion.valor_afectado,
                    fundamentacion_oficial=f"{pre_devolucion.fundamentacion_tecnica}\n\nModificación: {observaciones}",
                    aprobada_por=request.user.username
                )
                mensaje_resultado = "Devolución modificada y generada oficialmente"
                
            else:  # RECHAZAR
                pre_devolucion.estado = 'RECHAZADA'
                mensaje_resultado = "Pre-devolución rechazada, se procederá con pre-glosas"
                
                # Iniciar proceso de pre-glosas para esta transacción
                engine = EnginePreAuditoria()
                transaccion = RIPSTransaccion.objects.get(_id=pre_devolucion.transaccion_id)
                pre_glosas = engine._generar_pre_glosas_automaticas(transaccion)
                
                if pre_glosas:
                    engine._asignar_pre_glosas_a_auditores(pre_glosas)
            
            pre_devolucion.save()
            
            # Registrar trazabilidad
            TrazabilidadAuditoria.objects.create(
                transaccion_id=pre_devolucion.transaccion_id,
                num_factura=pre_devolucion.num_factura,
                evento='PRE_DEVOLUCION_REVISADA',
                usuario=request.user.username,
                descripcion=f"Pre-devolución {decision}: {observaciones}",
                origen='HUMANO',
                datos_adicionales={
                    'pre_devolucion_id': pre_devolucion_id,
                    'decision': decision,
                    'valor_original': float(pre_devolucion.valor_afectado),
                    'valor_final': float(valor_modificado or pre_devolucion.valor_afectado)
                }
            )

        return Response({
            'success': True,
            'mensaje_resultado': mensaje_resultado,
            'decision_tomada': decision,
            'pre_devolucion_actualizada': {
                'id': str(pre_devolucion._id),
                'estado': pre_devolucion.estado,
                'revisado_por': pre_devolucion.revisado_por,
                'fecha_revision': pre_devolucion.fecha_revision
            },
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error revisando pre-devolución: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_pre_glosas_asignadas(request):
    """
    Obtiene pre-glosas asignadas al auditor actual
    
    GET /api/radicacion/mis-pre-glosas/?prioridad=alta&categoria=CL
    """
    try:
        prioridad = request.GET.get('prioridad')
        categoria = request.GET.get('categoria')
        
        engine = EnginePreAuditoria()
        pre_glosas = engine.obtener_pre_glosas_asignadas(request.user.username)
        
        # Filtros opcionales
        if prioridad:
            pre_glosas = [pg for pg in pre_glosas if pg['prioridad_revision'].lower() == prioridad.lower()]
        
        if categoria:
            pre_glosas = [pg for pg in pre_glosas if pg['categoria_glosa'] == categoria.upper()]

        return Response({
            'success': True,
            'pre_glosas_asignadas': pre_glosas,
            'total_asignadas': len(pre_glosas),
            'auditor': request.user.username,
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error obteniendo pre-glosas asignadas: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def auditar_pre_glosa(request):
    """
    Interfaz humana para auditar y decidir sobre una pre-glosa
    
    POST /api/radicacion/auditar-pre-glosa/
    {
        "pre_glosa_id": "64f8a1234567890abcdef125",
        "decision": "APROBAR",
        "observaciones": "Glosa procedente según análisis médico",
        "valor_final": 450000.00,
        "codigo_glosa_final": "CL0102"
    }
    """
    try:
        data = request.data
        pre_glosa_id = data.get('pre_glosa_id')
        decision = data.get('decision')  # APROBAR, RECHAZAR, MODIFICAR_VALOR, MODIFICAR_CAUSAL, ESCALAR_MEDICO
        observaciones = data.get('observaciones', '')
        valor_final = data.get('valor_final')
        codigo_glosa_final = data.get('codigo_glosa_final')
        
        if not pre_glosa_id or not decision:
            return Response(
                {'error': 'pre_glosa_id y decision son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        decisiones_validas = ['APROBAR', 'RECHAZAR', 'MODIFICAR_VALOR', 'MODIFICAR_CAUSAL', 'ESCALAR_MEDICO']
        if decision not in decisiones_validas:
            return Response(
                {'error': f'decision debe ser una de: {", ".join(decisiones_validas)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener pre-glosa
        try:
            pre_glosa = PreGlosa.objects.get(_id=pre_glosa_id)
        except PreGlosa.DoesNotExist:
            return Response(
                {'error': 'Pre-glosa no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

        if pre_glosa.estado not in ['PENDIENTE_AUDITORIA', 'ASIGNADA_AUDITORIA']:
            return Response(
                {'error': 'Pre-glosa ya fue auditada'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Actualizar pre-glosa
            pre_glosa.auditado_por = request.user.username
            pre_glosa.fecha_auditoria = datetime.now()
            pre_glosa.observaciones_auditor = observaciones
            pre_glosa.decision_auditor = decision
            
            if decision == 'APROBAR':
                pre_glosa.estado = 'APROBADA'
                # Crear glosa oficial
                glosa_oficial = GlosaOficial.objects.create(
                    pre_glosa_id=str(pre_glosa._id),
                    transaccion_id=pre_glosa.transaccion_id,
                    num_factura=pre_glosa.num_factura,
                    prestador_nit=pre_glosa.prestador_nit,
                    codigo_glosa=pre_glosa.codigo_glosa,
                    categoria_glosa=pre_glosa.categoria_glosa,
                    descripcion_glosa=pre_glosa.descripcion_hallazgo,
                    valor_glosado=pre_glosa.valor_glosado_sugerido,
                    fundamentacion_oficial=f"{pre_glosa.fundamentacion_clinica or pre_glosa.fundamentacion_administrativa}\n\nAuditoría: {observaciones}",
                    aprobada_por=request.user.username,
                    perfil_aprobador=pre_glosa.perfil_auditor or 'AUDITOR_ADMINISTRATIVO'
                )
                mensaje_resultado = "Glosa aprobada y generada oficialmente"
                
            elif decision in ['MODIFICAR_VALOR', 'MODIFICAR_CAUSAL']:
                pre_glosa.estado = 'MODIFICADA'
                pre_glosa.valor_glosado_final = valor_final or pre_glosa.valor_glosado_sugerido
                pre_glosa.codigo_glosa_final = codigo_glosa_final or pre_glosa.codigo_glosa
                
                # Crear glosa oficial con valores modificados
                glosa_oficial = GlosaOficial.objects.create(
                    pre_glosa_id=str(pre_glosa._id),
                    transaccion_id=pre_glosa.transaccion_id,
                    num_factura=pre_glosa.num_factura,
                    prestador_nit=pre_glosa.prestador_nit,
                    codigo_glosa=codigo_glosa_final or pre_glosa.codigo_glosa,
                    categoria_glosa=pre_glosa.categoria_glosa,
                    descripcion_glosa=pre_glosa.descripcion_hallazgo,
                    valor_glosado=valor_final or pre_glosa.valor_glosado_sugerido,
                    fundamentacion_oficial=f"{pre_glosa.fundamentacion_clinica or pre_glosa.fundamentacion_administrativa}\n\nModificación: {observaciones}",
                    aprobada_por=request.user.username,
                    perfil_aprobador=pre_glosa.perfil_auditor or 'AUDITOR_ADMINISTRATIVO'
                )
                mensaje_resultado = "Glosa modificada y generada oficialmente"
                
            elif decision == 'ESCALAR_MEDICO':
                pre_glosa.estado = 'REQUIERE_REVISION_MEDICA'
                # Reasignar a auditor médico
                auditor_medico = 'auditor.medico'  # En producción, obtener del pool de auditores médicos
                pre_glosa.auditado_por = auditor_medico
                pre_glosa.perfil_auditor = 'AUDITOR_MEDICO'
                mensaje_resultado = f"Pre-glosa escalada a auditor médico: {auditor_medico}"
                
            else:  # RECHAZAR
                pre_glosa.estado = 'RECHAZADA'
                mensaje_resultado = "Pre-glosa rechazada por el auditor"
            
            pre_glosa.save()
            
            # Registrar trazabilidad
            TrazabilidadAuditoria.objects.create(
                transaccion_id=pre_glosa.transaccion_id,
                num_factura=pre_glosa.num_factura,
                evento='PRE_GLOSA_AUDITADA',
                usuario=request.user.username,
                descripcion=f"Pre-glosa {decision}: {observaciones}",
                origen='HUMANO',
                datos_adicionales={
                    'pre_glosa_id': pre_glosa_id,
                    'decision': decision,
                    'valor_original': float(pre_glosa.valor_glosado_sugerido),
                    'valor_final': float(valor_final or pre_glosa.valor_glosado_sugerido),
                    'codigo_original': pre_glosa.codigo_glosa,
                    'codigo_final': codigo_glosa_final or pre_glosa.codigo_glosa
                }
            )

        return Response({
            'success': True,
            'mensaje_resultado': mensaje_resultado,
            'decision_tomada': decision,
            'pre_glosa_actualizada': {
                'id': str(pre_glosa._id),
                'estado': pre_glosa.estado,
                'auditado_por': pre_glosa.auditado_por,
                'fecha_auditoria': pre_glosa.fecha_auditoria
            },
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error auditando pre-glosa: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_preauditoria(request):
    """
    Dashboard para supervisores de pre-auditoría
    
    GET /api/radicacion/dashboard-preauditoria/
    """
    try:
        # Estadísticas de pre-devoluciones
        pre_devoluciones_pendientes = PreDevolucion.objects.filter(estado='PENDIENTE_REVISION').count()
        pre_devoluciones_aprobadas = PreDevolucion.objects.filter(estado='APROBADA').count()
        pre_devoluciones_rechazadas = PreDevolucion.objects.filter(estado='RECHAZADA').count()
        
        # Estadísticas de pre-glosas
        pre_glosas_pendientes = PreGlosa.objects.filter(estado__in=['PENDIENTE_AUDITORIA', 'ASIGNADA_AUDITORIA']).count()
        pre_glosas_aprobadas = PreGlosa.objects.filter(estado='APROBADA').count()
        pre_glosas_rechazadas = PreGlosa.objects.filter(estado='RECHAZADA').count()
        
        # Carga de trabajo por auditor
        asignaciones_activas = AsignacionAuditoria.objects.filter(estado__in=['ASIGNADA', 'EN_PROCESO'])
        carga_auditores = {}
        for asignacion in asignaciones_activas:
            auditor = asignacion.auditor_username
            if auditor not in carga_auditores:
                carga_auditores[auditor] = {
                    'auditor': auditor,
                    'perfil': asignacion.auditor_perfil,
                    'total_asignadas': 0,
                    'total_auditadas': 0,
                    'valor_pendiente': 0
                }
            carga_auditores[auditor]['total_asignadas'] += asignacion.total_pre_glosas
            carga_auditores[auditor]['total_auditadas'] += asignacion.pre_glosas_auditadas
            carga_auditores[auditor]['valor_pendiente'] += float(asignacion.valor_total_asignado)

        # Alertas por vencimientos
        from datetime import timedelta
        alertas = []
        
        # Pre-devoluciones próximas a vencer
        pre_dev_vencimiento = PreDevolucion.objects.filter(
            estado='PENDIENTE_REVISION',
            fecha_limite_revision__lte=datetime.now() + timedelta(days=1)
        ).count()
        
        if pre_dev_vencimiento > 0:
            alertas.append({
                'tipo': 'VENCIMIENTO_PRE_DEVOLUCION',
                'cantidad': pre_dev_vencimiento,
                'mensaje': f'{pre_dev_vencimiento} pre-devoluciones vencen en menos de 24 horas'
            })

        dashboard = {
            'fecha_consulta': datetime.now().isoformat(),
            'estadisticas_pre_devoluciones': {
                'pendientes': pre_devoluciones_pendientes,
                'aprobadas': pre_devoluciones_aprobadas,
                'rechazadas': pre_devoluciones_rechazadas,
                'total': pre_devoluciones_pendientes + pre_devoluciones_aprobadas + pre_devoluciones_rechazadas
            },
            'estadisticas_pre_glosas': {
                'pendientes': pre_glosas_pendientes,
                'aprobadas': pre_glosas_aprobadas,
                'rechazadas': pre_glosas_rechazadas,
                'total': pre_glosas_pendientes + pre_glosas_aprobadas + pre_glosas_rechazadas
            },
            'carga_trabajo_auditores': list(carga_auditores.values()),
            'alertas': alertas
        }

        return Response({
            'success': True,
            'dashboard': dashboard,
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error generando dashboard: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_trazabilidad_transaccion(request, transaccion_id):
    """
    Obtiene la trazabilidad completa de una transacción
    
    GET /api/radicacion/trazabilidad/{transaccion_id}/
    """
    try:
        trazabilidad = TrazabilidadAuditoria.objects.filter(
            transaccion_id=transaccion_id
        ).order_by('fecha_evento')
        
        eventos = [
            {
                'evento': t.evento,
                'usuario': t.usuario,
                'fecha_evento': t.fecha_evento,
                'descripcion': t.descripcion,
                'origen': t.origen,  # AUTOMATICO o HUMANO
                'datos_adicionales': t.datos_adicionales
            }
            for t in trazabilidad
        ]

        return Response({
            'success': True,
            'transaccion_id': transaccion_id,
            'trazabilidad_completa': eventos,
            'total_eventos': len(eventos),
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error obteniendo trazabilidad: {str(e)}')
        return Response(
            {'error': f'Error interno: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )