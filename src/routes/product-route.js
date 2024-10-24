const express = require('express');

const {EMPLOYEE} = require('../config/constants');

const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

const specController = require('../controllers/products/product-spec-controller');
const productController = require('../controllers/products/product-controller');
const imageController = require('../controllers/products/product-image-controller');
const authController = require('../controllers/auth/auth-controller');
const subSpecController = require('../controllers/products/product-subspec-controller');
const specProductController = require('../controllers/products/spec-product-controller');

const router = express.Router();

//get SpecProduct for filter on Category
router
  .route('/specproduct/filter')
  .get(specProductController.getSpecProductForFilter); //

//subSpec Public
router
  .route('/subspec/public/:id')
  .get(subSpecController.getProductSubSpecByProductId); //

//Product Spec ,spec Item and image
router
  .route('/spec-product/:id')
  .get(specProductController.getSpecProductbyItemId);

router.route('/spec-prod/:productName').get(specController.getProductSpec);
//GET SPEC ITEM BY SUBCATEGORY ID
router
  .route('/spec-items/sub/:id')
  .get(specController.getSpecItemBySubCategoryId);
//GET SPEC ITEM By Subcategory Slug
router
  .route('/spec-items/subcategory/:slug')
  .get(specController.getSpecItemBySlug);
//GET PRODUCT IMAGE BY PRODUCT NAME
router.route('/image/:productName').get(imageController.getProductImage);
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

//Product Spec Product
router.route('/specproduct').post(specProductController.createSpecProduct);
router
  .route('/specproduct/:id')
  .get(specProductController.getSpecSubcategoryById)
  .patch(specProductController.updateSpecProduct)
  .delete(specProductController.deleteSpecProduct);

//Product SUB SPEC
router
  .route('/subspec/:id')
  .get(subSpecController.getProductSubSpecByProductId)
  .post(subSpecController.createProductSubSpec)
  .delete(subSpecController.deleteProductSubSpec);
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
//Product CRUD
router.post(
  '/create/:id',
  upload.array('productImage', 4),
  productController.createProduct
);
//create images
router
  .route('/img/:id')
  .post(upload.array('productImage', 4), imageController.createProductImage);
router.route('/all').get(productController.getAllProduct);

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(upload.array('productImage', 4), productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
