import os
import sys
sys.path.insert(0, '/home/adrian_carvajal/Analí®/neuraudit_react/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.authentication.models import User

print("=== USUARIOS PSS EN EL SISTEMA ===")
pss_users = User.objects.filter(user_type='PSS')
print(f"Total usuarios PSS: {pss_users.count()}")

for u in pss_users:
    print(f"\n- Username: {u.username}")
    print(f"  Email: {u.email}")
    print(f"  NIT: {u.nit}")
    print(f"  Active: {u.is_active}")
    print(f"  Status: {u.status}")

print("\n=== VERIFICANDO USUARIO test.pss ===")
test_user = User.objects.filter(username='test.pss').first()
if test_user:
    print(f"✓ Usuario encontrado")
    print(f"  User type: {test_user.user_type}")
    print(f"  NIT: {test_user.nit}")
else:
    print("✗ Usuario test.pss NO encontrado")

print("\n=== CREANDO/ACTUALIZANDO USUARIO DE PRUEBA ===")
# Crear o actualizar el usuario test.pss
test_user, created = User.objects.update_or_create(
    username='test.pss',
    defaults={
        'email': 'test.pss@neuraudit.com',
        'first_name': 'Test',
        'last_name': 'PSS',
        'user_type': 'PSS',
        'role': 'RADICADOR',
        'status': 'AC',
        'nit': '123456789-0',
        'is_active': True
    }
)

if created:
    test_user.set_password('simple123')
    test_user.save()
    print("✓ Usuario creado exitosamente")
else:
    print("✓ Usuario actualizado exitosamente")

print(f"  Username: {test_user.username}")
print(f"  NIT: {test_user.nit}")
print(f"  Email: {test_user.email}")