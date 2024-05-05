const PO = require('../models/PoModel'); 

const PoController = {

  // Get all POs
  index: async (req, res) => {
    try {
      const pos = await PO.findAll();
      res.json(pos);
    } catch (error) {
      console.error('Error getting all POs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newPO = await PO.create(data);
      res.json(newPO);
    } catch (error) {
      console.error('Lỗi tạo PO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const po = await PO.findOne({ po_id: id});
      res.json(po);
    } catch (error) {
      console.error('Lỗi tìm kiếm po:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedPO = await PO.update( data, { where: { po_id: id } });
      res.json(updatedPO);
    } catch (error) {
      console.error('Lỗi cập nhật PO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await PO.destroy({ where: { po_id: id } });
      res.json({ message: 'Xóa PO thành công' });
    } catch (error) {
      console.error('Lỗi xóa PO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const po = await PO.findAll({ where: { isDelete: true } });
      if (!po) {
        return res.status(404).json({ message: 'Không tìm thấy PO' });
      }
      res.json(po);
    } catch (error) {
      console.error('Lỗi tìm kiếm PO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async (req, res) => {
    try {

      const po = await PO.findAll({ where: { isDelete: false } });
      console.log(po);
      if (!po) {
        return res.status(404).json({ message: 'Không tìm thấy PO' });
      }
      res.json(po);
    } catch (error) {
      console.error('Lỗi tìm kiếm PO:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const po = await PO.findOne({ where: { po_id: id } });
      if (!po) {
        return res.status(404).json({ message: 'Không tìm thấy PO' });
      }
      const updatedIsDeleted = !po.isDelete;

      PO.update({ isDelete: updatedIsDeleted }, { where: { po_id: id } })
        .then(pos => {
          console.log(pos);
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
module.exports = PoController;
