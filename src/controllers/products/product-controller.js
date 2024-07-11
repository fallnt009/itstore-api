const {validateProduct} = require('../../validators/product-validate');
const {
  Product,
  ProductSubCategory,
  BrandCategorySub,
  BrandCategory,
  MainCategory,
  SubCategory,
  ProductImage,
  sequelize,
  Brand,
  ProductDiscount,
  Discount,
} = require('../../models');

const generateNumber = require('../../controllers/utils/generateNumber');
const createError = require('../../utils/create-error');
const {Op} = require('sequelize');

//GET NEW PRODUCT FOR HOMEPAGE
exports.getNewProduct = async (req, res, next) => {
  try {
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
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
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
                    {
                      model: Brand,
                      required: true,
                      attributes: ['title'],
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

exports.getSalesProduct = async (req, res, next) => {
  try {
    const result = await ProductDiscount.findAll({
      include: [
        {model: Product, required: true},
        {model: Discount, required: true},
      ],
      order: [['createdAt', 'DESC']],
      limit: 4,
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const productImg = req.files?.map((file) => file.filename);

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

    const product = await Product.create(value);

    //image Array
    const imgArray = [];

    //Loop and save Image
    if (productImg.length > 0) {
      for (const path of productImg) {
        imgArray.push({
          productId: product.id,
          path: `${process.env.PRODUCT_IMAGE_URL}${path}`,
        });
      }
      await ProductImage.bulkCreate(imgArray);
    }

    res.status(200).json({message: 'create product success'});
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const pd = await sequelize.transaction();
  try {
    const imageFile = req.files?.map((file) => file.filename);

    const productID = req.params.id;

    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      qtyInStock: req.body.qtyInStock,
    });
    const existingCode = await Product.findAll(
      {
        where: {
          productCode: value.productCode,
          id: {
            [Op.not]: productID,
          },
        },
      },
      {transaction: pd}
    );

    if (existingCode.length > 0) {
      await pd.rollback();
      createError('Product code already exist', 400);
    }

    await Product.update(
      value,
      {
        where: {
          id: productID,
        },
      },
      {transaction: pd}
    );
    //Find EXIST image
    const productImage = await ProductImage.findAll(
      {
        where: {productId: productID},
      },
      {transaction: pd}
    );
    //Delete Old Image LOOP
    for (const img of productImage) {
      await img.destroy({transaction: pd});
    }

    //Loop and Save Image
    if (imageFile.length > 0) {
      //Empty array
      const imgArray = [];
      for (const path of imageFile) {
        imgArray.push({
          productId: productID,
          path: `${process.env.PRODUCT_IMAGE_URL}${path}`,
        });
      }
      await ProductImage.bulkCreate(imgArray, {transaction: pd});
    }
    await pd.commit();

    res.status(200).json({message: 'update success'});
  } catch (err) {
    await pd.rollback();
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  const pd = await sequelize.transaction();

  try {
    const productID = req.params.id;
    //find product if exist
    const product = await Product.findOne(
      {where: {id: productID}},
      {transaction: pd}
    );

    if (!product) {
      await pd.rollback();
      createError('Product not exist!', 400);
    }
    //delete product Image
    await ProductImage.destroy(
      {where: {productId: product.id}},
      {transaction: pd}
    );
    //delete product category sub
    await ProductSubCategory.destroy(
      {where: {productId: product.id}},
      {transaction: pd}
    );
    //delete product
    await product.destroy({transaction: pd});

    await pd.commit();
    res.status(204).json({});
  } catch (err) {
    await pd.rollback();
    next(err);
  }
};
