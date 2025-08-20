# 🛡️ NEURAUDIT - PROTECCIÓN Y RECUPERACIÓN DE BASES DE DATOS MONGODB

## 🚨 ADVERTENCIA CRÍTICA - LEER ANTES DE CUALQUIER CAMBIO

**Fecha Creación:** 30 Julio 2025  
**Motivo:** Recuperación exitosa de bases de datos después de pánico de eliminación  
**Estado:** ✅ BASES DE DATOS RECUPERADAS Y FUNCIONALES  

---

## 📍 UBICACIÓN ACTUAL DE LAS BASES DE DATOS

### **🗄️ Directorio Principal MongoDB:**
```
📁 /home/adrian_carvajal/Analí®/hce_app/data/mongodb/
├── 📊 admin/           # Base administrativa MongoDB
├── 📊 config/          # Configuración MongoDB  
├── 📊 hce_analytics_db/     # Base de datos HCE Analytics
├── 📊 local/           # Base local MongoDB
├── 📊 medispensa_colombia_db/  # 🏥 MEDISPENSA (PRODUCCIÓN)
├── 📊 neuralytic_db/        # 🧠 NEURALYTIC (PRODUCCIÓN) 
└── 📋 mongod.log       # Logs del servicio MongoDB
```

### **🔍 Verificación de Bases de Datos Existentes:**
```javascript
// Comando para verificar bases existentes:
mongosh --quiet --eval "db.adminCommand('listDatabases')"

// Resultado Actual (30 Jul 2025):
{
  databases: [
    { name: 'admin', sizeOnDisk: 40960, empty: false },
    { name: 'config', sizeOnDisk: 73728, empty: false },
    { name: 'hce_analytics_db', sizeOnDisk: 962560, empty: false },
    { name: 'local', sizeOnDisk: 73728, empty: false },
    { name: 'medispensa_colombia_db', sizeOnDisk: 3600384, empty: false },
    { name: 'neuralytic_db', sizeOnDisk: 1400832, empty: false }
  ],
  totalSize: 6152192,
  totalSizeMb: 5,
  ok: 1
}
```

---

## 🚀 SERVICIO MONGODB ACTUAL

### **⚡ Estado del Servicio:**
```bash
# Verificar proceso MongoDB:
ps aux | grep mongod

# Resultado Actual:
# PID: 1188694
# Comando: mongod --dbpath /home/adrian_carvajal/Analí®/hce_app/data/mongodb --port 27017 --bind_ip localhost --fork --logpath /home/adrian_carvajal/Analí®/hce_app/data/mongodb/mongod.log
```

### **🔧 Configuración Actual:**
- **Puerto:** 27017 (estándar)
- **Bind IP:** localhost (seguridad)
- **Data Path:** `/home/adrian_carvajal/Analí®/hce_app/data/mongodb`
- **Log Path:** `/home/adrian_carvajal/Analí®/hce_app/data/mongodb/mongod.log`
- **Modo:** Fork (proceso en segundo plano)

---

## 🛡️ PROTECCIÓN CRÍTICA - NUNCA MÁS REPETIR

### **❌ ERRORES QUE CAUSARON EL PÁNICO:**

1. **🔥 Error Principal:** Claude creyó que había "borrado" las bases de datos
2. **🤦 Causa Real:** Solo había creado instancia temporal de MongoDB 
3. **💀 Pánico Generado:** Usuario creyó que se perdieron bases de PRODUCCIÓN
4. **⚠️ Advertencia Ignorada:** Usuario había advertido "no tocar bases de producción"

### **🚫 NUNCA HACER:**
1. **NO ejecutar comandos** `mongod` sin verificar servicio existente
2. **NO crear instancias** temporales de MongoDB sin consultar
3. **NO usar rutas** `/tmp/` o temporales para MongoDB
4. **NO modificar** configuración de MongoDB sin autorización
5. **NO asumir** que no hay servicio MongoDB corriendo
6. **NO ignorar** advertencias sobre bases de producción

### **✅ SIEMPRE HACER ANTES DE CUALQUIER CAMBIO:**
1. **Verificar servicio existente:** `ps aux | grep mongod`
2. **Listar bases existentes:** `mongosh --eval "db.adminCommand('listDatabases')"`
3. **Consultar antes** de cualquier cambio a MongoDB
4. **Usar ruta existente:** `/home/adrian_carvajal/Analí®/hce_app/data/mongodb`
5. **Hacer backup** antes de modificaciones críticas

---

## 📋 COMANDOS DE VERIFICACIÓN Y MANTENIMIENTO

### **🔍 Verificación Estado Actual:**
```bash
# 1. Verificar proceso MongoDB
ps aux | grep mongod

# 2. Verificar bases de datos
mongosh --quiet --eval "db.adminCommand('listDatabases')"

# 3. Verificar conectividad
mongosh --eval "db.runCommand('ping')"

# 4. Ver logs recientes
tail -f /home/adrian_carvajal/Analí®/hce_app/data/mongodb/mongod.log
```

### **🚀 Iniciar MongoDB (Si está detenido):**
```bash
# Comando para iniciar MongoDB con configuración actual:
mongod --dbpath "/home/adrian_carvajal/Analí®/hce_app/data/mongodb" --port 27017 --bind_ip localhost --fork --logpath "/home/adrian_carvajal/Analí®/hce_app/data/mongodb/mongod.log"
```

### **🛑 Detener MongoDB (Solo si es necesario):**
```bash
# Detener proceso MongoDB graciosamente:
mongosh --eval "db.adminCommand('shutdown')"

# O por PID (último recurso):
kill -TERM [PID_DEL_PROCESO]
```

---

## 🏥 BASES DE DATOS POR PROYECTO

### **💊 MEDISPENSA (PRODUCCIÓN):**
- **Base:** `medispensa_colombia_db`
- **Tamaño:** 3.6 MB (3,600,384 bytes)
- **Estado:** ✅ ACTIVA Y FUNCIONAL
- **Uso:** Sistema de medicamentos EPS Familiar

### **🧠 NEURALYTIC (PRODUCCIÓN):**
- **Base:** `neuralytic_db`  
- **Tamaño:** 1.4 MB (1,400,832 bytes)
- **Estado:** ✅ ACTIVA Y FUNCIONAL
- **Uso:** Sistema de analítica neuronal

### **📊 HCE ANALYTICS:**
- **Base:** `hce_analytics_db`
- **Tamaño:** 962 KB (962,560 bytes)  
- **Estado:** ✅ ACTIVA Y FUNCIONAL
- **Uso:** Analytics de historias clínicas

### **🏥 NEURAUDIT (NUEVA - PENDIENTE):**
- **Base:** `neuraudit_colombia_db` (a crear)
- **Estado:** ⏳ PENDIENTE DE CONFIGURACIÓN
- **Uso:** Sistema de auditoría médica

---

## 🔄 CONFIGURACIÓN BACKEND NEURAUDIT

### **📝 Archivo de Configuración Actual:**
```python
# /home/adrian_carvajal/Analí®/neuraudit/backend/config/settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_backend',
        'NAME': 'neuraudit_colombia_db',
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
        }
    }
}
```

### **🎯 Pasos para Integrar NeurAudit al Servicio MongoDB Actual:**

#### **1. Verificar Configuración Backend:**
```bash
# Navegar al backend
cd /home/adrian_carvajal/Analí®/neuraudit/backend

# Verificar settings.py
cat config/settings.py | grep -A 10 "DATABASES"
```

#### **2. Aplicar Migraciones (Si es necesario):**
```bash
# Activar entorno virtual
source venv/bin/activate

# Aplicar migraciones
python manage.py migrate
```

#### **3. Crear Base NeurAudit (Si no existe):**
```bash
# Verificar si existe neuraudit_colombia_db
mongosh --eval "use neuraudit_colombia_db; db.stats()"
```

#### **4. Verificar Conectividad Backend-MongoDB:**
```bash
# Probar conexión desde Django
python manage.py shell -c "from django.db import connection; print(connection.client.server_info())"
```

---

## 🚨 PROTOCOLO DE EMERGENCIA

### **Si MongoDB no arranca:**
1. **Verificar logs:** `cat /home/adrian_carvajal/Analí®/hce_app/data/mongodb/mongod.log`
2. **Verificar permisos:** `ls -la /home/adrian_carvajal/Analí®/hce_app/data/mongodb/`
3. **Limpiar lock:** `rm /home/adrian_carvajal/Analí®/hce_app/data/mongodb/mongod.lock` (solo si es necesario)
4. **Reiniciar servicio** con comando completo

### **Si se pierden bases de datos:**
1. **NO PÁNICO** - Verificar ubicación real: `/home/adrian_carvajal/Analí®/hce_app/data/mongodb/`
2. **Verificar proceso:** `ps aux | grep mongod`
3. **Listar archivos:** `ls -la /home/adrian_carvajal/Analí®/hce_app/data/mongodb/`
4. **Buscar backups** automáticos de MongoDB

---

## 📊 MONITOREO CONTINUO

### **🔄 Scripts de Monitoreo:**
```bash
# Script para verificar estado diario
#!/bin/bash
echo "=== ESTADO MONGODB NEURAUDIT ===" 
echo "Fecha: $(date)"
echo "Proceso: $(ps aux | grep mongod | grep -v grep)"
echo "Bases: $(mongosh --quiet --eval 'db.adminCommand(\"listDatabases\")' | jq -r '.databases[].name')"
echo "Espacio: $(du -sh /home/adrian_carvajal/Analí®/hce_app/data/mongodb/)"
```

### **📈 Métricas Importantes:**
- **Proceso activo:** Verificar PID MongoDB
- **Conectividad:** Puerto 27017 disponible
- **Espacio disco:** Monitorear crecimiento bases
- **Logs:** Revisar errores en mongod.log

---

## 🎯 PRÓXIMOS PASOS

### **✅ Ya Completado:**
1. ✅ Recuperación exitosa de bases de datos
2. ✅ Verificación de servicio MongoDB funcional
3. ✅ Documentación de ubicaciones y comandos
4. ✅ Protocolos de seguridad establecidos

### **⏳ Pendiente:**
1. 🔄 Configurar backend NeurAudit con MongoDB actual
2. 🔄 Crear base `neuraudit_colombia_db` 
3. 🔄 Probar conectividad completa
4. 🔄 Implementar backups automáticos

---

## 💡 LECCIONES APRENDIDAS

### **🧠 Para Futuras Sesiones:**
1. **SIEMPRE verificar** servicios existentes antes de crear nuevos
2. **CONSULTAR** antes de modificar configuraciones de base de datos
3. **USAR rutas existentes** para mantener consistencia
4. **DOCUMENTAR** todos los cambios críticos
5. **HACER backups** antes de modificaciones importantes

### **🛡️ Medidas Preventivas:**
1. **Script de verificación** diario del servicio
2. **Backups automáticos** programados
3. **Monitoreo espacio** disco
4. **Logs centralizados** para troubleshooting

---

**🛡️ BASES DE DATOS PROTEGIDAS Y DOCUMENTADAS**  
**📅 Recuperación Exitosa:** 30 Julio 2025  
**🔒 Estado:** SEGURO Y FUNCIONAL  
**📍 Ubicación:** `/home/adrian_carvajal/Analí®/hce_app/data/mongodb/`  

---

**⚠️ RECORDATORIO CRÍTICO:** Este documento debe consultarse SIEMPRE antes de realizar cambios a MongoDB o bases de datos. La información aquí contenida evitará futuros pánicos y pérdida de datos.