const {
  Checkout,
  Service,
  Payment,
  UserAddress,
  sequelize,
} = require('../../models');
const createError = require('../../utils/create-error');

//GET MY CHECKOUT
exports.getMyCheckout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await Checkout.findAll({
      where: {userId: userId},
      include: [
        {
          model: Service,
        },
        {
          model: Payment,
        },
      ],
    });
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};

//CREATE CHECKOUT
exports.createCheckout = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  //One account per 1 checkout
  try {
    const userid = req.user.id;

    //Check UserAddress if already have any default address
    const useraddress = await UserAddress.findOne({
      where: {userId: userid, isDefault: true},
      transaction,
    });

    //check if useraddress default valid return id else null
    const useraddressId = useraddress ? useraddress.id : null;
    //if already have Check out with this user Id
    const existingCheckout = await Checkout.findOne({
      where: {userId: userid},
      transaction,
    });

    if (!existingCheckout) {
      //if checkout not exist
      const newCheckout = await Checkout.create(
        {
          userAddressId: useraddressId,
          serviceId: null,
          paymentId: null,
          userId: userid,
        },
        {transaction}
      );
      //get result
      const result = await Checkout.findOne({
        where: {id: newCheckout.id},
        transaction,
      });

      await transaction.commit();
      res.status(200).json({result});
    } else {
      //if already exist
      await transaction.commit();

      res.status(200).json({result: existingCheckout});
    }
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

//UPDATE CHECKOUT
exports.updateCheckout = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const userid = req.user.id;
    const checkoutId = req.params.id;
    //find Checkout is exist
    const existingCheckout = await Checkout.findOne({
      where: {userId: userid, id: checkoutId},
      transaction,
    });
    if (!existingCheckout) {
      await transaction.rollback();
      createError('Checkout not found', 404);
    }

    await Checkout.update(
      {
        userAddressId: req.body.userAddressId,
        serviceId: req.body.serviceId,
        paymentId: req.body.paymentId,
      },
      {
        where: {
          id: checkoutId,
        },
        transaction,
      }
    );
    //get result
    const result = await Checkout.findOne({
      where: {id: checkoutId},
      transaction,
    });

    await transaction.commit();

    res.status(200).json({result});
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
//DELETE CHECKOUT
exports.deleteCheckout = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const userid = req.user.id;
    const checkoutId = req.params.id;
    //find Checkout is exist
    const existingCheckout = await Checkout.findOne({
      where: {userId: userid, id: checkoutId},
      transaction,
    });
    if (!existingCheckout) {
      await transaction.rollback();
      createError('Checkout not found', 404);
    }
    await existingCheckout.destroy({transaction});
    await transaction.commit();

    res.status(204).json({});
  } catch (err) {
    await transaction.rollback();

    next(err);
  }
};
