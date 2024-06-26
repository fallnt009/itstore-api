module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      name: {type: DataTypes.STRING, allowNull: false},
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
  };
  return Payment;
};
