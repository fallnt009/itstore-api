const createError = require('../../utils/create-error');
const {ProductCategory} = require('../../models');

exports.getAllProductCategory = async (req, res, next) => {
  try {
    const category = await ProductCategory.findAll();
    res.status(200).json({amount: category.length, result: category});
  } catch (err) {
    next(err);
  }
};
exports.createProductCategory = async (req, res, next) => {
  try {
    const value = req.body;
    const category = await ProductCategory.create(value);

    res.status(200).json({
      message: 'create category success',
      result: category,
    });
  } catch (err) {
    next(err);
  }
};
exports.getProductCategoryById = async (req, res, next) => {
  try {
    const category = await ProductCategory.findOne({
      where: {id: req.params.productCategoryId},
    });

    if (!category) {
      createError('Result not found', 404);
    }
    res.status(200).json({result: category});
  } catch (err) {
    next(err);
  }
};
exports.updateProductCategory = async (req, res, next) => {
  try {
    const productCategoryId = req.params.productCategoryId;
    const value = req.body;

    const categoryId = await ProductCategory.findOne({
      where: {id: productCategoryId},
    });

    if (!categoryId) {
      createError('this ID not found', 404);
    }

    await ProductCategory.update(value, {
      where: {id: productCategoryId},
    });

    res.status(200).json({message: 'update success'});
  } catch (err) {
    next(err);
  }
};
exports.deleteProductCategory = async (req, res, next) => {
  try {
    const productCategoryId = req.params.productCategoryId;

    const categoryId = await ProductCategory.findOne({
      where: {id: productCategoryId},
    });
    if (!categoryId) {
      createError('this ID not found', 404);
    }

    await ProductCategory.destroy({where: {id: productCategoryId}});
    res.status(204).json({message: 'delete success'});
  } catch (err) {
    next(err);
  }
};
