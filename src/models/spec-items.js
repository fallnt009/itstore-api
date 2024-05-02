module.exports = (sequelize, DataTypes) => {
  const SpecItem = sequelize.define(
    'SpecItem',
    {
      specName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  SpecItem.associate = (db) => {
    SpecItem.belongsTo(db.SubCategory, {
      foreignKey: {
        name: 'subCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    SpecItem.hasMany(db.ProductSpec, {
      foreignKey: {
        name: 'specItemId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return SpecItem;
};
