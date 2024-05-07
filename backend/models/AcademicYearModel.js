const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYearModel = sequelize.define('academic_year', {
  academic_year_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'academic_years',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = AcademicYearModel;