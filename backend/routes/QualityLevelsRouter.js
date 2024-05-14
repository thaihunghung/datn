const express = require('express');
const router = express.Router();
const qualityLevelsController = require('../controllers/QualityLevelsController');

/**
 * @openapi
 * /api/admin/quality-level:
 *   get:
 *     summary: Lấy danh sách tất cả các mức chất lượng
 *     description: Trả về một mảng các mức chất lượng.
 *     responses:
 *       200:
 *         description: Một mảng các mức chất lượng.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một mức chất lượng mới
 *     description: Thêm một mức chất lượng mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QualityLevel'
 *     responses:
 *       200:
 *         description: Mức chất lượng được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/quality-level/{id}:
 *   get:
 *     summary: Lấy thông tin một mức chất lượng theo ID
 *     description: Trả về thông tin chi tiết của một mức chất lượng.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của mức chất lượng cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của mức chất lượng.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QualityLevel'
 *       404:
 *         description: Không tìm thấy mức chất lượng
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một mức chất lượng
 *     description: Cập nhật thông tin của mức chất lượng dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của mức chất lượng cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QualityLevel'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho mức chất lượng.
 *       404:
 *         description: Không tìm thấy mức chất lượng
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một mức chất lượng
 *     description: Xóa mức chất lượng dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của mức chất lượng cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mức chất lượng đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy mức chất lượng
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/quality-level/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các mức chất lượng đã bị xóa
 *     description: Trả về các mức chất lượng có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách mức chất lượng đã xóa.
 *       404:
 *         description: Không tìm thấy mức chất lượng nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/quality-level/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các mức chất lượng chưa bị xóa
 *     description: Trả về các mức chất lượng có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách mức chất lượng chưa bị xóa.
 *       404:
 *         description: Không tìm thấy mức chất lượng nào.
 *       500:
 *         description: Lỗi server
 * /api/admin/quality-level/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một mức chất lượng
 *     description: Cập nhật trạng thái isDelete cho mức chất lượng dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của mức chất lượng cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy mức chất lượng
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/quality-level/rubric-item/{ItemsRubricId}:
 *   delete:
 *     summary: Xóa một mức chất lượng dựa trên ID của Rubric Item
 *     description: Xóa mức chất lượng dựa trên ID của Rubric Item.
 *     parameters:
 *       - in: path
 *         name: ItemsRubricId
 *         required: true
 *         description: ID của Rubric Item liên kết với mức chất lượng.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mức chất lượng đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy mức chất lượng hoặc Rubric Item
 *       500:
 *         description: Lỗi server
 */
router.get('/quality-level', qualityLevelsController.index);
router.post('/quality-level', qualityLevelsController.create);

router.get('/quality-level/:id', qualityLevelsController.getByID);
router.put('/quality-level/:id', qualityLevelsController.update);
router.delete('/quality-level/:id', qualityLevelsController.delete);

router.get('/quality-level/isDelete/true', qualityLevelsController.isDeleteTotrue);
router.get('/quality-level/isDelete/false', qualityLevelsController.isDeleteTofalse);
router.put('/quality-level/isDelete/:id', qualityLevelsController.isdelete);
router.delete('/quality-level/rubric-item/:ItemsRubricId', qualityLevelsController.deleteByIdItemsRubric);

module.exports = router;