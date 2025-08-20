# 📋 NEURAUDIT - DOCUMENTACIÓN DETALLE FACTURA CON ACORDEONES

## 📅 Fecha: 31 Julio 2025
## 👨‍💻 Desarrollador: Analítica Neuronal
## 🏥 Cliente: EPS Familiar de Colombia

---

## 🎯 OBJETIVO

Documentar la implementación de acordeones en la vista de Detalle de Factura del módulo de auditoría médica, incluyendo selector de usuarios, nueva sección de ayudas diagnósticas y referencia de contrato.

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### 1. **Acordeones para Tipos de Servicio**
- ✅ Todas las secciones de servicios convertidas a acordeones Bootstrap
- ✅ Acordeones colapsados por defecto (ninguno expandido al cargar)
- ✅ Diseño manteniendo plantilla Vyzor
- ✅ Badges con conteo de servicios en cada acordeón

### 2. **Selector de Usuarios**
- ✅ Dropdown para filtrar servicios por usuario
- ✅ Extracción automática de usuarios únicos desde datos RIPS
- ✅ Muestra: Tipo Documento + Número + Nombre
- ✅ Opción "Todos los usuarios" por defecto

### 3. **Nueva Sección AYUDAS DIAGNÓSTICAS**
- ✅ Agregada como nuevo tipo de servicio
- ✅ Integrada en estructura de acordeones
- ✅ Soporte completo en filtrado y totales

### 4. **Referencia de Contrato**
- ✅ Número de contrato visible en encabezado de factura
- ✅ Muestra "No especificado" si no hay contrato

---

## 📁 ARCHIVOS MODIFICADOS

### **Frontend Vue3:**
```
/frontend-vue3/src/views/auditoria/DetalleFactura.vue
```

### **Cambios Principales:**

#### 1. **Estructura de Datos:**
```javascript
data() {
  return {
    // ... otros datos
    servicios: {
      consultas: [],
      procedimientos: [],
      medicamentos: [],
      otrosServicios: [],
      urgencias: [],
      hospitalizaciones: [],
      recienNacidos: [],
      ayudasDiagnosticas: [] // ← NUEVO
    },
    usuarioSeleccionado: '',
    usuariosUnicos: [],
    serviciosFiltrados: {
      // misma estructura que servicios
    }
  }
}
```

#### 2. **Template - Selector de Usuario:**
```vue
<div class="row mb-3">
  <div class="col-xl-12">
    <div class="card custom-card">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-3">
            <label class="form-label fw-semibold mb-0">Filtrar por Usuario:</label>
          </div>
          <div class="col-md-6">
            <select v-model="usuarioSeleccionado" class="form-select" @change="filtrarServiciosPorUsuario">
              <option value="">Todos los usuarios</option>
              <option v-for="usuario in usuariosUnicos" :key="usuario.documento" :value="usuario.documento">
                {{ usuario.tipoDocumento }} {{ usuario.documento }} - {{ usuario.nombre }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 3. **Template - Acordeón (Ejemplo Consultas):**
```vue
<div class="accordion-item" v-if="serviciosFiltrados.consultas.length > 0">
  <h2 class="accordion-header">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
            data-bs-target="#collapseConsultas" aria-expanded="false" 
            aria-controls="collapseConsultas">
      <i class="ri-stethoscope-line me-2"></i>
      <span class="fw-semibold">CONSULTAS</span>
      <span class="badge bg-primary ms-2">{{ serviciosFiltrados.consultas.length }}</span>
    </button>
  </h2>
  <div id="collapseConsultas" class="accordion-collapse collapse" 
       data-bs-parent="#serviciosAccordion">
    <!-- Contenido de la tabla -->
  </div>
</div>
```

#### 4. **Métodos Clave:**

```javascript
// Extrae usuarios únicos de todos los servicios
extraerUsuariosUnicos() {
  const usuarios = new Map()
  
  Object.values(this.servicios).forEach(serviciosArray => {
    if (Array.isArray(serviciosArray)) {
      serviciosArray.forEach(servicio => {
        let documento = ''
        let tipoDoc = ''
        let nombre = ''
        
        if (servicio.detalle_json?.usuario_documento) {
          documento = servicio.detalle_json.usuario_documento
          tipoDoc = servicio.detalle_json.tipo_documento || 'CC'
          nombre = servicio.detalle_json.nombre_usuario || `Usuario ${documento}`
        } else if (servicio.numero_documento) {
          // Para recién nacidos
          documento = servicio.numero_documento
          tipoDoc = servicio.tipo_documento || 'RC'
          nombre = 'Recién Nacido'
        }
        
        if (documento && !usuarios.has(documento)) {
          usuarios.set(documento, { documento, tipoDocumento: tipoDoc, nombre })
        }
      })
    }
  })
  
  this.usuariosUnicos = Array.from(usuarios.values())
  this.serviciosFiltrados = { ...this.servicios }
}

// Filtra servicios por usuario seleccionado
filtrarServiciosPorUsuario() {
  if (!this.usuarioSeleccionado) {
    this.serviciosFiltrados = { ...this.servicios }
    return
  }
  
  this.serviciosFiltrados = {
    consultas: this.servicios.consultas.filter(s => 
      s.detalle_json?.usuario_documento === this.usuarioSeleccionado
    ),
    // ... mismo patrón para otros tipos
    recienNacidos: this.servicios.recienNacidos.filter(s => 
      s.numero_documento === this.usuarioSeleccionado
    ),
    ayudasDiagnosticas: this.servicios.ayudasDiagnosticas.filter(s => 
      s.detalle_json?.usuario_documento === this.usuarioSeleccionado
    )
  }
}
```

---

## 🔧 INTEGRACIÓN CON BACKEND

### **Endpoints Utilizados:**
- `GET /api/auditoria/facturas/{facturaId}/` - Información de la factura
- `GET /api/auditoria/facturas/{facturaId}/servicios/` - Servicios agrupados por tipo

### **Estructura de Respuesta Esperada:**
```json
{
  "factura_id": "66a7f8d9c1234567890abcde",
  "numero_factura": "FE-2025-0001",
  "total_servicios": 45,
  "servicios_por_tipo": {
    "CONSULTA": [...],
    "PROCEDIMIENTO": [...],
    "MEDICAMENTO": [...],
    "OTRO_SERVICIO": [...],
    "URGENCIA": [...],
    "HOSPITALIZACION": [...],
    "RECIEN_NACIDO": [...],
    "AYUDA_DIAGNOSTICA": [...]
  }
}
```

### **Estructura de Servicio:**
```json
{
  "id": "66a7f8d9c1234567890abcdf",
  "tipo_servicio": "CONSULTA",
  "codConsulta": "890201",
  "descripcion": "Consulta medicina general",
  "vrServicio": 45000,
  "tiene_glosa": false,
  "glosas_aplicadas": [],
  "detalle_json": {
    "usuario_documento": "1234567890",
    "tipo_documento": "CC",
    "nombre_usuario": "Juan Pérez",
    "fecha_atencion": "2025-07-15T10:30:00",
    "diagnostico_principal": "I10X",
    "autorizacion": "AUT-2025-0001"
  }
}
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### 1. **Acordeones Bootstrap:**
- Requieren Bootstrap 5+ para funcionar correctamente
- Clases críticas: `accordion`, `accordion-item`, `accordion-header`, `accordion-button`, `accordion-collapse`
- Atributos importantes: `data-bs-toggle="collapse"`, `data-bs-target`, `aria-expanded`, `data-bs-parent`

### 2. **Extracción de Usuarios:**
- Depende del campo `detalle_json` en cada servicio
- Casos especiales: Recién nacidos usan `numero_documento` directamente
- Si no hay información de usuario, el servicio no aparecerá al filtrar

### 3. **Performance:**
- Los acordeones mejoran el rendimiento al no renderizar contenido oculto
- El filtrado es reactivo y se actualiza instantáneamente
- Todos los cálculos (totales, conteos) son computed properties

### 4. **Estado Inicial:**
- TODOS los acordeones inician COLAPSADOS (collapsed)
- El selector de usuarios muestra "Todos los usuarios" por defecto
- Los servicios filtrados incluyen todos los servicios al cargar

---

## 🚨 ADVERTENCIAS CRÍTICAS

### ❌ **NUNCA HACER:**
1. Cambiar la estructura de acordeones sin mantener los IDs únicos
2. Modificar el método de extracción de usuarios sin verificar todos los tipos de servicio
3. Eliminar las clases Bootstrap de los acordeones
4. Cambiar `serviciosFiltrados` por `servicios` en el template

### ✅ **SIEMPRE HACER:**
1. Mantener sincronizados `servicios` y `serviciosFiltrados`
2. Verificar que todos los tipos de servicio tengan estructura similar
3. Usar `v-if` para ocultar acordeones vacíos
4. Llamar `extraerUsuariosUnicos()` después de cargar servicios

---

## 📊 FLUJO DE DATOS

```
1. mounted() → cargarDetalleFactura(facturaId)
   ↓
2. Fetch factura data → Actualiza this.factura
   ↓
3. Fetch servicios → Organiza por tipo en this.servicios
   ↓
4. extraerUsuariosUnicos() → Llena this.usuariosUnicos
   ↓
5. Inicializa this.serviciosFiltrados = {...this.servicios}
   ↓
6. Usuario selecciona filtro → filtrarServiciosPorUsuario()
   ↓
7. Actualiza this.serviciosFiltrados → Vue reactivo actualiza vista
```

---

## 🔄 ESTADO ACTUAL

- ✅ **Acordeones**: Funcionando correctamente, colapsados por defecto
- ✅ **Selector usuarios**: Implementado, esperando datos reales del backend
- ✅ **Ayudas diagnósticas**: Sección agregada y funcional
- ✅ **Número contrato**: Visible en encabezado
- ✅ **Filtrado**: Lógica implementada y funcionando
- ⏳ **Datos usuarios**: Dependiente de estructura `detalle_json` del backend

---

## 📝 LOGS DE DEBUG

Se agregaron console.log para diagnóstico:
```javascript
console.log('Servicios recibidos del backend:', serviciosData)
console.log('Extrayendo usuarios únicos de servicios:', this.servicios)
console.log('Usuarios únicos extraídos:', this.usuariosUnicos)
```

Estos ayudan a verificar:
1. Qué datos envía el backend
2. Cómo se procesan los servicios
3. Qué usuarios se extraen

---

## 💾 BACKUP PROTEGIDO

```bash
# Crear backup con fecha/hora actual
TIMESTAMP=$(date +%Y%m%d-%H%M)
cd /home/adrian_carvajal/Analí®/neuraudit/
cp -r frontend-vue3 frontend-vue3-backup-acordeones-usuarios-$TIMESTAMP/

# El backup contiene:
# - Vista DetalleFactura.vue con acordeones funcionando
# - Selector de usuarios implementado
# - Nueva sección ayudas diagnósticas
# - Referencia de contrato en header
```

---

## 🎯 RESUMEN EJECUTIVO

La vista de Detalle de Factura ha sido exitosamente mejorada con:
1. **Mejor UX**: Acordeones permiten vista más limpia y navegación eficiente
2. **Filtrado por usuario**: Facilita auditoría de servicios multi-usuario
3. **Nueva sección**: Ayudas diagnósticas como tipo de servicio adicional
4. **Información completa**: Número de contrato visible en encabezado

El sistema está preparado para recibir datos reales del backend y mostrar usuarios únicos automáticamente.

---

**Desarrollado por Analítica Neuronal**  
**Fecha: 31 Julio 2025**  
**Cliente: EPS Familiar de Colombia**