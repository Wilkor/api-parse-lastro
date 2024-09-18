const express = require('express');
const routes = express.Router();
const validationMiddleware = require('../../../middleware');
const message = require('../../../controller');

routes.post('/receive-messages-blip', validationMiddleware, message.receive);
routes.post('/send-message', validationMiddleware, message.receiveLastro);
routes.post('/config-lastro', message.configLastro);
routes.get('/config-lastro/:id', message.getConfigLastro);
routes.get('/image/:filename', message.ImageImob)


module.exports = routes;