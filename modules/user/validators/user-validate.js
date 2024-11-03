const Joi = require('joi');

const validate = require('../../../utils/validate');

const profileSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    'any.required': 'first name is required',
    'string.empty': 'first name is required',
    'string.base': 'first name must a character',
  }),
  lastName: Joi.string().trim().required().messages({
    'any.required': 'last name is required',
    'string.empty': 'last name is required',
    'string.base': 'last name must a character',
  }),
  email: Joi.string().email({tlds: false}).messages({
    'string.empty': 'email is required',
    'string.email': 'Invalid email format',
  }),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.empty': 'mobile is required',
      'string.pattern.base': 'phone number must be exactly 10 digits',
    }),
});

exports.validateProfile = validate(profileSchema);
