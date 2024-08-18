const {
  SubCategory,
  Brand,
  BrandCategorySub,
  BrandCategory,
} = require('../../models');
const {validateProductBrand} = require('../../validators/product-validate');
const factory = require('../utils/handlerFactory');
const resMsg = require('../../config/messages');

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
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createBrandTags = async (req, res, next) => {
  try {
    const {brandId, categoryId, subCategoryId} = req.body;
    const oldBrandSub = await BrandCategory.findOne({
      where: {brandId: brandId, mainCategoryId: categoryId},
    });

    let bcs;

    if (oldBrandSub) {
      //check brandCategorySub
      const isExist = await BrandCategorySub.findOne({
        where: {
          brandCategoryId: oldBrandSub.id,
          subCategoryId: subCategoryId,
        },
      });

      if (isExist) {
        return res.status(409).json(resMsg.getMsg(40900));
      }

      bcs = await BrandCategorySub.create({
        brandCategoryId: oldBrandSub.id,
        subCategoryId: subCategoryId,
      });
    } else {
      //create new
      const newBrandSub = await BrandCategory.create({
        brandId: brandId,
        mainCategoryId: categoryId,
      });
      bcs = await BrandCategorySub.create({
        brandCategoryId: newBrandSub.id,
        subCategoryId: subCategoryId,
      });
    }

    const result = await BrandCategorySub.findOne({
      where: {id: bcs.id},
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
              attributes: ['id', 'title'],
            },
          ],
          required: true,
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createBrand = async (req, res, next) => {
  try {
    const value = validateProductBrand({
      title: req.body.title,
    });
    //existing Brand
    const existingBrand = await Brand.findOne({where: {title: value.title}});
    if (existingBrand) {
      return res.status(409).json(resMsg.getMsg(40900));
    }

    const result = await Brand.create(value);

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateBrand = async (req, res, next) => {
  try {
    const value = validateProductBrand({
      title: req.body.title,
    });

    const findId = await Brand.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!findId) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    //existing title
    const existingBrand = await Brand.findOne({where: {title: value.title}});

    if (existingBrand) {
      return res.status(409).json(resMsg.getMsg(40900));
    }

    await Brand.update(value, {
      where: {
        id: req.params.id,
      },
    });

    const result = await Brand.findByPk(req.params.id);
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getAllBrand = factory.getAll(Brand);
exports.getOneBrand = factory.getOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
