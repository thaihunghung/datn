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

  // Xóa một giáo viên dựa trên ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await TeacherModel.destroy({ where: { teacher_id: id } });
      res.json({ message: 'Xóa giáo viên thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const teachers = await TeacherModel.findAll({ where: { isDelete: true } });
      if (!teachers) {
        return res.status(404).json({ message: 'Không tìm thấy teachers' });
      }
      res.json(teachers);
    } catch (error) {
      console.error('Lỗi tìm kiếm teachers:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const teachers = await TeacherModel.findAll({ where: { isDelete: false } });
      if (!teachers) {
        return res.status(404).json({ message: 'Không tìm thấy teachers' });
      }
      res.json(teachers);
    } catch (error) {
      console.error('Lỗi tìm kiếm teachers:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete của một lớp học
  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const teachers = await TeacherModel.findOne({ where: { class_id: id } });
      if (!teachers) {
        return res.status(404).json({ message: 'Không tìm thấy teachers' });
      }
      const updatedIsDeleted = !teachers.isDelete;
      await TeacherModel.update({ isDelete: updatedIsDeleted }, { where: { class_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của teachers:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }
};

module.exports = TeacherController;
