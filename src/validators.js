const Joi = require('joi');


const textPayloadSchema = Joi.object({
  type: Joi.string().valid('text/plain').required(),
  content: Joi.string().required(),
  id: Joi.string().optional(),
  from: Joi.string().required(),
  to: Joi.string().required(),
  metadata: Joi.object({
    traceparent: Joi.string().required(),
    '#uniqueId': Joi.string().guid().optional(),
    '#date_processed': Joi.string().optional(),
    '#tunnel.originator': Joi.string().required(),
    '#tunnel.originalFrom': Joi.string().optional(),
    '#tunnel.originalTo': Joi.string().optional(),
    '#tunnel.owner': Joi.string().optional(),
    '#wa.timestamp': Joi.string().optional(),
    date_created: Joi.string().optional()
  }).required()
});

const mediaLinkPayloadSchema = Joi.object({
  type: Joi.string().valid('application/vnd.lime.media-link+json').required(),
  content: Joi.object({
    type: Joi.string().required(),
    size: Joi.number().required(),
    uri: Joi.string().uri().required(),
    title: Joi.string().allow('').required()
  }).required(),
  id: Joi.string().optional(),
  from: Joi.string().required(),
  to: Joi.string().required(),
  metadata: Joi.object({
    '#blipChat.voice': Joi.string().valid('True').optional(),
    traceparent: Joi.string().required(),
    '#uniqueId': Joi.string().guid().optional(),
    '#tunnel.originator': Joi.string().required(),
    '#date_processed': Joi.string().optional(),
    '#tunnel.originalFrom': Joi.string().optional(),
    '#tunnel.originalTo': Joi.string().optional(),
    '#tunnel.owner': Joi.string().optional(),
    '#wa.timestamp': Joi.string().optional(),
    date_created: Joi.string().optional()
  }).required()
});


const whatsappTextPayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  text: Joi.object({
    body: Joi.string().optional()
  }).optional(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
});

const whatsappImagePayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  text: Joi.object({
    body: Joi.string().min(0).optional()
  }).optional(),
  image: Joi.object({
    link: Joi.string().uri().required()
  }).optional(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
});


const whatsappImageCaptionPayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  text: Joi.object({
    body: Joi.string().min(0).optional()
  }).optional(),
  image: Joi.object({
    uri: Joi.string().uri().required(), 
    caption: Joi.string().optional()
  }).optional(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
});


function validatePayload(payload) {
  let validationSchema;

  if (payload.messaging_product === 'whatsapp' && payload.text && !payload.image) {
    validationSchema = whatsappTextPayloadSchema;
  } else if (payload.messaging_product === 'whatsapp' && payload.image) {

    console.log('aqui')
    // Valida payload com imagem e legenda
    validationSchema = whatsappImageCaptionPayloadSchema;
  } else if (payload.messaging_product === 'whatsapp' && payload.image) {
    console.log('aqui1')
    validationSchema = whatsappImagePayloadSchema;
  } else if (payload.type === 'text/plain') {
    validationSchema = textPayloadSchema;
  } else if (payload.type === 'application/vnd.lime.media-link+json') {
    validationSchema = mediaLinkPayloadSchema;
  } else {
    return { error: `Unsupported Media Type: ${payload.messaging_product || payload.type}`, status: 415 };
  }
  const { error } = validationSchema.validate(payload, { abortEarly: false });
  
  if (error) {
    return { error: error.message, status: 400 };
  }
  return { valid: true };
}

module.exports = {
  validatePayload
};
