const express = require('express');
const AcademicYearController = require('../controllers/AcademicYearController');
const router = express.Router();

/**
 * @openapi
 * /api/admin/academic-year:
 *   get:
 *     summary: Lấy danh sách tất cả các năm học
 *     description: Trả về danh sách tất cả các năm học.
 *     responses:
 *       200:
 *         description: Danh sách các năm học.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một năm học mới
 *     description: Thêm một năm học mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicYear'
 *     responses:
 *       200:
 *         description: Năm học được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/academic-year/{id}:
 *   get:
 *     summary: Lấy thông tin một năm học theo ID
 *     description: Trả về thông tin chi tiết của một năm học.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của năm học cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của năm học.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYear'
 *       404:
 *         description: Không tìm thấy năm học
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một năm học
 *     description: Cập nhật thông tin của năm học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của năm học cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicYear'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho năm học.
 *       404:
 *         description: Không tìm thấy năm học
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một năm học
 *     description: Xóa năm học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của năm học cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Năm học đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy năm học
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/academic-year/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các năm học đã bị xóa
 *     description: Trả về các năm học có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách năm học đã xóa.
 *       404:
 *         description: Không tìm thấy năm học nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/academic-year/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các năm học chưa bị xóa
 *     description: Trả về các năm học có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách năm học chưa bị xóa.
 *       404:
 *         description: Không tìm thấy năm học nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/academic-year/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một năm học
 *     description: Cập nhật trạng thái isDelete cho năm học dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của năm học cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy năm học
 *       500:
 *         description: Lỗi server
 */

router.get('/academic-year', AcademicYearController.index);
router.post('/academic-year', AcademicYearController.create);
router.get('/academic-year/:id', AcademicYearController.getByID);

router.put('/academic-year/:id', AcademicYearController.update);
router.delete('/academic-year/:id', AcademicYearController.delete);

router.get('/academic-year/isDelete/true', AcademicYearController.isDeleteTotrue);
router.get('/academic-year/isDelete/false', AcademicYearController.isDeleteTofalse);

router.put('/academic-year/isDelete/:id', AcademicYearController.IsDelete);
module.exports = router;