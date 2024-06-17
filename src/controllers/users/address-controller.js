const {Address, UserAddress, sequelize} = require('../../models');
const {validateAddress} = require('../../validators/address-validate');
const createError = require('../../utils/create-error');

exports.createAddress = async (req, res, next) => {
  try {
    const value = validateAddress({
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      province: req.body.province,
      postalCode: req.body.postalCode,
    });
    //find and count User Address
    const {count: addressCount} = await UserAddress.findAndCountAll({
      where: {
        userId: req.user.id,
      },
    });
    //Define maximum address limit
    const MAX_ADDRESS_LIMIT = 4;

    if (addressCount >= MAX_ADDRESS_LIMIT) {
      createError('Maximum Address limit reached');
    }

    //create Address
    const newAddress = await Address.create(value);
    //create userAddress
    await UserAddress.create({
      addressId: newAddress.id,
      userId: req.user.id,
    });

    //get recently created Address
    const result = await Address.findOne({where: {id: newAddress.id}});

    res.status(201).json({result});
  } catch (err) {
    next(err);
  }
};
exports.deleteAddress = async (req, res, next) => {
  try {
    const del = await sequelize.transaction();
    try {
      const existAddress = await UserAddress.findOne({
        where: {
          userId: req.user.id,
          addressId: req.params.id,
        },
        transaction: del,
      });
      if (!existAddress) {
        createError('Address not exist', 400);
      }

      //delete UserAddress entry
      await existAddress.destroy({transaction: del});
      //Delete Address

      await Address.destroy({
        where: {id: req.params.id},
        transaction: del,
      });
      //commit transaction
      await del.commit();
      //res no content
      res.status(204).json();
    } catch (err) {
      await del.rollback();
      throw err;
    }
  } catch (err) {
    //rollback if error
    next(err);
  }
};
exports.getMyAddress = async (req, res, next) => {
  try {
    const result = await Address.findAll({
      include: [
        {
          model: UserAddress,
          where: {userId: req.user.id},
          required: true,
        },
      ],
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

exports.updateAddressDefault = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    //check if useraddress exist
    const userAddress = await UserAddress.findOne({
      where: {addressId: req.params.id, userId: req.user.id},
      transaction: t,
    });
    if (!userAddress) {
      await t.rollback();
      createError('Data Not found', 404);
    }
    //update userAddress that already default
    await UserAddress.update(
      {isDefault: false},
      {where: {userId: req.user.id, isDefault: true}, transaction: t}
    );
    //update selected address
    await userAddress.update({isDefault: true}, {transaction: t});
    //find address that isDefault true
    const result = await Address.findOne({
      where: {id: req.params.id},
      include: [
        {
          model: UserAddress,
          where: {userId: req.user.id, isDefault: true},
          requried: true,
        },
      ],
      transaction: t,
    });

    await t.commit();
    res.status(200).json({result});
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
