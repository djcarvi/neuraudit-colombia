# 🛡️ BACKUP PRE-IMPLEMENTACIÓN CLASIFICADOR SOPORTES

## 📅 **INFORMACIÓN DEL BACKUP**
- **Fecha:** 20 Agosto 2025
- **Hora:** 18:06:53
- **Propósito:** Backup antes de implementar clasificador automático de soportes según Resolución 2284/2023
- **Estado del sistema:** Funcional - Listo para nueva funcionalidad

## 📦 **ARCHIVOS DE BACKUP CREADOS**

### 🔧 **Backend:**
```
backend-pre-clasificador-soportes-20250820_180653.tar.gz (317KB)
```

### 🎨 **Frontend:**
```
frontend-pre-clasificador-soportes-20250820_180653.tar.gz (27MB)
```

## 🚫 **ARCHIVOS EXCLUIDOS DEL BACKUP**

### **Backend:**
- `venv/` - Entorno virtual Python
- `__pycache__/` - Cache de Python (todos los niveles)
- `*.pyc` - Archivos compilados Python
- `node_modules/` - Dependencias Node.js
- `.git/` - Repositorio Git
- `server.log` - Logs del servidor
- `db.sqlite3` - Base de datos SQLite (si existe)

### **Frontend:**
- `node_modules/` - Dependencias Node.js
- `.git/` - Repositorio Git
- `dist/` - Build de distribución
- `build/` - Build de producción
- `.next/` - Cache Next.js
- `.cache/` - Cache general
- `coverage/` - Reportes de cobertura
- `*.log` - Archivos de log
- `.env.*` - Variables de entorno

## 🎯 **PRÓXIMA IMPLEMENTACIÓN**

### **Objetivo:**
Implementar sistema de clasificación automática de soportes documentales según:
- **Resolución 2284 de 2023** del Ministerio de Salud y Protección Social
- **14 códigos oficiales:** HEV, EPI, PDX, DQX, RAN, CRC, TAP, TNA, FAT, FMO, OPF, LDP, HAU, HAO, HAM
- **7 categorías principales** de agrupación
- **Validación de nomenclatura** automática

### **Plan detallado:**
Ver archivo: `PLAN_CLASIFICADOR_SOPORTES_RESOLUCION_2284.md`

## 🔄 **COMANDOS DE RESTAURACIÓN**

### **Backend:**
```bash
cd "/home/adrian_carvajal/Analí®/neuraudit_react"
tar -xzf backend-pre-clasificador-soportes-20250820_180653.tar.gz
```

### **Frontend:**
```bash
cd "/home/adrian_carvajal/Analí®/neuraudit_react"
tar -xzf frontend-pre-clasificador-soportes-20250820_180653.tar.gz
```

## ✅ **VERIFICACIÓN DEL BACKUP**

### **Estado actual del sistema:**
- ✅ Backend Django funcionando correctamente
- ✅ Frontend React funcionando correctamente
- ✅ Base de datos MongoDB operativa
- ✅ Autenticación JWT implementada
- ✅ Módulos de radicación y consulta operativos
- ✅ Integración frontend-backend funcional

### **Funcionalidades actuales:**
- ✅ Login PSS/EPS con autenticación JWT
- ✅ Radicación de cuentas médicas con upload de archivos
- ✅ Extracción automática de datos XML/RIPS
- ✅ Consulta de radicaciones con filtros
- ✅ Visualización de estadísticas RIPS
- ✅ Dashboard completo con datos reales

## 🚨 **NOTAS IMPORTANTES**

1. **Estos backups NO incluyen:**
   - Datos de MongoDB (requiere backup separado si necesario)
   - Configuraciones de servidor/producción
   - Certificados SSL/TLS
   - Variables de entorno de producción

2. **Antes de restaurar:**
   - Verificar que el entorno virtual de Python esté activado
   - Reinstalar dependencias: `pip install -r requirements.txt`
   - Reinstalar dependencias frontend: `npm install`
   - Aplicar migraciones: `python manage.py migrate`

3. **Comandos de activación post-restauración:**
   ```bash
   # Backend
   cd backend && source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8003
   
   # Frontend
   cd frontend && npm install
   npm run dev
   ```

---

**📝 Backup creado automáticamente antes de implementación de clasificador de soportes según Resolución 2284/2023**  
**🔒 Estado:** Sistema funcional y listo para nueva funcionalidad  
**📋 Próximo paso:** Implementar plan detallado de clasificación automática de soportes