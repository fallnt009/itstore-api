const {
  Brand,
  SubCategory,
  MainCategory,
  BrandCategorySub,
  BrandCategory,
} = require('../../../models');

const resMsg = require('../../../config/messages');

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
