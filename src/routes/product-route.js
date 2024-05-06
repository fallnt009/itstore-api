const express = require('express');
const authenticate = require('../middlewares/authenticate');
const {EMPLOYEE} = require('../config/constants');

const specController = require('../controllers/products/product-spec-controller');
const productController = require('../controllers/products/product-controller');
const authController = require('../controllers/auth/auth-controller');

const router = express.Router();

//Product Spec and Spec Item
router
  .route('/spec-items')
  .get(specController.getSpecItemBySubCategory)
  .post(specController.createSpecItem);
router
  .route('/product-spec')
  .get(specController.getProductSpec)
  .post(specController.createProductSpec);
//GET new product
router.route('/new').get(productController.getNewProduct);

//Protected Route
router.use(authenticate);
//Only EMPLOYEE
router.use(authController.restrictTo(EMPLOYEE));

//Product CRUD
router.route('/').post(productController.createProduct);
router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
