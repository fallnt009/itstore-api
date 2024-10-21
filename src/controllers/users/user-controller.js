const fs = require('fs');
const path = require('path');
const {User} = require('../../models');

const {validateProfile} = require('../../validators/user-validate');

const resMsg = require('../../config/messages');

//TEST
exports.getUserById = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);

    //get token form headers
    //decode
    //need id from jwt
    const result = await User.findOne({});
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

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
// exports.updateProfileInfo = async (req, res, next) => {
//   try {
//     //deprecated
//   } catch (err) {
//     res.status(500).json(resMsg.getMsg(500));
//   }
// };
// exports.updateProfileImage = async (req, res, next) => {
//   try {
//     //deprecated

//     //check image if uploaded
//     if (!req.file) {
//       return res.status(403).json(resMsg.getMsg(40300));
//     }

//     //Get image
//     const imageName = req.file.filename;
//     //Make URL
//     const url = process.env.USER_IMAGE_URL + imageName;

//     //Update user profileImage
//     await User.update({profileImage: url}, {where: {id: req.user.id}});

//     //Response
//     res.status(200).json(resMsg.getMsg(200));
//   } catch (err) {
//     res.status(500).json(resMsg.getMsg(500));
//   }
// };
exports.updateProfile = async (req, res, next) => {
  try {
    const {userId} = req.params;

    const imgFile = req.file;

    const profileImg = process.env.USER_IMAGE_URL;

    //validate
    const value = validateProfile({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
    });

    const currentUser = await User.findOne({where: {id: userId}});
    const oldImage = currentUser ? currentUser.profileImage : null;

    //+add profileImage
    if (imgFile) {
      value.profileImage = profileImg + imgFile.filename;

      if (oldImage) {
        console.log('Deleting old image...');

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
      }
    } // if delete image and have old image in proceed to set to null
    //null are string because append formData
    else if (req.body.profileImage === 'null' && oldImage) {
      console.log('Removing existing image...');

      //set value Null
      value.profileImage = null;

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
      //delete file
      fs.unlink(oldImgPath, (err) => {
        if (err) {
          console.error(`Failed to delete old image: ${err.message}`);
        } else {
          console.log(`Successfully deleted old image: ${oldImgPath}`);
        }
      });
    }

    //updates USER
    await User.update(value, {where: {id: userId}});

    //get updated USER
    const result = await User.findOne({where: {id: userId}});
    // console.log(result);

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    console.log(err);

    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
