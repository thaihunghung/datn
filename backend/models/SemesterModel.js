const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const AcademicYearModel = require('./AcademicYearModel');

const SemesterModel = sequelize.define('semester', {
  semester_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descriptionShort: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  descriptionLong: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  codeSemester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  academic_year_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AcademicYearModel,
      key: 'academic_year_id' 
    }
  },
}, {
  tableName: 'semesters',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = SemesterModel;
