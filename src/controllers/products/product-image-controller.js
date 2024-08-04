const {ProductImage} = require('../../models');

exports.createProductImage = async (req, res, next) => {
  try {
    //get product id by params
    const productId = req.params.id;
    //get data from body in array
    const imgFiles = req.files.map((file) => file.filename);

    // // check photo img of this product id isExist if Exist delete old one
    // const productImages = await ProductImage.findAll({
    //   where: {productId: productId},
    // });

    //delete all old image
    await ProductImage.destroy({
      where: {productId: productId},
    });

    //creating new one [{productId:1,path:URL}]
    const productURL = process.env.PRODUCT_IMAGE_URL;

    const data = [];

    for (let i = 0; i < imgFiles.length; i++) {
      data.push({productId: productId, path: productURL + imgFiles[i]});
    }

    await ProductImage.bulkCreate(data);

    //Get recent
    const result = await ProductImage.findAll({where: {productId: productId}});

    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
