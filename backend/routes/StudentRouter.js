const express = require('express');
const StudentController = require('../controllers/StudentController');
const router = express.Router();


/**
 * @openapi
 * /api/admin/student:
 *   get:
 *     summary: Lấy danh sách tất cả sinh viên
 *     description: Trả về danh sách tất cả sinh viên.
 *     responses:
 *       200:
 *         description: Danh sách sinh viên.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một sinh viên mới
 *     description: Thêm một sinh viên mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Sinh viên được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/student/{id}:
 *   get:
 *     summary: Lấy thông tin một sinh viên theo ID
 *     description: Trả về thông tin chi tiết của một sinh viên.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sinh viên cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của sinh viên.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Không tìm thấy sinh viên
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/student/class/{id}:
 *   get:
 *     summary: Lấy danh sách sinh viên theo lớp học
 *     description: Trả về danh sách sinh viên dựa trên ID của lớp học.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lớp học.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sinh viên của lớp học.
 *       404:
 *         description: Không tìm thấy sinh viên nào.
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một sinh viên
 *     description: Cập nhật thông tin của sinh viên dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sinh viên cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho sinh viên.
 *       404:
 *         description: Không tìm thấy sinh viên
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một sinh viên
 *     description: Xóa sinh viên dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sinh viên cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sinh viên đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy sinh viên
 *       500:
 *         description: Lỗi server
  * /api/admin/student/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các sinh viên đã bị xóa
 *     description: Trả về danh sách các sinh viên có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách sinh viên đã bị xóa.
 *       404:
 *         description: Không tìm thấy sinh viên nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/student/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các sinh viên chưa bị xóa
 *     description: Trả về danh sách các sinh viên có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách sinh viên chưa bị xóa.
 *       404:
 *         description: Không tìm thấy sinh viên nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/student/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một sinh viên
 *     description: Cập nhật trạng thái isDelete cho sinh viên dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sinh viên cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công cho sinh viên.
 *       404:
 *         description: Không tìm thấy sinh viên
 *       500:
 *         description: Lỗi server
 */

router.get('/student', StudentController.index);
router.post('/student', StudentController.create);
router.get('/student/:id', StudentController.getByID);
router.get('/student/class/:id', StudentController.getAllByClassId);

router.put('/student/:id', StudentController.update);
router.delete('/student/:id', StudentController.delete);

router.get('/student/isDelete/true', StudentController.isDeleteTotrue);
router.get('/student/isDelete/false', StudentController.isDeleteTofalse);
router.put('/student/isDelete/:id', StudentController.isDelete);
module.exports = router;