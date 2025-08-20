# 📊 NEURAUDIT - MÓDULO AUDITORÍA CON VALORES DIFERENCIADOS
## Documentación Completa - 31 Julio 2025

## 🎯 RESUMEN EJECUTIVO

Se implementó exitosamente la diferenciación entre:
- **Valor Total Factura**: Viene del XML radicado (campo `factura_valor_total` de RadicacionCuentaMedica)
- **Valor Servicios**: Viene de cada servicio RIPS individual (campo `vrServicio`)

## 🔧 CAMBIOS CRÍTICOS IMPLEMENTADOS

### 1. **Unificación de Campos en Modelos RIPS**
- Todos los servicios ahora usan `vrServicio` consistentemente
- Se eliminó `valorTotalTecnologia` de medicamentos y otros servicios
- Mantiene compatibilidad con la nomenclatura RIPS oficial

### 2. **Serialización Correcta Frontend-Backend**
- Creación de `ServicioRIPSSerializer` que mapea campos del modelo Django a nombres RIPS
- Frontend recibe los campos con nombres RIPS originales: `codConsulta`, `vrServicio`, etc.
- Backend mantiene campos normalizados pero los expone con nombres RIPS

### 3. **Flujo de Creación de Facturas**
- Al hacer clic en "Ver Detalle" en una radicación sin factura:
  - Se crea automáticamente la factura en auditoría
  - El valor total viene del XML (`radicacion.factura_valor_total`)
  - Los servicios se copian desde RIPS con sus valores individuales (`vrServicio`)
  - Se navega directamente a la vista de servicios

## 📁 ARCHIVOS MODIFICADOS

### Backend
```
/backend/apps/radicacion/models_rips_oficial.py
- RIPSMedicamento: cambió valorTotalTecnologia → vrServicio
- RIPSOtrosServicios: cambió valorTotalTecnologia → vrServicio

/backend/apps/auditoria/viewsets_facturas.py
- Línea 15: Added ServicioRIPSSerializer import
- Línea 90: Cambió ServicioFacturadoSerializer → ServicioRIPSSerializer
- Línea 6: Added timezone import (fix 500 error)

/backend/apps/auditoria/serializers_facturas.py
- Líneas 92-136: Nuevo ServicioRIPSSerializer
  - Mapea valor_total → vrServicio
  - Mapea codigo → codConsulta/codProcedimiento/codTecnologiaSalud

/backend/apps/radicacion/management/commands/crear_datos_auditoria_prueba.py
- Actualizado para usar vrServicio en todos los servicios
```

### Frontend
```
/frontend-vue3/src/views/auditoria/AuditarCuentas.vue
- Línea 169-179: Botón siempre muestra "Ver Detalle"
- Línea 241-289: Lógica para crear factura si no existe
- Línea 156: Muestra numero_facturas correctamente

/frontend-vue3/src/views/auditoria/DetalleFactura.vue
- Usa nomenclatura RIPS: codConsulta, vrServicio, codProcedimiento
- Mantiene factura.valorTotal para encabezado (del XML)
- Servicios muestran vrServicio (valores individuales RIPS)
```

## 🔄 FLUJO DE DATOS

### 1. **Radicación (XML)**
```
RadicacionCuentaMedica
├── factura_valor_total: $15,000,000 (del XML)
├── factura_numero: FV-2025-1234
└── Datos del prestador
```

### 2. **RIPS Procesados (JSON)**
```
RIPSTransaccion
└── usuarios[]
    └── servicios
        ├── consultas[]
        │   └── vrServicio: $45,000
        ├── procedimientos[]
        │   └── vrServicio: $120,000
        └── medicamentos[]
            └── vrServicio: $3,500
```

### 3. **Factura en Auditoría**
```
FacturaRadicada
├── valor_total: $15,000,000 (copiado del XML)
└── ServicioFacturado[]
    ├── tipo: CONSULTA
    ├── valor_total: $45,000 (vrServicio del RIPS)
    └── Detalles del servicio
```

## 🎨 VISTA EN FRONTEND

### Auditar Cuentas
- Columna "Valor Total": Muestra valor del XML radicado
- Botón: Siempre "Ver Detalle" (nunca "Iniciar Auditoría")

### Detalle Factura
- Encabezado: "Valor Total: $15,000,000" (del XML)
- Tabla Consultas: "VALOR SERVICIO: $45,000" (vrServicio RIPS)
- Tabla Procedimientos: "VALOR SERVICIO: $120,000" (vrServicio RIPS)

## 🐛 PROBLEMAS RESUELTOS

1. **Error 500 al crear factura**: Faltaba import timezone
2. **Servicios mostrando $0**: Backend enviaba valor_total, frontend esperaba vrServicio
3. **"No. Facturas" mostrando "false"**: Se corrigió para mostrar el número
4. **Duplicación de radicaciones**: Se identificaron y eliminaron duplicados

## ✅ ESTADO ACTUAL

- ✅ Todas las radicaciones funcionan correctamente
- ✅ Valores diferenciados XML vs RIPS implementados
- ✅ Creación automática de facturas al hacer clic
- ✅ Navegación correcta a vista de servicios
- ✅ Campos RIPS con nomenclatura oficial

## 🔒 REGLAS DE NEGOCIO IMPLEMENTADAS

1. **Valor Total Factura**: SIEMPRE del XML radicado
2. **Valor Servicios**: SIEMPRE del vrServicio RIPS
3. **Botón en tabla**: SIEMPRE "Ver Detalle"
4. **Estado**: Se muestra en columna separada
5. **Creación automática**: Si no existe factura, se crea al hacer clic

## 🚀 PRÓXIMOS PASOS

1. Implementar aplicación de glosas a servicios
2. Validar que suma de vrServicio = valor total factura
3. Implementar respuesta a glosas por parte del prestador
4. Dashboard de seguimiento de glosas

---
**Fecha:** 31 Julio 2025  
**Versión:** 1.0  
**Estado:** Funcional y probado