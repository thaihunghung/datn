const express = require('express');
const CourseEnrollmentController = require('../controllers/CourseEnrollmentController');
const router = express.Router();

router.get('/course-enrollment/:id', CourseEnrollmentController.getByID);
router.post('/course-enrollment/templates/data', CourseEnrollmentController.getExcelCourseEnrollmentWithData);
router.get('/course-enrollment/course/:id/student', CourseEnrollmentController.getFormStudentWithDataByCourse);

module.exports = router;
