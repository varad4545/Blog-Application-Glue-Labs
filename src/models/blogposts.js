'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blogposts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blogposts.init({
    email: DataTypes.STRING,
    post: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'blogposts',
  });
  return blogposts;
};