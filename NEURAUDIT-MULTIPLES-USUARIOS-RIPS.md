# 📊 NEURAUDIT - SISTEMA DE MÚLTIPLES USUARIOS RIPS

## 📅 **INFORMACIÓN DE LA IMPLEMENTACIÓN**
- **Fecha:** 30 Julio 2025
- **Funcionalidad:** Visualización de múltiples usuarios del RIPS (máximo 5)
- **Problema Resuelto:** Solo mostraba datos genéricos CC 0000000000
- **Estado:** ✅ **IMPLEMENTADO Y FUNCIONANDO**

---

## 🎯 **OBJETIVO CUMPLIDO**

### **Requerimiento del Usuario:**
> "AHI DEBERIA MOSTRAR LOS DATOS DE LOS 5 PRIMEROS USUARIOS CON SUS DATOS REALES DEL JSON CON LAS SIGUIENTES VARIABLES TIPO DE DOCUMENTO, NUMERO DE DOCUMENTO, FECHA DE NACIMIENTO Y SEXO. ACLARAR QUE EN SEXO PODRIA LLEVAR "I" TAMBIEN."

### **Solución Implementada:**
- ✅ Tabla que muestra hasta 5 usuarios del RIPS
- ✅ Datos reales extraídos del JSON: Tipo Doc, Número Doc, Fecha Nacimiento, Edad, Sexo
- ✅ Soporte para sexo "I" (Indeterminado)
- ✅ Cálculo automático de edad desde fecha de nacimiento
- ✅ Diseño consistente con la plantilla Vyzor

---

## 🔧 **IMPLEMENTACIÓN TÉCNICA**

### **1. Backend - Nueva Función de Extracción**

**Archivo:** `/backend/apps/radicacion/document_parser.py`

```python
@staticmethod
def extract_multiple_patients_from_rips(rips_data: dict, max_patients: int = 5) -> list:
    """Extrae múltiples pacientes desde RIPS - Máximo 5 usuarios"""
    patients_list = []
    usuarios = rips_data.get('usuarios', [])
    
    # Limitar a los primeros max_patients usuarios
    for i, usuario in enumerate(usuarios[:max_patients]):
        patient = {
            'tipo_documento': usuario.get('tipoDocumentoIdentificacion', 'CC').strip(),
            'numero_documento': usuario.get('numDocumentoIdentificacion', '').strip(),
            'fecha_nacimiento': usuario.get('fechaNacimiento', ''),
            'sexo': 'M',  # Default
            'edad': 0
        }
        
        # Código de sexo (estándar RIPS)
        sexo = usuario.get('codSexo', '').upper().strip()
        if not sexo:
            sexo = usuario.get('sexo', '').upper().strip()
        
        if sexo in ['M', 'F', 'I']:  # M=Masculino, F=Femenino, I=Indeterminado
            patient['sexo'] = sexo
        elif sexo in ['MASCULINO', 'MALE', '1']:
            patient['sexo'] = 'M'
        elif sexo in ['FEMENINO', 'FEMALE', '2']:
            patient['sexo'] = 'F'
        elif sexo in ['INDETERMINADO', '3']:
            patient['sexo'] = 'I'
        
        # Calcular edad desde fecha nacimiento
        fecha_nac = patient['fecha_nacimiento']
        if fecha_nac:
            try:
                from datetime import datetime, date
                if isinstance(fecha_nac, str):
                    if 'T' in fecha_nac:
                        fecha_clean = fecha_nac.split('T')[0]
                    else:
                        fecha_clean = fecha_nac
                    fecha_nacimiento = datetime.strptime(fecha_clean, '%Y-%m-%d').date()
                    
                    # Calcular edad en años
                    today = date.today()
                    edad = today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
                    patient['edad'] = edad
                    patient['fecha_nacimiento_formateada'] = fecha_nacimiento.strftime('%d/%m/%Y')
            except:
                patient['fecha_nacimiento_formateada'] = fecha_nac[:10] if len(fecha_nac) >= 10 else fecha_nac
        
        patients_list.append(patient)
    
    return patients_list
```

### **2. Corrección Crítica del Parser RIPS**

**⚠️ PROBLEMA IDENTIFICADO:** Los usuarios no se estaban guardando en `data['usuarios']`

**✅ SOLUCIÓN:**
```python
# IMPORTANTE: Guardar usuarios en data para que estén disponibles
data['usuarios'] = usuarios
```

### **3. Endpoint Actualizado**

**Archivo:** `/backend/apps/radicacion/views.py`

```python
# Extraer múltiples pacientes (primeros 5)
rips_data = extracted_data.get('rips_data', {})
multiple_patients = DataMapper.extract_multiple_patients_from_rips(rips_data, max_patients=5)

# Agregar a la respuesta
response_data = {
    'extracted_info': {
        'pacientes_multiples': multiple_patients  # Lista de hasta 5 pacientes
    }
}
```

### **4. Frontend - Tabla de Usuarios**

**Archivo:** `/frontend-vue3/src/views/radicacion/NuevaRadicacion.vue`

```vue
<!-- Usuarios RIPS - Primeros 5 Pacientes -->
<div class="col-xl-12" v-if="extractedInfo && (extractedInfo.pacientes_multiples || extractedInfo.paciente)">
  <div class="card custom-card">
    <div class="card-header">
      <div class="card-title">
        <i class="ri-group-line me-2"></i>Usuarios del RIPS {{ extractedInfo.pacientes_multiples ? '(Primeros ' + extractedInfo.pacientes_multiples.length + ')' : '' }}
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered text-nowrap">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tipo Documento</th>
              <th scope="col">Número Documento</th>
              <th scope="col">Fecha Nacimiento</th>
              <th scope="col">Edad</th>
              <th scope="col">Sexo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(paciente, index) in extractedInfo.pacientes_multiples" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <span class="badge bg-primary-transparent">{{ paciente.tipo_documento }}</span>
              </td>
              <td class="fw-semibold">{{ paciente.numero_documento }}</td>
              <td>{{ paciente.fecha_nacimiento_formateada || 'N/D' }}</td>
              <td>
                <span class="badge bg-info-transparent">{{ paciente.edad }} años</span>
              </td>
              <td>
                <span class="badge" :class="{
                  'bg-primary-transparent': paciente.sexo === 'M',
                  'bg-pink-transparent': paciente.sexo === 'F',
                  'bg-warning-transparent': paciente.sexo === 'I'
                }">
                  {{ paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Indeterminado' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-muted small mt-2">
        <i class="ri-information-line me-1"></i>
        Se muestran únicamente los primeros 5 usuarios del archivo RIPS para protección de datos.
      </div>
    </div>
  </div>
</div>
```

---

## 📋 **CARACTERÍSTICAS IMPLEMENTADAS**

### **1. Extracción de Datos:**
- ✅ Tipo de documento (CC, TI, CE, PA, RC, etc.)
- ✅ Número de documento
- ✅ Fecha de nacimiento (formato DD/MM/YYYY)
- ✅ Edad calculada automáticamente
- ✅ Sexo con soporte para M, F, I

### **2. Mapeo de Sexos:**
- ✅ `M`, `MASCULINO`, `MALE`, `1` → **M** (Masculino)
- ✅ `F`, `FEMENINO`, `FEMALE`, `2` → **F** (Femenino)
- ✅ `I`, `INDETERMINADO`, `3` → **I** (Indeterminado)

### **3. Diseño Visual:**
- ✅ Tabla responsive con bordes
- ✅ Badges de colores para tipo documento y edad
- ✅ Badges con colores por sexo:
  - Masculino: `bg-primary-transparent` (azul)
  - Femenino: `bg-pink-transparent` (rosa)
  - Indeterminado: `bg-warning-transparent` (amarillo)
- ✅ Nota de protección de datos

### **4. Límites y Seguridad:**
- ✅ Máximo 5 usuarios mostrados
- ✅ Sin información personal sensible (nombres)
- ✅ Solo identificadores únicos

---

## 🧪 **ARCHIVOS DE PRUEBA**

### **1. RIPS Real:**
- **Archivo:** `/context/A01E5687.json`
- **Usuarios:** 4 usuarios reales

### **2. RIPS de Ejemplo:**
- **Archivo:** `/context/RIPS_EJEMPLO_5_USUARIOS.json`
- **Usuarios:** 5 usuarios diversos para testing

---

## 🔒 **ARCHIVOS CRÍTICOS - NO MODIFICAR**

### **⛔ Backend:**
```
/backend/apps/radicacion/document_parser.py
├── Línea 365: data['usuarios'] = usuarios  ← CRÍTICO
├── Función: extract_multiple_patients_from_rips()
└── Función: extract_patient_data_from_rips()

/backend/apps/radicacion/views.py
├── Línea 390-395: Extracción múltiples pacientes
└── Línea 423: 'pacientes_multiples': multiple_patients
```

### **⛔ Frontend:**
```
/frontend-vue3/src/views/radicacion/NuevaRadicacion.vue
├── Líneas 179-230: Tabla de usuarios RIPS
└── Líneas 556: Log de debug pacientes múltiples
```

---

## 🎯 **RESULTADOS FINALES**

### **✅ ANTES:**
- Solo mostraba CC 0000000000
- Datos genéricos hardcodeados
- Un solo paciente ficticio

### **✅ AHORA:**
- Tabla con hasta 5 usuarios reales
- Datos extraídos del JSON RIPS
- Tipos de documento variados
- Edades calculadas automáticamente
- Soporte para sexo Indeterminado
- Diseño profesional con badges

---

## 📊 **LOGS DE VERIFICACIÓN**

Cuando el sistema funciona correctamente, verás en los logs del backend:
```
INFO RIPS data disponible: True
INFO Usuarios en RIPS: 4
INFO Pacientes múltiples extraídos: 4
```

Y en la consola del navegador:
```
👥 PACIENTES MÚLTIPLES: Array(4) [...]
```

---

## 🚨 **ADVERTENCIAS**

### **1. Dependencia Crítica:**
La línea `data['usuarios'] = usuarios` en `document_parser.py` es **CRÍTICA**. Sin ella, los usuarios no se pasan al frontend.

### **2. Archivos Relacionados:**
Este sistema depende de:
- ✅ Extracción XML AttachedDocument (solucionado anteriormente)
- ✅ Sistema anti-cruces con NIT en radicado
- ✅ Protección de datos personales

### **3. Compatibilidad:**
- Compatible con RIPS JSON estándar MinSalud
- Maneja diferentes formatos de fecha
- Soporta todos los tipos de documento colombianos

---

**🏥 Sistema de Múltiples Usuarios RIPS - NeurAudit Colombia**  
**📅 Implementado:** 30 Julio 2025  
**🎯 Estado:** ✅ FUNCIONAL Y PROBADO  
**📋 Versión:** 5.0 Multiple RIPS Users Display  

---

## 📋 **RESUMEN EJECUTIVO**

**PROBLEMA:** Solo mostraba un usuario genérico CC 0000000000.

**SOLUCIÓN:** Extracción y visualización de hasta 5 usuarios reales del RIPS con todos sus datos.

**RESULTADO:** Tabla profesional con datos reales de usuarios incluyendo soporte para sexo Indeterminado.

**IMPACTO:** Cumplimiento con requerimientos de visualización de datos RIPS manteniendo protección de información sensible.