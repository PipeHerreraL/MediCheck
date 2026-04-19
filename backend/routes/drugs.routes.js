/**
 * Rutas para eventos adversos de medicamentos (OpenFDA)
 * 
 * API: https://api.fda.gov/drug/event.json
 * - Sin API Key requerida (límite: 240 req/min sin key, 120,000/día con key)
 * - Millones de reportes de eventos adversos
 * - Datos reales de la FDA de EE.UU.
 * 
 * GET /api/drugs/adverse-events?drug=aspirin&limit=10
 * GET /api/drugs/search?terms=ibuprofen&limit=5
 */

const express = require('express');
const axios = require('axios');
const config = require('../config/medical.config');

const router = express.Router();

/**
 * GET /api/drugs/adverse-events
 * Busca eventos adversos reportados para un medicamento específico.
 * Usa la API de OpenFDA.
 * 
 * @query {string} drug - Nombre del medicamento (ej: "aspirin", "ibuprofen")
 * @query {number} [limit=10] - Número de resultados (1-100)
 * @returns {Object} Eventos adversos con reacciones y datos del paciente
 * 
 * Ejemplo: GET /api/drugs/adverse-events?drug=aspirin&limit=5
 */
router.get('/adverse-events', async (req, res, next) => {
  try {
    const { drug, limit = 10 } = req.query;

    if (!drug || drug.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'El parámetro "drug" es requerido. Ej: ?drug=aspirin' },
      });
    }

    const response = await axios.get(config.openFdaBaseUrl, {
      params: {
        search: `patient.drug.medicinalproduct:"${drug.trim()}"`,
        limit: Math.min(parseInt(limit) || 10, 100),
      },
    });

    const results = response.data?.results || [];

    // Transformar a formato más amigable
    const events = results.map((event, index) => {
      const patient = event.patient || {};
      const drugs = (patient.drug || []).map(d => ({
        name: d.medicinalproduct || 'Desconocido',
        dosage: d.drugdosagetext || null,
        indication: d.drugindication || null,
        route: d.drugadministrationroute || null,
      }));

      const reactions = (patient.reaction || []).map(r => ({
        description: r.reactionmeddrapt || 'Desconocida',
        outcome: r.reactionoutcome || null,
      }));

      return {
        id: index + 1,
        reportDate: event.receiptdate || null,
        serious: event.serious === '1',
        seriousReason: {
          death: event.seriousnessdeath === '1',
          hospitalization: event.seriousnesshospitalization === '1',
          lifeThreatening: event.seriousnesslifethreatening === '1',
          disability: event.seriousnessdisabling === '1',
        },
        patient: {
          age: patient.patientonsetage || null,
          ageUnit: patient.patientonsetageunit || null,
          sex: patient.patientsex === '1' ? 'Masculino' : patient.patientsex === '2' ? 'Femenino' : 'No especificado',
          weight: patient.patientweight || null,
        },
        drugs: drugs,
        reactions: reactions,
        country: event.occurcountry || null,
      };
    });

    res.json({
      success: true,
      drug: drug,
      totalResults: response.data?.meta?.results?.total || 0,
      count: events.length,
      data: events,
      disclaimer: 'Datos de la FDA (U.S. Food & Drug Administration). Solo con fines informativos.',
    });

  } catch (error) {
    // OpenFDA retorna 404 si no hay resultados
    if (error.response?.status === 404) {
      return res.json({
        success: true,
        drug: drug,
        totalResults: 0,
        count: 0,
        data: [],
        message: `No se encontraron eventos adversos para "${drug}"`,
      });
    }
    next(error);
  }
});

/**
 * GET /api/drugs/search
 * Busca medicamentos por nombre y retorna un resumen de reacciones reportadas.
 * Usa la API de OpenFDA con count para agregar datos.
 * 
 * @query {string} terms - Nombre parcial o completo del medicamento
 * @query {number} [limit=10] - Número de reacciones a listar
 * @returns {Object} Top reacciones reportadas para el medicamento
 * 
 * Ejemplo: GET /api/drugs/search?terms=aspirin&limit=10
 */
router.get('/search', async (req, res, next) => {
  try {
    const { terms, limit = 10 } = req.query;

    if (!terms || terms.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'El parámetro "terms" es requerido. Ej: ?terms=aspirin' },
      });
    }

    const response = await axios.get(config.openFdaBaseUrl, {
      params: {
        search: `patient.drug.medicinalproduct:"${terms.trim()}"`,
        count: 'patient.reaction.reactionmeddrapt.exact',
        limit: Math.min(parseInt(limit) || 10, 100),
      },
    });

    const results = response.data?.results || [];

    const reactions = results.map((item, index) => ({
      rank: index + 1,
      reaction: item.term || 'Desconocida',
      count: item.count || 0,
    }));

    res.json({
      success: true,
      drug: terms,
      count: reactions.length,
      data: reactions,
      disclaimer: 'Datos de la FDA. La frecuencia no implica causalidad.',
    });

  } catch (error) {
    if (error.response?.status === 404) {
      return res.json({
        success: true,
        drug: terms,
        count: 0,
        data: [],
        message: `No se encontraron datos para "${terms}"`,
      });
    }
    next(error);
  }
});

module.exports = router;
