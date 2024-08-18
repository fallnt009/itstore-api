module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define(
    'SubCategory',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {underscored: true}
  );
  SubCategory.associate = (db) => {
    SubCategory.hasOne(db.BrandCategorySub, {
      foreignKey: {
        name: 'subCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    SubCategory.hasOne(db.SpecSubcategory, {
      foreignKey: {
        name: 'subCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return SubCategory;
};
