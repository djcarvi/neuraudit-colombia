# 📊 NEURAUDIT - CONSULTA DE RADICACIONES REAL

## 📅 **INFORMACIÓN DE LA IMPLEMENTACIÓN**
- **Fecha:** 30 Julio 2025
- **Funcionalidad:** Consulta de radicaciones reales desde MongoDB
- **Problema Resuelto:** Reemplazo de datos hardcodeados por consulta dinámica
- **Estado:** ✅ **IMPLEMENTADO Y FUNCIONANDO**

---

## 🎯 **OBJETIVO CUMPLIDO**

### **Requerimiento del Usuario:**
> "Ahora necesito la funcionalidad completa y real de consultar radicaciones, las radicaciones que hicimos en el módulo anterior ya deberían entonces guardar en mongo y consultarse en en consultar radicaciones. Siempre siguiendo la plantilla"

### **Solución Implementada:**
- ✅ Consulta real a MongoDB usando el API backend
- ✅ Filtros funcionales: búsqueda, prestador, estado, fecha
- ✅ Paginación dinámica con cálculo inteligente
- ✅ Botones de acción funcionales: ver, editar, descargar
- ✅ Export a Excel y descarga de PDF
- ✅ Diseño consistente con plantilla Vyzor

---

## 🔧 **IMPLEMENTACIÓN TÉCNICA**

### **1. Frontend - ConsultaRadicaciones.vue**

**Archivo:** `/frontend-vue3/src/views/radicacion/ConsultaRadicaciones.vue`

#### **Características Implementadas:**

```javascript
// Datos reactivos
data() {
  return {
    radicaciones: [],      // Array de radicaciones desde MongoDB
    loading: false,        // Estado de carga
    filters: {
      search: '',         // Búsqueda por número radicado
      prestador: '',      // NIT o nombre prestador
      estado: '',         // Estado de radicación
      fecha_desde: ''     // Fecha desde
    },
    pagination: {
      current: 1,         // Página actual
      total: 0,          // Total de registros
      perPage: 10        // Registros por página
    }
  }
}
```

#### **Métodos Principales:**

1. **searchRadicaciones()** - Consulta real al API
```javascript
async searchRadicaciones() {
  const response = await axios.get('/api/radicacion/', { params })
  this.radicaciones = response.data.results || []
  // Calcular días transcurridos dinámicamente
}
```

2. **formatDate()** - Formato de fechas con date-fns
3. **formatCurrency()** - Formato de moneda colombiana
4. **getEstadoBadgeClass()** - Clases CSS por estado
5. **getDiasBadgeClass()** - Colores por antigüedad

#### **Acciones en Tabla:**
- **Ver Detalle**: Navega a `/radicacion/detalle/{id}`
- **Editar**: Solo habilitado para estado BORRADOR
- **Descargar**: Genera PDF con información completa

---

### **2. Backend - Endpoints Agregados**

**Archivo:** `/backend/apps/radicacion/views.py`

#### **Export a Excel:**
```python
@action(detail=False, methods=['get'])
def export(self, request):
    """
    GET /api/radicacion/export/
    Exporta listado filtrado a Excel
    """
    # Usa openpyxl para generar Excel
    # Incluye todos los campos relevantes
    # Respeta filtros aplicados
```

#### **Download PDF:**
```python
@action(detail=True, methods=['get'])
def download(self, request, pk=None):
    """
    GET /api/radicacion/{id}/download/
    Genera PDF con información completa
    """
    # Usa reportlab para generar PDF
    # Incluye información general
    # Lista todos los documentos soporte
```

---

## 📋 **CARACTERÍSTICAS IMPLEMENTADAS**

### **1. Filtros Funcionales:**
- ✅ Búsqueda por número de radicado
- ✅ Filtro por NIT o nombre de prestador
- ✅ Filtro por estado (todos los estados del modelo)
- ✅ Filtro por fecha desde
- ✅ Búsqueda al presionar Enter o botón

### **2. Tabla Dinámica:**
- ✅ Datos reales desde MongoDB
- ✅ Cálculo de días transcurridos en tiempo real
- ✅ Badges con colores según estado
- ✅ Badges de días con colores por urgencia
- ✅ Avatar con icono de hospital para prestadores

### **3. Paginación Inteligente:**
```javascript
// Muestra páginas con puntos suspensivos
1 2 3 ... 10        // Si estás en primeras páginas
1 ... 4 5 6 ... 10  // Si estás en páginas intermedias  
1 ... 8 9 10        // Si estás en últimas páginas
```

### **4. Estados de UI:**
- ✅ Loading spinner mientras carga
- ✅ Empty state cuando no hay resultados
- ✅ Mensaje descriptivo con botón para nueva radicación

### **5. Acciones por Registro:**
- ✅ **Ver detalle** - Siempre habilitado
- ✅ **Editar** - Solo para BORRADOR
- ✅ **Descargar** - Genera PDF individual

### **6. Acciones Globales:**
- ✅ **Exportar** - Excel con todos los registros filtrados
- ✅ **Imprimir** - Impresión de la vista actual

---

## 🔄 **FLUJO DE DATOS**

```
1. Usuario aplica filtros
   ↓
2. Frontend envía GET /api/radicacion/?search=X&estado=Y
   ↓
3. Backend aplica filtros en MongoDB
   ↓
4. Backend retorna datos paginados
   ↓
5. Frontend calcula días y formatea datos
   ↓
6. UI muestra tabla con acciones
```

---

## 📊 **MAPEO DE ESTADOS Y COLORES**

### **Estados:**
```javascript
BORRADOR → bg-secondary-transparent
RADICADA → bg-primary-transparent
DEVUELTA → bg-warning-transparent
EN_AUDITORIA → bg-info-transparent
GLOSADA → bg-danger-transparent
APROBADA → bg-success-transparent
PAGADA → bg-success-transparent
```

### **Días Transcurridos:**
```javascript
0-1 días → bg-success (verde)
2-3 días → bg-warning (amarillo)
4-5 días → bg-info (azul)
6+ días → bg-danger (rojo)
```

---

## 🔒 **ARCHIVOS MODIFICADOS**

### **Frontend:**
```
/frontend-vue3/src/views/radicacion/ConsultaRadicaciones.vue
├── Script: Métodos para consulta real
├── Template: Tabla dinámica con v-for
└── Computed: Paginación inteligente
```

### **Backend:**
```
/backend/apps/radicacion/views.py
├── export(): Exportación a Excel
└── download(): Generación de PDF

/backend/requirements.txt
└── reportlab==4.0.4 (agregado para PDFs)
```

---

## 🧪 **PRUEBAS RECOMENDADAS**

1. **Verificar carga inicial:**
   - Debe cargar automáticamente al montar componente
   - Spinner debe mostrarse durante carga

2. **Probar filtros:**
   - Cada filtro debe aplicarse correctamente
   - Combinación de filtros debe funcionar

3. **Verificar paginación:**
   - Navegación entre páginas
   - Cálculo correcto de registros mostrados

4. **Probar acciones:**
   - Editar solo en BORRADOR
   - Descarga de PDF individual
   - Export general a Excel

---

## 🚨 **CONSIDERACIONES IMPORTANTES**

1. **Permisos:**
   - PSS solo ve sus propias radicaciones
   - EPS ve todas las radicaciones
   - Auditores ven solo EN_AUDITORIA

2. **Performance:**
   - Paginación server-side para grandes volúmenes
   - Índices en MongoDB por campos de búsqueda

3. **Dependencias:**
   - axios para llamadas HTTP
   - date-fns para formateo de fechas
   - reportlab para generación de PDFs
   - openpyxl para exportación Excel

---

## 📊 **ESTRUCTURA DE RESPUESTA API**

```json
{
  "count": 150,
  "next": "http://localhost:8003/api/radicacion/?page=2",
  "previous": null,
  "results": [
    {
      "id": "66a8f5c8d3a7b2001c8b4567",
      "numero_radicado": "RAD-123456789-20250730-01",
      "created_at": "2025-07-30T10:30:00Z",
      "pss_nit": "123456789-0",
      "pss_nombre": "CLINICA EJEMPLO S.A.S",
      "factura_numero": "FE-2025-0001",
      "factura_valor_total": 15678900.00,
      "estado": "RADICADA",
      "modalidad_pago": "EVENTO",
      "tipo_servicio": "AMBULATORIO"
    }
  ]
}
```

---

**🏥 Sistema de Consulta de Radicaciones - NeurAudit Colombia**  
**📅 Implementado:** 30 Julio 2025  
**🎯 Estado:** ✅ FUNCIONAL  
**📋 Versión:** 1.0 Real Data Consultation  

---

## 📋 **RESUMEN EJECUTIVO**

**PROBLEMA:** Vista con datos hardcodeados sin conexión real a MongoDB.

**SOLUCIÓN:** Implementación completa de consulta dinámica con filtros, paginación y acciones.

**RESULTADO:** Sistema funcional que consulta radicaciones reales desde MongoDB siguiendo la plantilla Vyzor.

**IMPACTO:** Usuarios pueden consultar, filtrar, exportar y gestionar sus radicaciones de forma completa.