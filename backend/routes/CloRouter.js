const express = require('express');
const CloController = require('../controllers/CloController');
const router = express.Router();

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/clo:
 *   get:
 *     summary: Lấy danh sách tất cả CLOs
 *     description: Trả về một mảng của tất cả CLOs.
 *     responses:
 *       200:
 *         description: Một mảng các CLO.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clo'
 *       500:
 *         description: Lỗi server
 */
router.get('/clo', CloController.index);

/**
 * @openapi
 * /api/admin/clo:
 *   post:
 *     summary: Tạo một CLO mới
 *     description: Thêm một CLO mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clo'
 *     responses:
 *       200:
 *         description: CLO được tạo thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/clo', CloController.create);

/**
 * @openapi
 * /api/admin/clo/{id}:
 *   get:
 *     summary: Lấy thông tin một CLO theo ID
 *     description: Trả về thông tin chi tiết của một CLO.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của CLO cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của CLO.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clo'
 *       404:
 *         description: Không tìm thấy CLO
 *       500:
 *         description: Lỗi server
 */
router.get('/clo/:id', CloController.getByID);

router.get('/clo/subject/:subject_id', CloController.GetCloBySubjectId);

/**
 * @openapi
 *  /api/admin/clo/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một CLO
 *     description: Cập nhật thông tin của CLO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của CLO cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clo'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho CLO.
 *       404:
 *         description: Không tìm thấy CLO
 *       500:
 *         description: Lỗi server
 */
router.put('/clo/:id', CloController.update);

/**
 * @openapi
 *  /api/admin/clo/{id}:
 *   delete:
 *     summary: Xóa một CLO
 *     description: Xóa CLO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của CLO cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CLO đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy CLO
 *       500:
 *         description: Lỗi server
 */
router.delete('/clo/:id', CloController.delete);

/**
 * @openapi
 *  /api/admin/clo/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các CLO đã bị xóa
 *     description: Trả về các CLO có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách CLO đã xóa.
 *       404:
 *         description: Không tìm thấy CLO nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/clo/isDelete/true', CloController.isDeleteTotrue);

/**
 * @openapi
 *  /api/admin/clo/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các CLO chưa bị xóa
 *     description: Trả về các CLO có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách CLO chưa bị xóa.
 *       404:
 *         description: Không tìm thấy CLO nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/clo/isDelete/false', CloController.isDeleteTofalse);

/**
 * @openapi
 *  /api/admin/clo/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một CLO
 *     description: Cập nhật trạng thái isDelete cho CLO dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của CLO cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy CLO
 *       500:
 *         description: Lỗi server
 */
router.put('/clo/isDelete/:id', CloController.isdelete);

module.exports = router;
