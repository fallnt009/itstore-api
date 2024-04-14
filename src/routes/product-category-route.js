const express = require('express');

const productCategoryController = require('../controllers/products/product-category-controller');

const router = express.Router();

router
  .route('/')
  .get(productCategoryController.getAllProductCategory)
  .post(productCategoryController.createProductCategory);

router
  .route('/:productCategoryId')
  .get(productCategoryController.getProductCategoryById)
  .patch(productCategoryController.updateProductCategory)
  .delete(productCategoryController.deleteProductCategory);

module.exports = router;
