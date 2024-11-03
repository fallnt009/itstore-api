const Joi = require('joi');
const validate = require('../../../utils/validate');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    'any.required': 'first name is required',
    'string.empty': 'first name is required',
    'string.base': 'first name must a string',
  }),
  lastName: Joi.string().trim().required().messages({
    'any.required': 'last name is required',
    'string.empty': 'last name is required',
    'string.base': 'last name must a string',
  }),
  email: Joi.string().email({tlds: false}).messages({
    'string.empty': 'email is required',
    'string.email': 'Invalid email format',
  }),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'phone number must be exactly 10 digits',
    }),
  password: Joi.string().alphanum().min(8).required().trim().messages({
    'string.empty': 'password is required',
    'string.alphanum': 'password must contain a number or alphabet',
    'string.min': 'password must have at least 8 characters',
  }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .trim()
    .messages({
      'string.empty': 'confirm password must not empty',
      'any.only': 'confirm password did not match',
    }),
});

exports.validateRegister = validate(registerSchema);

const loginSchema = Joi.object({
  email: Joi.string().email({tlds: false}).required().messages({
    'string.empty': 'email is required',
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'password is required',
    'string.min': 'password must have at least 8 characters',
  }),
});

exports.validateLogin = validate(loginSchema);
