# 🔒 ARRANQUE SEGURO DE NEURAUDIT - PROTOCOLO DE SEGURIDAD

## ⚠️ ADVERTENCIA CRÍTICA
**HAY BASES DE DATOS DE PRODUCCIÓN EN MONGODB - SEGUIR ESTOS PASOS AL PIE DE LA LETRA**

## 🚨 LÍNEAS ROJAS DE SEGURIDAD

### ❌ NUNCA HACER:
1. **NO ejecutar comandos que afecten todas las bases de datos**
2. **NO usar `mongod` sin especificar la base de datos**
3. **NO borrar o modificar colecciones sin verificar primero**
4. **NO usar comandos de administración global de MongoDB**
5. **NO cambiar configuraciones de MongoDB sin autorización**

### ✅ SIEMPRE HACER:
1. **VERIFICAR qué bases de datos están en MongoDB antes de operar**
2. **USAR solo la base de datos `neuraudit_colombia_db` para desarrollo**
3. **CONFIRMAR conexiones antes de ejecutar operaciones**
4. **MANTENER logs de todas las operaciones realizadas**
5. **HACER backup antes de cambios importantes**

## 📋 PASOS PARA ARRANQUE SEGURO

### 1. Verificar Estado de MongoDB (SIN MODIFICAR)
```bash
# Solo verificar si el servicio está activo
systemctl status mongod --no-pager

# Si necesitas iniciarlo, contacta al administrador
```

### 2. Preparar Backend Django
```bash
cd /home/adrian_carvajal/Analí®/neuraudit/backend

# Activar entorno virtual
source venv/bin/activate

# Verificar configuración (sin tocar DB)
python manage.py check

# Ver qué base de datos está configurada
python manage.py shell -c "from django.conf import settings; print(f'Base de datos configurada: {settings.DATABASES}')"
```

### 3. Arrancar Backend (MODO DESARROLLO)
```bash
# Puerto 8003 para no interferir con otros servicios
python manage.py runserver 0.0.0.0:8003
```

### 4. Preparar Frontend Vue3
```bash
# En otra terminal
cd /home/adrian_carvajal/Analí®/neuraudit/frontend-vue3

# Instalar dependencias si es necesario
npm install

# Arrancar en puerto 3003
npm run dev
```

## 🔐 CREDENCIALES DE PRUEBA
- **Usuario EPS:** test.eps / simple123
- **Usuario PSS:** test.pss / simple123 / NIT: 123456789-0

## 📊 VERIFICACIÓN DE SEGURIDAD

### Antes de Cualquier Operación MongoDB:
```bash
# Listar bases de datos (SOLO LECTURA)
mongosh --eval "db.adminCommand('listDatabases')" --quiet

# Verificar que solo trabajas con neuraudit_colombia_db
mongosh neuraudit_colombia_db --eval "db.getName()"
```

### Logs de Auditoría:
- Backend: `/home/adrian_carvajal/Analí®/neuraudit/backend/logs/neuraudit.log`
- Frontend: Consola del navegador
- MongoDB: Verificar logs del sistema

## 🚨 PROTOCOLO DE EMERGENCIA

Si accidentalmente:
1. **Tocas otra base de datos:** DETENER INMEDIATAMENTE y notificar
2. **Borras datos:** Verificar backups en `backend-backup-testing-final-20250730/`
3. **El sistema no arranca:** Verificar puertos 8003 (backend) y 3003 (frontend)
4. **Errores de autenticación:** Verificar JWT settings en `config/settings.py`

## 📁 ESTRUCTURA DE BACKUPS
```
neuraudit/
├── backend-backup-testing-final-20250730/  # Backup funcional del backend
├── frontend-vue3-backup-testing-final-20250730/  # Backup funcional del frontend
└── NEURAUDIT-SISTEMA-FUNCIONAL-FINAL.md  # Documentación del sistema
```

## ✅ CHECKLIST DE ARRANQUE
- [ ] MongoDB está corriendo (sin modificar configuración)
- [ ] Base de datos es `neuraudit_colombia_db`
- [ ] Backend arranca en puerto 8003
- [ ] Frontend arranca en puerto 3003
- [ ] Login funciona con credenciales de prueba
- [ ] No se han tocado otras bases de datos

---
**🔒 Documento creado siguiendo protocolos de seguridad del proyecto NeurAudit**
**📅 Fecha: 30 Julio 2025**