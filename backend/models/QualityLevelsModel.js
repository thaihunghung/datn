const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RubricItemModel = require('./RubricItemModel');

const qualityLevelsModel = sequelize.define('quality_level', {
  qualityLevel_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  level: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  keyNumber: {
    type: DataTypes.DOUBLE(8, 2),
    defaultValue: 0
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  rubricsItem_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: RubricItemModel,
      key: 'rubricsItem_id'
    }
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
  modelName: 'QualityLevelsModel',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'quality_levels'
});

module.exports = qualityLevelsModel;
