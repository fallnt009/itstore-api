const express = require('express');

const authenticate = require('../../../middlewares/authenticate');

const checkoutController = require('../controllers/checkout.controller');
const serviceController = require('../controllers/service.controller');
const paymentController = require('../controllers/payment.controller');

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
  .get(serviceController.getAllService)
  .post(serviceController.createService);
router
  .route('/service/:id')
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);
//payment
router
  .route('/payment')
  .get(paymentController.getAllPayment)
  .post(paymentController.createPayment);
router
  .route('/payment/:id')
  .patch(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

module.exports = router;
