const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();


/**
 * @openapi
 * /api/admin/user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     description: Trả về danh sách tất cả người dùng.
 *     responses:
 *       200:
 *         description: Danh sách người dùng.
 *       500:
 *         description: Lỗi server
 *   
 *   post:
 *     summary: Tạo một người dùng mới
 *     description: Thêm một người dùng mới vào cơ sở dữ liệu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Người dùng được tạo thành công.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/user/{id}:
 *   get:
 *     summary: Lấy thông tin một người dùng theo ID
 *     description: Trả về thông tin chi tiết của một người dùng.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần tìm.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của người dùng.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 *
 *   put:
 *     summary: Cập nhật thông tin của một người dùng
 *     description: Cập nhật thông tin của người dùng dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cho người dùng.
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa một người dùng
 *     description: Xóa người dùng dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Người dùng đã được xóa thành công.
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/user/isDelete/true:
 *   get:
 *     summary: Lấy danh sách các người dùng đã bị xóa
 *     description: Trả về danh sách các người dùng có trạng thái isDelete là true.
 *     responses:
 *       200:
 *         description: Danh sách người dùng đã bị xóa.
 *       404:
 *         description: Không tìm thấy người dùng nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/user/isDelete/false:
 *   get:
 *     summary: Lấy danh sách các người dùng chưa bị xóa
 *     description: Trả về danh sách các người dùng có trạng thái isDelete là false.
 *     responses:
 *       200:
 *         description: Danh sách người dùng chưa bị xóa.
 *       404:
 *         description: Không tìm thấy người dùng nào.
 *       500:
 *         description: Lỗi server
 *
 * /api/admin/user/isDelete/{id}:
 *   put:
 *     summary: Đảo ngược trạng thái isDelete của một người dùng
 *     description: Cập nhật trạng thái isDelete cho người dùng dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần cập nhật trạng thái isDelete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã đảo ngược trạng thái isDelete thành công cho người dùng.
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */

router.get('/user', UserController.index);
router.post('/user', UserController.create);
router.get('/user/:id', UserController.getByID);

router.put('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);

router.get('/user/isDelete/true', UserController.isDeleteTotrue);
router.get('/user/isDelete/false', UserController.isDeleteTofalse);
router.put('/user/isDelete/:id', UserController.isDelete);
module.exports = router;