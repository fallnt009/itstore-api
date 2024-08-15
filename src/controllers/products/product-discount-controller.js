const {Product, ProductDiscount, Discount} = require('../../models');
const {validateProductDiscount} = require('../../validators/discount-validate');

const resMsg = require('../../config/messages');

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
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(409).json(resMsg.getMsg(40900));
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
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await ProductDiscount.update(value, {
      where: {id: productDiscountId},
    });

    const result = await ProductDiscount.findOne({
      where: {id: productDiscountId},
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteProductDiscount = async (req, res, next) => {
  try {
    const productDiscountId = req.params.id;

    const isExist = await ProductDiscount.findOne({
      where: {id: productDiscountId},
    });
    if (!isExist) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await ProductDiscount.destroy({where: {id: productDiscountId}});
    res.status(304).json({});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
