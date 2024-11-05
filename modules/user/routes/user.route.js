const express = require('express');

const userController = require('../controllers/user.controller');
const authController = require('../../auth/controllers/auth.controller');

const authenticate = require('../../../middlewares/authenticate');
const upload = require('../../../middlewares/upload');

const {EMPLOYEE} = require('../../../config/constants');

const router = express.Router();

//If Login ?
router.use(authenticate);

//UPDATE PROFILE INFO WITH PICTURE
router
  .route('/updateinfo/:userId')
  .patch(upload.single('profileImage'), userController.updateProfile);
router
  .route('/updateimg/:userId')
  .patch(upload.single('profileImage'), userController.updateProfileImage);

router.use(authController.restrictTo(EMPLOYEE));

router.route('/').get(userController.getAllUser);

module.exports = router;
