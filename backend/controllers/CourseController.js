const AcademicYearModel = require("../models/AcademicYearModel");
const ClassModel = require("../models/ClassModel");
const CourseEnrollmentModel = require("../models/CourseEnrollmentModel");
const CourseModel = require("../models/CourseModel");
const SemesterAcademicYearModel = require("../models/SemesterAcademicYearModel");
const SemesterModel = require("../models/SemesterModel");
const SubjectModel = require("../models/SubjectModel");
const TeacherModel = require("../models/TeacherModel");
const { Sequelize } = require('sequelize');

const CourseController = {

  // Lấy tất cả các khóa học
  index: async (req, res) => {
    try {
      const courses = await CourseModel.findAll({
        include: [{
          model: ClassModel,
          where: { isDelete: false }
        },
        {
          model: TeacherModel,
          where: { isDelete: false }
        },
        {
          model: SubjectModel,
          where: { isDelete: false }
        },
        {
          model: SemesterAcademicYearModel,
          where: { isDelete: false }
        }],
        where: { isDelete: false }

      });
      res.json(courses);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },

  // Tạo một khóa học mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newCourse = await CourseModel.create(data);
      res.json(newCourse);
    } catch (error) {
      console.error('Lỗi khi tạo khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  getAllWithCourseEnrollment: async (req, res) => {
    try {
      const courses = await CourseModel.findAll({
        attributes: {
          include: [
            [Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM course_enrollments AS ce
                        WHERE ce.course_id = course.course_id
                        AND ce.isDelete = FALSE
                    )`), 'enrollmentCount']
          ]
        },
        include: [
          {
            model: ClassModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: TeacherModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: SubjectModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: SemesterAcademicYearModel,
            where: { isDelete: false },
            required: true,
            include: [
              {
                model: SemesterModel,
                where: { isDelete: false },
                required: true
              },
              {
                model: AcademicYearModel,
                where: { isDelete: false },
                required: true
              }
            ]
          },
        ],
        where: { isDelete: false },
        order: [['course_id', 'DESC']]
      });

      res.json(courses);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },

  // Lấy một khóa học theo ID
  getByID: async (req, res) => {
    try {
      console.log("aaaaa");
      const { id } = req.params;
      const course = await CourseModel.findAll({
        attributes: {
          include: [
            [Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM course_enrollments AS ce
                        WHERE ce.course_id = course.course_id
                        AND ce.isDelete = FALSE
                    )`), 'enrollmentCount']
          ]
        },
        include: [
          {
            model: ClassModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: TeacherModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: SubjectModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: SemesterAcademicYearModel,
            where: { isDelete: false },
            required: true,
            include: [
              {
                model: SemesterModel,
                where: { isDelete: false },
                required: true
              },
              {
                model: AcademicYearModel,
                where: { isDelete: false },
                required: true
              }
            ]
          },
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

  getByIDTeacher: async (req, res) => {
    try {
      const { id_teacher } = req.params;
      const courses = await CourseModel.findAll({ where: { teacher_id: id_teacher, isDelete: false } });
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }

      res.json({ course: courses });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },


  getByIdWithCourseEnrollment: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findAll({
        include: [
          {
            model: ClassModel,
            where: { isDelete: false }
          },
          {
            model: TeacherModel,
            where: { isDelete: false }
          },
          {
            model: SubjectModel,
            where: { isDelete: false }
          },
          {
            model: SemesterAcademicYearModel,
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

      const enrollmentCount = await CourseEnrollmentModel.count({
        where: {
          course_id: id,
          isDelete: false
        }
      });

      res.json({ course, enrollmentCount });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Cập nhật một khóa học
  update: async (req, res) => {
    const { id } = req.params;
    const {
      academic_year_id,
      class_id,
      courseCode,
      courseName,
      id_semester_academic_year,
      semester_id,
      subject_id,
      teacher_id
    } = req.body.data;
  
    console.log(req.body);
    try {
      const course = await CourseModel.findOne({ where: { course_id: id } });
      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }
  
      // Kiểm tra sự tồn tại của cặp semester_id và academic_year_id
      let semesterAcademicYear = await SemesterAcademicYearModel.findOne({
        where: {
          semester_id,
          academic_year_id
        }
      });
  
      // Nếu không tồn tại, tạo mới
      if (!semesterAcademicYear) {
        semesterAcademicYear = await SemesterAcademicYearModel.create({
          semester_id,
          academic_year_id,
          isDelete: 0 // Giả định rằng `isDelete` mặc định là 0
        });
      }
  
      // Cập nhật khóa học với id_semester_academic_year mới
      await CourseModel.update({
        academic_year_id,
        class_id,
        courseCode,
        courseName,
        id_semester_academic_year: semesterAcademicYear.id_semester_academic_year,
        semester_id,
        subject_id,
        teacher_id
      }, { where: { course_id: id } });
   
      res.json({ message: `Cập nhật thành công khóa học có id: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Delete course
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await CourseModel.destroy({ where: { course_id: id } });
      res.json({ message: 'Successfully deleted course' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get courses with isDelete = true
  isDeleteTotrue: async (req, res) => {
    try {
      const courses = await CourseModel.findAll({ where: { isDelete: true } });
      if (!courses) {
        return res.status(404).json({ message: 'No courses found' });
      }
      res.json(courses);
    } catch (error) {
      console.error('Error finding courses with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get courses with isDelete = false
  isDeleteTofalse: async (req, res) => {
    try {
      const courses = await CourseModel.findAll({ where: { isDelete: false } });
      if (!courses) {
        return res.status(404).json({ message: 'No courses found' });
      }
      res.json(courses);
    } catch (error) {
      console.error('Error finding courses with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Toggle isDelete status of a course
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findOne({ where: { course_id: id } });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const updatedIsDeleted = !course.isDelete;
      await CourseModel.update({ isDelete: updatedIsDeleted }, { where: { course_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = CourseController;
