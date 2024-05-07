const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PloModel = require('./PloModel');
const CloModel = require('./CloModel');

const MapPloCloModel = sequelize.define('MapPloClo', {
  id_plo_clo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PloModel,
      key: 'plo_id'
    }
  },
  clo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CloModel,
      key: 'clo_id'
    }
  },
  isDelete: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'map_plo_clos'
});

module.exports = MapPloCloModel;
