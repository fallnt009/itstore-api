const {validateProduct} = require('../../validators/product-validate');
const {
  Product,
  ProductSubCategory,
  BrandCategorySub,
  BrandCategory,
  MainCategory,
  SubCategory,
} = require('../../models');

const generateNumber = require('../../controllers/utils/generateNumber');
const createError = require('../../utils/create-error');
const factory = require('../utils/handlerFactory');
const {Op} = require('sequelize');

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
exports.getProductInfo = async (req, res, next) => {
  try {
    const {categoryName, subCategoryName, productName} = req.params;
    const decodedProductName = decodeURIComponent(productName);

    const result = await Product.findOne({
      where: {title: decodedProductName},
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
    const result = await Product.findOne({
      where: {
        id: req.params.id,
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
      qtyInStock: req.body.qtyInStock,
    });

    value.productCode = generateNumber.generateProductCode(6);

    const existingCode = await Product.findAll({
      where: {
        productCode: value.productCode,
      },
    });

    if (existingCode.length > 0) {
      createError('Product code already exist', 400);
    }

    const result = await Product.create(value);

    res.status(200).json({message: 'create product success', result});
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      qtyInStock: req.body.qtyInStock,
      productCode: req.body.productCode,
    });
    const existingCode = await Product.findAll({
      where: {
        productCode: value.productCode,
        id: {
          [Op.not]: req.params.id,
        },
      },
    });

    if (existingCode.length > 0) {
      createError('Product code already exist', 400);
    }

    await Product.update(value, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({message: 'update success'});
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = factory.deleteOne(Product);
