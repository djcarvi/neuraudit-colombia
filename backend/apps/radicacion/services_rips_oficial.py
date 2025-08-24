# -*- coding: utf-8 -*-
# apps/radicacion/services_rips_oficial.py

"""
Servicios RIPS con Django MongoDB Backend Oficial - NeurAudit Colombia
Manejo de transacciones RIPS con subdocumentos embebidos
Siguiendo estructura oficial MinSalud
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from decimal import Decimal
from django.db.models import Q, Count, Sum
from django.core.exceptions import ValidationError, ObjectDoesNotExist
import logging
import json

from .models_rips_oficial import (
    RIPSTransaccionOficial as RIPSTransaccion, RIPSUsuario, RIPSUsuarioDatos, RIPSValidacionBDUA,
    RIPSEstadisticasUsuario, RIPSConsulta, RIPSProcedimiento, RIPSMedicamento, 
    RIPSUrgencia, RIPSHospitalizacion, RIPSRecienNacido, RIPSOtrosServicios,
    RIPSServiciosUsuario, RIPSEstadisticasTransaccion, RIPSPreAuditoria, RIPSTrazabilidad
)
from apps.catalogs.services_django_mongodb import CatalogoCUPSService, CatalogoCUMService, BDUAService

logger = logging.getLogger(__name__)


class RIPSTransaccionService:
    """
    Servicio principal para manejo de transacciones RIPS
    Usando Django MongoDB Backend con subdocumentos embebidos
    """
    
    @staticmethod
    def crear_transaccion_rips(datos_rips: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea una nueva transacción RIPS completa con subdocumentos embebidos
        """
        try:
            # Crear transacción principal
            transaccion = RIPSTransaccion.objects.create(
                numFactura=datos_rips['numFactura'],
                prestadorNit=datos_rips['prestadorNit'],
                prestadorRazonSocial=datos_rips.get('prestadorRazonSocial', ''),
                estadoProcesamiento='RADICADO',
                archivoRIPSOriginal=datos_rips.get('archivoRIPSOriginal'),
                hashArchivoRIPS=datos_rips.get('hashArchivoRIPS'),
                tamanoArchivo=datos_rips.get('tamanoArchivo')
            )
            
            # Procesar usuarios y servicios
            usuarios_procesados = []
            if 'usuarios' in datos_rips:
                for usuario_data in datos_rips['usuarios']:
                    usuario_procesado = RIPSTransaccionService._procesar_usuario_rips(usuario_data)
                    usuarios_procesados.append(usuario_procesado)
            
            # Asignar usuarios embebidos a la transacción
            transaccion.usuarios = usuarios_procesados
            
            # Calcular estadísticas automáticamente
            transaccion.calcular_estadisticas()
            
            # Agregar trazabilidad inicial
            transaccion.agregar_trazabilidad(
                evento='TRANSACCION_RADICADA',
                usuario='sistema.radicacion',
                descripcion=f'Transacción RIPS radicada: {len(usuarios_procesados)} usuarios, {transaccion.estadisticasTransaccion.totalServicios if transaccion.estadisticasTransaccion else 0} servicios'
            )
            
            transaccion.save()
            
            return {
                'exito': True,
                'transaccion_id': str(transaccion.id),
                'num_factura': transaccion.numFactura,
                'estadisticas': {
                    'total_usuarios': len(usuarios_procesados),
                    'total_servicios': transaccion.estadisticasTransaccion.totalServicios if transaccion.estadisticasTransaccion else 0,
                    'valor_total': float(transaccion.estadisticasTransaccion.valorTotalFacturado) if transaccion.estadisticasTransaccion else 0
                }
            }
            
        except Exception as e:
            logger.error(f'Error creando transacción RIPS: {str(e)}')
            return {'exito': False, 'error': str(e)}
    
    @staticmethod
    def _procesar_usuario_rips(usuario_data: Dict[str, Any]) -> RIPSUsuario:
        """
        Procesa un usuario RIPS con todos sus servicios embebidos
        """
        # Crear datos personales embebidos
        datos_personales = None
        if 'datosPersonales' in usuario_data:
            datos_personales = RIPSUsuarioDatos(
                fechaNacimiento=datetime.strptime(usuario_data['datosPersonales']['fechaNacimiento'], '%Y-%m-%d').date(),
                sexo=usuario_data['datosPersonales']['sexo'],
                municipioResidencia=usuario_data['datosPersonales']['municipioResidencia'],
                zonaResidencia=usuario_data['datosPersonales'].get('zonaResidencia', 'U')
            )
        
        # Crear servicios embebidos
        servicios = None
        if 'servicios' in usuario_data:
            servicios = RIPSServiciosUsuario()
            
            # Procesar consultas
            if 'consultas' in usuario_data['servicios']:
                consultas = []
                for consulta_data in usuario_data['servicios']['consultas']:
                    consulta = RIPSConsulta(
                        codPrestador=consulta_data['codPrestador'],
                        fechaAtencion=datetime.strptime(consulta_data['fechaAtencion'], '%Y-%m-%d %H:%M:%S'),
                        numAutorizacion=consulta_data.get('numAutorizacion'),
                        codConsulta=consulta_data['codConsulta'],
                        modalidadGrupoServicioTecSal=consulta_data['modalidadGrupoServicioTecSal'],
                        grupoServicios=consulta_data['grupoServicios'],
                        codServicio=consulta_data['codServicio'],
                        finalidadTecnologiaSalud=consulta_data['finalidadTecnologiaSalud'],
                        causaMotivo=consulta_data['causaMotivo'],
                        diagnosticoPrincipal=consulta_data['diagnosticoPrincipal'],
                        diagnosticoRelacionado1=consulta_data.get('diagnosticoRelacionado1'),
                        diagnosticoRelacionado2=consulta_data.get('diagnosticoRelacionado2'),
                        diagnosticoRelacionado3=consulta_data.get('diagnosticoRelacionado3'),
                        tipoDiagnosticoPrincipal=consulta_data['tipoDiagnosticoPrincipal'],
                        tipoDocumentoIdentificacion=consulta_data['tipoDocumentoIdentificacion'],
                        numDocumentoIdentificacion=consulta_data['numDocumentoIdentificacion'],
                        vrServicio=Decimal(str(consulta_data['vrServicio'])),
                        conceptoRecaudo=consulta_data['conceptoRecaudo'],
                        valorPagoModerador=Decimal(str(consulta_data.get('valorPagoModerador', 0))),
                        numFEPS=consulta_data.get('numFEPS'),
                        estadoValidacion='PENDIENTE'
                    )
                    consultas.append(consulta)
                servicios.consultas = consultas
            
            # Procesar procedimientos
            if 'procedimientos' in usuario_data['servicios']:
                procedimientos = []
                for proc_data in usuario_data['servicios']['procedimientos']:
                    procedimiento = RIPSProcedimiento(
                        codPrestador=proc_data['codPrestador'],
                        fechaAtencion=datetime.strptime(proc_data['fechaAtencion'], '%Y-%m-%d %H:%M:%S'),
                        numAutorizacion=proc_data.get('numAutorizacion'),
                        codProcedimiento=proc_data['codProcedimiento'],
                        viaIngresoServicioSalud=proc_data['viaIngresoServicioSalud'],
                        modalidadGrupoServicioTecSal=proc_data['modalidadGrupoServicioTecSal'],
                        grupoServicios=proc_data['grupoServicios'],
                        codServicio=proc_data['codServicio'],
                        finalidadTecnologiaSalud=proc_data['finalidadTecnologiaSalud'],
                        tipoDocumentoIdentificacion=proc_data['tipoDocumentoIdentificacion'],
                        numDocumentoIdentificacion=proc_data['numDocumentoIdentificacion'],
                        diagnosticoPrincipal=proc_data['diagnosticoPrincipal'],
                        diagnosticoRelacionado=proc_data.get('diagnosticoRelacionado'),
                        complicacion=proc_data.get('complicacion'),
                        tipoDocumentoIdentificacion2=proc_data.get('tipoDocumentoIdentificacion2'),
                        numDocumentoIdentificacion2=proc_data.get('numDocumentoIdentificacion2'),
                        vrServicio=Decimal(str(proc_data['vrServicio'])),
                        conceptoRecaudo=proc_data['conceptoRecaudo'],
                        valorPagoModerador=Decimal(str(proc_data.get('valorPagoModerador', 0))),
                        numFEPS=proc_data.get('numFEPS'),
                        estadoValidacion='PENDIENTE'
                    )
                    procedimientos.append(procedimiento)
                servicios.procedimientos = procedimientos
            
            # Similar para medicamentos, urgencias, hospitalización, recién nacidos, otros servicios...
            # (implementación similar a consultas y procedimientos)
        
        # Crear usuario embebido
        usuario = RIPSUsuario(
            tipoDocumento=usuario_data['tipoDocumento'],
            numeroDocumento=usuario_data['numeroDocumento'],
            datosPersonales=datos_personales,
            servicios=servicios
        )
        
        return usuario
    
    @staticmethod
    def buscar_transaccion(num_factura: str) -> Optional[RIPSTransaccion]:
        """
        Busca una transacción RIPS por número de factura
        """
        try:
            return RIPSTransaccion.objects.get(numFactura=num_factura)
        except ObjectDoesNotExist:
            return None
    
    @staticmethod
    def buscar_transacciones_prestador(prestador_nit: str, fecha_inicio: datetime = None, 
                                     fecha_fin: datetime = None) -> List[RIPSTransaccion]:
        """
        Busca transacciones de un prestador usando filter() con Q objects
        """
        filtro = Q(prestadorNit=prestador_nit)
        
        if fecha_inicio:
            filtro &= Q(fechaRadicacion__gte=fecha_inicio)
        
        if fecha_fin:
            filtro &= Q(fechaRadicacion__lte=fecha_fin)
        
        return list(RIPSTransaccion.objects.filter(filtro).order_by('-fechaRadicacion'))
    
    @staticmethod
    def buscar_transacciones_por_usuario(tipo_documento: str, numero_documento: str) -> List[RIPSTransaccion]:
        """
        Busca transacciones que contengan un usuario específico (consulta en subdocumentos)
        """
        return list(
            RIPSTransaccion.objects.filter(
                usuarios__tipoDocumento=tipo_documento,
                usuarios__numeroDocumento=numero_documento
            ).order_by('-fechaRadicacion')
        )
    
    @staticmethod
    def actualizar_estado_transaccion(transaccion_id: str, nuevo_estado: str, 
                                    usuario: str, observaciones: str = None) -> Dict[str, Any]:
        """
        Actualiza el estado de una transacción usando update()
        """
        try:
            transaccion = RIPSTransaccion.objects.get(id=transaccion_id)
            estado_anterior = transaccion.estadoProcesamiento
            
            # Actualizar estado
            transaccion.estadoProcesamiento = nuevo_estado
            
            # Agregar trazabilidad
            transaccion.agregar_trazabilidad(
                evento='ESTADO_ACTUALIZADO',
                usuario=usuario,
                descripcion=f'Estado cambiado de {estado_anterior} a {nuevo_estado}',
                datos_adicionales={
                    'estado_anterior': estado_anterior,
                    'estado_nuevo': nuevo_estado,
                    'observaciones': observaciones
                }
            )
            
            transaccion.save()
            
            return {
                'exito': True,
                'transaccion_id': str(transaccion.id),
                'estado_anterior': estado_anterior,
                'estado_nuevo': nuevo_estado
            }
            
        except ObjectDoesNotExist:
            return {'exito': False, 'error': 'Transacción no encontrada'}
        except Exception as e:
            logger.error(f'Error actualizando estado transacción: {str(e)}')
            return {'exito': False, 'error': str(e)}
    
    @staticmethod
    def validar_transaccion_completa(transaccion_id: str) -> Dict[str, Any]:
        """
        Valida una transacción completa contra catálogos y BDUA
        """
        try:
            transaccion = RIPSTransaccion.objects.get(id=transaccion_id)
            resultados_validacion = {
                'transaccion_id': str(transaccion.id),
                'num_factura': transaccion.numFactura,
                'validaciones_usuario': [],
                'errores_generales': [],
                'estadisticas': {
                    'total_usuarios': 0,
                    'usuarios_validos': 0,
                    'usuarios_con_errores': 0,
                    'total_servicios': 0,
                    'servicios_validos': 0,
                    'servicios_con_errores': 0
                }
            }
            
            if not transaccion.usuarios:
                resultados_validacion['errores_generales'].append('Transacción sin usuarios')
                return resultados_validacion
            
            total_usuarios = len(transaccion.usuarios)
            resultados_validacion['estadisticas']['total_usuarios'] = total_usuarios
            
            for i, usuario in enumerate(transaccion.usuarios):
                resultado_usuario = RIPSTransaccionService._validar_usuario_completo(usuario)
                resultados_validacion['validaciones_usuario'].append(resultado_usuario)
                
                if resultado_usuario['valido']:
                    resultados_validacion['estadisticas']['usuarios_validos'] += 1
                else:
                    resultados_validacion['estadisticas']['usuarios_con_errores'] += 1
                
                # Contar servicios
                if usuario.servicios:
                    servicios_usuario = 0
                    if usuario.servicios.consultas:
                        servicios_usuario += len(usuario.servicios.consultas)
                    if usuario.servicios.procedimientos:
                        servicios_usuario += len(usuario.servicios.procedimientos)
                    # Agregar otros tipos de servicios...
                    
                    resultados_validacion['estadisticas']['total_servicios'] += servicios_usuario
                    
                    if resultado_usuario['valido']:
                        resultados_validacion['estadisticas']['servicios_validos'] += servicios_usuario
                    else:
                        resultados_validacion['estadisticas']['servicios_con_errores'] += servicios_usuario
            
            # Actualizar estado de transacción
            if resultados_validacion['estadisticas']['usuarios_con_errores'] == 0:
                transaccion.estadoProcesamiento = 'VALIDADO'
            else:
                transaccion.estadoProcesamiento = 'VALIDANDO'
            
            transaccion.save()
            
            return resultados_validacion
            
        except ObjectDoesNotExist:
            return {'exito': False, 'error': 'Transacción no encontrada'}
        except Exception as e:
            logger.error(f'Error validando transacción: {str(e)}')
            return {'exito': False, 'error': str(e)}
    
    @staticmethod
    def _validar_usuario_completo(usuario: RIPSUsuario) -> Dict[str, Any]:
        """
        Valida un usuario completo con sus servicios
        """
        resultado = {
            'tipo_documento': usuario.tipoDocumento,
            'numero_documento': usuario.numeroDocumento,
            'valido': True,
            'errores': [],
            'validacion_bdua': None,
            'validacion_servicios': []
        }
        
        # Validar derechos en BDUA
        if usuario.datosPersonales:
            fecha_atencion = datetime.now()  # En implementación real, usar fecha del servicio
            validacion_bdua = BDUAService.validar_derechos_afiliado(
                usuario.tipoDocumento,
                usuario.numeroDocumento,
                fecha_atencion
            )
            resultado['validacion_bdua'] = validacion_bdua
            
            if not validacion_bdua['valido']:
                resultado['valido'] = False
                resultado['errores'].append(validacion_bdua['mensaje'])
        
        # Validar servicios
        if usuario.servicios:
            # Validar consultas
            if usuario.servicios.consultas:
                for consulta in usuario.servicios.consultas:
                    validacion_cups = CatalogoCUPSService.validar_codigo_cups(consulta.codConsulta)
                    resultado['validacion_servicios'].append({
                        'tipo': 'consulta',
                        'codigo': consulta.codConsulta,
                        'valido': validacion_cups['valido'],
                        'mensaje': validacion_cups.get('mensaje', '')
                    })
                    
                    if not validacion_cups['valido']:
                        resultado['valido'] = False
                        resultado['errores'].append(f"Consulta {consulta.codConsulta}: {validacion_cups['mensaje']}")
            
            # Similar para procedimientos, medicamentos, etc.
        
        return resultado
    
    @staticmethod
    def obtener_estadisticas_prestador(prestador_nit: str, fecha_inicio: datetime = None, 
                                     fecha_fin: datetime = None) -> Dict[str, Any]:
        """
        Obtiene estadísticas de un prestador usando aggregate()
        """
        from django.db.models import Count, Sum, Avg, Case, When, DecimalField
        
        filtro = Q(prestadorNit=prestador_nit)
        
        if fecha_inicio:
            filtro &= Q(fechaRadicacion__gte=fecha_inicio)
        
        if fecha_fin:
            filtro &= Q(fechaRadicacion__lte=fecha_fin)
        
        stats = RIPSTransaccion.objects.filter(filtro).aggregate(
            total_transacciones=Count('id'),
            transacciones_validadas=Count(Case(When(estadoProcesamiento='VALIDADO', then=1))),
            transacciones_glosadas=Count(Case(When(estadoProcesamiento='GLOSADO', then=1))),
            transacciones_pagadas=Count(Case(When(estadoProcesamiento='PAGADO', then=1))),
        )
        
        return stats
    
    @staticmethod
    def cargar_rips_masivo_json(archivo_rips_json: str) -> Dict[str, Any]:
        """
        Carga masiva de un archivo RIPS JSON oficial MinSalud
        """
        try:
            with open(archivo_rips_json, 'r', encoding='utf-8') as f:
                datos_rips = json.load(f)
            
            # Procesar según estructura oficial MinSalud
            resultado = RIPSTransaccionService.crear_transaccion_rips(datos_rips)
            
            if resultado['exito']:
                logger.info(f"RIPS cargado exitosamente: {archivo_rips_json}")
                return resultado
            else:
                logger.error(f"Error cargando RIPS: {archivo_rips_json} - {resultado.get('error')}")
                return resultado
                
        except Exception as e:
            logger.error(f'Error en carga masiva RIPS: {str(e)}')
            return {'exito': False, 'error': str(e)}


class RIPSValidacionService:
    """
    Servicio especializado para validaciones RIPS
    """
    
    @staticmethod
    def validar_estructura_oficial_minsalud(datos_rips: Dict[str, Any]) -> Dict[str, Any]:
        """
        Valida que la estructura RIPS cumpla con el formato oficial MinSalud
        """
        errores = []
        
        # Validar campos obligatorios nivel transacción
        campos_obligatorios = ['numFactura', 'prestadorNit', 'usuarios']
        for campo in campos_obligatorios:
            if campo not in datos_rips:
                errores.append(f'Campo obligatorio faltante: {campo}')
        
        # Validar estructura de usuarios
        if 'usuarios' in datos_rips:
            if not isinstance(datos_rips['usuarios'], list):
                errores.append('El campo usuarios debe ser un array')
            else:
                for i, usuario in enumerate(datos_rips['usuarios']):
                    if 'tipoDocumento' not in usuario:
                        errores.append(f'Usuario {i}: falta tipoDocumento')
                    if 'numeroDocumento' not in usuario:
                        errores.append(f'Usuario {i}: falta numeroDocumento')
                    
                    # Validar servicios
                    if 'servicios' in usuario:
                        servicios = usuario['servicios']
                        tipos_validos = ['consultas', 'procedimientos', 'medicamentos', 
                                       'urgencias', 'hospitalizacion', 'recienNacidos', 'otrosServicios']
                        
                        for tipo in servicios:
                            if tipo not in tipos_validos:
                                errores.append(f'Usuario {i}: tipo de servicio inválido: {tipo}')
        
        return {
            'valida': len(errores) == 0,
            'errores': errores,
            'estructura_oficial': len(errores) == 0
        }