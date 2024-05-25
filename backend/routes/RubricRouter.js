const express = require('express');
const RubricController = require('../controllers/RubricController');
const router = express.Router();

// /**
//  * @openapi
//  * /api/admin/rubric:
//  *   get:
//  *     summary: Lấy danh sách tất cả Rubrics
//  *     description: Trả về một mảng của tất cả Rubrics.
//  *     responses:
//  *       200:
//  *         description: Một mảng các Rubrics.
//  *       500:
//  *         description: Lỗi server
//  *
//  *   post:
//  *     summary: Tạo một Rubric mới
//  *     description: Thêm một Rubric mới vào cơ sở dữ liệu.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Rubric'
//  *     responses:
//  *       200:
//  *         description: Rubric được tạo thành công.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/{id}:
//  *   get:
//  *     summary: Lấy thông tin một Rubric theo ID
//  *     description: Trả về thông tin chi tiết của một Rubric.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric cần tìm.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Thông tin chi tiết của Rubric.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Rubric'
//  *       404:
//  *         description: Không tìm thấy Rubric
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/{id}:
//  *   put:
//  *     summary: Cập nhật thông tin của một Rubric
//  *     description: Cập nhật thông tin của Rubric dựa trên ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric cần cập nhật.
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Rubric'
//  *     responses:
//  *       200:
//  *         description: Cập nhật thành công cho Rubric.
//  *       404:
//  *         description: Không tìm thấy Rubric
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/{id}:
//  *   delete:
//  *     summary: Xóa một Rubric
//  *     description: Xóa Rubric dựa trên ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric cần xóa.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Rubric đã được xóa thành công.
//  *       404:
//  *         description: Không tìm thấy Rubric
//  *       500:
//  *         description: Lỗi server
// /**
//  * 
//  * /api/admin/rubric/isDelete/true:
//  *   get:
//  *     summary: Lấy danh sách các Rubrics đã bị xóa
//  *     description: Trả về các Rubrics có trạng thái isDelete là true.
//  *     responses:
//  *       200:
//  *         description: Danh sách Rubrics đã xóa.
//  *       404:
//  *         description: Không tìm thấy Rubric nào.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/isDelete/false:
//  *   get:
//  *     summary: Lấy danh sách các Rubrics chưa bị xóa
//  *     description: Trả về các Rubrics có trạng thái isDelete là false.
//  *     responses:
//  *       200:
//  *         description: Danh sách Rubrics chưa bị xóa.
//  *       404:
//  *         description: Không tìm thấy Rubric nào.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/isDelete/{id}:
//  *   put:
//  *     summary: Đảo ngược trạng thái isDelete của một Rubric
//  *     description: Cập nhật trạng thái isDelete cho Rubric dựa trên ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric cần cập nhật trạng thái isDelete.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Đã đảo ngược trạng thái isDelete thành công.
//  *       404:
//  *         description: Không tìm thấy Rubric
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/{id}/items:
//  *   get:
//  *     summary: Lấy danh sách các Rubric Items của Rubric
//  *     description: Trả về danh sách các Rubric Items của một Rubric dựa trên ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Danh sách Rubric Items.
//  *       404:
//  *         description: Không tìm thấy Rubric hoặc không có Rubric Items.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/get-by-user/:userId/checkscore:
//  *   get:
//  *     summary: Lấy danh sách các Rubrics và kiểm tra điểm của người dùng dựa trên ID
//  *     description: Trả về danh sách các Rubrics và kiểm tra điểm của người dùng dựa trên ID người dùng.
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         description: ID của người dùng.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Danh sách các Rubrics và kết quả kiểm tra điểm.
//  *       404:
//  *         description: Không tìm thấy Rubrics hoặc không có kết quả kiểm tra điểm.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric/get-by-user/checkscore:
//  *   get:
//  *     summary: Lấy danh sách các Rubrics và kiểm tra điểm của người dùng hiện tại
//  *     description: Trả về danh sách các Rubrics và kiểm tra điểm của người dùng hiện tại.
//  *     responses:
//  *       200:
//  *         description: Danh sách các Rubrics và kết quả kiểm tra điểm.
//  *       404:
//  *         description: Không tìm thấy Rubrics hoặc không có kết quả kiểm tra điểm.
//  *       500:
//  *         description: Lỗi server
//  */

router.get('/rubric', RubricController.index);
router.post('/rubric', RubricController.create);
router.get('/rubric/:id', RubricController.getByID);
router.put('/rubric/:id', RubricController.update);
router.delete('/rubric/:id', RubricController.delete);
router.delete('/rubric/delete/multiple', RubricController.deleteMultiple);

router.get('/rubric/isDelete/true', RubricController.isDeleteTotrue);
router.get('/rubric/isDelete/false', RubricController.isDeleteTofalse);
router.put('/rubric/isDelete/:id', RubricController.isdelete);
router.get('/rubric/:id/items', RubricController.GetItemsRubricsByIdRubrics);
router.get('/rubric/:id/items-isDelete-true', RubricController.GetItemsRubricsByIdRubricsisDeleteTrue);

//router.get('/rubric/get-by-user/:userId/checkscore', RubricController.GetByUserIdAndCheckScore);
router.get('/rubric/get-by-user/checkscore', RubricController.GetByUserAndCheckScore);
router.put('/rubric/listId/soft-delete-multiple', RubricController.softDeleteMultiple);
router.get('/rubric/archive/get-by-user/checkscore', RubricController.GetisDeleteTotrueByUserAndCheckScore);

router.put('/rubric/:id/toggle-soft-delete', RubricController.toggleSoftDeleteById);
// /rubrics/get-by-user/:userId/checkscore  vậy mới đúng
module.exports = router;