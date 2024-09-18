const Joi = require('joi');

// Esquema para o payload com mensagem de texto do WhatsApp
const whatsappTextPayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  text: Joi.object({
    body: Joi.string().min(0).optional() // 'body' pode ser vazio
  }).optional(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
});

// Esquema para o payload com imagem do WhatsApp
const whatsappImagePayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  image: Joi.object({
    uri: Joi.string().uri().required(),
    caption: Joi.string().optional() // 'caption' é opcional
  }).required(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
});

// Esquema para o payload que pode conter tanto texto quanto imagem
const whatsappTextImagePayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  text: Joi.object({
    body: Joi.string().min(0).optional() // 'body' pode ser vazio
  }).optional(),
  image: Joi.object({
    uri: Joi.string().uri().required(),
    caption: Joi.string().optional()
  }).required(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
});

// Esquema para garantir que o 'body' seja vazio se a imagem estiver presente
const whatsappPayloadSchema = Joi.object({
  messaging_product: Joi.string().valid('whatsapp').required(),
  to: Joi.string().required(),
  text: Joi.object({
    body: Joi.string().min(0).optional()
  }).optional(),
  image: Joi.object({
    uri: Joi.string().uri().optional(),
    caption: Joi.string().optional()
  }).optional(),
  messageID: Joi.string().optional(),
  token: Joi.string().required(),
  contract: Joi.string().required()
})
  .custom((value, helpers) => {
    if (value.image && value.text && value.text.body) {
      return helpers.error('any.custom');
    }
    return value;
  }, 'Imagem e texto');

function validatePayload(payload) {
  let validationSchema;

  // Verificar se há tanto texto quanto imagem no payload
  if (payload.messaging_product === 'whatsapp' && payload.text && payload.image) {
    validationSchema = whatsappTextImagePayloadSchema; // Valida o payload com texto e imagem
  } else if (payload.messaging_product === 'whatsapp' && payload.text) {
    validationSchema = whatsappTextPayloadSchema; // Valida o payload com texto
  } else if (payload.messaging_product === 'whatsapp' && payload.image) {
    validationSchema = whatsappImagePayloadSchema; // Valida o payload com imagem
  } else {
    return { error: `Unsupported Media Type: ${payload.messaging_product || payload.type}`, status: 415 };
  }

  const { error } = validationSchema.validate(payload, { abortEarly: false });
  
  if (error) {
    return { error: error.message, status: 400 };
  }

  // Validação personalizada
  const customError = whatsappPayloadSchema.validate(payload, { abortEarly: false }).error;
  if (customError) {
    return { error: 'Campo "body" não deve ser preenchido se a imagem estiver presente', status: 400 };
  }

  return { valid: true };
}

module.exports = {
  validatePayload
};
