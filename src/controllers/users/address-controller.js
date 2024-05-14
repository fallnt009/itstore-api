const {Address, UserAddress, sequelize} = require('../../models');
const {validateAddress} = require('../../validators/address-validate');
const createError = require('../../utils/create-error');

exports.createAddress = async (req, res, next) => {
  try {
    const value = validateAddress({
      unitNumber: req.body.unitNumber,
      streetNumber: req.body.streetNumber,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      region: req.body.region,
      postalCode: req.body.postalCode,
      country: req.body.country,
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

    res.status(201).json({message: 'Address Created'});
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
    const {count, rows: result} = await UserAddress.findAndCountAll({
      where: {
        userId: req.user.id,
      },
      include: [{model: Address}],
    });
    res.status(200).json({count, result});
  } catch (err) {
    next(err);
  }
};
