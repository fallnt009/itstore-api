module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      name: {type: DataTypes.STRING, allowNull: false},
      slug: {type: DataTypes.STRING, allowNull: false, unique: true},
      description: {type: DataTypes.STRING, allowNull: false},
    },
    {underscored: true}
  );

  Payment.associate = (db) => {
    Payment.hasOne(db.Checkout, {
      foreignKey: {
        name: 'paymentId',
      },
      onDelete: 'RESTRICT',
    });
    Payment.hasOne(db.UserPayment, {
      foreignKey: {
        name: 'paymentId',
      },
      onDelete: 'RESTRICT',
    });
  };
  return Payment;
};
