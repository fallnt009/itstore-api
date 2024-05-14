module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    'OrderDetail',
    {
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      senderAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverAddress: {
        type: DataTypes.STRING,
        allowNull: false,
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
  };

  return OrderDetail;
};
