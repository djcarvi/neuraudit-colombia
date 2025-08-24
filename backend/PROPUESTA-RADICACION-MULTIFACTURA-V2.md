# 🚀 PROPUESTA V2: RADICACIÓN MULTIFACTURA CON NÚMERO ÚNICO

## 🎯 CONCEPTO CLAVE: UN NÚMERO DE RADICADO, MÚLTIPLES FACTURAS

### **Lógica de Negocio:**
```
ANTES: RAD-123456789-20250823-01 = 1 factura
AHORA: RAD-123456789-20250823-01 = 1 factura O 1000 facturas
```

---

## 🏗️ ARQUITECTURA PROPUESTA

### 1. **Modelo Mejorado: `RadicacionMaestra`**
```python
class RadicacionMaestra(models.Model):
    """
    Representa UNA radicación que puede contener 1 o N facturas
    """
    id = ObjectIdAutoField(primary_key=True)
    
    # NÚMERO ÚNICO DE RADICADO (igual que antes)
    numero_radicado = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name="Número de Radicado",
        help_text="RAD-NIT-FECHA-CONSECUTIVO"
    )
    
    # Información del prestador
    pss_nit = models.CharField(max_length=20)
    pss_nombre = models.CharField(max_length=200)
    usuario_radicador = models.ForeignKey('authentication.User')
    
    # NUEVO: Tipo de radicación
    tipo_radicacion = models.CharField(
        max_length=20,
        choices=[
            ('INDIVIDUAL', 'Factura Individual'),
            ('MULTIFACTURA', 'Múltiples Facturas')
        ],
        default='INDIVIDUAL'
    )
    
    # Información agregada
    total_facturas = models.IntegerField(default=1)
    valor_total_radicado = models.DecimalField(max_digits=18, decimal_places=2)
    
    # Modalidad y tipo (cuando todas las facturas son del mismo tipo)
    modalidad_pago = models.CharField(max_length=20, choices=MODALIDAD_PAGO_CHOICES)
    tipo_servicio = models.CharField(max_length=20, choices=TIPO_SERVICIO_CHOICES, null=True)
    
    # Control y estado
    fecha_radicacion = models.DateTimeField(auto_now_add=True)
    estado_radicacion = models.CharField(
        max_length=20,
        choices=[
            ('EN_PROCESO', 'En Proceso de Carga'),
            ('RADICADO', 'Radicado Completo'),
            ('PARCIAL', 'Parcialmente Procesado'),
            ('ERROR', 'Error en Procesamiento')
        ],
        default='RADICADO'
    )
    
    # Para multifactura
    facturas_procesadas = models.IntegerField(default=0)
    facturas_con_error = models.IntegerField(default=0)
    
    # Metadatos
    archivo_multifactura = models.CharField(max_length=255, null=True)
    resumen_procesamiento = models.JSONField(default=dict)
```

### 2. **Ajuste a `RadicacionCuentaMedica`:**
```python
class RadicacionCuentaMedica(models.Model):
    # ... campos existentes ...
    
    # CAMBIO: numero_radicado ya no es unique
    numero_radicado = models.CharField(
        max_length=50, 
        db_index=True,  # Solo índice, no unique
        verbose_name="Número Radicado"
    )
    
    # NUEVO: Relación con la radicación maestra
    radicacion_maestra = models.ForeignKey(
        'RadicacionMaestra',
        on_delete=models.CASCADE,
        related_name='facturas_detalle',
        null=True,  # Para compatibilidad con datos existentes
        blank=True
    )
    
    # NUEVO: Para diferenciar facturas dentro del mismo radicado
    numero_factura_secuencial = models.IntegerField(
        default=1,
        help_text="Secuencial dentro del radicado (1 de 1000)"
    )
    
    class Meta:
        # Unique together para evitar duplicados
        unique_together = [
            ['numero_radicado', 'factura_numero']
        ]
```

---

## 🔄 FLUJOS DE TRABAJO

### **A. Radicación Individual (Sin Cambios):**
```python
# 1. Se crea RadicacionMaestra
radicacion_maestra = RadicacionMaestra.objects.create(
    numero_radicado="RAD-123456789-20250823-01",
    tipo_radicacion="INDIVIDUAL",
    total_facturas=1,
    valor_total_radicado=500000
)

# 2. Se crea RadicacionCuentaMedica (como siempre)
radicacion = RadicacionCuentaMedica.objects.create(
    numero_radicado="RAD-123456789-20250823-01",
    radicacion_maestra=radicacion_maestra,
    factura_numero="FE12345",
    # ... resto de campos
)
```

### **B. Radicación Multifactura (Nuevo):**
```python
# 1. Se crea RadicacionMaestra para el lote
radicacion_maestra = RadicacionMaestra.objects.create(
    numero_radicado="RAD-123456789-20250823-02",
    tipo_radicacion="MULTIFACTURA",
    total_facturas=1000,
    valor_total_radicado=500000000,  # 500 millones
    estado_radicacion="EN_PROCESO"
)

# 2. Se procesan las 1000 facturas
for i, factura_data in enumerate(facturas, 1):
    RadicacionCuentaMedica.objects.create(
        numero_radicado="RAD-123456789-20250823-02",  # MISMO NÚMERO
        radicacion_maestra=radicacion_maestra,
        numero_factura_secuencial=i,  # 1, 2, 3... 1000
        factura_numero=factura_data['numero'],
        # ... resto de campos
    )
```

---

## 📊 CONSULTAS OPTIMIZADAS

### **Ver resumen de una radicación:**
```python
# Por número de radicado (funciona igual)
radicacion = RadicacionMaestra.objects.get(
    numero_radicado="RAD-123456789-20250823-02"
)

if radicacion.tipo_radicacion == 'INDIVIDUAL':
    # Una sola factura
    factura = radicacion.facturas_detalle.first()
else:
    # Múltiples facturas
    print(f"Radicación con {radicacion.total_facturas} facturas")
    print(f"Valor total: ${radicacion.valor_total_radicado:,.2f}")
```

### **Dashboard de auditoría:**
```python
# Radicaciones pendientes (no cambia la lógica)
pendientes = RadicacionMaestra.objects.filter(
    estado_radicacion='RADICADO',
    facturas_detalle__estado_auditoria='PENDIENTE'
).distinct()
```

---

## 🎯 VENTAJAS DE ESTE ENFOQUE

### ✅ **Mantiene la Lógica de Negocio:**
- Un número de radicado = Una transacción (sea 1 o 1000 facturas)
- Los auditores ven el mismo número de radicado
- La trazabilidad se mantiene clara

### ✅ **Compatibilidad Total:**
```python
# Migración automática para datos existentes
def migrar_radicaciones_existentes():
    for rad in RadicacionCuentaMedica.objects.filter(radicacion_maestra__isnull=True):
        # Crear RadicacionMaestra retrospectivamente
        maestra = RadicacionMaestra.objects.create(
            numero_radicado=rad.numero_radicado,
            tipo_radicacion='INDIVIDUAL',
            total_facturas=1,
            valor_total_radicado=rad.factura_valor_total,
            pss_nit=rad.pss_nit,
            # ... mapear otros campos
        )
        rad.radicacion_maestra = maestra
        rad.save()
```

### ✅ **UI/UX Consistente:**
- Lista de radicaciones muestra lo mismo
- Click en radicado individual → 1 factura
- Click en radicado multifactura → Lista de 1000 facturas

---

## 💡 CASOS DE USO ESPECÍFICOS

### **1. PSS radica 1000 facturas de evento:**
```
- Genera RAD-901019681-20250823-05
- Sube ZIP con 1000 XMLs + RIPS + Soportes
- Sistema procesa y agrupa bajo el mismo número
- Auditor ve: "RAD-901019681-20250823-05 (1000 facturas)"
```

### **2. Consulta estado de radicación:**
```python
GET /api/radicacion/RAD-901019681-20250823-05/

{
    "numero_radicado": "RAD-901019681-20250823-05",
    "tipo": "MULTIFACTURA",
    "total_facturas": 1000,
    "facturas_procesadas": 1000,
    "valor_total": 500000000,
    "estado": "RADICADO",
    "detalle_facturas": {
        "url": "/api/radicacion/RAD-901019681-20250823-05/facturas/",
        "count": 1000
    }
}
```

### **3. Auditoría de multifactura:**
- Auditor puede revisar el lote completo
- O asignar subgrupos a diferentes auditores
- Cada factura mantiene su trazabilidad individual

---

## 🚀 IMPLEMENTACIÓN INCREMENTAL

### **Fase 1: Base de Datos**
1. Crear modelo `RadicacionMaestra`
2. Migrar datos existentes
3. Ajustar `RadicacionCuentaMedica`

### **Fase 2: API**
```python
# Endpoint unificado
POST /api/radicacion/
{
    "tipo_radicacion": "MULTIFACTURA",
    "facturas": [...]  # Array de facturas
}

# Respuesta
{
    "numero_radicado": "RAD-901019681-20250823-06",
    "total_facturas": 1000,
    "processing_url": "/api/radicacion/RAD-901019681-20250823-06/status/"
}
```

### **Fase 3: Procesamiento**
- Celery para procesamiento asíncrono
- WebSockets para progreso en tiempo real
- Validación incremental

---

**🏥 Esta arquitectura respeta el concepto de UN NÚMERO DE RADICADO mientras permite escalar a miles de facturas**