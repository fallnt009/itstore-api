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
      paymentType: {
        type: DataTypes.ENUM(BANKTRANSFER),
        allowNull: false,
        defaultValue: BANKTRANSFER,
      },
      paymentStatus: {
        type: DataTypes.ENUM(STATUS_PENDING, STATUS_CANCELED, STATUS_COMPLETED),
        allowNull: false,
        defaultValue: STATUS_PENDING,
      },
      paymentDate: {
        type: DataTypes.DATE,
      },
      slipImage: {
        type: DataTypes.STRING,
      },
    },
    {underscored: true}
  );
  Transaction.associate = (db) => {
    Transaction.hasOne(db.Order, {
      foreignKey: {
        name: 'transactionId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Transaction;
};
