# -*- coding: utf-8 -*-
"""
Comando para inspeccionar las colecciones relacionadas con el dashboard
y verificar la estructura de datos existente
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.radicacion.models import RadicacionCuentaMedica
from apps.radicacion.models_auditoria import PreGlosa, GlosaOficial, AsignacionAuditoria
from apps.auditoria.models_glosas import GlosaAplicada
from apps.auditoria.models_facturas import FacturaRadicada, ServicioFacturado
from apps.conciliacion.models import CasoConciliacion
from apps.trazabilidad.models import RegistroTrazabilidad
from apps.authentication.models import User
import json
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Inspecciona las colecciones MongoDB para el dashboard'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔍 Inspeccionando colecciones MongoDB para Dashboard...'))
        
        # 1. Radicaciones
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('📋 RADICACIONES'))
        radicaciones = RadicacionCuentaMedica.objects.all()
        self.stdout.write(f'Total radicaciones: {radicaciones.count()}')
        
        # Estados de radicaciones
        estados = {}
        for rad in radicaciones:
            estado = rad.estado
            if estado not in estados:
                estados[estado] = 0
            estados[estado] += 1
        
        self.stdout.write('Estados:')
        for estado, count in estados.items():
            self.stdout.write(f'  - {estado}: {count}')
        
        # Prestadores únicos
        prestadores = {}
        for rad in radicaciones:
            nit = rad.pss_nit
            if nit not in prestadores:
                prestadores[nit] = {
                    'nombre': rad.pss_nombre,
                    'count': 0,
                    'valor_total': 0
                }
            prestadores[nit]['count'] += 1
            prestadores[nit]['valor_total'] += float(rad.factura_valor_total or 0)
        
        self.stdout.write(f'\nPrestadores únicos: {len(prestadores)}')
        for nit, data in sorted(prestadores.items(), key=lambda x: x[1]['valor_total'], reverse=True)[:5]:
            self.stdout.write(f'  - {data["nombre"]} (NIT: {nit})')
            self.stdout.write(f'    Radicaciones: {data["count"]}, Valor: ${data["valor_total"]:,.0f}')
        
        # 2. Usuarios auditores
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('👥 USUARIOS AUDITORES'))
        auditores = User.objects.filter(role__in=['AUDITOR_MEDICO', 'AUDITOR_ADMINISTRATIVO'])
        self.stdout.write(f'Total auditores: {auditores.count()}')
        for auditor in auditores:
            # Usar username si no tiene first_name/last_name
            nombre = f"{auditor.first_name} {auditor.last_name}".strip() or auditor.username
            self.stdout.write(f'  - {nombre} ({auditor.role})')
        
        # 3. Glosas aplicadas
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('🚨 GLOSAS APLICADAS'))
        try:
            glosas = GlosaAplicada.objects.all()
            self.stdout.write(f'Total glosas aplicadas: {glosas.count()}')
            
            # Tipos de glosa
            tipos_glosa = {}
            for glosa in glosas:
                tipo = glosa.tipo_glosa
                if tipo not in tipos_glosa:
                    tipos_glosa[tipo] = 0
                tipos_glosa[tipo] += 1
            
            self.stdout.write('Tipos de glosa:')
            for tipo, count in tipos_glosa.items():
                self.stdout.write(f'  - {tipo}: {count}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al consultar glosas: {e}'))
        
        # 4. Facturas en auditoría
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('📄 FACTURAS EN AUDITORÍA'))
        try:
            facturas = FacturaRadicada.objects.all()
            self.stdout.write(f'Total facturas: {facturas.count()}')
            
            # Servicios facturados
            servicios = ServicioFacturado.objects.all()
            self.stdout.write(f'Total servicios: {servicios.count()}')
            
            # Tipos de servicio
            tipos_servicio = {}
            for servicio in servicios:
                tipo = servicio.tipo_servicio
                if tipo not in tipos_servicio:
                    tipos_servicio[tipo] = 0
                tipos_servicio[tipo] += 1
            
            if tipos_servicio:
                self.stdout.write('Tipos de servicio:')
                for tipo, count in tipos_servicio.items():
                    self.stdout.write(f'  - {tipo}: {count}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al consultar facturas: {e}'))
        
        # 5. Casos de conciliación
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('🤝 CASOS DE CONCILIACIÓN'))
        try:
            casos = CasoConciliacion.objects.all()
            self.stdout.write(f'Total casos: {casos.count()}')
            
            # Estados de casos
            estados_caso = {}
            for caso in casos:
                estado = caso.estado
                if estado not in estados_caso:
                    estados_caso[estado] = 0
                estados_caso[estado] += 1
            
            if estados_caso:
                self.stdout.write('Estados:')
                for estado, count in estados_caso.items():
                    self.stdout.write(f'  - {estado}: {count}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al consultar casos de conciliación: {e}'))
        
        # 6. Trazabilidad
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('📊 TRAZABILIDAD'))
        try:
            trazas = RegistroTrazabilidad.objects.all()
            self.stdout.write(f'Total registros: {trazas.count()}')
            
            # Tipos de acción
            tipos_accion = {}
            for traza in trazas[:100]:  # Solo primeros 100 para no demorar
                accion = traza.accion
                if accion not in tipos_accion:
                    tipos_accion[accion] = 0
                tipos_accion[accion] += 1
            
            if tipos_accion:
                self.stdout.write('Tipos de acción (muestra):')
                for accion, count in tipos_accion.items():
                    self.stdout.write(f'  - {accion}: {count}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al consultar trazabilidad: {e}'))
        
        # 7. Resumen de lo que falta
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('📈 RESUMEN DE DATOS FALTANTES PARA EL DASHBOARD:'))
        
        if auditores.count() == 0:
            self.stdout.write('❌ No hay usuarios auditores - necesario para "Visitors by Device"')
        else:
            self.stdout.write('✅ Usuarios auditores encontrados')
        
        # Verificar glosas de manera segura
        try:
            glosas_count = GlosaAplicada.objects.count()
            if glosas_count == 0:
                self.stdout.write('❌ No hay glosas aplicadas - necesario para "Top Auditores Glosas"')
            else:
                self.stdout.write('✅ Glosas aplicadas encontradas')
        except:
            self.stdout.write('❌ No hay glosas aplicadas - necesario para "Top Auditores Glosas"')
        
        # Verificar servicios de manera segura
        try:
            servicios_count = ServicioFacturado.objects.count()
            if servicios_count == 0:
                self.stdout.write('❌ No hay servicios facturados - necesario para "Top Servicios Radicados"')
            else:
                self.stdout.write('✅ Servicios facturados encontrados')
        except:
            self.stdout.write('❌ No hay servicios facturados - necesario para "Top Servicios Radicados"')
        
        # Verificar casos de manera segura
        try:
            casos_count = CasoConciliacion.objects.count()
            if casos_count == 0:
                self.stdout.write('❌ No hay casos de conciliación - necesario para "Conciliaciones recientes"')
            else:
                self.stdout.write('✅ Casos de conciliación encontrados')
        except:
            self.stdout.write('❌ No hay casos de conciliación - necesario para "Conciliaciones recientes"')
        
        # Verificar trazabilidad de manera segura
        try:
            trazas_count = RegistroTrazabilidad.objects.count()
            if trazas_count == 0:
                self.stdout.write('❌ No hay registros de trazabilidad - necesario para "Actividad Reciente"')
            else:
                self.stdout.write('✅ Registros de trazabilidad encontrados')
        except:
            self.stdout.write('❌ No hay registros de trazabilidad - necesario para "Actividad Reciente"')
        
        self.stdout.write('\n' + self.style.SUCCESS('✅ Inspección completada'))