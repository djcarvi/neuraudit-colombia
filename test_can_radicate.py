#!/usr/bin/env python
"""
Script para verificar que can_radicate funcione correctamente
"""

from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.neuraudit_colombia_db

print("=" * 80)
print("VERIFICACIÓN DE can_radicate PARA USUARIOS PSS")
print("=" * 80)

# Usuarios PSS que deben poder radicar
usuarios_pss = [
    'radicador.sanrafael',
    'admin.sanrafael', 
    'radicador.hcentral'
]

print("\n1. ESTADO ACTUAL DE can_radicate:")
print("-" * 50)

for username in usuarios_pss:
    user = db.usuarios_sistema.find_one({'username': username})
    if user:
        can_radicate = user.get('can_radicate', False)
        perfil = user.get('perfil', 'NO DEFINIDO')
        nit = user.get('datos_pss', {}).get('nit', 'NO DEFINIDO')
        
        print(f"\n{username}:")
        print(f"  - Perfil: {perfil}")
        print(f"  - NIT: {nit}")
        print(f"  - can_radicate: {can_radicate} {'✓' if can_radicate else '✗'}")
        
        # Verificar si necesita corrección
        if perfil in ['RADICADOR', 'ADMINISTRADOR_PSS'] and not can_radicate:
            print(f"  ⚠️  NECESITA CORRECCIÓN: Usuario con perfil {perfil} debe tener can_radicate=True")
    else:
        print(f"\n{username}: NO ENCONTRADO ✗")

print("\n\n2. VERIFICACIÓN DE ESTRUCTURA PARA RADICAR:")
print("-" * 50)

# Verificar que tengan todos los campos necesarios para radicar
campos_necesarios = ['username', 'email', 'password_hash', 'tipo_usuario', 'perfil', 'datos_pss']

for username in usuarios_pss:
    user = db.usuarios_sistema.find_one({'username': username})
    if user:
        print(f"\n{username}:")
        todos_campos = True
        for campo in campos_necesarios:
            existe = campo in user
            print(f"  - {campo}: {'✓' if existe else '✗ FALTA'}")
            if not existe:
                todos_campos = False
        
        # Verificar datos_pss específicamente
        if 'datos_pss' in user:
            datos_pss = user['datos_pss']
            print(f"  - datos_pss.nit: {'✓' if 'nit' in datos_pss else '✗ FALTA'}")
            print(f"  - datos_pss.razon_social: {'✓' if 'razon_social' in datos_pss else '✗ FALTA'}")
        
        if todos_campos and user.get('can_radicate'):
            print(f"  ✓ LISTO PARA RADICAR")
        else:
            print(f"  ✗ FALTAN REQUISITOS")

print("\n\n3. RESUMEN:")
print("-" * 50)
total_usuarios = len(usuarios_pss)
usuarios_ok = db.usuarios_sistema.count_documents({
    'username': {'$in': usuarios_pss},
    'can_radicate': True
})

print(f"Total usuarios PSS verificados: {total_usuarios}")
print(f"Usuarios con can_radicate=True: {usuarios_ok}")
print(f"Usuarios pendientes: {total_usuarios - usuarios_ok}")

if usuarios_ok == total_usuarios:
    print("\n✓ TODOS LOS USUARIOS PSS ESTÁN CONFIGURADOS CORRECTAMENTE")
else:
    print("\n✗ HAY USUARIOS PSS QUE NECESITAN CONFIGURACIÓN")