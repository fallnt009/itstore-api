const express = require('express');

const mockProductController = require('../controllers/products/mock-data-product');

const router = express.Router();

router.route('/product-data').post(mockProductController.ProductData);
router.route('/category-data').post(mockProductController.CategoryData);
router.route('/subcategory-data').post(mockProductController.SubCategoryData);
router.route('/brand-data').post(mockProductController.BrandData);
router
  .route('/brand-category-data')
  .post(mockProductController.BrandCategoryData);
router
  .route('/brand-categorysub-data')
  .post(mockProductController.BrandCategorySubData);
router
  .route('/productsub-data')
  .post(mockProductController.ProductSubCategoryData);

module.exports = router;
