const StudentModel = require("../models/StudentModel");
const { filterDescription, filterDescriptionHaveid } = require('../utils/filter');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const sequelize = require("../config/database");
const ExcelJS = require('exceljs');
const path = require('path');
const ClassModel = require("../models/ClassModel");

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
  getAllByClassId: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await StudentModel.findAll({ where: { class_id: id, isDelete: false } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      res.json(students);
    } catch (error) {
      console.error('Lỗi tìm kiếm students:', error);
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
  getAllWithClass: async (req, res) => {
    try {
      // Lấy thông tin sinh viên
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode'] // Chỉ lấy trường classCode từ bảng lớp
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],// Lọc ra các trường cần lấy
        where: { isDelete: false }
      });

      res.json(students);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
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
      const students = await StudentModel.findAll(
        {
          include: [{
            model: ClassModel,
            attributes: ['classCode']
          }],
          where: { isDelete: true }
        });
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
      const students = await StudentModel.findOne({ where: { student_id: id } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      const updatedIsDeleted = !students.isDelete;
      await StudentModel.update({ isDelete: updatedIsDeleted }, { where: { student_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của students:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // getFormStudent: async (req, res) => {
  //   try {
  //     const Description = await StudentModel.describe();

  //     console.log(Description);
  //     const filteredStudent = filterDescription(Description, "Student")
  //     if (!Description) {
  //       return res.status(404).json({ message: 'Không tìm thấy mô tả Student' });
  //     }

  //     const csvData = json2csv(filteredStudent);
  //     fs.writeFileSync('student.csv', csvData, 'utf8');
  //     res.download('student.csv', 'student.csv', (err) => {
  //       if (err) {
  //         console.error('Lỗi khi gửi tệp:', err);
  //         res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  //       } else {
  //         fs.unlinkSync('student.csv');
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error get form Student:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // },

  getFormStudent: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students Form');


    const CodeClass = await ClassModel.findAll({ attributes: ['classCode'] }, { where: { isDelete: true } });

    worksheet.columns = [
      { header: 'Mã lớp', key: 'classCode', width: 15 },
      { header: 'Tên SV', key: 'name', width: 32 },
      { header: 'MSSV', key: 'studentCode', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    // const cellA19 = worksheet.getCell('G1');
    // cellA19.value = 'Các mã lớp';
    // for (let row = 2; row <= CodeClass.length; row++) {
    //   for (let col = 1; col <= 1; col++) {
    //     const cell = worksheet.getCell(row, 7);
    //     cell.value = CodeClass[row-2].classCode;
    //   }
    // }

    const worksheetData = workbook.addWorksheet('Description');

    worksheetData.columns = [
      { header: 'Mã lớp', key: 'classCode', width: 15 }
    ];

    for (let row = 2; row <= CodeClass.length; row++) {
      for (let col = 1; col <= 1; col++) {
        const cell = worksheetData.getCell(row, 1);
        cell.value = CodeClass[row - 2].classCode;
      }
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  saveStudent: async (req, res) => {
    console.log("dc");
    if (req.files) {
      console.log("dc1");
      const uploadDirectory = path.join(__dirname, '../uploads');

      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      const insertPromises = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber !== 1) { // bỏ hàng đầu
          const emailCell = row.getCell(4);
          let email = emailCell.value;
          if (email && typeof email === 'object' && email.hasOwnProperty('text')) {
            email = email.text;
          }

          const sql = `INSERT INTO students (class_id, name, studentCode, email)
                       VALUES ((SELECT class_id FROM classes WHERE classCode = ?), ?, ?, ?)`;
          const values = [
            row.getCell(1).value,
            row.getCell(2).value,
            row.getCell(3).value,
            email,
          ];
          insertPromises.push(sequelize.query(sql, { replacements: values }));
        }
      });

      await Promise.all(insertPromises);
      console.log('All data has been inserted into the database!');
      fs.unlinkSync(filePath);  // Remove the uploaded file after processing
      // res.send('Excel file has been processed and data inserted.');
      res.status(200).json({ message: "Dữ liệu đã được lưu thành công vào cơ sở dữ liệu." });
    } else {
      res.status(400).send('No file uploaded.');
    }
  }
};

module.exports = StudentController;
