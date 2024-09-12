const { Select, Input, Confirm } = require('enquirer');
const downloadImages = require('./services/downloadImages');
const editImages = require('./services/editImages');
const { subirImagenesACloudinary, eliminarImagenesDeCloudinary } = require('./services/uploadToCloudinary');
const { actualizarPropiedadConImagenes } = require('./services/uploadEditedImages');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

// Función para mostrar el menú
async function mostrarMenu() {
  console.log('\n=== 📸 Bienvenido al Asistente de Imágenes ===\n');

  const prompt = new Select({
    name: 'microservice',
    message: '¿Qué acción te gustaría realizar?',
    choices: [
      'Descargar imágenes',
      'Editar imágenes',
      'Subir imágenes a Cloudinary y EasyBroker',
      'Salir'
    ]
  });

  const action = await prompt.run();

  switch (action) {
    case 'Descargar imágenes':
      await manejarDescargaImagenes();
      break;
    case 'Editar imágenes':
      await manejarEdicionImagenes();  // Llamada a la función de edición
      break;
    case 'Subir imágenes a Cloudinary y EasyBroker':
      await manejarSubidaImagenes();
      break;
    case 'Salir':
      logger.info('👋 ¡Hasta luego!');
      return;
  }

  mostrarMenu();  // Volver a mostrar el menú después de completar la acción
}

// Función para manejar la descarga de imágenes
async function manejarDescargaImagenes() {
  const prompt = new Input({
    name: 'propertyId',
    message: '🆔 Ingresa el ID de la propiedad para descargar las imágenes:',
  });

  const propertyId = await prompt.run();
  logger.info(`📥 Descargando imágenes para la propiedad ${propertyId}...`);

  const imagePaths = await downloadImages(propertyId);

  if (imagePaths && imagePaths.length > 0) {
    logger.success('🎉 ¡Imágenes descargadas con éxito!');
    imagePaths.forEach((path, index) => logger.info(`  ${index + 1}. ${path}`));

    // Preguntar si se quiere editar las imágenes
    const editPrompt = new Confirm({
      name: 'editImages',
      message: '¿Quieres editar las imágenes descargadas?',
    });

    const editImagesAnswer = await editPrompt.run();

    if (editImagesAnswer) {
      await manejarEdicionImagenes(imagePaths);
    }
  } else {
    logger.error('⚠️ No se descargaron imágenes.');
  }
}

// Función para manejar la edición de imágenes
async function manejarEdicionImagenes(imagePaths) {
  logger.info('🔧 Editando imágenes...');

  const outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png';
  const editedImagePaths = await editImages(imagePaths, outputFolder);

  if (editedImagePaths && editedImagePaths.length > 0) {
    logger.success('🎉 ¡Imágenes editadas con éxito!');
    editedImagePaths.forEach((path, index) => logger.info(`  ${index + 1}. ${path}`));

    // Preguntar si se quiere eliminar las imágenes originales
    const deletePrompt = new Confirm({
      name: 'deleteOriginals',
      message: '¿Quieres eliminar las imágenes originales no editadas?',
    });

    const deleteOriginals = await deletePrompt.run();

    if (deleteOriginals) {
      imagePaths.forEach((filePath) => {
        try {
          fs.unlinkSync(filePath);
          logger.info(`🗑️ Imagen original eliminada: ${path.basename(filePath)}`);
        } catch (error) {
          logger.error(`❌ Error al eliminar la imagen ${path.basename(filePath)}: ${error.message}`);
        }
      });
    }
  } else {
    logger.error('⚠️ No se editaron imágenes.');
  }
}

// Función para manejar la subida de imágenes a Cloudinary y EasyBroker
async function manejarSubidaImagenes() {
  const prompt = new Input({
    name: 'propertyId',
    message: '🆔 Ingresa el ID de la propiedad para subir las imágenes:',
  });

  const propertyId = await prompt.run();
  logger.info(`📤 Subiendo imágenes para la propiedad ${propertyId}...`);

  // Ruta donde están las imágenes editadas
  const outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png';
  
  // Filtrar solo archivos de imagen válidos
  const imagePaths = fs.readdirSync(outputFolder)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.png'))  // Filtrar imágenes válidas
    .map(file => path.join(outputFolder, file));

  if (imagePaths.length > 0) {
    logger.info(`📤 Subiendo imágenes desde la carpeta ${outputFolder} para la propiedad ${propertyId}...`);

    // Subir las imágenes a Cloudinary
    const { urls: urlsCloudinary, publicIds } = await subirImagenesACloudinary(imagePaths);

    if (urlsCloudinary.length > 0) {
      await actualizarPropiedadConImagenes(propertyId, urlsCloudinary);
      logger.success('🎉 ¡Imágenes subidas con éxito a Cloudinary y EasyBroker!');

      // Preguntar si se desea eliminar las imágenes de Cloudinary
      const deleteCloudinaryPrompt = new Confirm({
        name: 'deleteCloudinary',
        message: '¿Quieres eliminar las imágenes de Cloudinary ahora que han sido subidas a EasyBroker?',
      });

      const deleteCloudinary = await deleteCloudinaryPrompt.run();

      if (deleteCloudinary) {
        await eliminarImagenesDeCloudinary(publicIds);
        logger.success('🧹 ¡Imágenes eliminadas de Cloudinary después de la subida exitosa!');
      } else {
        logger.info('🚫 Las imágenes no fueron eliminadas de Cloudinary.');
      }
    } else {
      logger.error('⚠️ No se subieron imágenes a Cloudinary.');
    }
  } else {
    logger.error('⚠️ No se encontraron imágenes para subir.');
  }
}

mostrarMenu();