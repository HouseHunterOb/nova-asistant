const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const watermarkPath = '/Users/diegojonguitud/Downloads/Scripts/JS/nova-assistant/img/watermark.png';

async function editImages(imagePaths, outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png') {
  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    // Cargar la marca de agua
    const watermark = await sharp(watermarkPath).resize(200).toBuffer();

    const editedImagePaths = await Promise.all(imagePaths.map(async (imagePath, index) => {
      const outputImagePath = path.join(outputFolder, `edited_image_${index}.png`);

      // Leer la imagen usando Sharp
      let image = sharp(imagePath);

      // Aplicar corrección de inclinación manual (ajustar grados de rotación según sea necesario)
      image = image.rotate();  // Rotar automáticamente basado en los metadatos de la imagen (si están presentes)

      // Aplicar reducción de ruido (desenfoque leve)
      image = image.blur(0.3);

      // Ajuste automático de brillo y contraste
      image = image.modulate({ brightness: 1.1, contrast: 1.1 });

      // Redimensionar la imagen a 1200x799 píxeles
      const imageBuffer = await image
        .resize(1200, 799, {
          fit: 'cover',
          position: sharp.gravity.center,
        })
        .toBuffer();

      // Aplicar la marca de agua en la posición x=893, y=58
      await sharp(imageBuffer)
        .composite([{ input: watermark, left: 893, top: 58 }])
        .png()
        .toFile(outputImagePath);

      console.log(`✅ Imagen editada con marca de agua y guardada en: ${outputImagePath}`);
      return outputImagePath;
    }));

    return editedImagePaths;
  } catch (error) {
    console.error('❌ Error al editar imágenes:', error.message);
    return [];
  }
}

module.exports = editImages;
