module.exports = (sequelize, DataTypes) => {
  const Checkout = sequelize.define('Checkout', {}, {underscored: true});

  Checkout.associate = (db) => {
    Checkout.belongsTo(db.UserAddress, {
      foreignKey: {
        name: 'shipmentAddressId',
      },
      as: 'checkoutShipmentAddress',
      onDelete: 'RESTRICT',
    });
    Checkout.belongsTo(db.UserAddress, {
      foreignKey: {
        name: 'billingAddressId',
      },
      as: 'checkoutBillingAddress',
      onDelete: 'RESTRICT',
    });
    Checkout.belongsTo(db.Service, {
      foreignKey: {
        name: 'serviceId',
      },
      onDelete: 'RESTRICT',
    });
    Checkout.belongsTo(db.Payment, {
      foreignKey: {
        name: 'paymentId',
      },
      onDelete: 'RESTRICT',
    });
    Checkout.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Checkout;
};
