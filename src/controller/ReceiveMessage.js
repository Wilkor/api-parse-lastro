const axios = require('axios');
const MessageDTO = require('../dtos/MessageDTO');
const Services = require('../services/sendMessage')
const NodeCache = require('node-cache');
const configLastroDb = require('../models/v1/config')
const { ObjectId } = require('mongodb');
const messageCache = new NodeCache({ stdTTL: 86400 });

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

    const { to, text: { body }, contract, token, image } = req.body;


    try {

        const resultApp = await configLastroDb.findById(ObjectId(auth));

        if (!resultApp) {

            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (image) {

            await Services.sendMessageToBlipImage(image, contract, token, to);
            return res.status(200).json({ data: req.body });

        }
        await Services.sendMessageToBlip(body, contract, token, to);

        res.status(200).json({ data: req.body })
    } catch (e) {

        console.log(e)
        return res.status(401).json({ message: 'Unauthorized', error: e})
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

module.exports = {
    receive,
    receiveLastro,
    configLastro,
    getConfigLastro
}