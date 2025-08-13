const Joi = require('joi');

const userHistoryQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  offset: Joi.number().integer().min(0).default(0)
    .messages({
      'number.base': 'Offset must be a number',
      'number.min': 'Offset must be at least 0'
    })
});

const analyticsParamsSchema = Joi.object({
  routeType: Joi.string().valid(
    'resume_optimizer',
    'code_explainer',
    'summarizer',
    'email_assistant',
    'generate_quiz'
  ).required()
    .messages({
      'any.only': 'Invalid route type'
    })
});

const deleteHistoryParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'History ID must be a number',
      'number.positive': 'History ID must be positive',
      'any.required': 'History ID is required'
    })
});

module.exports = {
  userHistoryQuerySchema,
  analyticsParamsSchema,
  deleteHistoryParamsSchema
};
