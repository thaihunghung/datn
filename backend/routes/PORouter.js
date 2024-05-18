const express = require('express');
const router = express.Router();
const PO = require('../controllers/PoController');

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/po:
 *   get:
 *     summary: Lấy danh sách tất cả POs
 *     description: Trả về một mảng của tất cả POs.
 *     responses:
 *       200:
 *         description: Một mảng các PO.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Po'
 *       500:
 *         description: Lỗi server
 */
router.get('/po', PO.index);

/**
 * @openapi
 * /api/admin/po:
 *   post:
 *     summary: Tạo một PO mới
 *     description: Thêm một PO mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Po'
 *     responses:
 *       200:
 *         description: PO được tạo thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/po', PO.create);

/**
 * @openapi
 * /api/admin/po/{id}:
 *   get:
 *     summary: Lấy thông tin một PO theo ID
 *     description: Trả về thông tin chi tiết của một PO.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của PO cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của PO.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Po'
 *       404:
 *         description: Không tìm thấy PO
 *       500:
 *         description: Lỗi server
 */
router.get('/po/:id', PO.getByID);

/**
 * @openapi
 * /api/admin/po/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một PO
 *     description: Cập nhật thông tin của PO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của PO cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Po'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho PO.
 *       404:
 *         description: Không tìm thấy PO
 *       500:
 *         description: Lỗi server
 */
router.put('/po/:id', PO.update);

/**
 * @openapi
 * /api/admin/po/{id}:
 *   delete:
 *     summary: Xóa một PO
 *     description: Xóa PO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của PO cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PO đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy PO
 *       500:
 *         description: Lỗi server
 */
router.delete('/po/:id', PO.delete);

/**
 * @openapi
 * /api/admin/po/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các PO đã bị xóa
 *     description: Trả về các PO có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách PO đã xóa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Po'
 *       404:
 *         description: Không tìm thấy PO nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/po/isDelete/true', PO.isDeleteToTrue);

/**
 * @openapi
 * /api/admin/po/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các PO chưa bị xóa
 *     description: Trả về các PO có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách PO chưa bị xóa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Po'
 *       404:
 *         description: Không tìm thấy PO nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/po/isDelete/false', PO.isDeleteToFalse);

/**
 * @openapi
 * /api/admin/po/{id}/toggle-delete:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một PO
 *     description: Cập nhật trạng thái isDelete cho PO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của PO cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy PO
 *       500:
 *         description: Lỗi server
 */
router.put('/po/listId/soft-delete-multiple', PO.softDeleteMultiple);

router.put('/po/:id/toggle-soft-delete', PO.toggleSoftDeleteById);


router.get('/po/templates/post', PO.getFormPost);
router.post('/po/templates/update', PO.getFormUpdate);

module.exports = router;

