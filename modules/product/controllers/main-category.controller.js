const {MainCategory} = require('../../../models');

const {validateMainCategory} = require('../validators/main-category-validate');
const resMsg = require('../../../config/messages');

const paginate = require('../../../utils/paginate');

exports.getAllCategory = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const {count, rows} = await MainCategory.findAndCountAll(
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

exports.createCategory = async (req, res, next) => {
  try {
    const value = validateMainCategory({
      title: req.body.title,
    });
    const existing = await MainCategory.findOne({where: {title: value.title}});
    if (existing) {
      return res.status(409).json(resMsg.getMsg(40900));
    }

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

    const existing = await MainCategory.findOne({where: {title: value.title}});
    if (existing) {
      return res.status(409).json(resMsg.getMsg(40900));
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

exports.deleteCategory = async (req, res, next) => {
  try {
    const data = await MainCategory.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await MainCategory.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
