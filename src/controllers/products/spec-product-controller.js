const {Product, SpecSubcategory, SpecProduct} = require('../../models');

const {validateSpecProduct} = require('../../validators/product-validate');

const resMsg = require('../../config/messages');

exports.getSpecProduct = async (req, res, next) => {
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
    console.log(err);

    res.status(500).json(resMsg.getMsg(500));
  }
};
