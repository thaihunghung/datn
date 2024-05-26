const { Op, Sequelize } = require('sequelize');
const AssessmentModel = require('../models/AssessmentModel');
const CourseModel = require('../models/CourseModel');
const UserModel = require('../models/UserModel');

const AssessmentsController = {
  index: async (req, res) => {
    try {
      AssessmentModel.findAll()
        .then(assessments => {
          return res.json(assessments);
        })
        .catch(error => {
          // Xử lý lỗi nếu có
          console.error('Lỗi lấy dữ liệu:', error);
        });

    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  GetByUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.user_id);
      console.log(userId);
      const assessments = await AssessmentModel.findAll({
        where: {
          user_id: userId,
          isDelete: false
        },
        attributes: [
          'course_id',
          [Sequelize.fn('COUNT', Sequelize.col('assessment_id')), 'assessmentCount'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_id'))), 'studentCount'],
          [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN score = 0 THEN 1 ELSE 0 END')), 'zeroScoreCount']
        ],
        group: ['course_id'],
        // include: [
        //   {
        //     model: CourseModel,
        //     attributes: ['course_name']
        //   }
        // ]
      });
  
      if (assessments.length === 0) {
        return res.status(404).json({ message: 'No assessments found for this user' });
      }
  
      const result = assessments.map(assessment => ({
        course_id: assessment.course_id,
        user_id: userId,
        assessmentCount: assessment.dataValues.assessmentCount,
        studentCount: assessment.dataValues.studentCount,
        zeroScoreCount: assessment.dataValues.zeroScoreCount
      }));

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const newProgram = await AssessmentModel.create(data);
      res.json(newProgram);
    } catch (error) {
      console.error('Lỗi tạo chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await AssessmentModel.findOne({ assessment_id: id});
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedProgram = await AssessmentModel.update(data , { where: { assessment_id: id } });
      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await AssessmentModel.destroy({ where: { assessment_id: id } });
      res.json({ message: 'Xóa chương trình thành công' });
    } catch (error) {
      console.error('Lỗi xóa chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: true } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async(req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: false } });
      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await AssessmentModel.findOne({ where: { assessment_id: id } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      const updatedIsDeleted = !assessment.isDelete;
      console.log(updatedIsDeleted);
      AssessmentModel.update({ isDelete: updatedIsDeleted }, { where: { assessment_id: id } })
        .then(assessments => {
          console.log(assessments);
        })
        .catch(error => {
          console.error(error);
        });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái isDelete:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = AssessmentsController;
