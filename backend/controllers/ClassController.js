const ClassModel = require("../models/ClassModel");
const TeacherModel = require("../models/TeacherModel");

const ClassController = {
  // Lấy tất cả các lớp học
  index: async (req, res) => {
    try {
      const classes = await ClassModel.findAll({ where: { isDelete: false } });
      res.json(classes);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },
  getAllWithTeacher: async (req, res) => {
    try {
      const classes = await ClassModel.findAll({
        include: [{
          model: TeacherModel,
          attributes: ['name']
        }],
        attributes: ['class_id','teacher_id', 'className', 'classCode', 'isDelete'],// Lọc ra các trường cần lấy
        where: { isDelete: false }
      });

      res.json(classes);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  // Tạo một lớp học mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newClass = await ClassModel.create(data);
      res.json(newClass);
    } catch (error) {
      console.error('Lỗi khi tạo lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Lấy một lớp học theo ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const classObj = await ClassModel.findOne({ where: { class_id: id, isDelete: false } });
      if (!classObj) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      res.json(classObj);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Cập nhật một lớp học
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const classObj = await ClassModel.findOne({ where: { class_id: id, isDelete: false } });
      if (!classObj) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      await ClassModel.update(data, { where: { class_id: id } });
      res.json({ message: `Cập nhật thành công lớp học có id: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Xóa một lớp học
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const classObj = await ClassModel.findOne({ where: { class_id: id, isDelete: false } });
      if (!classObj) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      await ClassModel.update({ isDelete: true }, { where: { class_id: id } });
      res.json({ message: 'Xóa lớp học thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const classes = await ClassModel.findAll({ where: { isDelete: true } });
      if (!classes) {
        return res.status(404).json({ message: 'Không tìm thấy classes' });
      }
      res.json(classes);
    } catch (error) {
      console.error('Lỗi tìm kiếm PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const classes = await ClassModel.findAll({ where: { isDelete: false } });
      if (!classes) {
        return res.status(404).json({ message: 'Không tìm thấy classes' });
      }
      res.json(classes);
    } catch (error) {
      console.error('Lỗi tìm kiếm classes:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete của một lớp học
  IsDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const classes = await ClassModel.findOne({ where: { class_id: id } });
      if (!classes) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      const updatedIsDeleted = !classes.isDelete;
      await ClassModel.update({ isDelete: updatedIsDeleted }, { where: { class_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }

};

module.exports = ClassController;
