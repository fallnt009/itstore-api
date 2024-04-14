const express = require('express');

const productController = require('../controllers/products/product-controller');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProduct)
  .post(productController.createProduct);

router
  .route('/:productId')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
