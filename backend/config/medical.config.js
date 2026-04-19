/**
 * Configuración centralizada para las APIs médicas gratuitas
 * Utiliza recursos de NIH (U.S. National Institutes of Health) y FDA.
 */

require('dotenv').config();

const config = {
  // NIH Clinical Table Search Service (Condiciones médicas)
  nihBaseUrl: 'https://clinicaltables.nlm.nih.gov/api/conditions/v3/search',

  // OpenFDA (Eventos adversos de medicamentos)
  openFdaBaseUrl: 'https://api.fda.gov/drug/event.json',

  // MedlinePlus Connect (Detalle de enfermedades por ICD-10)
  medlinePlusBaseUrl: 'https://connect.medlineplus.gov/service',

  // Puerto del servidor
  port: process.env.PORT || 3000,
};

module.exports = config;
