const axios = require('axios');
const path = require('path');
const MessageDTO = require('../dtos/MessageDTO');
const Services = require('../services/sendMessage')
const NodeCache = require('node-cache');
const configLastroDb = require('../models/v1/config')
const { ObjectId } = require('mongodb');
const messageCache = new NodeCache({ stdTTL: 86400 });
const fs = require('fs');

const receive = async (req, res) => {

    const body = req.body;
    const { token, contract, contactname, phonenumber, auth } = req.headers;
    body.contract = contract
    body.token = token
    body.contactName = contactname || ''
    body.phoneNumber = phonenumber

    try {

        const resultApp = await configLastroDb.findById(ObjectId(auth));
        const messageDTO = new MessageDTO(body);
        const response = messageDTO.toResponseFormat();

        const resultCallLastro = await Services.sendMessageToLastro(response, resultApp);

        res.status(200).json({ data: resultCallLastro.data });

    } catch (e) {

        return res.status(401).json({ message: 'Unauthorized' })
    }
}

const receiveLastro = async (req, res) => {
    const auth = req.headers['authorization'];
    const { to, text, contract, token, image } = req.body;

    // Verifica se o campo `text` existe e se possui a propriedade `body`
    const body = text ? text.body : undefined;

    try {
        const resultApp = await configLastroDb.findById(ObjectId(auth));

        if (!resultApp) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (image) {
            await Services.sendMessageToBlipImage(image, contract, token, to);
            return res.status(200).json({ data: req.body });
        }

        // Verifica se `body` está definido antes de enviar a mensagem
        if (body) {
            await Services.sendMessageToBlip(body, contract, token, to);
        } else {
            // Caso `body` não esteja presente, pode retornar um erro ou tratar de acordo com a lógica do seu sistema
            return res.status(400).json({ message: 'Missing message body' });
        }

        res.status(200).json({ data: req.body });
    } catch (e) {
        console.log(e);
        return res.status(401).json({ message: 'Unauthorized', error: e });
    }
}

const configLastro = async (req, res) => {

    const body = req.body;

    try {

        const resultConfig = await configLastroDb.create(body);
        res.status(200).json(resultConfig);

    } catch (e) {

        res.status(400).json({ error: e })

    }


}


const getConfigLastro = async (req, res) => {

    const app = req.params.id;

    try {

        const resultConfig = await configLastroDb.findOne({ app });
        res.status(200).json(resultConfig);

    } catch (e) {

        res.status(400).json({ error: e })

    }


}

const ImageImob = async (req, res) => {

        const { filename } = req.params;

        const filePath = path.join(__dirname, '../images', filename);

        fs.exists(filePath, (exists) => {
          if (!exists) {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
          }
 
          res.sendFile(filePath, (err) => {
            if (err) {
              console.error('Erro ao enviar o arquivo:', err);
              return res.status(500).json({ error: 'Erro ao enviar o arquivo' });
            }
    
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Erro ao deletar o arquivo:', err);
              } else {
                console.log(`Arquivo ${filename} deletado com sucesso`);
              }
            });
          });
        });
};

module.exports = {
    receive,
    receiveLastro,
    configLastro,
    getConfigLastro,
    ImageImob
}