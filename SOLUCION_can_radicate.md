# SOLUCIÓN: AttributeError 'can_radicate'

## Problema
```
AttributeError: 'RobustNeurAuditUser' object has no attribute 'can_radicate'
```

## Causa
El sistema robusto de autenticación usa MongoDB directamente (colección `usuarios_sistema`) en lugar del ORM de Django. Había un desajuste entre la estructura de datos esperada y la real.

## Solución Implementada

### 1. Actualización en MongoDB
Se agregó `can_radicate: true` a los siguientes usuarios PSS en la colección `usuarios_sistema`:
- radicador.sanrafael
- admin.sanrafael  
- radicador.hcentral

### 2. Middleware Personalizado
Creado: `/home/adrian_carvajal/Analí®/neuraudit/backend/apps/authentication/middleware.py`

```python
class UserCanRadicateMiddleware:
    """
    Agrega dinámicamente el atributo can_radicate desde MongoDB
    """
    def __call__(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Buscar en MongoDB directamente
            user_data = self.db.usuarios_sistema.find_one({'username': request.user.username})
            if user_data:
                request.user.can_radicate = user_data.get('can_radicate', False)
```

### 3. Configuración en Django
Agregado a `MIDDLEWARE` en `/home/adrian_carvajal/Analí®/neuraudit/backend/config/settings.py`:
```python
MIDDLEWARE = [
    # ... otros middleware ...
    'apps.authentication.middleware.UserCanRadicateMiddleware',
]
```

## Resultado
- Los usuarios PSS ahora tienen `can_radicate=True` en MongoDB
- El middleware agrega el atributo dinámicamente cuando se autentican
- No se modificó el sistema robusto de autenticación NoSQL
- El error de AttributeError debe estar resuelto

## Verificación
Para verificar que funciona correctamente:
1. Reiniciar el servidor Django
2. Hacer login con uno de los usuarios PSS
3. Intentar radicar una cuenta médica