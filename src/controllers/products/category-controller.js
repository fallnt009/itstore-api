const {SubCategory, MainCategory} = require('../../models');
const {
  validateMainCategory,
  validateSubCategory,
} = require('../../validators/category-validate');
const factory = require('../utils/handlerFactory');
const createError = require('../../utils/create-error');

//MAIN
exports.createCategory = async (req, res, next) => {
  try {
    try {
      const value = validateMainCategory({
        title: req.body.title,
      });

      const result = await MainCategory.create(value);
      res.status(200).json({message: 'create success', result});
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    try {
      const value = validateMainCategory({
        title: req.body.title,
      });

      const findId = await MainCategory.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!findId) {
        createError('ID not found', 404);
      }

      await MainCategory.update(value, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({message: 'update success'});
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
exports.getAllCategory = factory.getAll(MainCategory);
exports.deleteCategory = factory.deleteOne(MainCategory);

//SUB
exports.createSubCategory = async (req, res, next) => {
  try {
    try {
      const value = validateSubCategory({
        title: req.body.title,
      });

      const result = await SubCategory.create(value);
      res.status(200).json({message: 'create success', result});
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
exports.updateSubCategory = async (req, res, next) => {
  try {
    try {
      const value = validateSubCategory({
        title: req.body.title,
      });
      const findId = await SubCategory.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!findId) {
        createError('ID not found', 404);
      }

      await SubCategory.update(value, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({message: 'update success'});
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
exports.getAllSubCategory = factory.getAll(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
