const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const logger = require('../utils/logger');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imágenes a Cloudinary y luego devolver las URLs
const subirImagenesACloudinary = async (imagePaths) => {
  const urls = [];
  const publicIds = [];

  for (const imagePath of imagePaths) {
    try {
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'easybroker_images'
      });

      logger.success(`Imagen subida a Cloudinary: ${result.secure_url}`);
      urls.push(result.secure_url);
      publicIds.push(result.public_id);  // Guardar ID público para eliminar después
    } catch (error) {
      logger.error(`Error al subir la imagen ${imagePath}: ${error.message}`);
    }
  }

  // Devolver las URLs y los publicIds
  return { urls, publicIds };
};

// Función para eliminar imágenes de Cloudinary
const eliminarImagenesDeCloudinary = async (publicIds) => {
  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.success(`Imagen con public_id ${publicId} eliminada de Cloudinary.`);
    } catch (error) {
      logger.error(`Error al eliminar la imagen ${publicId} de Cloudinary: ${error.message}`);
    }
  }
};

module.exports = {
  subirImagenesACloudinary,
  eliminarImagenesDeCloudinary
};