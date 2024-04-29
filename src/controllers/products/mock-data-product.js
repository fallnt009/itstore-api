const productData = require('../../data/product.json');
const brandData = require('../../data/brand.json');
const categoryData = require('../../data/category.json');
const subCategoryData = require('../../data/subCategory.json');
const brandCategoryData = require('../../data/brandCategory.json');
const brandCategorySubData = require('../../data/brandCategorySub.json');
const productSubCategoryData = require('../../data/productSubCategory.json');

const {
  Product,
  MainCategory,
  SubCategory,
  Brand,
  BrandCategory,
  BrandCategorySub,
  ProductSubCategory,
} = require('../../models');

exports.ProductData = async (req, res, next) => {
  try {
    const data = await Product.bulkCreate(productData);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};

exports.CategoryData = async (req, res, next) => {
  try {
    const data = await MainCategory.bulkCreate(categoryData);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};
exports.SubCategoryData = async (req, res, next) => {
  try {
    const data = await SubCategory.bulkCreate(subCategoryData);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};
exports.BrandData = async (req, res, next) => {
  try {
    const data = await Brand.bulkCreate(brandData);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};

exports.BrandCategoryData = async (req, res, next) => {
  try {
    const data = await BrandCategory.bulkCreate(brandCategoryData);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};
exports.BrandCategorySubData = async (req, res, next) => {
  try {
    const data = await BrandCategorySub.bulkCreate(brandCategorySubData);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};
exports.ProductSubCategoryData = async (req, res, next) => {
  try {
    const data = await ProductSubCategory.bulkCreate(productSubCategoryData);
    res.status(200).json({message: 'create success', data});
  } catch (err) {
    next(err);
  }
};
