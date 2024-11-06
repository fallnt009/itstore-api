const Joi = require('joi');

const validate = require('../../../utils/validate');

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

exports.validatePayment = validate(paymentSchema);
