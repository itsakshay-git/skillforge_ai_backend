const Joi = require('joi');

const generateQuizSchema = Joi.object({
  language: Joi.string().trim().optional().default('JavaScript'),
  difficulty: Joi.string().trim().optional().default('beginner'),
  type: Joi.string().valid('mcq', 'interview').optional().default('mcq'),
  questionCount: Joi.number().integer().min(1).max(50).optional().default(5),
  topic: Joi.string().trim().required().messages({
    'any.required': 'Topic is required.',
    'string.empty': 'Topic cannot be empty.'
  })
});

module.exports = { generateQuizSchema };
