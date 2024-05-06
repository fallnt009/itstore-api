const createError = require('../../utils/create-error');

exports.deleteOne = (Model, Value) => async (req, res, next) => {
  try {
    const data = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      createError('ID not found', 404);
    }

    await Model.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json({message: 'delete success'});
  } catch (err) {
    next(err);
  }
};

exports.updateOne = (Model, Value) => async (req, res, next) => {
  try {
    const data = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      createError('ID not found', 404);
    }

    const result = await Model.update({
      Value,
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json({message: 'update success', result});
  } catch (err) {
    next(err);
  }
};
exports.getAll = (Model) => async (req, res, next) => {
  try {
    const result = await Model.findAll();

    if (!result) {
      createError('Data not found', 404);
    }
    res.status(200).json({amount: result.length, result});
  } catch (err) {
    next(err);
  }
};
exports.getOne = (Model, Value) => async (req, res, next) => {
  try {
    const data = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      createError('Data not found', 404);
    }

    res.status(200).json({message: 'success', data});
  } catch (err) {
    next(err);
  }
};

exports.createOne = (Model, Value) => async (req, res, next) => {
  try {
    const data = await Model.create(Value);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};
