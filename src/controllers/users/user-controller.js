const {User} = require('../../models');
const createError = require('../../utils/create-error');
const resMsg = require('../../config/messages');

exports.getAllUser = async (req, res, next) => {
  try {
    const result = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateProfileInfo = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.updateProfileImage = async (req, res, next) => {
  try {
    //check image if uploaded
    if (!req.file) {
      return res.status(403).json(resMsg.getMsg(40300));
    }

    //Get image
    const imageName = req.file.filename;
    //Make URL
    const url = process.env.USER_IMAGE_URL + imageName;

    //Update user profileImage
    await User.update({profileImage: url}, {where: {id: req.user.id}});

    //Response
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
