const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function downloadImages(propertyId, downloadFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/img') {
  try {
    // Crear la carpeta si no existe
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder, { recursive: true });
    }

    // Hacer la solicitud a la API de EasyBroker para obtener las imágenes de la propiedad
    const response = await axios.get(`https://api.easybroker.com/v1/properties/${propertyId}`, {
      headers: {
        'X-Authorization': process.env.EASYBROKER_API_KEY,
      },
    });

    const propertyDetails = response.data;

    // Descargar cada imagen
    const imagePaths = await Promise.all(propertyDetails.property_images.map(async (image, index) => {
      const imagePath = path.join(downloadFolder, `image_${index}.jpg`);
      const imageResponse = await axios.get(image.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, imageResponse.data);
      console.log(`✅ Imagen descargada: ${imagePath}`);
      return imagePath;
    }));

    return imagePaths;
  } catch (error) {
    console.error('❌ Error al descargar imágenes:', error.message);
  }
}

module.exports = downloadImages;