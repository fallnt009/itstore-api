const Joi = require('joi');

const validate = require('./validate');

const createProductSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'title is required',
  }),
  price: Joi.string().trim().required().messages({
    'string.empty': 'price is required',
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'description is required',
  }),
  isActive: Joi.boolean().required(),
  onPromotion: Joi.boolean().required(),
});

exports.validateProduct = validate(createProductSchema);
