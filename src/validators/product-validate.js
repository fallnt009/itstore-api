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

const createSpecItem = Joi.object({
  specName: Joi.string().required().messages({
    'string.empty': 'spec name is required',
  }),
});

exports.validateSpecItem = validate(createSpecItem);

const createProductSpec = Joi.object({
  description: Joi.string().trim().required().messages({
    'string.empty': 'description is required',
  }),
});

exports.validateProductSpec = validate(createProductSpec);
