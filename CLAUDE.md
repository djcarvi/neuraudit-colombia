# 🏥 NEURAUDIT COLOMBIA - MEMORIA DEL PROYECTO

## 📋 INFORMACIÓN GENERAL

**Proyecto:** NeurAudit Colombia - Sistema de Auditoría Médica EPS Familiar de Colombia  
**Cliente:** EPS Familiar de Colombia  
**Desarrollador:** Analítica Neuronal  
**Inicio:** 29 Julio 2025  
**Estado:** En desarrollo  

## 🎯 OBJETIVO PRINCIPAL

Desarrollar un aplicativo web para la radicación, auditoría, glosas y conciliación de cuentas médicas entre PSS/PTS y EPS Familiar de Colombia, cumpliendo estrictamente con la **Resolución 2284 de 2023** del Ministerio de Salud y Protección Social.

## 🚨 LÍNEAS ROJAS APRENDIDAS DE MEDISPENSA

### 💀 CATÁSTROFES HISTÓRICAS QUE NUNCA DEBEN REPETIRSE:

#### 🚫 **ERROR CRÍTICO 405 - Method Not Allowed**
- **Problema:** Backend endpoint `/api/eps-users/search/` SOLO acepta POST
- **Error:** Si se envía GET → Error 405 Method Not Allowed
- **Impacto:** Búsquedas de usuarios completamente rotas

#### 🗄️ **ERRORES DE SERIALIZACIÓN MongoDB-Django**
- **Problema Crítico:** Django REST Framework no puede serializar ObjectId de MongoDB directamente
- **Error Típico:** `TypeError: int() argument must be string, not 'ObjectId'`
- **Causa:** Falta de declaración explícita del campo id en serializers

#### 🐛 **ERROR "undefined reading properties"**  
- **Problema:** Errores sistemáticos al acceder propiedades de respuestas API indefinidas
- **Síntoma:** `Cannot read properties of undefined (reading 'results')`
- **Causa:** No validar respuestas de API antes de acceder a propiedades

### ❌ NUNCA HACER:
1. **NO cambiar código sin consulta y explicación**
2. **NO tocar/borrar bases de datos MongoDB de producción**  
3. **NO cambiar a SQL - IMPERATIVO: Solo MongoDB**
4. **NO hacer "mejoras" no solicitadas**
5. **NO romper funcionalidad existente**
6. **NO enviar métodos HTTP incorrectos a endpoints**
7. **NO ejecutar comandos Django sin activar entorno virtual**
8. **NO usar puertos diferentes (Backend 8003)**
9. **NO usar otro sistema que no sea MongoDB + ObjectIdAutoField**

### ✅ SIEMPRE HACER:
1. **Leer archivo completo antes de editar**
2. **Preguntar antes de cambios estructurales**
3. **Mantener consistencia con arquitectura existente**
4. **Documentar cambios importantes**
5. **Validar respuestas de API antes de acceder a propiedades**
6. **Declarar explícitamente campo id en todos los serializers MongoDB**
7. **Verificar métodos HTTP requeridos por endpoints**
8. **Hacer backup antes de cambios críticos**
9. **Implementar logs de debug para diagnosticar problemas**
10. **ACTIVAR ENTORNO VIRTUAL antes de cualquier comando Django**
11. **USAR SIEMPRE ObjectIdAutoField para primary keys**
12. **MANTENER enfoque NoSQL con MongoDB exclusivamente**
13. **MANTENER puertos fijos: Backend 8003**

## 🏗️ ARQUITECTURA TÉCNICA

### **Stack Tecnológico:**
- **Backend:** Django 5.2.4 + Django REST Framework + MongoDB
- **Base de Datos:** MongoDB - `neuraudit_colombia_db`
- **Autenticación:** JWT con sistema personalizado 100% MongoDB
- **Storage:** Digital Ocean Spaces Object Storage
- **Puertos:** Backend 8003

### **Estructura del Proyecto:**
```
/home/adrian_carvajal/Analí®/neuraudit/
├── backend/     # Django Backend
├── context/     # Documentación y contexto
└── CLAUDE.md    # Memoria del proyecto
```

## 📊 FLUJO DE TRABAJO SEGÚN RESOLUCIÓN 2284

### **Proceso Principal:**
1. **PSS Radica** → Cuenta médica + RIPS + Soportes (22 días hábiles)
2. **Sistema Valida** → Genera devoluciones automáticas si aplica (5 días)
3. **EPS Audita** → Asignación automática equitativa por perfiles
4. **Genera Glosas** → Según codificación estándar (causales taxativas)
5. **PSS Responde** → A glosas en plazos legales (5 días)
6. **Conciliación** → Si no hay acuerdo entre partes
7. **Pago** → Tras conciliación exitosa

## 👥 USUARIOS Y ROLES

### **PSS/PTS (Prestadores):**
- **Radicador**: Radica cuentas médicas con soportes
- Autenticación: NIT + Usuario + Contraseña

### **EPS Familiar de Colombia:**
- **Auditor Médico**: Auditoría de pertinencia clínica
- **Auditor Administrativo**: Auditoría de facturación/soportes  
- **Coordinador de Auditoría**: Supervisión y asignación
- **Conciliador**: Gestión de conciliaciones
- **Contabilidad**: Exportación y reportes financieros
- **Administrador**: Gestión completa del sistema

## 📋 MÓDULOS PRINCIPALES - VERSIÓN 1

### ✅ **Módulos Prioritarios:**
1. **🔸 Radicación** - Upload de facturas, RIPS y soportes
2. **🔸 Devoluciones** - Sistema automático según causales normativas
3. **🔸 Asignación** - Distribución automática equitativa a auditores
4. **🔸 Auditoría** - Revisión médica y administrativa con glosas
5. **🔸 Glosas** - Codificación estándar según resolución
6. **🔸 Respuestas** - Portal PSS para responder glosas
7. **🔸 Conciliación** - Gestión de acuerdos entre partes
8. **🔸 Pago** - Autorización y registro de pagos

### 🔄 **Módulos Secundarios:**
- Dashboard ejecutivo con KPIs
- Alertas automáticas por plazos
- Exportación contable/financiera
- Sistema de trazabilidad transaccional
- Portal consulta estado cuentas PSS

## 📁 SOPORTES SEGÚN RESOLUCIÓN 2284

### **Obligatorios:**
- **Factura electrónica** (XML DIAN + MinSalud)
- **RIPS validado** (JSON con código único MinSalud)

### **Por Tipo de Servicio:**
- **Ambulatoria**: Resumen atención + Orden/prescripción
- **Urgencias**: Hoja urgencia/epicrisis + Medicamentos + Diagnósticos
- **Hospitalización**: Epicrisis + Descripción quirúrgica + Anestesia
- **Medicamentos**: Prescripción + Comprobante recibido
- **Transporte**: Hoja traslado + Orden

## ⏰ PLAZOS LEGALES CRÍTICOS

- **Radicación soportes**: 22 días hábiles desde expedición factura
- **Devolución EPS**: 5 días hábiles desde radicación  
- **Respuesta PSS a devolución**: 5 días hábiles
- **Formulación glosas**: Según Art. 57 Ley 1438/2011
- **Respuesta PSS a glosas**: 5 días hábiles
- **Pago primer 50%**: 5 días después presentación (modalidad evento)

## 🔧 CODIFICACIÓN ESTÁNDAR

### **Glosas (6 dígitos: AA0000):**
- **FA**: Facturación (diferencias cantidades/valores)
- **TA**: Tarifas (diferencias valores pactados)  
- **SO**: Soportes (ausencia/inconsistencia documentos)
- **AU**: Autorizaciones (servicios no autorizados)
- **CO**: Cobertura (servicios no incluidos)
- **CL**: Calidad (pertinencia médica)
- **SA**: Seguimiento acuerdos (incumplimiento indicadores)

### **Devoluciones:**
- **DE16**: Persona corresponde a otro responsable pago
- **DE44**: Prestador no hace parte red integral
- **DE50**: Factura ya pagada o en trámite
- **DE56**: No radicación soportes dentro 22 días hábiles

## 📊 KPIs PRINCIPALES

### **Indicadores con Valores Monetarios:**
- Tasa de glosas por auditor/PSS (% y $)
- Tiempos promedio de respuesta (días y impacto $)
- Valor glosas aceptadas vs rechazadas ($)
- Estado cartera por antigüedad ($ por períodos)
- Estados de cartera ($)
- Conciliaciones bancarias ($)
- Informes de glosas ($)
- Análisis de recaudo ($)

## 🔐 SEGURIDAD Y COMPLIANCE

- **Auditoría detallada**: Registro completo todas las acciones
- **Protección datos salud**: Cumplimiento normativo HABEAS DATA
- **Backup y DR**: Recuperación ante desastres
- **Trazabilidad transaccional**: Registro automático en línea
- **Autenticación robusta**: NIT + Usuario + Contraseña

## 💾 ALMACENAMIENTO

- **Base de datos**: MongoDB `neuraudit_colombia_db`
- **Documentos**: Digital Ocean Spaces Object Storage
- **Tamaño máximo**: Según norma (1GB por transacción)
- **Formatos**: PDF editable (300 dpi), JSON (RIPS), XML (Factura)

## 📈 DATOS INICIALES

### **Catálogos a Importar:**
- **Tarifarios**: Excel desde EPS (ISS 2001 mínimo, SOAT 2025 máximo)
- **CUPS/CUM**: Actualizado (suministrado posteriormente)
- **PSS Habilitados**: 58,000 en el país (suministrado posteriormente)
- **Datos históricos**: CSV (suministrado posteriormente)

## 🚀 NOTIFICACIONES

- **En plataforma**: Alertas tiempo real
- **Email**: Notificaciones críticas
- **Tipos**: Vencimiento plazos, aceptaciones tácitas, facturas próximas vencer

## 🔄 INTEGRACIONES

### **APIs Externas:**
- **MinSalud**: Validación RIPS (Docker API - pendiente desarrollo)
- **DIAN**: Validación facturas electrónicas
- **Digital Ocean**: Spaces Object Storage

### **Exportaciones:**
- **Excel/CSV**: Reportes estándar
- **API**: Interoperabilidad con software contable externo
- **JSON**: Datos estructurados para terceros

## 📋 ESTADO ACTUAL (30 Julio 2025)
- **Fase**: ✅ **SISTEMA BACKEND 100% FUNCIONAL Y TESTING COMPLETO**
- **Avance**: Backend Django + JWT + MongoDB = **FUNCIONANDO TOTALMENTE**
- **Testing**: ✅ Usuarios EPS y PSS probados exitosamente
- **Credenciales**: test.eps/simple123 (EPS) y test.pss/simple123 (PSS con NIT: 123456789-0)
- **Backup Final**: `backend-backup-testing-final-20250730/`
- **Documentación**: `NEURAUDIT-AUTHENTICATION-JWT-DOCUMENTATION.md`
- **Login**: ✅ PSS (NIT+Usuario) y EPS (Usuario) **FUNCIONANDO**
- **JWT**: ✅ Tokens, validación, logout **FUNCIONANDO**
- **Logs**: ✅ Sistema de auditoría completo registrando todas las actividades
- **Nueva Radicación**: ✅ Extracción XML/RIPS, múltiples usuarios, anti-cruces con NIT
- **Consulta Radicaciones**: ✅ Datos reales MongoDB, NIT visible, estadísticas, filtros

## 🔧 COMANDOS CRÍTICOS PARA FUTURAS SESIONES

### ⚡ **ACTIVACIÓN ENTORNO VIRTUAL - OBLIGATORIO**
```bash
# SIEMPRE ejecutar ANTES de cualquier comando Django:
cd /home/adrian_carvajal/Analí®/neuraudit/backend
source venv/bin/activate

# Verificar activación (debe mostrar "(venv)"):
which python
```

### 🚀 **COMANDOS DE INICIO - PUERTOS FIJOS**
```bash
# Backend Django (Puerto 8003 FIJO):
cd /home/adrian_carvajal/Analí®/neuraudit/backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8003
```

### 🏗️ **COMANDOS DJANGO DEVELOPMENT**
```bash
# Crear migraciones (SIEMPRE con venv activo):
source venv/bin/activate
python manage.py makemigrations

# Aplicar migraciones:
python manage.py migrate

# Crear usuarios de prueba:
python manage.py create_test_users

# Crear prestadores de prueba:
python manage.py create_test_prestadores

# Shell Django:
python manage.py shell
```


---

**🏥 Desarrollado por Analítica Neuronal para EPS Familiar de Colombia**  
**📅 Fecha inicio:** 29 Julio 2025  
**🎯 Estado:** En desarrollo  
**📋 Versión documento:** 1.1 - Actualizada 31 Julio 2025  

---

## 🆕 ACTUALIZACIONES RECIENTES (1 Agosto 2025)

### ✅ **MÓDULO DE CONCILIACIÓN - SISTEMA DE RATIFICACIÓN COMPLETO:**

#### **🎯 Funcionalidad Principal Implementada:**
- **Ratificación Individual**: Confirmar glosas específicas
- **Levantamiento Individual**: Anular glosas con justificación obligatoria  
- **Acciones Masivas**: Ratificar/Levantar todas las glosas pendientes de una vez
- **Validaciones Completas**: Estados, permisos, confirmaciones, justificaciones
- **Integración Backend**: API endpoints para procesar decisiones de conciliación

#### **🔧 Errores Críticos Solucionados:**
- **Error prestador_info undefined**: Solucionado agregando campos completos en list serializer
- **Error MultipleObjectsReturned**: Solucionado manejando casos duplicados por fecha más reciente
- **Error 400 Bad Request**: Solucionado en endpoint obtener_o_crear_caso

#### **📊 Backend NoSQL Optimizado:**
- **Serializers Mejorados**: `CasoConciliacionListSerializer` con datos completos
- **Endpoint Ratificación**: `POST /api/conciliacion/casos/{id}/procesar_decision/`
- **Manejo de Estados**: PENDIENTE → RATIFICADA/LEVANTADA
- **Trazabilidad**: Registro completo de decisiones con usuario y fecha

#### **📁 Documentación y Estado:**
- **Documentación completa:** `NEURAUDIT-CONCILIACION-RATIFICACION-COMPLETE-DOCUMENTATION.md`
- **Backup Backend:** `backend-backup-conciliacion-ratificacion-complete-20250731-2136/`
- **Estado:** ✅ Sistema backend 100% funcional, listo para producción

#### **🔄 Flujo de Trabajo Conciliador:**
1. **Acceder**: Dashboard → Conciliación → Ver Detalles
2. **Revisar**: Tab "Glosas Aplicadas" con todas las glosas y estados
3. **Decidir Individual**: Botones ✅ Ratificar / ❌ Levantar por glosa
4. **Decidir Masivo**: Botones de acción masiva para múltiples glosas
5. **Confirmar**: Validaciones con valores, justificaciones obligatorias
6. **Seguimiento**: Actualización inmediata de valores financieros

#### **💰 Impacto Financiero Automático:**
- **Valor Ratificado**: Se incrementa automáticamente al ratificar
- **Valor Levantado**: Se incrementa automáticamente al levantar  
- **Valor en Disputa**: Se reduce automáticamente con cada decisión
- **Resumen Visual**: Gráfico circular actualizado en tiempo real

### **📋 Archivos Principales Modificados:**
```
✅ BACKEND:
   /apps/conciliacion/views.py (manejo MultipleObjectsReturned)
   /apps/conciliacion/serializers.py (prestador_info en ListSerializer)
```

---

## 🆕 ACTUALIZACIONES RECIENTES (31 Julio 2025)

### ✅ **MÓDULO AUDITORÍA MÉDICA - COMPLETAMENTE FUNCIONAL:**

#### 📊 **Funcionalidad Implementada:**
- **Navegación de 3 niveles**: Radicaciones → Facturas → Servicios
- **Sistema de glosas oficial**: Todos los códigos de la Resolución 2284 de 2023
- **Separación clara**: GLOSAS las aplica el AUDITOR, RESPUESTAS las da el PRESTADOR

#### 📁 **Backend Implementado:**
- **Nuevos modelos en auditoria app** (sin tocar radicacion):
  - `FacturaRadicada` - Con contadores y valores por tipo de servicio
  - `ServicioFacturado` - Con soporte para glosas

#### 📋 **Códigos de Glosas Implementados:**
- **FA - Facturación**: 59 códigos específicos
- **TA - Tarifas**: 16 códigos específicos  
- **SO - Soportes**: 68 códigos específicos
- **AU - Autorizaciones**: 29 códigos específicos
- **CO - Cobertura**: 14 códigos específicos
- **CL - Calidad**: 14 códigos específicos
- **SA - Seguimiento Acuerdos**: 8 códigos específicos

#### 📂 **Documentación y Backups:**
- **Documentación completa:** `NEURAUDIT-AUDITORIA-MODULE-COMPLETE-DOCUMENTATION.md`
- **Backup Backend:** `backend-backup-auditoria-glosas-complete-20250731-1016/`

### ✅ **MÓDULO CONTRATACIÓN - COMPLETAMENTE FUNCIONAL:**

#### 📊 **Backend Implementado:**
- **ViewSets completos** con `permission_classes = [AllowAny]` para desarrollo
- **Endpoints RESTful** para Prestadores, Contratos, Tarifarios (CUPS/Medicamentos/Dispositivos)
- **Estadísticas dinámicas** con cálculos de porcentajes reales
- **Comandos de datos de prueba** creando 6 prestadores, 6 contratos, 14 tarifarios CUPS
- **Validación de tarifas** para auditoría médica


#### 📁 **Documentación y Backups:**
- **Documentación completa:** `NEURAUDIT-CONTRATACION-MODULE-COMPLETE-DOCUMENTATION.md`
- **Backup Backend:** `backend-backup-contratacion-complete-20250730-1948/`

### 📂 **ARCHIVOS CRÍTICOS MODIFICADOS HOY:**
```
✅ BACKEND:
   /backend/apps/contratacion/views.py
   ↳ Agregado permission_classes = [AllowAny] a todos los ViewSets
   ↳ Endpoint estadísticas prestadores con cálculos de porcentajes
   ↳ Endpoint estadísticas contratos con porcentaje capitación

   /backend/apps/contratacion/management/commands/
   ↳ create_test_prestadores.py (creado)
   ↳ create_test_contratos.py (creado)  
   ↳ setup_contratacion_test_data.py (creado)
```


---

## 🚨 SOLUCIÓN CRÍTICA: SERIALIZACIÓN ObjectId EN CONTRATACIÓN (31 Julio 2025)

### **💀 Problema Catastrófico:**
- **Error 500** en todos los endpoints de contratación
- `TypeError: Object of type ObjectId is not JSON serializable`
- Afectaba: prestadores, contratos, modalidades, tarifarios

### **✅ Solución Implementada:**

#### 1. **Renderer Personalizado** (`/backend/apps/contratacion/renderers.py`):
```python
class MongoJSONRenderer(JSONRenderer):
    """Maneja serialización de ObjectId MongoDB"""
    def render(self, data, accepted_media_type=None, renderer_context=None):
        return json.dumps(data, cls=MongoJSONEncoder, ...).encode('utf-8')

class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)  # Convierte ObjectId a string
        return super().default(obj)
```

#### 2. **ViewSets Actualizados** (TODOS en contratación):
```python
class PrestadorViewSet(viewsets.ModelViewSet):
    renderer_classes = [MongoJSONRenderer]  # ← CRÍTICO
    # ... resto de configuración
```

#### 3. **Serializers Corregidos**:
```python
# ANTES (MAL):
id = serializers.CharField(read_only=True)

# DESPUÉS (BIEN):
id = serializers.ReadOnlyField()
```

#### 4. **Filtros ForeignKey Corregidos**:
```python
# ANTES (error después de cambio a ForeignKey):
filter(modalidad_principal='CAPITACION')

# DESPUÉS (correcto):
filter(modalidad_principal__codigo='CAPITACION')
```

### **⚠️ ADVERTENCIAS CRÍTICAS:**
1. **NO aplicar encoder globalmente** - Afectaría otros módulos
2. **NO usar CharField para campos id** en serializers MongoDB
3. **NO eliminar renderer_classes** de los ViewSets
4. **NO revertir migración** 0002_convert_modalidad_to_fk

### **📁 Documentación Completa:**
- `/backend/apps/contratacion/MONGODB_OBJECTID_SERIALIZATION_FIX.md`

---

## ⚠️ RECORDATORIOS IMPORTANTES

1. **NUNCA modificar funcionalidad sin consultar**
2. **SIEMPRE seguir patrones de Medispensa**
3. **CUMPLIR estrictamente Resolución 2284 de 2023**
4. **MANTENER trazabilidad completa**
5. **VALIDAR plazos legales en todo momento**


---

## 🆕 MÓDULO DE AUDITORÍA - COMPLETAMENTE IMPLEMENTADO (31 Julio 2025)

### ✅ **Backend Auditoría Médica:**

#### 📁 **Modelos Backend Preparados:**
```python
# /backend/apps/auditoria/models_facturas.py
- FacturaRadicada: Facturas dentro de radicación
- ServicioFacturado: Servicios con tipos específicos

# /backend/apps/radicacion/models_auditoria.py (existente)
- PreGlosa: Pre-glosas automáticas
- GlosaOficial: Glosas aprobadas por auditor
- AsignacionAuditoria: Distribución equitativa
- TrazabilidadAuditoria: Log completo
```

#### 🔄 **Flujo Implementado:**
1. Auditor ve radicaciones pendientes → 2. Selecciona radicación → 3. Ve facturas → 4. Audita servicios → 5. Aplica glosas con códigos oficiales → 6. Finaliza auditoría

#### 🔐 **Roles Clarificados:**
- **Auditor (EPS)**: APLICA las glosas a los servicios
- **Prestador (PSS)**: RESPONDE a las glosas (5 días hábiles)

### 📁 **Documentación y Estado:**
- **Documentación completa:** `NEURAUDIT-AUDITORIA-MODULE-COMPLETE-DOCUMENTATION.md`
- **Estado:** ✅ Backend 100% implementado