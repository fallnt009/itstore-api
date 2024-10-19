const express = require('express');

const userController = require('../controllers/users/user-controller');
const authController = require('../controllers/auth/auth-controller');

const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

const {EMPLOYEE} = require('../config/constants');

const router = express.Router();

//If Login ?
router.use(authenticate);

// router.route('/updateme').patch(userController.updateProfileInfo);
// router.patch(
//   '/updateimg',
//   upload.single('profileImage'),
//   userController.updateProfileImage
// );

//UPDATE PROFILE INFO WITH PICTURE
router.route('/updateinfo/:userId').patch(userController.updateProfile);

router.use(authController.restrictTo(EMPLOYEE));

router.route('/').get(userController.getAllUser);

module.exports = router;
