const Joi = require('joi');

const validate = require('./validate');

const serviceSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'name is required',
    'string.empty': 'name is required',
    'string.base': 'name must a character',
  }),
  price: Joi.string().required().messages({
    'any.required': 'price is required',
    'string.empty': 'price is required',
  }),
  description: Joi.string().required().messages({
    'any.required': 'description is required',
    'string.empty': 'description is required',
  }),
});
const paymentSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'name is required',
    'string.empty': 'name is required',
    'string.base': 'name must a character',
  }),
  description: Joi.string().required().messages({
    'any.required': 'description is required',
    'string.empty': 'description is required',
  }),
});

exports.validateService = validate(serviceSchema);
exports.validatePayment = validate(paymentSchema);
