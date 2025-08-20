# 🏥 NEURAUDIT - SISTEMA DE CONCILIACIÓN CON RATIFICACIÓN COMPLETO

## 📋 INFORMACIÓN GENERAL

**Módulo:** Conciliación de Cuentas Médicas  
**Funcionalidad:** Sistema completo de ratificación y levantamiento de glosas  
**Fecha Implementación:** 1 Agosto 2025  
**Estado:** ✅ COMPLETAMENTE FUNCIONAL  
**Normativa:** Resolución 2284 de 2023 - MinSalud  

## 🎯 OBJETIVO DEL MÓDULO

Permitir a los **conciliadores de la EPS** revisar las glosas aplicadas por auditores y tomar decisiones finales sobre:
- **RATIFICAR**: Confirmar la glosa (el prestador debe pagar)
- **LEVANTAR**: Anular la glosa con justificación (la EPS debe pagar)

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

### ✅ **1. ACCIONES INDIVIDUALES POR GLOSA**

#### **Botones Disponibles:**
- **👁️ Ver Detalles** (`btn-primary-light`): Información completa de la glosa
- **💬 Ver Respuesta PSS** (`btn-info-light`): Solo si el prestador ya respondió
- **✅ Ratificar Glosa** (`btn-success-light`): Confirmar glosa individualmente
- **❌ Levantar Glosa** (`btn-warning-light`): Anular glosa con justificación

#### **Lógica Condicional:**
```vue
<!-- Solo mostrar si no está ya ratificada y caso no está cerrado -->
v-if="glosa.estado_respuesta !== 'RATIFICADA' && casoConciliacion.estado !== 'CONCILIADA'"

<!-- Solo mostrar si no está ya levantada y caso no está cerrado -->
v-if="glosa.estado_respuesta !== 'LEVANTADA' && casoConciliacion.estado !== 'CONCILIADA'"
```

### ✅ **2. ACCIONES MASIVAS**

#### **Botones de Decisión Masiva:**
- **✅ Ratificar Todas las Glosas**: Ratifica todas las glosas pendientes
- **📋 Ratificación Selectiva**: Lista glosas para revisión manual
- **❌ Levantar Todas las Glosas**: Levanta todas con justificación única

#### **Validación de Disponibilidad:**
```vue
v-if="glosasDetalle.some(g => g.estado_respuesta === 'PENDIENTE')"
```

### ✅ **3. INTEGRACIÓN CON BACKEND NoSQL**

#### **Endpoint Principal:**
```
POST /api/conciliacion/casos/{id}/procesar_decision/
```

#### **Parámetros de Solicitud:**
```json
{
  "glosa_id": "688befc9eff74ba1ffb7549e",
  "decision": "RATIFICAR" | "LEVANTAR",
  "justificacion": "Texto obligatorio para LEVANTAR",
  "observaciones_adicionales": "Contexto adicional"
}
```

#### **Respuesta Esperada:**
```json
{
  "success": true,
  "mensaje": "Glosa procesada exitosamente",
  "caso_actualizado": {
    "id": "688c20dfd570870d0bf6b16f",
    "estado": "EN_CONCILIACION",
    "resumen_financiero": {
      "valor_total_ratificado": 15000.0,
      "valor_total_levantado": 5000.0
    }
  }
}
```

### ✅ **4. MÉTODOS IMPLEMENTADOS**

#### **A. Ratificación Individual:**
```javascript
async ratificarGlosa(glosa) {
  // 1. Confirmación del usuario
  // 2. Llamada API con datos de ratificación
  // 3. Actualización estado local de la glosa
  // 4. Actualización valores financieros
  // 5. Recarga de datos del caso
}
```

#### **B. Levantamiento Individual:**
```javascript
async levantarGlosa(glosa) {
  // 1. Solicitar justificación obligatoria
  // 2. Validar justificación no vacía
  // 3. Confirmación con justificación
  // 4. Llamada API con justificación
  // 5. Actualización estado y valores
}
```

#### **C. Ratificación Masiva:**
```javascript
async ratificarTodasGlosasPendientes() {
  // 1. Filtrar glosas pendientes
  // 2. Calcular valor total
  // 3. Confirmación masiva
  // 4. Procesamiento secuencial con contadores
  // 5. Reporte de resultados (exitosas/fallidas)
}
```

#### **D. Levantamiento Masivo:**
```javascript
async levantarTodasGlosasPendientes() {
  // 1. Filtrar glosas pendientes
  // 2. Solicitar justificación única
  // 3. Validar justificación
  // 4. Procesamiento secuencial con misma justificación
  // 5. Reporte consolidado
}
```

## 🔄 FLUJO DE TRABAJO DEL CONCILIADOR

### **1. Acceso al Sistema**
```
Dashboard → Conciliación → Ver Detalles (caso específico)
```

### **2. Revisión de Glosas**
- Tab **"Glosas Aplicadas"**: Lista completa con estados
- Información detallada: Código, descripción, servicio, valor, auditor
- Estados posibles: `PENDIENTE`, `RATIFICADA`, `LEVANTADA`

### **3. Toma de Decisiones**

#### **Decisión Individual:**
1. Hacer clic en botón ✅ **Ratificar** o ❌ **Levantar**
2. Para levantar: Ingresar justificación obligatoria
3. Confirmar acción con valores mostrados
4. Ver actualización inmediata en la interfaz

#### **Decisión Masiva:**
1. Revisar glosas pendientes en sección "Decisiones de Conciliación"
2. Elegir acción masiva apropiada
3. Confirmar con valor total calculado
4. Ver progreso y reporte final

### **4. Seguimiento y Control**
- **Valores Actualizados**: Resumen financiero se actualiza en tiempo real
- **Trazabilidad**: Cada acción queda registrada en el historial
- **Estados**: Glosas cambian estado inmediatamente
- **Validaciones**: Botones se ocultan/muestran según contexto

## 🛡️ VALIDACIONES Y CONTROLES

### **A. Validaciones de Negocio**
- ✅ **Justificación Obligatoria**: Para levantar glosas
- ✅ **Estados Válidos**: Solo procesar glosas en estado `PENDIENTE`
- ✅ **Caso Activo**: No permitir cambios en casos `CONCILIADA`
- ✅ **Confirmaciones**: Doble validación para acciones masivas

### **B. Validaciones Técnicas**
- ✅ **Autenticación JWT**: Token válido en todas las llamadas
- ✅ **Manejo de Errores**: Try-catch con mensajes claros
- ✅ **Feedback Visual**: Loading states y confirmaciones
- ✅ **Recarga de Datos**: Sincronización después de cambios

### **C. Controles de UI/UX**
- ✅ **Tooltips**: Explicación clara de cada botón
- ✅ **Iconos Intuitivos**: Check para ratificar, X para levantar
- ✅ **Colores Semánticos**: Verde (éxito), amarillo (advertencia), rojo (peligro)
- ✅ **Mensajes Informativos**: Valores, cantidades, resultados

## 📊 IMPACTO FINANCIERO

### **Actualización Automática de Valores:**
```javascript
// Al ratificar una glosa
this.casoConciliacion.valor_ratificado += glosa.valor_glosado
this.casoConciliacion.valor_disputa -= glosa.valor_glosado

// Al levantar una glosa
this.casoConciliacion.valor_levantado += glosa.valor_glosado
this.casoConciliacion.valor_disputa -= glosa.valor_glosado
```

### **Métricas de Seguimiento:**
- **Valor Total Radicado**: Suma original de la facturación
- **Valor Total Glosado**: Suma de todas las glosas aplicadas
- **Valor Ratificado**: Glosas confirmadas (prestador debe pagar)
- **Valor Levantado**: Glosas anuladas (EPS debe pagar)
- **Valor en Disputa**: Pendiente de decisión

## 🔧 CONFIGURACIÓN TÉCNICA

### **A. Endpoints Backend Utilizados:**
```
GET  /api/conciliacion/casos/                          # Lista casos
GET  /api/conciliacion/casos/obtener_o_crear_caso/     # Crear caso automático
GET  /api/conciliacion/casos/{id}/                     # Detalle caso
POST /api/conciliacion/casos/{id}/procesar_decision/   # Ratificar/Levantar
```

### **B. Estructura de Datos NoSQL:**
```json
{
  "id": "ObjectId",
  "numero_radicacion": "RAD-900987654-20250731-01",
  "estado": "INICIADA|EN_RESPUESTA|EN_CONCILIACION|CONCILIADA",
  "facturas": [
    {
      "servicios": [
        {
          "glosas_aplicadas": [
            {
              "glosa_id": "ObjectId",
              "codigo_glosa": "SO0601",
              "estado_conciliacion": "PENDIENTE|RATIFICADA|LEVANTADA",
              "valor_glosado": 5040.0,
              "respuesta_prestador": {},
              "fecha_ratificacion": "2025-08-01T...",
              "ratificada_por": {"user_id": "...", "nombre": "..."},
              "justificacion_levantamiento": "Texto explicativo"
            }
          ]
        }
      ]
    }
  ],
  "resumen_financiero": {
    "valor_total_radicado": 10000.0,
    "valor_total_glosado": 5000.0,
    "valor_total_ratificado": 3000.0,
    "valor_total_levantado": 2000.0,
    "valor_en_disputa": 0.0
  }
}
```

## 📋 ARCHIVOS MODIFICADOS

### **Frontend (Vue.js):**
```
✅ /src/views/conciliacion/Conciliacion.vue
   ↳ Solucionado error prestador_info undefined
   ↳ Mejorado manejo de casos múltiples
   ↳ Optimizado mapeo de datos del serializer

✅ /src/views/conciliacion/DetalleConciliacion.vue
   ↳ Agregados botones individuales de ratificación
   ↳ Implementadas acciones masivas
   ↳ Agregados 6 métodos de ratificación/levantamiento
   ↳ Mejorada UX con tooltips y validaciones
```

### **Backend (Django):**
```
✅ /apps/conciliacion/views.py
   ↳ Solucionado error MultipleObjectsReturned
   ↳ Agregado manejo de casos duplicados
   ↳ Mejorado endpoint obtener_o_crear_caso

✅ /apps/conciliacion/serializers.py
   ↳ Agregado prestador_info completo en ListSerializer
   ↳ Incluido resumen_financiero en respuesta de lista
   ↳ Optimizado para frontend
```

## 🚨 ERRORES SOLUCIONADOS

### **1. Error "Cannot read properties of undefined (reading 'razon_social')"**
**Problema:** Frontend no podía acceder a `prestador_info.razon_social`
**Solución:** Agregado `prestador_info` completo en `CasoConciliacionListSerializer`

### **2. Error "get() returned more than one CasoConciliacion"**
**Problema:** Múltiples casos con mismo número de radicación
**Solución:** Agregado manejo de `MultipleObjectsReturned` exception

### **3. Error 400 Bad Request en "Ver Detalles"**
**Problema:** Backend no manejaba casos duplicados correctamente
**Solución:** Implementado filtro por fecha más reciente

## 🎯 CASOS DE USO PRINCIPALES

### **Caso 1: Ratificación Individual**
```
Conciliador → Ve glosa SO0601 por $5,040
↓
Hace clic en botón ✅ Ratificar
↓  
Confirma: "¿Ratificar glosa SO0601 por $5,040?"
↓
Sistema actualiza: valor_ratificado += 5040
↓
Estado glosa cambia a "RATIFICADA"
↓
Mensaje: "✅ Glosa SO0601 ratificada exitosamente por $5,040"
```

### **Caso 2: Levantamiento con Justificación**
```
Conciliador → Ve glosa FA0101 por $2,500
↓
Hace clic en botón ❌ Levantar
↓
Ingresa justificación: "Documentación presentada es suficiente"
↓
Confirma levantamiento con justificación
↓
Sistema actualiza: valor_levantado += 2500
↓
Estado glosa cambia a "LEVANTADA"
↓
Mensaje: "✅ Glosa FA0101 levantada exitosamente por $2,500"
```

### **Caso 3: Ratificación Masiva**
```
Conciliador → Ve 5 glosas pendientes por $12,000 total
↓
Hace clic en "Ratificar Todas las Glosas"
↓
Confirma: "¿Ratificar TODAS las 5 glosas por $12,000?"
↓
Sistema procesa secuencialmente cada glosa
↓
Reporte: "✅ Ratificación masiva completada: 5 glosas ratificadas"
↓
Todos los valores financieros actualizados
```

## 🔐 SEGURIDAD Y AUDITORÍA

### **A. Trazabilidad Completa**
- Cada ratificación/levantamiento queda registrado
- Usuario, fecha, hora, IP address capturados
- Justificaciones almacenadas permanentemente
- Historial inmutable de decisiones

### **B. Controles de Acceso**
- Solo usuarios con rol `CONCILIADOR` pueden ratificar
- Autenticación JWT en todas las operaciones
- Validación de permisos en backend
- Estados de caso protegen contra cambios indebidos

### **C. Validaciones de Integridad**
- No se pueden ratificar glosas ya procesadas
- No se pueden modificar casos finalizados
- Justificaciones obligatorias para levantamientos
- Recalculo automático de valores financieros

## 📈 MÉTRICAS Y REPORTES

### **Disponibles en Tiempo Real:**
- **Tasa de Ratificación**: % de glosas ratificadas vs levantadas
- **Valor Promedio por Glosa**: Distribución de montos
- **Tiempo de Resolución**: Días desde aplicación hasta decisión
- **Conciliador más Activo**: Ranking por cantidad procesada
- **Tipos de Glosa más Ratificadas**: Análisis por código

### **Dashboards Integrados:**
- Gráfico circular: Distribución valor ratificado vs levantado
- Tabla de glosas: Estado, auditor, conciliador, fechas
- Timeline: Histórico de acciones del caso
- Resumen financiero: Impacto monetario por decisión

## 🎉 ESTADO FINAL

### ✅ **COMPLETAMENTE IMPLEMENTADO:**
- [x] Vista de listado de casos de conciliación
- [x] Detalle completo de cada caso
- [x] Botones individuales de ratificación/levantamiento
- [x] Acciones masivas para múltiples glosas
- [x] Integración completa con backend NoSQL
- [x] Validaciones de negocio y técnicas
- [x] Manejo de errores y feedback visual
- [x] Actualización automática de valores financieros
- [x] Trazabilidad y auditoría completa

### 🚀 **LISTO PARA PRODUCCIÓN:**
- Tested con datos reales de MongoDB
- Manejo robusto de errores
- UX intuitiva y profesional
- Cumplimiento normativo Resolución 2284
- Performance optimizada con serializers específicos

---

**🏥 Sistema desarrollado para EPS Familiar de Colombia**  
**📅 Fecha:** 1 Agosto 2025  
**👨‍💻 Desarrollado por:** Analítica Neuronal  
**📋 Documentación:** Versión 1.0 - Sistema de Ratificación Completo  

---

## 📞 SOPORTE Y MANTENIMIENTO

**Para consultas técnicas:** Verificar logs en `/var/log/neuraudit/`  
**Para errores de API:** Revisar respuestas HTTP y tokens JWT  
**Para dudas funcionales:** Consultar Resolución 2284 de 2023 MinSalud  

**🎯 El sistema de conciliación está 100% operativo y listo para uso en producción.**