# 🔒 NEURAUDIT - MEJORAS DE SEGURIDAD JWT PRIORITARIAS

## 🚨 ESTADO ACTUAL - VULNERABILIDADES CRÍTICAS

### **1. ALGORITMO HS256 (ALTO RIESGO)**
**Problema:** 
- Usa clave simétrica (SECRET_KEY de Django)
- Si se filtra la clave, cualquiera puede generar tokens válidos
- No hay separación entre firma y verificación

**Ubicación:**
```python
# /backend/config/settings.py - Línea 167
'ALGORITHM': 'HS256',
'SIGNING_KEY': SECRET_KEY,
```

### **2. TOKENS EN LOCALSTORAGE (VULNERABLE A XSS)**
**Problema:**
- Cualquier script malicioso puede leer los tokens
- No hay protección HttpOnly
- Vulnerable a ataques Cross-Site Scripting

**Ubicación:**
```javascript
// /frontend-vue3/src/main.js - Líneas 67-68
const accessToken = localStorage.getItem('neuraudit_access_token') || 
                   sessionStorage.getItem('neuraudit_access_token')
```

### **3. SIN ENCRIPTACIÓN DE PAYLOAD**
**Problema:**
- Solo se firma (JWS), no se encripta (JWE)
- Cualquiera puede decodificar y leer el contenido del JWT
- Datos sensibles expuestos (roles, permisos, NIT)

### **4. URLS HTTP EN CÓDIGO**
**Problema:**
- URLs hardcodeadas con http://
- Sin HTTPS obligatorio
- Token puede ser interceptado en tránsito

**Ubicación:**
```javascript
// /frontend-vue3/src/main.js - Línea 76
const response = await fetch('http://localhost:8003/api/auth/validate/', {
```

---

## ✅ MEJORAS PRIORITARIAS PARA IMPLEMENTAR

### **PRIORIDAD 1 - CRÍTICO (Implementar antes de producción)**

#### **1.1 Migrar a RS256 (Clave Asimétrica)**
```python
# settings.py
SIMPLE_JWT = {
    'ALGORITHM': 'RS256',
    'SIGNING_KEY': open('/path/to/private_key.pem').read(),
    'VERIFYING_KEY': open('/path/to/public_key.pem').read(),
    # ...
}
```

#### **1.2 Mover Tokens a Cookies HttpOnly**
```python
# views.py
response.set_cookie(
    'access_token',
    token,
    max_age=60*60*8,  # 8 horas
    httponly=True,     # No accesible por JavaScript
    secure=True,       # Solo HTTPS
    samesite='Strict'  # Protección CSRF
)
```

#### **1.3 Implementar JWE (Encriptación)**
```python
# Usar python-jose para JWE
from jose import jwe

encrypted_token = jwe.encrypt(
    payload,
    key,
    algorithm='RSA-OAEP',
    encryption='A256GCM'
)
```

#### **1.4 HTTPS Obligatorio**
```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

### **PRIORIDAD 2 - ALTO (Primera iteración post-producción)**

#### **2.1 Implementar Token Binding**
- Vincular tokens a IP/User-Agent
- Detectar y prevenir robo de tokens

#### **2.2 Reducir Tiempo de Vida**
```python
'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),  # 15 minutos
'REFRESH_TOKEN_LIFETIME': timedelta(hours=8),    # 8 horas
```

#### **2.3 Implementar Rate Limiting**
```python
# Para login attempts
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='5/m', method='POST')
def login_view(request):
    # ...
```

### **PRIORIDAD 3 - MEDIO (Mejoras continuas)**

#### **3.1 Rotación de Claves**
- Rotar claves RSA cada 90 días
- Mantener claves antiguas para validación

#### **3.2 Monitoreo de Seguridad**
- Log de todos los intentos de login
- Alertas por patrones sospechosos
- Análisis de tokens comprometidos

#### **3.3 2FA (Two-Factor Authentication)**
- SMS/Email para usuarios críticos
- TOTP para administradores

---

## 📋 CHECKLIST PARA IMPLEMENTACIÓN

### **Fase 1 - Pre-Producción (OBLIGATORIO)**
- [ ] Generar par de claves RSA
- [ ] Migrar algoritmo a RS256
- [ ] Implementar cookies HttpOnly
- [ ] Configurar HTTPS en todos los ambientes
- [ ] Actualizar frontend para usar cookies
- [ ] Testing exhaustivo de autenticación

### **Fase 2 - Post-Producción (30 días)**
- [ ] Implementar JWE para datos sensibles
- [ ] Reducir tiempos de vida de tokens
- [ ] Agregar rate limiting
- [ ] Implementar token binding

### **Fase 3 - Mejora Continua (90 días)**
- [ ] Sistema de rotación de claves
- [ ] Monitoreo avanzado
- [ ] 2FA para roles críticos
- [ ] Auditoría de seguridad completa

---

## 🛠️ RECURSOS NECESARIOS

### **Librerías Python:**
```bash
pip install cryptography  # Para generar claves RSA
pip install python-jose[cryptography]  # Para JWE
pip install django-ratelimit  # Para rate limiting
```

### **Generación de Claves RSA:**
```bash
# Generar clave privada
openssl genrsa -out private_key.pem 2048

# Generar clave pública
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

### **Variables de Entorno Nuevas:**
```env
JWT_PRIVATE_KEY_PATH=/secure/path/private_key.pem
JWT_PUBLIC_KEY_PATH=/secure/path/public_key.pem
JWT_ENCRYPTION_KEY=base64_encoded_256bit_key
```

---

## ⚠️ ADVERTENCIAS IMPORTANTES

1. **NO implementar estos cambios directamente en producción**
2. **Hacer backup completo antes de cualquier cambio**
3. **Probar exhaustivamente en ambiente de staging**
4. **Coordinar con frontend para cambios de cookies**
5. **Preparar rollback plan**

---

## 📞 CONTACTO PARA DUDAS

**Prioridad:** CRÍTICA - Implementar antes de go-live
**Tiempo estimado:** 2-3 días con testing completo
**Impacto:** Alto - Requiere cambios en backend y frontend

---

**Documento creado:** 8 Agosto 2025
**Última actualización:** 8 Agosto 2025
**Estado:** PENDIENTE DE IMPLEMENTACIÓN