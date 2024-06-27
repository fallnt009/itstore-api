const {Payment} = require('../../models');

const factory = require('../utils/handlerFactory');
const {validatePayment} = require('../../validators/checkout-validate');

exports.getPayment = factory.getAll(Payment);
exports.createPayment = factory.createOne(Payment, validatePayment);
exports.updatePayment = factory.updateOne(Payment, validatePayment);
exports.deletePayment = factory.deleteOne(Payment);
