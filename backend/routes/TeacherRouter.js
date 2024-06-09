const express = require('express');
const TeacherController = require('../controllers/TeacherController');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');

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

router.get('/teacher',  checkPermission(2), TeacherController.index);
router.get('/teacher/getByUser/:user_id', TeacherController.getByUser);


router.post('/teacher',checkPermission(3), TeacherController.create);
router.get('/teacher/:id',checkPermission(3), TeacherController.getByID);
router.put('/teacher/:id', TeacherController.update);

router.patch('/teachers/:id/block', checkPermission(3), TeacherController.blockTeacher);
router.patch('/teachers/:id/unblock', checkPermission(3), TeacherController.unblockTeacher);
router.patch('/teachers/:id/delete', checkPermission(3), TeacherController.deleteTeacher);
router.patch('/teachers/:id/restore', checkPermission(3), TeacherController.restoreTeacher);
module.exports = router;