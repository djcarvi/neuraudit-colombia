# -*- coding: utf-8 -*-
"""
Comando para cargar códigos de glosas y devoluciones según Resolución 2284 de 2023
"""

from django.core.management.base import BaseCommand
from datetime import date
from apps.contratacion.models_codigos import CodigoGlosa, CodigoDevolucion


class Command(BaseCommand):
    help = 'Carga los códigos de glosas y devoluciones según Resolución 2284'

    def handle(self, *args, **options):
        self.cargar_codigos_glosas()
        self.cargar_codigos_devolucion()
    
    def cargar_codigos_glosas(self):
        """Carga los códigos de glosas según Resolución 2284"""
        
        glosas = [
            # FACTURACIÓN (FA)
            {
                'codigo': 'FA01',
                'categoria': 'FA',
                'categoria_nombre': 'Facturación',
                'nombre': 'Diferencias en cantidades',
                'descripcion': 'Diferencias entre las cantidades facturadas versus las autorizadas o prestadas'
            },
            {
                'codigo': 'FA02',
                'categoria': 'FA',
                'categoria_nombre': 'Facturación',
                'nombre': 'Diferencias en valores unitarios',
                'descripcion': 'Los valores unitarios facturados no corresponden con los contratados'
            },
            {
                'codigo': 'FA03',
                'categoria': 'FA',
                'categoria_nombre': 'Facturación',
                'nombre': 'Códigos incorrectos',
                'descripcion': 'Códigos CUPS, CUM o IUM facturados incorrectamente'
            },
            {
                'codigo': 'FA04',
                'categoria': 'FA',
                'categoria_nombre': 'Facturación',
                'nombre': 'Duplicidad en facturación',
                'descripcion': 'Servicio o medicamento facturado más de una vez'
            },
            
            # TARIFAS (TA)
            {
                'codigo': 'TA01',
                'categoria': 'TA',
                'categoria_nombre': 'Tarifas',
                'nombre': 'Valores superiores a los pactados',
                'descripcion': 'Los valores facturados exceden los valores contratados'
            },
            {
                'codigo': 'TA02',
                'categoria': 'TA',
                'categoria_nombre': 'Tarifas',
                'nombre': 'Manual tarifario incorrecto',
                'descripcion': 'Se aplicó un manual tarifario diferente al contratado'
            },
            {
                'codigo': 'TA03',
                'categoria': 'TA',
                'categoria_nombre': 'Tarifas',
                'nombre': 'Porcentaje de negociación incorrecto',
                'descripcion': 'No se aplicó el porcentaje de negociación contractual'
            },
            
            # SOPORTES (SO)
            {
                'codigo': 'SO01',
                'categoria': 'SO',
                'categoria_nombre': 'Soportes',
                'nombre': 'Ausencia de historia clínica',
                'descripcion': 'No se adjuntó la historia clínica o está incompleta'
            },
            {
                'codigo': 'SO02',
                'categoria': 'SO',
                'categoria_nombre': 'Soportes',
                'nombre': 'Ausencia de órdenes médicas',
                'descripcion': 'No se adjuntaron las órdenes médicas requeridas'
            },
            {
                'codigo': 'SO03',
                'categoria': 'SO',
                'categoria_nombre': 'Soportes',
                'nombre': 'Inconsistencia en soportes',
                'descripcion': 'Los soportes presentan inconsistencias con lo facturado'
            },
            {
                'codigo': 'SO04',
                'categoria': 'SO',
                'categoria_nombre': 'Soportes',
                'nombre': 'Falta epicrisis',
                'descripcion': 'No se adjuntó epicrisis para servicios de hospitalización'
            },
            
            # AUTORIZACIONES (AU)
            {
                'codigo': 'AU01',
                'categoria': 'AU',
                'categoria_nombre': 'Autorizaciones',
                'nombre': 'Servicio sin autorización previa',
                'descripcion': 'Servicio que requiere autorización previa fue prestado sin ella'
            },
            {
                'codigo': 'AU02',
                'categoria': 'AU',
                'categoria_nombre': 'Autorizaciones',
                'nombre': 'Autorización vencida',
                'descripcion': 'La autorización estaba vencida al momento de prestar el servicio'
            },
            {
                'codigo': 'AU03',
                'categoria': 'AU',
                'categoria_nombre': 'Autorizaciones',
                'nombre': 'Servicio excede lo autorizado',
                'descripcion': 'Se prestaron más servicios de los autorizados'
            },
            
            # COBERTURA (CO)
            {
                'codigo': 'CO01',
                'categoria': 'CO',
                'categoria_nombre': 'Cobertura',
                'nombre': 'Servicio no incluido en PBS',
                'descripcion': 'Servicio o medicamento no está incluido en el Plan de Beneficios'
            },
            {
                'codigo': 'CO02',
                'categoria': 'CO',
                'categoria_nombre': 'Cobertura',
                'nombre': 'Exclusión contractual',
                'descripcion': 'Servicio excluido expresamente en el contrato'
            },
            {
                'codigo': 'CO03',
                'categoria': 'CO',
                'categoria_nombre': 'Cobertura',
                'nombre': 'No corresponde al plan del afiliado',
                'descripcion': 'El servicio no está cubierto por el plan del afiliado'
            },
            
            # CALIDAD (CL)
            {
                'codigo': 'CL01',
                'categoria': 'CL',
                'categoria_nombre': 'Calidad',
                'nombre': 'Servicio no pertinente',
                'descripcion': 'El servicio no es pertinente para la patología diagnosticada'
            },
            {
                'codigo': 'CL02',
                'categoria': 'CL',
                'categoria_nombre': 'Calidad',
                'nombre': 'Sobreutilización de servicios',
                'descripcion': 'Utilización excesiva de servicios para el diagnóstico'
            },
            {
                'codigo': 'CL03',
                'categoria': 'CL',
                'categoria_nombre': 'Calidad',
                'nombre': 'No cumple guías de práctica clínica',
                'descripcion': 'El tratamiento no sigue las guías de práctica clínica establecidas'
            },
            
            # SEGUIMIENTO DE ACUERDOS (SA)
            {
                'codigo': 'SA01',
                'categoria': 'SA',
                'categoria_nombre': 'Seguimiento de Acuerdos',
                'nombre': 'Incumplimiento indicadores de calidad',
                'descripcion': 'No se cumplieron los indicadores de calidad pactados'
            },
            {
                'codigo': 'SA02',
                'categoria': 'SA',
                'categoria_nombre': 'Seguimiento de Acuerdos',
                'nombre': 'Incumplimiento metas de gestión',
                'descripcion': 'No se alcanzaron las metas de gestión acordadas'
            }
        ]
        
        created_count = 0
        updated_count = 0
        
        for glosa_data in glosas:
            glosa_data['fecha_vigencia'] = date.today()
            glosa_data['activo'] = True
            
            glosa, created = CodigoGlosa.objects.update_or_create(
                codigo=glosa_data['codigo'],
                defaults=glosa_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Creado código glosa: {glosa.codigo} - {glosa.nombre}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Actualizado código glosa: {glosa.codigo}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nCódigos de glosas: {created_count} creados, {updated_count} actualizados.'
            )
        )
    
    def cargar_codigos_devolucion(self):
        """Carga los códigos de devolución según Resolución 2284"""
        
        devoluciones = [
            {
                'codigo': 'DE16',
                'nombre': 'Persona corresponde a otro responsable de pago',
                'descripcion': 'La persona atendida corresponde a otro responsable de pago (otra EPS, ARL, SOAT, etc.)',
                'tipo_causal': 'ASEGURAMIENTO',
                'documentos_requeridos': 'Certificación de afiliación actualizada, soportes del responsable real del pago',
                'plazo_respuesta_dias': 5
            },
            {
                'codigo': 'DE44',
                'nombre': 'Prestador no hace parte de la red integral',
                'descripcion': 'El prestador no está contratado o no hace parte de la red integral de servicios',
                'tipo_causal': 'CONTRACTUAL',
                'documentos_requeridos': 'Copia del contrato vigente, autorización especial si aplica',
                'plazo_respuesta_dias': 5
            },
            {
                'codigo': 'DE50',
                'nombre': 'Factura ya pagada o en trámite de pago',
                'descripcion': 'La factura ya fue pagada previamente o se encuentra en proceso de pago',
                'tipo_causal': 'ADMINISTRATIVA',
                'documentos_requeridos': 'Certificación de no pago, extractos bancarios',
                'plazo_respuesta_dias': 5
            },
            {
                'codigo': 'DE56',
                'nombre': 'No radicación de soportes dentro de los 22 días hábiles',
                'descripcion': 'Los soportes no fueron radicados dentro de los 22 días hábiles establecidos en la normativa',
                'tipo_causal': 'NORMATIVA',
                'documentos_requeridos': 'Justificación del retraso, soportes completos',
                'plazo_respuesta_dias': 5
            }
        ]
        
        created_count = 0
        updated_count = 0
        
        for devolucion_data in devoluciones:
            devolucion_data['fecha_vigencia'] = date.today()
            devolucion_data['activo'] = True
            
            devolucion, created = CodigoDevolucion.objects.update_or_create(
                codigo=devolucion_data['codigo'],
                defaults=devolucion_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Creado código devolución: {devolucion.codigo} - {devolucion.nombre}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Actualizado código devolución: {devolucion.codigo}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nCódigos de devolución: {created_count} creados, {updated_count} actualizados.'
            )
        )