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

// const specItemData = require('../../data/spec-items.json');
// const productSpecData = require('../../data/product-spec.json');

//need to review on product spec rename to specProduct

exports.getSpecItemBySubCategory = async (req, res, next) => {
  try {
    const {subCategoryName} = req.params;

    const result = await SpecItem.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: SpecSubcategory,
          required: true,
          include: [
            {
              model: SubCategory,
              attributes: ['title'],
              where: {title: subCategoryName},
            },
          ],
        },
      ],
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
exports.createSpecItem = async (req, res, next) => {
  try {
    const value = validateSpecItem({
      title: req.body.title,
    });
    const result = await SpecItem.create(value);
    res.status(200).json({message: 'create success', result});
  } catch (err) {
    next(err);
  }
};

exports.getProductSpec = async (req, res, next) => {
  try {
    const productName = req.params.productName;
    const result = await SpecProduct.findAll({
      attributes: ['value', 'text'],
      include: [
        {
          model: Product,
          where: {title: productName},
          attributes: ['title'],
          required: true,
        },
        {
          model: SpecSubcategory,
          include: [{model: SpecItem, attributes: ['title']}],
          attributes: ['id'],
          required: true,
        },
      ],
    });
    await res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

//getProduct + Subspec

//createProductSubSpec

// exports.createProductSpec = async (req, res, next) => {
//   try {
//     const value = validateProductSpec({
//       description: req.body.description,
//     });
//     value.specItemId = req.body.specItemId;
//     value.productId = req.body.productId;

//     const result = await ProductSpec.create(value);
//     res.status(200).json({message: 'create success', result});
//   } catch (err) {
//     next(err);
//   }
// };
