# 🚨 RECORDATORIOS CRÍTICOS PARA ESTA SESIÓN - NEURAUDIT
**Fecha:** 31 de Julio de 2025
**IMPORTANTE:** Estos son los principios fundamentales que SIEMPRE debo seguir en este proyecto

## 🔴 ARQUITECTURA NO RELACIONAL - NOSQL PURO

### ❌ NUNCA HACER:
```python
# INCORRECTO - Relacional con ForeignKey
class Modelo(models.Model):
    radicacion = models.ForeignKey('radicacion.RadicacionCuentaMedica', ...)  # ❌ NO!
    factura = models.ForeignKey(FacturaRadicada, ...)  # ❌ NO!
```

### ✅ SIEMPRE HACER:
```python
# CORRECTO - NoSQL con documentos embebidos
from djongo.models import ObjectIdAutoField  # SIEMPRE de djongo.models

class Modelo(models.Model):
    id = ObjectIdAutoField(primary_key=True)  # SIEMPRE usar ObjectIdAutoField
    
    # Referencias como strings
    radicacion_id = models.CharField(max_length=24)
    factura_id = models.CharField(max_length=24)
    
    # Datos embebidos en JSON
    radicacion_info = models.JSONField(default=dict)  # Datos embebidos
    factura_info = models.JSONField(default=dict)    # No relaciones
```

## 🎯 IMPORTS CORRECTOS PARA MONGODB

### ❌ INCORRECTO:
```python
from django_mongodb_backend.fields import ObjectIdAutoField  # ❌ NO!
```

### ✅ CORRECTO:
```python
from djongo.models import ObjectIdAutoField  # ✅ SIEMPRE ASÍ
```

## 🎨 FRONTEND - PLANTILLAS VYZOR

### REGLA DE ORO:
**SIEMPRE usar las plantillas de Vyzor que ya están en el proyecto**

### Plantillas disponibles:
- `widgets.html` → Para dashboards con cards
- `invoice-details.html` → Para detalles de facturas
- `form-elements.html` → Para formularios
- `simple-table.html` → Para tablas básicas

### Proceso:
1. Buscar plantilla similar en `/frontend-vue3/src/views/Pages/`
2. Copiar estructura HTML/CSS
3. Adaptar a Vue 3 (v-for, v-if, @click, etc.)
4. NUNCA crear estilos globales nuevos

## ⚠️ VERIFICACIÓN ANTES DE CAMBIOS

### SIEMPRE antes de modificar:
1. **Leer archivo completo** con Read tool
2. **Verificar funcionamiento actual** - si funciona, no tocar sin permiso
3. **Preguntar antes de cambios estructurales**

### NUNCA:
- Cambiar App.vue sin autorización explícita
- Modificar CSS global
- "Mejorar" código que ya funciona
- Aplicar cambios globales sin consultar

## 📋 FLUJO DE TRABAJO SEGURO

1. **Antes de editar:**
   ```bash
   # Leer archivo completo
   Read archivo.vue
   # Verificar si hay lógica existente funcionando
   ```

2. **Al crear modelos:**
   ```python
   # SIEMPRE estructura NoSQL
   class MiModelo(models.Model):
       id = ObjectIdAutoField(primary_key=True)
       datos_embebidos = models.JSONField(default=dict)
       referencia_id = models.CharField(max_length=24)  # No ForeignKey
   ```

3. **Al crear vistas:**
   - Buscar plantilla Vyzor similar
   - Copiar estructura
   - Adaptar a Vue 3
   - NO inventar diseños nuevos

## 🔥 LECCIONES APRENDIDAS

### La Gran Catástrofe del CSS:
- Un agente modificó App.vue sin permiso → aplicación rota
- Cambió CSS global → todo el diseño destruido
- Lección: **NUNCA tocar archivos críticos sin autorización**

### Error de Serialización MongoDB:
- Django REST no serializa ObjectId automáticamente
- Solución: Declarar `id = serializers.CharField(read_only=True)` en TODOS los serializers

### Error de Imports:
- `django_mongodb_backend` es incompatible con djongo
- SIEMPRE usar imports de `djongo.models`

## 📝 CHECKLIST ANTES DE CADA CAMBIO

- [ ] ¿Leí el archivo completo antes de editar?
- [ ] ¿Verifiqué que no estoy rompiendo funcionalidad existente?
- [ ] ¿Estoy usando ObjectIdAutoField de djongo.models?
- [ ] ¿Mi modelo es NoSQL puro sin ForeignKey?
- [ ] ¿Estoy usando una plantilla Vyzor existente?
- [ ] ¿Pedí permiso si es un cambio estructural?

## 🚨 RECORDATORIO FINAL

**"En enfoque nosql no es solo mongodb es no tener un sistema relacional"**

Esto significa:
- NO ForeignKey
- NO relaciones entre tablas
- SÍ documentos embebidos
- SÍ JSONField para datos relacionados
- SÍ referencias como strings (IDs)

---

**IMPORTANTE:** Este documento debe ser consultado ANTES de hacer cualquier cambio en el proyecto.