const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

const easyBrokerApi = axios.create({
  baseURL: 'https://api.easybroker.com/v1',
  headers: {
    'X-Authorization': process.env.EASYBROKER_API_KEY,
  },
});

const actualizarPropiedadConImagenes = async (propertyId, urlsImagenes) => {
  try {
    logger.info(`Actualizando la propiedad ${propertyId} con ${urlsImagenes.length} imágenes...`);
    
    const images = urlsImagenes.map(url => ({
      title: 'Property Image',
      url,
    }));

    const response = await easyBrokerApi.patch(`/properties/${propertyId}`, { images });

    if (response.status === 200) {
      logger.success(`Propiedad ${propertyId} actualizada correctamente en EasyBroker.`);
    } else {
      logger.error(`Error al actualizar la propiedad: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    logger.error(`Error al actualizar la propiedad: ${error.response?.data?.message || error.message}`);
    throw new Error('La actualización de la propiedad falló');
  }
};

module.exports = { actualizarPropiedadConImagenes };