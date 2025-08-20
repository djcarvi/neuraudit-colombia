# 📋 PLAN DE TRABAJO DETALLADO - CLASIFICADOR DE SOPORTES RESOLUCIÓN 2284/2023

## 🎯 OBJETIVO PRINCIPAL
Implementar el sistema de clasificación automática de soportes documentales según la nomenclatura oficial establecida en la Resolución 2284 de 2023 del Ministerio de Salud.

## 📜 RESUMEN NORMATIVO - RESOLUCIÓN 2284/2023

### **🔧 ESTRUCTURA DE NOMENCLATURA OFICIAL:**
```
CÓDIGO_NNNNNNNNNN_ANNNNNNNNN.pdf
```
- **CÓDIGO:** 3 letras identificadoras del tipo de soporte
- **N:** Número de factura (10 dígitos)
- **A:** Letra 'A' fija
- **N:** Número identificador (9 dígitos)

### **📂 CÓDIGOS DE SOPORTES OFICIALES:**

| **N°** | **CÓDIGO** | **TIPO DE SOPORTE** | **EJEMPLO NOMENCLATURA** |
|--------|------------|---------------------|---------------------------|
| 1 | **XML** | Factura de venta en salud | (Formato XML según DIAN) |
| 2.1 | **HEV** | Resumen de atención u hoja de evolución | `HEV_9999999999_A999999999.pdf` |
| 2.2 | **EPI** | Epicrisis | `EPI_9999999999_A999999999.pdf` |
| 3 | **PDX** | Resultado de procedimientos de apoyo diagnóstico | `PDX_9999999999_A999999999.pdf` |
| 4 | **DQX** | Descripción quirúrgica | `DQX_9999999999_A999999999.pdf` |
| 5 | **RAN** | Registro de anestesia | `RAN_9999999999_A999999999.pdf` |
| 6 | **CRC** | Comprobante de recibido del usuario | `CRC_9999999999_A999999999.pdf` |
| 7.1 | **TAP** | Traslado asistencial de pacientes | `TAP_9999999999_A999999999.pdf` |
| 7.2 | **TNA** | Transporte no asistencial ambulatorio | `TNA_9999999999_A999999999.pdf` |
| 8.1 | **FAT** | Factura de venta por cobro a SOAT/ADRES | `FAT_9999999999_A999999999.pdf` |
| 8.2 | **FMO** | Factura de venta del material de osteosíntesis | `FMO_9999999999_A999999999.pdf` |
| 9 | **OPF** | Orden o prescripción facultativa | `OPF_9999999999_A999999999.pdf` |
| 10 | **LDP** | Lista de precios | `LDP_9999999999_A999999999.pdf` |
| 11 | **HAU** | Hoja de atención de urgencia | `HAU_9999999999_A999999999.pdf` |
| 12 | **HAO** | Hoja de atención odontológica | `HAO_9999999999_A999999999.pdf` |
| 13 | **HAM** | Hoja de administración de medicamentos | `HAM_9999999999_A999999999.pdf` |
| 14 | **RIPS** | Registro Individual de Prestación de Servicios | (Formato JSON según MinSalud) |

### **📋 SOPORTES ADICIONALES IDENTIFICADOS:**
| **CÓDIGO** | **TIPO** | **NOMENCLATURA** |
|------------|----------|------------------|
| **PDE** | Evidencia del envío del PDEEI | `PDE_9999999999_A999999999.pdf` |

### **🎯 CLASIFICACIÓN PARA EL FRONTEND:**

#### **📁 CATEGORÍAS PRINCIPALES:**
1. **📄 DOCUMENTOS BÁSICOS**
   - `XML` - Factura electrónica
   - `RIPS` - Registro de servicios JSON

2. **🏥 REGISTROS MÉDICOS**
   - `HEV` - Resumen de atención ambulatoria
   - `EPI` - Epicrisis (urgencias/hospitalización)
   - `HAU` - Hoja de atención de urgencia
   - `HAO` - Hoja de atención odontológica

3. **🔬 PROCEDIMIENTOS**
   - `PDX` - Resultados de apoyo diagnóstico
   - `DQX` - Descripción quirúrgica
   - `RAN` - Registro de anestesia

4. **💊 MEDICAMENTOS**
   - `HAM` - Hoja de administración de medicamentos
   - `CRC` - Comprobante de recibido del usuario

5. **🚑 TRANSPORTE**
   - `TAP` - Traslado asistencial
   - `TNA` - Transporte no asistencial

6. **📋 ÓRDENES Y PRESCRIPCIONES**
   - `OPF` - Orden o prescripción facultativa
   - `LDP` - Lista de precios

7. **💰 FACTURACIÓN ESPECIAL**
   - `FAT` - Facturación SOAT/ADRES
   - `FMO` - Material de osteosíntesis

### **📝 REGLAS ESPECIALES:**

#### **🎯 FACTURAS MULTIUSUARIOS:**
Para facturas con múltiples usuarios se debe agregar:
```
CÓDIGO_NNNNNNNNNN_ANNNNNNNNN_tipoDocumento_numeroDocumento.pdf
```

**Ejemplo:**
```
EPI_9999999999_A999999999_CC_12345678.pdf
```

### **📋 SOPORTES ESPECÍFICOS POR TIPO DE SERVICIO:**

#### **2.1. CONSULTAS AMBULATORIAS (excepto odontología):**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- **Copia del registro específico de la atención ambulatoria** (`HEV`)
- RIPS (`JSON`)

#### **2.2. CONSULTAS Y PROCEDIMIENTOS ODONTOLÓGICOS:**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- **Copia de la hoja de atención odontológica** (`HAO`)
- Copia del registro específico de la atención ambulatoria (`HEV`)
- RIPS (`JSON`)

#### **2.3. PROCEDIMIENTOS DE APOYO DIAGNÓSTICO:**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- **Copia de los resultados o interpretación** (`PDX`)
- RIPS (`JSON`)

#### **2.4. PROCEDIMIENTOS DE COMPLEMENTACIÓN TERAPÉUTICA:**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- Copia del registro específico de atención ambulatoria (`HEV`)
- **Copia de la planilla de recibido** (`CRC`)
- RIPS (`JSON`)

#### **2.5. MEDICAMENTOS (incluye oxígeno y APME):**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- **Copia del comprobante de recibido del usuario** (`CRC`)
- **Copia de la hoja de administración de medicamentos** (`HAM`)
- RIPS (`JSON`)

#### **2.6. DISPOSITIVOS MÉDICOS:**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- **Copia de la planilla de recibido** (`CRC`)
- RIPS (`JSON`)

#### **2.7. ATENCIÓN DE URGENCIAS:**
- Factura de venta en salud (`XML`)
- **Copia de la hoja de atención de urgencia o epicrisis** (`HAU` o `EPI`)
- **Copia de la hoja de administración de medicamentos** (`HAM`)
- **Interpretación de los procedimientos de apoyo diagnóstico** (`PDX`)
- Copia de la lista de precios (`LDP`)
- Copia de la factura o detalle de cargos SOAT/ADRES (`FAT`)
- RIPS (`JSON`)

#### **2.8. SERVICIOS DE INTERNACIÓN O PROCEDIMIENTOS QUIRÚRGICOS:**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- **Copia de la epicrisis** (`EPI`)
- **Copia de la hoja de administración de medicamentos** (`HAM`)
- **Interpretación de los procedimientos de apoyo diagnóstico** (`PDX`)
- **Copia de la descripción quirúrgica** (`DQX`)
- **Copia del registro de anestesia** (`RAN`)
- RIPS (`JSON`)

#### **2.9. TRANSPORTE ASISTENCIAL O NO ASISTENCIAL:**
- Factura de venta en salud (`XML`)
- Copia de la orden o prescripción facultativa (`OPF`)
- Copia de la hoja de administración de medicamentos (`HAM`)
- **Copia de la hoja de traslado asistencial** (`TAP`) o **tiquete de transporte** (`TNA`)
- RIPS (`JSON`)

### **💾 CARACTERÍSTICAS TÉCNICAS NORMATIVAS:**

- **Formatos:** PDF editable (300 dpi), XML (factura), JSON (RIPS)
- **Peso máximo:** 1GB por transacción
- **Compresión:** Archivos sin subcarpetas
- **Nomenclatura específica** para archivos multiusuarios
- **Sitios seguros** con acuse de recibido automático

---

## 📊 FASES DE IMPLEMENTACIÓN

### 🔧 FASE 1: BACKEND - CLASIFICADOR DE SOPORTES (2-3 horas)

#### 1.1 Crear parser de nomenclatura oficial
- **Archivo:** `/backend/apps/radicacion/soporte_classifier.py`
- **Funciones principales:**
  - `parse_soporte_filename()` - Extrae código, número de factura, identificador
  - `validate_nomenclatura()` - Valida estructura según norma
  - `classify_soporte_type()` - Clasifica en categorías oficiales
  - `detect_multiuser_format()` - Detecta formato multiusuario

#### 1.2 Definir diccionario de códigos oficiales
- **Códigos:** HEV, EPI, PDX, DQX, RAN, CRC, TAP, TNA, FAT, FMO, OPF, LDP, HAU, HAO, HAM
- **Categorías:** 7 grupos principales (Básicos, Médicos, Procedimientos, etc.)
- **Validaciones:** Estructura, formato, obligatoriedad

#### 1.3 Actualizar modelo DocumentoSoporte
- **Nuevos campos:**
  - `codigo_soporte` (CharField) - Código de 3 letras
  - `categoria_soporte` (CharField) - Categoría principal
  - `numero_factura_extracted` (CharField) - Número extraído del nombre
  - `es_multiusuario` (BooleanField) - Formato multiusuario
  - `nomenclatura_valida` (BooleanField) - Cumple norma

#### 1.4 Crear migración de base de datos
- **Comando:** `python manage.py makemigrations radicacion`
- **Aplicar:** `python manage.py migrate`

### 🎨 FASE 2: FRONTEND - VISUALIZACIÓN CLASIFICADA (2 horas)

#### 2.1 Crear componente SoportesClasificados
- **Archivo:** `/frontend/src/components/neuraudit/radicacion/soportes-clasificados.tsx`
- **Estructura:** Tabs por categoría + tabla detallada
- **Features:**
  - Agrupación por tipo de soporte
  - Indicadores de validación
  - Descarga por categoría

#### 2.2 Actualizar RadicacionStatsViewer
- **Agregar:** Nueva pestaña "Soportes Clasificados"
- **Mostrar:** Resumen por categorías
- **Integrar:** Componente SoportesClasificados

#### 2.3 Crear indicadores visuales
- **Badges:** Verde (válido), Rojo (inválido), Amarillo (pendiente)
- **Iconos:** Por tipo de soporte según clasificación
- **Contadores:** Total por categoría

### 🔄 FASE 3: INTEGRACIÓN Y PROCESAMIENTO (1 hora)

#### 3.1 Actualizar process_files endpoint
- **Archivo:** `/backend/apps/radicacion/views.py`
- **Integrar:** Clasificador automático
- **Procesar:** Cada archivo subido

#### 3.2 Actualizar DocumentParser
- **Llamar:** Clasificador en cada procesamiento
- **Guardar:** Metadata de clasificación
- **Validar:** Estructura de nomenclatura

### 🧪 FASE 4: TESTING Y VALIDACIÓN (1 hora)

#### 4.1 Crear archivos de prueba
- **Generar:** Ejemplos con nomenclatura correcta
- **Casos:** Válidos, inválidos, multiusuario
- **Formatos:** PDF, errores comunes

#### 4.2 Probar clasificación automática
- **Upload:** Archivos de prueba
- **Verificar:** Clasificación correcta
- **Validar:** Agrupación por categorías

## 📁 ESTRUCTURA DE ARCHIVOS A CREAR/MODIFICAR

### Backend:
```
apps/radicacion/
├── soporte_classifier.py          # NUEVO - Clasificador principal
├── migrations/
│   └── 000X_add_soporte_fields.py # NUEVO - Migración campos
├── models.py                       # MODIFICAR - Agregar campos
├── views.py                        # MODIFICAR - Integrar clasificador
└── document_parser.py              # MODIFICAR - Usar clasificador
```

### Frontend:
```
components/neuraudit/radicacion/
├── soportes-clasificados.tsx      # NUEVO - Componente principal
├── soporte-category-card.tsx      # NUEVO - Card por categoría
└── radicacion-stats-viewer.tsx    # MODIFICAR - Agregar pestaña
```

## 🎯 ENTREGABLES ESPECÍFICOS

### ✅ Funcionalidades Core:
1. **Clasificación automática** de archivos por nomenclatura
2. **Validación de estructura** según Resolución 2284/2023
3. **Agrupación visual** en 7 categorías principales
4. **Detección multiusuario** (formato con documento)
5. **Indicadores de cumplimiento** normativo

### 📊 Métricas de Éxito:
- **100% de archivos** con nomenclatura válida se clasifican correctamente
- **Detección automática** de errores de formato
- **Agrupación visual** clara por categorías
- **Validación normativa** en tiempo real

## ⏰ CRONOGRAMA DETALLADO

| Tiempo | Actividad | Entregable |
|--------|-----------|------------|
| 0-30min | Crear soporte_classifier.py | Parser nomenclatura |
| 30-60min | Actualizar modelos + migración | BD preparada |
| 60-90min | Integrar en views + document_parser | Backend funcional |
| 90-150min | Crear componente SoportesClasificados | Frontend básico |
| 150-180min | Integrar en RadicacionStatsViewer | UI completa |
| 180-210min | Testing con archivos de prueba | Sistema validado |
| 210-240min | Ajustes finales y documentación | Entrega final |

## 🔧 COMANDOS PREPARATORIOS

```bash
# Activar entorno virtual
cd /home/adrian_carvajal/Analí®/neuraudit_react/backend
source venv/bin/activate

# Crear archivo clasificador
touch apps/radicacion/soporte_classifier.py

# Frontend
cd ../frontend/src/components/neuraudit/radicacion
touch soportes-clasificados.tsx
touch soporte-category-card.tsx
```

## 📋 CHECKLIST DE VALIDACIÓN

- [ ] Parser de nomenclatura reconoce los 14 códigos oficiales
- [ ] Validación de estructura CÓDIGO_NNNNNN_ANNNN.pdf
- [ ] Detección de formato multiusuario
- [ ] Clasificación en 7 categorías principales
- [ ] Migración de BD aplicada correctamente
- [ ] Componente frontend muestra soportes agrupados
- [ ] Indicadores visuales de validación
- [ ] Integración completa en proceso de radicación
- [ ] Testing con casos reales y edge cases

---

**📅 Fecha de creación:** 20 Agosto 2025  
**🎯 Estado:** Planificación completada - Listo para implementación  
**📋 Base normativa:** Resolución 2284 de 2023 - Ministerio de Salud y Protección Social