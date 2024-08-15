const {
  Brand,
  SubCategory,
  MainCategory,
  BrandCategorySub,
  BrandCategory,
  sequelize,
} = require('../../models');
const {
  validateMainCategory,
  validateSubCategory,
} = require('../../validators/category-validate');
const factory = require('../utils/handlerFactory');
const resMsg = require('../../config/messages');

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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({...resMsg.getMsg(200), brandSubCategory});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//MAIN
exports.createCategory = async (req, res, next) => {
  try {
    const value = validateMainCategory({
      title: req.body.title,
    });

    const result = await MainCategory.create(value);
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await MainCategory.update(value, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getAllCategory = factory.getAll(MainCategory);
exports.deleteCategory = factory.deleteOne(MainCategory);

//SUB

exports.getSubCategoryByMainCategory = async (req, res, next) => {
  try {
    //get id form req.params
    const mainCategoryId = req.params.id;

    //find SubCategory where bc have mainCategory === req.params.id
    const result = await SubCategory.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: BrandCategorySub,
          attributes: [],
          required: true,
          include: [
            {
              model: BrandCategory,
              where: {mainCategoryId: mainCategoryId},
              attributes: [],
              required: true,
            },
          ],
        },
      ],
      group: ['SubCategory.id', 'SubCategory.title'],
      order: [['id', 'ASC']],
    });

    if (result.length === 0) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createSubCategory = async (req, res, next) => {
  try {
    const value = validateSubCategory({
      title: req.body.title,
    });

    const result = await SubCategory.create(value);
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await SubCategory.update(value, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getAllSubCategory = factory.getAll(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
