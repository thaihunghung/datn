const express = require('express');
const router = express.Router();
const rubric_question = require('../controllers/Rubric_QuestionController');
/**
 * @openapi
 * /api/admin/rubric_question:
 *   get:
 *     summary: Lấy danh sách tất cả câu hỏi Rubric
 *     description: Trả về danh sách tất cả câu hỏi Rubric.
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi Rubric.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Lưu hoặc xóa câu hỏi Rubric
 *     description: Lưu hoặc xóa câu hỏi Rubric vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricQuestion'
 *     responses:
 *       200:
 *         description: Thành công.
 *       500:
 *         description: Lỗi server
 */

router.get('/rubric_question', rubric_question.getAll);
router.post('/rubric_question/SaveOrDelete', rubric_question.SaveOrDelete);
module.exports = router;