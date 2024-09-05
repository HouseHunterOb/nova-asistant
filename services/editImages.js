// services/editImages.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const watermarkPath = '/Users/diegojonguitud/Downloads/Scripts/JS/nova-assistant/img/watermark.png';

async function editImages(imagePaths, outputFolder = '/Users/diegojonguitud/Desktop/dtools/Fotos/png') {
  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const watermark = await sharp(watermarkPath).resize(200).toBuffer(); // Redimensionar la marca de agua si es necesario

    const editedImagePaths = await Promise.all(imagePaths.map(async (imagePath, index) => {
      const outputImagePath = path.join(outputFolder, `edited_image_${index}.png`);

      let image = sharp(imagePath)
        .resize(1200, 799, {
          fit: 'cover',
          position: sharp.gravity.center,
          kernel: sharp.kernel.cubic
        })
        .sharpen()  
        .blur(0.3)  
        .modulate({ brightness: 1.05 });

      const imageBuffer = await image.toBuffer();

      // Aplicar la marca de agua en la posición específica
      await sharp(imageBuffer)
        .composite([{ input: watermark, left: 893, top: 58 }]) // Posicionar la marca de agua en x=893 px, y=58 px
        .png()
        .toFile(outputImagePath);

      console.log(`✅ Imagen editada con marca de agua y convertida a PNG: ${outputImagePath}`);
      return outputImagePath;
    }));

    return editedImagePaths;
  } catch (error) {
    console.error('❌ Error al editar imágenes:', error.message);
    return [];
  }
}

module.exports = editImages;
