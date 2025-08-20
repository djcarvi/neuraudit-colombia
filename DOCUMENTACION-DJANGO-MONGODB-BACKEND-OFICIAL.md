# 📖 DOCUMENTACIÓN DJANGO MONGODB BACKEND OFICIAL - NeurAudit Colombia

**Fecha:** 30 Julio 2025  
**Autor:** Analítica Neuronal  
**Proyecto:** NeurAudit Colombia  

---

## 🚨 REGLAS CRÍTICAS - NUNCA OLVIDAR

### ⚡ **CAMPOS OBJETID - DIFERENCIA CRÍTICA:**

#### 🔴 **ObjectIdAutoField - SOLO para PRIMARY KEYS**
```python
from django_mongodb_backend.fields import ObjectIdAutoField

class MiModelo(models.Model):
    id = ObjectIdAutoField(primary_key=True)  # ✅ CORRECTO para PK
```
- **Uso:** Primary keys de documentos MongoDB
- **Hereda de:** `AutoField` de Django
- **db_column:** Automáticamente usa `"_id"`
- **Comportamiento:** Como AutoField pero para ObjectId

#### 🔵 **ObjectIdField - Para referencias y campos normales**
```python
from django_mongodb_backend.fields import ObjectIdField

class MiModelo(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    referencia_id = ObjectIdField(null=True, blank=True)  # ✅ CORRECTO para referencias
```
- **Uso:** Referencias a otros documentos, campos ObjectId no-PK
- **Hereda de:** `Field` de Django
- **db_column:** Campo normal
- **Comportamiento:** Campo ObjectId estándar

---

## 🏗️ ARQUITECTURA OFICIAL DJANGO MONGODB BACKEND

### **1. ENGINE CORRECTO:**
```python
DATABASES = {
    "default": {
        "ENGINE": "django_mongodb_backend",  # ✅ OFICIAL
        "HOST": "mongodb://localhost:27017/",
        "NAME": "neuraudit_colombia_db",
        "OPTIONS": {
            "retryWrites": True,
            "w": "majority",
        },
    }
}
```

### **2. IMPORTS CORRECTOS:**
```python
from django.db import models
from django_mongodb_backend.fields import (
    ObjectIdAutoField,      # Para PRIMARY KEYS
    ObjectIdField,          # Para referencias ObjectId
    ArrayField,             # Para arrays
    EmbeddedModelField,     # Para subdocumentos únicos
    EmbeddedModelArrayField # Para arrays de subdocumentos
)
from django_mongodb_backend.models import EmbeddedModel
```

### **3. CONFIGURACIÓN AUTOMÁTICA con parse_uri():**
```python
import django_mongodb_backend

MONGODB_URI = "mongodb://localhost:27017/"
DATABASES = {
    "default": django_mongodb_backend.parse_uri(
        MONGODB_URI, 
        db_name="neuraudit_colombia_db"
    )
}
```

---

## 📝 PATRONES DE MODELOS CORRECTOS

### **A. Modelo Principal (Documento Raíz):**
```python
class RIPSTransaccion(models.Model):
    """Documento principal de transacción RIPS"""
    id = ObjectIdAutoField(primary_key=True)  # ✅ PRIMARY KEY
    
    # Campos básicos
    numFactura = models.CharField(max_length=50, db_index=True)
    prestadorNit = models.CharField(max_length=20, db_index=True)
    fechaRadicacion = models.DateTimeField(auto_now_add=True)
    
    # Array de subdocumentos embebidos
    usuarios = EmbeddedModelArrayField(RIPSUsuario, null=True, blank=True)
    
    # Subdocumento único embebido
    estadisticas = EmbeddedModelField(EstadisticasTransaccion, null=True, blank=True)
    
    # Arrays simples
    tiposServicio = ArrayField(models.CharField(max_length=50), null=True, blank=True)
    
    class Meta:
        db_table = "rips_transacciones"
        indexes = [
            models.Index(fields=["numFactura", "prestadorNit"], name="rips_factura_idx"),
            models.Index(fields=["fechaRadicacion"], name="rips_fecha_idx"),
        ]
```

### **B. Modelo Embebido (Subdocumento):**
```python
class RIPSUsuario(EmbeddedModel):  # ✅ Hereda de EmbeddedModel
    """Subdocumento embebido para usuarios RIPS"""
    # NO tiene ObjectIdAutoField - es subdocumento
    
    tipoDocumento = models.CharField(max_length=5)
    numeroDocumento = models.CharField(max_length=20)
    fechaNacimiento = models.DateField()
    
    # Subdocumento anidado
    servicios = EmbeddedModelField(ServiciosUsuario, null=True, blank=True)
    
    # Array de servicios
    consultas = EmbeddedModelArrayField(Consulta, null=True, blank=True)
```

### **C. Modelo con Referencias (Relaciones NoSQL):**
```python
class AsignacionAuditoria(models.Model):
    """Documento con referencias a otros documentos"""
    id = ObjectIdAutoField(primary_key=True)  # ✅ PRIMARY KEY
    
    # Referencias ObjectId a otros documentos
    transaccion_id = ObjectIdField(db_index=True)  # ✅ Referencia
    
    # Array de ObjectIds
    pre_glosas_ids = ArrayField(ObjectIdField(), null=True, blank=True)
    
    auditor_username = models.CharField(max_length=100, db_index=True)
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "asignaciones_auditoria"
```

---

## 🔧 OPERACIONES CRUD CORRECTAS

### **1. Crear Documentos:**
```python
# Documento con subdocumentos embebidos
usuario_embebido = RIPSUsuario(
    tipoDocumento="CC",
    numeroDocumento="12345678",
    fechaNacimiento=date(1990, 1, 1)
)

transaccion = RIPSTransaccion.objects.create(
    numFactura="FE001",
    prestadorNit="123456789",
    usuarios=[usuario_embebido],  # Array de subdocumentos
    tiposServicio=["consultas", "procedimientos"]  # Array simple
)
```

### **2. Consultar con Subdocumentos:**
```python
# Filtrar por campos de subdocumentos
transacciones = RIPSTransaccion.objects.filter(
    usuarios__tipoDocumento="CC",
    usuarios__numeroDocumento="12345678"
)

# Filtrar por arrays
transacciones = RIPSTransaccion.objects.filter(
    tiposServicio__contains="consultas"
)
```

### **3. Actualizar Subdocumentos:**
```python
transaccion = RIPSTransaccion.objects.get(numFactura="FE001")
transaccion.usuarios[0].numeroDocumento = "87654321"
transaccion.save()
```

---

## 📊 ÍNDICES MONGODB CORRECTOS

### **A. Índices Básicos:**
```python
class Meta:
    indexes = [
        # Índice simple
        models.Index(fields=["numFactura"], name="factura_idx"),
        
        # Índice compuesto
        models.Index(fields=["prestadorNit", "fechaRadicacion"], name="prestador_fecha_idx"),
        
        # Índice en subdocumento
        models.Index(fields=["usuarios__numeroDocumento"], name="usuario_doc_idx"),
        
        # Índice en array
        models.Index(fields=["tiposServicio"], name="tipos_servicio_idx"),
    ]
```

### **B. Índices Únicos:**
```python
class Meta:
    constraints = [
        models.UniqueConstraint(
            fields=["numFactura", "prestadorNit"],
            name="unique_factura_prestador"
        ),
    ]
```

### **C. Índices Parciales:**
```python
from django.db.models import Q

class Meta:
    indexes = [
        models.Index(
            fields=["estadoProcesamiento"],
            condition=Q(estadoProcesamiento="VALIDADO"),
            name="estado_validado_idx"
        ),
    ]
```

---

## ⚠️ ERRORES COMUNES A EVITAR

### ❌ **NUNCA HACER:**
```python
# ❌ INCORRECTO - ObjectIdField para primary key
id = ObjectIdField(primary_key=True)

# ❌ INCORRECTO - ObjectIdAutoField para referencias
referencia_id = ObjectIdAutoField()

# ❌ INCORRECTO - Importar de djongo
from djongo import models

# ❌ INCORRECTO - ENGINE incorrecto
"ENGINE": "djongo"

# ❌ INCORRECTO - EmbeddedModel con ObjectIdAutoField
class MiEmbedded(EmbeddedModel):
    id = ObjectIdAutoField(primary_key=True)  # ❌ Los subdocumentos NO tienen PK
```

### ✅ **SIEMPRE HACER:**
```python
# ✅ CORRECTO - ObjectIdAutoField para primary key
id = ObjectIdAutoField(primary_key=True)

# ✅ CORRECTO - ObjectIdField para referencias
referencia_id = ObjectIdField(db_index=True)

# ✅ CORRECTO - Import oficial
from django_mongodb_backend.fields import ObjectIdAutoField, ObjectIdField

# ✅ CORRECTO - ENGINE oficial
"ENGINE": "django_mongodb_backend"

# ✅ CORRECTO - EmbeddedModel sin PK
class MiEmbedded(EmbeddedModel):
    campo1 = models.CharField(max_length=100)
```

---

## 🔄 MIGRACIONES CORRECTAS

### **1. Crear Migraciones:**
```bash
python manage.py makemigrations <app_name>
python manage.py migrate
```

### **2. Migración Manual si es Necesario:**
```python
# En migration file
from django.db import migrations
from django_mongodb_backend.fields import ObjectIdAutoField

class Migration(migrations.Migration):
    operations = [
        migrations.CreateModel(
            name='MiModelo',
            fields=[
                ('id', ObjectIdAutoField(primary_key=True)),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'mi_coleccion',
            },
        ),
    ]
```

---

## 📚 EJEMPLOS COMPLETOS NEURAUDIT

### **Catálogos Oficiales:**
```python
class CatalogoCUPSOficial(models.Model):
    id = ObjectIdAutoField(primary_key=True)  # ✅ PRIMARY KEY
    codigo = models.CharField(max_length=10, unique=True, db_index=True)
    nombre = models.TextField()
    habilitado = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'catalogos_cups'
        indexes = [
            models.Index(fields=['codigo'], name='cups_codigo_idx'),
            models.Index(fields=['habilitado'], name='cups_habilitado_idx'),
        ]
```

### **RIPS con Subdocumentos:**
```python
class RIPSUsuarioServicio(EmbeddedModel):  # ✅ Subdocumento
    codPrestador = models.CharField(max_length=20)
    fechaAtencion = models.DateTimeField()
    codigoServicio = models.CharField(max_length=10)
    valorServicio = models.DecimalField(max_digits=15, decimal_places=2)

class RIPSUsuario(EmbeddedModel):  # ✅ Subdocumento
    tipoDocumento = models.CharField(max_length=5, db_index=True)
    numeroDocumento = models.CharField(max_length=20, db_index=True)
    consultas = EmbeddedModelArrayField(RIPSUsuarioServicio, null=True, blank=True)
    procedimientos = EmbeddedModelArrayField(RIPSUsuarioServicio, null=True, blank=True)

class RIPSTransaccion(models.Model):  # ✅ Documento principal
    id = ObjectIdAutoField(primary_key=True)  # ✅ PRIMARY KEY
    numFactura = models.CharField(max_length=50, unique=True, db_index=True)
    prestadorNit = models.CharField(max_length=20, db_index=True)
    usuarios = EmbeddedModelArrayField(RIPSUsuario, null=True, blank=True)
    
    class Meta:
        db_table = 'rips_transacciones'
```

---

## 🎯 RESUMEN CRÍTICO

| Caso de Uso | Campo Correcto | Ejemplo |
|-------------|----------------|---------|
| **Primary Key de documento** | `ObjectIdAutoField(primary_key=True)` | `id = ObjectIdAutoField(primary_key=True)` |
| **Referencia a otro documento** | `ObjectIdField(db_index=True)` | `transaccion_id = ObjectIdField(db_index=True)` |
| **Array de ObjectIds** | `ArrayField(ObjectIdField())` | `referencias = ArrayField(ObjectIdField())` |
| **Subdocumento único** | `EmbeddedModelField(MiEmbedded)` | `datos = EmbeddedModelField(DatosEmbebidos)` |
| **Array de subdocumentos** | `EmbeddedModelArrayField(MiEmbedded)` | `usuarios = EmbeddedModelArrayField(Usuario)` |
| **Array simple** | `ArrayField(models.CharField())` | `tags = ArrayField(models.CharField(max_length=50))` |

---

**🚨 ESTA DOCUMENTACIÓN ES LA ÚNICA FUENTE DE VERDAD PARA DJANGO MONGODB BACKEND EN NEURAUDIT**

**📋 Versión:** 1.0  
**📅 Fecha:** 30 Julio 2025  
**🔄 Última actualización:** 30 Julio 2025  