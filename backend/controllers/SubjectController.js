const SubjectModel = require("../models/SubjectModel");

const SubjectController = {
  // Lấy tất cả các môn học
  index: async (req, res) => {
    try {
      const subjects = await SubjectModel.findAll();
      res.json(subjects);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả môn học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },
  
  // Tạo một môn học mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newSubject = await SubjectModel.create(data);
      res.json(newSubject);
    } catch (error) {
      console.error('Lỗi khi tạo môn học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Lấy một môn học theo ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Không tìm thấy môn học' });
      }
      res.json(subject);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm môn học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Cập nhật một môn học
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Không tìm thấy môn học' });
      }
      await SubjectModel.update(data, { where: { subject_id: id } });
      res.json({ message: `Cập nhật thành công môn học có id: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật môn học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Xóa một môn học
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await SubjectModel.destroy({ where: { subject_id: id } });
      res.json({ message: 'Xóa môn học thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa môn học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Lấy danh sách môn học đã được xóa
  isDeleteTotrue: async (req, res) => {
    try {
      const deletedSubjects = await SubjectModel.findAll({ where: { isDelete: true } });
      res.json(deletedSubjects);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học đã xóa:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Lấy danh sách môn học chưa được xóa
  isDeleteTofalse: async (req, res) => {
    try {
      const activeSubjects = await SubjectModel.findAll({ where: { isDelete: false } });
      res.json(activeSubjects);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học chưa xóa:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Đảo ngược trạng thái isDelete của một môn học
  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Không tìm thấy môn học' });
      }
      const updatedIsDeleted = !subject.isDelete;
      await SubjectModel.update({ isDelete: updatedIsDeleted }, { where: { subject_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái isDelete của môn học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },
};

module.exports = SubjectController;
