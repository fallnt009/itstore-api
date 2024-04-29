module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define('UserAddress', {}, {underscored: true});

  UserAddress.associate = (db) => {
    UserAddress.belongsTo(db.Address, {
      foreignKey: {
        name: 'addressId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    UserAddress.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return UserAddress;
};
