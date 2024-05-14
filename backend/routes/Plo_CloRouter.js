const express = require('express');
const router = express.Router();
const PLO_CLO = require('../controllers/Plo_CloController');

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/plo-clo:
 *   get:
 *     summary: Lấy tất cả PLO-CLO
 *     description: Trả về một mảng của tất cả PLO-CLO.
 *     responses:
 *       200:
 *         description: Một mảng các PLO-CLO.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo_Clo'
 *       500:
 *         description: Lỗi server
 */
router.get('/plo-clo', PLO_CLO.getAll);

/**
 * @openapi
 * /api/admin/plo-clo/SaveOrDelete:
 *   post:
 *     summary: Lưu hoặc xóa PLO-CLO
 *     description: Lưu hoặc xóa một PLO-CLO trong cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plo_Clo'
 *     responses:
 *       200:
 *         description: PLO-CLO được xử lý thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/plo-clo/SaveOrDelete', PLO_CLO.SaveOrDelete);

/**
 * @openapi
 * /api/admin/plo-clo/clo/{clo_id}/getPlo:
 *   get:
 *     summary: Lấy danh sách PLO liên kết với CLO
 *     description: Trả về danh sách PLO liên kết với CLO theo ID.
 *     parameters:
 *       - in: path
 *         name: clo_id
 *         required: true
 *         description: ID của CLO cần tìm các PLO liên kết.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách PLO liên kết với CLO.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo_Clo'
 *       404:
 *         description: Không tìm thấy PLO liên kết với CLO
 *       500:
 *         description: Lỗi server
 */
router.get('/plo-clo/clo/:clo_id/getPlo', PLO_CLO.GetPloCloByCloId);

module.exports = router;
