module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    'Discount',
    {
      type: {type: DataTypes.STRING},
      amount: {type: DataTypes.STRING},
    },
    {underscored: true}
  );
  return Discount;
};
