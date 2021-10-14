'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {

    static associate(models) {
      // define association here
    }
  };
  Specialty.init({
    name: DataTypes.STRING,
    image: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Specialty',
  });
  return Specialty;
};