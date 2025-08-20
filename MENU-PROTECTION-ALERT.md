# 🚨 ALERTA CRÍTICA - PROTECCIÓN DEL MENÚ NEURAUDIT

## ⚠️ **PARA FUTURAS SESIONES DE CLAUDE CODE**

### 📅 **FECHA:** 29 Julio 2025
### 🎯 **ESTADO:** MENÚ COMPLETAMENTE FUNCIONAL - NO TOCAR

---

## 🛡️ **ANTES DE HACER CUALQUIER CAMBIO:**

### 1. **LEE OBLIGATORIAMENTE:**
- **`/home/adrian_carvajal/Analí®/neuraudit/CLAUDE.md`** (líneas 261-332)
- **`/home/adrian_carvajal/Analí®/neuraudit/NEURAUDIT-MENU-DOCUMENTATION.md`**

### 2. **VERIFICA EL BACKUP:**
- **Backup funcional:** `frontend-vue3-backup-20250729-1744/`
- **Estado:** ✅ COMPLETAMENTE FUNCIONAL

### 3. **CONSULTA AL USUARIO:**
- **NUNCA modifiques** el menú sin autorización explícita
- **SIEMPRE pregunta** antes de tocar archivos críticos

---

## 🚫 **ARCHIVOS PROHIBIDOS DE MODIFICAR:**

```
⛔ CRÍTICO: /frontend-vue3/src/App.vue
⛔ CRÍTICO: /frontend-vue3/index.html
⛔ CRÍTICO: /frontend-vue3/assets/js/main.js
⛔ CRÍTICO: /frontend-vue3/assets/js/defaultmenu.min.js
⛔ CRÍTICO: /frontend-vue3/assets/js/sticky.js
```

---

## 🔥 **ERRORES COMUNES QUE DESTRUYEN EL MENÚ:**

1. ❌ Cambiar orden de carga de scripts
2. ❌ Mover badges de submenús a iconos principales  
3. ❌ Eliminar elementos `slide-left`, `slide-right`
4. ❌ Quitar botones home (`side-menu__label1`)
5. ❌ Modificar clases CSS de Vyzor
6. ❌ Cambiar estructura `has-sub` y `child1`

---

## 🆘 **SI EL MENÚ SE ROMPE:**

```bash
# RESTAURACIÓN DE EMERGENCIA
cd /home/adrian_carvajal/Analí®/neuraudit/
rm -rf frontend-vue3
cp -r frontend-vue3-backup-20250729-1744 frontend-vue3
cd frontend-vue3
npm run dev
```

**Luego verificar:** http://localhost:3003

---

## ✅ **FUNCIONALIDADES QUE DEBEN MANTENERSE:**

- [x] Menu se expande/colapsa correctamente
- [x] Iconos visibles cuando menú está colapsado
- [x] Badges en ubicaciones correctas (submenús específicos)
- [x] Botones home funcionan en submenús
- [x] Navegación Vue Router operativa
- [x] Scripts Vyzor cargan sin errores

---

## 💡 **REGLA DE ORO:**

> **"Si no estás 100% seguro de lo que estás haciendo con el menú, NO LO TOQUES. Pregunta al usuario primero."**

---

**🏥 NeurAudit - EPS Familiar de Colombia**  
**⚠️ Menú protegido - Implementación funcional del 29 Jul 2025**