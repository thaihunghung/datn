const express = require('express');
const ChapterController = require('../controllers/ChapterController');
const router = express.Router();

// Định nghĩa các route cho chương trình
/**
 * @openapi
 * /api/admin/chapter:
 *   get:
 *     summary: Lấy danh sách tất cả Chapters
 *     description: Trả về một mảng của tất cả Chapters.
 *     responses:
 *       200:
 *         description: Một mảng các Chapters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chapter'
 *       500:
 *         description: Lỗi server
 */
router.get('/chapter', ChapterController.index);

/**
 * @openapi
 * /api/admin/chapter:
 *   post:
 *     summary: Tạo một Chapter mới
 *     description: Thêm một Chapter mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chapter'
 *     responses:
 *       200:
 *         description: Chapter được tạo thành công.
 *       500:
 *         description: Lỗi server
 */
router.post('/chapter', ChapterController.create);

/**
 * @openapi
 * /api/admin/chapter/{id}:
 *   get:
 *     summary: Lấy thông tin một Chapter theo ID
 *     description: Trả về thông tin chi tiết của một Chapter.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của Chapter cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của Chapter.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: Không tìm thấy Chapter
 *       500:
 *         description: Lỗi server
 */
router.get('/chapter/:id', ChapterController.getByID);

/**
 * @openapi
 * /api/admin/chapter/subject/{subject_id}:
 *   get:
 *     summary: Lấy danh sách Chapter theo Subject ID
 *     description: Trả về danh sách các Chapter theo Subject ID.
 *     parameters:
 *       - in: path
 *         name: subject_id
 *         required: true
 *         description: ID của Subject.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách các Chapter.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: Không tìm thấy Chapter
 *       500:
 *         description: Lỗi server
 */
router.get('/chapter/subject/:subject_id', ChapterController.GetChapterBySubjectId);

/**
 * @openapi
 * /api/admin/chapter/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một Chapter
 *     description: Cập nhật thông tin của Chapter dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của Chapter cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chapter'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho Chapter.
 *       404:
 *         description: Không tìm thấy Chapter
 *       500:
 *         description: Lỗi server
 */
router.put('/chapter/:id', ChapterController.update);

/**
 * @openapi
 * /api/admin/chapter/{id}:
 *   delete:
 *     summary: Xóa một Chapter
 *     description: Xóa Chapter dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của Chapter cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chapter đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy Chapter
 *       500:
 *         description: Lỗi server
 */
router.delete('/chapter/:id', ChapterController.delete);

/**
 * @openapi
 * /api/admin/chapter/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các Chapters đã bị xóa
 *     description: Trả về các Chapters có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách Chapters đã xóa.
 *       404:
 *         description: Không tìm thấy Chapter nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/chapter/isDelete/true', ChapterController.isDeleteTotrue);

/**
 * @openapi
 * /api/admin/chapter/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các Chapters chưa bị xóa
 *     description: Trả về các Chapters có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách Chapters chưa bị xóa.
 *       404:
 *         description: Không tìm thấy Chapter nào.
 *       500:
 *         description: Lỗi server
 */
router.get('/chapter/isDelete/false', ChapterController.isDeleteTofalse);

/**
 * @openapi
 * /api/admin/chapter/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một Chapter
 *     description: Cập nhật trạng thái isDelete cho Chapter dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của Chapter cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công.
 *       404:
 *         description: Không tìm thấy Chapter
 *       500:
 *         description: Lỗi server
 */
router.put('/chapter/isDelete/:id', ChapterController.isdelete);

router.put('/chapter/listId/soft-delete-multiple', ChapterController.softDeleteMultiple);

router.put('/chapter/:id/toggle-soft-delete', ChapterController.toggleSoftDeleteById);

router.get('/chapter/templates/post', ChapterController.getFormPost);

router.post('/chapter/templates/update', ChapterController.getFormUpdate);


module.exports = router;
