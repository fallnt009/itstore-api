const express = require('express');
const authenticate = require('../middlewares/authenticate');
const {EMPLOYEE} = require('../config/constants');

const productController = require('../controllers/products/product-controller');
const authController = require('../controllers/auth/auth-controller');

const router = express.Router();

//GET new product
router.route('/new').get(productController.getNewProduct);
//GET By Main Category
router
  .route('/category/:categoryName')
  .get(productController.getProductByCategory);
//GET by Main and Sub Category
router
  .route('/category/:categoryName/:subCategoryName')
  .get(productController.getProductBySubCategory);

//Protected Route
router.use(authenticate);
//Only EMPLOYEE
router.use(authController.restrictTo(EMPLOYEE));

//Product CRUD
router.route('/').post(productController.createProduct);
router
  .route('/:productId')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
