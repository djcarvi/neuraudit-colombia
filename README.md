# 🏥 NEURAUDIT COLOMBIA - Sistema de Auditoría Médica

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-5.2.4-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## 📋 DESCRIPCIÓN

**NeurAudit Colombia** es un sistema web completo para la **auditoría médica** entre PSS/PTS y EPS Familiar de Colombia, desarrollado en estricto cumplimiento con la **Resolución 2284 de 2023** del Ministerio de Salud y Protección Social.

### 🎯 **Objetivo Principal**
Facilitar el proceso completo de **radicación, auditoría, glosas y conciliación** de cuentas médicas, garantizando el cumplimiento normativo y la eficiencia operativa.

## 🏗️ **ARQUITECTURA TÉCNICA**

### **Stack Tecnológico:**
- **Backend:** Django 5.2.4 + Django REST Framework
- **Base de Datos:** MongoDB (100% NoSQL)
- **Frontend:** React 18.x + TypeScript + Vyzor Template
- **Autenticación:** JWT con sistema personalizado
- **Storage:** Digital Ocean Spaces Object Storage

### **Puertos de Desarrollo:**
- **Backend:** http://localhost:8003
- **Frontend:** http://localhost:3000

## 🚀 **INSTALACIÓN Y CONFIGURACIÓN**

### **Prerrequisitos:**
- Python 3.12+
- Node.js 18.x+
- MongoDB
- Git

### **1. Clonar el Repositorio:**
```bash
git clone https://github.com/djcarvi/neuraudit-colombia.git
cd neuraudit-colombia
```

### **2. Configurar Backend (Django):**
```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear usuarios de prueba
python manage.py create_test_users

# Ejecutar servidor
python manage.py runserver 0.0.0.0:8003
```

### **3. Configurar Frontend (React):**
```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

## 👥 **USUARIOS DE PRUEBA**

### **EPS Familiar de Colombia:**
- **Usuario:** `test.eps`
- **Contraseña:** `simple123`
- **Rol:** Auditor/Coordinador

### **PSS/PTS (Prestadores):**
- **Usuario:** `test.pss`
- **Contraseña:** `simple123`
- **NIT:** `123456789-0`
- **Rol:** Radicador

## 📊 **MÓDULOS IMPLEMENTADOS**

### ✅ **Módulos Operativos:**

#### **🔸 Autenticación y Seguridad**
- Login diferenciado PSS/EPS
- Autenticación JWT robusta
- Sistema de permisos por rol
- Logs de auditoría completos

#### **🔸 Radicación de Cuentas Médicas**
- Upload de facturas XML (DIAN)
- Upload de RIPS JSON (MinSalud)
- Upload de soportes documentales
- Extracción automática de datos
- Validaciones normativas

#### **🔸 Consulta de Radicaciones**
- Filtros avanzados por fecha, estado, NIT
- Visualización de estadísticas RIPS
- Datos reales desde MongoDB
- Paginación y ordenamiento

#### **🔸 Dashboard Ejecutivo**
- KPIs en tiempo real
- Estadísticas de servicios
- Gráficos interactivos
- Resúmenes por categoría

### 🔄 **Próximos Módulos (Planificados):**
- **Clasificador de Soportes** (Resolución 2284/2023)
- **Módulo de Auditoría Médica**
- **Sistema de Glosas Oficiales**
- **Módulo de Conciliación**
- **Reportes Financieros**

## 🎯 **FUNCIONALIDADES PRINCIPALES**

### **📋 Gestión de Radicaciones:**
- ✅ Radicación de facturas electrónicas XML
- ✅ Procesamiento de RIPS JSON validado
- ✅ Upload múltiple de soportes documentales
- ✅ Extracción automática de metadata
- ✅ Validaciones según Resolución 2284/2023

### **🔍 Extracción Automática de Datos:**
- ✅ Parser XML para facturas DIAN
- ✅ Parser JSON para RIPS MinSalud
- ✅ Extracción de datos del sector salud
- ✅ Validación de estructura y contenido
- ✅ Detección automática de errores

### **📊 Visualización de Datos:**
- ✅ Estadísticas RIPS por tipo de servicio
- ✅ Datos de usuarios, consultas, procedimientos
- ✅ Información de medicamentos y urgencias
- ✅ Detalles de hospitalización y recién nacidos

## 📜 **CUMPLIMIENTO NORMATIVO**

### **Resolución 2284 de 2023 - MinSalud:**
- ✅ Soportes de cobro según anexo técnico
- ✅ Manual único de devoluciones y glosas
- ✅ Plazos legales establecidos
- ✅ Codificación estándar de glosas
- 🔄 Clasificación automática de soportes (próximo)

### **Resolución 510/2805 de 2022 - Facturación:**
- ✅ Facturas electrónicas XML según DIAN
- ✅ Validación de estructura UBL
- ✅ Extracción de datos del sector salud

### **Resolución 1036/2805 de 2022 - RIPS:**
- ✅ RIPS formato JSON según MinSalud
- ✅ Validación de estructura y contenido
- ✅ Procesamiento de todos los tipos de servicio

## 🔧 **ESTRUCTURA DEL PROYECTO**

```
neuraudit-colombia/
├── backend/                    # Django Backend
│   ├── apps/
│   │   ├── authentication/    # Sistema de autenticación JWT
│   │   ├── radicacion/        # Módulo de radicación
│   │   ├── catalogs/          # Catálogos y referencias
│   │   └── ...
│   ├── config/                # Configuración Django
│   └── requirements.txt
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── shared/           # Componentes reutilizables
│   │   └── ...
│   └── package.json
├── context/                   # Documentación y archivos de contexto
├── vyzor-react-ts/           # Template base Vyzor
└── docs/                     # Documentación técnica
```

## 📚 **DOCUMENTACIÓN TÉCNICA**

### **Archivos de Documentación Principal:**
- `CLAUDE.md` - Memoria completa del proyecto
- `PLAN_CLASIFICADOR_SOPORTES_RESOLUCION_2284.md` - Plan próxima implementación
- `NEURAUDIT-AUTHENTICATION-JWT-DOCUMENTATION.md` - Sistema de autenticación
- `NEURAUDIT-SISTEMA-FUNCIONAL-FINAL.md` - Estado actual del sistema

### **Resolución Normativa:**
- `context/Resolución No 2284 de 2023.pdf` - Norma oficial completa
- `context/Resolución No 2284 de 2023.txt` - Versión texto para consulta

## 🎯 **PRÓXIMOS DESARROLLOS**

### **🔧 Clasificador de Soportes (Próxima sesión):**
- Parser de nomenclatura oficial (HEV, EPI, PDX, etc.)
- Clasificación automática en 7 categorías
- Validación de estructura según norma
- Componente frontend para visualización

### **📋 Módulos Pendientes:**
- Sistema de auditoría médica completo
- Módulo de glosas con códigos oficiales
- Sistema de conciliación y respuestas
- Reportes financieros y contables

## 🛡️ **SEGURIDAD Y AUDITORÍA**

- ✅ Autenticación JWT robusta
- ✅ Logs de auditoría completos
- ✅ Validación de datos en backend
- ✅ Protección contra inyección SQL/NoSQL
- ✅ Manejo seguro de archivos upload
- ✅ Cumplimiento HABEAS DATA

## 📞 **SOPORTE Y CONTACTO**

**Desarrollado por:** Analítica Neuronal  
**Cliente:** EPS Familiar de Colombia  
**Inicio del Proyecto:** 29 Julio 2025  
**Estado:** En desarrollo activo  

## 📄 **LICENCIA**

Este proyecto es propiedad de **EPS Familiar de Colombia** y **Analítica Neuronal**. 
Uso restringido según contrato de desarrollo.

---

**🏥 Sistema de Auditoría Médica para EPS Familiar de Colombia**  
**📋 Cumplimiento: Resolución 2284 de 2023 - Ministerio de Salud y Protección Social**  
**🔧 Desarrollado con Django + React + MongoDB**