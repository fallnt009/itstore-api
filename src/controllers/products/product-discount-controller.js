const {Product, ProductDiscount, Discount} = require('../../models');
const {validateProductDiscount} = require('../../validators/discount-validate');

const createError = require('../../utils/create-error');

exports.getAllProductDiscount = async (req, res, next) => {
  try {
    const result = await ProductDiscount.findAll({
      include: [
        {
          model: Product,
          required: true,
        },
        {
          model: Discount,
          required: true,
        },
      ],
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
exports.getProductDiscount = async (req, res, next) => {
  try {
    const productDiscountId = req.params.id;
    const result = await ProductDiscount.findOne({
      where: {id: productDiscountId},
      include: [
        {
          model: Product,
          required: true,
        },
        {
          model: Discount,
          required: true,
        },
      ],
    });
    if (!result) {
      createError('data not found', 404);
    }
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
exports.createProductDiscount = async (req, res, next) => {
  try {
    const value = validateProductDiscount({
      discountId: req.body.discountId,
      productId: req.body.productId,
    });
    //check if product already have discount cannot create more
    const isExist = await ProductDiscount.findOne({
      where: {productId: value.productId},
    });

    if (isExist) {
      createError('This Product already have discount', 400);
    }

    const productDiscount = await ProductDiscount.create(value);

    const result = await ProductDiscount.findOne({
      where: productDiscount.id,
      include: [
        {
          model: Product,
          required: true,
        },
        {
          model: Discount,
          required: true,
        },
      ],
    });
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};
exports.updateProductDiscount = async (req, res, next) => {
  try {
    const productDiscountId = req.params.id;

    const value = validateProductDiscount({
      discountId: req.body.discountId,
      productId: req.body.productId,
    });

    const isExist = await ProductDiscount.findOne({
      where: {id: productDiscountId},
    });
    if (!isExist) {
      createError('Data not found', 404);
    }

    await ProductDiscount.update(value, {
      where: {id: productDiscountId},
    });

    const result = await ProductDiscount.findOne({
      where: {id: productDiscountId},
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
exports.deleteProductDiscount = async (req, res, next) => {
  try {
    const productDiscountId = req.params.id;

    const isExist = await ProductDiscount.findOne({
      where: {id: productDiscountId},
    });
    if (!isExist) {
      createError('Data not found', 404);
    }

    await ProductDiscount.destroy({where: {id: productDiscountId}});
    res.status(304).json({});
  } catch (err) {
    next(err);
  }
};
