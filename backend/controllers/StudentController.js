const StudentModel = require("../models/StudentModel");

const StudentController = {
  // Lấy tất cả sinh viên
  index: async (req, res) => {
    try {
      const students = await StudentModel.findAll();
      res.json(students);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo một sinh viên mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newStudent = await StudentModel.create(data);
      res.json(newStudent);
    } catch (error) {
      console.error('Lỗi khi tạo sinh viên mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy thông tin của một sinh viên dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const studentDetails = await StudentModel.findOne({ where: { student_id: id } });
      if (!studentDetails) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
      }
      res.json(studentDetails);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật thông tin của một sinh viên dựa trên ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const studentDetails = await StudentModel.findOne({ where: { student_id: id } });
      if (!studentDetails) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
      }
      await StudentModel.update(data, { where: { student_id: id } });
      res.json({ message: `Cập nhật thành công thông tin sinh viên có ID: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Xóa một sinh viên dựa trên ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await StudentModel.destroy({ where: { student_id: id } });
      res.json({ message: 'Xóa sinh viên thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const students = await StudentModel.findAll({ where: { isDelete: true } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      res.json(students);
    } catch (error) {
      console.error('Lỗi tìm kiếm students:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const students = await StudentModel.findAll({ where: { isDelete: false } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      res.json(students);
    } catch (error) {
      console.error('Lỗi tìm kiếm students:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete của một lớp học
  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await StudentModel.findOne({ where: { class_id: id } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      const updatedIsDeleted = !students.isDelete;
      await StudentModel.update({ isDelete: updatedIsDeleted }, { where: { class_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của students:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }
};

module.exports = StudentController;
