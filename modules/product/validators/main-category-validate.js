const Joi = require('joi');
const validate = require('../../../utils/validate');

const mainCategorySchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'title is required',
  }),
});

exports.validateMainCategory = validate(mainCategorySchema);
