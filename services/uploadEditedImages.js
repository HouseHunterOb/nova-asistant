const axios = require('axios');
require('dotenv').config();
const logger = require('../utils/logger');

const actualizarPropiedadConImagenes = async (propertyId, imageUrls) => {
  try {
    const images = imageUrls.map((url, index) => ({
      title: `Imagen ${index + 1}`,
      url,
    }));

    const response = await axios.patch(`https://api.easybroker.com/v1/properties/${propertyId}`, {
      images: images,
    }, {
      headers: {
        'X-Authorization': process.env.EASYBROKER_API_KEY,
      }
    });

    if (response.status === 200) {
      logger.success(`🎉 Propiedad ${propertyId} actualizada correctamente.`);
    } else {
      logger.error(`Error al actualizar la propiedad ${propertyId}: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    logger.error(`Error al actualizar la propiedad: ${error.response?.data?.message || error.message}`);
    throw new Error('La actualización de la propiedad falló');
  }
};

module.exports = { actualizarPropiedadConImagenes };