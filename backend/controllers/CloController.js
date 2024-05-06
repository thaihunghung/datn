const CloModel = require("../models/CloModel");

const CloController = {
  // Get all clos
  index: async (req, res) => {
    try {
      const clos = await CloModel.findAll();
      res.json(clos);
    } catch (error) {
      console.error('Error getting all clos:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new Clo
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newCLO = await CloModel.create(data);
      res.json(newCLO);
    } catch (error) {
      console.error('Lỗi tạo clo:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'Không tìm thấy CLO' });
      }
      res.json(clo);
    } catch (error) {
      console.error('Lỗi tìm kiếm clo:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'Không tìm thấy CLO' });
      }
      const updatedCLO = await CloModel.update(data, { where: { clo_id: id } });
      res.json({ 'Cập nhật thành công id:': id });
    } catch (error) {
      console.error('Lỗi cập nhật clo:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await CloModel.destroy({ where: { clo_id: id } });
      res.json({ message: 'Xóa clo thành công' });
    } catch (error) {
      console.error('Lỗi xóa clo:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const clo = await CloModel.findAll({ where: { isDelete: true } });
      if (!clo) {
        return res.status(404).json({ message: 'Không tìm thấy CLO' });
      }
      res.json(clo);
    } catch (error) {
      console.error('Lỗi tìm kiếm PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const clo = await CloModel.findAll({ where: { isDelete: false } });
      if (!clo) {
        return res.status(404).json({ message: 'Không tìm thấy CLO' });
      }
      res.json(clo);
    } catch (error) {
      console.error('Lỗi tìm kiếm clo:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'Không tìm thấy CLO' });
      }
      const updatedIsDeleted = !clo.isDelete;

      CloModel.update({ isDelete: updatedIsDeleted }, { where: { clo_id: id } })
        .then(clos => {
          console.log(clos);
        })
        .catch(error => {
          console.error(error);
        });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái isDelete:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = CloController;
