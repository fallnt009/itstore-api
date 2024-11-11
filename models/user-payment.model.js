const {
  TRANSACTION_PENDING,
  TRANSACTION_AWAITING,
  TRANSACTION_COMPLETED,
  TRANSACTION_REJECTED,
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const UserPayment = sequelize.define(
    'UserPayment',
    {
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM(
          TRANSACTION_PENDING,
          TRANSACTION_AWAITING,
          TRANSACTION_COMPLETED,
          TRANSACTION_REJECTED
        ),
        allowNull: false,
        defaultValue: TRANSACTION_PENDING,
      },
      paymentDate: {
        type: DataTypes.DATE,
      },
      proofImage: {
        type: DataTypes.STRING,
      },
      imageUploadDate: {
        type: DataTypes.DATE,
      },
      verifyDate: {
        type: DataTypes.DATE,
      },
    },
    {underscored: true}
  );
  UserPayment.associate = (db) => {
    UserPayment.hasOne(db.Order, {
      foreignKey: {
        name: 'userPaymentId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    UserPayment.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    UserPayment.belongsTo(db.User, {
      foreignKey: {
        name: 'verifierId',
      },
      onDelete: 'RESTRICT',
    });
    UserPayment.belongsTo(db.Payment, {
      foreignKey: {
        name: 'paymentId',
      },
      onDelete: 'RESTRICT',
    });
  };
  return UserPayment;
};
