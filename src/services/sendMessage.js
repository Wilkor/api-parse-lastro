const axios = require('axios');
const { uuid } = require('../utils')

const sendMessageToBlip = async (text, contract, key, from) => {

    const url = ` https://${contract}.http.msging.net/messages`;

    const result = await axios.post(url, {
        "id": uuid(),
        "to": from,
        "type": "text/plain",
        "content": text
    }, {
        headers: {
            'Authorization': key
        }
    })
    return result;
}


const sendMessageToBlipImage = async (image, contract, key, from) => {

    const { caption, uri } = image;

    const url = ` https://${contract}.http.msging.net/messages`;

    const result = await axios.post(url, {
        "id": uuid(),
        "to": from,
        "type": "application/vnd.lime.web-link+json",
        "content": {
            "uri": uri,
            "target": "self",
            "text": caption
        }
    }, {
        headers: {
            'Authorization': key
        }
    })
    return result;
}


const sendMessageToLastro = async (body, { url, token }) => {

    const result = await axios.post(url, body, {
        headers: {
            'Authorization': token
        }
    })

    return result;


}


module.exports = {
    sendMessageToBlip,
    sendMessageToLastro,
    sendMessageToBlipImage
}