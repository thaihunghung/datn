const express = require('express');
const router = express.Router();
const CLO_CHAPTER = require('../controllers/Clo_ChapterController');

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/clo-chapter:
 *   get:
 *     summary: Lấy tất cả CLO-CHAPTER
 *     description: Trả về một mảng của tất cả CLO-CHAPTER.
 *     responses:
 *       200:
 *         description: Một mảng các CLO-CHAPTER.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clo_Chapter'
 *       500:
 *         description: Lỗi server
 */
router.get('/clo-chapter', CLO_CHAPTER.getAll);

/**
 * @openapi
 * /api/admin/clo-chapter/SaveOrDelete:
 *   post:
 *     summary: Lưu hoặc xóa CLO-CHAPTER
 *     description: Lưu hoặc xóa một CLO-CHAPTER trong cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clo_Chapter'
 *     responses:
 *       200:
 *         description: CLO-CHAPTER được xử lý thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/clo-chapter/SaveOrDelete', CLO_CHAPTER.SaveOrDelete);

/**
 * @openapi
 * /api/admin/clo-chapter/clo/{clo_id}/getChapter:
 *   get:
 *     summary: Lấy danh sách Chapter liên kết với CLO
 *     description: Trả về danh sách Chapter liên kết với CLO theo ID.
 *     parameters:
 *       - in: path
 *         name: clo_id
 *         required: true
 *         description: ID của CLO cần tìm các Chapter liên kết.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách Chapter liên kết với CLO.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clo_Chapter'
 *       404:
 *         description: Không tìm thấy Chapter liên kết với CLO
 *       500:
 *         description: Lỗi server
 */
router.get('/clo-chapter/clo/:clo_id/getChapter', CLO_CHAPTER.GetChapterCloByCloId);

module.exports = router;
