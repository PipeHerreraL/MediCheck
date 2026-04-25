# 🏥 MediCheck API - Backend

Este es el servidor backend para el proyecto **MediCheck**, desarrollado para la asignatura de Programación Orientada a Sitios Web. El servidor actúa como un proxy seguro que consume múltiples APIs médicas gubernamentales gratuitas.

## 🚀 Características

- **100% Gratuito:** No requiere API Keys ni registros externos.
- **Fuentes Oficiales:** Consume datos del NIH (National Institutes of Health) y la FDA de EE.UU.
- **Seguro:** Implementa CORS para comunicación con Angular.
- **Legible:** Código estructurado en rutas y configuraciones claras.

## 🛠️ Tecnologías

- **Node.js:** Entorno de ejecución.
- **Express:** Framework para el servidor web.
- **Axios:** Cliente HTTP para consultas a APIs externas.
- **Cors:** Middleware para permitir peticiones desde el frontend.

---

## 📂 Estructura del Proyecto

```text
backend/
├── config/
│   └── medical.config.js    # URLs y configuración de APIs
├── middleware/
│   └── errorHandler.js      # Manejo global de errores
├── routes/
│   ├── conditions.routes.js # Rutas de enfermedades y NIH
│   └── drugs.routes.js      # Rutas de medicamentos y FDA
├── .env                     # Variables de entorno (opcional)
├── server.js                # Punto de entrada principal
└── package.json             # Dependencias del proyecto
```

---

## 🚦 Endpoints de la API

Todos los endpoints base son: `http://localhost:3000/api`

### 1. Búsqueda de Condiciones (Symptom Checker)
Busca enfermedades relacionadas con un término o síntoma.
- **Ruta:** `GET /conditions/search`
- **Parámetros:** 
  - `terms` (string): El síntoma o enfermedad a buscar.
  - `maxList` (number, opcional): Máximo de resultados (defecto 20).
- **Ejemplo:** `http://localhost:3000/api/conditions/search?terms=fever`

### 2. Información Detallada de Enfermedad
Obtiene descripción médica detallada del recurso MedlinePlus.
- **Ruta:** `GET /conditions/:icdCode/info`
- **Parámetros:**
  - `icdCode` (string): Código ICD-10 de la enfermedad (ej: J06.9).
- **Ejemplo:** `http://localhost:3000/api/conditions/J06.9/info`

### 3. Reacciones de Medicamentos
Obtiene un ranking de las reacciones más comunes reportadas para un fármaco.
- **Ruta:** `GET /drugs/search`
- **Parámetros:**
  - `terms` (string): Nombre del medicamento.
- **Ejemplo:** `http://localhost:3000/api/drugs/search?terms=aspirin`

### 4. Eventos Adversos Detallados
Consulta reportes reales de la FDA sobre efectos secundarios.
- **Ruta:** `GET /drugs/adverse-events`
- **Parámetros:**
  - `drug` (string): Nombre del medicamento.
- **Ejemplo:** `http://localhost:3000/api/drugs/adverse-events?drug=ibuprofen&limit=5`

### 5. Favoritos (Proxy a PHP API)
Guarda, lee, modifica y borra búsquedas usando Node.js como puente hacia XAMPP.
- **Rutas:** `POST`, `GET`, `PUT`, `DELETE` en `/favoritos`
- **Nota:** Requiere la base de datos y que Apache esté corriendo. Más info en `/php_backend/README.md`.

---

## 💻 Instalación y Uso

1. **Instalar dependencias y configurar entorno:**
   ```bash
   cd backend
   npm install
   # Recuerda copiar/renombrar .env.example a .env
   ```

2. **Iniciar servidor en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Iniciar servidor en producción:**
   ```bash
   npm start
   ```

---

## 📄 Licencia
Este proyecto es de uso académico para la **Universidad de Manizales**.
