const {
  Checkout,
  Service,
  Payment,
  UserAddress,
  Address,
  sequelize,
} = require('../../models');
const resMsg = require('../../config/messages');

//GET MY CHECKOUT
exports.getMyCheckout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await Checkout.findOne({
      where: {userId: userId},
      include: [
        {
          model: UserAddress,
          include: [{model: Address}],
        },
        {
          model: Service,
        },
        {
          model: Payment,
        },
      ],
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      res.status(200).json({...resMsg.getMsg(200), result});
    } else {
      //if already exist
      await transaction.commit();

      res.status(200).json({...resMsg.getMsg(200), result: existingCheckout});
    }
  } catch (err) {
    await transaction.rollback();
    res.status(500).json(resMsg.getMsg(500));
  }
};

//UPDATE CHECKOUT
exports.updateCheckout = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const userid = req.user.id;
    const checkoutId = req.params.id;

    const {userAddressId, serviceId, paymentId} = req.body;
    //find Checkout is exist
    const existingCheckout = await Checkout.findOne({
      where: {userId: userid, id: checkoutId},
      transaction,
    });
    if (!existingCheckout) {
      await transaction.rollback();
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await Checkout.update(
      {
        userAddressId: userAddressId,
        serviceId: serviceId,
        paymentId: paymentId,
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

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    await transaction.rollback();
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }
    await existingCheckout.destroy({transaction});
    await transaction.commit();

    res.status(204).json({});
  } catch (err) {
    await transaction.rollback();
    res.status(500).json(resMsg.getMsg(500));
  }
};
