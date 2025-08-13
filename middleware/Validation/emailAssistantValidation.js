const Joi = require('joi');

const emailAssistSchema = Joi.object({
  mode: Joi.string()
    .valid('write', 'reply', 'summarize')
    .required()
    .messages({
      'any.only': 'Mode must be one of: write, reply, summarize.',
      'string.empty': 'Mode is required.'
    }),

  input: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Input is required.'
    }),

  tone: Joi.string()
    .valid('professional', 'friendly', 'formal', 'casual', 'enthusiastic', 'empathetic', 'assertive', 'diplomatic')
    .default('professional')
    .messages({
      'any.only': 'Tone must be one of: professional, friendly, formal, casual, enthusiastic, empathetic, assertive, diplomatic.'
    }),

  recipient: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Recipient cannot exceed 255 characters.'
    }),

  context: Joi.string()
    .allow('')
    .max(2000)
    .messages({
      'string.max': 'Context cannot exceed 2000 characters.'
    })
});

module.exports = { emailAssistSchema };
