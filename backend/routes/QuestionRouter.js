const express = require('express');
const QuestionController = require('../controllers/QuestionController');
const router = express.Router();

/**
 * @openapi
 * /api/admin/question:
 *   get:
 *     summary: Lấy danh sách tất cả các câu hỏi
 *     description: Trả về danh sách tất cả các câu hỏi.
 *     responses:
 *       200:
 *         description: Danh sách các câu hỏi.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một câu hỏi mới
 *     description: Thêm một câu hỏi mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Câu hỏi được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/question/{id}:
 *   get:
 *     summary: Lấy thông tin một câu hỏi theo ID
 *     description: Trả về thông tin chi tiết của một câu hỏi.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của câu hỏi cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của câu hỏi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một câu hỏi
 *     description: Cập nhật thông tin của câu hỏi dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của câu hỏi cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho câu hỏi.
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một câu hỏi
 *     description: Xóa câu hỏi dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của câu hỏi cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Câu hỏi đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/question/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các câu hỏi đã bị xóa
 *     description: Trả về các câu hỏi có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi đã xóa.
 *       404:
 *         description: Không tìm thấy câu hỏi nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/question/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các câu hỏi chưa bị xóa
 *     description: Trả về các câu hỏi có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi chưa bị xóa.
 *       404:
 *         description: Không tìm thấy câu hỏi nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/question/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một câu hỏi
 *     description: Cập nhật trạng thái isDelete cho câu hỏi dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của câu hỏi cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công cho câu hỏi.
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */

router.get('/question', QuestionController.index);
router.post('/question', QuestionController.create);
router.get('/question/:id', QuestionController.getByID);

router.put('/question/:id', QuestionController.update);
router.delete('/question/:id', QuestionController.delete);

router.get('/question/isDelete/true', QuestionController.isDeleteTotrue);
router.get('/question/isDelete/false', QuestionController.isDeleteTofalse);

router.put('/question/isDelete/:id', QuestionController.isdelete);
module.exports = router;