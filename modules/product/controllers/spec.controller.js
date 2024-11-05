const {Op} = require('sequelize');
const {
  Product,
  SubCategory,
  SpecItem,
  SpecProduct,
  SpecSubcategory,
  ProductSubSpec,
} = require('../../../models');

const {
  validateSpecItem,
  validateSpecProduct,
} = require('../validators/spec-validate');

const resMsg = require('../../../config/messages');

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
//depracated
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

//use this one permenantly
exports.getSpecItemBySlug = async (req, res, next) => {
  try {
    const {slug} = req.params;
    const {title} = req.query;

    const titleFilter = title
      ? Array.isArray(title)
        ? {[Op.in]: title}
        : {[Op.eq]: title}
      : undefined;

    const result = await SpecItem.findAll({
      attributes: ['id', 'title'],
      where: {
        ...(titleFilter && {title: titleFilter}),
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
// exports.createProductSpec = async (req, res, next) => {
//   try {
//     res.status(200).json({...resMsg.getMsg(200), result});
//   } catch (err) {
//     res.status(500).json(resMsg.getMsg(500));
//   }
// };
// exports.updateProductSpec = async (req, res, next) => {
//   try {
//     res.status(200).json({...resMsg.getMsg(200), result});
//   } catch (err) {
//     res.status(500).json(resMsg.getMsg(500));
//   }
// };
// exports.deleteProductSpec = async (req, res, next) => {
//   try {
//     res.status(200).json({...resMsg.getMsg(200), result});
//   } catch (err) {
//     res.status(500).json(resMsg.getMsg(500));
//   }
// };

//SubSpec
//ProductSubSpec
exports.getProductSubSpecByProductId = async (req, res, next) => {
  try {
    const productId = req.params.id;

    //need only product Id
    const result = await ProductSubSpec.findAll({
      attributes: ['id', 'value', 'specProductId', 'productId'],
      where: {productId: productId},
      include: [
        {
          model: SpecProduct,
          attributes: ['id', 'text', 'specSubcategoryId'],
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createProductSubSpec = async (req, res, next) => {
  //ADD
  //KNOW specProductId,productId
  //METHOD create productSubSpec by using two Ids

  try {
    const productId = req.params.id;
    const {specProductId, value, desc} = req.body;

    if (!specProductId || !productId) {
      return res.status(400).json(resMsg.getMsg(400));
    }

    //if ProductSubSpec exist return error
    const isExist = await ProductSubSpec.findOne({
      where: {specProductId: specProductId, productId: productId},
    });

    //return error exist
    if (isExist) {
      return res.status(409).json(resMsg.getMsg(40900));
    }

    const productSubSpec = await ProductSubSpec.create({
      specProductId: specProductId,
      productId: productId,
      value: value || null,
      desc: desc || null,
    });

    const result = await ProductSubSpec.findOne({
      attributes: ['id', 'value', 'specProductId', 'productId'],
      where: {id: productSubSpec.id},
      include: [
        {
          model: SpecProduct,
          attributes: ['id', 'text', 'specSubcategoryId'],
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.updateProductSubSpec = async (req, res, next) => {
  //EDIT
  //KNOW productSubSpecId
  //METHOD update productSubSpec by using their id and patch new specProductId

  try {
    res.status(200).json({...resMsg.getMsg(200)});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteProductSubSpec = async (req, res, next) => {
  //DELETE
  //KNOW productSubSpecId
  //METHOD delete productSubSpec by their id

  try {
    const productId = req.params.id;
    const {specProductId} = req.body;

    //find if exist
    const ProductSubSpecData = await ProductSubSpec.findOne({
      where: {specProductId: specProductId, productId: productId},
    });

    if (!ProductSubSpecData) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await ProductSubSpecData.destroy();

    res.status(200).json({...resMsg.getMsg(200)});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getSpecSubcategoryById = async (req, res, next) => {
  try {
    //make it load category by category
    //get specsub where subcategoryId
    const specItemId = req.params.id;
    const {subCategoryId} = req.query;

    const filter = {};

    if (specItemId) {
      filter.specItemId = specItemId;
    }
    if (subCategoryId) {
      filter.subCategoryId = subCategoryId;
    }

    const result = await SpecSubcategory.findAll({
      attributes: ['id', 'specItemId', 'subCategoryId'],
      where: filter,
      include: [
        {
          model: SpecProduct,
          attributes: ['id', 'text'],
          required: true,
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

////////////////////////////////////////////////////////////
//Spec Product

exports.getSpecProductbyItemId = async (req, res, next) => {
  try {
    const specItemId = req.params.id;
    const {subCategoryId} = req.query;

    const result = await SpecProduct.findAll({
      attributes: ['id', 'text'],
      include: [
        {
          model: SpecSubcategory,
          attributes: ['id', 'specItemId', 'subCategoryId'],
          where: {specItemId: specItemId, subCategoryId: subCategoryId},
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createSpecProduct = async (req, res, next) => {
  try {
    //need specSubCategoryId and text
    const {text, specSubCategoryId} = req.body;

    //validateSpecProduct

    const value = validateSpecProduct({
      text: text,
    });
    value.specSubcategoryId = specSubCategoryId;

    const result = await SpecProduct.create(value);

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateSpecProduct = async (req, res, next) => {
  try {
    //specProduct Id ,data
    const specProductId = req.params.id;
    const {text} = req.body;

    const value = validateSpecProduct({
      text: text,
    });
    const specProduct = await SpecProduct.findByPk(specProductId);

    if (!specProduct) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await specProduct.update(value);

    const result = await SpecProduct.findOne({
      where: {id: specProduct.id},
      attributes: ['id', 'text'],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteSpecProduct = async (req, res, next) => {
  try {
    const specProductId = req.params.id;

    const specProduct = await SpecProduct.findByPk(specProductId);

    if (!specProduct) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await specProduct.destroy();

    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//getSpecProduct that belong to what sub and what spec Items

exports.getSpecProductForFilter = async (req, res, next) => {
  try {
    const {subCategorySlug} = req.query;

    //spec items
    const result = await SpecProduct.findAll({
      attributes: ['id', 'text'],
      include: [
        {
          model: SpecSubcategory,
          attributes: ['id'],
          required: true,
          include: [
            {
              model: SpecItem,
              attributes: ['id', 'title'],
            },
            {
              model: SubCategory,
              attributes: ['id', 'title', 'slug'],
              where: {slug: subCategorySlug},
            },
          ],
        },
      ],
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
