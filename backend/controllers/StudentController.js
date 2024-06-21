const StudentModel = require("../models/StudentModel");
const fs = require('fs');
const sequelize = require("../config/database");
const ExcelJS = require('exceljs');
const path = require('path');
const ClassModel = require("../models/ClassModel");
const { Sequelize } = require("sequelize");
const AcademicYearModel = require("../models/AcademicYearModel");
const SemesterModel = require("../models/SemesterModel");
const SemesterAcademicYearModel = require("../models/SemesterAcademicYearModel");
const SubjectModel = require("../models/SubjectModel");
const CourseModel = require("../models/CourseModel");
const AssessmentModel = require("../models/AssessmentModel");

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
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode', 'classNameShort'],
          where: { isDelete: false }
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
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode']
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'date_of_birth', 'email', 'name', 'isDelete'],
        where:
          { student_id: id, isDelete: false }
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
  getFormStudent: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students Form');

    worksheet.columns = [
      { header: 'Mã lớp', key: 'classCode', width: 15 },
      { header: 'Tên SV', key: 'name', width: 32 },
      { header: 'MSSV', key: 'studentCode', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },
  getFormStudentWithData: async (req, res) => {
    try {
      const { data } = req.body;

      if (!data || !Array.isArray(data.id) || data.id.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing id array' });
      }

      const { id } = data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode']
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
        where: {
          isDelete: false,
          student_id: id
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

  saveStudentExcel: async (req, res) => {
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
      const emailsSet = new Set();
      const studentCodesSet = new Set();

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber !== 1) { // bỏ dòng đầu
          let email = row.getCell(4).value;
          let studentCode = row.getCell(3).value;

          if (email && typeof email === 'object' && email.hasOwnProperty('text')) {
            email = email.text;
          }

          if (!email || emailsSet.has(email)) {
            console.error(`Duplicate or invalid email found at row ${rowNumber}: ${email}`);
            return; // Skip this row
          }

          if (!studentCode || studentCodesSet.has(studentCode)) {
            console.error(`Duplicate or invalid studentCode found at row ${rowNumber}: ${studentCode}`);
            return; // Skip this row
          }

          emailsSet.add(email);
          studentCodesSet.add(studentCode);

          const sql = `INSERT INTO students (class_id, name, studentCode, email)
                 VALUES ((SELECT class_id FROM classes WHERE 	classNameShort = ?), ?, ?, ?)`;
          const values = [
            row.getCell(1).value,
            row.getCell(2).value,
            studentCode,
            email,
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
      // res.send('Excel file has been processed and data inserted.');
      res.status(200).json({ message: "Dữ liệu đã được lưu thành công vào cơ sở dữ liệu." });
    } else {
      res.status(400).send('No file uploaded.');
    }
  },
  updateStudentsFromExcel: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet('Students Form');

      const studentUpdates = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const studentData = {
            student_id: row.getCell('A').value,
            classCode: row.getCell('B').value,
            name: row.getCell('C').value,
            studentCode: row.getCell('D').value,
            email: row.getCell('E').value
          };
          studentUpdates.push(studentData);
        }
      });

      for (const studentData of studentUpdates) {
        const student = await StudentModel.findByPk(studentData.student_id);
        if (student) {
          const classModel = await ClassModel.findOne({ where: { classCode: studentData.classCode } });
          if (classModel) {
            student.class_id = classModel.class_id;
          }
          student.name = studentData.name;
          student.studentCode = studentData.studentCode;
          student.email = studentData.email;
          await student.save();
        }
      }

      fs.unlinkSync(filePath); // Clean up the uploaded file

      res.status(200).json({ message: 'Students updated successfully' });
    } catch (error) {
      console.error('Error updating students from Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  // for chart
  getStudentPerformanceByCourse: async (req, res) => {
    try {
      const { student_id } = req.params;
      const results = await sequelize.query(
        `SELECT 
            a.assessment_id, 
            a.totalScore, 
            s.student_id AS student_id, 
            s.studentCode AS studentCode, 
            s.name AS studentName, 
            s.date_of_birth AS studentDOB, 
            c.class_id AS class_id, 
            c.className AS className, 
            c.classCode AS classCode, 
            c.classNameShort AS classNameShort, 
            cr.course_id AS course_id, 
            cr.courseName AS courseName, 
            sub.subject_id AS subject_id, 
            sub.subjectName AS subjectName, 
            sem.semester_id AS semester_id, 
            sem.descriptionShort AS semesterDescriptionShort, 
            ay.academic_year_id AS academic_year_id, 
            ay.startDate AS academicYearStartDate, 
            ay.endDate AS academicYearEndDate, 
            ay.description AS academicYearDescription
        FROM 
            assessments AS a
        LEFT JOIN students AS s
            ON a.student_id = s.student_id
        LEFT JOIN classes AS c
            ON s.class_id = c.class_id
        LEFT JOIN courses AS cr
            ON a.course_id = cr.course_id
        LEFT JOIN subjects AS sub
            ON cr.subject_id = sub.subject_id
        LEFT JOIN semester_academic_years AS say
            ON cr.id_semester_academic_year = say.id_semester_academic_year
        LEFT JOIN semesters AS sem
            ON say.semester_id = sem.semester_id
        LEFT JOIN academic_years AS ay
            ON say.academic_year_id = ay.academic_year_id
        WHERE 
            a.student_id = :student_id
            AND a.isDelete = false
        ORDER BY 
            ay.startDate ASC;`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { student_id }
        }
      );

      res.json(results);
    } catch (error) {
      console.error('Error fetching student performance by course:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

};

module.exports = StudentController;
