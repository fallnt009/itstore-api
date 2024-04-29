const {User} = require('../../models');

exports.getAllUser = async (req, res, next) => {
  try {
    const result = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
exports.updateProfileInfo = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.updateProfileImage = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
