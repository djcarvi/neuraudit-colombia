# 📚 GUÍA DEFINITIVA PARA MODIFICAR LA PLANTILLA VYZOR REACT SIN ROMPERLA

## 🚨 REGLAS DE ORO - NUNCA VIOLAR

### 1. **JAMÁS MODIFICAR ARCHIVOS CORE**
```
❌ PROHIBIDO TOCAR:
- /src/main.tsx
- /src/App.tsx (solo con autorización extrema)
- /src/contextapi.tsx
- /src/pages/App.tsx
- /src/pages/Rootwrapper.tsx
- /vite.config.ts (solo para proxies API)
```

### 2. **SIEMPRE COPIAR FÍSICAMENTE CON CP, NUNCA CREAR DESDE CERO**
```
✅ PROCESO CORRECTO:
1. Buscar componente similar en la plantilla
2. COPIAR ARCHIVO COMPLETO CON COMANDO cp (NO leer y reescribir)
3. Renombrar archivo si es necesario
4. Modificar SOLO textos y datos
5. Mantener TODA la estructura

🚨 CRÍTICO: SIEMPRE usar comandos cp para copiar archivos
❌ NUNCA leer archivo con Read tool y luego reescribirlo con Write
❌ NUNCA crear archivo vacío y pegar contenido
✅ SIEMPRE: cp archivo_origen.tsx archivo_destino.tsx
```

## 🔧 PROCESO DETALLADO DE MODIFICACIÓN

### PASO 1: INVESTIGACIÓN PREVIA
```typescript
// 1. Identificar qué necesitas modificar
// 2. Buscar componente similar existente
// Ejemplo: Para crear nuevo dashboard, buscar:
/src/components/dashboards/sale/sale.tsx

// 3. Analizar estructura del componente
// - Imports
// - Props/Interfaces
// - Hooks utilizados
// - Estructura JSX
// - Estilos aplicados
```

### PASO 2: COPIA FÍSICA DE ARCHIVOS
```bash
# 🚨 IMPORTANTE: SIEMPRE usar comandos cp para copiar archivos físicamente
# NUNCA leer y reescribir el contenido manualmente
# NUNCA crear archivo vacío y pegar contenido

# ✅ FORMA CORRECTA - Copiar archivos con cp:
# 1. Crear directorios si no existen
mkdir -p src/components/dashboards/pharmaceutical
mkdir -p src/shared/data/dashboards

# 2. Copiar archivos físicamente con cp
cp src/components/dashboards/sale/sale.tsx src/components/dashboards/pharmaceutical/pharmaceutical.tsx
cp src/shared/data/dashboards/salesdata.tsx src/shared/data/dashboards/pharmaceuticaldata.tsx

# ❌ FORMA INCORRECTA - NO hacer esto:
# - NO leer archivo con Read y luego Write
# - NO crear archivo vacío y pegar contenido
# - NO copiar/pegar manualmente

# 📝 NOTA: Si necesitas copiar desde la plantilla original:
# Ejemplo para módulo de medicamentos:
mkdir -p src/components/medicines
mkdir -p src/shared/data/medicines
cp /ruta/plantilla/Vyzor-React-ts/src/components/dashboards/ecommerce/products/products.tsx src/components/medicines/medicines.tsx
cp /ruta/plantilla/Vyzor-React-ts/src/shared/data/dashboards/ecommerce/productsdata.tsx src/shared/data/medicines/medicinesdata.tsx
```

### PASO 3: MODIFICACIÓN SEGURA
```typescript
// ❌ MAL - No cambiar estructura
const Pharmaceutical = () => {
  // Nueva lógica inventada
  const [state, setState] = useState()
  // Estructura diferente
}

// ✅ BIEN - Mantener estructura exacta
const Pharmaceutical: React.FC<PharmaceuticalProps> = () => {
  // MISMOS hooks en MISMO orden
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([today, nextWeek]);
  // Solo cambiar datos, no estructura
}
```

### PASO 4: INTEGRACIÓN CON API
```typescript
// ✅ PATRÓN CORRECTO para datos dinámicos
const [dashboardData, setDashboardData] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      const token = localStorage.getItem('medispensa_token');
      const response = await fetch('/api/dashboard/stats/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);
```

## 📊 ACTUALIZACIÓN DE COMPONENTES DE DATOS

### PROBLEMA COMÚN: Datos Hardcodeados
```typescript
// ❌ PROBLEMA: SpkListCard con CountUp
export const SalesCard = [{
  count: '85658', // Valor hardcodeado
  // ...
}];

// CountUp espera número, no string formateado
<CountUp end={list.count} /> // Falla con "85,658"
```

### SOLUCIÓN: Actualización Dinámica
```typescript
// ✅ SOLUCIÓN CORRECTA
{SalesCard.map((idx, index) => {
  let cardData = {...idx}; // Clonar objeto
  
  if (dashboardData) {
    switch(index) {
      case 0: // Ventas Mensuales
        if (dashboardData.monthly_sales !== undefined) {
          // Pasar número como string SIN formato
          cardData.count = dashboardData.monthly_sales.toString();
          // NO usar: toLocaleString('es-CO')
        }
        break;
    }
  }
  
  return <SpkListCard list={cardData} />;
})}
```

## 🎨 MODIFICACIÓN DE ESTILOS

### REGLA: Usar Clases Existentes
```scss
// ❌ MAL - No crear clases nuevas
.mi-clase- personalizada {
  background: #custom;
}

// ✅ BIEN - Usar variables y clases Vyzor
.dashboard-main-card {
  // Usar variables existentes
  background: var(--primary-color);
  // Usar mixins de la plantilla
  @include card-shadow;
}
```

### COLORES PERMITIDOS
```scss
// Solo usar variables definidas
var(--primary-color)    // Azul principal
var(--secondary-color)  // Color secundario
var(--success-color)    // Verde
var(--warning-color)    // Amarillo
var(--danger-color)     // Rojo
var(--info-color)       // Azul info

// Para farmacia, mapear a existentes
$pharmacy-blue: var(--primary-color);
```

## 🔌 INTEGRACIÓN DE RUTAS

### PASO 1: Agregar en routingdata.tsx
```typescript
// src/shared/data/routingdata.tsx
import Pharmaceutical from '../../components/dashboards/pharmaceutical/pharmaceutical';

export const RouteData = [
  // ... rutas existentes
  { 
    id: 99, // ID único
    path: `${import.meta.env.BASE_URL}dashboards/pharmaceutical`, 
    element: <Pharmaceutical /> 
  },
];
```

### PASO 2: Agregar en menú nav.tsx
```typescript
// src/shared/layouts-components/sidebar/nav.tsx
export const MENUITEMS = [
  {
    title: "Dashboards",
    icon: Svgicons.Dashboardicon,
    type: "sub",
    children: [
      // ... items existentes
      {
        path: `${import.meta.env.BASE_URL}dashboards/pharmaceutical`,
        icon: Svgicons.Salesicon, // Reusar icono
        type: "link",
        title: "Pharmaceutical"
      }
    ]
  }
];
```

## 🔄 COMPONENTES REUTILIZABLES VYZOR

### SpkListCard - Para tarjetas con métricas
```typescript
<SpkListCard 
  titleClass="fs-13 fw-medium mb-0" 
  listCard={true} 
  cardClass={cardData.cardClass} 
  list={{
    title: 'Ventas Mensuales',
    count: '123456', // String de número
    percent: '12.5%',
    icon: 'ti ti-trending-up',
    // ... más props
  }} 
/>
```

### SpkButton - Botones consistentes
```typescript
<SpkButton 
  Buttonvariant='primary' 
  Customclass="btn btn-wave"
  onClick={handleClick}
>
  Texto Botón
</SpkButton>
```

### Spkapexcharts - Gráficos
```typescript
<Spkapexcharts 
  height={356} 
  type={'line'} 
  width={'100%'} 
  chartOptions={options} 
  chartSeries={series} 
/>
```

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### ERROR 1: CountUp no muestra valor correcto
```typescript
// ❌ PROBLEMA
cardData.count = value.toLocaleString('es-CO'); // "1,234,567"

// ✅ SOLUCIÓN
cardData.count = value.toString(); // "1234567"
```

### ERROR 2: Componente no renderiza
```typescript
// ❌ PROBLEMA - Import incorrecto
import SpkListCard from '../components/SpkListCard';

// ✅ SOLUCIÓN - Path correcto
import SpkListCard from '../../../shared/@spk-reusable-components/application-reusable/spk-listcard';
```

### ERROR 3: Estilos no aplican
```scss
// ❌ PROBLEMA - Clase inventada
<div className="mi-dashboard-custom">

// ✅ SOLUCIÓN - Clases Vyzor
<div className="dashboard-main-card primary">
```

## 📝 CHECKLIST ANTES DE MODIFICAR

- [ ] ¿Busqué un componente similar en la plantilla?
- [ ] ¿Copié el archivo completo (no creé desde cero)?
- [ ] ¿Mantuve TODA la estructura original?
- [ ] ¿Solo cambié textos y datos?
- [ ] ¿Usé componentes Vyzor existentes?
- [ ] ¿Usé clases CSS existentes?
- [ ] ¿Agregué rutas en routingdata.tsx?
- [ ] ¿Agregué menú en nav.tsx?
- [ ] ¿Probé que compila sin errores?
- [ ] ¿Verifiqué en el navegador?

## 🛡️ PROTOCOLO DE SEGURIDAD

### ANTES de cualquier cambio:
1. **BACKUP** del archivo original
2. **LEER** archivo completo primero
3. **ENTENDER** estructura y dependencias
4. **PLANEAR** cambios mínimos necesarios
5. **EJECUTAR** cambios incrementales
6. **PROBAR** después de cada cambio

### Si algo se rompe:
1. **DETENER** inmediatamente
2. **REVERTIR** al backup
3. **ANALIZAR** qué salió mal
4. **CONSULTAR** documentación Vyzor
5. **REINTENTAR** con enfoque más conservador

## 💡 MEJORES PRÁCTICAS

### 1. Datos Dinámicos
```typescript
// Patrón para actualizar datos hardcodeados
const staticData = [...]; // Datos originales

const dynamicData = staticData.map((item, index) => {
  const newItem = {...item}; // Clonar
  if (apiData) {
    // Actualizar propiedades específicas
    newItem.value = apiData[index];
  }
  return newItem;
});
```

### 2. Loading States
```typescript
if (loading) {
  // Usar componente de loading de Vyzor
  return <div className="spinner-border text-primary" />;
}
```

### 3. Error Handling
```typescript
try {
  // Operación
} catch (error) {
  console.error('Error:', error);
  // NO mostrar error técnico al usuario
  // Usar toast o mensaje genérico
}
```

## 📌 RECORDATORIO FINAL

**LA PLANTILLA VYZOR ES DELICADA**
- Un cambio pequeño puede romper todo
- Siempre preferir COPIAR sobre CREAR
- Mantener estructura IDÉNTICA
- Solo cambiar DATOS, no LÓGICA
- Usar componentes EXISTENTES
- Seguir patrones ESTABLECIDOS

**ANTE LA DUDA:** No modificar, consultar primero

---
Documento creado: 13 Agosto 2025
Para: Futuras sesiones de desarrollo MedDispensa React
Por: Sistema de documentación técnica