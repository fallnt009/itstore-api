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
    User.hasMany(db.UserAddress, {
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
    User.hasMany(db.UserPayment, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    User.hasMany(db.UserPayment, {
      foreignKey: {
        name: 'verifierId',
      },
      onDelete: 'RESTRICT',
    });
    User.hasOne(db.Cart, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    User.hasOne(db.Checkout, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return User;
};
