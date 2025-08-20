from apps.radicacion.models import RadicacionCuentaMedica
from apps.authentication.models import User

# Contar radicaciones
count = RadicacionCuentaMedica.objects.count()
print(f"Total de radicaciones en MongoDB: {count}")

# Listar todas las radicaciones
radicaciones = RadicacionCuentaMedica.objects.all()
for rad in radicaciones:
    print(f"- Radicado: {rad.numero_radicado}, Estado: {rad.estado}, Fecha: {rad.created_at}, PSS: {rad.pss_nombre}")

# Verificar usuarios
users = User.objects.all()
print(f"\nUsuarios en el sistema: {users.count()}")
for user in users:
    print(f"- {user.username} ({user.role})")