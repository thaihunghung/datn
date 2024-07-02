const express = require('express');
const SemesterController = require('../controllers/SemesterController');
const router = express.Router();
/**
 * @openapi
 * /api/admin/semester:
 *   get:
 *     summary: Lấy danh sách tất cả các học kỳ
 *     description: Trả về danh sách tất cả các học kỳ.
 *     responses:
 *       200:
 *         description: Danh sách các học kỳ.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một học kỳ mới
 *     description: Thêm một học kỳ mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Semester'
 *     responses:
 *       200:
 *         description: Học kỳ được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/semester/{id}:
 *   get:
 *     summary: Lấy thông tin một học kỳ theo ID
 *     description: Trả về thông tin chi tiết của một học kỳ.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của học kỳ cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của học kỳ.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       404:
 *         description: Không tìm thấy học kỳ
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một học kỳ
 *     description: Cập nhật thông tin của học kỳ dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của học kỳ cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Semester'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho học kỳ.
 *       404:
 *         description: Không tìm thấy học kỳ
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một học kỳ
 *     description: Xóa học kỳ dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của học kỳ cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Học kỳ đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy học kỳ
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/semester/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các học kỳ đã bị xóa
 *     description: Trả về các học kỳ có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách học kỳ đã xóa.
 *       404:
 *         description: Không tìm thấy học kỳ nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/semester/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các học kỳ chưa bị xóa
 *     description: Trả về các học kỳ có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách học kỳ chưa bị xóa.
 *       404:
 *         description: Không tìm thấy học kỳ nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/semester/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một học kỳ
 *     description: Cập nhật trạng thái isDelete cho học kỳ dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của học kỳ cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công cho học kỳ.
 *       404:
 *         description: Không tìm thấy học kỳ
 *       500:
 *         description: Lỗi server
 */

router.get('/semester', SemesterController.index);
router.post('/semester', SemesterController.create);
router.get('/semester/:id', SemesterController.getByID);

router.put('/semester/:id', SemesterController.update);
router.delete('/semester/:id', SemesterController.delete);

router.get('/semester/isDelete/true', SemesterController.isDeleteToTrue);
router.get('/semester/isDelete/false', SemesterController.isDeleteToFalse);
router.put('/semester/isDelete/:id', SemesterController.isDelete);
module.exports = router;