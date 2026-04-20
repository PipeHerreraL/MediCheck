/**
 * MediCheck Backend Server
 * 
 * Servidor Express optimizado y limpio. Utiliza exclusivamente APIs
 * médicas gubernamentales y de acceso libre (sin registro).
 * 
 * APIs utilizadas:
 *   1. NIH Clinical Tables  - Búsqueda de condiciones médicas (2,400+)
 *   2. OpenFDA              - Eventos adversos de medicamentos
 *   3. MedlinePlus Connect  - Información médica detallada
 * 
 * Endpoints disponibles:
 *   GET /api/conditions/search?terms=...       - Buscar condiciones médicas
 *   GET /api/conditions/:icdCode/info          - Detalle por código ICD-10
 *   GET /api/drugs/adverse-events?drug=...     - Eventos adversos de un medicamento
 *   GET /api/drugs/search?terms=...            - Top reacciones de un medicamento
 * 
 * @author Equipo MediCheck
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/medical.config');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const conditionsRoutes = require('./routes/conditions.routes');
const drugsRoutes = require('./routes/drugs.routes');
const favoritosRoutes = require('./routes/favoritos.routes');

// Inicializar Express
const app = express();

// ============================================
// Middleware
// ============================================

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Log de solicitudes simple
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================
// Rutas
// ============================================

// ============================================
// Rutas Informativas
// ============================================

const getApiInfo = (req, res) => {
  res.json({
    name: 'MediCheck API',
    version: '1.2.0',
    status: 'online',
    endpoints: {
      conditionsSearch: '/api/conditions/search?terms=fever',
      conditionDetail: '/api/conditions/:icdCode/info',
      drugSearch: '/api/drugs/search?terms=aspirin',
      drugAdverseEvents: '/api/drugs/adverse-events?drug=aspirin'
    }
  });
};

// Responder en la raíz y en /api (con y sin barra)
app.get('/', getApiInfo);
app.get('/api', getApiInfo);
app.get('/api/', getApiInfo);



// Registrar rutas
app.use('/api/conditions', conditionsRoutes);
app.use('/api/drugs', drugsRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` }
  });
});

// Manejo de errores
app.use(errorHandler);

// ============================================
// Iniciar servidor
// ============================================

const axios = require('axios');

app.listen(config.port, async () => {
  let phpStatus = '🔴 OFFLINE';
  try {
      await axios.get(config.phpBackendUrl, { timeout: 2000 });
      phpStatus = '🟢 ONLINE';
  } catch (error) {
      if (error.response && error.response.status === 400) {
          // El script PHP está vivo, pero se quejó de que faltan parámetros
          phpStatus = '🟢 ONLINE';
      }
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║             🏥  MediCheck API Server                ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Puerto:  http://localhost:${config.port.toString().padEnd(20)}  ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  ✅ APIs Gratuitas Activas:                          ║');
  console.log('║     - NIH Clinical Tables (Búsqueda)                 ║');
  console.log('║     - OpenFDA (Medicamentos)                         ║');
  console.log('║     - MedlinePlus (Detalles Médicos)                 ║');
  console.log(`║     - PHP Favoritos Backend: ${phpStatus.padEnd(23)} ║`);
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
