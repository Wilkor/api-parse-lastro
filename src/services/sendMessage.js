const axios = require('axios');
const { uuid } = require('../utils')
const { convertImage } = require('./changeExtensionImage')

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

    const newURL = await convertImage(uri, 'jpg');

    if (newURL) {
        const url = ` https://${contract}.http.msging.net/messages`;

        const result = await axios.post(url,
            {
                "type": "application/vnd.lime.media-link+json",
                "content": {
                    "type": "image/jpg",
                    "uri": newURL,
                    "title": caption
                },
                "id": uuid(),
                "to": from,

            }, {
            headers: {
                'Authorization': key
            }
        })
        return result;
    }

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