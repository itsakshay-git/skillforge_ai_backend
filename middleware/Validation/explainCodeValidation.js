const Joi = require('joi');

const explainCodeSchema = Joi.object({
  code: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Code is required.',
      'any.required': 'Code is required.'
    }),

  language: Joi.string()
    .default('JavaScript')
    .max(50)
    .messages({
      'string.max': 'Language name cannot exceed 50 characters.'
    }),

  tone: Joi.string()
    .valid('technical', 'simple', 'beginner-friendly', 'detailed', 'concise', 'academic', 'casual')
    .default('technical')
    .messages({
      'any.only': 'Tone must be one of: technical, simple, beginner-friendly, detailed, concise, academic, casual.'
    })
});

module.exports = { explainCodeSchema };
