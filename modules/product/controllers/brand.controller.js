const {
  Brand,
  SubCategory,
  BrandCategorySub,
  BrandCategory,
} = require('../../../models');

const resMsg = require('../../../config/messages');
const validateBrand = require('../validators/brand-validate');

const paginate = require('../../../utils/paginate');

exports.getAllBrand = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  //fetch all
  const fetchAll = req.query.all === 'true';

  try {
    //if fetch all true
    if (fetchAll) {
      const allBrands = await Brand.findAll({
        attributes: ['id', 'title', 'slug'],
      });

      if (allBrands.length === 0) {
        return res.status(404).json(resMsg.getMsg(40401));
      }

      return res.status(200).json({
        ...resMsg.getMsg(200),
        count: allBrands.length,
        result: allBrands,
      });
    }
    const {count, rows} = await Brand.findAndCountAll(
      paginate({attributes: ['id', 'title', 'slug']}, {page, pageSize})
    );

    if (count === 0) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

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
exports.getBrandById = async (req, res, next) => {
  try {
    const result = await Brand.findOne({
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
exports.createBrand = async (req, res, next) => {
  try {
    const value = validateBrand({
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
    const value = validateBrand({
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

// DONT USE
// exports.deteteBrand = async (req, res, next) => {
//   try {
//     const data = await Brand.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (!data) {
//       return res.status(404).json(resMsg.getMsg(40401));
//     }

//     await Brand.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });

//     res.status(204).json();
//   } catch (err) {
//     res.status(500).json(resMsg.getMsg(500));
//   }
// };

exports.getBrandTag = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 6;

    const {count, rows} = await BrandCategorySub.findAndCountAll({
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
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    if (!rows) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    res.status(200).json({
      ...resMsg.getMsg(200),
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//getBrandTagById
exports.getBrandTagById = async (req, res, next) => {
  try {
    const bcsId = req.params.id;
    const result = await BrandCategorySub.findOne({
      where: {id: bcsId},
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
    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

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
