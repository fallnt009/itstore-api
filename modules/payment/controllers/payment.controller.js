const {Payment} = require('../../../models');
const {validatePayment} = require('../validators/payment-validate');
const resMsg = require('../../../config/messages');

exports.getAllPayment = async (req, res, next) => {
  try {
    const result = await Payment.findAll();

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    res.status(200).json({amount: result.length, result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.createPayment = async (req, res, next) => {
  try {
    const value = validatePayment(req.body);
    const result = await Payment.create(value);
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updatePayment = async (req, res, next) => {
  try {
    const data = await Payment.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    const value = validatePayment(req.body);

    await Payment.update(value, {
      where: {
        id: req.params.id,
      },
    });
    const result = await Payment.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deletePayment = async (req, res, next) => {
  try {
    const data = await Payment.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await Payment.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
