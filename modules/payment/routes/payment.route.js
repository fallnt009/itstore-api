const express = require('express');

const authenticate = require('../../../middlewares/authenticate');
const upload = require('../../../middlewares/upload');

const paymentController = require('../controllers/payment.controller');
const userPaymentController = require('../controllers/user-payment.controller');

const router = express.Router();

router.use(authenticate);
//payment
router
  .route('/')
  .get(paymentController.getAllPayment)
  .post(paymentController.createPayment);
router
  .route('/:id')
  .patch(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

//userpayment by orderId
router
  .route('/user/:userPaymentId')
  .patch(
    upload.single('paymentImage'),
    userPaymentController.updateUserPayment
  );
router
  .route('/user/pay/:orderId')
  .get(userPaymentController.getUserPaymentByOrderId);

//verifier
router
  .route('/user/verify/:userId')
  .patch(userPaymentController.updateVerifier);

module.exports = router;
