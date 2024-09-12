# README - Branch `feature/subir-imagenes-easybroker`

## Descripción

Esta branch está dedicada a la implementación del flujo completo de manejo de imágenes para EasyBroker. Incluye la descarga de imágenes desde la API de EasyBroker, su edición y posterior subida a Cloudinary y EasyBroker. El programa también permite al usuario decidir si desea eliminar las imágenes de Cloudinary tras una subida exitosa a EasyBroker.

### Flujo Principal del Programa:

1. **Descarga de Imágenes**: Permite al usuario descargar las imágenes de una propiedad en EasyBroker a través de su ID.
   
2. **Edición de Imágenes**: Se ofrecen opciones para redimensionar las imágenes, aplicar mejoras automáticas de brillo y contraste, y superponer una marca de agua.
   
3. **Subida a Cloudinary y EasyBroker**: Las imágenes editadas se suben primero a Cloudinary para obtener las URLs necesarias y luego se actualizan en EasyBroker utilizando esas URLs.
   
4. **Opción para Eliminar Imágenes de Cloudinary**: Tras la subida exitosa de imágenes a EasyBroker, el programa pregunta al usuario si desea eliminar las imágenes de Cloudinary.

## Estructura del Proyecto


## Detalles Técnicos

### Servicios

- **downloadImages.js**: Se conecta con la API de EasyBroker y descarga las imágenes de la propiedad indicada por el usuario.
  
- **editImages.js**: Aplica transformaciones a las imágenes, incluyendo redimensionamiento, ajuste de brillo/contraste y la aplicación de una marca de agua.
  
- **uploadEditedImages.js**: Se encarga de actualizar las imágenes de una propiedad en EasyBroker utilizando las URLs de las imágenes subidas a Cloudinary.

- **uploadToCloudinary.js**: Sube las imágenes editadas a Cloudinary y, opcionalmente, elimina las imágenes tras su subida exitosa a EasyBroker si el usuario lo decide.

### Microservicios

- **Descargar imágenes**: Permite al usuario descargar imágenes de EasyBroker según el ID de la propiedad.
  
- **Editar imágenes**: Ofrece la opción de aplicar transformaciones (redimensionar, aplicar brillo/contraste, añadir marca de agua) a las imágenes descargadas.
  
- **Subir imágenes a Cloudinary y EasyBroker**: Sube las imágenes a Cloudinary para generar URLs y las utiliza para actualizar la propiedad en EasyBroker.
  
- **Eliminar imágenes de Cloudinary**: (Opcional, según la elección del usuario) Elimina las imágenes subidas a Cloudinary tras la confirmación del usuario.

### Funcionalidades Futuras

1. **Automatización Completa**: Ejecutar todo el proceso de descarga, edición y subida de manera automática, sin necesidad de intervención manual.

2. **Soporte para Nuevos Formatos**: Soporte para más formatos de imagen y más opciones de edición.

## Configuración

1. Clona el repositorio a tu máquina local.
2. Instala las dependencias con `npm install`.
3. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes claves:

CLOUDINARY_CLOUD_NAME=<tu_nombre_cloudinary>
CLOUDINARY_API_KEY=<tu_api_key_cloudinary>
CLOUDINARY_API_SECRET=<tu_api_secret_cloudinary>
EASYBROKER_API_KEY=<tu_api_key_easybroker>

## Uso

Para ejecutar el asistente, simplemente ejecuta el siguiente comando:

```bash
node index.js