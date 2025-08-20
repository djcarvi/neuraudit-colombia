# 🔐 NEURAUDIT - USUARIOS DE PRUEBA PARA TESTING

## 📋 INFORMACIÓN GENERAL

**Fecha Creación:** 30 Julio 2025  
**Base de Datos:** MongoDB - `neuraudit_colombia_db`  
**Colección:** `neuraudit_users`  
**Estado:** ✅ USUARIOS ACTIVOS Y FUNCIONALES  

## 👤 CREDENCIALES DE TESTING

### 🏥 **USUARIO EPS (Auditor Médico)**
```
🔸 Tipo de Usuario: EPS
🔸 Usuario: auditor.medico
🔸 Contraseña: NeurAudit2025!
🔸 Email: auditor.medico@epsfamiliar.com.co
```

**Detalles del Usuario:**
- **ID MongoDB:** `68897889778e200bfdd7d9ad`
- **Nombre Completo:** Dr. Carlos Rodríguez
- **Documento:** CC 1234567890
- **Teléfono:** 3001234567
- **Rol:** Auditor Médico
- **Estado:** Activo
- **Perfil de Auditoría:**
  - Especialidades: Medicina Interna, Cardiología
  - Máximo cuentas por día: 50
  - Experiencia: 8 años

**Permisos Asignados:**
- `audit_medical` - Auditoría médica
- `create_glosas` - Creación de glosas
- `view_assigned` - Ver asignaciones
- `medical_review` - Revisión médica

---

### 🏥 **USUARIO PSS (Radicador Hospital)**
```
🔸 Tipo de Usuario: PSS  
🔸 NIT: 900123456-1
🔸 Usuario: radicador.pss
🔸 Contraseña: HSanJose2025!
🔸 Email: radicador@hospitalsanjose.com
```

**Detalles del Usuario:**
- **ID MongoDB:** `6889788a778e200bfdd7d9b0`
- **Nombre Completo:** María González
- **Documento:** CC 9876543210
- **Teléfono:** 3019876543
- **NIT:** 900123456-1
- **PSS:** Hospital San José
- **Código PSS:** HSJ001
- **Número Habilitación:** COL-HSJ-2024-001
- **Rol:** Radicador de Cuentas Médicas
- **Estado:** Activo

**Permisos Asignados:**
- `create_radicacion` - Crear radicaciones
- `upload_documents` - Cargar documentos
- `view_own` - Ver propias radicaciones
- `manage_submissions` - Gestionar envíos

---

## 🧪 INSTRUCCIONES DE TESTING

### **1. Testing Login EPS:**
1. Ir a: `http://localhost:3003/login`
2. Seleccionar: **"EPS Familiar"**
3. Usuario: `auditor.medico`
4. Contraseña: `NeurAudit2025!`
5. Clic en **"Iniciar Sesión"**

### **2. Testing Login PSS:**
1. Ir a: `http://localhost:3003/login`
2. Seleccionar: **"Prestador (PSS)"**
3. NIT: `900123456-1`
4. Usuario: `radicador.pss`
5. Contraseña: `HSanJose2025!`
6. Clic en **"Iniciar Sesión"**

### **3. Validaciones Esperadas:**
- ✅ Login exitoso debe generar JWT y redirigir a `/dashboard`
- ✅ Token debe incluir `user_type`, `role`, `nit` (PSS), `full_name`
- ✅ Sesión debe guardarse en `localStorage` o `sessionStorage`
- ✅ Route guards deben funcionar correctamente
- ✅ Logout debe invalidar sesión backend + limpiar frontend

## 📊 ESTADO DE LA BASE DE DATOS

**Base de Datos:** `neuraudit_colombia_db`  
**Total usuarios:** 2  
**Usuarios EPS:** 1  
**Usuarios PSS:** 1  

### **Colecciones Creadas:**
- `neuraudit_users` - Usuarios del sistema
- `neuraudit_user_sessions` - Sesiones activas (se crea al login)

## 🔍 VERIFICACIÓN DE DATOS

### **Consulta MongoDB (Opcional):**
```javascript
// Conectar a MongoDB
use neuraudit_colombia_db

// Ver todos los usuarios
db.neuraudit_users.find().pretty()

// Ver usuario EPS específico
db.neuraudit_users.findOne({username: "auditor.medico"})

// Ver usuario PSS específico  
db.neuraudit_users.findOne({username: "radicador.pss"})

// Contar usuarios por tipo
db.neuraudit_users.countDocuments({user_type: "EPS"})
db.neuraudit_users.countDocuments({user_type: "PSS"})
```

## 🛡️ CONSIDERACIONES DE SEGURIDAD

### **✅ Implementado:**
- Contraseñas hasheadas con Django's `make_password()`
- Diferenciación PSS (NIT + Usuario) vs EPS (Usuario)
- Roles granulares con permisos específicos
- Estados de usuario (Activo/Inactivo/Suspendido)
- Validación de tipos de usuario al login
- Logs de auditoría activados

### **🔐 Tokens JWT:**
- **Duración Access Token:** 8 horas
- **Duración Refresh Token:** 7 días  
- **Algoritmo:** HS256
- **Claims personalizados:** user_type, role, nit, full_name

## 📝 TESTING CHECKLIST

### **Login Testing:**
- [ ] Login EPS exitoso con credenciales correctas
- [ ] Login PSS exitoso con NIT + credenciales correctas
- [ ] Login fallido con credenciales incorrectas
- [ ] Login fallido PSS sin NIT
- [ ] Mensaje de error apropiado para cada caso

### **JWT Testing:**
- [ ] Token generado correctamente tras login exitoso
- [ ] Claims personalizados incluidos en token
- [ ] Route guards funcionan con token válido
- [ ] Redirección a login con token expirado
- [ ] Refresh token funciona correctamente

### **Session Testing:**
- [ ] Sesión creada en MongoDB al login
- [ ] Datos almacenados en localStorage/sessionStorage
- [ ] "Recordar sesión" funciona correctamente
- [ ] Logout limpia datos locales y backend
- [ ] Múltiples sesiones controladas correctamente

### **Role Testing:**
- [ ] Permisos EPS vs PSS diferenciados
- [ ] Menú/funciones según rol de usuario
- [ ] Restricciones de acceso por rol funcionando

## 🚀 PRÓXIMOS PASOS

1. **Testing completo** con ambos usuarios
2. **Validación de permisos** por rol
3. **Testing de refresh tokens** 
4. **Verificación de logs** de auditoría
5. **Testing de logout** completo
6. **Integración con otros módulos** del sistema

---

**🔐 Usuarios Listos para Testing - NeurAudit Colombia**  
**📅 Creado:** 30 Julio 2025  
**🛡️ Cumple:** Resolución 2284 de 2023  
**✅ Estado:** FUNCIONAL - Listo para pruebas  

---

## ⚠️ IMPORTANTE - CREDENCIALES DE TESTING

**Estas credenciales son SOLO para testing en desarrollo.**  
**En producción se deben cambiar todas las contraseñas.**  
**Los usuarios de prueba deben eliminarse antes del despliegue en producción.**