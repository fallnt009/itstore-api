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

//FETCH TEST
exports.getBrandCategorySub = async (req, res, next) => {
  const brandName = 'ASUS';
  const mainCategoryName = 'Component';
  const subCategoryName = 'Mainboard';
  try {
    const brandSubCategory = await BrandCategorySub.findOne({
      attributes: ['id', 'subCategoryId', 'brandCategoryId'],
      include: [
        {
          model: SubCategory,
          attributes: ['id', 'title'],
          where: {title: subCategoryName},
        },
        {
          model: BrandCategory,
          attributes: ['id', 'brandId', 'mainCategoryId'],
          required: true,
          include: [
            {
              model: Brand,
              attributes: ['id', 'title'],
              where: {title: brandName},
            },
            {
              model: MainCategory,
              attributes: ['id', 'title'],
              where: {title: mainCategoryName},
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
