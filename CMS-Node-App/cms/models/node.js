const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Node = sequelize.define('Node', {
  nodeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  port: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastUploadStatus: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Node;