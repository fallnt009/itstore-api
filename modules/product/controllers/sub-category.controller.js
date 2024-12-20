const {
  SubCategory,
  BrandCategorySub,
  BrandCategory,
} = require('../../../models');
const resMsg = require('../../../config/messages');

const paginate = require('../../../utils/paginate');

exports.getAllSubCategory = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const {count, rows} = await SubCategory.findAndCountAll(
      paginate({}, {page, pageSize})
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

exports.createSubCategory = async (req, res, next) => {
  try {
    const value = validateSubCategory({
      title: req.body.title,
    });

    const existing = await SubCategory.findOne({where: {title: value.title}});
    if (existing) {
      return res.status(409).json(resMsg.getMsg(40900));
    }

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

    const existing = await SubCategory.findOne({where: {title: value.title}});
    if (existing) {
      return res.status(409).json(resMsg.getMsg(40900));
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

exports.deleteSubCategory = async (req, res, next) => {
  try {
    const data = await SubCategory.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await SubCategory.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//getSubCategoryByMain
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
