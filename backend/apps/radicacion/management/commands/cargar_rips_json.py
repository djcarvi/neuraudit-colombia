# -*- coding: utf-8 -*-
# apps/radicacion/management/commands/cargar_rips_json.py

"""
Comando para cargar archivos RIPS JSON masivos según estructura oficial MinSalud
Estructura: transaccion{} -> usuarios[()] -> servicios{} -> consultas[{}], medicamentos[{}], etc.

Uso: python manage.py cargar_rips_json --archivo /ruta/archivo.json
"""

import json
import logging
from decimal import Decimal
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from bson import ObjectId

from apps.radicacion.models_rips_oficial import (
    RIPSTransaccion,
    RIPSUsuario,
    RIPSConsulta,
    RIPSProcedimiento,
    RIPSUrgencia,
    RIPSHospitalizacion,
    RIPSOtrosServicios,
    RIPSRecienNacidos,
    RIPSMedicamento
)

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Carga archivos RIPS JSON masivos según estructura oficial MinSalud'

    def add_arguments(self, parser):
        parser.add_argument(
            '--archivo',
            type=str,
            required=True,
            help='Ruta completa al archivo RIPS JSON'
        )
        parser.add_argument(
            '--chunk-size',
            type=int,
            default=100,
            help='Tamaño del chunk para procesamiento (default: 100)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Solo analizar sin guardar en base de datos'
        )

    def handle(self, *args, **options):
        archivo_path = options['archivo']
        chunk_size = options['chunk_size']
        dry_run = options['dry_run']

        self.stdout.write(
            self.style.SUCCESS(f'🚀 Iniciando carga RIPS JSON: {archivo_path}')
        )

        try:
            # Verificar si archivo existe
            with open(archivo_path, 'r', encoding='utf-8') as f:
                pass
        except FileNotFoundError:
            raise CommandError(f'❌ Archivo no encontrado: {archivo_path}')
        except UnicodeDecodeError:
            raise CommandError(f'❌ Error de codificación UTF-8 en: {archivo_path}')

        # Analizar tamaño del archivo
        import os
        tamaño_mb = os.path.getsize(archivo_path) / (1024 * 1024)
        self.stdout.write(f'📊 Tamaño archivo: {tamaño_mb:.2f} MB')

        if dry_run:
            self.stdout.write(self.style.WARNING('🔍 MODO DRY-RUN: Solo análisis'))

        try:
            self._procesar_rips_json(archivo_path, chunk_size, dry_run)
        except Exception as e:
            logger.error(f'Error procesando RIPS JSON: {str(e)}')
            raise CommandError(f'❌ Error: {str(e)}')

        self.stdout.write(
            self.style.SUCCESS('✅ Carga RIPS completada exitosamente')
        )

    def _procesar_rips_json(self, archivo_path, chunk_size, dry_run):
        """
        Procesa archivo RIPS JSON según estructura oficial MinSalud
        """
        # Cargar JSON completo
        with open(archivo_path, 'r', encoding='utf-8') as f:
            rips_data = json.load(f)

        # Validar estructura oficial
        if 'usuarios' not in rips_data:
            raise CommandError('❌ Estructura RIPS inválida: falta array "usuarios"')

        # Extraer datos de la transacción (nivel raíz)
        transaccion_data = {
            'numDocumentoIdObligado': rips_data.get('numDocumentoIdObligado'),
            'numFactura': rips_data.get('numFactura'),
            'tipoNota': rips_data.get('tipoNota'),
            'numNota': rips_data.get('numNota')
        }

        usuarios = rips_data.get('usuarios', [])
        
        self.stdout.write(f'📋 Transacción: {transaccion_data["numFactura"]}')
        self.stdout.write(f'👥 Total usuarios: {len(usuarios)}')

        # Contar servicios por tipo
        estadisticas = self._analizar_servicios(usuarios)
        self._mostrar_estadisticas(estadisticas)

        if dry_run:
            self.stdout.write(self.style.WARNING('🔍 Análisis completado (DRY-RUN)'))
            return

        # Procesar con transacción de base de datos
        with transaction.atomic():
            # Crear transacción RIPS
            transaccion_obj = self._crear_transaccion(
                transaccion_data, estadisticas, archivo_path
            )

            # Procesar usuarios en chunks
            self._procesar_usuarios_chunks(
                usuarios, transaccion_obj, chunk_size
            )

    def _analizar_servicios(self, usuarios):
        """
        Analiza servicios por tipo en todo el RIPS
        """
        estadisticas = {
            'consultas': 0,
            'procedimientos': 0,
            'urgencias': 0,
            'hospitalizacion': 0,
            'otrosServicios': 0,
            'recienNacidos': 0,
            'medicamentos': 0,
            'total_servicios': 0
        }

        for usuario in usuarios:
            servicios = usuario.get('servicios', {})
            
            for tipo_servicio in estadisticas.keys():
                if tipo_servicio == 'total_servicios':
                    continue
                
                servicios_tipo = servicios.get(tipo_servicio, [])
                if isinstance(servicios_tipo, list):
                    count = len(servicios_tipo)
                    estadisticas[tipo_servicio] += count
                    estadisticas['total_servicios'] += count

        return estadisticas

    def _mostrar_estadisticas(self, estadisticas):
        """
        Muestra estadísticas del archivo RIPS
        """
        self.stdout.write('\n📊 ESTADÍSTICAS DE SERVICIOS:')
        
        for tipo, cantidad in estadisticas.items():
            if cantidad > 0:
                emoji = self._get_emoji_servicio(tipo)
                self.stdout.write(f'  {emoji} {tipo}: {cantidad:,}')
        
        self.stdout.write(
            f'\n🎯 TOTAL SERVICIOS: {estadisticas["total_servicios"]:,}\n'
        )

    def _get_emoji_servicio(self, tipo_servicio):
        """
        Obtiene emoji para tipo de servicio
        """
        emojis = {
            'consultas': '🩺',
            'procedimientos': '⚕️',
            'urgencias': '🚨',
            'hospitalizacion': '🏥',
            'otrosServicios': '🔧',
            'recienNacidos': '👶',
            'medicamentos': '💊',
            'total_servicios': '🎯'
        }
        return emojis.get(tipo_servicio, '📋')

    def _crear_transaccion(self, transaccion_data, estadisticas, archivo_path):
        """
        Crea registro de transacción RIPS
        """
        import os
        
        transaccion = RIPSTransaccion.objects.create(
            num_documento_id_obligado=transaccion_data['numDocumentoIdObligado'],
            num_factura=transaccion_data['numFactura'],
            tipo_nota=transaccion_data.get('tipoNota'),
            num_nota=transaccion_data.get('numNota'),
            archivo_origen_json=os.path.basename(archivo_path),
            tamaño_archivo_kb=int(os.path.getsize(archivo_path) / 1024),
            total_usuarios=len([]),  # Se actualizará después
            total_servicios=estadisticas['total_servicios'],
            estado_procesamiento='PROCESADO',
            estadisticas_servicios=estadisticas
        )

        self.stdout.write(
            f'✅ Transacción creada: {transaccion._id}'
        )
        
        return transaccion

    def _procesar_usuarios_chunks(self, usuarios, transaccion_obj, chunk_size):
        """
        Procesa usuarios en chunks para optimizar memoria
        """
        total_usuarios = len(usuarios)
        chunks_procesados = 0
        
        for i in range(0, total_usuarios, chunk_size):
            chunk = usuarios[i:i + chunk_size]
            chunks_procesados += 1
            
            self.stdout.write(
                f'📦 Procesando chunk {chunks_procesados}: '
                f'usuarios {i+1}-{min(i+chunk_size, total_usuarios)}'
            )
            
            self._procesar_chunk_usuarios(chunk, transaccion_obj)

        # Actualizar total de usuarios en transacción
        transaccion_obj.total_usuarios = total_usuarios
        transaccion_obj.save()

    def _procesar_chunk_usuarios(self, usuarios_chunk, transaccion_obj):
        """
        Procesa un chunk de usuarios con sus servicios
        """
        for usuario_data in usuarios_chunk:
            # Crear usuario
            usuario_obj = self._crear_usuario(usuario_data, transaccion_obj)
            
            # Procesar servicios del usuario
            servicios = usuario_data.get('servicios', {})
            self._procesar_servicios_usuario(servicios, transaccion_obj, usuario_obj)

    def _crear_usuario(self, usuario_data, transaccion_obj):
        """
        Crea registro de usuario RIPS
        """
        try:
            fecha_nacimiento = datetime.strptime(
                usuario_data['fechaNacimiento'], '%Y-%m-%d'
            ).date()
        except (ValueError, KeyError):
            fecha_nacimiento = None

        usuario = RIPSUsuario.objects.create(
            transaccion_id=str(transaccion_obj._id),
            num_factura=transaccion_obj.num_factura,
            tipo_documento_identificacion=usuario_data.get('tipoDocumentoIdentificacion'),
            num_documento_identificacion=usuario_data.get('numDocumentoIdentificacion'),
            tipo_usuario=usuario_data.get('tipoUsuario'),
            fecha_nacimiento=fecha_nacimiento,
            cod_sexo=usuario_data.get('codSexo'),
            cod_pais_residencia=usuario_data.get('codPaisResidencia', '170'),
            cod_municipio_residencia=usuario_data.get('codMunicipioResidencia'),
            cod_zona_territorial_residencia=usuario_data.get('codZonaTerritorialResidencia'),
            incapacidad=usuario_data.get('incapacidad', 'NO'),
            consecutivo=usuario_data.get('consecutivo', 1),
            cod_pais_origen=usuario_data.get('codPaisOrigen', '170')
        )
        
        return usuario

    def _procesar_servicios_usuario(self, servicios, transaccion_obj, usuario_obj):
        """
        Procesa todos los tipos de servicios de un usuario
        """
        # Mapeo de procesadores por tipo de servicio
        procesadores = {
            'consultas': self._procesar_consultas,
            'procedimientos': self._procesar_procedimientos,
            'urgencias': self._procesar_urgencias,
            'hospitalizacion': self._procesar_hospitalizacion,
            'otrosServicios': self._procesar_otros_servicios,
            'recienNacidos': self._procesar_recien_nacidos,
            'medicamentos': self._procesar_medicamentos
        }

        # Contadores para estadísticas del usuario
        contadores = {}
        
        for tipo_servicio, procesador in procesadores.items():
            servicios_tipo = servicios.get(tipo_servicio, [])
            if servicios_tipo:
                cantidad = procesador(servicios_tipo, transaccion_obj, usuario_obj)
                contadores[f'total_{tipo_servicio}'] = cantidad

        # Actualizar estadísticas del usuario
        for campo, valor in contadores.items():
            setattr(usuario_obj, campo, valor)
        
        usuario_obj.save()

    def _procesar_consultas(self, consultas, transaccion_obj, usuario_obj):
        """
        Procesa consultas de un usuario
        """
        consultas_creadas = []
        
        for consulta_data in consultas:
            try:
                fecha_atencion = datetime.strptime(
                    consulta_data['fechaInicioAtencion'], '%Y-%m-%d %H:%M'
                )
            except (ValueError, KeyError):
                fecha_atencion = datetime.now()

            consulta = RIPSConsulta(
                transaccion_id=str(transaccion_obj._id),
                usuario_id=str(usuario_obj._id),
                num_factura=transaccion_obj.num_factura,
                num_documento_usuario=usuario_obj.num_documento_identificacion,
                cod_prestador=consulta_data.get('codPrestador'),
                fecha_inicio_atencion=fecha_atencion,
                num_autorizacion=consulta_data.get('numAutorizacion'),
                cod_consulta=consulta_data.get('codConsulta'),
                modalidad_grupo_servicio_tec_sal=consulta_data.get('modalidadGrupoServicioTecSal'),
                grupo_servicios=consulta_data.get('grupoServicios'),
                cod_servicio=consulta_data.get('codServicio', 0),
                finalidad_tecnologia_salud=consulta_data.get('finalidadTecnologiaSalud'),
                causa_motivo_atencion=consulta_data.get('causaMotivoAtencion'),
                cod_diagnostico_principal=consulta_data.get('codDiagnosticoPrincipal'),
                cod_diagnostico_relacionado1=consulta_data.get('codDiagnosticoRelacionado1'),
                cod_diagnostico_relacionado2=consulta_data.get('codDiagnosticoRelacionado2'),
                cod_diagnostico_relacionado3=consulta_data.get('codDiagnosticoRelacionado3'),
                tipo_diagnostico_principal=consulta_data.get('tipoDiagnosticoPrincipal'),
                tipo_documento_profesional=consulta_data.get('tipoDocumentoIdentificacion'),
                num_documento_profesional=consulta_data.get('numDocumentoIdentificacion'),
                vr_servicio=Decimal(str(consulta_data.get('vrServicio', 0))),
                concepto_recaudo=consulta_data.get('conceptoRecaudo'),
                valor_pago_moderador=Decimal(str(consulta_data.get('valorPagoModerador', 0))),
                num_fev_pago_moderador=consulta_data.get('numFEVPagoModerador'),
                consecutivo=consulta_data.get('consecutivo', 1)
            )
            consultas_creadas.append(consulta)

        # Bulk create para optimizar
        if consultas_creadas:
            RIPSConsulta.objects.bulk_create(consultas_creadas)

        return len(consultas_creadas)

    def _procesar_procedimientos(self, procedimientos, transaccion_obj, usuario_obj):
        """
        Procesa procedimientos de un usuario
        """
        procedimientos_creados = []
        
        for proc_data in procedimientos:
            try:
                fecha_atencion = datetime.strptime(
                    proc_data['fechaInicioAtencion'], '%Y-%m-%d %H:%M'
                )
            except (ValueError, KeyError):
                fecha_atencion = datetime.now()

            procedimiento = RIPSProcedimiento(
                transaccion_id=str(transaccion_obj._id),
                usuario_id=str(usuario_obj._id),
                num_factura=transaccion_obj.num_factura,
                num_documento_usuario=usuario_obj.num_documento_identificacion,
                cod_prestador=proc_data.get('codPrestador'),
                fecha_inicio_atencion=fecha_atencion,
                id_mipres=proc_data.get('idMIPRES'),
                num_autorizacion=proc_data.get('numAutorizacion'),
                cod_procedimiento=proc_data.get('codProcedimiento'),
                via_ingreso_servicio_salud=proc_data.get('viaIngresoServicioSalud'),
                modalidad_grupo_servicio_tec_sal=proc_data.get('modalidadGrupoServicioTecSal'),
                grupo_servicios=proc_data.get('grupoServicios'),
                cod_servicio=proc_data.get('codServicio', 0),
                finalidad_tecnologia_salud=proc_data.get('finalidadTecnologiaSalud'),
                tipo_documento_profesional=proc_data.get('tipoDocumentoIdentificacion'),
                num_documento_profesional=proc_data.get('numDocumentoIdentificacion'),
                cod_diagnostico_principal=proc_data.get('codDiagnosticoPrincipal'),
                cod_diagnostico_relacionado=proc_data.get('codDiagnosticoRelacionado'),
                cod_complicacion=proc_data.get('codComplicacion'),
                vr_servicio=Decimal(str(proc_data.get('vrServicio', 0))),
                concepto_recaudo=proc_data.get('conceptoRecaudo'),
                valor_pago_moderador=Decimal(str(proc_data.get('valorPagoModerador', 0))),
                num_fev_pago_moderador=proc_data.get('numFEVPagoModerador'),
                consecutivo=proc_data.get('consecutivo', 1)
            )
            procedimientos_creados.append(procedimiento)

        # Bulk create para optimizar
        if procedimientos_creados:
            RIPSProcedimiento.objects.bulk_create(procedimientos_creados)

        return len(procedimientos_creados)

    def _procesar_urgencias(self, urgencias, transaccion_obj, usuario_obj):
        """
        Procesa urgencias de un usuario
        """
        urgencias_creadas = []
        
        for urg_data in urgencias:
            try:
                fecha_inicio = datetime.strptime(
                    urg_data['fechaInicioAtencion'], '%Y-%m-%d %H:%M'
                )
                fecha_egreso = datetime.strptime(
                    urg_data['fechaEgreso'], '%Y-%m-%d %H:%M'
                )
            except (ValueError, KeyError):
                fecha_inicio = datetime.now()
                fecha_egreso = datetime.now()

            urgencia = RIPSUrgencia(
                transaccion_id=str(transaccion_obj._id),
                usuario_id=str(usuario_obj._id),
                num_factura=transaccion_obj.num_factura,
                num_documento_usuario=usuario_obj.num_documento_identificacion,
                cod_prestador=urg_data.get('codPrestador'),
                fecha_inicio_atencion=fecha_inicio,
                causa_motivo_atencion=urg_data.get('causaMotivoAtencion'),
                cod_diagnostico_principal=urg_data.get('codDiagnosticoPrincipal'),
                cod_diagnostico_principal_e=urg_data.get('codDiagnosticoPrincipalE'),
                cod_diagnostico_relacionado_e1=urg_data.get('codDiagnosticoRelacionadoE1'),
                cod_diagnostico_relacionado_e2=urg_data.get('codDiagnosticoRelacionadoE2'),
                cod_diagnostico_relacionado_e3=urg_data.get('codDiagnosticoRelacionadoE3'),
                condicion_destino_usuario_egreso=urg_data.get('condicionDestinoUsuarioEgreso'),
                cod_diagnostico_causa_muerte=urg_data.get('codDiagnosticoCausaMuerte'),
                fecha_egreso=fecha_egreso,
                consecutivo=urg_data.get('consecutivo', 1)
            )
            urgencias_creadas.append(urgencia)

        if urgencias_creadas:
            RIPSUrgencia.objects.bulk_create(urgencias_creadas)

        return len(urgencias_creadas)

    def _procesar_hospitalizacion(self, hospitalizaciones, transaccion_obj, usuario_obj):
        """
        Procesa hospitalizaciones de un usuario
        """
        hospitalizaciones_creadas = []
        
        for hosp_data in hospitalizaciones:
            try:
                fecha_inicio = datetime.strptime(
                    hosp_data['fechaInicioAtencion'], '%Y-%m-%d %H:%M'
                )
                fecha_egreso = datetime.strptime(
                    hosp_data['fechaEgreso'], '%Y-%m-%d %H:%M'
                )
            except (ValueError, KeyError):
                fecha_inicio = datetime.now()
                fecha_egreso = datetime.now()

            hospitalizacion = RIPSHospitalizacion(
                transaccion_id=str(transaccion_obj._id),
                usuario_id=str(usuario_obj._id),
                num_factura=transaccion_obj.num_factura,
                num_documento_usuario=usuario_obj.num_documento_identificacion,
                cod_prestador=hosp_data.get('codPrestador'),
                via_ingreso_servicio_salud=hosp_data.get('viaIngresoServicioSalud'),
                fecha_inicio_atencion=fecha_inicio,
                num_autorizacion=hosp_data.get('numAutorizacion'),
                causa_motivo_atencion=hosp_data.get('causaMotivoAtencion'),
                cod_diagnostico_principal=hosp_data.get('codDiagnosticoPrincipal'),
                cod_diagnostico_principal_e=hosp_data.get('codDiagnosticoPrincipalE'),
                cod_diagnostico_relacionado_e1=hosp_data.get('codDiagnosticoRelacionadoE1'),
                cod_diagnostico_relacionado_e2=hosp_data.get('codDiagnosticoRelacionadoE2'),
                cod_diagnostico_relacionado_e3=hosp_data.get('codDiagnosticoRelacionadoE3'),
                cod_complicacion=hosp_data.get('codComplicacion'),
                condicion_destino_usuario_egreso=hosp_data.get('condicionDestinoUsuarioEgreso'),
                cod_diagnostico_causa_muerte=hosp_data.get('codDiagnosticoCausaMuerte'),
                fecha_egreso=fecha_egreso,
                consecutivo=hosp_data.get('consecutivo', 1)
            )
            hospitalizaciones_creadas.append(hospitalizacion)

        if hospitalizaciones_creadas:
            RIPSHospitalizacion.objects.bulk_create(hospitalizaciones_creadas)

        return len(hospitalizaciones_creadas)

    def _procesar_otros_servicios(self, otros_servicios, transaccion_obj, usuario_obj):
        """
        Procesa otros servicios de un usuario
        """
        otros_creados = []
        
        for os_data in otros_servicios:
            try:
                fecha_suministro = datetime.strptime(
                    os_data['fechaSuministroTecnologia'], '%Y-%m-%d %H:%M'
                )
            except (ValueError, KeyError):
                fecha_suministro = datetime.now()

            otro_servicio = RIPSOtrosServicios(
                transaccion_id=str(transaccion_obj._id),
                usuario_id=str(usuario_obj._id),
                num_factura=transaccion_obj.num_factura,
                num_documento_usuario=usuario_obj.num_documento_identificacion,
                cod_prestador=os_data.get('codPrestador'),
                num_autorizacion=os_data.get('numAutorizacion'),
                id_mipres=os_data.get('idMIPRES'),
                fecha_suministro_tecnologia=fecha_suministro,
                tipo_os=os_data.get('tipoOS'),
                cod_tecnologia_salud=os_data.get('codTecnologiaSalud'),
                nom_tecnologia_salud=os_data.get('nomTecnologiaSalud', ''),
                cantidad_os=Decimal(str(os_data.get('cantidadOS', 1))),
                tipo_documento_profesional=os_data.get('tipoDocumentoIdentificacion'),
                num_documento_profesional=os_data.get('numDocumentoIdentificacion'),
                vr_unit_os=Decimal(str(os_data.get('vrUnitOS', 0))),
                vr_servicio=Decimal(str(os_data.get('vrServicio', 0))),
                concepto_recaudo=os_data.get('conceptoRecaudo'),
                valor_pago_moderador=Decimal(str(os_data.get('valorPagoModerador', 0))),
                num_fev_pago_moderador=os_data.get('numFEVPagoModerador'),
                consecutivo=os_data.get('consecutivo', 1)
            )
            otros_creados.append(otro_servicio)

        if otros_creados:
            RIPSOtrosServicios.objects.bulk_create(otros_creados)

        return len(otros_creados)

    def _procesar_recien_nacidos(self, recien_nacidos, transaccion_obj, usuario_obj):
        """
        Procesa recién nacidos de un usuario
        """
        nacidos_creados = []
        
        for rn_data in recien_nacidos:
            try:
                fecha_nacimiento = datetime.strptime(
                    rn_data['fechaNacimiento'], '%Y-%m-%d %H:%M'
                )
                fecha_egreso = datetime.strptime(
                    rn_data['fechaEgreso'], '%Y-%m-%d %H:%M'
                )
            except (ValueError, KeyError):
                fecha_nacimiento = datetime.now()
                fecha_egreso = datetime.now()

            recien_nacido = RIPSRecienNacidos(
                transaccion_id=str(transaccion_obj._id),
                usuario_id=str(usuario_obj._id),
                num_factura=transaccion_obj.num_factura,
                num_documento_usuario=usuario_obj.num_documento_identificacion,
                cod_prestador=rn_data.get('codPrestador'),
                tipo_documento_identificacion=rn_data.get('tipoDocumentoIdentificacion'),
                num_documento_identificacion=rn_data.get('numDocumentoIdentificacion'),
                fecha_nacimiento=fecha_nacimiento,
                edad_gestacional=rn_data.get('edadGestacional', 0),
                num_consultas_c_prenatal=rn_data.get('numConsultasCPrenatal', 0),
                cod_sexo_biologico=rn_data.get('codSexoBiologico'),
                peso=rn_data.get('peso', 0),
                cod_diagnostico_principal=rn_data.get('codDiagnosticoPrincipal'),
                condicion_destino_usuario_egreso=rn_data.get('condicionDestinoUsuarioEgreso'),
                cod_diagnostico_causa_muerte=rn_data.get('codDiagnosticoCausaMuerte'),
                fecha_egreso=fecha_egreso,
                consecutivo=rn_data.get('consecutivo', 1)
            )
            nacidos_creados.append(recien_nacido)

        if nacidos_creados:
            RIPSRecienNacidos.objects.bulk_create(nacidos_creados)

        return len(nacidos_creados)

    def _procesar_medicamentos(self, medicamentos, transaccion_obj, usuario_obj):
        """
        Procesa medicamentos de un usuario
        """
        medicamentos_creados = []
        
        for med_data in medicamentos:
            try:
                fecha_suministro = datetime.strptime(
                    med_data['fechaSuministroMedicamento'], '%Y-%m-%d %H:%M'
                )
            except (ValueError, KeyError):
                fecha_suministro = datetime.now()

            medicamento = RIPSMedicamento(
                transaccion_id=str(transaccion_obj._id),
                usuario_id=str(usuario_obj._id),
                num_factura=transaccion_obj.num_factura,
                num_documento_usuario=usuario_obj.num_documento_identificacion,
                cod_prestador=med_data.get('codPrestador'),
                num_autorizacion=med_data.get('numAutorizacion'),
                id_mipres=med_data.get('idMIPRES'),
                fecha_suministro_medicamento=fecha_suministro,
                tipo_medicamento=med_data.get('tipoMedicamento'),
                cod_medicamento=med_data.get('codMedicamento'),
                tipo_medicamento_codigo=med_data.get('tipoMedicamentoCodigo'),
                nom_medicamento=med_data.get('nomMedicamento', ''),
                forma_farmaceutica=med_data.get('formaFarmaceutica'),
                concentracion_medicamento=med_data.get('concentracionMedicamento'),
                unidad_medida_medicamento=med_data.get('unidadMedidaMedicamento'),
                cantidad_medicamento=Decimal(str(med_data.get('cantidadMedicamento', 1))),
                tipo_documento_profesional=med_data.get('tipoDocumentoIdentificacion'),
                num_documento_profesional=med_data.get('numDocumentoIdentificacion'),
                vr_unitario_medicamento=Decimal(str(med_data.get('vrUnitarioMedicamento', 0))),
                vr_servicio=Decimal(str(med_data.get('vrServicio', 0))),
                concepto_recaudo=med_data.get('conceptoRecaudo'),
                valor_pago_moderador=Decimal(str(med_data.get('valorPagoModerador', 0))),
                num_fev_pago_moderador=med_data.get('numFEVPagoModerador'),
                consecutivo=med_data.get('consecutivo', 1)
            )
            medicamentos_creados.append(medicamento)

        if medicamentos_creados:
            RIPSMedicamento.objects.bulk_create(medicamentos_creados)

        return len(medicamentos_creados)