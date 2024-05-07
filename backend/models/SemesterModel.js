const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const AcademicYearModel = require('./AcademicYearModel');

const SemesterModel = sequelize.define('Semester', {
  semester_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AcademicYearModel,
      key: 'academic_year_id'
    }
  },
  descriptionShort: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  descriptionLong: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  codeSemester: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: false, // Không sử dụng cột createdAt và updatedAt
  tableName: 'semesters'
});

module.exports = SemesterModel;
