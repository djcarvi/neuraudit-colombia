# 🔐 Configuración de Google OAuth para NeurAudit Colombia

## 📋 Instrucciones de Configuración

### 1. **Configurar en Google Cloud Console**

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Habilitar la API de Google+ (Google+ API)
4. Ir a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth"
5. Seleccionar "Aplicación web"
6. Configurar:
   - **Nombre**: NeurAudit Colombia
   - **URIs de JavaScript autorizados**:
     - `http://localhost:3000` (desarrollo)
     - `https://neuraudit.epsfamiliar.com.co` (producción)
   - **URIs de redirección autorizados**:
     - `http://localhost:3000/auth/google/callback`
     - `https://neuraudit.epsfamiliar.com.co/auth/google/callback`

### 2. **Configurar Variables de Entorno**

Crear o editar el archivo `.env` en el backend:

```bash
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=tu-client-secret-aqui
```

### 3. **Instalar Librerías**

```bash
cd /home/adrian_carvajal/Analí®/neuraudit_react/backend
source venv/bin/activate
pip install -r requirements.txt
```

### 4. **Configurar Dominios Permitidos** (Opcional)

Editar `/backend/config/google_oauth_settings.py`:

```python
'ALLOWED_DOMAINS': [
    'epsfamiliar.com.co',
    'analiticaneuronal.com',
    # Agregar más dominios corporativos aquí
],
```

## 🚀 Uso en el Frontend

### Implementación con React

```javascript
// Instalar la librería de Google
npm install @react-oauth/google

// En tu componente de login
import { GoogleLogin } from '@react-oauth/google';

const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const response = await fetch('http://localhost:8003/api/auth/google-login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                google_token: credentialResponse.credential
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar tokens
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            // Redirigir al dashboard
            window.location.href = '/dashboard';
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error en login:', error);
    }
};

// En el render
<GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => console.log('Login Failed')}
    useOneTap
/>
```

## 📊 Flujo de Autenticación

1. **Usuario hace clic** en "Iniciar sesión con Google"
2. **Google autentica** al usuario y retorna un ID token
3. **Frontend envía** el token a `/api/auth/google-login/`
4. **Backend verifica** el token con Google
5. **Backend crea o actualiza** el usuario en MongoDB
6. **Backend retorna** tokens JWT (access + refresh)
7. **Frontend almacena** tokens y redirige

## 🔒 Seguridad

### Características Implementadas:
- ✅ Verificación del token con Google
- ✅ Validación del dominio del email (configurable)
- ✅ Creación automática de usuarios con rol por defecto
- ✅ Integración con sistema JWT existente
- ✅ Auditoría completa de accesos OAuth
- ✅ Sin contraseña para usuarios OAuth

### Usuarios Creados por Google OAuth:
- **Tipo**: EPS (por defecto)
- **Rol**: AUDITOR_MEDICO (por defecto)
- **Estado**: Activo
- **Username**: Generado desde email (único)
- **Sin NIT**: Usuarios OAuth no requieren NIT

## 🛠️ Solución de Problemas

### Error: "Token de Google inválido"
- Verificar que el CLIENT_ID sea correcto
- Confirmar que el token no haya expirado
- Revisar la consola del navegador

### Error: "Dominio no autorizado"
- Agregar el dominio en `ALLOWED_DOMAINS`
- O habilitar `ALLOW_ANY_DOMAIN` en desarrollo

### Error: "Librerías no instaladas"
- Ejecutar: `pip install -r requirements.txt`
- Reiniciar el servidor Django

## 📝 Notas Importantes

1. **Producción**: Cambiar `ALLOW_ANY_DOMAIN` a `False`
2. **HTTPS**: Requerido en producción por Google
3. **Roles**: Configurar roles apropiados según necesidad
4. **Backup**: Los usuarios OAuth pueden vincularse con usuarios existentes por email

---

**Desarrollado por Analítica Neuronal para EPS Familiar de Colombia**