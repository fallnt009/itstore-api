const Joi = require('joi');
const validate = require('../../../utils/validate');

const specItemSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'name is required',
  }),
});

exports.validateSpecItem = validate(specItemSchema);

const specProductSchema = Joi.object({
  text: Joi.string().trim().required().messages({
    'any.required': 'text is required',
    'string.empty': 'text is required',
    'string.base': 'text must a character',
  }),
});

exports.validateSpecProduct = validate(specProductSchema);

// const productSpecSchema = Joi.object({
//   description: Joi.string().trim().required().messages({
//     'string.empty': 'description is required',
//   }),
// });

// exports.validateProductSpec = validate(productSpecSchema);
