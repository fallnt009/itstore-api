const express = require('express');

const productController = require('../controllers/products/product-controller');
const brandController = require('../controllers/products/brand-controller');
const categoryController = require('../controllers/products/category-controller');

const router = express.Router();

router.route('/bcs').get(categoryController.getBrandCategorySub);

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
router
  .route('/sub-category/:id')
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
  .route('/product/:categoryName/:subCategoryName')
  .get(productController.getProductBySubCategory);

router
  .route('/product/:categoryName/:subCategoryName/:productName')
  .get(productController.getProductInfo);

module.exports = router;
