const fs = require('fs');
const path = require('path');

const {User} = require('../../../models');

const {validateProfile} = require('../validators/user-validate');

const resMsg = require('../../../config/messages');

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

exports.updateProfile = async (req, res, next) => {
  try {
    const {userId} = req.params;

    //validate
    const value = validateProfile({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
    });

    const checkUser = await User.findOne({where: {id: userId}});

    if (!checkUser) {
      //404
      return res.status(404).json(resMsg.getMsg(40401));
    }

    //updates USER
    await User.update(value, {where: {id: userId}});

    //get updated USER
    const result = await User.findOne({where: {id: userId}});

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const imgFile = req.file;
    const profileImgURL = process.env.USER_IMAGE_URL;

    //check current user image

    const checkUser = await User.findOne({where: {id: userId}});

    if (!checkUser) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    const oldImage = checkUser.profileImage;
    let newProfileImage = oldImage;

    // Handle new image upload
    if (imgFile) {
      newProfileImage = profileImgURL + imgFile.filename;

      if (oldImage) {
        deleteOldImage(oldImage);
      }
    }
    // Handle image deletion if 'null' is sent in body
    else if (req.body.profileImage === 'null' && oldImage) {
      newProfileImage = null;
      deleteOldImage(oldImage);
    }

    //updates USER
    await User.update({profileImage: newProfileImage}, {where: {id: userId}});

    //get updated USER
    const result = await User.findOne({where: {id: userId}});

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    //under constuction
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//helper
const deleteOldImage = (oldImage) => {
  const oldImgPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'images',
    'profile',
    path.basename(oldImage)
  );

  fs.unlink(oldImgPath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err.message}`);
    } else {
      console.log(`Successfully deleted old image: ${oldImgPath}`);
    }
  });
};
