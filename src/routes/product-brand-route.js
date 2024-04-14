const express = require('express');

const productBrandController = require('../controllers/products/product-brand-controller');

const router = express.Router();

router
  .route('/')
  .get(productBrandController.getAllProductBrand)
  .post(productBrandController.createProductBrand);

router
  .route('/:productBrandId')
  .get(productBrandController.getProductBrandById)
  .patch(productBrandController.updateProductBrand)
  .delete(productBrandController.deleteProductBrand);

module.exports = router;
