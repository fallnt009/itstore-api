const {Product, SpecSubcategory, SpecProduct} = require('../../models');

const resMsg = require('../../config/messages');

exports.getSpecProduct = async (req, res, next) => {
  try {
    //make it load category by category
    //get specsub where subcategoryId
    const specItemId = req.params.id;
    const {subCategoryId} = req.query;

    console.log(specItemId, subCategoryId);

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
          attributes: ['id', 'value', 'text'],
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
    //Spec Product
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateSpecProduct = async (req, res, next) => {
  try {
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteSpecProduct = async (req, res, next) => {
  try {
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
