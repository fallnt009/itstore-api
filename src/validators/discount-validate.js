const Joi = require('joi');

const validate = require('./validate');

const createDiscountSchema = Joi.object({
  type: Joi.string().required().message({
    'string.empty': 'type is required',
  }),
  amount: Joi.string().trim().required().message({
    'string.empty': 'amount is required',
  }),
  startDate: Joi.date().message({
    'date.empty': 'start date is required',
  }),
  endDate: Joi.date().message({
    'date.empty': 'end date is required',
  }),
});

exports.validateDiscount = validate(createDiscountSchema);
