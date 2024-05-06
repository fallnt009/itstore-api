const Joi = require('joi');

const validate = require('./validate');

const createMainCategory = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'title is required',
  }),
});

exports.validateMainCategory = validate(createMainCategory);

const createSubCategory = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'title is required',
  }),
});

exports.validateSubCategory = validate(createSubCategory);
