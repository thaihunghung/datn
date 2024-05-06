const CourseModel = require('../models/CourseModel');

const CourseController = {
  // Get all courses
  index: async (req, res) => {
    try {
      const courses = await CourseModel.findAll();
      res.json(courses);
    } catch (error) {
      console.error('Error getting all courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new course
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newCourse = await CourseModel.create(data);
      res.json(newCourse);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get course by ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findOne({ where: { course_id: id } });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Error finding course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Update course
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const course = await CourseModel.findOne({ where: { course_id: id } });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const updatedCourse = await CourseModel.update(data, { where: { course_id: id } });
      res.json({ message: `Successfully updated course with ID: ${id}` });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Server error' });
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
