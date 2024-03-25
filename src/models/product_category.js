module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    'ProductCategory',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );
  ProductCategory.associate = (db) => {
    ProductCategory.hasOne(db.Product, {
      foreignKey: {
        name: 'productCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return ProductCategory;
};
