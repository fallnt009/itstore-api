const resMsg = require('../../config/messages');

exports.deleteOne = (Model, Value) => async (req, res, next) => {
  try {
    const data = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await Model.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.updateOne = (Model, Validate) => async (req, res, next) => {
  try {
    const data = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    const value = Validate ? Validate(req.body) : req.body;

    await Model.update(value, {
      where: {
        id: req.params.id,
      },
    });
    const result = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getAll = (Model) => async (req, res, next) => {
  try {
    const result = await Model.findAll();

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    res.status(200).json({amount: result.length, result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getOne = (Model) => async (req, res, next) => {
  try {
    const result = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createOne = (Model, Validate) => async (req, res, next) => {
  try {
    const value = Validate ? Validate(req.body) : req.body;
    const result = await Model.create(value);
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
