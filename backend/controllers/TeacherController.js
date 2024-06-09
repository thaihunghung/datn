const TeacherModel = require("../models/TeacherModel");

const TeacherController = {
  // Lấy tất cả các giáo viên
  index: async (req, res) => {
    try {
      const teachers = await TeacherModel.findAll();
      res.json(teachers);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo một giáo viên mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newTeacher = await TeacherModel.create(data);
      res.json(newTeacher);
    } catch (error) {
      console.error('Lỗi khi tạo giáo viên mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy thông tin của một giáo viên dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherDetail = await TeacherModel.findOne({ where: { teacher_id: id } });
      if (!teacherDetail) {
        return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
      }
      res.json(teacherDetail);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  getByUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const teacherDetail = await TeacherModel.findOne({ where: { user_id: user_id } });
      if (!teacherDetail) {
        return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
      }
      res.json(teacherDetail);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật thông tin của một giáo viên dựa trên ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const teacherDetail = await TeacherModel.findOne({ where: { teacher_id: id } });
      if (!teacherDetail) {
        return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
      }
      await TeacherModel.update(data, { where: { teacher_id: id } });
      res.json({ message: `Cập nhật thành công thông tin giáo viên có ID: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  blockTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isBlock: 1 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been blocked.' });
    } catch (error) {
      console.error('Error blocking teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  unblockTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isBlock: 0 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been unblocked.' });
    } catch (error) {
      console.error('Error unblocking teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isDelete: 1 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been deleted.' });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  restoreTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isDelete: 0 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been restored.' });
    } catch (error) {
      console.error('Error restoring teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = TeacherController;
