const PLO = require('../models/PloModel'); 

const PloController = {
  // Get all PLOs
  index: async (req, res) => {
    try {
      const plos = await PLO.findAll();
      res.json(plos);
    } catch (error) {
      console.error('Error getting all PLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new PLO
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newPLO = await PLO.create(data);
      res.json(newPLO);
    } catch (error) {
      console.error('Lỗi tạo PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const plo = await PLO.findOne({ plo_id: id });
      res.json(plo);
    } catch (error) {
      console.error('Lỗi tìm kiếm PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedPLO = await PLO.update( data, { where: { plo_id: id } });
      res.json(updatedPLO);
    } catch (error) {
      console.error('Lỗi cập nhật PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await PLO.destroy({ where: { plo_id: id } });
      res.json({ message: 'Xóa PLO thành công' });
    } catch (error) {
      console.error('Lỗi xóa PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const plo = await PLO.findAll({ where: { isDelete: true } });
      if (!plo) {
        return res.status(404).json({ message: 'Không tìm thấy PLO' });
      }
      res.json(plo);
    } catch (error) {
      console.error('Lỗi tìm kiếm PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const plo = await PLO.findAll({ where: { isDelete: false } });
      if (!plo) {
        return res.status(404).json({ message: 'Không tìm thấy PLO' });
      }
      res.json(plo);
    } catch (error) {
      console.error('Lỗi tìm kiếm PLO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const plo = await PLO.findOne({ where: { plo_id: id } });
      if (!plo) {
        return res.status(404).json({ message: 'Không tìm thấy PLO' });
      }
      const updatedIsDeleted = !plo.isDelete;

      PLO.update({ isDelete: updatedIsDeleted }, { where: { plo_id: id } })
        .then(plos => {
          console.log(plos);
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

module.exports = PloController;
