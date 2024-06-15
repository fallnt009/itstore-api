const Joi = require('joi');

const validate = require('./validate');

const createAddressSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    'any.required': 'full name is required',
    'string.empty': 'full name is required',
    'string.base': 'full name must a character',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.empty': 'phone number is required',
      'string.pattern.base': 'phone number must be exactly 10 digits',
    }),
  addressLine1: Joi.string().required().messages({
    'any.required': 'address line 1 is required',
    'string.empty': 'address line 1 is required',
  }),
  addressLine2: Joi.string().allow('').messages({
    'string.base': 'address line must a character',
  }),
  province: Joi.string().trim().required().messages({
    'any.required': 'province is required',
    'string.empty': 'province is required',
    'string.base': 'province must a character',
  }),
  postalCode: Joi.string()
    .pattern(/^[0-9]{5}$/)
    .messages({
      'string.empty': 'postal code is required',
      'string.pattern.base': 'postal code must be exactly 5 digits',
    }),
});

exports.validateAddress = validate(createAddressSchema);
