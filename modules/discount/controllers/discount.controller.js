const {Discount} = require('../../../models');

const {validateDiscount} = require('../validators/discount-validate');

const resMsg = require('../../../config/messages');

exports.getAllDiscount = async (req, res, next) => {
  try {
    const result = await Discount.findAll();
    res
      .status(200)
      .json({...resMsg.getMsg(200), amount: result.length, result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await Discount.update(value, {
      where: {
        id: discountId,
      },
    });

    const result = await Discount.findOne({where: {id: discountId}});

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
