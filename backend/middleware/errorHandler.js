/**
 * Middleware de manejo global de errores para Express.
 * Captura errores de todas las rutas y retorna respuestas JSON consistentes.
 */

function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  // Determinar el código de estado HTTP
  const statusCode = err.statusCode || err.response?.status || 500;

  // Construir respuesta de error estandarizada
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Error interno del servidor',
      status: statusCode,
    },
  };

  // En desarrollo, incluir más detalles
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.details = err.response?.data || null;
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
