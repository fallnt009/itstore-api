module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    'Discount',
    {
      type: {},
      amount: {},
    },
    {underscored: true}
  );
  return Discount;
};
