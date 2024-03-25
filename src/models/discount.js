module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    'Discount',
    {
      type: {type: DataTypes.STRING},
      amount: {type: DataTypes.STRING},
    },
    {underscored: true}
  );
  Discount.associate = (db) => {
    Discount.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Discount;
};
