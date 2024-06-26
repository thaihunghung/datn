const express = require('express');
const CourseController = require('../controllers/CourseController');
const StudentController = require('../controllers/StudentController');
const router = express.Router();

/**
 * @openapi
 * /api/admin/course:
 *   get:
 *     summary: Lấy danh sách tất cả các khóa học
 *     description: Trả về danh sách tất cả các khóa học.
 *     responses:
 *       200:
 *         description: Danh sách các khóa học.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một khóa học mới
 *     description: Thêm một khóa học mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Khóa học được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/course/{id}:
 *   get:
 *     summary: Lấy thông tin một khóa học theo ID
 *     description: Trả về thông tin chi tiết của một khóa học.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của khóa học.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Không tìm thấy khóa học
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một khóa học
 *     description: Cập nhật thông tin của khóa học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho khóa học.
 *       404:
 *         description: Không tìm thấy khóa học
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một khóa học
 *     description: Xóa khóa học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Khóa học đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy khóa học
 *       500:
 *         description: Lỗi server
  * /api/admin/course/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các khóa học đã bị xóa
 *     description: Trả về các khóa học có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách khóa học đã xóa.
 *       404:
 *         description: Không tìm thấy khóa học nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/course/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các khóa học chưa bị xóa
 *     description: Trả về các khóa học có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách khóa học chưa bị xóa.
 *       404:
 *         description: Không tìm thấy khóa học nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/course/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một khóa học
 *     description: Cập nhật trạng thái isDelete cho khóa học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của khóa học cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy khóa học
 *       500:
 *         description: Lỗi server
 */

router.get('/course', CourseController.index);
router.get('/course/:id', CourseController.getByID);
router.get('/course/getByTeacher/:id_teacher', CourseController.getByIDTeacher);


router.get('/course/course-enrollment/:id', CourseController.getByIdWithCourseEnrollment);
router.get('/course-course-enrollment', CourseController.getAllWithCourseEnrollment);

router.post('/course', CourseController.create);
router.put('/course/:id', CourseController.update);
router.delete('/course/:id', CourseController.delete);

router.get('/course/isDelete/true', CourseController.isDeleteTotrue);
router.get('/course/isDelete/false', CourseController.isDeleteTofalse);
router.put('/course/isDelete/:id', CourseController.isdelete);

module.exports = router;