const express = require('express');
const {EMPLOYEE} = require('../config/constants');

const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

const specController = require('../controllers/products/product-spec-controller');
const productController = require('../controllers/products/product-controller');
const imageContoller = require('../controllers/products/product-image-controller');
const authController = require('../controllers/auth/auth-controller');

const router = express.Router();

//Product Spec ,spec Item and image
router.route('/spec-items/:id').get(specController.getSpecItemById);
router.route('/spec-prod/:productName').get(specController.getProductSpec);
router.route('/image/:productName').get(imageContoller.getProductImage);
//GET new product
router.route('/new').get(productController.getNewProduct);
router.route('/sales').get(productController.getSalesProduct);
//GET productFilter
router
  .route('/filter/:subCategoryName')
  .get(productController.getProductFilter);

//Protected Route
router.use(authenticate);
//Only EMPLOYEE
router.use(authController.restrictTo(EMPLOYEE));

//Product CRUD
router.post('/create/:id', productController.createProduct);
//create images
router
  .route('/img/:id')
  .post(upload.array('productImage', 4), imageContoller.createProductImage);
router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
