const { Select, Input, Confirm } = require('enquirer');
const downloadImages = require('./services/downloadImages');
const editImages = require('./services/editImages');
const fs = require('fs');
const path = require('path');

async function mostrarMenu() {
  console.log('\n=== 📸 Bienvenido al Asistente de Imágenes ===\n');

  const prompt = new Select({
    name: 'microservice',
    message: '¿Qué acción te gustaría realizar?',
    choices: [
      'Descargar imágenes',
      'Editar imágenes',
      'Subir imágenes',
      'Salir'
    ]
  });

  const action = await prompt.run();

  switch (action) {
    case 'Descargar imágenes':
      await manejarDescargaImagenes();
      break;
    case 'Editar imágenes':
      await manejarEdicionImagenes();
      break;
    case 'Subir imágenes':
      console.log('📤 Subir imágenes - Funcionalidad pendiente');
      break;
    case 'Salir':
      console.log('👋 ¡Hasta luego!');
      return;
  }

  mostrarMenu(); // Vuelve a mostrar el menú después de completar la acción
}

async function manejarDescargaImagenes() {
  const prompt = new Input({
    name: 'propertyId',
    message: '🆔 Ingresa el ID de la propiedad para descargar las imágenes:',
  });

  const propertyId = await prompt.run();
  console.log(`\n📥 Descargando imágenes para la propiedad ${propertyId}...\n`);

  const imagePaths = await downloadImages(propertyId);

  if (imagePaths && imagePaths.length > 0) {
    console.log('🎉 ¡Imágenes descargadas con éxito!');
    imagePaths.forEach((path, index) => console.log(`  ${index + 1}. ${path}`));

    const editPrompt = new Confirm({
      name: 'editImages',
      message: '¿Quieres editar las imágenes descargadas?',
    });

    const editImagesAnswer = await editPrompt.run();

    if (editImagesAnswer) {
      await manejarEdicionImagenes(imagePaths);
    }
  } else {
    console.log('⚠️ No se descargaron imágenes.');
  }
}

async function manejarEdicionImagenes(imagePaths) {
  console.log(`\n🔧 Editando imágenes...\n`);

  const outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png';
  const editedImagePaths = await editImages(imagePaths, outputFolder);

  if (editedImagePaths && editedImagePaths.length > 0) {
    console.log('🎉 ¡Imágenes editadas con éxito!');
    editedImagePaths.forEach((path, index) => console.log(`  ${index + 1}. ${path}`));

    const deletePrompt = new Confirm({
      name: 'deleteOriginals',
      message: '¿Quieres eliminar las imágenes originales no editadas?',
    });

    const deleteOriginals = await deletePrompt.run();

    if (deleteOriginals) {
      imagePaths.forEach((filePath) => {
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Imagen original eliminada: ${path.basename(filePath)}`);
        } catch (error) {
          console.error(`❌ Error al eliminar la imagen ${path.basename(filePath)}:`, error.message);
        }
      });
    }
  } else {
    console.log('⚠️ No se editaron imágenes.');
  }
}

mostrarMenu();
