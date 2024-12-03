const express = require('express');

const {EMPLOYEE} = require('../../../config/constants');

//middleware
const authenticate = require('../../../middlewares/authenticate');
const upload = require('../../../middlewares/upload');

//controllers
const authController = require('../../auth/controllers/auth.controller');
const productController = require('../controllers/product.controller');
const specController = require('../controllers/spec.controller');

const router = express.Router();

//product
//get new & sales home
router.route('/new').get(productController.getNewProduct);
router.route('/sales').get(productController.getSalesProduct);

//get productList
router
  .route('/categories/:categorySlug/:subCategorySlug')
  .get(productController.getProductBySubCategory); //new
//get product info
router
  .route('/categories/:categorySlug/:subCategorySlug/:productSlug')
  .get(productController.getProductInfo); //new

//get specItem , SpecProduct and spec text
router.route('/spec-items/sub/:slug').get(specController.getSpecItemBySlug); //new specItem by subCategorySlug
router
  .route('/spec-product/filter')
  .get(specController.getSpecProductForFilter); //new specproduct filter
router
  .route('/subspec/public/:id')
  .get(specController.getProductSubSpecByProductId); //get product subspec by product id

//for Admin below
router.use(authenticate);
router.use(authController.restrictTo(EMPLOYEE));
//fetch All product
router.route('/all').get(productController.getAllProduct);

//crud product
router.post(
  '/create/:id',
  upload.array('productImage', 4),
  productController.createProduct
);

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(upload.array('productImage', 4), productController.updateProduct)
  .delete(productController.deleteProduct);

//crud spec
//Product Spec Product
router.route('/specproduct').post(specController.createSpecProduct);
router
  .route('/specproduct/:id')
  .get(specController.getSpecSubcategoryById)
  .patch(specController.updateSpecProduct)
  .delete(specController.deleteSpecProduct);

//Product SUB SPEC
router
  .route('/subspec/:id')
  .get(specController.getProductSubSpecByProductId)
  .post(specController.createProductSubSpec)
  .delete(specController.deleteProductSubSpec);
//Product Spec
router.route('/product-spec').get(specController.getAllProductSpec);
router.route('/product-spec/:id').get(specController.getProductSpecById);
//SpecItem All
router
  .route('/spec-items')
  .get(specController.getAllSpecItems)
  .post(specController.createSpecItem);

router
  .route('/spec-items/:id')
  .get(specController.getSpecItemById)
  .patch(specController.updateSpecItem);

module.exports = router;
