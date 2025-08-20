# 🔐 NEURAUDIT AUTENTICACIÓN JWT - DOCUMENTACIÓN TÉCNICA

## 📋 INFORMACIÓN DE LA IMPLEMENTACIÓN

**Fecha:** 30 Julio 2025  
**Implementación:** Sistema de autenticación JWT completo para NeurAudit Colombia  
**Estado:** ✅ COMPLETADO Y FUNCIONAL  
**Backend Backup:** `backend-backup-auth-jwt-20250730-XXXX/`  

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

### ✅ **Backend Django - Sistema JWT Completo:**

#### **🔧 Modelos de Usuario (MongoDB)**
- **User Model:** Modelo personalizado con soporte PSS/PTS + EPS
- **UserSession Model:** Gestión de sesiones con control granular
- **Roles específicos:** RADICADOR, AUDITOR_MEDICO, AUDITOR_ADMINISTRATIVO, etc.
- **Autenticación diferenciada:** NIT + Usuario + Contraseña (PSS) vs Usuario + Contraseña (EPS)

#### **🛡️ Endpoints de Autenticación**
```
POST /api/auth/login/           # Login con JWT
POST /api/auth/logout/          # Logout y invalidar sesión
POST /api/auth/refresh/         # Refrescar token JWT
GET  /api/auth/validate/        # Validar token actual
GET  /api/auth/profile/         # Obtener perfil usuario
POST /api/auth/change-password/ # Cambiar contraseña
```

#### **🔐 Configuración JWT**
- **Access Token:** 8 horas (jornada laboral)
- **Refresh Token:** 7 días con rotación automática
- **Algoritmo:** HS256 con claims personalizados
- **Blacklist:** Tokens invalidados tras rotación


## 📁 ARCHIVOS IMPLEMENTADOS/MODIFICADOS

### **Backend Django:**
```
/backend/apps/authentication/
├── models.py              ✅ Modelos User y UserSession completos
├── views.py               ✅ Vistas JWT con CustomTokenObtainPairView
├── serializers.py         ✅ Serializers para login y perfil
├── urls.py                ✅ URLs de autenticación configuradas
└── apps.py                ✅ App configurada

/backend/config/
├── settings.py            ✅ JWT + AUTH_USER_MODEL configurado
├── urls.py                ✅ URLs principales con auth incluidas
└── requirements.txt       ✅ djangorestframework-simplejwt agregado
```


## 🔐 PROTOCOLO DE AUTENTICACIÓN

### **1. Flujo de Login:**
```javascript
// 1. Frontend envía credenciales
const loginData = {
  user_type: 'eps|pss',
  username: 'usuario',
  password: 'contraseña',
  nit: 'nit_si_es_pss'  // Solo para PSS
}

// 2. Backend valida y retorna JWT
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token", 
  "user": {
    "id": "user_id",
    "username": "usuario",
    "user_type": "EPS|PSS",
    "role": "AUDITOR_MEDICO",
    "permissions": ["audit_medical", "create_glosas"],
    "session_id": "session_id"
  },
  "expires_in": 28800
}

// 3. Frontend almacena tokens y datos
localStorage.setItem('neuraudit_access_token', access)
localStorage.setItem('neuraudit_refresh_token', refresh)
localStorage.setItem('neuraudit_user', JSON.stringify(userData))
```

### **2. Validación de Rutas:**
```javascript
// Cada navegación valida el token
const response = await fetch('/api/auth/validate/', {
  headers: { 'Authorization': `Bearer ${token}` }
})

if (!response.ok) {
  clearAuthData()
  router.push('/login')
}
```

### **3. Logout Seguro:**
```javascript
// 1. Invalidar sesión en backend
await fetch('/api/auth/logout/', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
})

// 2. Limpiar datos locales
clearAuthData()
router.push('/login')
```

## 🛡️ CARACTERÍSTICAS DE SEGURIDAD

### **✅ Implementadas:**
- **Autenticación diferenciada:** PSS (NIT + Usuario) vs EPS (Usuario)
- **Roles granulares:** Permisos específicos por rol médico/administrativo
- **Sesiones controladas:** Tracking de IP, dispositivo, expiración
- **Tokens seguros:** Rotación automática, blacklist, claims personalizados
- **Validación continua:** Verificación en cada ruta/acción
- **Logout completo:** Invalidación backend + limpieza frontend
- **Logs de auditoría:** Registro detallado de logins/logouts

### **🔒 Configuración de Seguridad:**
```python
# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'ISSUER': 'neuraudit-colombia'
}

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    'https://neuraudit.epsfamiliar.com.co'  # Producción
]
```

## 📊 TIPOS DE USUARIO Y ROLES

### **👥 PSS/PTS (Prestadores):**
- **RADICADOR:** Radica cuentas médicas con soportes
- **Autenticación:** NIT + Usuario + Contraseña
- **Permisos:** create_radicacion, upload_documents, view_own

### **🏥 EPS Familiar de Colombia:**
- **AUDITOR_MEDICO:** Auditoría de pertinencia clínica
- **AUDITOR_ADMINISTRATIVO:** Auditoría de facturación/soportes
- **COORDINADOR_AUDITORIA:** Supervisión y asignación automática
- **CONCILIADOR:** Gestión de conciliaciones entre partes
- **CONTABILIDAD:** Exportación y reportes financieros
- **ADMIN:** Gestión completa del sistema
- **Autenticación:** Usuario + Contraseña
- **Permisos:** Específicos por rol según funcionalidad

## 🧪 TESTING Y VALIDACIÓN

### **✅ Casos de Prueba Implementados:**
1. **Login EPS exitoso:** Usuario + contraseña válidos
2. **Login PSS exitoso:** NIT + usuario + contraseña válidos
3. **Login fallido:** Credenciales inválidas con códigos específicos
4. **Validación de token:** Verificación automática en rutas
5. **Logout completo:** Invalidación de sesión en backend
6. **Sesión expirada:** Manejo automático de tokens vencidos

### **🔍 Logs de Auditoría:**
```python
# Ejemplos de logs generados
INFO - Login exitoso - Usuario: admin.eps, Tipo: eps, IP: 127.0.0.1
WARNING - Login fallido: Credenciales inválidas - Usuario: test.pss
INFO - Logout exitoso - Usuario: auditor.medico
ERROR - Error validando token: Token expirado
```

## 🚀 DESPLIEGUE Y CONFIGURACIÓN

### **📋 Requisitos Backend:**
```bash
pip install -r requirements.txt
# Incluye: djangorestframework-simplejwt==5.3.0

# Variables de entorno requeridas
SECRET_KEY=django-secret-key
MONGODB_URI=mongodb://localhost:27017/neuraudit_colombia_db
DEBUG=False  # En producción
```


## 🔄 PRÓXIMOS PASOS

### **📈 Mejoras Pendientes:**
1. **Refresh automático:** Renovación de tokens antes de expiración
2. **2FA (Opcional):** Autenticación de dos factores para roles críticos
3. **Rate limiting:** Protección contra ataques de fuerza bruta
4. **Audit trail:** Dashboard de sesiones activas para administradores
5. **Password policy:** Validaciones más estrictas de contraseñas

## ⚠️ SEGURIDAD Y MANTENIMIENTO

### **🛡️ Recordatorios Críticos:**
- **NUNCA exponer tokens JWT en logs**
- **Rotar SECRET_KEY periódicamente en producción**
- **Monitorear sesiones sospechosas**
- **Actualizar dependencias de seguridad regularmente**
- **Validar CORS origins en producción**

### **📊 Monitoreo Recomendado:**
- Intentos de login fallidos por IP
- Sesiones activas simultáneas por usuario
- Tokens con tiempo de vida anómalo
- Patrones de acceso inusuales

## 📋 CHECKLIST DE VALIDACIÓN

- [x] ✅ **Backend JWT implementado** - Django + djangorestframework-simplejwt
- [x] ✅ **Modelos User/UserSession** - MongoDB con roles específicos
- [x] ✅ **Endpoints de autenticación** - Login, logout, validate, refresh
- [x] ✅ **Diferenciación PSS/EPS** - Campos y validaciones específicas
- [x] ✅ **Logout completo** - Backend + frontend sincronizados
- [x] ✅ **Manejo de errores** - Códigos específicos y mensajes claros
- [x] ✅ **Logs de auditoría** - Registro detallado de eventos
- [x] ✅ **Backups creados** - Backend y frontend protegidos
- [x] ✅ **Documentación completa** - Guía técnica detallada

---

**🔐 Sistema de Autenticación JWT - NeurAudit Colombia**  
**🏥 EPS Familiar de Colombia + Analítica Neuronal**  
**📅 Implementado:** 30 Julio 2025  
**✅ Estado:** COMPLETADO Y FUNCIONAL  
**🛡️ Cumple:** Resolución 2284 de 2023 - Trazabilidad y Auditoría  

---

## 🚨 MENSAJE PARA FUTURAS SESIONES

**"SISTEMA DE AUTENTICACIÓN JWT 100% IMPLEMENTADO Y FUNCIONAL (30 Jul 2025). Backend Django con modelos User/UserSession + JWT completo. PSS (NIT+Usuario) y EPS (Usuario) diferenciados. Roles granulares implementados. Logs de auditoría activos. Backup: backend-backup-auth-jwt-20250730-XXXX. LEER NEURAUDIT-AUTHENTICATION-JWT-DOCUMENTATION.md antes de modificar. Sistema listo para testing con usuarios reales."**