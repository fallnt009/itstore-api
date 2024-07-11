const express = require('express');
const authenticate = require('../middlewares/authenticate');
const {EMPLOYEE} = require('../config/constants');

const authController = require('../controllers/auth/auth-controller');
const discountController = require('../controllers/products/discount-controller');
const productDiscountController = require('../controllers/products/product-discount-controller');

const router = express.Router();

//add authen and restrict middleware
router.use(authenticate);
router.use(authController.restrictTo(EMPLOYEE));

// /discount
router
  .route('/')
  .get(discountController.getAllDiscount)
  .post(discountController.createDiscount);
// /discount/:id
router
  .route('/:id')
  .get(discountController.getDiscountById)
  .patch(discountController.updateDiscount)
  .delete(discountController.deleteDiscount);

//product discount
router
  .route('/product')
  .get(productDiscountController.getAllProductDiscount)
  .post(productDiscountController.createProductDiscount);
router
  .route('/product/:id')
  .get(productDiscountController.getProductDiscount)
  .patch(productDiscountController.updateProductDiscount)
  .delete(productDiscountController.deleteProductDiscount);

module.exports = router;
