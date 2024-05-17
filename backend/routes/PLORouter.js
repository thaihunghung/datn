const express = require('express');
const router = express.Router();
const PLO = require('../controllers/PloController');

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/plo:
 *   get:
 *     summary: Lấy danh sách tất cả PLOs
 *     description: Trả về một mảng của tất cả PLOs.
 *     responses:
 *       200:
 *         description: Một mảng các PLO.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo'
 *       500:
 *         description: Lỗi server
 */
router.get('/plo', PLO.index);

/**
 * @openapi
 * /api/admin/plo:
 *   post:
 *     summary: Tạo một PLO mới
 *     description: Thêm một PLO mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plo'
 *     responses:
 *       200:
 *         description: PLO được tạo thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/plo', PLO.create);

/**
 * @openapi
 * /api/admin/plo/{id}:
 *   get:
 *     summary: Lấy thông tin một PLO theo ID
 *     description: Trả về thông tin chi tiết của một PLO.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của PLO cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của PLO.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plo'
 *       404:
 *         description: Không tìm thấy PLO
 *       500:
 *         description: Lỗi server
 */
router.get('/plo/:id', PLO.getByID);

/**
 * @openapi
 * /api/admin/plo/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một PLO
 *     description: Cập nhật thông tin của PLO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của PLO cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plo'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho PLO.
 *       404:
 *         description: Không tìm thấy PLO
 *       500:
 *         description: Lỗi server
 */
router.put('/plo/:id', PLO.update);

/**
 * @openapi
 * /api/admin/plo/{id}:
 *   delete:
 *     summary: Xóa một PLO
 *     description: Xóa PLO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của PLO cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PLO đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy PLO
 *       500:
 *         description: Lỗi server
 */
router.delete('/plo/:id', PLO.delete);

/**
 * @openapi
 * /api/admin/plo/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các PLO đã bị xóa
 *     description: Trả về các PLO có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách PLO đã xóa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo'
 *       404:
 *         description: Không tìm thấy PLO nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/plo/isDelete/true', PLO.isDeleteTotrue);

/**
 * @openapi
 * /api/admin/plo/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các PLO chưa bị xóa
 *     description: Trả về các PLO có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách PLO chưa bị xóa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo'
 *       404:
 *         description: Không tìm thấy PLO nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/plo/isDelete/false', PLO.isDeleteTofalse);


router.put('/plo/listId/soft-delete-multiple', PLO.softDeleteMultiple);

router.put('/plo/:id/toggle-soft-delete', PLO.toggleSoftDeleteById);


router.get('/plo/templates/post', PLO.getFormPost);
router.post('/plo/templates/update', PLO.getFormUpdate);

module.exports = router;
