module.exports = (sequelize, DataTypes) => {
  const BrandCategory = sequelize.define(
    'BrandCategory',
    {},
    {underscored: true}
  );
  BrandCategory.associate = (db) => {
    BrandCategory.belongsTo(db.Brand, {
      foreignKey: {
        name: 'brandId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    BrandCategory.belongsTo(db.MainCategory, {
      foreignKey: {
        name: 'mainCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    BrandCategory.hasMany(db.BrandCategorySub, {
      foreignKey: {
        name: 'brandCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return BrandCategory;
};
