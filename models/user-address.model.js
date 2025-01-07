module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define(
    'UserAddress',
    {
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {underscored: true}
  );

  UserAddress.associate = (db) => {
    UserAddress.belongsTo(db.Address, {
      foreignKey: {
        name: 'addressId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    UserAddress.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    UserAddress.hasOne(db.Checkout, {
      foreignKey: {
        name: 'shipmentAddressId',
      },
      as: 'addressShipmentCheckout',
      onDelete: 'RESTRICT',
    });
    UserAddress.hasOne(db.Checkout, {
      foreignKey: {
        name: 'billingAddressId',
      },
      as: 'addressBillingCheckout',
      onDelete: 'RESTRICT',
    });
    UserAddress.hasOne(db.OrderDetail, {
      foreignKey: {
        name: 'shipmentAddressId',
      },
      as: 'addressShipment',
      onDelete: 'RESTRICT',
    });
    UserAddress.hasOne(db.OrderDetail, {
      foreignKey: {
        name: 'billingAddressId',
      },
      as: 'addressBilling',
      onDelete: 'RESTRICT',
    });
  };
  return UserAddress;
};
