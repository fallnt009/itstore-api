const express = require('express');

const authenticate = require('../../../middlewares/authenticate');
const upload = require('../../../middlewares/upload');

const paymentController = require('../controllers/payment.controller');
const userPaymentController = require('../controllers/user-payment.controller');

const router = express.Router();

router.route('/user/:userId').patch(
  upload.single('paymentProofImage'),
  userPaymentController.updateUserPayment //for upload proof public
);

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

//verifier
router
  .route('/user/verify/:userId')
  .patch(userPaymentController.updateVerifier);

module.exports = router;
