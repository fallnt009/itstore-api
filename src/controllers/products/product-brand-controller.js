const {ProductBrand} = require('../../models');
const createError = require('../../utils/create-error');

exports.getAllProductBrand = async (req, res, next) => {
  try {
    const brand = await ProductBrand.findAll();
    res.status(200).json({amount: brand.length, result: brand});
  } catch (err) {
    next(err);
  }
};
exports.createProductBrand = async (req, res, next) => {
  try {
    const value = req.body;
    const brand = await ProductBrand.create(value);

    res.status(200).json({
      message: 'create brand success',
      result: brand,
    });
  } catch (err) {
    next(err);
  }
};
exports.getProductBrandById = async (req, res, next) => {
  try {
    const brand = await ProductBrand.findOne({
      where: {id: req.params.productBrandId},
    });

    if (!brand) {
      createError('Result not found', 400);
    }
    res.status(200).json({result: brand});
  } catch (err) {
    next(err);
  }
};
exports.updateProductBrand = async (req, res, next) => {
  try {
    const productBrandId = req.params.productBrandId;
    const value = req.body;

    const brandId = await ProductBrand.findOne({
      where: {id: productBrandId},
    });
    if (!brandId) {
      createError('this ID not found', 400);
    }

    await ProductBrand.update(value, {
      where: {id: productBrandId},
    });

    res.status(200).json({message: 'update success'});
  } catch (err) {
    next(err);
  }
};
exports.deleteProductBrand = async (req, res, next) => {
  try {
    const productBrandId = req.params.productBrandId;

    const brandId = await ProductBrand.findOne({
      where: {id: productBrandId},
    });
    if (!brandId) {
      createError('this ID not found', 400);
    }

    await ProductBrand.destroy({where: {id: productBrandId}});
    res.status(204).json({message: 'delete success'});
  } catch (err) {
    next(err);
  }
};
