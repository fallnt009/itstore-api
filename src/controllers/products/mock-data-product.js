const productData = require('../../data/mock/productMock.json');
const categoryData = require('../../data/mock/category.json');
const subCategoryData = require('../../data/mock/subCategory.json');
const brandData = require('../../data/mock/brand.json');
const BrandCategoryData = require('../../data/mock/brandCategory.json');
const BrandCategorySubData = require('../../data/mock/brandCategorySub.json');
const ProductSubCategoryData = require('../../data/mock/productSubCategory.json');
const specItemsData = require('../../data/mock/specItems.json');
const specSubCategoryData = require('../../data/mock/specSubcategory.json');
const specProductData = require('../../data/mock/specProduct.json');
const subSpecData = require('../../data/mock/productSubSpec.json');

const {
  Product,
  MainCategory,
  SubCategory,
  Brand,
  BrandCategory,
  BrandCategorySub,
  ProductSubCategory,
  SpecItem,
  SpecSubcategory,
  SpecProduct,
  ProductSubSpec,
} = require('../../models');

const resMsg = require('../../config/messages');

exports.MockMainData = async (req, res, next) => {
  try {
    //product
    await Product.bulkCreate(productData);
    //category
    await MainCategory.bulkCreate(categoryData);
    //subCategory
    await SubCategory.bulkCreate(subCategoryData);
    //Brand
    await Brand.bulkCreate(brandData);
    //spec items
    await SpecItem.bulkCreate(specItemsData);

    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.MockAssociateData = async (req, res, next) => {
  try {
    //BrandCategory
    await BrandCategory.bulkCreate(BrandCategoryData);
    //Brand Category Sub
    await BrandCategorySub.bulkCreate(BrandCategorySubData);
    //Product Sub
    await ProductSubCategory.bulkCreate(ProductSubCategoryData);
    //spec sub
    await SpecSubcategory.bulkCreate(specSubCategoryData);
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//mock spec product

exports.MockSpecProduct = async (req, res, next) => {
  try {
    await SpecProduct.bulkCreate(specProductData);
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.MockSubSpec = async (req, res, next) => {
  try {
    await ProductSubSpec.bulkCreate(subSpecData);
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
