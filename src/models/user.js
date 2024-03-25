const {CUSTOMER, EMPLOYEE} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {isEmail: true},
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: /^[0-9]{10}$/,
        },
      },
      password: {type: DataTypes.STRING, allowNull: false},
      roles: {
        type: DataTypes.ENUM(CUSTOMER, EMPLOYEE),
        allowNull: false,
        defaultValue: CUSTOMER,
      },
      profileImage: {
        type: DataTypes.STRING,
      },
    },
    {underscored: true}
  );

  User.associate = (db) => {
    User.hasMany(db.Address, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    User.hasMany(db.Order, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    User.hasMany(db.Wishlist, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return User;
};
