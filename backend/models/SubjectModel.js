const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CloModel = require('./CloModel');

const SubjectModel = sequelize.define('subject', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subjectName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  subjectCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  numberCredits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numberCreditsTheory: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numberCreditsPractice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  typesubject: {
    type: DataTypes.ENUM('Đại cương', 'Cơ sở ngành', 'Chuyên ngành', 'Thực tập và Đồ án'),
    allowNull: false
  },
  isDelete: {
    type: DataTypes.TINYINT,
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
  tableName: 'subjects',
});

module.exports = SubjectModel;
