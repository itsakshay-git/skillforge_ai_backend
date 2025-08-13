const Joi = require('joi');

const summarizerSchema = Joi.object({
  tone: Joi.string()
    .valid('neutral', 'formal', 'simplified', 'friendly', 'professional', 'casual')
    .default('neutral')
    .messages({
      'any.only': 'Tone must be one of: neutral, formal, simplified, friendly, professional, casual.'
    })
});

module.exports = { summarizerSchema };
