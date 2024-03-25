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
        Type: DataTypes.STRING,
        allowNull: false,
      },
      payment_type: {
        Type: DataTypes.ENUM(BANKTRANSFER),
        allowNull: false,
        defaultValue: BANKTRANSFER,
      },
      payment_status: {
        Type: DataTypes.ENUM(STATUS_PENDING, STATUS_CANCELED, STATUS_COMPLETED),
        allowNull: false,
        defaultValue: STATUS_PENDING,
      },
      slip_image: {
        Type: DataTypes.STRING,
      },
    },
    {underscored: true}
  );
  return Transaction;
};
