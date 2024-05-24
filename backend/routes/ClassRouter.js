const express = require('express');
const ClassController = require('../controllers/ClassController');
const router = express.Router();

/**
 * @openapi
 * /api/admin/class:
 *   get:
 *     summary: Lấy danh sách tất cả các lớp học
 *     description: Trả về danh sách tất cả các lớp học.
 *     responses:
 *       200:
 *         description: Danh sách các lớp học.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một lớp học mới
 *     description: Thêm một lớp học mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: Lớp học được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/class/{id}:
 *   get:
 *     summary: Lấy thông tin một lớp học theo ID
 *     description: Trả về thông tin chi tiết của một lớp học.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lớp học cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của lớp học.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Không tìm thấy lớp học
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một lớp học
 *     description: Cập nhật thông tin của lớp học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lớp học cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho lớp học.
 *       404:
 *         description: Không tìm thấy lớp học
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một lớp học
 *     description: Xóa lớp học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lớp học cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lớp học đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy lớp học
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/class/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các lớp học đã bị xóa
 *     description: Trả về các lớp học có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách lớp học đã xóa.
 *       404:
 *         description: Không tìm thấy lớp học nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/class/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các lớp học chưa bị xóa
 *     description: Trả về các lớp học có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách lớp học chưa bị xóa.
 *       404:
 *         description: Không tìm thấy lớp học nào.
 *       500:
 *         description: Lỗi server
  * /api/admin/class/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một lớp học
 *     description: Cập nhật trạng thái isDelete cho lớp học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lớp học cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công cho lớp học.
 *       404:
 *         description: Không tìm thấy lớp học
 *       500:
 *         description: Lỗi server
 */
router.get('/class', ClassController.index);
router.post('/class', ClassController.create);
router.get('/class/:id', ClassController.getByID);
router.get('/class-teacher', ClassController.getAllWithTeacher);

router.put('/class/:id', ClassController.update);
router.delete('/class/:id', ClassController.delete);

router.get('/class/isDelete/true', ClassController.isDeleteTotrue);
router.get('/class/isDelete/false', ClassController.isDeleteTofalse);
router.post('/class/templates/update', ClassController.getExcelWithData);

router.put('/class/isDelete/:id', ClassController.IsDelete);
module.exports = router;