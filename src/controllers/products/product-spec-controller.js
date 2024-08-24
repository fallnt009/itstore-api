const {
  Product,
  SubCategory,
  SpecItem,
  SpecProduct,
  SpecSubcategory,
  ProductSubSpec,
} = require('../../models');
const {
  validateSpecItem,
  validateProductSpec,
} = require('../../validators/product-validate');

const resMsg = require('../../config/messages');

//getallSpecItems
exports.getAllSpecItems = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;
  const subCategoryId = req.query.subCategoryId || '';

  try {
    const filters = {};
    if (subCategoryId)
      filters['$SpecSubcategory.SubCategory.id$'] = subCategoryId;

    const {count, rows} = await SpecItem.findAndCountAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: SpecSubcategory,
          attributes: ['subCategoryId'],
          include: [{model: SubCategory, attributes: ['id', 'title']}],
        },
      ],
      where: filters,
      order: [[{model: SpecSubcategory}, {model: SubCategory}, 'title', 'ASC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
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

exports.getSpecItemById = async (req, res, next) => {
  try {
    const {id} = req.params;

    const result = await SpecItem.findByPk(id);

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.createSpecItem = async (req, res, next) => {
  try {
    const value = validateSpecItem({
      title: req.body.title,
    });

    const specitem = await SpecItem.create(value);
    //create spec subCategory and assign default as not assign id
    await SpecSubcategory.create({specItemId: specitem.id, subCategoryId: 29});

    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateSpecItem = async (req, res, next) => {
  try {
    const specId = req.params.id;
    //validate
    const value = validateSpecItem({
      title: req.body.title,
    });

    const specitems = await SpecItem.findByPk(specId);
    if (!specitems) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    //update

    await specitems.update(value);
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getProductSpec = async (req, res, next) => {
  try {
    const productName = req.params.productName;

    const result = await Product.findOne({
      where: {title: productName},
      attributes: ['id', 'title'],
      include: [
        {
          model: ProductSubSpec,
          attributes: ['id'],
          include: [
            {
              model: SpecProduct,
              attributes: ['id', 'value', 'text'],
              include: [
                {
                  model: SpecSubcategory,
                  attributes: ['id'],
                  include: [
                    {model: SpecItem, attributes: ['title']},
                    {model: SubCategory},
                  ],
                },
              ],
            },
          ],
          required: true,
        },
      ],
    });
    await res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
