"""
Comando para migrar datos existentes de medicamentos y otros servicios 
de valorTotalTecnologia a vrServicio
"""
from django.core.management.base import BaseCommand
from apps.radicacion.models_rips_oficial import RIPSTransaccion


class Command(BaseCommand):
    help = 'Migra medicamentos y otros servicios de valorTotalTecnologia a vrServicio'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando migración de vrServicio...')
        
        total_transacciones = 0
        total_medicamentos = 0
        total_otros_servicios = 0
        
        for rips in RIPSTransaccion.objects.all():
            if not rips.usuarios:
                continue
                
            transaccion_modificada = False
            
            for usuario in rips.usuarios:
                if not usuario.servicios:
                    continue
                    
                # Migrar medicamentos
                if usuario.servicios.medicamentos:
                    for medicamento in usuario.servicios.medicamentos:
                        if hasattr(medicamento, 'valorTotalTecnologia') and not hasattr(medicamento, 'vrServicio'):
                            medicamento.vrServicio = medicamento.valorTotalTecnologia
                            total_medicamentos += 1
                            transaccion_modificada = True
                            
                # Migrar otros servicios
                if usuario.servicios.otrosServicios:
                    for servicio in usuario.servicios.otrosServicios:
                        if hasattr(servicio, 'valorTotalTecnologia') and not hasattr(servicio, 'vrServicio'):
                            servicio.vrServicio = servicio.valorTotalTecnologia
                            total_otros_servicios += 1
                            transaccion_modificada = True
            
            if transaccion_modificada:
                rips.save()
                total_transacciones += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Migración completada:\n'
                f'  - Transacciones modificadas: {total_transacciones}\n'
                f'  - Medicamentos migrados: {total_medicamentos}\n'
                f'  - Otros servicios migrados: {total_otros_servicios}'
            )
        )