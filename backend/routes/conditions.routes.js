/**
 * Rutas para búsqueda de condiciones médicas (NIH Clinical Tables)
 * 
 * API: https://clinicaltables.nlm.nih.gov/api/conditions/v3/search
 * - Sin API Key requerida
 * - 2,400+ condiciones médicas
 * - Incluye códigos ICD-10, nombres, sinónimos
 * 
 * GET /api/conditions/search?terms=headache&maxList=10
 * GET /api/conditions/:icdCode/info
 */

const express = require('express');
const axios = require('axios');
const config = require('../config/medical.config');

const router = express.Router();

/**
 * GET /api/conditions/search
 * Busca condiciones médicas por nombre, síntoma o término parcial.
 * Usa el NIH Clinical Table Search Service.
 * 
 * @query {string} terms - Término de búsqueda (ej: "headache", "fever", "dolor")
 * @query {number} [maxList=20] - Número máximo de resultados (1-100)
 * @returns {Object} Resultados de búsqueda con condiciones, códigos ICD-10 y links
 * 
 * Ejemplo: GET /api/conditions/search?terms=headache&maxList=5
 */
router.get('/search', async (req, res, next) => {
  try {
    const { terms, maxList = 20 } = req.query;

    if (!terms || terms.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'El parámetro "terms" es requerido. Ej: ?terms=headache' },
      });
    }

    const response = await axios.get(config.nihBaseUrl, {
      params: {
        terms: terms.trim(),
        maxList: Math.min(parseInt(maxList) || 20, 100),
        df: 'consumer_name,icd10cm_codes',
        ef: 'consumer_name,icd10cm_codes,info_link_data',
      },
    });

    // La respuesta del NIH es un array con estructura especial:
    // [totalResults, codeArray, extraFieldsHash, displayStringsArray]
    const [totalResults, codes, extraFields, displayStrings] = response.data;

    // Transformar a formato más amigable
    const conditions = codes.map((code, index) => {
      const consumerNames = extraFields?.consumer_name || [];
      const icdCodes = extraFields?.icd10cm_codes || [];
      const infoLinks = extraFields?.info_link_data || [];

      // Parsear info_link_data de forma segura
      let infoUrl = null;
      let infoTitle = null;
      try {
        const linkData = infoLinks[index];
        if (linkData && typeof linkData === 'string') {
          const linkParts = linkData.split(',');
          if (linkParts.length >= 2) {
            infoUrl = linkParts[0];
            infoTitle = linkParts.slice(1).join(',');
          }
        } else if (linkData && typeof linkData === 'object') {
          // Si es un objeto/array, intentar extraer URL
          infoUrl = linkData.url || linkData.href || (Array.isArray(linkData) ? linkData[0] : null);
          infoTitle = linkData.title || (Array.isArray(linkData) ? linkData[1] : null);
        }
      } catch (e) {
        // Ignorar errores de parsing - dejar null
      }

      return {
        id: code,
        name: displayStrings?.[index]?.[0] || consumerNames[index] || 'N/A',
        icd10Code: displayStrings?.[index]?.[1] || icdCodes[index] || null,
        infoUrl: infoUrl,
        infoTitle: infoTitle,
      };
    });

    res.json({
      success: true,
      totalResults: totalResults,
      count: conditions.length,
      searchTerm: terms,
      data: conditions,
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/conditions/:icdCode/info
 * Obtiene información médica detallada de una condición usando MedlinePlus Connect.
 * Requiere un código ICD-10 válido.
 * 
 * @param {string} icdCode - Código ICD-10 (ej: "J06.9" para resfriado común)
 * @returns {Object} Información médica detallada de MedlinePlus
 * 
 * Ejemplo: GET /api/conditions/J06.9/info
 */
router.get('/:icdCode/info', async (req, res, next) => {
  try {
    const { icdCode } = req.params;

    if (!icdCode) {
      return res.status(400).json({
        success: false,
        error: { message: 'Se requiere un código ICD-10 válido. Ej: J06.9' },
      });
    }

    const response = await axios.get(config.medlinePlusBaseUrl, {
      params: {
        'mainSearchCriteria.v.cs': '2.16.840.1.113883.6.90', // ICD-10-CM code system
        'mainSearchCriteria.v.c': icdCode,
        'knowledgeResponseType': 'application/json',
      },
    });

    // Extraer información útil de la respuesta de MedlinePlus
    const feed = response.data?.feed;
    const entries = feed?.entry || [];

    const articles = entries.map(entry => ({
      title: entry.title?._value || 'Sin título',
      summary: cleanHtml(entry.summary?._value || ''),
      link: entry.link?.[0]?.href || null,
      source: entry.source?.title?._value || 'MedlinePlus',
      updated: entry.updated?._value || null,
    }));

    res.json({
      success: true,
      icdCode: icdCode,
      count: articles.length,
      data: articles,
    });

  } catch (error) {
    // MedlinePlus puede retornar datos vacíos si no encuentra el código
    if (error.response?.status === 200 || !error.response) {
      return res.json({
        success: true,
        icdCode: icdCode,
        count: 0,
        data: [],
        message: 'No se encontró información para este código ICD-10',
      });
    }
    next(error);
  }
});

/**
 * Limpia tags HTML de un string para retornar texto plano
 * @param {string} html - String con posible contenido HTML
 * @returns {string} Texto limpio sin HTML
 */
function cleanHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

module.exports = router;
