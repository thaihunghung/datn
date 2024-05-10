const StudentModel = require("../models/StudentModel");
const { filterDescription, filterDescriptionHaveid } = require('../utils/filter');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const xlsx = require('xlsx');

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
  },
  getFormStudent: async (req, res) => {
    try {
      const Description = await StudentModel.describe();

      console.log(Description);
      const filteredStudent = filterDescription(Description, "Student")
      if (!Description) {
        return res.status(404).json({ message: 'Không tìm thấy mô tả Student' });
      }

      const csvData = json2csv(filteredStudent);
      fs.writeFileSync('student.csv', csvData, 'utf8');
      res.download('student.csv', 'student.csv', (err) => {
        if (err) {
          console.error('Lỗi khi gửi tệp:', err);
          res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
        } else {
          fs.unlinkSync('student.csv');
        }
      });
    } catch (error) {
      console.error('Error get form Student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  saveStudentCSV: async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    try {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      const connection = await mysql.createConnection(dbConfig);
      const [rows, fields] = await Promise.all(data.map(student =>
        connection.execute(
          `INSERT INTO students (class_id, studentCode, email, name) VALUES (?, ?, ?, ?)`,
          [student.class_id, student.studentCode, student.email, student.name]
        )
      ));

      res.send('Data uploaded successfully');
    } catch (error) {
      res.status(500).send('Failed to upload data: ' + error.message);
    }
  }
};

module.exports = StudentController;
