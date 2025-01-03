const {Op} = require('sequelize');

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
} = require('../../../models');

const {validateProduct} = require('../validators/product-validate');
const generateNumber = require('../../../utils/generateNumber');
const generateSlug = require('../../../utils/generateSlug');

const resMsg = require('../../../config/messages');

//GET NEW PRODUCT FOR HOMEPAGE
exports.getNewProduct = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  try {
    const {count, rows} = await Product.findAndCountAll({
      where: {isActive: true, isNewArrival: true},
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
                  attributes: ['title', 'slug'],
                },
                {
                  model: BrandCategory,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: MainCategory,
                      required: true,
                      attributes: ['title', 'slug'],
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

//GET Sales product for home
exports.getSalesProduct = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  try {
    const {count, rows} = await Product.findAndCountAll({
      where: {isActive: true},
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
                  attributes: ['title', 'slug'],
                },
                {
                  model: BrandCategory,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: MainCategory,
                      required: true,
                      attributes: ['title', 'slug'],
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

//get Product List
exports.getProductBySubCategory = async (req, res, next) => {
  try {
    const {categorySlug, subCategorySlug} = req.params;

    const {search, filters, page, pageSize} = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSizeLimit = parseInt(pageSize) || 4;

    // const searchCondition = search ? {text: {[Op.like]: `%${search}%`}} : {};
    const filterCondition = filters
      ? {[Op.or]: filters.map((item) => ({text: {[Op.eq]: item.text}}))}
      : {};

    const {count, rows} = await Product.findAndCountAll({
      where: {isActive: true},
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
                  attributes: ['title', 'slug'],
                  where: {slug: subCategorySlug},
                },
                {
                  model: BrandCategory,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: MainCategory,
                      required: true,
                      attributes: ['title', 'slug'],
                      where: {slug: categorySlug},
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
        {
          model: ProductSubSpec,
          required: false,
          attributes: ['id', 'value'],
          include: [
            {
              model: SpecProduct,
              attributes: ['text'],
              where: filterCondition,
              required: true,
              include: [
                {
                  model: SpecSubcategory,
                  attributes: ['id'],
                  include: [{model: SpecItem, attributes: ['title']}],
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

//get product details/info
exports.getProductInfo = async (req, res, next) => {
  try {
    const {categorySlug, subCategorySlug, productSlug} = req.params;

    const result = await Product.findOne({
      where: {slug: productSlug},
      include: [
        {
          model: ProductSubCategory,
          attributes: ['id'],
          include: [
            {
              model: BrandCategorySub,
              attributes: ['id', 'subCategoryId'],
              include: [
                {
                  model: SubCategory,
                  attributes: ['title', 'slug'],
                  where: {slug: subCategorySlug},
                },
                {
                  model: BrandCategory,
                  attributes: ['id'],
                  include: [
                    {
                      model: MainCategory,
                      attributes: ['title', 'slug'],
                      where: {slug: categorySlug},
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
        {
          model: ProductImage,
        },
        {
          model: ProductDiscount,
          include: [
            {
              model: Discount,
            },
          ],
        },
      ],
    });

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({result});
  } catch (err) {
    console.log(err);

    res.status(500).json(resMsg.getMsg(500));
  }
};

//general
exports.getProductById = async (req, res, next) => {
  try {
    const result = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: ProductSubCategory,
          attributes: ['brandCategorySubId'],
          include: [
            {
              model: BrandCategorySub,
              attributes: ['id', 'brandCategoryId'],
              include: [{model: BrandCategory, attributes: ['brandId']}],
            },
          ],
        },
        {
          model: ProductImage,
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createProduct = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    // //get BCS Id by params
    const bcsId = req.params.id;

    const {title, price, description, qtyInStock} = req.body;

    const imgFiles = req.files?.map((file) => file.filename);

    const value = validateProduct({
      title: title,
      price: price,
      description: description,
      isActive: req.body.isActive,
      qtyInStock: qtyInStock,
    });

    // //Create Slug by title
    value.slug = generateSlug(value.title);
    // //generate productCode
    value.productCode = generateNumber.generateProductCode(6);

    const existingCode = await Product.findOne({
      where: {
        productCode: value.productCode,
      },
      transaction: t,
    });

    if (existingCode) {
      await t.rollback();
      return res.status(409).json(resMsg.getMsg(40900));
    }

    const product = await Product.create(value, {transaction: t});

    // //create PSC
    await ProductSubCategory.create(
      {
        productId: product.id,
        brandCategorySubId: bcsId,
      },
      {transaction: t}
    );
    //create Product Image
    const productURL = process.env.PRODUCT_IMAGE_URL;

    const data = [];

    for (let i = 0; i < imgFiles.length; i++) {
      data.push({productId: product.id, path: productURL + imgFiles[i]});
    }

    await ProductImage.bulkCreate(data, {transaction: t});

    // Commit the transaction
    await t.commit();

    // //getProductByPk
    const result = await Product.findByPk(product.id);

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    await t.rollback();
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.updateProduct = async (req, res, next) => {
  const pd = await sequelize.transaction();

  //review on edit need to update on productSubCategory by bcs id where product id
  try {
    const {bcsId} = req.body;
    const productID = req.params.id;
    const imageFile = req.files?.map((file) => file.filename);

    const value = validateProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      qtyInStock: req.body.qtyInStock,
    });

    //update product
    await Product.update(
      value,
      {
        where: {
          id: productID,
        },
      },
      {transaction: pd}
    );
    //find productSubCategory
    const psc = await ProductSubCategory.findOne({
      where: {productId: productID},
      transaction: pd,
    });
    if (!psc) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    const notSameId = psc.brandCategorySubId !== bcsId;
    //update productSubCategory (bcsId) if id exist
    if (notSameId) {
      await psc.update({brandCategorySubId: bcsId}, {transaction: pd});
    }

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
    console.log(err);

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

//GET ALL for Admin only
exports.getAllProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 4;

    //sorts
    const sorts = req.query.sorts ? JSON.parse(req.query.sorts) : {}; //{sortBy:'price',sortValue:'ASC'}

    const {sortBy = 'createdAt', sortValue = 'ASC'} = sorts;

    //search
    const searchQuery = req.query.search ? req.query.search : '';

    let whereConditions = {};

    //Filter Condition
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

    const {isActive = '', inStock = ''} = filters;

    if (filters.isActive !== '') {
      whereConditions.isActive = isActive;
    }

    //Instock
    if (inStock !== '') {
      if (inStock) {
        whereConditions.qtyInStock = {[Op.gte]: 1};
      } else {
        whereConditions.qtyInStock = {[Op.lte]: 0};
      }
    }

    if (searchQuery) {
      whereConditions.title = {[Op.like]: `%${searchQuery}%`};
    }

    //count product
    const count = await Product.count({
      where: whereConditions,
    });
    //fetch product
    const rows = await Product.findAll({
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
                  attributes: ['id', 'title'],
                },
                {
                  model: BrandCategory,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: Brand,
                      required: true,
                      attributes: ['id', 'title'],
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
          attributes: ['path'],
        },
        {
          model: ProductSubSpec,
          include: [
            {
              model: SpecProduct,
              attributes: ['id', 'text'],
              include: [
                {
                  model: SpecSubcategory,
                  attributes: ['specItemId', 'subCategoryId'],
                  include: [{model: SpecItem, attributes: ['title']}],
                },
              ],
            },
          ],
        },
      ],
      where: whereConditions,
      order: [[sortBy, sortValue]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    if (!rows) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    res.status(200).json({
      ...resMsg.getMsg(200),
      count: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
