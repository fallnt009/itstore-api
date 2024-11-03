const Joi = require('joi');
const validate = require('../../../utils/validate');

const subCategorySchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'title is required',
  }),
});

exports.validateSubCategory = validate(subCategorySchema);
