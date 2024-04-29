module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    'Discount',
    {
      type: {type: DataTypes.STRING, allowNull: false},
      amount: {type: DataTypes.STRING, allowNull: false},
      startDate: {type: DataTypes.DATE},
      endDate: {type: DataTypes.DATE},
    },
    {underscored: true}
  );

  Discount.associate = (db) => {
    Discount.hasOne(db.ProductDiscount, {
      foreignKey: {
        name: 'discountId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return Discount;
};
