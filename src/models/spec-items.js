module.exports = (sequelize, DataTypes) => {
  const SpecItem = sequelize.define('SpecItem', {}, {underscored: true});

  SpecItem.associate = (db) => {
    SpecItem.belongsTo(db.SpecName, {
      foreignKey: {
        name: 'specNameId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    SpecItem.belongsTo(db.MainCategory, {
      foreignKey: {
        name: 'mainCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    SpecItem.hasOne(db.ProductSpec, {
      foreignKey: {
        name: 'specItemId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return SpecItem;
};
