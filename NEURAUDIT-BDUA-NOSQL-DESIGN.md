# 🏥 NEURAUDIT - DISEÑO BDUA NoSQL

## 📋 ANÁLISIS ESTRUCTURA BDUA

**Basado en muestras:** 23678-MS0021032024.TXT (Subsidiado) + 23678-MC0021032024.TXT (Contributivo)

### **Estructura de Campos Identificada:**
```
ID_UNICO,CODIGO_EPS,DOC_COTIZANTE,NUM_DOC_COTIZANTE,TIPO_DOC_USUARIO,NUM_DOC_USUARIO,
PRIMER_APELLIDO,SEGUNDO_APELLIDO,PRIMER_NOMBRE,SEGUNDO_NOMBRE,FECHA_NACIMIENTO,SEXO,
TIPO_USUARIO,PARENTESCO,ZONA,DISCAPACIDAD,ETNIA_POBLACION,FICHA_SISBEN,DPTO,MUNICIPIO,
TIPO_AFILIACION,FECHA_AFILIACION,FECHA_EFECTIVA_BD,FECHA_RETIRO,CAUSAL_RETIRO,
FECHA_RETIRO_BD,TIPO_TRASLADO,ESTADO_TRASLADO,ESTADO_AFILIACION,FECHA_ULTIMA_NOVEDAD,
FECHA_DEFUNCION,ID_CABEZA_FAMILIA,TIPO_SUBSIDIO,CODIGO_ENTIDAD,SUBRED,IBC,NIVEL_SISBEN,
PUNTAJE_SISBEN,OBSERVACIONES
```

---

## 🏗️ DISEÑO DOCUMENTO BDUA NoSQL

### **Colección: `bdua_afiliados`**

```javascript
{
  _id: ObjectId(),
  
  // IDENTIFICACIÓN ÚNICA SISTEMA
  id_unico: String, // ID único del registro BDUA
  codigo_eps: String, // EPSS41 (subsidiado) / EPS037 (contributivo)
  
  // RÉGIMEN Y TIPO
  regimen: Enum('SUBSIDIADO', 'CONTRIBUTIVO'), // Campo unificado
  tipo_afiliacion: String, // R=Rural, U=Urbano
  
  // DATOS BÁSICOS USUARIO
  usuario: {
    tipo_documento: Enum('CC', 'TI', 'RC', 'CE', 'PA', 'AS', 'MS'),
    numero_documento: String, // Único e indexado
    primer_apellido: String,
    segundo_apellido: String,
    primer_nombre: String,
    segundo_nombre: String,
    fecha_nacimiento: Date,
    sexo: Enum('M', 'F'),
    tipo_usuario: Enum('C', 'B', 'F'), // C=Cotizante, B=Beneficiario, F=Familiar
  },
  
  // COTIZANTE (si aplica)
  cotizante: {
    tipo_documento: String,
    numero_documento: String,
    // Solo si es beneficiario
  },
  
  // DATOS FAMILIARES
  familia: {
    parentesco: Number, // Código parentesco
    id_cabeza_familia: String,
    tipo_subsidio: Number
  },
  
  // UBICACIÓN GEOGRÁFICA
  ubicacion: {
    departamento: String, // Código DANE
    municipio: String, // Código DANE
    zona: Enum('1', '2'), // 1=Urbana, 2=Rural
  },
  
  // CARACTERÍSTICAS ESPECIALES
  caracteristicas: {
    discapacidad: Enum('N', 'S'), // N=No, S=Sí
    etnia_poblacion: String,
    nivel_sisben: String, // A01-A05, B01-B06, C01-C16, D01-D21
    puntaje_sisben: String,
    ficha_sisben: String
  },
  
  // ESTADO AFILIACIÓN
  afiliacion: {
    fecha_afiliacion: Date,
    fecha_efectiva_bd: Date,
    fecha_retiro: Date,
    causal_retiro: String,
    fecha_retiro_bd: Date,
    tipo_traslado: String,
    estado_traslado: String,
    estado_afiliacion: Enum('AC', 'ST', 'PL', 'RE', 'AF'), 
    // AC=Activo, ST=Suspendido Temporal, PL=Pendiente Legalización, RE=Retirado, AF=Afiliado
    fecha_ultima_novedad: Date,
    fecha_defuncion: Date
  },
  
  // DATOS CONTRIBUTIVO
  contributivo: {
    codigo_entidad: String, // Código entidad empleadora
    subred: String,
    ibc: Number, // Ingreso Base Cotización
    // Solo para régimen contributivo
  },
  
  // METADATOS
  metadata: {
    archivo_origen: String, // Nombre archivo BDUA origen
    fecha_carga: Date,
    fecha_actualizacion: Date,
    version_bdua: String,
    observaciones: String
  },
  
  // ÍNDICES PARA BÚSQUEDAS RÁPIDAS
  created_at: Date,
  updated_at: Date
}
```

---

## 🔍 ÍNDICES MONGODB REQUERIDOS

```javascript
// Índice principal por documento
db.bdua_afiliados.createIndex({ 
  "usuario.numero_documento": 1 
}, { unique: true })

// Índice por código EPS + documento
db.bdua_afiliados.createIndex({ 
  "codigo_eps": 1, 
  "usuario.numero_documento": 1 
})

// Índice por estado de afiliación
db.bdua_afiliados.createIndex({ 
  "afiliacion.estado_afiliacion": 1,
  "afiliacion.fecha_efectiva_bd": 1
})

// Índice por régimen
db.bdua_afiliados.createIndex({ 
  "regimen": 1,
  "afiliacion.estado_afiliacion": 1
})

// Índice por ubicación geográfica
db.bdua_afiliados.createIndex({ 
  "ubicacion.departamento": 1,
  "ubicacion.municipio": 1
})

// Índice por fecha de nacimiento (para validaciones edad)
db.bdua_afiliados.createIndex({ 
  "usuario.fecha_nacimiento": 1
})
```

---

## 🔄 FUNCIONES DE VALIDACIÓN DERECHOS

### **1. Validación Estado de Afiliación**
```javascript
const validarDerechosUsuario = async (tipoDocumento, numeroDocumento, fechaAtencion) => {
  const afiliado = await db.bdua_afiliados.findOne({
    "usuario.tipo_documento": tipoDocumento,
    "usuario.numero_documento": numeroDocumento
  })
  
  if (!afiliado) {
    return {
      valido: false,
      causal_devolucion: 'DE1601',
      mensaje: 'Usuario no encontrado en BDUA'
    }
  }
  
  // Verificar estado activo en fecha de atención
  const estadoValido = ['AC', 'ST'].includes(afiliado.afiliacion.estado_afiliacion)
  const fechaEfectiva = afiliado.afiliacion.fecha_efectiva_bd
  const fechaRetiro = afiliado.afiliacion.fecha_retiro
  
  if (!estadoValido || 
      fechaAtencion < fechaEfectiva || 
      (fechaRetiro && fechaAtencion > fechaRetiro)) {
    return {
      valido: false,
      causal_devolucion: 'DE1601',
      mensaje: 'Usuario sin derechos vigentes en fecha de atención'
    }
  }
  
  return {
    valido: true,
    afiliado: {
      regimen: afiliado.regimen,
      nivel_sisben: afiliado.caracteristicas.nivel_sisben,
      tipo_usuario: afiliado.usuario.tipo_usuario,
      estado_afiliacion: afiliado.afiliacion.estado_afiliacion
    }
  }
}
```

### **2. Validación Cobertura por Régimen**
```javascript
const validarCoberturaPorRegimen = (afiliado, codigoServicio) => {
  const coberturas = {
    SUBSIDIADO: {
      niveles_sisben: ['A01', 'A02', 'A03', 'A04', 'A05', 'B01', 'B02', 'B03'],
      plan_beneficios: 'PBS' // Plan de Beneficios en Salud
    },
    CONTRIBUTIVO: {
      niveles_sisben: ['C01', 'C02', 'C03', 'D01', 'D02'], // Aplica para algunos casos
      plan_beneficios: 'POS' // Plan Obligatorio de Salud
    }
  }
  
  const cobertura = coberturas[afiliado.regimen]
  
  return {
    plan_beneficios: cobertura.plan_beneficios,
    nivel_sisben: afiliado.caracteristicas.nivel_sisben,
    cobertura_valida: true // Se validará contra catálogos CUPS/CUM
  }
}
```

---

## 📥 CARGA MASIVA ARCHIVOS BDUA

### **Script de Importación**
```javascript
const cargarArchivoBDUA = async (rutaArchivo, tipoRegimen) => {
  const fs = require('fs')
  const readline = require('readline')
  
  const fileStream = fs.createReadStream(rutaArchivo)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  
  const lote = []
  let contador = 0
  
  for await (const linea of rl) {
    const campos = linea.split(',')
    
    const documento = {
      id_unico: campos[0],
      codigo_eps: campos[1],
      regimen: tipoRegimen, // 'SUBSIDIADO' o 'CONTRIBUTIVO'
      
      usuario: {
        tipo_documento: campos[4],
        numero_documento: campos[5],
        primer_apellido: campos[6],
        segundo_apellido: campos[7],
        primer_nombre: campos[8],
        segundo_nombre: campos[9],
        fecha_nacimiento: new Date(campos[10].split('/').reverse().join('-')),
        sexo: campos[11],
        tipo_usuario: campos[12]
      },
      
      cotizante: campos[2] ? {
        tipo_documento: campos[2],
        numero_documento: campos[3]
      } : null,
      
      familia: {
        parentesco: parseInt(campos[13]) || null,
        id_cabeza_familia: campos[28] !== '-1' ? campos[28] : null,
        tipo_subsidio: parseInt(campos[29]) || null
      },
      
      ubicacion: {
        departamento: campos[17],
        municipio: campos[18],
        zona: campos[14]
      },
      
      caracteristicas: {
        discapacidad: campos[15],
        etnia_poblacion: campos[16],
        nivel_sisben: campos[32],
        puntaje_sisben: campos[33],
        ficha_sisben: campos[16]
      },
      
      afiliacion: {
        tipo_afiliacion: campos[19],
        fecha_afiliacion: new Date(campos[20].split('/').reverse().join('-')),
        fecha_efectiva_bd: new Date(campos[21].split('/').reverse().join('-')),
        fecha_retiro: campos[22] ? new Date(campos[22].split('/').reverse().join('-')) : null,
        causal_retiro: campos[23] || null,
        fecha_retiro_bd: campos[24] ? new Date(campos[24].split('/').reverse().join('-')) : null,
        tipo_traslado: campos[25] || null,
        estado_traslado: campos[26] || null,
        estado_afiliacion: campos[27],
        fecha_ultima_novedad: new Date(campos[26].split('/').reverse().join('-')),
        fecha_defuncion: campos[27] ? new Date(campos[27].split('/').reverse().join('-')) : null
      },
      
      contributivo: tipoRegimen === 'CONTRIBUTIVO' ? {
        codigo_entidad: campos[30],
        subred: campos[31],
        ibc: parseFloat(campos[32]) || null
      } : null,
      
      metadata: {
        archivo_origen: path.basename(rutaArchivo),
        fecha_carga: new Date(),
        version_bdua: extraerVersionBDUA(rutaArchivo)
      },
      
      created_at: new Date(),
      updated_at: new Date()
    }
    
    lote.push(documento)
    contador++
    
    // Insertar en lotes de 1000
    if (lote.length === 1000) {
      await db.bdua_afiliados.insertMany(lote, { ordered: false })
      console.log(`Procesados ${contador} registros...`)
      lote.length = 0
    }
  }
  
  // Insertar último lote
  if (lote.length > 0) {
    await db.bdua_afiliados.insertMany(lote, { ordered: false })
  }
  
  console.log(`Carga completa: ${contador} registros procesados`)
}
```

---

## 🔗 INTEGRACIÓN CON AUDITORÍA DE CUENTAS

### **Validación Automática en Radicación**
```javascript
const validarCuentaMedica = async (ripsData) => {
  const validaciones = []
  
  for (const consulta of ripsData.consultas) {
    const validacionDerechos = await validarDerechosUsuario(
      consulta.tipo_documento_usuario,
      consulta.numero_documento_usuario,
      new Date(consulta.fecha_consulta)
    )
    
    if (!validacionDerechos.valido) {
      validaciones.push({
        tipo: 'DEVOLUCION',
        codigo: validacionDerechos.causal_devolucion,
        usuario: consulta.numero_documento_usuario,
        mensaje: validacionDerechos.mensaje,
        valor_afectado: consulta.valor_consulta
      })
    } else {
      // Validar cobertura del servicio
      const cobertura = validarCoberturaPorRegimen(
        validacionDerechos.afiliado,
        consulta.codigo_cups
      )
      
      validaciones.push({
        tipo: 'VALIDO',
        usuario: consulta.numero_documento_usuario,
        regimen: validacionDerechos.afiliado.regimen,
        plan_beneficios: cobertura.plan_beneficios
      })
    }
  }
  
  return validaciones
}
```

---

## 📊 ESTADÍSTICAS Y REPORTES BDUA

### **Dashboard BDUA**
```javascript
const estadisticasBDUA = async () => {
  const pipeline = [
    {
      $group: {
        _id: "$regimen",
        total_afiliados: { $sum: 1 },
        activos: {
          $sum: {
            $cond: [{ $eq: ["$afiliacion.estado_afiliacion", "AC"] }, 1, 0]
          }
        },
        por_departamento: {
          $push: "$ubicacion.departamento"
        }
      }
    }
  ]
  
  const resultado = await db.bdua_afiliados.aggregate(pipeline).toArray()
  
  return {
    total_bdua: resultado.reduce((sum, r) => sum + r.total_afiliados, 0),
    subsidiado: resultado.find(r => r._id === 'SUBSIDIADO'),
    contributivo: resultado.find(r => r._id === 'CONTRIBUTIVO'),
    fecha_actualizacion: new Date()
  }
}
```

---

## ⚠️ CONSIDERACIONES DE IMPLEMENTACIÓN

### **1. Privacidad y Seguridad**
- **Encriptación** de números de documento en reposo
- **Logs de auditoría** para accesos a BDUA
- **Anonimización** en reportes estadísticos

### **2. Rendimiento**
- **Índices optimizados** para consultas frecuentes
- **Cache** de validaciones recientes (Redis)
- **Particionamiento** por departamento si es necesario

### **3. Actualización**
- **Carga incremental** de archivos BDUA mensuales
- **Versionado** de registros modificados
- **Reconciliación** automática de diferencias

---

**🏥 NEURAUDIT - BDUA NoSQL DESIGN**  
**📅 Diseño:** 30 Julio 2025  
**💾 Base de Datos:** MongoDB - Documento único unificado  
**🔒 Régimen:** Campo unificado SUBSIDIADO/CONTRIBUTIVO  

---

**¡BDUA DISEÑADA COMO NoSQL UNIFICADA!** 🚀