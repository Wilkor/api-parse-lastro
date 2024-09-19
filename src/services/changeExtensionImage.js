const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const convertImage = async (url, newExtension) => {
  try {
    // Fazendo a requisição da imagem
    const response = await axios({ url, responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Criando o diretório para armazenar imagens, se não existir
    const imagesDir = path.join(__dirname, '../images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir); 
    }

    // Gerando um nome de arquivo aleatório com a nova extensão
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${newExtension}`;
    const filePath = path.join(imagesDir, fileName);

    // Convertendo e salvando a imagem
    await sharp(imageBuffer).toFile(filePath);

    // Gerando a URL do arquivo
    const fileUrl = `https://api-parse-lastro-a1f99c4fffbc.herokuapp.com/api/v1/api-parse-message/image/${fileName}`;
    return fileUrl;

  } catch (error) {
    // Validando o status do erro
    if (error.response) {
      const { status } = error.response;
      if (status === 400 || status === 404) {
        return false;
      }
    }

    // Para outros erros, loga e lança a exceção
    console.error('Erro ao converter imagem:', error);
    throw error;
  }
}

module.exports = {
  convertImage
}
