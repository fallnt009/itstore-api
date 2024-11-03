const Joi = require('joi');
const validate = require('../../../utils/validate');

const brandSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'title is required',
  }),
});

exports.validateBrand = validate(brandSchema);
