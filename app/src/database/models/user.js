'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
      paranoid: true, // SoftDelete - Debe existir la columna deletedAt
  });

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      as: 'posts',
      foreignKey: 'userId'
    })
  };
  
  return User;
};