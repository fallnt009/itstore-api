module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    'OrderDetail',
    {
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      deliveryDate: {
        type: DataTypes.DATE,
      },
      eddDate: {
        type: DataTypes.DATE,
      },
      deliveryName: {
        type: DataTypes.STRING,
      },
      trackingNumber: {
        type: DataTypes.STRING,
      },
    },
    {underscored: true}
  );
  OrderDetail.associate = (db) => {
    OrderDetail.hasOne(db.Order, {
      foreignKey: {
        name: 'orderDetailId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    OrderDetail.belongsTo(db.UserAddress, {
      foreignKey: {
        name: 'shipmentAddressId',
      },
      as: 'shipmentAddress',

      onDelete: 'RESTRICT',
    });
    OrderDetail.belongsTo(db.UserAddress, {
      foreignKey: {
        name: 'billingAddressId',
      },
      as: 'billingAddress',
      onDelete: 'RESTRICT',
    });
    OrderDetail.belongsTo(db.Service, {
      foreignKey: {
        name: 'serviceId',
      },
      onDelete: 'RESTRICT',
    });
  };

  return OrderDetail;
};
