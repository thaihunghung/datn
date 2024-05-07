const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYearModel = sequelize.define('AcademicYear', {
  academic_year_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  timestamps: false, // Không sử dụng cột createdAt và updatedAt
  tableName: 'academic_years'
});

module.exports = AcademicYearModel;
