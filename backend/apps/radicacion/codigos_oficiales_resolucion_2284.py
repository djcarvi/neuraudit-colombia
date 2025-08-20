# -*- coding: utf-8 -*-
# apps/radicacion/codigos_oficiales_resolucion_2284.py

"""
Códigos Oficiales según Resolución 2284 de 2023
Ministerio de Salud y Protección Social - Colombia

IMPORTANTE: Estos códigos deben coincidir EXACTAMENTE con la normativa oficial
para garantizar el cumplimiento legal del sistema de auditoría
"""

# CAUSALES DE DEVOLUCIÓN SEGÚN RESOLUCIÓN 2284 DE 2023
CAUSALES_DEVOLUCION_OFICIALES = {
    # Artículo XX - Causales de Devolución
    'DE16': {
        'codigo': 'DE16',
        'descripcion': 'Persona corresponde a otro responsable de pago',
        'categoria': 'DERECHOS',
        'aplica_valor_total': True,
        'requiere_validacion_bdua': True,
        'plazo_respuesta_dias': 5,
        'observaciones': 'Usuario no afiliado a la EPS o con derechos en otra entidad'
    },
    
    'DE44': {
        'codigo': 'DE44',
        'descripcion': 'Prestador individual o IPS no hace parte de la red integral de prestadores',
        'categoria': 'RED_PRESTADORES',
        'aplica_valor_total': True,
        'requiere_validacion_contrato': True,
        'plazo_respuesta_dias': 5,
        'observaciones': 'Prestador no contratado o con contrato vencido'
    },
    
    'DE50': {
        'codigo': 'DE50',
        'descripcion': 'Factura ya pagada o en trámite de pago',
        'categoria': 'DUPLICIDAD',
        'aplica_valor_total': True,
        'requiere_validacion_pagos': True,
        'plazo_respuesta_dias': 5,
        'observaciones': 'Factura duplicada o ya procesada en el sistema'
    },
    
    'DE56': {
        'codigo': 'DE56',
        'descripcion': 'No radicación de soportes dentro de los veintidós (22) días hábiles siguientes a la expedición de la factura',
        'categoria': 'PLAZO_RADICACION',
        'aplica_valor_total': True,
        'requiere_calculo_dias_habiles': True,
        'plazo_limite_dias_habiles': 22,
        'plazo_respuesta_dias': 5,
        'observaciones': 'Radicación extemporánea según Art. 8 de la Resolución'
    }
}

# CAUSALES DE GLOSA SEGÚN RESOLUCIÓN 2284 DE 2023
CAUSALES_GLOSA_OFICIALES = {
    
    # CATEGORÍA FA - FACTURACIÓN
    'FA': {
        'categoria': 'FA',
        'nombre': 'FACTURACIÓN',
        'descripcion': 'Diferencias en cantidades, valores, códigos o tarifas facturadas',
        'perfil_auditor': 'ADMINISTRATIVO',
        'subcausales': {
            'FA01': {
                'codigo': 'FA01',
                'descripcion': 'Diferencias en cantidades facturadas vs autorizadas',
                'aplicacion': 'Por servicio individual',
                'calculo': 'Valor unitario × diferencia en cantidad'
            },
            'FA02': {
                'codigo': 'FA02',
                'descripcion': 'Códigos CUPS, CUM o IUM no válidos o inexistentes',
                'aplicacion': 'Por servicio con código inválido',
                'calculo': 'Valor total del servicio'
            },
            'FA03': {
                'codigo': 'FA03',
                'descripcion': 'Servicios facturados no prestados',
                'aplicacion': 'Por servicio no documentado',
                'calculo': 'Valor total del servicio'
            },
            'FA04': {
                'codigo': 'FA04',
                'descripcion': 'Diferencias en valores unitarios facturados',
                'aplicacion': 'Por servicio con valor incorrecto',
                'calculo': 'Diferencia entre valor facturado y valor correcto'
            }
        }
    },
    
    # CATEGORÍA TA - TARIFAS
    'TA': {
        'categoria': 'TA',
        'nombre': 'TARIFAS',
        'descripcion': 'Diferencias entre valores facturados y valores pactados contractualmente',
        'perfil_auditor': 'ADMINISTRATIVO',
        'subcausales': {
            'TA01': {
                'codigo': 'TA01',
                'descripcion': 'Valores superiores a los pactados en el contrato',
                'aplicacion': 'Por servicio con tarifa excedida',
                'calculo': 'Diferencia entre valor facturado y valor contractual'
            },
            'TA02': {
                'codigo': 'TA02',
                'descripcion': 'Aplicación incorrecta de tarifario vigente',
                'aplicacion': 'Por servicio con tarifario incorrecto',
                'calculo': 'Diferencia entre tarifa aplicada y tarifa correcta'
            },
            'TA03': {
                'codigo': 'TA03',
                'descripcion': 'Facturación con tarifarios no vigentes',
                'aplicacion': 'Por servicio con tarifa vencida',
                'calculo': 'Diferencia entre tarifa vencida y tarifa vigente'
            }
        }
    },
    
    # CATEGORÍA SO - SOPORTES
    'SO': {
        'categoria': 'SO',
        'nombre': 'SOPORTES',
        'descripcion': 'Ausencia, inconsistencia o inadecuada calidad de documentos soporte',
        'perfil_auditor': 'ADMINISTRATIVO',
        'subcausales': {
            'SO01': {
                'codigo': 'SO01',
                'descripcion': 'Ausencia de historia clínica o documento soporte requerido',
                'aplicacion': 'Por servicio sin soporte documental',
                'calculo': 'Valor total del servicio'
            },
            'SO02': {
                'codigo': 'SO02',
                'descripcion': 'Inconsistencias entre facturación y documentos soporte',
                'aplicacion': 'Por servicio con inconsistencias documentales',
                'calculo': 'Valor del servicio inconsistente'
            },
            'SO03': {
                'codigo': 'SO03',
                'descripcion': 'Calidad inadecuada de documentos digitalizados',
                'aplicacion': 'Por documento ilegible o incompleto',
                'calculo': 'Valor del servicio con soporte inadecuado'
            },
            'SO04': {
                'codigo': 'SO04',
                'descripcion': 'Falta de firma del profesional tratante',
                'aplicacion': 'Por documento sin firma requerida',
                'calculo': 'Valor del servicio sin firma'
            }
        }
    },
    
    # CATEGORÍA AU - AUTORIZACIONES
    'AU': {
        'categoria': 'AU',
        'nombre': 'AUTORIZACIONES',
        'descripcion': 'Servicios prestados sin autorización previa cuando esta es requerida',
        'perfil_auditor': 'ADMINISTRATIVO',
        'subcausales': {
            'AU01': {
                'codigo': 'AU01',
                'descripcion': 'Servicios que requieren autorización previa sin la misma',
                'aplicacion': 'Por servicio sin autorización requerida',
                'calculo': 'Valor total del servicio no autorizado'
            },
            'AU02': {
                'codigo': 'AU02',
                'descripcion': 'Autorizaciones vencidas o no vigentes',
                'aplicacion': 'Por servicio con autorización vencida',
                'calculo': 'Valor total del servicio'
            },
            'AU03': {
                'codigo': 'AU03',
                'descripcion': 'Servicios que exceden lo autorizado en cantidad',
                'aplicacion': 'Por exceso en cantidad autorizada',
                'calculo': 'Valor unitario × cantidad excedente'
            },
            'AU04': {
                'codigo': 'AU04',
                'descripcion': 'Autorizaciones no corresponden al usuario facturado',
                'aplicacion': 'Por autorización de usuario diferente',
                'calculo': 'Valor total del servicio'
            }
        }
    },
    
    # CATEGORÍA CO - COBERTURA
    'CO': {
        'categoria': 'CO',
        'nombre': 'COBERTURA',
        'descripcion': 'Servicios no cubiertos por el Plan de Beneficios en Salud',
        'perfil_auditor': 'MEDICO',
        'subcausales': {
            'CO01': {
                'codigo': 'CO01',
                'descripcion': 'Servicios no incluidos en el Plan de Beneficios en Salud (PBS)',
                'aplicacion': 'Por servicio NO POS',
                'calculo': 'Valor total del servicio no cubierto'
            },
            'CO02': {
                'codigo': 'CO02',
                'descripcion': 'Medicamentos no incluidos en el Listado de Medicamentos del PBS',
                'aplicacion': 'Por medicamento NO POS',
                'calculo': 'Valor total del medicamento'
            },
            'CO03': {
                'codigo': 'CO03',
                'descripcion': 'Servicios experimentales o en investigación',
                'aplicacion': 'Por servicio experimental',
                'calculo': 'Valor total del servicio'
            },
            'CO04': {
                'codigo': 'CO04',
                'descripcion': 'Servicios estéticos o de embellecimiento',
                'aplicacion': 'Por servicio estético',
                'calculo': 'Valor total del servicio'
            }
        }
    },
    
    # CATEGORÍA CL - CALIDAD (PERTINENCIA MÉDICA)
    'CL': {
        'categoria': 'CL',
        'nombre': 'CALIDAD',
        'descripcion': 'Pertinencia médica y cumplimiento de protocolos clínicos',
        'perfil_auditor': 'MEDICO',
        'subcausales': {
            'CL01': {
                'codigo': 'CL01',
                'descripcion': 'Servicios no pertinentes para la patología diagnosticada',
                'aplicacion': 'Por servicio médicamente no pertinente',
                'calculo': 'Valor total del servicio no pertinente'
            },
            'CL02': {
                'codigo': 'CL02',
                'descripcion': 'Incumplimiento de guías de práctica clínica',
                'aplicacion': 'Por desviación de guías clínicas',
                'calculo': 'Valor del servicio desviado de la guía'
            },
            'CL03': {
                'codigo': 'CL03',
                'descripcion': 'Servicios repetitivos o duplicados sin justificación',
                'aplicacion': 'Por duplicación de servicios',
                'calculo': 'Valor del servicio duplicado'
            },
            'CL04': {
                'codigo': 'CL04',
                'descripcion': 'Estancias hospitalarias prolongadas sin justificación',
                'aplicacion': 'Por días de estancia injustificados',
                'calculo': 'Valor día estancia × días excesivos'
            },
            'CL05': {
                'codigo': 'CL05',
                'descripcion': 'Nivel de complejidad no requerido para la patología',
                'aplicacion': 'Por sobre-clasificación de complejidad',
                'calculo': 'Diferencia entre nivel facturado y nivel requerido'
            }
        }
    },
    
    # CATEGORÍA SA - SEGUIMIENTO DE ACUERDOS
    'SA': {
        'categoria': 'SA',
        'nombre': 'SEGUIMIENTO_ACUERDOS',
        'descripcion': 'Incumplimiento de acuerdos de gestión del riesgo e indicadores',
        'perfil_auditor': 'MEDICO',
        'subcausales': {
            'SA01': {
                'codigo': 'SA01',
                'descripcion': 'Incumplimiento de indicadores de calidad acordados',
                'aplicacion': 'Por meta de calidad no cumplida',
                'calculo': 'Porcentaje de penalización según acuerdo'
            },
            'SA02': {
                'codigo': 'SA02',
                'descripcion': 'Falta de implementación de programas de promoción y prevención',
                'aplicacion': 'Por programa P&P no implementado',
                'calculo': 'Valor de la penalización contractual'
            },
            'SA03': {
                'codigo': 'SA03',
                'descripcion': 'No reporte de eventos adversos o fallas de seguridad',
                'aplicacion': 'Por evento adverso no reportado',
                'calculo': 'Valor de la penalización según gravedad'
            }
        }
    }
}

# PLAZOS LEGALES SEGÚN RESOLUCIÓN 2284 DE 2023
PLAZOS_LEGALES_OFICIALES = {
    'RADICACION_SOPORTES': {
        'dias_habiles': 22,
        'descripcion': 'Plazo máximo para radicar facturas con soportes desde su expedición',
        'articulo': 'Artículo 8',
        'sancion': 'Devolución por causal DE56'
    },
    
    'RESPUESTA_DEVOLUCION_EPS': {
        'dias_habiles': 5,
        'descripcion': 'Plazo para que la EPS responda devoluciones',
        'articulo': 'Artículo 10',
        'inicio_conteo': 'Desde radicación de la factura'
    },
    
    'RESPUESTA_DEVOLUCION_PSS': {
        'dias_habiles': 5,
        'descripcion': 'Plazo para que el PSS responda a las devoluciones',
        'articulo': 'Artículo 11',
        'inicio_conteo': 'Desde notificación de la devolución'
    },
    
    'FORMULACION_GLOSAS': {
        'referencia': 'Artículo 57 Ley 1438 de 2011',
        'descripcion': 'Plazo para formular glosas según normativa general',
        'observacion': 'Sujeto a plazos contractuales específicos'
    },
    
    'RESPUESTA_GLOSAS_PSS': {
        'dias_habiles': 5,
        'descripcion': 'Plazo para que el PSS responda a las glosas',
        'articulo': 'Artículo 13',
        'inicio_conteo': 'Desde notificación de la glosa'
    },
    
    'PAGO_PRIMER_CINCUENTA_PORCIENTO': {
        'dias_habiles': 5,
        'descripcion': 'Plazo para pago del primer 50% en modalidad evento',
        'articulo': 'Artículo 15',
        'inicio_conteo': 'Después de la presentación de la cuenta',
        'modalidad': 'Pago por evento'
    }
}

# TIPOS DE SERVICIOS SEGÚN RIPS OFICIAL
TIPOS_SERVICIOS_RIPS = {
    'CONSULTAS': {
        'codigo_tipo': '01',
        'descripcion': 'Consultas médicas y de otros profesionales',
        'requiere_autorizacion_basica': False,
        'validaciones_principales': ['codigo_cups', 'diagnostico_principal', 'profesional']
    },
    
    'PROCEDIMIENTOS': {
        'codigo_tipo': '02',
        'descripcion': 'Procedimientos médicos, quirúrgicos y diagnósticos',
        'requiere_autorizacion_basica': True,
        'validaciones_principales': ['codigo_cups', 'diagnostico_principal', 'autorizacion', 'profesional']
    },
    
    'URGENCIAS': {
        'codigo_tipo': '03',
        'descripcion': 'Atenciones de urgencias',
        'requiere_autorizacion_basica': False,
        'validaciones_principales': ['causa_atencion', 'diagnostico_ingreso', 'diagnostico_egreso', 'condicion_egreso']
    },
    
    'HOSPITALIZACION': {
        'codigo_tipo': '04',
        'descripcion': 'Servicios de hospitalización',
        'requiere_autorizacion_basica': True,
        'validaciones_principales': ['via_ingreso', 'diagnostico_ingreso', 'diagnostico_egreso', 'estancia', 'condicion_egreso']
    },
    
    'OTROS_SERVICIOS': {
        'codigo_tipo': '05',
        'descripcion': 'Otros servicios (estancias, materiales, insumos)',
        'requiere_autorizacion_basica': True,
        'validaciones_principales': ['codigo_tecnologia', 'cantidad', 'valor_unitario']
    },
    
    'MEDICAMENTOS': {
        'codigo_tipo': '06',
        'descripcion': 'Medicamentos y dispositivos médicos',
        'requiere_autorizacion_basica': True,
        'validaciones_principales': ['codigo_cum', 'codigo_ium', 'prescripcion', 'cantidad', 'pos_no_pos']
    },
    
    'RECIEN_NACIDOS': {
        'codigo_tipo': '07',
        'descripcion': 'Atención de recién nacidos',
        'requiere_autorizacion_basica': False,
        'validaciones_principales': ['peso', 'edad_gestacional', 'diagnostico_principal', 'condicion_egreso']
    }
}

# CÓDIGOS DE DIAGNÓSTICO VÁLIDOS (CIE-10)
VALIDACIONES_DIAGNOSTICOS_CIE10 = {
    'LONGITUD_MINIMA': 3,
    'LONGITUD_MAXIMA': 7,
    'FORMATO_BASICO': 'A00-Z99',
    'CARACTERES_ESPECIALES_PERMITIDOS': ['.', '-'],
    'VALIDACION_ESTRUCTURA': 'Letra + números + punto decimal opcional + subdivisión'
}

# CONFIGURACIÓN DE AUDITORÍA AUTOMÁTICA
CONFIGURACION_AUDITORIA_AUTOMATICA = {
    'TOLERANCIA_VALORES': {
        'DIFERENCIA_TARIFARIA_MINIMA': 1.00,  # Pesos colombianos
        'PORCENTAJE_GLOSA_PARCIAL_CALIDAD': 0.3,  # 30% por glosas de calidad leves
        'PORCENTAJE_GLOSA_PARCIAL_PERTINENCIA': 0.5  # 50% por pertinencia cuestionable
    },
    
    'UMBRALES_ESCALAMIENTO': {
        'VALOR_ALTO_REVISION_MEDICA': 500000,  # Servicios > $500k requieren auditor médico
        'CANTIDAD_GLOSAS_ALTA_PRESTADOR': 10,  # > 10 glosas por factura = alerta
        'PORCENTAJE_GLOSAS_ALTO': 30  # > 30% valor glosado = revisión especial
    },
    
    'PRIORIDADES_AUDITORIA': {
        'ALTA': ['CL', 'CO', 'AU'],  # Categorías que requieren prioridad alta
        'MEDIA': ['TA', 'SO'],       # Categorías de prioridad media
        'BAJA': ['FA']               # Categorías de prioridad baja
    }
}

def obtener_causal_devolucion(codigo: str) -> dict:
    """
    Obtiene información completa de una causal de devolución oficial
    """
    return CAUSALES_DEVOLUCION_OFICIALES.get(codigo, {
        'error': f'Código de devolución {codigo} no existe en la Resolución 2284'
    })

def obtener_categoria_glosa(categoria: str) -> dict:
    """
    Obtiene información completa de una categoría de glosa oficial
    """
    return CAUSALES_GLOSA_OFICIALES.get(categoria, {
        'error': f'Categoría de glosa {categoria} no existe en la Resolución 2284'
    })

def obtener_subcausal_glosa(categoria: str, subcausal: str) -> dict:
    """
    Obtiene información específica de una subcausal de glosa
    """
    categoria_info = CAUSALES_GLOSA_OFICIALES.get(categoria, {})
    if 'subcausales' in categoria_info:
        return categoria_info['subcausales'].get(subcausal, {
            'error': f'Subcausal {subcausal} no existe en categoría {categoria}'
        })
    return {'error': f'Categoría {categoria} no encontrada'}

def validar_plazo_legal(tipo_plazo: str, fecha_inicio: str, fecha_actual: str = None) -> dict:
    """
    Valida si se cumple un plazo legal específico según la Resolución 2284
    """
    from datetime import datetime, timedelta
    
    if fecha_actual is None:
        fecha_actual = datetime.now().isoformat()
    
    plazo_info = PLAZOS_LEGALES_OFICIALES.get(tipo_plazo)
    if not plazo_info:
        return {'error': f'Tipo de plazo {tipo_plazo} no reconocido'}
    
    # Implementar cálculo de días hábiles
    # Esta es una implementación simplificada
    fecha_ini = datetime.fromisoformat(fecha_inicio.replace('T', ' ').replace('Z', ''))
    fecha_act = datetime.fromisoformat(fecha_actual.replace('T', ' ').replace('Z', ''))
    
    dias_transcurridos = (fecha_act - fecha_ini).days
    dias_limite = plazo_info.get('dias_habiles', 0)
    
    return {
        'plazo_cumplido': dias_transcurridos <= dias_limite,
        'dias_transcurridos': dias_transcurridos,
        'dias_limite': dias_limite,
        'fecha_limite': (fecha_ini + timedelta(days=dias_limite)).isoformat(),
        'plazo_info': plazo_info
    }

def generar_codigo_glosa_automatico(categoria: str, subcausal: str) -> str:
    """
    Genera código de glosa automático según la estructura oficial
    """
    if categoria in CAUSALES_GLOSA_OFICIALES and subcausal:
        return f"{categoria}{subcausal}"
    return f"{categoria}01"  # Código por defecto si no se especifica subcausal