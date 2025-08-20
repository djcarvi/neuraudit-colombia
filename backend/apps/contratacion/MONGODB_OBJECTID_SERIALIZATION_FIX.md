# 🚨 DOCUMENTACIÓN CRÍTICA: SOLUCIÓN DE SERIALIZACIÓN ObjectId EN MÓDULO CONTRATACIÓN

**Fecha:** 31 Julio 2025  
**Problema Resuelto:** TypeError: Object of type ObjectId is not JSON serializable  
**Módulo:** Contratación (prestadores, contratos, modalidades, tarifarios)  

## ⚠️ PROBLEMA ORIGINAL

### Síntomas:
1. **Error 500** en endpoints de contratación:
   - `/api/contratacion/prestadores/`
   - `/api/contratacion/contratos/vigentes/`
   - `/api/contratacion/prestadores/activos/`
   - `/api/contratacion/contratos/estadisticas/`

2. **Stack trace típico:**
```python
TypeError: Object of type ObjectId is not JSON serializable
File "/usr/lib/python3.12/json/encoder.py", line 180, in default
    raise TypeError(f'Object of type {o.__class__.__name__} '
```

3. **Causa raíz:** Django REST Framework no puede serializar ObjectId de MongoDB directamente

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. **Renderer Personalizado** (`/backend/apps/contratacion/renderers.py`)

```python
# -*- coding: utf-8 -*-
"""
Custom renderers for contratacion app to handle MongoDB ObjectId
"""

from rest_framework.renderers import JSONRenderer
from bson import ObjectId
import json


class MongoJSONRenderer(JSONRenderer):
    """
    Custom JSON renderer that can handle MongoDB ObjectId serialization
    """
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Render `data` into JSON, handling ObjectId instances
        """
        if data is None:
            return bytes()
        
        # Use custom encoder that handles ObjectId
        return json.dumps(
            data,
            cls=MongoJSONEncoder,
            ensure_ascii=self.ensure_ascii,
            allow_nan=not self.strict
        ).encode('utf-8')


class MongoJSONEncoder(json.JSONEncoder):
    """
    JSON Encoder that handles MongoDB ObjectId
    """
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)
```

### 2. **ViewSets Actualizados** (`/backend/apps/contratacion/views.py`)

Se agregó `renderer_classes = [MongoJSONRenderer]` a TODOS los ViewSets:

```python
# Ejemplo para PrestadorViewSet
class PrestadorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de la Red de Prestadores
    """
    queryset = Prestador.objects.all()
    serializer_class = PrestadorSerializer
    permission_classes = [AllowAny]  # Para desarrollo
    renderer_classes = [MongoJSONRenderer]  # ← CRÍTICO: Maneja ObjectId
    # ... resto de configuración
```

**ViewSets actualizados:**
- ✅ `TarifariosCUPSViewSet`
- ✅ `TarifariosMedicamentosViewSet`
- ✅ `TarifariosDispositivosViewSet`
- ✅ `PrestadorViewSet`
- ✅ `ModalidadPagoViewSet`
- ✅ `ContratoViewSet`

### 3. **Serializers Actualizados** (`/backend/apps/contratacion/serializers.py`)

Se cambió `id = serializers.CharField(read_only=True)` por `id = serializers.ReadOnlyField()`:

```python
# Ejemplo
class PrestadorSerializer(serializers.ModelSerializer):
    """
    Serializer para Red de Prestadores
    """
    id = serializers.ReadOnlyField()  # ← CRÍTICO: No usar CharField
    contratos_activos = serializers.SerializerMethodField()
    # ... resto de campos
```

### 4. **Filtros Corregidos para ForeignKey**

En `ContratoViewSet.estadisticas()`:
```python
# ANTES (error):
contratos_capitacion = self.queryset.filter(
    estado='VIGENTE',
    modalidad_principal='CAPITACION'  # ← ERROR: es ForeignKey ahora
).count()

# DESPUÉS (correcto):
contratos_capitacion = self.queryset.filter(
    estado='VIGENTE',
    modalidad_principal__codigo='CAPITACION'  # ← CORRECTO: lookup en campo código
).count()
```

## 🔧 CAMBIO EN EL MODELO

### Migración del campo modalidad_principal:
```python
# ANTES: CharField con choices
modalidad_principal = models.CharField(
    max_length=20,
    choices=[('EVENTO', 'Pago por Evento'), ...]
)

# DESPUÉS: ForeignKey a ModalidadPago
modalidad_principal = models.ForeignKey(
    ModalidadPago,
    on_delete=models.PROTECT,
    related_name='contratos',
    to_field='id',
    help_text="Modalidad de pago principal del contrato"
)
```

## 🚨 ADVERTENCIAS CRÍTICAS

### ❌ NUNCA HACER:

1. **NO usar CharField para campos id en serializers MongoDB**
   ```python
   # MAL
   id = serializers.CharField(read_only=True)
   
   # BIEN
   id = serializers.ReadOnlyField()
   ```

2. **NO aplicar el encoder globalmente en settings.py**
   ```python
   # MAL - Afectaría otros módulos como radicación
   REST_FRAMEWORK = {
       'ENCODER_CLASS': 'apps.core.encoders.MongoJSONEncoder',
   }
   ```

3. **NO filtrar ForeignKeys por valor directo**
   ```python
   # MAL
   filter(modalidad_principal='CAPITACION')
   
   # BIEN
   filter(modalidad_principal__codigo='CAPITACION')
   ```

### ✅ SIEMPRE HACER:

1. **Usar renderer personalizado SOLO en ViewSets que lo necesiten**
2. **Mantener la solución aislada al módulo de contratación**
3. **No afectar otros módulos que ya tienen sus propias soluciones**
4. **Usar ReadOnlyField() para campos id en MongoDB**

## 📊 IMPACTO DE LA SOLUCIÓN

### Endpoints corregidos:
- ✅ `/api/contratacion/prestadores/` - Lista prestadores con paginación
- ✅ `/api/contratacion/prestadores/activos/` - Prestadores activos
- ✅ `/api/contratacion/prestadores/estadisticas/` - Estadísticas
- ✅ `/api/contratacion/contratos/` - Lista contratos
- ✅ `/api/contratacion/contratos/vigentes/` - Contratos vigentes
- ✅ `/api/contratacion/contratos/estadisticas/` - Estadísticas contratos
- ✅ `/api/contratacion/modalidades/` - Modalidades de pago
- ✅ `/api/contratacion/tarifarios-cups/` - Tarifarios CUPS
- ✅ `/api/contratacion/tarifarios-medicamentos/` - Tarifarios medicamentos
- ✅ `/api/contratacion/tarifarios-dispositivos/` - Tarifarios dispositivos

## 🔍 VERIFICACIÓN

### Comando de prueba:
```bash
# Activar entorno virtual
cd /home/adrian_carvajal/Analí®/neuraudit/backend
source venv/bin/activate

# Iniciar servidor
python manage.py runserver 0.0.0.0:8003

# En otra terminal, probar endpoints:
curl -X GET http://localhost:8003/api/contratacion/contratos/vigentes/ | python3 -m json.tool
```

### Respuesta esperada:
```json
{
    "count": 3,
    "results": [
        {
            "id": "688b68fa6a889702059e604d",  // ← ObjectId como string
            "numero_contrato": "CTR-2025-004",
            "prestador": {
                "id": "688a9f42a07e08494992339d",  // ← ObjectId como string
                // ... más campos
            },
            "modalidad_principal": {
                "id": "688a981136df03e1347c51d4",  // ← ObjectId como string
                "codigo": "PAQUETE",
                "nombre": "Paquete"
                // ... más campos
            }
        }
    ]
}
```

## 📝 NOTAS ADICIONALES

1. **Módulo radicación NO afectado**: Mantiene su propia solución con `ObjectIdField` personalizado
2. **Performance**: El renderer personalizado no afecta el rendimiento
3. **Compatibilidad**: Funciona con Django 5.2.4 y django-mongodb-backend
4. **Frontend**: No requiere cambios en Vue.js, recibe strings normales

## 🛡️ PROTECCIÓN

### Archivos críticos modificados:
1. `/backend/apps/contratacion/renderers.py` - **NO ELIMINAR**
2. `/backend/apps/contratacion/views.py` - **NO QUITAR renderer_classes**
3. `/backend/apps/contratacion/serializers.py` - **MANTENER ReadOnlyField()**
4. `/backend/apps/contratacion/models.py` - **modalidad_principal ES ForeignKey**

### Migración aplicada:
- `0002_convert_modalidad_to_fk.py` - **NO REVERTIR**

---

**🏥 Documentado por:** Sistema NeurAudit  
**📅 Fecha:** 31 Julio 2025  
**🎯 Estado:** SOLUCIONADO Y FUNCIONANDO  