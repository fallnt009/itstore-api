const {Brand} = require('../../models');
const {validateProductBrand} = require('../../validators/product-validate');
const factory = require('../utils/handlerFactory');
const createError = require('../../utils/create-error');

exports.createBrand = async (req, res, next) => {
  try {
    const value = validateProductBrand({
      title: req.body.title,
    });

    const result = await Brand.create(value);
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};
exports.updateBrand = async (req, res, next) => {
  try {
    const value = validateProductBrand({
      title: req.body.title,
    });

    const findId = await Brand.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!findId) {
      createError('ID not found', 404);
    }

    await Brand.update(value, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({message: 'update success'});
  } catch (err) {
    next(err);
  }
};
exports.getAllBrand = factory.getAll(Brand);
exports.getOneBrand = factory.getOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
