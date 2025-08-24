from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum, Count
from django.utils import timezone
from bson import ObjectId
import json
from decimal import Decimal

from .models_facturas import FacturaRadicada, ServicioFacturado
from .serializers_facturas import (
    FacturaRadicadaSerializer,
    ServicioFacturadoSerializer,
    ServicioRIPSSerializer,
    FacturaResumenSerializer
)
from apps.contratacion.renderers import MongoJSONRenderer
from apps.radicacion.models import RadicacionCuentaMedica, DocumentoSoporte
from apps.radicacion.models_rips_oficial import (
    RIPSTransaccionOficial as RIPSTransaccion, RIPSUsuarioOficial as RIPSUsuario, RIPSConsulta, 
    RIPSProcedimiento, RIPSMedicamento, RIPSOtrosServicios,
    RIPSUrgencia, RIPSHospitalizacion, RIPSRecienNacido
)


class FacturaRadicadaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar facturas en auditoría
    """
    queryset = FacturaRadicada.objects.all()
    serializer_class = FacturaRadicadaSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [MongoJSONRenderer]
    
    def get_serializer_class(self):
        """Usa serializer simplificado para listados"""
        if self.action == 'list':
            return FacturaRadicadaSerializer
        return FacturaRadicadaSerializer
    
    def get_queryset(self):
        """Filtrar facturas según parámetros"""
        queryset = super().get_queryset()
        
        # Filtro por radicación (CRÍTICO para el detalle de radicación)
        radicacion_id = self.request.query_params.get('radicacion_id')
        if radicacion_id:
            queryset = queryset.filter(radicacion_id=radicacion_id)
        
        # Filtro por estado
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado_auditoria=estado)
        
        # Filtro por prestador (búsqueda en JSON)
        prestador = self.request.query_params.get('prestador')
        if prestador:
            queryset = queryset.filter(
                Q(radicacion_info__prestador_nombre__icontains=prestador) |
                Q(radicacion_info__prestador_nit__icontains=prestador)
            )
        
        # Filtro por número de factura
        factura = self.request.query_params.get('factura')
        if factura:
            queryset = queryset.filter(numero_factura__icontains=factura)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['get'])
    def servicios(self, request, pk=None):
        """Obtiene los servicios de una factura"""
        factura = self.get_object()
        
        # Obtener parámetros de filtro
        tipo_servicio = request.query_params.get('tipo_servicio')
        tiene_glosa = request.query_params.get('tiene_glosa')
        
        # Consultar servicios
        servicios = ServicioFacturado.objects.filter(factura_id=str(factura.id))
        
        if tipo_servicio:
            servicios = servicios.filter(tipo_servicio=tipo_servicio)
        
        if tiene_glosa is not None:
            servicios = servicios.filter(tiene_glosa=tiene_glosa.lower() == 'true')
        
        # Agrupar por tipo de servicio
        servicios_agrupados = {}
        for servicio in servicios:
            tipo = servicio.tipo_servicio
            if tipo not in servicios_agrupados:
                servicios_agrupados[tipo] = []
            servicios_agrupados[tipo].append(ServicioRIPSSerializer(servicio).data)
        
        return Response({
            'factura_id': str(factura.id),
            'numero_factura': factura.numero_factura,
            'total_servicios': servicios.count(),
            'servicios_por_tipo': servicios_agrupados
        })
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtiene estadísticas generales de auditoría"""
        # Estadísticas por estado
        por_estado = FacturaRadicada.objects.values('estado_auditoria').annotate(
            cantidad=Count('id'),
            valor_total=Sum('valor_total')
        )
        
        # Total general
        totales = FacturaRadicada.objects.aggregate(
            total_facturas=Count('id'),
            valor_total=Sum('valor_total')
        )
        
        # Servicios totales
        servicios_totales = ServicioFacturado.objects.aggregate(
            total_servicios=Count('id'),
            con_glosa=Count('id', filter=Q(tiene_glosa=True))
        )
        
        return Response({
            'por_estado': list(por_estado),
            'totales': totales,
            'servicios': servicios_totales
        })
    
    @action(detail=False, methods=['get'])
    def radicaciones_pendientes(self, request):
        """Obtiene radicaciones que están listas para auditoría con información RIPS procesada"""
        # Buscar radicaciones en estado RADICADA que no tienen factura en auditoría
        radicaciones = RadicacionCuentaMedica.objects.filter(
            estado__in=['RADICADA', 'EN_AUDITORIA']
        )
        
        # Filtrar las que ya tienen factura creada
        facturas_existentes = FacturaRadicada.objects.values_list('radicacion_id', flat=True)
        radicaciones_pendientes = []
        
        for rad in radicaciones:
            if str(rad.id) not in facturas_existentes:
                servicios_info = {}
                
                # Buscar la transacción RIPS procesada
                rips_transaccion = RIPSTransaccion.objects.filter(
                    numFactura=rad.factura_numero,
                    prestadorNit=rad.pss_nit
                ).first()
                
                if rips_transaccion:
                    # Obtener conteo de servicios desde el modelo embebido NoSQL
                    servicios_info = {}
                    
                    if rips_transaccion.estadisticasTransaccion:
                        servicios_info = rips_transaccion.estadisticasTransaccion.distribucionServicios or {}
                        servicios_info['total_usuarios'] = rips_transaccion.estadisticasTransaccion.totalUsuarios
                    else:
                        # Calcular desde los usuarios embebidos
                        servicios_info = {
                            'consultas': 0,
                            'procedimientos': 0,
                            'medicamentos': 0,
                            'otros_servicios': 0,
                            'urgencias': 0,
                            'hospitalizacion': 0,
                            'recien_nacidos': 0,
                            'total_usuarios': len(rips_transaccion.usuarios) if rips_transaccion.usuarios else 0
                        }
                        
                        if rips_transaccion.usuarios:
                            for usuario in rips_transaccion.usuarios:
                                if usuario.servicios:
                                    if usuario.servicios.consultas:
                                        servicios_info['consultas'] += len(usuario.servicios.consultas)
                                    if usuario.servicios.procedimientos:
                                        servicios_info['procedimientos'] += len(usuario.servicios.procedimientos)
                                    if usuario.servicios.medicamentos:
                                        servicios_info['medicamentos'] += len(usuario.servicios.medicamentos)
                                    if usuario.servicios.urgencias:
                                        servicios_info['urgencias'] += len(usuario.servicios.urgencias)
                                    if usuario.servicios.hospitalizacion:
                                        servicios_info['hospitalizacion'] += len(usuario.servicios.hospitalizacion)
                                    if usuario.servicios.recienNacidos:
                                        servicios_info['recien_nacidos'] += len(usuario.servicios.recienNacidos)
                                    if usuario.servicios.otrosServicios:
                                        servicios_info['otros_servicios'] += len(usuario.servicios.otrosServicios)
                
                radicaciones_pendientes.append({
                    'id': str(rad.id),
                    'numero_radicado': rad.numero_radicado,
                    'factura_numero': rad.factura_numero,
                    'prestador_nombre': rad.pss_nombre,
                    'prestador_nit': rad.pss_nit,
                    'valor_total': float(rad.factura_valor_total) if rad.factura_valor_total else 0,
                    'fecha_radicacion': rad.fecha_radicacion.isoformat() if rad.fecha_radicacion else None,
                    'modalidad_pago': rad.modalidad_pago,
                    'tipo_servicio': rad.tipo_servicio,
                    'servicios': servicios_info,
                    'estado': rad.estado,
                    'tiene_rips_procesado': rips_transaccion is not None,
                    'numero_facturas': 1  # Por ahora, una radicación = una factura
                })
        
        return Response({
            'total': len(radicaciones_pendientes),
            'radicaciones': radicaciones_pendientes
        })
    
    @action(detail=False, methods=['post'])
    def crear_desde_radicacion(self, request):
        """Crea una factura para auditoría desde una radicación usando datos RIPS procesados - Enfoque NoSQL puro"""
        radicacion_id = request.data.get('radicacion_id')
        
        if not radicacion_id:
            return Response(
                {'error': 'radicacion_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            radicacion = RadicacionCuentaMedica.objects.get(id=radicacion_id)
        except RadicacionCuentaMedica.DoesNotExist:
            return Response(
                {'error': 'Radicación no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar si ya existe factura para esta radicación
        if FacturaRadicada.objects.filter(radicacion_id=str(radicacion.id)).exists():
            return Response(
                {'error': 'Ya existe una factura para esta radicación'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Buscar la transacción RIPS procesada (única consulta necesaria - NoSQL)
        rips_transaccion = RIPSTransaccion.objects.filter(
            numFactura=radicacion.factura_numero,
            prestadorNit=radicacion.pss_nit
        ).first()
        
        if not rips_transaccion:
            return Response(
                {'error': 'No se encontró la transacción RIPS procesada para esta factura'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear la factura para auditoría
        factura = FacturaRadicada.objects.create(
            radicacion_id=str(radicacion.id),
            numero_factura=radicacion.factura_numero,
            fecha_expedicion=radicacion.factura_fecha_expedicion,
            valor_total=radicacion.factura_valor_total,
            estado_auditoria='PENDIENTE',
            radicacion_info={
                'numero_radicado': radicacion.numero_radicado,
                'prestador_nombre': radicacion.pss_nombre,
                'prestador_nit': radicacion.pss_nit,
                'fecha_radicacion': radicacion.fecha_radicacion.isoformat() if radicacion.fecha_radicacion else None,
                'tipo_servicio': radicacion.tipo_servicio,
                'modalidad_pago': radicacion.modalidad_pago
            }
        )
        
        # Contadores para la factura
        total_consultas = 0
        total_procedimientos = 0
        total_medicamentos = 0
        total_otros_servicios = 0
        total_urgencias = 0
        total_hospitalizaciones = 0
        total_recien_nacidos = 0
        
        valor_consultas = Decimal('0')
        valor_procedimientos = Decimal('0')
        valor_medicamentos = Decimal('0')
        valor_otros_servicios = Decimal('0')
        
        # Procesar todos los usuarios y servicios desde el documento embebido (enfoque NoSQL puro)
        if rips_transaccion.usuarios:
            for usuario in rips_transaccion.usuarios:
                # Los servicios están embebidos en el usuario
                if usuario.servicios:
                    servicios = usuario.servicios
                    
                    # Procesar CONSULTAS embebidas
                    if servicios.consultas:
                        for consulta in servicios.consultas:
                            ServicioFacturado.objects.create(
                                factura_id=str(factura.id),
                                factura_info={
                                    'numero_factura': factura.numero_factura,
                                    'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                                    'valor_total': float(factura.valor_total),
                                    'radicacion_id': str(radicacion.id),
                                    'numero_radicacion': radicacion.numero_radicado,
                                    'prestador_info': {
                                        'nit': radicacion.pss_nit,
                                        'razon_social': radicacion.pss_nombre,
                                        'codigo_habilitacion': ''
                                    }
                                },
                                tipo_servicio='CONSULTA',
                                codigo=consulta.codConsulta,
                                descripcion=f'Consulta {consulta.codConsulta}',
                                cantidad=1,
                                valor_unitario=consulta.vrServicio,
                                valor_total=consulta.vrServicio,
                                detalle_json={
                                    'usuario_documento': consulta.numDocumentoIdentificacion,
                                    'fecha_atencion': consulta.fechaAtencion.isoformat() if consulta.fechaAtencion else None,
                                    'diagnostico_principal': consulta.diagnosticoPrincipal,
                                    'autorizacion': consulta.numAutorizacion,
                                    'profesional': consulta.numDocumentoIdentificacion,
                                    'modalidad_grupo': consulta.modalidadGrupoServicioTecSal,
                                    'finalidad': consulta.finalidadTecnologiaSalud,
                                    'causa_atencion': consulta.causaMotivo,
                                    'estado_validacion': consulta.estadoValidacion,
                                    'glosas': consulta.glosas if consulta.glosas else []
                                }
                            )
                            total_consultas += 1
                            valor_consultas += consulta.vrServicio or Decimal('0')
                    
                    # Procesar PROCEDIMIENTOS embebidos
                    if servicios.procedimientos:
                        for proc in servicios.procedimientos:
                            ServicioFacturado.objects.create(
                                factura_id=str(factura.id),
                                factura_info={
                                    'numero_factura': factura.numero_factura,
                                    'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                                    'valor_total': float(factura.valor_total),
                                    'radicacion_id': str(radicacion.id),
                                    'numero_radicacion': radicacion.numero_radicado,
                                    'prestador_info': {
                                        'nit': radicacion.pss_nit,
                                        'razon_social': radicacion.pss_nombre,
                                        'codigo_habilitacion': ''
                                    }
                                },
                                tipo_servicio='PROCEDIMIENTO',
                                codigo=proc.codProcedimiento,
                                descripcion=f'Procedimiento {proc.codProcedimiento}',
                                cantidad=1,
                                valor_unitario=proc.vrServicio,
                                valor_total=proc.vrServicio,
                                detalle_json={
                                    'usuario_documento': proc.numDocumentoIdentificacion,
                                    'fecha_procedimiento': proc.fechaAtencion.isoformat() if proc.fechaAtencion else None,
                                    'diagnostico_principal': proc.diagnosticoPrincipal,
                                    'autorizacion': proc.numAutorizacion,
                                    'via_ingreso': proc.viaIngresoServicioSalud,
                                    'modalidad_grupo': proc.modalidadGrupoServicioTecSal,
                                    'finalidad': proc.finalidadTecnologiaSalud,
                                    'estado_validacion': proc.estadoValidacion,
                                    'glosas': proc.glosas if proc.glosas else []
                                }
                            )
                            total_procedimientos += 1
                            valor_procedimientos += proc.vrServicio or Decimal('0')
                    
                    # Procesar MEDICAMENTOS embebidos
                    if servicios.medicamentos:
                        for med in servicios.medicamentos:
                            ServicioFacturado.objects.create(
                                factura_id=str(factura.id),
                                factura_info={
                                    'numero_factura': factura.numero_factura,
                                    'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                                    'valor_total': float(factura.valor_total),
                                    'radicacion_id': str(radicacion.id),
                                    'numero_radicacion': radicacion.numero_radicado,
                                    'prestador_info': {
                                        'nit': radicacion.pss_nit,
                                        'razon_social': radicacion.pss_nombre,
                                        'codigo_habilitacion': ''
                                    }
                                },
                                tipo_servicio='MEDICAMENTO',
                                codigo=med.codTecnologiaSalud,
                                descripcion=med.nomTecnologiaSalud or f'Medicamento {med.codTecnologiaSalud}',
                                cantidad=int(med.cantidadSuministrada),
                                valor_unitario=med.valorUnitarioTecnologia,
                                valor_total=med.vrServicio,
                                detalle_json={
                                    'usuario_documento': med.numDocumentoIdentificacion,
                                    'fecha_atencion': med.fechaAtencion.isoformat() if med.fechaAtencion else None,
                                    'tipo_unidad': med.tipoUnidadMedida,
                                    'autorizacion': med.numAutorizacion,
                                    'estado_validacion': med.estadoValidacion,
                                    'glosas': med.glosas if med.glosas else []
                                }
                            )
                            total_medicamentos += 1
                            valor_medicamentos += med.vrServicio or Decimal('0')
                    
                    # Procesar URGENCIAS embebidas
                    if servicios.urgencias:
                        for urgencia in servicios.urgencias:
                            ServicioFacturado.objects.create(
                                factura_id=str(factura.id),
                                factura_info={
                                    'numero_factura': factura.numero_factura,
                                    'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                                    'valor_total': float(factura.valor_total),
                                    'radicacion_id': str(radicacion.id),
                                    'numero_radicacion': radicacion.numero_radicado,
                                    'prestador_info': {
                                        'nit': radicacion.pss_nit,
                                        'razon_social': radicacion.pss_nombre,
                                        'codigo_habilitacion': ''
                                    }
                                },
                                tipo_servicio='URGENCIA',
                                codigo='URGENCIA',
                                descripcion='Atención de Urgencias',
                                cantidad=1,
                                valor_total=Decimal('0'),
                                fecha_inicio=urgencia.fechaIngreso,
                                fecha_fin=urgencia.fechaEgreso,
                                condicion_egreso=urgencia.condicionDestinoUsuarioEgreso,
                                detalle_json={
                                    'usuario_documento': urgencia.numDocumentoIdentificacion,
                                    'causa_atencion': urgencia.causaMotivoAtencion,
                                    'diagnostico_principal': urgencia.diagnosticoPrincipal,
                                    'diagnostico_egreso': urgencia.diagnosticoPrincipalEgreso,
                                    'destino_egreso': urgencia.condicionDestinoUsuarioEgreso,
                                    'estado_validacion': urgencia.estadoValidacion,
                                    'glosas': urgencia.glosas if urgencia.glosas else []
                                }
                            )
                            total_urgencias += 1
                    
                    # Procesar HOSPITALIZACIONES embebidas
                    if servicios.hospitalizacion:
                        for hosp in servicios.hospitalizacion:
                            ServicioFacturado.objects.create(
                                factura_id=str(factura.id),
                                factura_info={
                                    'numero_factura': factura.numero_factura,
                                    'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                                    'valor_total': float(factura.valor_total),
                                    'radicacion_id': str(radicacion.id),
                                    'numero_radicacion': radicacion.numero_radicado,
                                    'prestador_info': {
                                        'nit': radicacion.pss_nit,
                                        'razon_social': radicacion.pss_nombre,
                                        'codigo_habilitacion': ''
                                    }
                                },
                                tipo_servicio='HOSPITALIZACION',
                                codigo='HOSPITALIZACION',
                                descripcion='Hospitalización',
                                cantidad=1,
                                valor_total=Decimal('0'),
                                fecha_inicio=hosp.fechaIngreso,
                                fecha_fin=hosp.fechaEgreso,
                                condicion_egreso=hosp.condicionDestinoUsuarioEgreso,
                                detalle_json={
                                    'usuario_documento': hosp.numDocumentoIdentificacion,
                                    'via_ingreso': hosp.viaIngresoServicioSalud,
                                    'causa_atencion': hosp.causaMotivoAtencion,
                                    'diagnostico_principal': hosp.diagnosticoPrincipal,
                                    'diagnostico_egreso': hosp.diagnosticoPrincipalEgreso,
                                    'complicacion': hosp.complicacion,
                                    'estado_validacion': hosp.estadoValidacion,
                                    'glosas': hosp.glosas if hosp.glosas else []
                                }
                            )
                            total_hospitalizaciones += 1
                    
                    # Procesar RECIEN NACIDOS embebidos
                    if servicios.recienNacidos:
                        for rn in servicios.recienNacidos:
                            ServicioFacturado.objects.create(
                                factura_id=str(factura.id),
                                factura_info={
                                    'numero_factura': factura.numero_factura,
                                    'fecha_expedicion': factura.fecha_expedicion.isoformat(),
                                    'valor_total': float(factura.valor_total),
                                    'radicacion_id': str(radicacion.id),
                                    'numero_radicacion': radicacion.numero_radicado,
                                    'prestador_info': {
                                        'nit': radicacion.pss_nit,
                                        'razon_social': radicacion.pss_nombre,
                                        'codigo_habilitacion': ''
                                    }
                                },
                                tipo_servicio='RECIEN_NACIDO',
                                codigo='RECIEN_NACIDO',
                                descripcion='Atención Recién Nacido',
                                cantidad=1,
                                valor_total=Decimal('0'),
                                tipo_documento=rn.tipoDocumentoIdentificacion,
                                numero_documento=rn.numDocumentoIdentificacion,
                                fecha_nacimiento=rn.fechaNacimiento,
                                sexo_biologico=rn.codSexoBiologico,
                                detalle_json={
                                    'edad_gestacional': rn.edadGestacional,
                                    'peso': rn.peso,
                                    'diagnostico_principal': rn.diagnosticoPrincipal,
                                    'condicion_destino': rn.condicionDestinoUsuarioEgreso,
                                    'fecha_egreso': rn.fechaEgreso.isoformat() if rn.fechaEgreso else None,
                                    'estado_validacion': rn.estadoValidacion,
                                    'glosas': rn.glosas if rn.glosas else []
                                }
                            )
                            total_recien_nacidos += 1
        
        # Actualizar contadores y valores en la factura
        factura.total_consultas = total_consultas
        factura.total_procedimientos = total_procedimientos
        factura.total_medicamentos = total_medicamentos
        factura.total_otros_servicios = total_otros_servicios
        factura.total_urgencias = total_urgencias
        factura.total_hospitalizaciones = total_hospitalizaciones
        
        factura.valor_consultas = valor_consultas
        factura.valor_procedimientos = valor_procedimientos
        factura.valor_medicamentos = valor_medicamentos
        factura.valor_otros_servicios = valor_otros_servicios
        
        # Si hay estadísticas precalculadas, usarlas
        if rips_transaccion.estadisticasTransaccion:
            factura.servicios_json = {
                'total_usuarios': rips_transaccion.estadisticasTransaccion.totalUsuarios,
                'total_servicios': rips_transaccion.estadisticasTransaccion.totalServicios,
                'valor_total_calculado': str(rips_transaccion.estadisticasTransaccion.valorTotal),
                'distribucion': rips_transaccion.estadisticasTransaccion.distribucionServicios
            }
        
        factura.save()
        
        # Cambiar estado de la radicación
        radicacion.estado = 'EN_AUDITORIA'
        radicacion.save()
        
        # Cambiar estado de la transacción RIPS
        rips_transaccion.estadoProcesamiento = 'ASIGNADO_AUDITORIA'
        rips_transaccion.save()
        
        return Response({
            'factura': FacturaRadicadaSerializer(factura).data,
            'estadisticas': {
                'total_usuarios': len(rips_transaccion.usuarios) if rips_transaccion.usuarios else 0,
                'total_servicios': (
                    total_consultas + total_procedimientos + total_medicamentos + 
                    total_otros_servicios + total_urgencias + total_hospitalizaciones + 
                    total_recien_nacidos
                ),
                'servicios_por_tipo': {
                    'consultas': total_consultas,
                    'procedimientos': total_procedimientos,
                    'medicamentos': total_medicamentos,
                    'otros_servicios': total_otros_servicios,
                    'urgencias': total_urgencias,
                    'hospitalizaciones': total_hospitalizaciones,
                    'recien_nacidos': total_recien_nacidos
                }
            }
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambia el estado de auditoría de una factura"""
        factura = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        estados_validos = ['PENDIENTE', 'EN_REVISION', 'AUDITADA', 'CON_ERRORES', 'FINALIZADA']
        if nuevo_estado not in estados_validos:
            return Response(
                {'error': f'Estado inválido. Estados válidos: {", ".join(estados_validos)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        factura.estado_auditoria = nuevo_estado
        factura.save()
        
        return Response(FacturaRadicadaSerializer(factura).data)


class ServicioFacturadoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar servicios facturados
    """
    queryset = ServicioFacturado.objects.all()
    serializer_class = ServicioFacturadoSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [MongoJSONRenderer]
    
    def get_queryset(self):
        """Filtrar servicios según parámetros"""
        queryset = super().get_queryset()
        
        # Filtro por factura
        factura_id = self.request.query_params.get('factura_id')
        if factura_id:
            queryset = queryset.filter(factura_id=factura_id)
        
        # Filtro por tipo
        tipo_servicio = self.request.query_params.get('tipo_servicio')
        if tipo_servicio:
            queryset = queryset.filter(tipo_servicio=tipo_servicio)
        
        # Filtro por glosa
        tiene_glosa = self.request.query_params.get('tiene_glosa')
        if tiene_glosa is not None:
            queryset = queryset.filter(tiene_glosa=tiene_glosa.lower() == 'true')
        
        return queryset.order_by('tipo_servicio', 'codigo')
    
    @action(detail=True, methods=['post'])
    def aplicar_glosa(self, request, pk=None):
        """Aplica una glosa a un servicio"""
        servicio = self.get_object()
        
        codigo_glosa = request.data.get('codigo_glosa')
        descripcion = request.data.get('descripcion')
        valor_glosado = request.data.get('valor_glosado')
        observaciones = request.data.get('observaciones')
        
        if not all([codigo_glosa, descripcion, valor_glosado]):
            return Response(
                {'error': 'codigo_glosa, descripcion y valor_glosado son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear registro de glosa aplicada
        from apps.auditoria.models_glosas import GlosaAplicada
        
        # Parsear fecha_expedicion correctamente
        fecha_str = servicio.factura_info.get('fecha_expedicion', '')
        if fecha_str:
            # Si es un string ISO, parsearlo
            if isinstance(fecha_str, str) and 'T' in fecha_str:
                from datetime import datetime
                fecha_factura = datetime.fromisoformat(fecha_str.replace('Z', '+00:00')).date()
            else:
                fecha_factura = fecha_str if hasattr(fecha_str, 'date') else timezone.now().date()
        else:
            fecha_factura = timezone.now().date()
        
        # Calcular si excede el valor del servicio
        valor_glosado_total = sum(g.get('valor_glosado', 0) for g in servicio.glosas_aplicadas) if servicio.glosas_aplicadas else 0
        valor_glosado_total += float(valor_glosado)
        excede_valor = valor_glosado_total > float(servicio.valor_total or 0)
        
        glosa = GlosaAplicada.objects.create(
            radicacion_id=servicio.factura_info.get('radicacion_id', ''),
            numero_radicacion=servicio.factura_info.get('numero_radicacion', ''),
            factura_id=servicio.factura_id,
            numero_factura=servicio.factura_info.get('numero_factura', ''),
            fecha_factura=fecha_factura,
            servicio_id=str(servicio.id),
            servicio_info={
                'codigo': servicio.codigo,
                'descripcion': servicio.descripcion,
                'tipo_servicio': servicio.tipo_servicio,
                'valor_original': float(servicio.valor_total or 0)
            },
            prestador_info=servicio.factura_info.get('prestador_info', {}),
            tipo_glosa=codigo_glosa[:2],  # FA, TA, SO, etc.
            codigo_glosa=codigo_glosa,
            descripcion_glosa=descripcion,
            valor_servicio=servicio.valor_total or 0,
            valor_glosado=Decimal(str(valor_glosado)),
            observaciones=observaciones,
            auditor_info={
                'user_id': str(request.user.id),
                'username': request.user.username,
                'nombre_completo': getattr(request.user, 'nombre_completo', request.user.username),
                'rol': getattr(request.user, 'rol', 'AUDITOR')
            },
            tipo_servicio=servicio.tipo_servicio,
            excede_valor_servicio=excede_valor
        )
        
        # Actualizar el servicio con la glosa
        if not servicio.glosas_aplicadas:
            servicio.glosas_aplicadas = []
        
        servicio.glosas_aplicadas.append({
            'id': str(glosa.id),
            'codigo_glosa': codigo_glosa,
            'descripcion': descripcion,
            'valor_glosado': float(valor_glosado),
            'fecha_aplicacion': timezone.now().isoformat(),
            'auditor': request.user.username,
            'observaciones': observaciones
        })
        
        servicio.tiene_glosa = True
        servicio.save()
        
        # Usar el serializer RIPS para mantener consistencia con el frontend
        return Response({
            'mensaje': 'Glosa aplicada exitosamente',
            'glosa_id': str(glosa.id),
            'servicio': ServicioRIPSSerializer(servicio).data,
            'excede_valor': excede_valor,
            'valor_glosado_total': valor_glosado_total
        })
    
    @action(detail=True, methods=['get'])
    def glosas(self, request, pk=None):
        """Obtiene todas las glosas aplicadas a un servicio"""
        servicio = self.get_object()
        
        # Obtener glosas desde GlosaAplicada para más detalles
        from apps.auditoria.models_glosas import GlosaAplicada
        glosas = GlosaAplicada.objects.filter(servicio_id=str(servicio.id)).order_by('-fecha_aplicacion')
        
        glosas_data = []
        for glosa in glosas:
            glosas_data.append({
                'id': str(glosa.id),
                'codigo_glosa': glosa.codigo_glosa,
                'tipo_glosa': glosa.tipo_glosa,
                'descripcion_glosa': glosa.descripcion_glosa,
                'valor_glosado': float(glosa.valor_glosado),
                'porcentaje_glosa': float(glosa.porcentaje_glosa),
                'observaciones': glosa.observaciones,
                'fecha_aplicacion': glosa.fecha_aplicacion.isoformat(),
                'auditor_info': glosa.auditor_info,
                'estado': glosa.estado,
                'excede_valor_servicio': glosa.excede_valor_servicio
            })
        
        valor_total_glosado = sum(g['valor_glosado'] for g in glosas_data)
        
        return Response({
            'servicio_id': str(servicio.id),
            'codigo': servicio.codigo,
            'descripcion': servicio.descripcion,
            'valor_servicio': float(servicio.valor_total or 0),
            'glosas': glosas_data,
            'total_glosas': len(glosas_data),
            'valor_total_glosado': valor_total_glosado,
            'porcentaje_total_glosado': (valor_total_glosado / float(servicio.valor_total or 1)) * 100,
            'excede_valor_servicio': valor_total_glosado > float(servicio.valor_total or 0)
        })