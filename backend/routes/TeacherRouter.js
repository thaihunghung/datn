const express = require('express');
const TeacherController = require('../controllers/TeacherController');
const router = express.Router();

/**
 * @openapi
 * /api/admin/teacher:
 *   get:
 *     summary: Lấy danh sách tất cả giáo viên
 *     description: Trả về danh sách tất cả giáo viên.
 *     responses:
 *       200:
 *         description: Danh sách giáo viên.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một giáo viên mới
 *     description: Thêm một giáo viên mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Giáo viên được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/teacher/{id}:
 *   get:
 *     summary: Lấy thông tin một giáo viên theo ID
 *     description: Trả về thông tin chi tiết của một giáo viên.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của giáo viên cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của giáo viên.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Không tìm thấy giáo viên
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một giáo viên
 *     description: Cập nhật thông tin của giáo viên dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của giáo viên cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho giáo viên.
 *       404:
 *         description: Không tìm thấy giáo viên
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một giáo viên
 *     description: Xóa giáo viên dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của giáo viên cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Giáo viên đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy giáo viên
 *       500:
 *         description: Lỗi server
  * /api/admin/teacher/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các giáo viên đã bị xóa
 *     description: Trả về danh sách các giáo viên có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách giáo viên đã bị xóa.
 *       404:
 *         description: Không tìm thấy giáo viên nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/teacher/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các giáo viên chưa bị xóa
 *     description: Trả về danh sách các giáo viên có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách giáo viên chưa bị xóa.
 *       404:
 *         description: Không tìm thấy giáo viên nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/teacher/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một giáo viên
 *     description: Cập nhật trạng thái isDelete cho giáo viên dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của giáo viên cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công cho giáo viên.
 *       404:
 *         description: Không tìm thấy giáo viên
 *       500:
 *         description: Lỗi server
 */

router.get('/teacher', TeacherController.index);
router.post('/teacher', TeacherController.create);
router.get('/teacher/:id', TeacherController.getByID);

router.put('/teacher/:id', TeacherController.update);
router.delete('/teacher/:id', TeacherController.delete);

router.get('/teacher/isDelete/true', TeacherController.isDeleteTotrue);
router.get('/teacher/isDelete/false', TeacherController.isDeleteTofalse);
router.put('/teacher/isDelete/:id', TeacherController.isDelete);
module.exports = router;