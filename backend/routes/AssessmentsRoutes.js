const express = require('express');
const router = express.Router();
const assessmentsController = require('../controllers/AssessmentsController');

/**
 * @openapi
 * /api/admin/assessment:
 *   get:
 *     summary: Lấy danh sách tất cả các đánh giá
 *     description: Trả về danh sách tất cả các đánh giá.
 *     responses:
 *       200:
 *         description: Danh sách các đánh giá.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một đánh giá mới
 *     description: Thêm một đánh giá mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assessment'
 *     responses:
 *       200:
 *         description: Đánh giá được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/assessment/{id}:
 *   get:
 *     summary: Lấy thông tin một đánh giá theo ID
 *     description: Trả về thông tin chi tiết của một đánh giá.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đánh giá cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của đánh giá.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assessment'
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một đánh giá
 *     description: Cập nhật thông tin của đánh giá dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đánh giá cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assessment'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho đánh giá.
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một đánh giá
 *     description: Xóa đánh giá dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đánh giá cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đánh giá đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/assessment/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các đánh giá đã bị xóa
 *     description: Trả về các đánh giá có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách đánh giá đã xóa.
 *       404:
 *         description: Không tìm thấy đánh giá nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/assessment/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các đánh giá chưa bị xóa
 *     description: Trả về các đánh giá có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách đánh giá chưa bị xóa.
 *       404:
 *         description: Không tìm thấy đánh giá nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/assessment/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một đánh giá
 *     description: Cập nhật trạng thái isDelete cho đánh giá dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đánh giá cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 */

router.get('/assessments', assessmentsController.index);
router.get('/assessments/user/:user_id', assessmentsController.GetByUser);
router.post('/assessment', assessmentsController.create);

router.get('/assessment/:assessment_id', assessmentsController.getByID);
router.put('/assessment/:assessment_id', assessmentsController.update);
router.delete('/assessment/:assessment_id', assessmentsController.delete);

router.get('/assessments/isDelete/true', assessmentsController.isDeleteTotrue);
router.get('/assessments/isDelete/false', assessmentsController.isDeleteTofalse);
router.put('/assessment/isDelete/:assessment_id', assessmentsController.isdelete);

module.exports = router;