const express = require('express');
const RubricItemController = require('../controllers/RubricItemController');
const router = express.Router();

// // Định nghĩa các route cho chương trình
// /**
//  * @openapi
//  * /api/admin/rubric-item:
//  *   get:
//  *     summary: Lấy danh sách tất cả Rubric Items
//  *     description: Trả về một mảng của tất cả Rubric Items.
//  *     responses:
//  *       200:
//  *         description: Một mảng các Rubric Items.
//  *       500:
//  *         description: Lỗi server
//  *
//  *   post:
//  *     summary: Tạo một Rubric Item mới
//  *     description: Thêm một Rubric Item mới vào cơ sở dữ liệu.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/RubricItem'
//  *     responses:
//  *       200:
//  *         description: Rubric Item được tạo thành công.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric-item/{id}:
//  *   get:
//  *     summary: Lấy thông tin một Rubric Item theo ID
//  *     description: Trả về thông tin chi tiết của một Rubric Item.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric Item cần tìm.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Thông tin chi tiết của Rubric Item.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/RubricItem'
//  *       404:
//  *         description: Không tìm thấy Rubric Item
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric-item/{rubric_id}/check-score:
//  *   post:
//  *     summary: Kiểm tra điểm của Rubric Item dựa trên Rubric ID
//  *     description: Kiểm tra điểm của Rubric Item dựa trên Rubric ID.
//  *     parameters:
//  *       - in: path
//  *         name: rubric_id
//  *         required: true
//  *         description: ID của Rubric.
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/RubricItem'
//  *     responses:
//  *       200:
//  *         description: Đã kiểm tra điểm của Rubric Item thành công.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric-item/{id}:
//  *   put:
//  *     summary: Cập nhật thông tin của một Rubric Item
//  *     description: Cập nhật thông tin của Rubric Item dựa trên ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric Item cần cập nhật.
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/RubricItem'
//  *     responses:
//  *       200:
//  *         description: Cập nhật thành công cho Rubric Item.
//  *       404:
//  *         description: Không tìm thấy Rubric Item
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric-item/{id}:
//  *   delete:
//  *     summary: Xóa một Rubric Item
//  *     description: Xóa Rubric Item dựa trên ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric Item cần xóa.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Rubric Item đã được xóa thành công.
//  *       404:
//  *         description: Không tìm thấy Rubric Item
//  *       500:
//  *         description: Lỗi server
//   * /api/admin/rubric-item/isDelete/true:
//  *   get:
//  *     summary: Lấy danh sách các Rubric Items đã bị xóa
//  *     description: Trả về các Rubric Items có trạng thái isDelete là true.
//  *     responses:
//  *       200:
//  *         description: Danh sách Rubric Items đã xóa.
//  *       404:
//  *         description: Không tìm thấy Rubric Item nào.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric-item/isDelete/false:
//  *   get:
//  *     summary: Lấy danh sách các Rubric Items chưa bị xóa
//  *     description: Trả về các Rubric Items có trạng thái isDelete là false.
//  *     responses:
//  *       200:
//  *         description: Danh sách Rubric Items chưa bị xóa.
//  *       404:
//  *         description: Không tìm thấy Rubric Item nào.
//  *       500:
//  *         description: Lỗi server
//  *
//  * /api/admin/rubric-item/isDelete/{id}:
//  *   put:
//  *     summary: Đảo ngược trạng thái isDelete của một Rubric Item
//  *     description: Cập nhật trạng thái isDelete cho Rubric Item dựa trên ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID của Rubric Item cần cập nhật trạng thái isDelete.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Đã đảo ngược trạng thái isDelete thành công.
//  *       404:
//  *         description: Không tìm thấy Rubric Item
//  *       500:
//  *         description: Lỗi server
//  */

router.get('/rubric-items', RubricItemController.index);
router.post('/rubric-item', RubricItemController.create);
router.get('/rubric-item/:rubricsitem_id', RubricItemController.getByID);

router.post('/rubric-item/checkscore', RubricItemController.checkScore);

router.put('/rubric-item/:rubricsitem_id', RubricItemController.update);
router.delete('/rubric-item/:rubricsitem_id', RubricItemController.delete);
router.delete('/rubric-items/delete/multiple', RubricItemController.deleteMultiple);

router.put('/rubric-items/soft-delete-multiple', RubricItemController.softDeleteMultiple);
router.put('/rubric-item/:rubricsitem_id/soft-delete', RubricItemController.toggleSoftDeleteById);

router.get('/rubric-items/isDelete/true', RubricItemController.isDeleteTotrue);
router.get('/rubric-items/isDelete/false', RubricItemController.isDeleteTofalse);

module.exports = router;

