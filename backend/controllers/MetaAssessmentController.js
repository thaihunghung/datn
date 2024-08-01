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
  }
};

module.exports = MetaAssessmentController;
