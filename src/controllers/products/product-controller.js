const {Op} = require('sequelize');
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
  SpecProduct,
  SpecSubcategory,
  SpecItem,
  ProductSubSpec,
} = require('../../models');

const generateNumber = require('../../controllers/utils/generateNumber');
const createError = require('../../utils/create-error');
const resMsg = require('../../config/messages');

//GET NEW PRODUCT FOR HOMEPAGE
exports.getNewProduct = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 4;

  try {
    const {count, rows} = await Product.findAndCountAll({
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
        {
          model: ProductDiscount,
          include: [
            {
              model: Discount,
            },
          ],
        },
        {
          model: ProductImage,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    res.status(200).json({
      ...resMsg.getMsg(200),
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getProductBySubCategory = async (req, res, next) => {
  try {
    const {categoryName, subCategoryName} = req.params;

    const {filter, page, pageSize} = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSizeLimit = parseInt(pageSize) || 4;

    const filterCondition = filter ? {text: {[Op.like]: `%${filter}%`}} : {};

    const {count, rows} = await Product.findAndCountAll({
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
        {
          model: ProductImage,
        },
        // {
        //   model: ProductSubSpec,
        //   attributes: ['id'],
        //   include: [
        //     {
        //       model: SpecProduct,
        //       attributes: ['value', 'text'],
        //       where: filterCondition,
        //       include: [
        //         {
        //           model: SpecSubcategory,
        //           attributes: ['id'],
        //           include: [{model: SpecItem, attributes: ['title']}],
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      order: [['createdAt', 'DESC']],
      distinct: true,
      limit: pageSizeLimit,
      offset: (pageNo - 1) * pageSizeLimit,
    });

    res.status(200).json({
      ...resMsg.getMsg(200),
      totalItems: count,
      totalPages: Math.ceil(count / pageSizeLimit),
      currentPage: pageNo,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
          attributes: ['id'],
          include: [
            {
              model: BrandCategorySub,
              attributes: ['id'],
              include: [
                {
                  model: SubCategory,
                  attributes: ['title'],
                  where: {title: subCategoryName},
                },
                {
                  model: BrandCategory,
                  attributes: ['id'],
                  include: [
                    {
                      model: MainCategory,
                      attributes: ['title'],
                      where: {title: categoryName},
                    },
                    {
                      model: Brand,
                      attributes: ['title'],
                    },
                  ],
                },
              ],
              required: true,
            },
          ],
          required: true,
        },
      ],
    });

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const result = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getSalesProduct = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 4;

  try {
    const {count, rows} = await Product.findAndCountAll({
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
        {
          model: ProductDiscount,
          required: true,
          include: [
            {
              model: Discount,
              required: true,
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    res.status(200).json({
      ...resMsg.getMsg(200),
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    //get BCS Id by params
    const bcsId = req.params.id;

    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      qtyInStock: req.body.qtyInStock,
    });

    value.productCode = generateNumber.generateProductCode(6);

    const existingCode = await Product.findOne({
      where: {
        productCode: value.productCode,
      },
    });

    if (existingCode) {
      return res.status(409).json(resMsg.getMsg(40900));
    }

    const product = await Product.create(value);

    await ProductSubCategory.create({
      productId: product.id,
      brandCategorySubId: bcsId,
    });

    const result = await Product.findByPk(product.id);

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(409).json(resMsg.getMsg(40900));
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

    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    await pd.rollback();
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
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
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getProductFilter = async (req, res, next) => {
  try {
    const subCategoryName = req.params.subCategoryName;
    //specItem , specSubcategory ,subCategory, specProduct
    const result = await SubCategory.findAll({
      where: {title: subCategoryName},
      include: [
        {
          model: SpecSubcategory,
          include: [
            {
              model: SpecProduct,
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
