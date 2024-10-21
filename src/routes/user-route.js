const express = require('express');

const userController = require('../controllers/users/user-controller');
const authController = require('../controllers/auth/auth-controller');

const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

const {EMPLOYEE} = require('../config/constants');

const router = express.Router();

//If Login ?
router.use(authenticate);
//get User
router.route('/info/:userId').get(userController.getUserById);

//UPDATE PROFILE INFO WITH PICTURE
router
  .route('/updateinfo/:userId')
  .patch(upload.single('profileImage'), userController.updateProfile);

router.use(authController.restrictTo(EMPLOYEE));

router.route('/').get(userController.getAllUser);

module.exports = router;
