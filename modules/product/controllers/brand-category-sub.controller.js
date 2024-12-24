const {
  Brand,
  SubCategory,
  MainCategory,
  BrandCategorySub,
  BrandCategory,
} = require('../../../models');

const resMsg = require('../../../config/messages');
const paginate = require('../../../utils/paginate');

exports.getBrandCategorySub = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const {brandSlug, categorySlug, subCategorySlug} = req.query.filters || {};

  const brandCondition = brandSlug ? {slug: brandSlug} : {};
  const mainCategoryCondition = categorySlug ? {slug: categorySlug} : {};
  const subCategoryCondition = subCategorySlug ? {slug: subCategorySlug} : {};

  try {
    const {count, rows} = await BrandCategorySub.findAndCountAll(
      paginate(
        {
          attributes: ['id', 'subCategoryId', 'brandCategoryId'],
          include: [
            {
              model: SubCategory,
              attributes: ['title', 'slug'],
              where: subCategoryCondition,
            },
            {
              model: BrandCategory,
              attributes: ['brandId', 'mainCategoryId'],
              required: true,
              include: [
                {
                  model: Brand,
                  attributes: ['title', 'slug'],
                  where: brandCondition,
                },
                {
                  model: MainCategory,
                  attributes: ['title', 'slug'],
                  where: mainCategoryCondition,
                },
              ],
            },
          ],
        },
        {page, pageSize}
      )
    );

    res.status(200).json({
      ...resMsg.getMsg(200),
      count: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
