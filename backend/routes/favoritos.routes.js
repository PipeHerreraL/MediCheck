const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require('../config/medical.config');

// Ruta local del servidor interno de PHP
const PHP_BACKEND_URL = config.phpBackendUrl;

/**
 * Proxy middleware para Favoritos.
 * Intercepta todas las peticiones (GET, POST, PUT, DELETE) hacia /api/favoritos 
 * y las reenvía a XAMPP transparente para el frontend.
 */
const proxyHandler = async (req, res, next) => {
    try {
        let targetUrl = PHP_BACKEND_URL;
        
        // Re-ensamblar los query parameters
        const queryParams = new URLSearchParams(req.query);
        
        // Si viene un ID en la ruta (ej: PUT /api/favoritos/1),
        // se lo enviamos a PHP como query param para no requerir reglas .htaccess avanzadas.
        if (req.params.id) {
            queryParams.append('id', req.params.id);
        }

        
        const queryString = queryParams.toString();
        if (queryString) {
            targetUrl += '?' + queryString;
        }

        // Axios hace la llamada "Proxy"
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body, // Pasa el body directamente (JSON)
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Retornamos al Frontend (Angular) el estatus exacto y los datos que devolvió PHP
        res.status(response.status).json(response.data);
    } catch (error) {
        // Axios capta los 404, 400 y 500 como excepciones. Las propagamos al Frontend:
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error('[Proxy Error] Comunicación con PHP Falló:', error.message);
            res.status(500).json({ 
                error: 'Error interno en el proxy de Node a PHP', 
                details: error.message 
            });
        }
    }
};

router.all('/', proxyHandler);
router.all('/:id', proxyHandler);

module.exports = router;
