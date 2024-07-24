module.exports = (sequelize, DataTypes) => {
  const SpecSubcategory = sequelize.define(
    'SpecSubcategory',
    {},
    {underscored: true}
  );

  SpecSubcategory.associate = (db) => {
    SpecSubcategory.belongsTo(db.SpecItem, {
      foreignKey: {
        name: 'specItemId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    SpecSubcategory.belongsTo(db.SubCategory, {
      foreignKey: {
        name: 'subCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    SpecSubcategory.hasOne(db.SpecProduct, {
      foreignKey: {
        name: 'specSubcategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return SpecSubcategory;
};
