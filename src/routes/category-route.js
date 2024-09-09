const express = require('express');

const productController = require('../controllers/products/product-controller');
const brandController = require('../controllers/products/brand-controller');
const categoryController = require('../controllers/products/category-controller');

const router = express.Router();

//get BCS
router.route('/bcs').get(categoryController.getBrandCategorySub);
//Brand tag
router.route('/brandtag').post(brandController.createBrandTags);
router.route('/brandtag/:id').get(brandController.getBrandTag);
router.route('/brandtag/bcs/:id').get(brandController.getBrandTagById);

//Main Category Route
router
  .route('/category')
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory);
router
  .route('/category/:id')
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);
//Sub Category Route

router
  .route('/sub-category')
  .get(categoryController.getAllSubCategory)
  .post(categoryController.createSubCategory);

//get SubCategory by Main Category
router
  .route('/sub-category/:id')
  .get(categoryController.getSubCategoryByMainCategory)
  .patch(categoryController.updateSubCategory)
  .delete(categoryController.deleteSubCategory);

//Brand
router
  .route('/brand')
  .get(brandController.getAllBrand)
  .post(brandController.createBrand);
router
  .route('/brand/:id')
  .get(brandController.getOneBrand)
  .patch(brandController.updateBrand)
  .delete(brandController.deleteBrand);

//GET by Main and Sub Category
router
  .route('/product/:categorySlug/:subCategorySlug')
  .get(productController.getProductBySubCategory);

router
  .route('/product/:categorySlug/:subCategorySlug/:productSlug')
  .get(productController.getProductInfo);

module.exports = router;
