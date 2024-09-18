const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const convertImage = async (url, newExtension) => {
  try {

    const response = await axios({ url, responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);


    const imagesDir = path.join(__dirname, '../images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir); 
    }

    const fileName = `${crypto.randomBytes(16).toString('hex')}.${newExtension}`;
    const filePath = path.join(imagesDir, fileName);

 
    await sharp(imageBuffer).toFile(filePath);



    const fileUrl = `https://api-parse-lastro-a1f99c4fffbc.herokuapp.com/api/v1/api-parse-message/image/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error('Erro ao converter imagem:', error);
    throw error;
  }
}

module.exports = {
  convertImage
}
