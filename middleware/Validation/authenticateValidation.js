const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .alphanum()
    .optional(),
  email: Joi.string()
    .email()
    .optional()
}).or('username', 'email') // At least one must be provided
.messages({
  'object.missing': 'You must provide either username or email to update.'
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.empty': 'Current password is required.',
      'string.min': 'Current password must be at least 8 characters.'
    }),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.empty': 'New password is required.',
      'string.min': 'New password must be at least 8 characters.'
    })
});


module.exports = { registerSchema, loginSchema, updateProfileSchema,
  updatePasswordSchema };
