'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    paranoid: true
  });

  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  };

  return Post;
};