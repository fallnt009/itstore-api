const Joi = require('joi');

const validate = require('../../../utils/validate');

const cartSchema = Joi.object({
  productId: Joi.number().required().messages({
    'any.required': 'Please Select Product to add to your cart.',
    'number.base': 'Invalid ID form',
  }),
  qty: Joi.number().integer().min(1).required().messages({
    'any.required': 'Please enter the quantity you want to add.',
    'number.base': 'Invalid quantity. Please enter a number.',
    'number.integer': 'Quantity must be a whole number.',
    'number.min': 'Minimum quantity allowed is 1.',
  }),
});

exports.validateCart = validate(cartSchema);
