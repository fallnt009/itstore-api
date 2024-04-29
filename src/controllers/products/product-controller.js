const {validateProduct} = require('../../validators/product-validate');
const {
  Product,
  ProductSubCategory,
  BrandCategorySub,
  BrandCategory,
  MainCategory,
  SubCategory,
} = require('../../models');
const createError = require('../../utils/create-error');

//GET NEW PRODUCT FOR HOMEPAGE
exports.getNewProduct = async (req, res, next) => {
  try {
    const result = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4,
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

exports.getProductByCategory = async (req, res, next) => {
  try {
    const {categoryName} = req.params;
    const result = await Product.findAll({
      include: [
        {
          model: ProductSubCategory,
          required: true,
          attributes: ['id'],
          include: [
            {
              model: BrandCategorySub,
              required: true,
              attributes: ['id'],
              include: [
                {
                  model: BrandCategory,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: MainCategory,
                      required: true,
                      attributes: ['title'],
                      where: {title: categoryName},
                    },
                  ],
                },
              ],
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

exports.getProductBySubCategory = async (req, res, next) => {
  try {
    const {categoryName, subCategoryName} = req.params;
    const result = await Product.findAll({
      include: [
        {
          model: ProductSubCategory,
          required: true,
          attributes: ['id'],
          include: [
            {
              model: BrandCategorySub,
              required: true,
              attributes: ['id'],
              include: [
                {
                  model: SubCategory,
                  required: true,
                  attributes: ['title'],
                  where: {title: subCategoryName},
                },
                {
                  model: BrandCategory,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: MainCategory,
                      required: true,
                      attributes: ['title'],
                      where: {title: categoryName},
                    },
                  ],
                },
              ],
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
exports.getProductById = async (req, res, next) => {
  try {
    const {productId} = req.params;

    const result = await Product.findOne({
      where: {
        id: productId,
      },
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      onPromotion: req.body.onPromotion,
    });

    const result = await Product.create(value);

    res.status(200).json({message: 'create product success', result});
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const {productId} = req.params;

    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      onPromotion: req.body.onPromotion,
    });

    const result = await Product.update(value, {
      where: {
        id: productId,
      },
    });

    res.status(200).json({message: 'update success', result});
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const {productId} = req.params;
    await Product.destroy({
      where: {
        id: productId,
      },
    });
    res.status(204).json({message: 'delete success'});
  } catch (err) {
    next(err);
  }
};
