const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const StudentModel = require('../models/StudentModel');
const CourseEnrollmentModel = require('../models/CourseEnrollmentModel');
const CourseModel = require('../models/CourseModel');
const ClassModel = require('../models/ClassModel');


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
}

module.exports = CourseEnrollmentController;