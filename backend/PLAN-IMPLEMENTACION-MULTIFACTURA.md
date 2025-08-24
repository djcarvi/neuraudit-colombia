# 📋 PLAN DE IMPLEMENTACIÓN - RADICACIÓN MULTIFACTURA

## 🎯 OBJETIVO
Implementar radicación multifactura manteniendo 100% de compatibilidad con el sistema actual.

---

## 📅 FASE 1: MODELOS Y MIGRACIÓN

### 1.1 Crear modelo `RadicacionMaestra`
```python
# apps/radicacion/models_multifactura.py
class RadicacionMaestra(models.Model):
    # Implementar según propuesta V2
```

### 1.2 Modificar `RadicacionCuentaMedica`
- Quitar constraint `unique=True` de numero_radicado
- Agregar ForeignKey a RadicacionMaestra
- Agregar numero_factura_secuencial

### 1.3 Migración de datos existentes
```python
# apps/radicacion/management/commands/migrar_radicaciones_maestras.py
class Command(BaseCommand):
    def handle(self, *args, **options):
        # Crear RadicacionMaestra para cada radicación existente
        for rad in RadicacionCuentaMedica.objects.filter(
            radicacion_maestra__isnull=True
        ):
            RadicacionMaestra.objects.create(
                numero_radicado=rad.numero_radicado,
                tipo_radicacion='INDIVIDUAL',
                total_facturas=1,
                # ... mapear campos
            )
```

---

## 📅 FASE 2: API Y SERVICIOS

### 2.1 Servicio de procesamiento multifactura
```python
# apps/radicacion/services/multifactura_service.py
class MultifacturaService:
    def procesar_archivo_multifactura(self, archivo_zip):
        """Procesa ZIP con múltiples facturas"""
        
    def validar_estructura_zip(self, archivo_zip):
        """Valida que tenga XMLs, RIPS, soportes"""
        
    def crear_radicacion_maestra(self, datos_agregados):
        """Crea la radicación maestra"""
```

### 2.2 API endpoints
```python
# apps/radicacion/views_multifactura.py

# Upload de archivo multifactura
POST /api/radicacion/multifactura/upload/

# Consulta estado procesamiento
GET /api/radicacion/{numero_radicado}/status/

# Listado de facturas dentro de radicación
GET /api/radicacion/{numero_radicado}/facturas/
```

### 2.3 Validaciones específicas
- Límite máximo de facturas por radicación (configurable)
- Validar que todas las facturas sean del mismo prestador
- Validar modalidad de pago consistente

---

## 📅 FASE 3: PROCESAMIENTO ASÍNCRONO

### 3.1 Celery tasks
```python
# apps/radicacion/tasks.py
@shared_task
def procesar_radicacion_multifactura(radicacion_maestra_id):
    """Procesa todas las facturas de una radicación"""
    
@shared_task
def procesar_factura_individual_async(factura_data, radicacion_maestra_id):
    """Procesa una factura dentro del lote"""
```

### 3.2 Sistema de progreso
- WebSocket para actualización en tiempo real
- Almacenar progreso en Redis
- Manejo de errores parciales

---

## 📅 FASE 4: FRONTEND

### 4.1 Componente de carga multifactura
```typescript
// components/radicacion/MultifacturaUpload.tsx
- Drag & drop para ZIP
- Validación tamaño máximo
- Preview de contenido
```

### 4.2 Vista de progreso
```typescript
// components/radicacion/MultifacturaProgress.tsx
- Barra de progreso
- Lista de facturas procesadas/errores
- Opción de cancelar
```

### 4.3 Modificar lista de radicaciones
- Mostrar badge con número de facturas
- Filtro por tipo (individual/multifactura)
- Link a detalle de facturas

---

## 📅 FASE 5: AUDITORÍA MULTIFACTURA

### 5.1 Adaptar engines de auditoría
```python
# Modificar EnginePreAuditoria para procesar lotes
def procesar_radicacion_maestra(self, radicacion_maestra_id):
    """Procesa todas las facturas de una radicación"""
```

### 5.2 Asignación masiva
- Distribuir facturas entre auditores
- Opción de asignar por bloques
- Balanceo de carga mejorado

---

## 🧪 FASE 6: TESTING

### 6.1 Tests unitarios
- Modelos multifactura
- Servicio de procesamiento
- Validaciones

### 6.2 Tests de integración
- Upload de ZIP con 100 facturas
- Procesamiento completo
- Auditoría de multifactura

### 6.3 Tests de carga
- 1,000 facturas simultáneas
- Medición de tiempos
- Uso de memoria

---

## 🚀 FASE 7: DESPLIEGUE

### 7.1 Preparación
- [ ] Backup completo de BD
- [ ] Scripts de rollback
- [ ] Documentación actualizada

### 7.2 Despliegue
1. Aplicar migraciones de BD
2. Ejecutar comando de migración de datos
3. Desplegar backend con nuevos endpoints
4. Desplegar frontend con nuevos componentes
5. Configurar Celery workers

### 7.3 Validación post-despliegue
- [ ] Radicaciones individuales funcionan
- [ ] Upload multifactura funciona
- [ ] Auditoría no afectada

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica | Meta |
|---------|------|
| Radicaciones individuales sin afectar | 100% |
| Facturas procesadas por minuto | >100 |
| Tiempo procesamiento 1000 facturas | <30 min |
| Errores en producción | 0 |

---

## 🚨 RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Migración falla | Baja | Alto | Script rollback automático |
| Performance degradado | Media | Medio | Procesamiento por chunks |
| Memoria insuficiente | Media | Alto | Límites configurables |
| Timeout en upload | Alta | Bajo | Upload resumible |

---

## 📝 CHECKLIST PRE-PRODUCCIÓN

- [ ] Todos los tests pasando
- [ ] Documentación técnica completa
- [ ] Manual de usuario actualizado
- [ ] Plan de rollback probado
- [ ] Monitoreo configurado
- [ ] Capacitación usuarios completada

---

## 🎯 ENTREGABLES

1. **Código fuente** con tests
2. **Documentación técnica** actualizada
3. **Manual de usuario** para multifactura
4. **Scripts de migración** y rollback
5. **Métricas de rendimiento** documentadas

---

## 🚀 ORDEN DE IMPLEMENTACIÓN SUGERIDO

1. **Primero:** Modelos y migración (base sólida)
2. **Segundo:** API básica (probar concepto)
3. **Tercero:** Procesamiento (core funcionalidad)
4. **Cuarto:** Frontend (interfaz usuario)
5. **Quinto:** Optimizaciones y auditoría
6. **Último:** Testing exhaustivo y despliegue

---

*📌 Nota: Este plan permite implementación incremental sin afectar operación actual*