const {Service} = require('../../../models');
const {validateService} = require('../validators/checkout-validate');
const resMsg = require('../../../config/messages');

exports.getAllService = async (req, res, next) => {
  try {
    const result = await Service.findAll();

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    res.status(200).json({amount: result.length, result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.createService = async (req, res, next) => {
  try {
    const value = validateService(req.body);
    const result = await Service.create(value);
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateService = async (req, res, next) => {
  try {
    const data = await Service.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    const value = validateService(req.body);

    await Service.update(value, {
      where: {
        id: req.params.id,
      },
    });
    const result = await Service.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteService = async (req, res, next) => {
  try {
    const data = await Service.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await Service.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
