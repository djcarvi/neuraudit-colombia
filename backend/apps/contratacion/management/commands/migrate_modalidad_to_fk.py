# -*- coding: utf-8 -*-
"""
Comando para migrar los datos de modalidad_principal de CharField a ForeignKey
Mantiene enfoque NoSQL usando referencias de ObjectId
"""

from django.core.management.base import BaseCommand
from apps.contratacion.models import Contrato, ModalidadPago
from django.db import transaction


class Command(BaseCommand):
    help = 'Migra datos de modalidad_principal de string a referencia ObjectId'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Iniciando migración de modalidades...'))
        
        # Mapeo de valores antiguos a códigos de ModalidadPago
        mapeo_modalidades = {
            'EVENTO': 'EVENTO',
            'CAPITACION': 'CAPITACION',
            'PGP': 'PGP',
            'PAQUETE': 'PAQUETE',
        }
        
        # Cargar todas las modalidades en memoria (enfoque NoSQL)
        modalidades_dict = {}
        for modalidad in ModalidadPago.objects.all():
            modalidades_dict[modalidad.codigo] = modalidad
            self.stdout.write(f"Modalidad cargada: {modalidad.codigo} - {modalidad.nombre}")
        
        # Procesar contratos
        contratos_actualizados = 0
        contratos_error = 0
        
        # Obtener todos los contratos que tienen modalidad_principal como string
        # Nota: En MongoDB, podemos tener campos mixtos temporalmente
        contratos = Contrato.objects.all()
        
        with transaction.atomic():
            for contrato in contratos:
                try:
                    # Verificar si modalidad_principal es un string
                    if isinstance(contrato.modalidad_principal, str):
                        codigo_modalidad = mapeo_modalidades.get(
                            contrato.modalidad_principal, 
                            contrato.modalidad_principal
                        )
                        
                        if codigo_modalidad in modalidades_dict:
                            # Asignar la referencia al objeto ModalidadPago
                            contrato.modalidad_principal = modalidades_dict[codigo_modalidad]
                            contrato.save()
                            contratos_actualizados += 1
                            self.stdout.write(
                                self.style.SUCCESS(
                                    f'Contrato {contrato.numero_contrato}: '
                                    f'{codigo_modalidad} → {modalidades_dict[codigo_modalidad].nombre}'
                                )
                            )
                        else:
                            contratos_error += 1
                            self.stdout.write(
                                self.style.ERROR(
                                    f'Contrato {contrato.numero_contrato}: '
                                    f'Modalidad "{contrato.modalidad_principal}" no encontrada'
                                )
                            )
                    else:
                        # Ya es una referencia, no hacer nada
                        self.stdout.write(
                            f'Contrato {contrato.numero_contrato} ya migrado'
                        )
                        
                except Exception as e:
                    contratos_error += 1
                    self.stdout.write(
                        self.style.ERROR(
                            f'Error en contrato {contrato.numero_contrato}: {str(e)}'
                        )
                    )
        
        # Resumen
        self.stdout.write(
            self.style.SUCCESS(
                f'\nMigración completada:'
                f'\n- Contratos actualizados: {contratos_actualizados}'
                f'\n- Contratos con error: {contratos_error}'
                f'\n- Total modalidades disponibles: {len(modalidades_dict)}'
            )
        )
        
        # Verificación NoSQL: mostrar estructura de un contrato
        if contratos_actualizados > 0:
            contrato_ejemplo = Contrato.objects.first()
            self.stdout.write(
                self.style.WARNING(
                    f'\nEjemplo de estructura NoSQL:'
                    f'\n- Contrato ID: {contrato_ejemplo.id}'
                    f'\n- Modalidad ID: {contrato_ejemplo.modalidad_principal.id}'
                    f'\n- Modalidad Código: {contrato_ejemplo.modalidad_principal.codigo}'
                )
            )