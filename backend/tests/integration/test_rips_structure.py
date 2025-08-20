#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para validar estructura RIPS según MinSalud
"""

import json
import sys

def analizar_rips_json(archivo_path):
    """
    Analiza estructura del archivo RIPS JSON
    """
    print(f'🚀 Analizando archivo RIPS: {archivo_path}')
    
    try:
        with open(archivo_path, 'r', encoding='utf-8') as f:
            rips_data = json.load(f)
    except FileNotFoundError:
        print(f'❌ Archivo no encontrado: {archivo_path}')
        return
    except json.JSONDecodeError as e:
        print(f'❌ Error JSON: {str(e)}')
        return
    
    # Validar estructura oficial MinSalud
    print('\n📋 VALIDANDO ESTRUCTURA OFICIAL MINSALUD:')
    
    # Verificar nivel transacción
    campos_transaccion = ['numDocumentoIdObligado', 'numFactura', 'usuarios']
    for campo in campos_transaccion:
        presente = '✅' if campo in rips_data else '❌'
        print(f'  {presente} {campo}: {rips_data.get(campo, "NO PRESENTE")}')
    
    if 'usuarios' not in rips_data:
        print('❌ Estructura inválida: falta array "usuarios"')
        return
    
    usuarios = rips_data.get('usuarios', [])
    total_usuarios = len(usuarios)
    print(f'\n👥 Total usuarios: {total_usuarios}')
    
    # Analizar servicios por tipo
    estadisticas = {
        'consultas': 0,
        'procedimientos': 0,
        'urgencias': 0,
        'hospitalizacion': 0,
        'otrosServicios': 0,
        'recienNacidos': 0,
        'medicamentos': 0,
        'suministros': 0,
        'total_servicios': 0
    }
    
    print('\n📊 ANÁLISIS DE SERVICIOS POR USUARIO:')
    
    for i, usuario in enumerate(usuarios):
        print(f'\n👤 Usuario {i+1}:')
        print(f'  📄 Documento: {usuario.get("tipoDocumentoIdentificacion")} {usuario.get("numDocumentoIdentificacion")}')
        
        servicios = usuario.get('servicios', {})
        print(f'  🏥 Servicios encontrados: {list(servicios.keys())}')
        
        for tipo_servicio in estadisticas.keys():
            if tipo_servicio == 'total_servicios':
                continue
                
            servicios_tipo = servicios.get(tipo_servicio, [])
            if isinstance(servicios_tipo, list) and servicios_tipo:
                cantidad = len(servicios_tipo)
                estadisticas[tipo_servicio] += cantidad
                estadisticas['total_servicios'] += cantidad
                print(f'    🔸 {tipo_servicio}: {cantidad}')
    
    # Mostrar estadísticas finales
    print('\n🎯 ESTADÍSTICAS FINALES:')
    emojis = {
        'consultas': '🩺',
        'procedimientos': '⚕️',
        'urgencias': '🚨',
        'hospitalizacion': '🏥',
        'otrosServicios': '🔧',
        'recienNacidos': '👶',
        'medicamentos': '💊',
        'suministros': '📦'
    }
    
    for tipo, cantidad in estadisticas.items():
        if cantidad > 0 and tipo != 'total_servicios':
            emoji = emojis.get(tipo, '📋')
            print(f'  {emoji} {tipo}: {cantidad:,}')
    
    print(f'\n🎯 TOTAL SERVICIOS: {estadisticas["total_servicios"]:,}')
    
    # Mostrar muestra de un procedimiento
    if estadisticas['procedimientos'] > 0:
        print('\n📋 MUESTRA PROCEDIMIENTO:')
        for usuario in usuarios:
            procedimientos = usuario.get('servicios', {}).get('procedimientos', [])
            if procedimientos:
                proc = procedimientos[0]  # Primer procedimiento
                campos_importantes = [
                    'codPrestador', 'fechaInicioAtencion', 'codProcedimiento',
                    'codDiagnosticoPrincipal', 'vrServicio', 'numAutorizacion'
                ]
                for campo in campos_importantes:
                    valor = proc.get(campo, 'NO PRESENTE')
                    print(f'  🔸 {campo}: {valor}')
                break
    
    print('\n✅ Análisis completado')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Uso: python3 test_rips_structure.py <archivo_rips.json>')
        sys.exit(1)
    
    archivo = sys.argv[1]
    analizar_rips_json(archivo)