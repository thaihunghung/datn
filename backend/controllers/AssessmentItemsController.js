const { Op, Sequelize } = require('sequelize');
const AssessmentModel = require('../models/AssessmentModel');
const AssessmentItemModel = require('../models/AssessmentItemModel');


const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const AssessmentItemsController = {
  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const AssessmentItem = await AssessmentItemModel.bulkCreate(data);
      res.status(201).json(AssessmentItem);
    } catch (error) {
      console.error('Lỗi tạo AssessmentItem:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = AssessmentItemsController;
