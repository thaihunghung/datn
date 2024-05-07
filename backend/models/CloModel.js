const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubjectModel = require('./SubjectModel');
const CloModel = sequelize.define('CLO', {
  clo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cloName: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  subject_id : {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SubjectModel,
      key: 'subject_id'
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
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'clos',
});

module.exports = CloModel;
