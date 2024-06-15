const {User} = require('../../models');
const fs = require('fs');
const createError = require('../../utils/create-error');

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
    //check image if uploaded
    if (!req.file) {
      createError('Image is required!', 400);
    }

    //Get image
    const imageName = req.file.filename;
    //Make URL
    const url = process.env.USER_IMAGE_URL + imageName;

    //Update user profileImage
    await User.update({profileImage: url}, {where: {id: req.user.id}});

    //Response
    res.status(200).json({message: 'Update Image Success'});
  } catch (err) {
    next(err);
  }
  // finally {
  //   if (req.file) {
  //     fs.unlinkSync(req.file.path);
  //   }
  // }
};
exports.deleteUser = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
