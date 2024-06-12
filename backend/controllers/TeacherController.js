const TeacherModel = require("../models/TeacherModel");
const ExcelJS = require('exceljs');

const generateUniqueTeacherCode = async () => {
  let isUnique = false;
  let teacherCode;

  while (!isUnique) {
    teacherCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingTeacher = await TeacherModel.findOne({ where: { teacherCode } });
    if (!existingTeacher) {
      isUnique = true;
    }
  }

  return teacherCode;
};

const TeacherController = {
  // Lấy tất cả các giáo viên
  index: async (req, res) => {
    try {
      const teachers = await TeacherModel.findAll(
        {
          attributes: ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher'],
          where: {
            isDelete: false,
            isBlock: false
          }
        }
      );
      res.json(teachers);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo một giáo viên mới
  create: async (req, res) => {
    try {
      const { email, password, name, typeTeacher, teacherCode } = req.body;

      // Check if the email already exists
      const existingEmail = await TeacherModel.findOne({ where: { email: email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      let uniqueTeacherCode = teacherCode;

      if (!teacherCode) {
        // Generate a unique 6-digit teacherCode if not provided in the request
        uniqueTeacherCode = await generateUniqueTeacherCode();
      } else {
        // Check if the provided teacherCode already exists
        const existingCode = await TeacherModel.findOne({ where: { teacherCode: teacherCode } });
        if (existingCode) {
          return res.status(400).json({ message: 'Teacher code already exists' });
        }
      }

      const data = {
        email,
        password,
        name,
        teacherCode: uniqueTeacherCode,
        typeTeacher
      };

      const newTeacher = await TeacherModel.create(data);
      res.json({
        message: "Tạo giáo viên thành công",
        teacher_id: newTeacher.teacher_id,
        email: newTeacher.email,
        name: newTeacher.name,
        permission: newTeacher.permission,
        typeTeacher: newTeacher.typeTeacher,
      });
    } catch (error) {
      console.error('Lỗi khi tạo giáo viên mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy thông tin của một giáo viên dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherDetail = await TeacherModel.findOne({
        attributes: ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher'],
        where: {
          isDelete: false,
          isBlock: false,
          teacher_id: id
        }
      });
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

      // Find the teacher by ID
      const teacherDetail = await TeacherModel.findOne({ where: { teacher_id: id } });
      if (!teacherDetail) {
        return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
      }

      // Update the teacher's details
      await teacherDetail.update(data);

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
  },

  //excel
  getFormTeacher: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách giáo viên');

    worksheet.columns = [
      { header: 'Mã giáo viên', key: 'teacherCode', width: 15 },
      { header: 'Tên giáo viên', key: 'name', width: 32 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'typeTeacher', key: 'email', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },
  getFormTeacherWithData: async (req, res) => {
    try {
      const { data } = req.body;

      if (!data || !Array.isArray(data.id) || data.id.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing id array' });
      }

      const { id } = data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      const students = await TeacherModel.findAll({
        attributes: ['teacher_id', 'teacherCode', 'studentCode', 'email', 'name', 'isDelete'],
        where: {
          isDelete: false,
          isBlock: false,
          student_id: id
        }
      });

      worksheet.columns = [
        { header: 'Mã giáo viên', key: 'teacherCode', width: 15 },
        { header: 'Tên giáo viên', key: 'name', width: 32 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Loại giáo viên', key: 'typeTeacher', width: 30 },
      ];

      students.forEach(student => {
        worksheet.addRow({
          teacherCode: student.class.teacherCode,
          name: student.name,
          email: student.email,
          typeTeacher: student.typeTeacher,
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
      const teacherCodesSet = new Set();

      worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
        if (rowNumber !== 1) { // bỏ dòng đầu
          let email = row.getCell(3).value;
          let teacherCode = row.getCell(1).value;

          if (email && typeof email === 'object' && email.hasOwnProperty('text')) {
            email = email.text;
          }

          if (!email || emailsSet.has(email)) {
            console.error(`Duplicate or invalid email found at row ${rowNumber}: ${email}`);
            return; // Skip this row
          }
          

          if (!teacherCode || teacherCodesSet.has(teacherCode)) {
            console.error(`Duplicate or invalid teacherCode found at row ${rowNumber}: ${teacherCode}`);
            teacherCode = await generateUniqueTeacherCode();
            return teacherCode; // return new teacherCode
          }

          emailsSet.add(email);
          teacherCodesSet.add(teacherCode);

          const sql = `INSERT INTO teachers (teacherCode, name, email, typeTeacher)
                 VALUES (?, ?, ?, ?)`;
          const values = [
            teacherCode,
            row.getCell(2).value,
            email,
            row.getCell(4).value,
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
  }
};

module.exports = TeacherController;
