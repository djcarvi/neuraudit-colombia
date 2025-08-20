# -*- coding: utf-8 -*-
# apps/catalogs/services_django_mongodb.py

"""
Servicios Django MongoDB Backend Oficial - Catálogos NeurAudit Colombia
Usando QuerySet API oficial y operaciones CRUD nativas
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from decimal import Decimal
from django.db.models import Q, Count, Sum
from django.core.exceptions import ValidationError, ObjectDoesNotExist
import logging

from .models import (
    CatalogoCUPSOficial, CatalogoCUMOficial, CatalogoIUMOficial,
    CatalogoDispositivosOficial, BDUAAfiliados, Prestadores, Contratos
)

logger = logging.getLogger(__name__)


class CatalogoCUPSService:
    """
    Servicio para manejo del Catálogo CUPS oficial
    Usando Django MongoDB Backend QuerySet API
    """
    
    @staticmethod
    def crear_codigo_cups(datos_cups: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo código CUPS usando Django QuerySet API
        """
        try:
            # Usar create() oficial de Django
            cups = CatalogoCUPSOficial.objects.create(
                codigo=datos_cups['codigo'],
                nombre=datos_cups['nombre'],
                descripcion=datos_cups.get('descripcion', ''),
                habilitado=datos_cups.get('habilitado', True),
                aplicacion=datos_cups.get('aplicacion'),
                uso_codigo_cup=datos_cups.get('uso_codigo_cup'),
                es_quirurgico=datos_cups.get('es_quirurgico', False),
                numero_minimo=datos_cups.get('numero_minimo'),
                numero_maximo=datos_cups.get('numero_maximo'),
                diagnostico_requerido=datos_cups.get('diagnostico_requerido', False),
                sexo=datos_cups.get('sexo'),
                ambito=datos_cups.get('ambito'),
                estancia=datos_cups.get('estancia'),
                cobertura=datos_cups.get('cobertura'),
                duplicado=datos_cups.get('duplicado'),
                valor_registro=datos_cups.get('valor_registro'),
                usuario_responsable=datos_cups.get('usuario_responsable'),
                fecha_actualizacion=datos_cups.get('fecha_actualizacion', datetime.now()),
                is_public_private=datos_cups.get('is_public_private'),
            )
            
            return {
                'exito': True,
                'id': str(cups.id),
                'codigo': cups.codigo,
                'nombre': cups.nombre
            }
            
        except Exception as e:
            logger.error(f'Error creando código CUPS: {str(e)}')
            return {'exito': False, 'error': str(e)}
    
    @staticmethod
    def buscar_codigo_cups(codigo: str) -> Optional[CatalogoCUPSOficial]:
        """
        Busca un código CUPS específico usando get()
        """
        try:
            return CatalogoCUPSOficial.objects.get(codigo=codigo)
        except ObjectDoesNotExist:
            return None
    
    @staticmethod
    def validar_codigo_cups(codigo: str, datos_servicio: Dict = None) -> Dict[str, Any]:
        """
        Valida un código CUPS con reglas de negocio
        """
        cups = CatalogoCUPSService.buscar_codigo_cups(codigo)
        
        if not cups:
            return {
                'valido': False,
                'codigo_devolucion': 'DE5001',
                'mensaje': f'Código CUPS {codigo} no existe en catálogo oficial'
            }
        
        if not cups.habilitado:
            return {
                'valido': False,
                'codigo_devolucion': 'DE5002',
                'mensaje': f'Código CUPS {codigo} se encuentra inhabilitado'
            }
        
        # Validaciones adicionales si se proporcionan datos del servicio
        if datos_servicio:
            # Validar sexo
            if cups.sexo and datos_servicio.get('sexo_paciente'):
                if cups.sexo != 'Z' and cups.sexo != datos_servicio['sexo_paciente']:
                    return {
                        'valido': False,
                        'codigo_devolucion': 'DE5003',
                        'mensaje': f'Código CUPS {codigo} no aplica para sexo {datos_servicio["sexo_paciente"]}'
                    }
            
            # Validar ámbito
            if cups.ambito and datos_servicio.get('ambito_atencion'):
                if cups.ambito != 'Z' and cups.ambito != datos_servicio['ambito_atencion']:
                    return {
                        'valido': False,
                        'codigo_devolucion': 'DE5004',
                        'mensaje': f'Código CUPS {codigo} no aplica para ámbito {datos_servicio["ambito_atencion"]}'
                    }
        
        return {
            'valido': True,
            'codigo_cups': codigo,
            'nombre': cups.nombre,
            'es_quirurgico': cups.es_quirurgico,
            'diagnostico_requerido': cups.diagnostico_requerido
        }
    
    @staticmethod
    def buscar_cups_por_texto(texto_busqueda: str, limite: int = 50) -> List[CatalogoCUPSOficial]:
        """
        Búsqueda de códigos CUPS usando filter() con Q objects
        """
        return list(
            CatalogoCUPSOficial.objects.filter(
                Q(habilitado=True) & (
                    Q(nombre__icontains=texto_busqueda) |
                    Q(descripcion__icontains=texto_busqueda) |
                    Q(codigo__icontains=texto_busqueda)
                )
            )[:limite]
        )
    
    @staticmethod
    def cargar_masivo_cups(datos_cups: List[Dict]) -> Dict[str, Any]:
        """
        Carga masiva de códigos CUPS usando bulk_create()
        """
        try:
            cups_objects = []
            errores = []
            
            for i, datos in enumerate(datos_cups):
                try:
                    cups_obj = CatalogoCUPSOficial(
                        codigo=datos['codigo'],
                        nombre=datos['nombre'],
                        descripcion=datos.get('descripcion', ''),
                        habilitado=True,
                        aplicacion=datos.get('aplicacion'),
                        uso_codigo_cup=datos.get('uso_codigo_cup'),
                        es_quirurgico=datos.get('es_quirurgico') == 'S',
                        numero_minimo=CatalogoCUPSService._convertir_entero(datos.get('numero_minimo')),
                        numero_maximo=CatalogoCUPSService._convertir_entero(datos.get('numero_maximo')),
                        diagnostico_requerido=datos.get('diagnostico_requerido') == 'S',
                        sexo=datos.get('sexo'),
                        ambito=datos.get('ambito'),
                        estancia=datos.get('estancia'),
                        cobertura=datos.get('cobertura'),
                        duplicado=datos.get('duplicado'),
                        valor_registro=datos.get('valor_registro'),
                        usuario_responsable=datos.get('usuario_responsable'),
                        fecha_actualizacion=CatalogoCUPSService._convertir_fecha(datos.get('fecha_actualizacion')),
                        is_public_private=datos.get('is_public_private'),
                    )
                    cups_objects.append(cups_obj)
                    
                except Exception as e:
                    errores.append({
                        'fila': i + 1,
                        'codigo': datos.get('codigo', 'N/A'),
                        'error': str(e)
                    })
            
            if cups_objects:
                # Usar bulk_create() oficial de Django
                cups_creados = CatalogoCUPSOficial.objects.bulk_create(
                    cups_objects,
                    ignore_conflicts=True  # Ignorar duplicados
                )
                
                return {
                    'exito': True,
                    'registros_insertados': len(cups_creados),
                    'registros_procesados': len(datos_cups),
                    'errores': errores
                }
            else:
                return {
                    'exito': False,
                    'mensaje': 'No se pudieron procesar los documentos',
                    'errores': errores
                }
                
        except Exception as e:
            logger.error(f'Error en carga masiva CUPS: {str(e)}')
            return {
                'exito': False,
                'error': 'Error en operación masiva',
                'detalles': str(e)
            }
    
    @staticmethod
    def obtener_estadisticas_cups() -> Dict[str, Any]:
        """
        Obtiene estadísticas usando aggregate()
        """
        from django.db.models import Count, Case, When, IntegerField
        
        stats = CatalogoCUPSOficial.objects.aggregate(
            total_codigos=Count('id'),
            habilitados=Count(Case(When(habilitado=True, then=1), output_field=IntegerField())),
            quirurgicos=Count(Case(When(es_quirurgico=True, then=1), output_field=IntegerField())),
            requieren_diagnostico=Count(Case(When(diagnostico_requerido=True, then=1), output_field=IntegerField()))
        )
        
        return stats
    
    @staticmethod
    def _convertir_entero(valor) -> Optional[int]:
        """Convierte valor a entero de forma segura"""
        try:
            return int(valor) if valor and str(valor).strip() else None
        except (ValueError, TypeError):
            return None
    
    @staticmethod
    def _convertir_fecha(valor) -> datetime:
        """Convierte valor a fecha de forma segura"""
        if isinstance(valor, datetime):
            return valor
        elif isinstance(valor, str) and valor.strip():
            try:
                return datetime.strptime(valor.strip(), '%Y-%m-%d')
            except ValueError:
                return datetime.now()
        else:
            return datetime.now()


class CatalogoCUMService:
    """
    Servicio para manejo del Catálogo CUM oficial
    """
    
    @staticmethod
    def buscar_medicamento_cum(codigo_cum: str) -> Optional[CatalogoCUMOficial]:
        """
        Busca un medicamento por código CUM
        """
        try:
            return CatalogoCUMOficial.objects.get(codigo=codigo_cum)
        except ObjectDoesNotExist:
            return None
    
    @staticmethod
    def validar_medicamento_cum(codigo_cum: str) -> Dict[str, Any]:
        """
        Valida un código CUM con reglas de negocio
        """
        medicamento = CatalogoCUMService.buscar_medicamento_cum(codigo_cum)
        
        if not medicamento:
            return {
                'valido': False,
                'codigo_devolucion': 'DE5011',
                'mensaje': f'Código CUM {codigo_cum} no existe en catálogo oficial'
            }
        
        if not medicamento.habilitado:
            return {
                'valido': False,
                'codigo_devolucion': 'DE5012',
                'mensaje': f'Código CUM {codigo_cum} se encuentra inhabilitado'
            }
        
        return {
            'valido': True,
            'codigo_cum': codigo_cum,
            'nombre': medicamento.nombre,
            'principio_activo': medicamento.principio_activo,
            'via_administracion': medicamento.via_administracion,
            'es_muestra_medica': medicamento.es_muestra_medica
        }
    
    @staticmethod
    def buscar_medicamentos_por_principio_activo(principio_activo: str, limite: int = 50) -> List[CatalogoCUMOficial]:
        """
        Búsqueda por principio activo usando filter()
        """
        return list(
            CatalogoCUMOficial.objects.filter(
                Q(habilitado=True) &
                Q(principio_activo__icontains=principio_activo)
            )[:limite]
        )


class BDUAService:
    """
    Servicio para manejo de la Base de Datos Única de Afiliados (BDUA)
    """
    
    @staticmethod
    def buscar_afiliado(tipo_documento: str, numero_documento: str, 
                       codigo_eps: str = None) -> Optional[BDUAAfiliados]:
        """
        Busca un afiliado en la BDUA usando filter()
        """
        filtro = Q(
            usuario_tipo_documento=tipo_documento,
            usuario_numero_documento=numero_documento
        )
        
        if codigo_eps:
            filtro &= Q(codigo_eps=codigo_eps)
        
        try:
            return BDUAAfiliados.objects.filter(filtro).first()
        except Exception:
            return None
    
    @staticmethod
    def validar_derechos_afiliado(tipo_documento: str, numero_documento: str,
                                fecha_atencion: datetime, codigo_eps: str = None) -> Dict[str, Any]:
        """
        Valida los derechos de un afiliado en fecha específica
        """
        afiliado = BDUAService.buscar_afiliado(tipo_documento, numero_documento, codigo_eps)
        
        if not afiliado:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': f'Afiliado {tipo_documento} {numero_documento} no encontrado en BDUA',
                'requiere_devolucion': True
            }
        
        # Validar estado de afiliación
        estado_afiliacion = afiliado.afiliacion_estado_afiliacion
        if estado_afiliacion not in ['AC', 'ST']:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': f'Afiliado con estado {estado_afiliacion} en fecha de atención',
                'requiere_devolucion': True
            }
        
        # Validar fecha efectiva
        fecha_efectiva = afiliado.afiliacion_fecha_efectiva_bd
        if fecha_efectiva and fecha_atencion.date() < fecha_efectiva:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': 'Atención antes de la fecha efectiva de afiliación',
                'requiere_devolucion': True
            }
        
        # Validar fecha de retiro
        fecha_retiro = afiliado.afiliacion_fecha_retiro
        if fecha_retiro and fecha_atencion.date() > fecha_retiro:
            return {
                'valido': False,
                'codigo_devolucion': 'DE1601',
                'mensaje': 'Atención después de la fecha de retiro',
                'requiere_devolucion': True
            }
        
        return {
            'valido': True,
            'afiliado': {
                'documento': f"{tipo_documento} {numero_documento}",
                'nombre_completo': afiliado.nombre_completo,
                'regimen': afiliado.regimen,
                'estado_afiliacion': estado_afiliacion,
                'fecha_nacimiento': afiliado.usuario_fecha_nacimiento,
                'sexo': afiliado.usuario_sexo,
                'nivel_sisben': afiliado.caracteristicas_nivel_sisben,
                'tipo_usuario': afiliado.usuario_tipo_usuario
            }
        }
    
    @staticmethod
    def cargar_masivo_bdua(datos_bdua: List[Dict], regimen: str) ->Dict[str, Any]:
        """
        Carga masiva de afiliados BDUA usando bulk_create()
        """
        try:
            afiliados_objects = []
            errores = []
            
            for i, datos in enumerate(datos_bdua):
                try:
                    afiliado_obj = BDUAAfiliados(
                        id_unico=datos.get('id_unico') or f"{datos['codigo_eps']}_{datos['usuario_numero_documento']}",
                        codigo_eps=datos['codigo_eps'],
                        regimen=regimen,
                        tipo_afiliacion=datos.get('tipo_afiliacion'),
                        
                        # Datos básicos usuario
                        usuario_tipo_documento=datos['usuario_tipo_documento'],
                        usuario_numero_documento=datos['usuario_numero_documento'],
                        usuario_primer_apellido=datos.get('usuario_primer_apellido'),
                        usuario_segundo_apellido=datos.get('usuario_segundo_apellido'),
                        usuario_primer_nombre=datos.get('usuario_primer_nombre'),
                        usuario_segundo_nombre=datos.get('usuario_segundo_nombre'),
                        usuario_fecha_nacimiento=BDUAService._convertir_fecha_nacimiento(datos.get('usuario_fecha_nacimiento')),
                        usuario_sexo=datos['usuario_sexo'],
                        usuario_tipo_usuario=datos.get('usuario_tipo_usuario'),
                        
                        # Cotizante
                        cotizante_tipo_documento=datos.get('cotizante_tipo_documento'),
                        cotizante_numero_documento=datos.get('cotizante_numero_documento'),
                        
                        # Datos familiares
                        familia_parentesco=BDUAService._convertir_entero(datos.get('familia_parentesco')),
                        familia_id_cabeza_familia=datos.get('familia_id_cabeza_familia'),
                        familia_tipo_subsidio=BDUAService._convertir_entero(datos.get('familia_tipo_subsidio')),
                        
                        # Ubicación geográfica
                        ubicacion_departamento=datos.get('ubicacion_departamento'),
                        ubicacion_municipio=datos.get('ubicacion_municipio'),
                        ubicacion_zona=datos.get('ubicacion_zona'),
                        
                        # Características especiales
                        caracteristicas_discapacidad=datos.get('caracteristicas_discapacidad'),
                        caracteristicas_etnia_poblacion=datos.get('caracteristicas_etnia_poblacion'),
                        caracteristicas_nivel_sisben=datos.get('caracteristicas_nivel_sisben'),
                        caracteristicas_puntaje_sisben=datos.get('caracteristicas_puntaje_sisben'),
                        caracteristicas_ficha_sisben=datos.get('caracteristicas_ficha_sisben'),
                        
                        # Estado afiliación
                        afiliacion_fecha_afiliacion=BDUAService._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_afiliacion')),
                        afiliacion_fecha_efectiva_bd=BDUAService._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_efectiva_bd')),
                        afiliacion_fecha_retiro=BDUAService._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_retiro')),
                        afiliacion_causal_retiro=datos.get('afiliacion_causal_retiro'),
                        afiliacion_fecha_retiro_bd=BDUAService._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_retiro_bd')),
                        afiliacion_tipo_traslado=datos.get('afiliacion_tipo_traslado'),
                        afiliacion_estado_traslado=datos.get('afiliacion_estado_traslado'),
                        afiliacion_estado_afiliacion=datos.get('afiliacion_estado_afiliacion', 'AC'),
                        afiliacion_fecha_ultima_novedad=BDUAService._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_ultima_novedad')),
                        afiliacion_fecha_defuncion=BDUAService._convertir_fecha_nacimiento(datos.get('afiliacion_fecha_defuncion')),
                        
                        # Datos contributivo
                        contributivo_codigo_entidad=datos.get('contributivo_codigo_entidad'),
                        contributivo_subred=datos.get('contributivo_subred'),
                        contributivo_ibc=BDUAService._convertir_decimal(datos.get('contributivo_ibc')),
                        
                        # Metadatos
                        metadata_archivo_origen=datos.get('metadata_archivo_origen'),
                        metadata_version_bdua=datos.get('metadata_version_bdua'),
                        metadata_observaciones=datos.get('metadata_observaciones'),
                    )
                    
                    afiliados_objects.append(afiliado_obj)
                    
                except Exception as e:
                    errores.append({
                        'fila': i + 1,
                        'documento': datos.get('usuario_numero_documento', 'N/A'),
                        'error': str(e)
                    })
            
            if afiliados_objects:
                # Usar bulk_create() oficial de Django
                afiliados_creados = BDUAAfiliados.objects.bulk_create(
                    afiliados_objects,
                    ignore_conflicts=True
                )
                
                return {
                    'exito': True,
                    'registros_insertados': len(afiliados_creados),
                    'registros_procesados': len(datos_bdua),
                    'errores': errores
                }
            else:
                return {
                    'exito': False,
                    'mensaje': 'No se pudieron procesar los documentos',
                    'errores': errores
                }
                
        except Exception as e:
            logger.error(f'Error en carga masiva BDUA: {str(e)}')
            return {
                'exito': False,
                'error': 'Error en operación masiva',
                'detalles': str(e)
            }
    
    @staticmethod
    def _convertir_fecha_nacimiento(valor) -> Optional[datetime]:
        """Convierte fecha de nacimiento de forma segura"""
        if not valor:
            return None
        
        if isinstance(valor, datetime):
            return valor
        
        try:
            if isinstance(valor, str):
                # Intentar varios formatos
                formatos = ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y']
                for formato in formatos:
                    try:
                        return datetime.strptime(valor.strip(), formato)
                    except ValueError:
                        continue
        except Exception:
            pass
        
        return None
    
    @staticmethod
    def _convertir_entero(valor) -> Optional[int]:
        """Convierte valor a entero de forma segura"""
        try:
            return int(valor) if valor and str(valor).strip() else None
        except (ValueError, TypeError):
            return None
    
    @staticmethod
    def _convertir_decimal(valor) -> Optional[float]:
        """Convierte valor a decimal de forma segura"""
        try:
            return float(valor) if valor and str(valor).strip() else None
        except (ValueError, TypeError):
            return None