const express = require('express');
const router = express.Router();
const PO_PLO = require('../controllers/Po_PloController');

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/po-plo:
 *   get:
 *     summary: Lấy tất cả PO-PLO
 *     description: Trả về một mảng của tất cả PO-PLO.
 *     responses:
 *       200:
 *         description: Một mảng các PO-PLO.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Po_Plo'
 *       500:
 *         description: Lỗi server
 */
router.get('/po-plo', PO_PLO.getAll);

/**
 * @openapi
 * /api/admin/po-plo/SaveOrDelete:
 *   post:
 *     summary: Lưu hoặc xóa PO-PLO
 *     description: Lưu hoặc xóa một PO-PLO trong cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Po_Plo'
 *     responses:
 *       200:
 *         description: PO-PLO được xử lý thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/po-plo/SaveOrDelete', PO_PLO.SaveOrDelete);

module.exports = router;
