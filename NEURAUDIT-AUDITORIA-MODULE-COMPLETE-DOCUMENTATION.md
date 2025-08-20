# 📋 NEURAUDIT - MÓDULO DE AUDITORÍA MÉDICA - DOCUMENTACIÓN COMPLETA

**Fecha:** 31 de Julio de 2025  
**Estado:** ✅ COMPLETAMENTE FUNCIONAL  
**Versión:** 1.0  

## 🎯 DESCRIPCIÓN GENERAL

Se implementó el módulo completo de auditoría médica para el sistema NEURAUDIT, permitiendo a los auditores de la EPS revisar las cuentas médicas radicadas, aplicar glosas según la Resolución 2284 de 2023, y gestionar el proceso de auditoría de manera eficiente.

## 🏗️ ARQUITECTURA IMPLEMENTADA

### 📊 Flujo de Trabajo
1. **Lista de Radicaciones** → Vista principal con todas las radicaciones pendientes de auditoría
2. **Detalle de Radicación** → Muestra todas las facturas dentro de una radicación
3. **Detalle de Factura** → Muestra todos los servicios agrupados por tipo
4. **Aplicar Glosas** → Modal para aplicar glosas con códigos oficiales
5. **Ver Detalle Servicio** → Modal con información completa del servicio

## 📁 ARCHIVOS CREADOS

### Backend (Django)
```
/backend/apps/auditoria/models_facturas.py
├── Modelo: FacturaRadicada
└── Modelo: ServicioFacturado
```


## 📝 ARCHIVOS MODIFICADOS

### Backend
- Sistema de glosas integrado con códigos oficiales
- ViewSets para gestión de auditoría

## 🔧 MODELOS DE DATOS

### FacturaRadicada
```python
class FacturaRadicada(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    radicacion = models.ForeignKey('radicacion.RadicacionCuentaMedica', ...)
    numero_factura = models.CharField(max_length=50)
    fecha_expedicion = models.DateField()
    valor_total = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Contadores de servicios
    total_consultas = models.IntegerField(default=0)
    total_procedimientos = models.IntegerField(default=0)
    total_medicamentos = models.IntegerField(default=0)
    total_otros_servicios = models.IntegerField(default=0)
    total_urgencias = models.IntegerField(default=0)
    total_hospitalizaciones = models.IntegerField(default=0)
    total_recien_nacidos = models.IntegerField(default=0)
    
    # Valores por tipo
    valor_consultas = models.DecimalField(...)
    valor_procedimientos = models.DecimalField(...)
    valor_medicamentos = models.DecimalField(...)
    # ... etc
```

### ServicioFacturado
```python
class ServicioFacturado(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    factura = models.ForeignKey(FacturaRadicada, ...)
    tipo_servicio = models.CharField(choices=TIPO_SERVICIO_CHOICES)
    codigo = models.CharField(max_length=20)
    descripcion = models.TextField()
    cantidad = models.IntegerField(default=1)
    valor_unitario = models.DecimalField(...)
    valor_total = models.DecimalField(...)
    tiene_glosa = models.BooleanField(default=False)
    valor_glosado = models.DecimalField(default=0)
```

## 📋 CÓDIGOS DE GLOSAS IMPLEMENTADOS (RESOLUCIÓN 2284 DE 2023)

### 🔴 IMPORTANTE: Las GLOSAS las aplica el AUDITOR de la EPS

### FA - FACTURACIÓN
- **FA01xx**: Estancia u observación de urgencias
- **FA02xx**: Consultas, interconsultas y atenciones domiciliarias
- **FA03xx**: Honorarios profesionales en procedimientos
- **FA05xx**: Derechos de sala
- **FA06xx**: Dispositivos médicos
- **FA07xx**: Medicamentos y APME
- **FA08xx**: Apoyo diagnóstico
- **FA13xx**: Factura incluye diferentes coberturas
- **FA16xx**: Persona/servicio de otro responsable de pago
- **FA19xx**: Error en descuento pactado
- **FA20xx**: Pago compartido
- **FA23xx**: Otros procedimientos no quirúrgicos
- **FA27xx**: Servicio ya facturado
- **FA28xx**: Servicio ya pagado
- **FA38xx**: Traslado asistencial
- **FA51xx**: Servicio prestado por otro prestador
- **FA52xx**: Disminución personas modalidad prospectiva
- **FA57xx**: Apoyo terapéutico
- **FA58xx**: Procedimientos quirúrgicos
- **FA59xx**: Transporte no asistencial

### TA - TARIFAS
- **TA01xx**: Tarifa estancia diferente a la pactada
- **TA02xx**: Tarifa consultas diferente a la pactada
- **TA03xx**: Honorarios diferentes a lo pactado
- **TA04xx**: Honorarios otro talento humano
- **TA05xx**: Derechos de sala
- **TA06xx**: Dispositivos médicos
- **TA07xx**: Medicamentos/APME
- **TA08xx**: Apoyo diagnóstico
- **TA09xx**: Atención agrupada
- **TA23xx**: Otros procedimientos
- **TA29xx**: Recargos no pactados
- **TA38xx**: Traslado asistencial
- **TA57xx**: Apoyo terapéutico
- **TA58xx**: Procedimientos quirúrgicos
- **TA59xx**: Transporte no asistencial

### SO - SOPORTES
- **SO01xx**: Soportes estancia/observación
- **SO02xx**: Soportes consultas
- **SO03xx**: Soportes honorarios
- **SO04xx**: Soportes otros honorarios
- **SO06xx**: Soportes dispositivos médicos
- **SO07xx**: Soportes medicamentos
- **SO08xx**: Soportes apoyo diagnóstico
- **SO21xx**: Número de autorización
- **SO23xx**: Soportes otros procedimientos
- **SO34xx**: Epicrisis/Resumen/Hoja atención
- **SO36xx**: Factura SOAT/ADRES
- **SO37xx**: Orden/prescripción facultativa
- **SO38xx**: Hoja traslado
- **SO39xx**: Comprobante recibido usuario
- **SO40xx**: Registro anestesia
- **SO41xx**: Descripción quirúrgica
- **SO42xx**: Lista de precios
- **SO47xx**: Soportes recobros
- **SO48xx**: Evidencia envío trámites
- **SO57xx**: Soportes apoyo terapéutico
- **SO58xx**: Soportes procedimientos quirúrgicos
- **SO59xx**: Soportes transporte no asistencial
- **SO61xx**: RIPS inconsistencias

### AU - AUTORIZACIONES
- **AU01xx**: Estancia/días autorizados
- **AU02xx**: Consultas autorizadas
- **AU03xx**: Honorarios autorizados
- **AU06xx**: Dispositivos autorizados
- **AU07xx**: Medicamentos autorizados
- **AU08xx**: Apoyo diagnóstico autorizado
- **AU21xx**: Número de autorización
- **AU23xx**: Otros procedimientos autorizados
- **AU38xx**: Traslado autorizado
- **AU43xx**: Orden/autorización vencida
- **AU57xx**: Apoyo terapéutico autorizado
- **AU58xx**: Procedimientos quirúrgicos autorizados
- **AU59xx**: Transporte no asistencial autorizado

### CO - COBERTURA
- **CO01xx**: Estancia no incluida en cobertura
- **CO02xx**: Consulta no incluida en cobertura
- **CO03xx**: Honorarios no incluidos en cobertura
- **CO04xx**: Otros honorarios no incluidos
- **CO06xx**: Dispositivos no incluidos
- **CO07xx**: Medicamentos no incluidos
- **CO08xx**: Apoyo diagnóstico no incluido
- **CO23xx**: Otros procedimientos no incluidos
- **CO38xx**: Traslado no incluido
- **CO46xx**: Topes SOAT/ADRES sin agotar
- **CO57xx**: Apoyo terapéutico no incluido
- **CO58xx**: Procedimientos no incluidos
- **CO59xx**: Transporte no incluido

### CL - CALIDAD (PERTINENCIA MÉDICA)
- **CL01xx**: Estancia no pertinente
- **CL02xx**: Consulta no pertinente
- **CL03xx**: Honorarios no pertinentes
- **CL06xx**: Dispositivos no pertinentes
- **CL07xx**: Medicamentos no pertinentes
- **CL08xx**: Apoyo diagnóstico no pertinente
- **CL23xx**: Otros procedimientos no pertinentes
- **CL38xx**: Traslado no pertinente
- **CL53xx**: No es atención de urgencia
- **CL57xx**: Apoyo terapéutico no pertinente
- **CL58xx**: Procedimiento quirúrgico no pertinente
- **CL59xx**: Transporte no pertinente

### SA - SEGUIMIENTO DE ACUERDOS
- **SA54xx**: Incumplimiento indicadores de seguimiento
- **SA55xx**: Ajuste frente a desviación nota técnica
- **SA56xx**: Incumplimiento indicadores calidad/gestión/resultados

## 🔄 CÓDIGOS DE RESPUESTA (Para futura implementación - Las da el PRESTADOR)
- **RE95**: Glosa o devolución extemporánea
- **RE96**: Glosa o devolución injustificada
- **RE97**: Glosa o devolución totalmente aceptada
- **RE98**: Glosa parcialmente aceptada y subsanada
- **RE99**: Glosa no aceptada y subsanada totalmente
- **RE22**: Respuesta extemporánea

## 🎨 CARACTERÍSTICAS DEL MÓDULO

### 1. Dashboard de Auditoría
- Estadísticas de radicaciones pendientes
- Filtros por estado, fecha, prestador
- Tabla de radicaciones con acciones
- Búsqueda en tiempo real

### 2. Detalle de Radicación
- Información completa del prestador
- Lista de facturas con indicadores por tipo de servicio
- Resumen económico con totales
- Navegación jerarquizada

### 3. Detalle de Factura
- Servicios agrupados por tipo
- Funcionalidad "Aplicar Glosa" en TODOS los tipos de servicio
- Detalle completo para cada servicio
- Resumen de auditoría con valores
- Opciones guardar borrador y finalizar

### 4. Sistema de Aplicación de Glosas
- Selección de tipos de glosa (FA, TA, SO, AU, CO, CL, SA)
- Motivos específicos según tipo
- Cálculo de valor glosado
- Observaciones obligatorias
- Validación contra valor del servicio
- Registro de glosas aplicadas

### 5. Detalle de Servicio
- Información completa del servicio
- Datos del paciente (si disponible)
- Diagnósticos CIE-10
- Información de autorización
- Lista de glosas aplicadas
- Integración con aplicación de glosas

## 📂 BACKUPS CREADOS

```
✅ backend-backup-auditoria-glosas-complete-20250731-1016/
   ↳ Backup completo del backend con modelos de auditoría
```

## 🚀 ESTADO ACTUAL

- ✅ Menú reorganizado - "Auditar Cuentas" unificado
- ✅ Navegación de 3 niveles funcional
- ✅ Modelos MongoDB sin afectar radicación
- ✅ Todos los códigos de glosas oficiales implementados
- ✅ Modal de aplicar glosas con validaciones
- ✅ Modal de detalle de servicio
- ✅ Botón "Aplicar Glosa" en TODOS los tipos de servicio
- ✅ Sistema listo para auditoría médica

## 📌 NOTAS IMPORTANTES

1. **Separación de responsabilidades**: Las glosas las aplica el AUDITOR de la EPS, las respuestas las da el PRESTADOR
2. **Sin modificación de radicación**: Se crearon modelos nuevos en app auditoria para no afectar el módulo existente
3. **Cumplimiento normativo**: Todos los códigos siguen la Resolución 2284 de 2023
4. **Integración completa**: Sistema listo para persistir glosas en MongoDB

---

**Desarrollado por:** Analítica Neuronal  
**Para:** EPS Familiar de Colombia  
**Fecha:** 31 de Julio de 2025