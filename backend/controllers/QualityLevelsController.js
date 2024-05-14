const RubricItemModel = require('../models/RubricItemModel');
const qualityLevelsModel = require('../models/QualityLevelsModel');

const QualityLevelsController = {
  index: async (req, res) => {
    try {
      qualityLevelsModel.findAll()
        .then(qualitylevels => {
          return res.json(qualitylevels);
        })
        .catch(error => {
          // Xử lý lỗi nếu có
          console.error('Lỗi lấy dữ liệu:', error);
        });

    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  create: async (req, res) => {
    try {
      const { qualityLevel } = req.body;
      console.log(qualityLevel.dataqualityLevel);
      const uniqueDataQualityLevel = Array.from(new Set(qualityLevel.dataqualityLevel.map(JSON.stringify))).map(JSON.parse);

      console.log("qualityLevel");

      const newQL = await qualityLevelsModel.bulkCreate(uniqueDataQualityLevel);
      res.json(newQL);
    } catch (error) {
      console.error('Lỗi tạo mức độ chất lượng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await qualityLevelsModel.findOne({ qualitylevel_id : id});
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm mức độ chất lượng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedProgram = await qualityLevelsModel.update(data , { where: { qualitylevel_id : id } });
      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'Qualitylevels not found' });
      }
      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật mức độ chất lượng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await qualityLevelsModel.destroy({ where: { qualitylevel_id : id } });
      res.json({ message: 'Xóa mức độ chất lượng thành công' });
    } catch (error) {
      console.error('Lỗi xóa mức độ chất lượng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const assessment = await qualityLevelsModel.findAll({ where: { isDelete: true } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy mức độ chất lượng' });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async(req, res) => {
    try {
      const assessment = await qualityLevelsModel.findAll({ where: { isDelete: false } });
      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy mức độ chất lượng' });
      }
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await qualityLevelsModel.findOne({ where: { qualitylevel_id : id } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy mức độ chất lượng' });
      }
      const updatedIsDeleted = !assessment.isDelete;
      console.log(updatedIsDeleted);
      qualityLevelsModel.update({ isDelete: updatedIsDeleted }, { where: { qualitylevel_id : id } })
        .then(qualitylevels => {
          console.log(qualitylevels);
        })
        .catch(error => {
          console.error(error);
        });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái isDelete:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  deleteByIdItemsRubric: async (req, res) => {
    try {
      const { ItemsRubricId } = req.params;
      await qualityLevelsModel.destroy({ where: { rubricsItem_id : ItemsRubricId } });
      res.json({ message: 'Xóa mức độ chất lượng thành công' });
    } catch (error) {
      console.error('Lỗi xóa mức độ chất lượng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = QualityLevelsController;
