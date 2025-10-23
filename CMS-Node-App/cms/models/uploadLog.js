const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UploadLog = sequelize.define('UploadLog', {
  nodeId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = UploadLog;