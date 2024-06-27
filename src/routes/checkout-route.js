const express = require('express');

const authenticate = require('../middlewares/authenticate');

const checkoutController = require('../controllers/checkout/checkout-controller');
const serviceController = require('../controllers/checkout/service-controller');
const paymentController = require('../controllers/checkout/payment-controller');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .get(checkoutController.getMyCheckout)
  .post(checkoutController.createCheckout);

router
  .route('/:id')
  .patch(checkoutController.updateCheckout)
  .delete(checkoutController.deleteCheckout);

//service
router
  .route('/service')
  .get(serviceController.getService)
  .post(serviceController.createService);
router
  .route('/service/:id')
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);
//payment
router
  .route('/payment')
  .get(paymentController.getPayment)
  .post(paymentController.createPayment);
router
  .route('/payment/:id')
  .patch(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

module.exports = router;
