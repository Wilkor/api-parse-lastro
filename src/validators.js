const Joi = require('joi');

// Esquema para o primeiro tipo de payload (texto simples)
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
    '#tunnel.originator':Joi.string().required(),
    '#tunnel.originalFrom':Joi.string().optional(),
    '#tunnel.originalTo':Joi.string().optional(),
    '#tunnel.owner':Joi.string().optional(),
    '#wa.timestamp':Joi.string().optional(),
    date_created: Joi.string().optional()
  }).required()
});

// Esquema para os payloads com media-link
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
    '#tunnel.originator':Joi.string().required(),
    '#uniqueId': Joi.string().guid().optional(),
    '#date_processed': Joi.string().optional(),
    '#tunnel.originalFrom':Joi.string().optional(),
    '#tunnel.originalTo':Joi.string().optional(),
    '#tunnel.owner':Joi.string().optional(),
    '#wa.timestamp':Joi.string().optional(),
    date_created: Joi.string().optional()
  }).required()
});

// Esquema para o payload com mensagem de texto do WhatsApp
const whatsappTextPayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(), // Essa propriedade é obrigatória e deve ter o valor 'whatsapp'.
  to: Joi.string().required(), // Essa propriedade é obrigatória.
  text: Joi.object({
    body: Joi.string().required() // O campo 'body' dentro de 'text' é obrigatório.
  }).required(),
  messageID: Joi.string().optional(), // 'messageID' é opcional, pode estar presente ou ausente.
  token: Joi.string().required(), // Essa propriedade é obrigatória.
  contract: Joi.string().required() // Essa propriedade é obrigatória.
});

// Esquema para o payload com imagem do WhatsApp
const whatsappImagePayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  image: Joi.object({
    link: Joi.string().uri().required()
  }).required(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
});

// Função para validar os payloads
function validatePayload(payload) {
  let validationSchema;

   console.log("antes de tratar", payload)

  if (payload.messaging_product === 'whatsapp' && payload.text) {
    validationSchema = whatsappTextPayloadSchema;
  } else if (payload.messaging_product === 'whatsapp' && payload.image) {
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
