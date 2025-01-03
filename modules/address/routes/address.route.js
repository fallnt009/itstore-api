const express = require('express');

const authenticate = require('../../../middlewares/authenticate');
const addressController = require('../controllers/address.controller');

const router = express.Router();

//If Login ?
router.use(authenticate);
router.route('/myaddress').get(addressController.getMyAddress);
router.route('/').post(addressController.createAddress);
router
  .route('/:id')
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

router.route('/default/:id').patch(addressController.updateAddressDefault);

module.exports = router;
