const Joi = require('joi');
const validate = require('../../../utils/validate');

const productSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'title is required',
  }),
  price: Joi.string().trim().required().messages({
    'string.empty': 'price is required',
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'description is required',
  }),
  isActive: Joi.boolean().default(true),
  qtyInStock: Joi.number().required().messages({
    'string.empty': 'quantity is required',
  }),
});

exports.validateProduct = validate(productSchema);
