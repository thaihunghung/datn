const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const MetaAssessmentModel = require('../models/MetaAssessmentModel');


const MetaAssessmentController = {
  // Lấy tất cả các meta assessments
  index: async (req, res) => {
    try {
      const metaAssessments = await MetaAssessmentModel.findAll();
      res.json(metaAssessments);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các meta assessments:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy meta assessment theo ID
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const metaAssessment = await MetaAssessmentModel.findByPk(id);
      if (metaAssessment) {
        res.json(metaAssessment);
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi lấy meta assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo meta assessment mới
  create: async (req, res) => {
    try {
      const newMetaAssessment = await MetaAssessmentModel.create(req.body);
      res.status(201).json(newMetaAssessment);
    } catch (error) {
      console.error('Lỗi khi tạo meta assessment mới:', error);
      res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
    }
  },

  // Cập nhật meta assessment
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await MetaAssessmentModel.update(req.body, {
        where: { meta_assessment_id: id }
      });
      if (updated) {
        const updatedMetaAssessment = await MetaAssessmentModel.findByPk(id);
        res.json(updatedMetaAssessment);
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật meta assessment:', error);
      res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
    }
  },

  // Xóa meta assessment
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await MetaAssessmentModel.destroy({
        where: { meta_assessment_id: id }
      });
      if (deleted) {
        res.json({ message: 'Meta assessment đã được xóa' });
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi xóa meta assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  processSaveTemplateMetaAssessment: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }

    const requestData = JSON.parse(req.body.data);
    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('Students Form');
    const jsonData = [];

    let invalidDescriptionFound = false;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const description = `${requestData.courseName}_${requestData.description}_${requestData.date}`;
        if (description.includes('/')) {
          invalidDescriptionFound = true;
        }
        jsonData.push({
          teacher_id: requestData.teacher_id,
          course_id: requestData.course_id,
          rubric_id: requestData.rubric_id,
          generalDescription: `${requestData.courseName}_${requestData.description}_${requestData.date}`,
          description: '',
          place: requestData.place,
          date: requestData.date,
          student_id: row.getCell(1).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    if (invalidDescriptionFound) {
      return res.status(400).json({ message: 'Description contains invalid characters (e.g., "/") and cannot be saved' });
    }
    try {
      const existingDescriptions = await MetaAssessmentModel.findAll({
        where: {
          generalDescription: jsonData.map(item => item.description)
        },
        attributes: ['generalDescription']
      });
  
      if (existingDescriptions.length > 0) {
        return res.status(400).json({ message: 'Some generalDescription already exist in the database', existingDescriptions });
      }
      const createdAssessment = await MetaAssessmentModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdAssessment });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },
};

module.exports = MetaAssessmentController;
