const {required} = require('joi');
const {Product, SubCategory, SpecItem, ProductSpec} = require('../../models');
const {
  validateSpecItem,
  validateProductSpec,
} = require('../../validators/product-validate');

// const specItemData = require('../../data/spec-items.json');
// const productSpecData = require('../../data/product-spec.json');

exports.getSpecItemBySubCategory = async (req, res, next) => {
  try {
    const result = await SpecItem.findAll({
      attributes: ['id', 'specName'],
      include: [{model: SubCategory, attributes: ['title']}],
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
exports.createSpecItem = async (req, res, next) => {
  try {
    const value = validateSpecItem({
      specName: req.body.specName,
    });
    const result = await SpecItem.create(value);
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};

exports.getProductSpec = async (req, res, next) => {
  try {
    const result = await ProductSpec.findAll({
      attributes: ['description'],
      include: [
        {
          model: Product,
          required: true,
        },
        {
          model: SpecItem,
          attributes: ['specName'],
          required: true,
        },
      ],
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

exports.createProductSpec = async (req, res, next) => {
  try {
    const value = validateProductSpec({
      description: req.body.description,
    });
    value.specItemId = req.body.specItemId;
    value.productId = req.body.productId;

    const result = await ProductSpec.create(value);
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};
