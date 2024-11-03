module.exports = (sequelize, DataTypes) => {
  const ProductSubCategory = sequelize.define(
    'ProductSubCategory',
    {},
    {underscored: true}
  );
  ProductSubCategory.associate = (db) => {
    ProductSubCategory.belongsTo(db.BrandCategorySub, {
      foreignKey: {
        name: 'brandCategorySubId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    ProductSubCategory.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return ProductSubCategory;
};
