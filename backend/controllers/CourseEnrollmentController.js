const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const StudentModel = require('../models/StudentModel');
const CourseEnrollmentModel = require('../models/CourseEnrollmentModel');
const CourseModel = require('../models/CourseModel');
const ClassModel = require('../models/ClassModel');
const sequelize = require("../config/database");


const CourseEnrollmentController = {
  getByID: async (req, res) => {
    try {
      console.log("aaaaa");
      const { id } = req.params;
      const course = await CourseEnrollmentModel.findAll({
        include: [
          {
            model: StudentModel,
            where: { isDelete: false }
          },
          {
            model: CourseModel,
            where: { isDelete: false }
          }
        ],
        where: {
          isDelete: false,
          course_id: id
        }

      });
      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }
      res.json(course);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },
  getExcelCourseEnrollmentWithData: async (req, res) => {
    try {
      console.log('vao')
      const { data } = req.body;
      const { id } = data;

      console.log("req", data);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      // Lấy danh sách student_id từ CourseEnrollmentModel dựa trên id_detail_courses
      const enrollments = await CourseEnrollmentModel.findAll({
        attributes: ['student_id'],
        where: {
          course_id: id,
          isDelete: false
        }
      });

      console.log("enrollments", enrollments)
      // Trích xuất danh sách student_id
      const studentIds = enrollments.map(enrollment => enrollment.student_id);

      // Lấy thông tin học sinh từ StudentModel dựa trên danh sách student_id
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode']
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
        where: {
          isDelete: false,
          student_id: studentIds
        }
      });

      worksheet.columns = [
        { header: 'id', key: 'id', width: 15 },
        { header: 'Mã lớp', key: 'classCode', width: 15 },
        { header: 'Tên SV', key: 'name', width: 32 },
        { header: 'MSSV', key: 'studentCode', width: 20 },
        { header: 'Email', key: 'email', width: 30 }
      ];

      students.forEach(student => {
        worksheet.addRow({
          id: student.student_id,
          classCode: student.class.classCode,
          name: student.name,
          studentCode: student.studentCode,
          email: student.email
        });
      });

      await worksheet.protect('yourpassword', {
        selectLockedCells: true,
        selectUnlockedCells: true
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1) {
            cell.protection = { locked: true };
          } else {
            cell.protection = { locked: false };
          }
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // save Course cụ thể theo id
  saveExcel: async (req, res) => {
    console.log("ok");
    const { id } = req.params; // course_id

    if (req.files) {
      const uploadDirectory = path.join(__dirname, '../uploads');

      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      const insertPromises = [];

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber !== 1) { // Skip the header row
          const studentCode = row.getCell(3).value;
          const email = row.getCell(4).value;

          console.log("studentCode", studentCode)
          const sql = `INSERT INTO course_enrollments (student_id, course_id)
                       VALUES ((SELECT student_id FROM students WHERE studentCode = ?), ?)`;
          const values = [
            studentCode,
            id
          ];
          insertPromises.push(sequelize.query(sql, { replacements: values })
            .catch(error => {
              console.error(`Error inserting row ${rowNumber}: ${error.message}`);
            }));
        }
      });

      Promise.all(insertPromises)
        .then(() => {
          console.log('All rows inserted successfully');
        })
        .catch(error => {
          console.error('Error inserting rows:', error);
        });

      await Promise.all(insertPromises);
      console.log('All data has been inserted into the database!');
      fs.unlinkSync(filePath);  // Remove the uploaded file after processing
      res.status(200).json({ message: "Dữ liệu đã được lưu thành công vào cơ sở dữ liệu." });
    } else {
      res.status(400).send('No file uploaded.');
    }
  },
}

module.exports = CourseEnrollmentController;