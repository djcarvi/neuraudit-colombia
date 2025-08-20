# 🏥 NEURAUDIT - DOCUMENTACIÓN DEL MENÚ LATERAL

## 📅 **INFORMACIÓN DE LA IMPLEMENTACIÓN**
- **Fecha:** 29 Julio 2025
- **Estado:** ✅ FUNCIONAL Y PROTEGIDO
- **Versión:** Vue.js 3 + Vyzor Template
- **Backup:** `frontend-vue3-backup-20250729-1744/`

---

## 🎯 **RESUMEN DE FUNCIONALIDADES IMPLEMENTADAS**

### ✅ **CARACTERÍSTICAS COMPLETADAS:**
1. **Menu lateral funcional** con estructura original de Vyzor
2. **Badges de colores** en ubicaciones correctas según funcionalidad
3. **Navegación expandible/colapsable** con iconos visibles
4. **Botones home** en submenús según template original
5. **Flechas de navegación** (slide-left/slide-right) funcionales
6. **Integración Vue.js 3** manteniendo funcionalidad JavaScript nativa

---

## 🏗️ **ESTRUCTURA DEL MENÚ IMPLEMENTADA**

### **📊 Main Dashboard:**
```
📈 Dashboard (expandible)
└── 🏠 Dashboard (home)
└── 📊 Dashboard Ejecutivo
```

### **⚙️ Operaciones:**
```
📝 Radicación (expandible)
└── 🏠 Radicación (home)  
└── ➕ Nueva Radicación [15] ← Badge aquí
└── 🔍 Consultar Radicaciones

🔍 Auditoría (expandible)
└── 🏠 Auditoría (home)
└── 📋 Mis Asignaciones [8] ← Badge aquí  
└── ✅ Revisar Cuentas

↩️ Devoluciones [3] ← Badge aquí (menú simple)

⚠️ Glosas (expandible)
└── 🏠 Glosas (home)
└── ➕ Crear Glosa
└── 🔍 Consultar Glosas [22] ← Badge aquí
└── 📤 Respuestas PSS

🤝 Conciliación [5] ← Badge aquí (menú simple)
💳 Autorizar Pagos [12] ← Badge aquí (menú simple)
```

### **📊 Reportes y Trazabilidad:**
```
📈 Trazabilidad (menú simple)
🔔 Alertas [7] ← Badge aquí (menú simple)
```

---

## 🎨 **BADGES DE COLORES IMPLEMENTADOS**

| **Función** | **Color** | **Cantidad** | **Ubicación** | **Significado** |
|-------------|-----------|--------------|---------------|-----------------|
| Nueva Radicación | `bg-primary-transparent` | 15 | Submenú | Cuentas pendientes de radicar |
| Mis Asignaciones | `bg-info-transparent` | 8 | Submenú | Asignaciones pendientes |
| Devoluciones | `bg-warning-transparent` | 3 | Menú principal | Devoluciones activas |
| Consultar Glosas | `bg-danger-transparent` | 22 | Submenú | Glosas pendientes |
| Conciliación | `bg-success-transparent` | 5 | Menú principal | Conciliaciones activas |
| Autorizar Pagos | `bg-secondary-transparent` | 12 | Menú principal | Pagos pendientes |
| Alertas | `bg-danger-transparent` | 7 | Menú principal | Alertas críticas |

---

## 🔧 **ELEMENTOS TÉCNICOS CRÍTICOS**

### **📁 Archivos Principales:**
- **`/src/App.vue`** - Estructura completa del menú
- **`/index.html`** - Carga de scripts en orden específico
- **`/src/main.js`** - Configuración Vue Router

### **🎯 CSS Classes Críticas:**
```css
/* Estructura principal */
.app-sidebar.sticky                    // Sidebar contenedor
.main-sidebar-header                   // Header del sidebar
.main-menu-container.nav.nav-pills.flex-column.sub-open  // Navegación principal

/* Elementos de navegación */
.slide-left, .slide-right             // Flechas navegación
.main-menu                            // Lista principal
.slide__category                      // Categorías de menú
.slide.has-sub                        // Menús expandibles
.slide-menu.child1                    // Submenús nivel 1

/* Items de menú */
.side-menu__item                      // Enlaces de menú
.side-menu__label                     // Etiquetas de menú  
.side-menu__label1                    // Botones home en submenús
.side-menu__icon                      // Iconos de menú
.side-menu__angle                     // Flechas expandir/colapsar

/* Badges */
.badge.bg-[color]-transparent.ms-2    // Badges de colores
```

### **⚡ JavaScript Crítico:**
```html
<!-- ORDEN CRÍTICO DE CARGA -->
<!-- 1. Choices JS - ANTES de main.js -->
<script src="/assets/libs/choices.js/public/assets/scripts/choices.min.js"></script>

<!-- 2. Main Theme JS - SEGUNDO -->  
<script src="/assets/js/main.js"></script>

<!-- 3. Vue.js App -->
<script type="module" src="/src/main.js"></script>

<!-- 4. Scripts Vyzor DESPUÉS de Vue -->
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // sticky.js - Comportamiento sidebar sticky
    const script1 = document.createElement('script');
    script1.src = '/assets/js/sticky.js';
    document.body.appendChild(script1);
    
    // defaultmenu.min.js - Lógica expand/collapse
    const script2 = document.createElement('script');  
    script2.src = '/assets/js/defaultmenu.min.js';
    document.body.appendChild(script2);
  }, 1000); // Esperar Vue mount
});
</script>
```

---

## 🛡️ **PROTECCIÓN Y BACKUP**

### **📁 Backups Creados:**
- **`frontend-vue3-backup-20250729-1744/`** - Implementación funcional completa
- **`frontend-backup-working/`** - Template HTML original funcional
- **`VYZOR-STRUCTURE.md`** - Documentación estructura exacta
- **`BACKUP-INFO.md`** - Instrucciones de restauración

### **🔒 Archivos Críticos PROTEGIDOS:**
```
⚠️ NUNCA MODIFICAR SIN AUTORIZACIÓN:
- /src/App.vue (estructura completa del menú)
- /index.html (orden de carga de scripts)
- /assets/js/main.js (inicialización tema)
- /assets/js/defaultmenu.min.js (lógica menú)
- /assets/js/sticky.js (comportamiento sidebar)
- /assets/css/styles.css (estilos Vyzor)
```

---

## 🚨 **ADVERTENCIAS CRÍTICAS**

### **❌ NUNCA HACER:**
1. **NO modificar orden de carga de scripts** en `index.html`
2. **NO cambiar clases CSS** de Vyzor sin consultar
3. **NO eliminar elementos** `slide-left`, `slide-right`  
4. **NO quitar** `side-menu__label1` (botones home)
5. **NO cambiar** estructura `slide-menu child1`
6. **NO modificar** `main-menu-container` classes

### **✅ SIEMPRE HACER:**
1. **Consultar documentación** antes de cambios
2. **Hacer backup** antes de modificaciones
3. **Probar funcionalidad** después de cambios
4. **Mantener badges** en ubicaciones correctas
5. **Verificar scripts** cargan correctamente

---

## 🔄 **INSTRUCCIONES DE RESTAURACIÓN**

### **Si el menú deja de funcionar:**

1. **Restaurar desde backup:**
```bash
cd /home/adrian_carvajal/Analí®/neuraudit/
rm -rf frontend-vue3
cp -r frontend-vue3-backup-20250729-1744 frontend-vue3
```

2. **Verificar servidor:**
```bash
cd frontend-vue3
npm run dev
# Debe iniciar en http://localhost:3003
```

3. **Verificar funcionalidad:**
- ✅ Menú se expande/colapsa
- ✅ Iconos visibles cuando collapsed  
- ✅ Badges en ubicaciones correctas
- ✅ Botones home funcionales
- ✅ Navegación router funciona

---

## 📊 **MÉTRICAS DE FUNCIONALIDAD**

### **✅ Estado Actual (29 Jul 2025):**
- **Menu principal:** ✅ FUNCIONAL
- **Submenús:** ✅ FUNCIONAL  
- **Badges:** ✅ FUNCIONAL Y CORRECTAMENTE UBICADOS
- **Navegación:** ✅ FUNCIONAL
- **Iconos colapsados:** ✅ FUNCIONAL
- **Vue.js routing:** ✅ FUNCIONAL
- **Scripts Vyzor:** ✅ FUNCIONAL

### **🎯 Funcionalidades Pendientes:**
- [ ] Crear más componentes Vue para secciones
- [ ] Integrar con backend Django  
- [ ] Implementar funcionalidad real de badges (datos dinámicos)

---

## 🏥 **NOTAS ESPECÍFICAS NEURAUDIT**

### **📋 Badges Representan:**
- **Nueva Radicación [15]:** Cuentas médicas pendientes de radicar
- **Mis Asignaciones [8]:** Auditorías asignadas pendientes
- **Devoluciones [3]:** Devoluciones por correción  
- **Consultar Glosas [22]:** Glosas generadas pendientes respuesta
- **Conciliación [5]:** Conciliaciones en proceso
- **Autorizar Pagos [12]:** Pagos pendientes autorización
- **Alertas [7]:** Alertas críticas del sistema

### **🎯 Próximos Pasos:**
1. Conectar badges con datos reales del backend Django
2. Implementar componentes Vue para cada sección
3. Agregar funcionalidad CRUD según Resolución 2284 de 2023

---

**🏥 Desarrollado por Analítica Neuronal para EPS Familiar de Colombia**  
**📅 Última actualización:** 29 Julio 2025  
**✅ Estado:** FUNCIONAL Y DOCUMENTADO