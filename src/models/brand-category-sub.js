module.exports = (sequelize, DataTypes) => {
  const BrandCategorySub = sequelize.define(
    'BrandCategorySub',
    {},
    {underscored: true}
  );
  BrandCategorySub.associate = (db) => {
    BrandCategorySub.belongsTo(db.SubCategory, {
      foreignKey: {
        name: 'subCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    BrandCategorySub.belongsTo(db.BrandCategory, {
      foreignKey: {
        name: 'brandCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    BrandCategorySub.hasMany(db.ProductSubCategory, {
      foreignKey: {
        name: 'brandCategorySubId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return BrandCategorySub;
};
