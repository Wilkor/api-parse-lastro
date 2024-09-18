// validationMiddleware.js
const { validatePayload } = require('../validators');
const logLais = require('../Models/v1/Log')

async function validationMiddleware(req, res, next) {

  const { error, status } = validatePayload(req.body);

  if (error)
    await logLais.create({ status, error: JSON.stringify(error), path: req.path, payload: JSON.stringify(req.body) })

  if (error) {
    return res.status(status).json({ fields: error });
  }
  next();
}

module.exports = validationMiddleware;