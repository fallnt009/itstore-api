const {Discount} = require('../../models');
const {validateDiscount} = require('../../validators/discount-validate');

const createError = require('../../utils/create-error');

exports.getAllDiscount = async (req, res, next) => {
  try {
    const result = await Discount.findAll();
    res.status(200).json({amount: result.length, result});
  } catch (err) {
    next(err);
  }
};
exports.getDiscountById = async (req, res, next) => {
  try {
    const discountId = req.params.id;
    const result = await Discount.findOne({
      where: {
        id: discountId,
      },
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

exports.createDiscount = async (req, res, next) => {
  try {
    const value = validateDiscount({
      type: req.body.type,
      amount: req.body.amount,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    const result = await Discount.create(value);

    res.status(200).json({message: 'create discount success', result});
  } catch (err) {
    next(err);
  }
};
exports.updateDiscount = async (req, res, next) => {
  try {
    const discountId = req.params.id;

    const value = validateDiscount({
      type: req.body.type,
      amount: req.body.amount,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    //if exist

    const isExist = await Discount.findOne({where: {id: discountId}});

    if (!isExist) {
      createError('discount not found', 404);
    }

    await Discount.update(value, {
      where: {
        id: discountId,
      },
    });

    const result = await Discount.findOne({where: {id: discountId}});

    res.status(200).json({message: 'update success', result});
  } catch (err) {
    next(err);
  }
};
exports.deleteDiscount = async (req, res, next) => {
  try {
    const discountId = req.params.id;
    await Discount.destroy({
      where: {
        id: discountId,
      },
    });
    res.status(204).json({message: 'delete success'});
  } catch (err) {
    next(err);
  }
};
