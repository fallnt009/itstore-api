const {validateProduct} = require('../../validators/product-validate');

const {Product, ProductBrand, ProductCategory} = require('../../models');
const createError = require('../../utils/create-error');

exports.getAllProduct = async (req, res, next) => {};
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.productId,
      },
      include: [
        {
          model: ProductCategory,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: ProductBrand,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    });

    if (!product) {
      createError('user with this id is not found', 400);
    }
    res.status(200).json({
      product,
    });
  } catch (err) {
    next(err);
  }
};
exports.createProduct = async (req, res, next) => {
  try {
    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      onPromotion: req.body.onPromotion,
    });
    value.productCategoryId = req.body.productCategoryId;
    value.productBrandId = req.body.productBrandId;

    const product = await Product.create(value);

    res.status(200).json({message: 'create product success', result: product});
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      onPromotion: req.body.onPromotion,
    });
    value.productCategoryId = req.body.productCategoryId;
    value.productBrandId = req.body.productBrandId;

    const product = await Product.findOne({
      where: {id: productId},
    });

    if (!product) {
      createError('Product Not Found', 404);
    }

    await Product.update(value, {
      where: {id: productId},
    });

    res.status(200).json({message: 'update success'});
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({
      where: {id: productId},
    });

    if (!product) {
      createError('Product Not Found', 404);
    }

    await Product.destroy({
      where: {id: productId},
    });
    res.status(204).json({message: 'delete success'});
  } catch (err) {
    next(err);
  }
};
