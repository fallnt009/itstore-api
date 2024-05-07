const {
  STATUS_PENDING,
  STATUS_CANCELED,
  STATUS_COMPLETED,
  BANKTRANSFER,
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const UserPayment = sequelize.define(
    'UserPayment',
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
      proofImage: {
        type: DataTypes.STRING,
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
  };
  return UserPayment;
};
