const express = require('express');

const userController = require('../controllers/users/user-controller');

const router = express.Router();

router
  .route('/:userId')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
