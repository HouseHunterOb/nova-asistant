const axios = require('axios');
const fs = require('fs');

async function uploadImages(propertyId, imagePath, imageField = 'property_images') {
  try {
    const imageData = fs.readFileSync(imagePath);
    await axios.patch(`https://api.easybroker.com/v1/properties/${propertyId}/${imageField}`, imageData, {
      headers: {
        'X-Authorization': process.env.EASYBROKER_API_KEY,
        'Content-Type': 'image/jpeg',
      },
    });
    console.log(`✅ Imagen subida a EasyBroker: ${path.basename(imagePath)}`);
  } catch (error) {
    console.error('❌ Error al subir imagen:', error.message);
  }
}

module.exports = uploadImages;
