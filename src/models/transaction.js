const {
  STATUS_PENDING,
  STATUS_CANCELED,
  STATUS_COMPLETED,
  BANKTRANSFER,
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_type: {
        type: DataTypes.ENUM(BANKTRANSFER),
        allowNull: false,
        defaultValue: BANKTRANSFER,
      },
      payment_status: {
        type: DataTypes.ENUM(STATUS_PENDING, STATUS_CANCELED, STATUS_COMPLETED),
        allowNull: false,
        defaultValue: STATUS_PENDING,
      },
      slip_image: {
        type: DataTypes.STRING,
      },
    },
    {underscored: true}
  );
  Transaction.associate = (db) => {
    Transaction.belongsTo(db.Order, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Transaction;
};
