const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const logger = require('../utils/logger');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imágenes a Cloudinary sin transformaciones
const subirImagenesACloudinary = async (imagePaths) => {
  const urls = [];
  const publicIds = [];

  for (const imagePath of imagePaths) {
    try {
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'easybroker_images',  // Sube las imágenes sin aplicar transformaciones
      });

      logger.success(`Imagen subida con éxito: ${result.secure_url}`);
      urls.push(result.secure_url);
      publicIds.push(result.public_id);  // Guardar ID público para eliminar después si es necesario
    } catch (error) {
      logger.error(`Error al subir la imagen ${imagePath}: ${error.message}`);
    }
  }

  return { urls, publicIds };
};

// Función para eliminar imágenes de Cloudinary
const eliminarImagenesDeCloudinary = async (publicIds) => {
  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.success(`Imagen eliminada de Cloudinary: ${publicId}`);
    } catch (error) {
      logger.error(`Error al eliminar la imagen ${publicId} de Cloudinary: ${error.message}`);
    }
  }
};

module.exports = { subirImagenesACloudinary, eliminarImagenesDeCloudinary };