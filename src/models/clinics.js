'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinics extends Model {

    static associate(models) {
      // define association here
    }
  };
  Clinics.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Clinics',
  });
  return Clinics;
};