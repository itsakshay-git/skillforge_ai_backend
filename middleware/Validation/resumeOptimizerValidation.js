const Joi = require('joi');

const resumeOptimizerSchema = Joi.object({
  jobText: Joi.string()
    .allow('')
    .max(5000)
    .messages({
      'string.max': 'Job description must not exceed 5000 characters.'
    })
});

module.exports = { resumeOptimizerSchema };
