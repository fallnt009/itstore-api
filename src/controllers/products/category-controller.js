const {
  Brand,
  SubCategory,
  MainCategory,
  BrandCategorySub,
  BrandCategory,
} = require('../../models');
const {
  validateMainCategory,
  validateSubCategory,
} = require('../../validators/category-validate');
const factory = require('../utils/handlerFactory');
const createError = require('../../utils/create-error');

exports.getBrandCategorySub = async (req, res, next) => {
  const {brandName, mainCategoryName, subCategoryName} = req.query;

  const brandCondition = brandName ? {title: brandName} : {};
  const mainCategoryCondition = mainCategoryName
    ? {title: mainCategoryName}
    : {};
  const subCategoryCondition = subCategoryName ? {title: subCategoryName} : {};
  try {
    const brandSubCategory = await BrandCategorySub.findAll({
      attributes: ['id', 'subCategoryId', 'brandCategoryId'],
      include: [
        {
          model: SubCategory,
          attributes: ['title'],
          where: subCategoryCondition,
        },
        {
          model: BrandCategory,
          attributes: ['brandId', 'mainCategoryId'],
          required: true,
          include: [
            {
              model: Brand,
              attributes: ['title'],
              where: brandCondition,
            },
            {
              model: MainCategory,
              attributes: ['title'],
              where: mainCategoryCondition,
            },
          ],
        },
      ],
    });

    if (!brandSubCategory) {
      createError('Not found', 404);
    }

    res.status(200).json({brandSubCategory});
  } catch (err) {
    next(err);
  }
};

exports.getBrandTag = async (req, res, next) => {
  try {
    const brandId = req.params.id;

    const result = await BrandCategorySub.findAll({
      attributes: ['id', 'subCategoryId', 'brandCategoryId'],
      include: [
        {
          model: SubCategory,
          attributes: ['id', 'title'],
        },
        {
          model: BrandCategory,
          attributes: ['id', 'brandId', 'mainCategoryId'],
          include: [
            {
              model: Brand,
              where: {id: brandId},
              attributes: ['id', 'title'],
            },
          ],
          required: true,
        },
      ],
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

//MAIN
exports.createCategory = async (req, res, next) => {
  try {
    const value = validateMainCategory({
      title: req.body.title,
    });

    const result = await MainCategory.create(value);
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};
exports.updateCategory = async (req, res, next) => {
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
};
exports.getAllCategory = factory.getAll(MainCategory);
exports.deleteCategory = factory.deleteOne(MainCategory);

//SUB
exports.createSubCategory = async (req, res, next) => {
  try {
    const value = validateSubCategory({
      title: req.body.title,
    });

    const result = await SubCategory.create(value);
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};
exports.updateSubCategory = async (req, res, next) => {
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
};
exports.getAllSubCategory = factory.getAll(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
