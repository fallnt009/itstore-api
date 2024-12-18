const Joi = require('joi');
const validate = require('../../../utils/validate');

const productSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'title is required',
  }),
  price: Joi.number().precision(2).positive().required().messages({
    'number.base': 'price must be a number',
    'number.positive': 'price must be a positive value',
    'any.required': 'price is required',
  }),
  description: Joi.string().trim().allow(null, '').optional().messages({
    'string.base': 'Description must be a character',
  }),
  isActive: Joi.boolean().default(true),
  qtyInStock: Joi.number().integer().min(0).required().messages({
    'number.base': 'quantity must be a number',
    'number.integer': 'quantity must be an integer',
    'number.min': 'quantity must be at least 0',
    'any.required': 'quantity is required',
  }),
});

exports.validateProduct = validate(productSchema);
