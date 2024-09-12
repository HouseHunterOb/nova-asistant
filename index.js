const { actualizarPropiedadConImagenes } = require('./services/uploadEditedImages');
const { subirImagenesACloudinary, eliminarImagenesDeCloudinary } = require('./services/uploadToCloudinary');
const { Select, Input } = require('enquirer');
const downloadImages = require('./services/downloadImages');
const editImages = require('./services/editImages');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

async function mostrarMenu() {
  console.log('\n=== 📸 Bienvenido al Asistente de Imágenes ===\n');

  const prompt = new Select({
    name: 'microservice',
    message: '¿Qué acción te gustaría realizar?',
    choices: [
      'Bajar, Editar y Subir imágenes',
      'Descargar imágenes',
      'Editar imágenes',
      'Subir imágenes',
      'Salir'
    ]
  });

  const action = await prompt.run();

  switch (action) {
    case 'Bajar, Editar y Subir imágenes':
      await manejarProcesoCompleto();
      break;
    case 'Descargar imágenes':
      await manejarDescargaImagenes();
      break;
    case 'Editar imágenes':
      await manejarEdicionImagenes();
      break;
    case 'Subir imágenes':
      await manejarSubidaImagenes();
      break;
    case 'Salir':
      logger.info('👋 ¡Hasta luego!');
      return;
  }

  mostrarMenu(); // Vuelve a mostrar el menú después de completar la acción
}

async function manejarProcesoCompleto() {
  const prompt = new Input({
    name: 'propertyId',
    message: '🆔 Ingresa el ID de la propiedad para bajar, editar y subir las imágenes:',
  });

  const propertyId = await prompt.run();
  logger.info(`📥 Descargando imágenes para la propiedad ${propertyId}...`);

  const imagePaths = await downloadImages(propertyId);
  if (!imagePaths || imagePaths.length === 0) {
    logger.error('⚠️ No se encontraron imágenes para descargar.');
    return;
  }

  logger.success('✅ ¡Imágenes descargadas con éxito!');

  // Paso 2: Editar imágenes
  const outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png';
  logger.info('🔧 Editando imágenes...');

  const editedImagePaths = await editImages(imagePaths, outputFolder);
  if (!editedImagePaths || editedImagePaths.length === 0) {
    logger.error('⚠️ No se editaron imágenes.');
    return;
  }

  logger.success('✅ ¡Imágenes editadas con éxito!');

  // Paso 3: Subir imágenes a Cloudinary y EasyBroker
  await manejarSubidaImagenes(editedImagePaths, propertyId);
}

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
  } else {
    logger.error('⚠️ No se encontraron imágenes para descargar.');
  }
}

async function manejarEdicionImagenes(imagePaths = null) {
  if (!imagePaths) {
    const prompt = new Input({
      name: 'propertyId',
      message: '🆔 Ingresa el ID de la propiedad para editar las imágenes:',
    });

    const propertyId = await prompt.run();
    const outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/img';
    imagePaths = fs.readdirSync(outputFolder).map(file => path.join(outputFolder, file));
  }

  logger.info('🔧 Editando imágenes...');
  const outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png';
  const editedImagePaths = await editImages(imagePaths, outputFolder);

  if (editedImagePaths && editedImagePaths.length > 0) {
    logger.success('🎉 ¡Imágenes editadas con éxito!');
    editedImagePaths.forEach((path, index) => logger.info(`  ${index + 1}. ${path}`));
  } else {
    logger.error('⚠️ No se editaron imágenes.');
  }
}

async function manejarSubidaImagenes(editedImagePaths = null, propertyId = null) {
  if (!editedImagePaths || !propertyId) {
    const prompt = new Input({
      name: 'propertyId',
      message: '🆔 Ingresa el ID de la propiedad para subir las imágenes:',
    });

    propertyId = await prompt.run();
    const outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png';
    editedImagePaths = fs.readdirSync(outputFolder)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.png'))
      .map(file => path.join(outputFolder, file));
  }

  logger.info(`📤 Subiendo imágenes para la propiedad ${propertyId}...`);

  if (editedImagePaths.length > 0) {
    try {
      // Subir imágenes a Cloudinary
      const { urls, publicIds } = await subirImagenesACloudinary(editedImagePaths);

      // Subir imágenes a EasyBroker
      await actualizarPropiedadConImagenes(propertyId, urls);

      // Si la subida fue exitosa, eliminar las imágenes de Cloudinary
      await eliminarImagenesDeCloudinary(publicIds);
      logger.success('🎉 ¡Imágenes subidas con éxito a Cloudinary y EasyBroker!');
    } catch (error) {
      logger.error('❌ Ocurrió un error durante la subida. No se eliminarán las imágenes de Cloudinary.');
    }
  } else {
    logger.error('⚠️ No se encontraron imágenes para subir.');
  }
}

mostrarMenu();