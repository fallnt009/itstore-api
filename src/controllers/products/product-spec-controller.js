const {
  Product,
  SubCategory,
  SpecItem,
  SpecProduct,
  SpecSubcategory,
  ProductSubSpec,
} = require('../../models');
const {Op} = require('sequelize');
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
    //by specItemId
    const {id} = req.params;

    const result = await SpecItem.findOne({
      where: {id: id},
      attributes: ['id', 'title'],
      include: [
        {
          model: SpecSubcategory,
          attributes: ['id', 'subCategoryId'],
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//Get specItem by subCategoryId
exports.getSpecItemBySubCategoryId = async (req, res, next) => {
  try {
    //by specItemId
    const {id} = req.params;

    const result = await SpecItem.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: SpecSubcategory,
          attributes: ['id', 'subCategoryId'],
          where: {subCategoryId: id},
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getSpecItemBySubCategorySlug = async (req, res, next) => {
  try {
    const {slug} = req.params;
    const {title} = req.query;

    console.log(slug, title);

    const titleFilter = title ? {[Op.in]: title} : '';

    const result = await SpecItem.findAll({
      attributes: ['id', 'title'],
      where: {
        title: titleFilter,
      },
      include: [
        {
          model: SpecSubcategory,
          attributes: ['id', 'subCategoryId'],
          include: [
            {
              model: SubCategory,
              where: {slug: slug},
              attributes: ['id', 'title', 'slug'],
            },
          ],
          required: true,
        },
      ],
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    console.log(err);
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
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getAllProductSpec = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const {count, rows} = await Product.findAndCountAll({
      include: [
        {
          model: ProductSubSpec,
          attributes: ['specProductId'],
          include: [
            {
              model: SpecProduct,
              attributes: ['id', 'value', 'text'],
              include: [
                {
                  model: SpecSubcategory,
                  attributes: ['specItemId', 'subCategoryId'],
                  include: [
                    {model: SpecItem, attributes: ['title']},
                    {model: SubCategory, attributes: ['title']},
                  ],
                },
              ],
            },
          ],
        },
      ],
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

exports.getProductSpecById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    //product SubSpec not required
    //if productSubSpec return empty array it's mean this product have no spec description at all
    const result = await Product.findOne({
      where: {id: productId},
      include: [
        {
          model: ProductSubSpec,
          attributes: ['id'],
          include: [
            {
              model: SpecProduct,
              // attributes: ['id', 'value', 'text'],
              include: [
                {
                  model: SpecSubcategory,
                  attributes: ['id'],
                  include: [
                    {model: SpecItem, attributes: ['title']},
                    {model: SubCategory, attributes: ['title']},
                  ],
                },
              ],
            },
          ],
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

//create need specSubId of each title and put data in array and bulkCreate
//and use specProduct that create to create productsubSpec with productId
//[{},{},{}]
//edit or update need specProductId
//update specProduct by Id
//on delete need specProductId and productId
//delete specProduct first and then productSubSpec that have SpecProductId
exports.createProductSpec = async (req, res, next) => {
  try {
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateProductSpec = async (req, res, next) => {
  try {
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteProductSpec = async (req, res, next) => {
  try {
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
