const Joi = require('joi');

const validate = require('./validate');

const createAddress = Joi.object({
  unitNumber: Joi.string().required().messages({
    'string.empty': 'unit number is required',
  }),
  streetNumber: Joi.string(),
  addressLine1: Joi.string().required().messages({
    'string.empty': 'address line is required',
  }),
  addressLine2: Joi.string(),
  city: Joi.string().required().messages({
    'string.empty': 'city is required',
  }),
  region: Joi.string().required().messages({
    'string.empty': 'region is required',
  }),
  postalCode: Joi.string().required().messages({
    'string.empty': 'postal code is required',
  }),
  country: Joi.string().required().messages({
    'string.empty': 'country is required',
  }),
});

exports.validateAddress = validate(createAddress);
