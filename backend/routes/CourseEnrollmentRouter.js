const express = require('express');
const CourseEnrollmentController = require('../controllers/CourseEnrollmentController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: CourseEnrollments
 *     description: Operations related to course enrollments
 */

/**
 * @openapi
 * /api/admin/course-enrollment/{id}:
 *   get:
 *     summary: Get a course enrollment by ID
 *     description: Returns the details of a course enrollment.
 *     tags: [CourseEnrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course enrollment.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course enrollment details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Course enrollment not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course-enrollment/student:
 *   post:
 *     summary: Get course enrollments by student ID
 *     description: Returns a list of course enrollments for a specific student.
 *     tags: [CourseEnrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 description: The ID of the student.
 *                 example: 1
 *     responses:
 *       200:
 *         description: List of course enrollments for the student.
 *       404:
 *         description: No course enrollments found for the student.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course-enrollment/templates/data:
 *   post:
 *     summary: Get course enrollment form template with data
 *     description: Returns a form template for course enrollment information pre-filled with data.
 *     tags: [CourseEnrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["75"]
 *     responses:
 *       200:
 *         description: Course enrollment form template with data.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course-enrollment/course/{id}/student:
 *   get:
 *     summary: Get students for a course by course ID
 *     description: Returns a list of students enrolled in a specific course.
 *     tags: [CourseEnrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of students enrolled in the course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: No students found for the course.
 *       500:
 *         description: Server error
 */

router.get('/course-enrollment/:id',ensureAuthenticated,  CourseEnrollmentController.getByID);
router.post('/course-enrollment/student',ensureAuthenticated, CourseEnrollmentController.getByIDStudent);
router.post('/course-enrollment/templates/data',ensureAuthenticated,  CourseEnrollmentController.getExcelCourseEnrollmentWithData);
router.get('/course-enrollment/course/:id/student',ensureAuthenticated,  CourseEnrollmentController.getFormStudentWithDataByCourse);

module.exports = router;
