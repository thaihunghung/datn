const express = require('express');
const router = express.Router();
const programController = require('../controllers/ProgramsController');

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/program:
 *   get:
 *     summary: Lấy danh sách tất cả các chương trình
 *     description: Trả về một mảng của tất cả các chương trình.
 *     responses:
 *       200:
 *         description: Một mảng các chương trình.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 *       500:
 *         description: Lỗi server
 */
router.get('/program', programController.index);

/**
 * @openapi
 * /api/admin/program:
 *   post:
 *     summary: Tạo một chương trình mới
 *     description: Thêm một chương trình mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Chương trình được tạo thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/program', programController.create);

/**
 * @openapi
 * /api/admin/program/{id}:
 *   get:
 *     summary: Lấy thông tin một chương trình theo ID
 *     description: Trả về thông tin chi tiết của một chương trình.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của chương trình cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của chương trình.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       404:
 *         description: Không tìm thấy chương trình
 *       500:
 *         description: Lỗi server
 */
router.get('/program/:id', programController.getByID);

/**
 * @openapi
 * /api/admin/program/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một chương trình
 *     description: Cập nhật thông tin của chương trình dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của chương trình cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho chương trình.
 *       404:
 *         description: Không tìm thấy chương trình
 *       500:
 *         description: Lỗi server
 */
router.put('/program/:id', programController.update);

/**
 * @openapi
 * /api/admin/program/{id}:
 *   delete:
 *     summary: Xóa một chương trình
 *     description: Xóa chương trình dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của chương trình cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chương trình đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy chương trình
 *       500:
 *         description: Lỗi server
 */
router.delete('/program/:id', programController.delete);

/**
 * @openapi
 * /api/admin/program/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các chương trình đã bị xóa
 *     description: Trả về các chương trình có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách chương trình đã xóa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 *       404:
 *         description: Không tìm thấy chương trình nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/program/isDelete/true', programController.isDeleteTotrue);

/**
 * @openapi
 * /api/admin/program/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các chương trình chưa bị xóa
 *     description: Trả về các chương trình có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách chương trình chưa bị xóa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 *       404:
 *         description: Không tìm thấy chương trình nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/program/isDelete/false', programController.isDeleteTofalse);

/**
 * @openapi
 * /api/admin/program/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một chương trình
 *     description: Cập nhật trạng thái isDelete cho chương trình dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của chương trình cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy chương trình
 *       500:
 *         description: Lỗi server
 */
router.put('/program/isDelete/:id', programController.toggleIsDelete);






module.exports = router;
