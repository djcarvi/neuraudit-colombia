# 🏗️ ARQUITECTURA MONGODB NATIVA - NeurAudit Colombia

**Fecha:** 30 Julio 2025  
**Estado:** PROPUESTA DE MEJORA ARQUITECTURAL  

---

## 🚨 PROBLEMA IDENTIFICADO

### **Djongo vs MongoDB Oficial**

❌ **PROBLEMA ACTUAL:**
- Estamos usando `djongo` que NO es el enfoque oficial de MongoDB
- Djongo trata de forzar el ORM relacional de Django sobre MongoDB
- Crea impedancia entre modelo relacional y NoSQL
- No aprovecha las capacidades nativas de MongoDB

✅ **SOLUCIÓN RECOMENDADA:**
- **MongoDB Django Backend Oficial** (en desarrollo por MongoDB Labs)
- **PyMongo directo** para operaciones NoSQL puras
- **Arquitectura híbrida** Django + PyMongo

---

## 🏛️ ARQUITECTURA PROPUESTA

### **Opción 1: Django MongoDB Backend Oficial**
```python
# Backend oficial de MongoDB Labs
# GitHub: https://github.com/mongodb-labs/django-mongodb

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb',
        'NAME': 'neuraudit_colombia_db',
        'OPTIONS': {
            'host': 'mongodb://localhost:27017',
        }
    }
}

# Modelos nativos para MongoDB
class RIPSTransaccion(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    num_factura = models.CharField(max_length=50)
    # Subdocumentos nativos
    usuarios = models.ArrayField(
        models.EmbeddedField(RIPSUsuarioEmbedded)
    )
    
    class Meta:
        db_table = 'rips_transacciones'
```

### **Opción 2: PyMongo Directo (NoSQL Puro)**
```python
# Conexión PyMongo directa
import pymongo
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client.neuraudit_colombia_db

# Operaciones NoSQL puras
class RIPSService:
    def __init__(self):
        self.collection = db.rips_transacciones
    
    def crear_transaccion(self, data):
        # Estructura NoSQL pura con subdocumentos
        documento = {
            "numFactura": data["num_factura"],
            "prestadorNit": data["prestador_nit"],
            "usuarios": [
                {
                    "documento": usuario["documento"],
                    "servicios": {
                        "consultas": usuario.get("consultas", []),
                        "procedimientos": usuario.get("procedimientos", []),
                        "medicamentos": usuario.get("medicamentos", [])
                    }
                }
                for usuario in data["usuarios"]
            ],
            "fechaRadicacion": datetime.now(),
            "estadisticas": self._calcular_estadisticas(data)
        }
        
        return self.collection.insert_one(documento)
```

### **Opción 3: Arquitectura Híbrida (Recomendada)**
```python
# Django para autenticación, permisos, admin
# PyMongo para datos NoSQL complejos

# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # Para auth/sessions
        'NAME': 'neuraudit_auth',
    }
}

MONGODB_SETTINGS = {
    'host': 'mongodb://localhost:27017/',
    'database': 'neuraudit_colombia_db'
}

# Servicios NoSQL puros
class MongoDBService:
    def __init__(self):
        self.client = MongoClient(settings.MONGODB_SETTINGS['host'])
        self.db = self.client[settings.MONGODB_SETTINGS['database']]
    
    def get_collection(self, name):
        return self.db[name]
```

---

## 📊 ESTRUCTURA DE DATOS NOSQL PURA

### **Documento RIPS Completo**
```json
{
  "_id": ObjectId("64f8a1234567890abcdef123"),
  "numFactura": "FE470638",
  "prestadorNit": "823002991",
  "fechaRadicacion": ISODate("2025-07-30T10:30:00Z"),
  "estadoProcesamiento": "VALIDADO",
  "usuarios": [
    {
      "_id": ObjectId("64f8a1234567890abcdef124"),
      "tipoDocumento": "CC",
      "numeroDocumento": "1102810946",
      "datosPersonales": {
        "fechaNacimiento": ISODate("2005-10-02"),
        "sexo": "F",
        "municipioResidencia": "11001"
      },
      "servicios": {
        "consultas": [
          {
            "_id": ObjectId("64f8a1234567890abcdef125"),
            "codPrestador": "700010204201",
            "fechaAtencion": ISODate("2025-03-14T15:11:00Z"),
            "codConsulta": "890350",
            "diagnosticoPrincipal": "N979",
            "vrServicio": 45000,
            "validacion": {
              "estado": "VALIDADO",
              "glosas": [],
              "observaciones": ""
            }
          }
        ],
        "procedimientos": [...],
        "medicamentos": [...],
        "urgencias": [...],
        "hospitalizacion": [...],
        "otrosServicios": [...],
        "recienNacidos": [...]
      },
      "validacionBDUA": {
        "tieneDerechos": true,
        "regimen": "MS",
        "epsActual": "EPS001",
        "fechaValidacion": ISODate("2025-07-30T10:30:00Z")
      },
      "estadisticasUsuario": {
        "totalServicios": 5,
        "valorTotal": 850000,
        "serviciosValidados": 4,
        "serviciosGlosados": 1
      }
    }
  ],
  "preAuditoria": {
    "preDevolucion": {
      "requiere": false,
      "causales": []
    },
    "preGlosas": {
      "total": 3,
      "porCategoria": {
        "FA": 1,
        "CL": 2
      },
      "valorTotal": 125000,
      "asignacion": {
        "auditorAsignado": "auditor.medico1",
        "fechaAsignacion": ISODate("2025-07-30T10:35:00Z"),
        "fechaLimite": ISODate("2025-08-09T23:59:59Z")
      }
    }
  },
  "estadisticasTransaccion": {
    "totalUsuarios": 1835,
    "totalServicios": 8045,
    "valorTotalFacturado": 15750000,
    "serviciosValidados": 7200,
    "serviciosGlosados": 845,
    "valorGlosado": 2150000,
    "distribucionServicios": {
      "consultas": 5916,
      "procedimientos": 1411,
      "hospitalizacion": 62,
      "urgencias": 35,
      "otrosServicios": 620,
      "recienNacidos": 1
    }
  },
  "trazabilidad": [
    {
      "evento": "TRANSACCION_RADICADA",
      "fecha": ISODate("2025-07-30T10:30:00Z"),
      "usuario": "sistema.radicacion",
      "descripcion": "Transacción radicada automáticamente"
    },
    {
      "evento": "PRE_AUDITORIA_COMPLETADA",
      "fecha": ISODate("2025-07-30T10:35:00Z"),
      "usuario": "sistema.preauditoria",
      "descripcion": "Pre-auditoría completada: 0 pre-devoluciones, 3 pre-glosas"
    }
  ]
}
```

### **Documento de Asignación a Auditores**
```json
{
  "_id": ObjectId("64f8a1234567890abcdef126"),
  "fechaAsignacion": ISODate("2025-07-30T11:00:00Z"),
  "tipoAsignacion": "AUTOMATICA",
  "propuestaAprobada": {
    "coordinadorAprobador": "coordinador.auditoria",
    "fechaAprobacion": ISODate("2025-07-30T10:58:00Z"),
    "observaciones": "Distribución equilibrada aprobada"
  },
  "distribucionAuditores": {
    "auditor.admin1": {
      "perfil": "ADMINISTRATIVO",
      "preGlosasAsignadas": [
        {
          "transaccionId": ObjectId("64f8a1234567890abcdef123"),
          "preGlosaId": ObjectId("64f8a1234567890abcdef127"),
          "categoria": "FA",
          "valorGlosado": 45000,
          "prioridad": "MEDIA"
        }
      ],
      "totalPreGlosas": 5,
      "valorTotalAsignado": 675000,
      "fechaLimiteAuditoria": ISODate("2025-08-09T23:59:59Z")
    },
    "auditor.medico1": {
      "perfil": "MEDICO",
      "preGlosasAsignadas": [
        {
          "transaccionId": ObjectId("64f8a1234567890abcdef123"),
          "preGlosaId": ObjectId("64f8a1234567890abcdef128"),
          "categoria": "CL",
          "valorGlosado": 125000,
          "prioridad": "ALTA"
        }
      ],
      "totalPreGlosas": 3,
      "valorTotalAsignado": 425000,
      "fechaLimiteAuditoria": ISODate("2025-08-09T23:59:59Z")
    }
  },
  "estadisticasAsignacion": {
    "totalAuditoresInvolucrados": 2,
    "totalPreGlosasAsignadas": 8,
    "valorTotalAsignado": 1100000,
    "indiceBalance": 0.85,
    "criteriosAplicados": [
      "Distribución por perfil profesional",
      "Balance de carga de trabajo",
      "Especialización por categoría de glosa"
    ]
  }
}
```

---

## 🔧 IMPLEMENTACIÓN RECOMENDADA

### **Fase 1: Migración Gradual**
1. **Mantener Django** para autenticación, admin, APIs REST
2. **Migrar datos NoSQL** a PyMongo directo
3. **Crear servicios híbridos** Django + MongoDB

### **Fase 2: Servicios NoSQL Puros**
```python
# apps/core/mongodb_service.py
class MongoDBService:
    def __init__(self):
        self.client = MongoClient(settings.MONGODB_URI)
        self.db = self.client[settings.MONGODB_DATABASE]
    
    # Colecciones principales
    @property
    def rips_transacciones(self):
        return self.db.rips_transacciones
    
    @property
    def catalogs_cups(self):
        return self.db.catalogs_cups
    
    @property
    def bdua_afiliados(self):
        return self.db.bdua_afiliados

# apps/radicacion/services.py
class RIPSService:
    def __init__(self):
        self.mongo = MongoDBService()
        self.collection = self.mongo.rips_transacciones
    
    def crear_transaccion_completa(self, rips_data):
        # Procesamiento NoSQL puro con subdocumentos
        documento = self._construir_documento_rips(rips_data)
        resultado = self.collection.insert_one(documento)
        return resultado.inserted_id
    
    def obtener_transaccion_con_usuarios(self, transaccion_id):
        # Consulta NoSQL con proyección
        return self.collection.find_one(
            {"_id": ObjectId(transaccion_id)},
            {
                "numFactura": 1,
                "usuarios": 1,
                "estadisticasTransaccion": 1
            }
        )
    
    def actualizar_estado_validacion(self, transaccion_id, nuevo_estado):
        # Update NoSQL directo
        return self.collection.update_one(
            {"_id": ObjectId(transaccion_id)},
            {
                "$set": {"estadoProcesamiento": nuevo_estado},
                "$push": {
                    "trazabilidad": {
                        "evento": "ESTADO_ACTUALIZADO",
                        "fecha": datetime.now(),
                        "nuevoEstado": nuevo_estado
                    }
                }
            }
        )
```

### **Fase 3: APIs Django + MongoDB**
```python
# apps/radicacion/views.py
from django.http import JsonResponse
from .services import RIPSService

class RIPSAPIView(APIView):
    def __init__(self):
        self.rips_service = RIPSService()
    
    def post(self, request):
        # Validación Django
        if not request.user.has_perm('radicacion.add_rips'):
            return Response(status=403)
        
        # Procesamiento NoSQL
        transaccion_id = self.rips_service.crear_transaccion_completa(
            request.data
        )
        
        return Response({
            'transaccion_id': str(transaccion_id),
            'status': 'created'
        })
```

---

## ✅ VENTAJAS DE LA ARQUITECTURA PROPUESTA

### **NoSQL Puro:**
1. **Aprovecha MongoDB nativo** - Sin impedancia ORM
2. **Subdocumentos reales** - Estructura jerárquica natural
3. **Consultas MongoDB nativas** - Aggregation pipeline, $lookup, etc.
4. **Escalabilidad horizontal** - Sharding nativo de MongoDB

### **Performance:**
1. **Sin JOINs** - Datos desnormalizados inteligentemente
2. **Consultas atómicas** - Un documento = una transacción completa
3. **Índices MongoDB** - Optimizados para consultas NoSQL
4. **Caching natural** - Documentos completos en memoria

### **Flexibilidad:**
1. **Schema dinámico** - Evolución sin migraciones complejas
2. **Agregaciones complejas** - Pipeline de agregación MongoDB
3. **Búsquedas avanzadas** - Text search, geoespacial, etc.
4. **Validaciones de documento** - JSON Schema validation

---

## 🚀 PLAN DE MIGRACIÓN

### **Semana 1:**
- [ ] Configurar MongoDB Django Backend oficial
- [ ] Migrar modelos de autenticación a PostgreSQL
- [ ] Configurar PyMongo para datos NoSQL

### **Semana 2:**
- [ ] Migrar catálogos CUPS/CUM/IUM a documentos NoSQL
- [ ] Implementar servicios híbridos
- [ ] Crear APIs REST con backend NoSQL

### **Semana 3:**
- [ ] Migrar datos RIPS a estructura de documentos
- [ ] Implementar motor de validación NoSQL
- [ ] Testing de rendimiento

### **Semana 4:**
- [ ] Migrar sistema de asignaciones
- [ ] Implementar dashboard con agregaciones MongoDB
- [ ] Documentación final

---

**¿Quieres que procedamos con esta migración hacia una arquitectura MongoDB verdaderamente nativa?**