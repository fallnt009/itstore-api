const {Service} = require('../../models');

const factory = require('../utils/handlerFactory');

const {validateService} = require('../../validators/checkout-validate');

exports.getService = factory.getAll(Service);
exports.createService = factory.createOne(Service, validateService);
exports.updateService = factory.updateOne(Service, validateService);
exports.deleteService = factory.deleteOne(Service);
