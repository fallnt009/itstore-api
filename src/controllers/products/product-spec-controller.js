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

exports.getSpecItemById = async (req, res, next) => {
  try {
    const {id} = req.params;

    const result = await SpecItem.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: SpecSubcategory,
          attributes: ['id'],
          required: true,
          include: [
            {
              model: SubCategory,
              attributes: ['id', 'title'],
              where: {id: id},
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
exports.createSpecItem = async (req, res, next) => {
  try {
    const value = validateSpecItem({
      title: req.body.title,
    });
    const result = await SpecItem.create(value);
    res.status(200).json({...resMsg.getMsg(200), result});
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
