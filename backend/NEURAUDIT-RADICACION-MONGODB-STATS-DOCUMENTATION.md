# 📊 NEURAUDIT - SISTEMA DE ESTADÍSTICAS MONGODB PARA RADICACIÓN

## 📋 INFORMACIÓN DEL PROYECTO

**Fecha:** 27 Agosto 2025  
**Desarrollador:** Analítica Neuronal  
**Cliente:** EPS Familiar de Colombia  
**Módulo:** Radicación - Vista de Consulta con Estadísticas Reales  
**Versión:** Sistema completo implementado  

---

## 🎯 OBJETIVO PRINCIPAL

Eliminar completamente los **datos hardcodeados** de la vista de radicación y reemplazarlos con **estadísticas reales desde MongoDB**, proporcionando información precisa y actualizada del estado real de las radicaciones en el sistema.

---

## 🚨 PROBLEMA IDENTIFICADO

### **Datos Hardcodeados en Frontend:**
- ✅ Total Radicaciones: `2450` (hardcodeado)
- ✅ Valor Total: `$0` (hardcodeado)
- ✅ En Auditoría: `0` (hardcodeado)
- ✅ Pendientes: `0` (hardcodeado) - **Usuario reportó que debería mostrar 1**
- ✅ Devueltas: `50` (hardcodeado)

### **Endpoints Incorrectos:**
- ❌ Frontend usaba: `/api/radicacion/dashboard_stats/` (Django ORM)
- ✅ Debería usar: `/api/radicacion/mongodb/stats/` (MongoDB directo)

---

## 🏗️ ARQUITECTURA IMPLEMENTADA

### **Backend - MongoDB NoSQL Puro**

#### **1. Servicio MongoDB (`services_mongodb_radicacion_contrato.py`)**
```python
def obtener_estadisticas_radicaciones(self) -> Dict[str, Any]:
    """
    Obtener estadísticas consolidadas de radicaciones desde MongoDB
    """
    try:
        # Total de radicaciones
        total_radicaciones = self.radicaciones.count_documents({})
        
        # Estadísticas por estado
        pipeline_estados = [
            {
                '$group': {
                    '_id': '$estado',
                    'count': {'$sum': 1},
                    'valor_total': {'$sum': '$valor_factura'}
                }
            }
        ]
        stats_by_estado = list(self.radicaciones.aggregate(pipeline_estados))
        
        # Radicaciones del último mes
        ultimo_mes = datetime.now() - timedelta(days=30)
        radicaciones_ultimo_mes = self.radicaciones.count_documents({
            'fecha_radicacion': {'$gte': ultimo_mes}
        })
        
        # Próximas a vencer (más de 15 días)
        hace_15_dias = datetime.now() - timedelta(days=15)
        proximas_vencer = self.radicaciones.count_documents({
            'fecha_radicacion': {'$lte': hace_15_dias},
            'estado': {'$in': ['RADICADA', 'EN_AUDITORIA']}
        })
        
        # Vencidas (más de 30 días sin procesar)
        hace_30_dias = datetime.now() - timedelta(days=30)
        vencidas = self.radicaciones.count_documents({
            'fecha_radicacion': {'$lte': hace_30_dias},
            'estado': {'$in': ['RADICADA', 'EN_AUDITORIA']}
        })
        
        return {
            'total_radicaciones': total_radicaciones,
            'stats_by_estado': estados_formateados,
            'radicaciones_ultimo_mes': radicaciones_ultimo_mes,
            'proximas_vencer': proximas_vencer,
            'vencidas': vencidas,
            'valor_total': valor_total
        }
```

#### **2. Vista API (`views_mongodb_radicacion_contrato.py`)**
```python
class RadicacionesMongoDBStatsAPIView(APIView):
    """
    API para obtener estadísticas de radicaciones desde MongoDB
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        GET /api/radicacion/mongodb/stats/
        """
        try:
            stats = radicacion_contrato_service.obtener_estadisticas_radicaciones()
            
            return Response({
                'success': True,
                'total_radicaciones': stats.get('total_radicaciones', 0),
                'stats_by_estado': stats.get('stats_by_estado', []),
                'radicaciones_ultimo_mes': stats.get('radicaciones_ultimo_mes', 0),
                'proximas_vencer': stats.get('proximas_vencer', 0),
                'vencidas': stats.get('vencidas', 0),
                'valor_total': stats.get('valor_total', 0),
                'fecha_consulta': datetime.now().isoformat()
            })
```

#### **3. URLs Configuradas (`urls.py`)**
```python
urlpatterns = [
    # MongoDB NoSQL endpoints para radicación con contratos
    path('mongodb/stats/', 
         RadicacionesMongoDBStatsAPIView.as_view(), 
         name='radicaciones-mongodb-stats'),
    
    path('mongodb/list/', 
         RadicacionesMongoDBListAPIView.as_view(), 
         name='radicaciones-mongodb-list'),
]
```

### **Frontend - Integración con MongoDB**

#### **1. Servicio Actualizado (`radicacionService.ts`)**
```typescript
interface RadicacionStats {
  success: boolean;
  total_radicaciones: number;
  stats_by_estado: Array<{
    estado: string;
    count: number;
  }>;
  radicaciones_ultimo_mes: number;
  proximas_vencer: number;
  vencidas: number;
  valor_total: number;  // ← AGREGADO
  fecha_consulta: string;
}

async getRadicacionStats(): Promise<RadicacionStats> {
  try {
    // CAMBIO CRÍTICO: Usar endpoint MongoDB en lugar del Django ORM
    const response = await httpInterceptor.get('/api/radicacion/mongodb/stats/');
    return response;
  } catch (error) {
    console.error('Error loading radicacion stats from MongoDB:', error);
    throw error;
  }
}
```

#### **2. Componente con Datos Reales (`radicacion-list.tsx`)**
```typescript
const loadRadicacionData = async () => {
  try {
    // Cargar estadísticas para las tarjetas
    const stats = await radicacionService.getRadicacionStats();
    
    // Actualizar las tarjetas con datos reales del backend
    const updatedCards = [...RadicacionCard];
    
    // Calcular estadísticas desde la respuesta
    const totalRadicaciones = stats.total_radicaciones || 0;
    const radicacionesUltimoMes = stats.radicaciones_ultimo_mes || 0;
    const proximasVencer = stats.proximas_vencer || 0;
    const vencidas = stats.vencidas || 0;
    
    // Contar por estados
    let enAuditoriaCount = 0;
    let devueltasCount = 0;
    let pendientesCount = 0;  // ← CORREGIDO: Usar RADICADA en lugar de proximas_vencer
    const valorTotal = stats.valor_total || 0;
    
    if (stats.stats_by_estado) {
      stats.stats_by_estado.forEach((estadoInfo: any) => {
        if (estadoInfo.estado === 'EN_AUDITORIA') {
          enAuditoriaCount = estadoInfo.count;
        }
        if (estadoInfo.estado === 'DEVUELTA') {
          devueltasCount = estadoInfo.count;
        }
        if (estadoInfo.estado === 'RADICADA') {  // ← PENDIENTES = RADICADA
          pendientesCount = estadoInfo.count;
        }
      });
    }
    
    // Formatear valor total como moneda colombiana
    const valorTotalFormateado = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valorTotal);
    
    // TARJETA 0 - Total Radicaciones
    updatedCards[0] = {
      ...updatedCards[0],
      titles: 'Total Radicaciones',
      count: totalRadicaciones.toString(),
      percent: `${porcentajeCambio.toFixed(1)}%`
    };
    
    // TARJETA 1 - Valor Total (CORREGIDO: usar valor_total real)
    updatedCards[1] = {
      ...updatedCards[1],
      titles: 'Valor Total',
      count: valorTotalFormateado,
      percent: valorTotal > 0 ? `${((valorTotal / 1000000)).toFixed(1)}M` : '0'
    };
    
    // TARJETA 2 - En Auditoría
    updatedCards[2] = {
      ...updatedCards[2],
      titles: 'En Auditoría',
      count: enAuditoriaCount.toString(),
      percent: totalRadicaciones > 0 ? 
        `${((enAuditoriaCount / totalRadicaciones) * 100).toFixed(1)}%` : '0%'
    };
    
    // TARJETA 3 - Pendientes (CORREGIDO: usar pendientesCount)
    updatedCards[3] = {
      ...updatedCards[3],
      titles: 'Pendientes',
      count: pendientesCount.toString(),  // ← Estado RADICADA
      percent: `${vencidas} vencidas`
    };
    
    // TARJETA 4 - Devueltas (AGREGADA)
    updatedCards[4] = {
      ...updatedCards[4],
      titles: 'Devueltas',
      count: devueltasCount.toString(),
      percent: totalRadicaciones > 0 ? 
        `${((devueltasCount / totalRadicaciones) * 100).toFixed(2)}%` : '0%'
    };
    
    setRadicacionCards(updatedCards);
  }
};
```

---

## 📊 MAPEO DE ESTADOS Y TARJETAS

### **Tarjetas Dashboard:**

| **Tarjeta** | **Fuente de Datos** | **Descripción** |
|-------------|-------------------|-----------------|
| **Total Radicaciones** | `stats.total_radicaciones` | Conteo total de documentos en colección |
| **Valor Total** | `stats.valor_total` | Suma de todos los `valor_factura` |
| **En Auditoría** | `stats_by_estado` donde `estado = 'EN_AUDITORIA'` | Radicaciones siendo auditadas |
| **Pendientes** | `stats_by_estado` donde `estado = 'RADICADA'` | Radicaciones esperando auditoría |
| **Devueltas** | `stats_by_estado` donde `estado = 'DEVUELTA'` | Radicaciones devueltas por errores |

### **Estados de Radicación:**

| **Estado** | **Significado** | **Impacto en Tarjetas** |
|------------|-----------------|-------------------------|
| `BORRADOR` | En construcción | No visible en dashboard |
| `RADICADA` | Radicada exitosamente, esperando auditoría | **Pendientes** |
| `DEVUELTA` | Devuelta por errores/inconsistencias | **Devueltas** |
| `EN_AUDITORIA` | Siendo auditada por personal médico | **En Auditoría** |
| `AUDITADA` | Auditoría completada | No visible en dashboard |
| `PAGADA` | Proceso completado y pagado | No visible en dashboard |

---

## 🔧 CORRECCIONES CRÍTICAS IMPLEMENTADAS

### **1. Error en Tarjeta "Pendientes"**
```typescript
// ❌ ANTES (INCORRECTO):
count: proximasVencer.toString(),  // Usaba cálculo de fecha

// ✅ DESPUÉS (CORRECTO):
count: pendientesCount.toString(), // Usa estado 'RADICADA'
```

**Justificación:** Las radicaciones **pendientes** son las que están en estado `RADICADA`, esperando ser asignadas y auditadas, no las que están próximas a vencer por tiempo.

### **2. Error en Tarjeta "Valor Total"**
```typescript
// ❌ ANTES (HARDCODEADO):
count: `$0`, // Por ahora 0, el backend no devuelve valor total

// ✅ DESPUÉS (REAL):
count: valorTotalFormateado, // CORREGIDO: usar valor_total real del backend
```

**Justificación:** El backend SÍ devuelve `valor_total` en las estadísticas, estaba siendo ignorado.

### **3. Error en Endpoint de Estadísticas**
```typescript
// ❌ ANTES (ENDPOINT DJANGO ORM):
const response = await httpInterceptor.get('/api/radicacion/dashboard_stats/');

// ✅ DESPUÉS (ENDPOINT MONGODB):
const response = await httpInterceptor.get('/api/radicacion/mongodb/stats/');
```

**Justificación:** El sistema está migrado completamente a MongoDB NoSQL, no debe usar endpoints de Django ORM.

---

## 🎯 RESULTADOS OBTENIDOS

### **✅ Antes vs Después:**

| **Métrica** | **Antes (Hardcoded)** | **Después (MongoDB)** |
|-------------|----------------------|----------------------|
| Total Radicaciones | `2450` | **Dinámico desde DB** |
| Valor Total | `$0` | **Formateo COP real** |
| En Auditoría | `0` | **Conteo por estado** |
| Pendientes | `0` | **1 (estado RADICADA)** ✅ |
| Devueltas | `50` | **Conteo por estado** |

### **✅ Datos Reales Mostrados:**
- **Total Radicaciones:** Conteo real de documentos MongoDB
- **Valor Total:** Suma real de `valor_factura` formateada como COP
- **En Auditoría:** Conteo real de estado `EN_AUDITORIA`
- **Pendientes:** Conteo real de estado `RADICADA` (esperando auditoría)
- **Devueltas:** Conteo real de estado `DEVUELTA`

### **✅ Tabla de Radicaciones:**
- **Campos Corregidos:** Uso de nombres correctos de MongoDB (`prestador_razon_social`, `valor_factura`, etc.)
- **Endpoint Correcto:** `/api/radicacion/mongodb/list/`
- **Paginación:** Funcional desde MongoDB
- **Filtros:** Estados, búsqueda, fechas

---

## 📁 ARCHIVOS MODIFICADOS

### **Backend:**
```
✅ apps/radicacion/services_mongodb_radicacion_contrato.py
   ↳ Método: obtener_estadisticas_radicaciones()
   ↳ Agregada lógica de estadísticas por estado con valor_total

✅ apps/radicacion/views_mongodb_radicacion_contrato.py
   ↳ Clase: RadicacionesMongoDBStatsAPIView
   ↳ Endpoint: GET /api/radicacion/mongodb/stats/

✅ apps/radicacion/urls.py
   ↳ URL: path('mongodb/stats/', RadicacionesMongoDBStatsAPIView.as_view())
```

### **Frontend:**
```
✅ src/services/neuraudit/radicacionService.ts
   ↳ Método: getRadicacionStats()
   ↳ Interface: RadicacionStats (agregado valor_total)
   ↳ Endpoint: /api/radicacion/mongodb/stats/

✅ src/components/neuraudit/radicacion/radicacion-list.tsx
   ↳ Función: loadRadicacionData()
   ↳ Lógica: Mapeo de stats_by_estado a tarjetas
   ↳ Fix: Pendientes = estado RADICADA
   ↳ Fix: Valor total con formato COP

✅ src/shared/data/neuraudit/radicaciondata.tsx
   ↳ RadicacionTable: Campos MongoDB corregidos
   ↳ prestador_razon_social, valor_factura, prestador_nit
```

---

## 🚀 PRUEBAS Y VALIDACIÓN

### **Test Caso Real:**
- **Prestador:** MEDICAL ENERGY SAS (NIT: 901019681)
- **Radicación:** RAD-20250827-00001
- **Valor:** $143,100.00 COP
- **Estado:** RADICADA

### **Resultado Dashboard:**
- ✅ **Total Radicaciones:** 1
- ✅ **Valor Total:** $143,100 COP
- ✅ **Pendientes:** 1 (como esperaba el usuario)
- ✅ **En Auditoría:** 0
- ✅ **Devueltas:** 0

---

## 📋 COMANDOS DE VERIFICACIÓN

### **Verificar Estructura MongoDB:**
```bash
cd backend && source venv/bin/activate
python check_radicacion_structure.py
```

### **Verificar Endpoint Stats:**
```bash
curl -H "Authorization: Bearer <token>" \
http://localhost:8003/api/radicacion/mongodb/stats/
```

### **Verificar Datos Tabla:**
```bash
curl -H "Authorization: Bearer <token>" \
http://localhost:8003/api/radicacion/mongodb/list/
```

---

## 🎯 ESTADO FINAL

### **✅ Sistema Completamente Funcional:**
- **Backend:** Estadísticas reales desde MongoDB NoSQL
- **Frontend:** Tarjetas dinámicas con datos reales
- **Tabla:** Campos correctos de MongoDB
- **Performance:** Agregaciones optimizadas
- **UX:** Formato de moneda colombiana
- **Datos:** 100% reales, 0% hardcodeados

### **📦 Backup Realizado:**
- **Backend:** `backups/backend-backup-radicacion-fixed-20250827-1729.tar.gz`
- **Frontend:** `backups/frontend-backup-radicacion-fixed-20250827-1729.tar.gz`
- **Fecha:** 27 Agosto 2025, 17:29

---

## 🔮 PRÓXIMOS PASOS

1. **Alertas Automáticas:** Notificaciones cuando radicaciones excedan plazos legales
2. **Dashboard Avanzado:** Gráficos de tendencias y análisis temporal
3. **Exportación:** Excel/PDF de estadísticas para reportes gerenciales
4. **KPIs Legales:** Seguimiento de plazos Resolución 2284 de 2023

---

**📅 Documentado:** 27 Agosto 2025  
**🏥 Desarrollado por:** Analítica Neuronal para EPS Familiar de Colombia  
**📋 Estado:** ✅ Implementación Completa y Funcional  
**🎯 Resultado:** Vista de Radicación con Estadísticas 100% Reales desde MongoDB
