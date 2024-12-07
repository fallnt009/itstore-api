const express = require('express');

const brandController = require('../controllers/brand.controller');
const mainCategoryController = require('../controllers/main-category.controller');
const subCategoryController = require('../controllers/sub-category.controller');
const brandCategorySubController = require('../controllers/brand-category-sub.controller');

const router = express.Router();

//get BCS
router.route('/bcs').get(brandCategorySubController.getBrandCategorySub);
//Brand tag
router.route('/brandtag').post(brandController.createBrandTags);
router.route('/brandtag/:id').get(brandController.getBrandTag);
router.route('/brandtag/bcs/:id').get(brandController.getBrandTagById);

//Main Category Route
router
  .route('/category')
  .get(mainCategoryController.getAllCategory)
  .post(mainCategoryController.createCategory);
router
  .route('/category/:id')
  .patch(mainCategoryController.updateCategory)
  .delete(mainCategoryController.deleteCategory);
//Sub Category Route

router
  .route('/sub-category')
  .get(subCategoryController.getAllSubCategory)
  .post(subCategoryController.createSubCategory);

//get SubCategory by Main Category
router
  .route('/sub-category/:id')
  .get(subCategoryController.getSubCategoryByMainCategory)
  .patch(subCategoryController.updateSubCategory)
  .delete(subCategoryController.deleteSubCategory);

//Brand
router
  .route('/brand')
  .get(brandController.getAllBrand)
  .post(brandController.createBrand);
router
  .route('/brand/:id')
  // .get(brandController.getOneBrand)
  .patch(brandController.updateBrand);
// .delete(brandController.deleteBrand);

module.exports = router;
