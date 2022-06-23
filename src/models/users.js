
'use strict';
var bcrypt = require("bcrypt");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    accesstoken:DataTypes.STRING,
    refreshtoken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });

  users.beforeSave((user, options) => {
    if (user.changed("password")) {
      user.password = bcrypt.hashSync(
        user.password,
        bcrypt.genSaltSync(10),
        null
      );
    }
  });
  return users;
};