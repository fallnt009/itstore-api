const Joi = require('joi');

const validate = require('./validate');

const createDiscountSchema = Joi.object({
  type: Joi.string().required().messages({
    'string.empty': 'type is required',
  }),
  amount: Joi.string().trim().required().messages({
    'string.empty': 'amount is required',
  }),
  startDate: Joi.date().messages({
    'date.empty': 'start date is required',
  }),
  endDate: Joi.date().messages({
    'date.empty': 'end date is required',
  }),
});

const productDiscountSchema = Joi.object({
  discountId: Joi.number().integer().positive().required().messages({
    'number.base': 'discountId must be a number',
    'number.integer': 'discountId must be an integer',
    'number.positive': 'discountId must be a positive number',
    'any.required': 'discountId is a required field',
  }),
  productId: Joi.number().integer().positive().required().messages({
    'number.base': 'productId must be a number',
    'number.integer': 'productId must be an integer',
    'number.positive': 'productId must be a positive number',
    'any.required': 'productId is a required field',
  }),
});

exports.validateDiscount = validate(createDiscountSchema);

exports.validateProductDiscount = validate(productDiscountSchema);
