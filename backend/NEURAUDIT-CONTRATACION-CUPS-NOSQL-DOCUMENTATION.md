# 📋 GESTIÓN DE SERVICIOS CUPS CONTRACTUALES - NoSQL PURO

## 📌 RESUMEN EJECUTIVO

Se implementó un sistema **100% NoSQL MongoDB** para gestión de servicios CUPS en contratos, sin usar Django ORM.

### ✅ FUNCIONALIDADES IMPLEMENTADAS:

1. **Servicio MongoDB Puro** para gestión de tarifarios CUPS contractuales
2. **APIs REST** para todas las operaciones CRUD
3. **Validación automática** de tarifas para glosas TA
4. **Importación/Exportación** masiva desde/hacia Excel  
5. **Cálculo automático** de variaciones vs ISS/SOAT
6. **Estadísticas en tiempo real** con agregaciones MongoDB
7. **Componente React** completo para gestión visual

## 🏗️ ARQUITECTURA NOSQL

### 📁 Backend - MongoDB Puro

```python
# apps/contratacion/services_mongodb_cups.py
class ServiciosCUPSContractualesNoSQL:
    """
    Gestión NoSQL pura de servicios CUPS en contratos con tarifas negociadas
    """
    
    def __init__(self):
        self.db = get_mongodb().db
        self.tarifarios_cups = self.db.tarifarios_cups_contractuales
        self.catalogo_cups = self.db.catalogo_cups_oficial
        self.tarifarios_iss = self.db.tarifario_iss_2001
        self.tarifarios_soat = self.db.tarifario_soat_2025
```

### 🗄️ Estructura de Documento MongoDB:

```javascript
{
    "_id": ObjectId("..."),
    "contrato_id": ObjectId("..."),
    "numero_contrato": "CNT-2025-001",
    "prestador_nit": "900123456-1",
    "codigo_cups": "890201",
    "descripcion": "CONSULTA PRIMERA VEZ MEDICINA GENERAL",
    
    // Valores tarifarios
    "valor_negociado": 15000,
    "valor_referencia": 8755,  // ISS 2001 base
    "manual_referencia": "ISS_2001",
    "porcentaje_variacion": 71.3,
    
    // Configuración financiera
    "aplica_copago": false,
    "aplica_cuota_moderadora": false,
    "requiere_autorizacion": false,
    
    // Restricciones
    "restricciones": {
        "sexo": "AMBOS",
        "ambito": "AMBOS",
        "edad_minima": null,
        "edad_maxima": null
    },
    
    // Vigencia
    "vigencia_desde": ISODate("2025-01-01"),
    "vigencia_hasta": ISODate("2025-12-31"),
    "estado": "ACTIVO",
    
    // Metadata
    "created_at": ISODate("2025-08-27T14:00:00Z"),
    "updated_at": ISODate("2025-08-27T14:00:00Z"),
    "created_by": "user_id_123"
}
```

## 🔌 APIs IMPLEMENTADAS

### 1️⃣ **Buscar Tarifas CUPS**
```bash
GET /api/contratacion/mongodb/servicios-cups/
?contrato_id=xxx&codigo_cups=890201&fecha_servicio=2025-08-27
```

### 2️⃣ **Agregar Servicios CUPS**
```bash
POST /api/contratacion/mongodb/servicios-cups/
{
    "contrato_id": "xxx",
    "servicios": [
        {
            "codigo_cups": "890201",
            "descripcion": "CONSULTA MEDICINA GENERAL",
            "valor_negociado": 15000,
            "aplica_copago": false,
            "requiere_autorizacion": false,
            "restricciones": {
                "sexo": "AMBOS",
                "ambito": "AMBOS"
            }
        }
    ]
}
```

### 3️⃣ **Validar Tarifa para Glosas TA**
```bash
POST /api/contratacion/mongodb/validar-tarifa-cups/
{
    "contrato_id": "xxx",
    "codigo_cups": "890201",
    "valor_facturado": 20000,
    "fecha_servicio": "2025-08-27"
}

# Respuesta:
{
    "valido": false,
    "glosa_aplicable": "TA0101",
    "descripcion_glosa": "Tarifa facturada excede valor contractual en 33.3%",
    "codigo_cups": "890201",
    "valor_facturado": 20000,
    "valor_contractual": 15000,
    "diferencia": 5000,
    "porcentaje_diferencia": 33.3
}
```

### 4️⃣ **Estadísticas del Contrato**
```bash
GET /api/contratacion/mongodb/estadisticas-contrato/{contrato_id}/
```

### 5️⃣ **Importar desde Excel**
```bash
POST /api/contratacion/mongodb/importar-servicios-cups/
Content-Type: multipart/form-data
- contrato_id: xxx
- archivo: tarifario.xlsx
```

### 6️⃣ **Exportar a Excel**
```bash
GET /api/contratacion/mongodb/exportar-tarifario/{contrato_id}/
```

## 🎨 Frontend React

### Componente Principal: `ServiciosCUPSContractuales`

**Características:**
- Tabla interactiva con búsqueda
- Modal para agregar servicios individuales
- Importación masiva desde Excel
- Exportación a Excel con formato
- Badges visuales para variaciones
- Estadísticas en tiempo real

### Service TypeScript:
```typescript
// contratacionServiceMongoDB.ts
export const contratacionMongoDBService = {
    buscarTarifasCUPS: async (params) => {...},
    agregarServiciosCUPS: async (contratoId, servicios) => {...},
    validarTarifaCUPS: async (params) => {...},
    obtenerEstadisticasContrato: async (contratoId) => {...},
    importarServiciosCUPS: async (contratoId, archivo) => {...},
    exportarTarifario: async (contratoId) => {...}
}
```

## 🔍 ÍNDICES MONGODB

```javascript
// Índice compuesto único
db.tarifarios_cups_contractuales.createIndex({
    "contrato_id": 1,
    "codigo_cups": 1
}, { unique: true })

// Índices para búsquedas
db.tarifarios_cups_contractuales.createIndex({
    "contrato_id": 1,
    "estado": 1,
    "vigencia_desde": -1
})

db.tarifarios_cups_contractuales.createIndex({
    "codigo_cups": 1,
    "estado": 1
})
```

## 📊 AGREGACIONES IMPLEMENTADAS

### Pipeline de Estadísticas:
```javascript
[
    { $match: { contrato_id: ObjectId("...") }},
    {
        $facet: {
            resumen: [...],
            por_tipo: [...],
            variaciones_extremas: [...]
        }
    }
]
```

## 🚀 VENTAJAS DEL ENFOQUE NoSQL

1. **Rendimiento**: Consultas directas sin ORM overhead
2. **Escalabilidad**: Preparado para millones de tarifas
3. **Flexibilidad**: Esquema dinámico para restricciones
4. **Agregaciones**: Análisis complejos en tiempo real
5. **Bulk Operations**: Importación masiva optimizada

## 📋 CASOS DE USO

### 1. **Auditoría Médica**
- Validar tarifas facturadas vs contractuales
- Generar glosas TA automáticamente
- Identificar variaciones extremas

### 2. **Gestión Contractual**
- Mantener tarifarios actualizados
- Control de vigencias
- Análisis de negociación

### 3. **Importación Masiva**
- Cargar miles de servicios desde Excel
- Actualización batch de tarifas
- Sincronización con sistemas externos

## 🔐 VALIDACIONES IMPLEMENTADAS

1. **Tarifa no contratada**: Glosa TA0301
2. **Tarifa mayor a contractual**: Glosa TA0101 
3. **Restricciones de servicio**: Sexo, ámbito, edad
4. **Vigencia contractual**: Validación de fechas
5. **Autorización requerida**: Flag para auditoría

## 📈 MÉTRICAS Y KPIs

- Total servicios por contrato
- Valor promedio negociado
- Porcentaje de variación vs ISS/SOAT
- Servicios que requieren autorización
- Distribución por tipo (quirúrgico/no quirúrgico)

## 🧪 PRUEBAS

Componente de prueba disponible en:
`/components/neuraudit/contratacion/test-servicios-cups.tsx`

## 🔧 CONFIGURACIÓN

```python
# settings.py
MONGODB_URI = 'mongodb://localhost:27017/'
MONGODB_DATABASE = 'neuraudit_colombia_db'
```

---

**Desarrollado por:** Analítica Neuronal  
**Fecha:** 27 Agosto 2025  
**Estado:** ✅ 100% Funcional - NoSQL Puro