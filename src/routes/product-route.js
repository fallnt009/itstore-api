const express = require('express');
const {EMPLOYEE} = require('../config/constants');

const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

const specController = require('../controllers/products/product-spec-controller');
const productController = require('../controllers/products/product-controller');
const authController = require('../controllers/auth/auth-controller');

const router = express.Router();

//Product Spec and Spec Item
router
  .route('/spec-items/:subCategoryName')
  .get(specController.getSpecItemBySubCategory);
// .post(specController.mockSpecItem);
router
  .route('/product-spec/:productName')
  .get(specController.getProductSpec)
  .post(specController.mockProductSpec);
//GET new product
router.route('/new').get(productController.getNewProduct);

//Protected Route
router.use(authenticate);
//Only EMPLOYEE
router.use(authController.restrictTo(EMPLOYEE));

//Product CRUD
router.post(
  '/',
  upload.array('productImage', 4),
  productController.createProduct
);
router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
