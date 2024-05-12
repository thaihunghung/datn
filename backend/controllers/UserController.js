const UserModel = require("../models/UserModel");

const UserController = {
  // Lấy tất cả người dùng
  index: async (req, res) => {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả người dùng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo một người dùng mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newUser = await UserModel.create(data);
      res.json(newUser);
    } catch (error) {
      console.error('Lỗi khi tạo người dùng mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy thông tin của một người dùng dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const userDetails = await UserModel.findOne({ where: { user_id: id } });
      if (!userDetails) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      res.json(userDetails);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật thông tin của một người dùng dựa trên ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const userDetails = await UserModel.findOne({ where: { user_id: id } });
      if (!userDetails) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      await UserModel.update(data, { where: { user_id: id } });
      res.json({ message: `Cập nhật thành công thông tin người dùng có ID: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Xóa một người dùng dựa trên ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await UserModel.destroy({ where: { user_id: id } });
      res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const users = await UserModel.findAll({ where: { isDelete: true } });
      if (!users) {
        return res.status(404).json({ message: 'Không tìm thấy users' });
      }
      res.json(users);
    } catch (error) {
      console.error('Lỗi tìm kiếm users:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const users = await UserModel.findAll({ where: { isDelete: false } });
      if (!users) {
        return res.status(404).json({ message: 'Không tìm thấy users' });
      }
      res.json(users);
    } catch (error) {
      console.error('Lỗi tìm kiếm users:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete
  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const users = await UserModel.findOne({ where: { class_id: id } });
      if (!users) {
        return res.status(404).json({ message: 'Không tìm thấy users' });
      }
      const updatedIsDeleted = !users.isDelete;
      await UserModel.update({ isDelete: updatedIsDeleted }, { where: { class_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của users:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }
};

module.exports = UserController;
