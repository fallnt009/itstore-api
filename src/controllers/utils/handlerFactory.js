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

exports.updateOne = (Model, Validate) => async (req, res, next) => {
  try {
    const data = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      createError('ID not found', 404);
    }
    const value = Validate ? Validate(req.body) : req.body;

    console.log(value);

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

    res.status(200).json({message: 'update success', result});
  } catch (err) {
    next(err);
  }
};
exports.getAll = (Model) => async (req, res, next) => {
  try {
    const result = await Model.findAll({attributes: ['id', 'title']});

    if (!result) {
      createError('Data not found', 404);
    }
    res.status(200).json({amount: result.length, result});
  } catch (err) {
    next(err);
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
      createError('Data not found', 404);
    }

    res.status(200).json({message: 'success', result});
  } catch (err) {
    next(err);
  }
};

exports.createOne = (Model, Validate) => async (req, res, next) => {
  try {
    const value = Validate ? Validate(req.body) : req.body;
    const result = await Model.create(value);
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};
