//CONCLUSION
//due to specProduct reuseable
//example Brand need to get all specProduct that have SpecSub bounded with Brand
// ADD ONLY ADD form existing if want to create One create On another tool
// ONLY ADD ,EDIT AND DELETE

const {
  SubCategory,
  SpecItem,
  SpecProduct,
  SpecSubcategory,
  ProductSubSpec,
} = require('../../models');

const resMsg = require('../../config/messages');

//Value need to change to productSubSpec ?

exports.getSpecProductbyItemId = async (req, res, next) => {
  //FETCH specProduct that have specSubId
  //KNOW specSubCategoryId
  //METHOD get specProduct where SpecSubId

  try {
    const itemId = req.params.id;
    const result = await SpecProduct.findAll({
      attributes: ['id', 'value', 'text'],
      include: [
        {
          model: SpecSubcategory,
          attributes: ['id', 'specItemId', 'subCategoryId'],
          where: {specItemId: itemId},
        },
      ],
    });

    if (!result || result.length === 0) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//ProductSubSpec
exports.getProductSubSpecByProductId = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const result = await ProductSubSpec.findAll({
      attributes: ['id', 'specProductId', 'productId'],
      where: {productId: productId},
      include: [
        {
          model: SpecProduct,
          attributes: ['id', 'value', 'text', 'specSubcategoryId'],
        },
      ],
    });

    //if not found
    if (!result || result.length === 0) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

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
    const {specProductId, productId} = req.body;

    if (!specProductId || !productId) {
      return res.status(400).json(resMsg.getMsg(400));
    }

    const productSubSpec = await ProductSubSpec.create({
      specProductId: specProductId,
      productId: productId,
    });

    const result = await ProductSubSpec.findByPk(productSubSpec.id);

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
    res.status(200).json({...resMsg.getMsg(200)});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
