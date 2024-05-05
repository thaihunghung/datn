const Program = require('../models/ProgramModel');

const programController = {
  index: async (req, res) => {
    try {
      Program.findAll()
        .then(programs => {
          return res.json(programs);
        })
        .catch(error => {
          // Xử lý lỗi nếu có
          console.error('Lỗi lấy dữ liệu:', error);
        });

    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const newProgram = await Program.create(data);
      res.json(newProgram);
    } catch (error) {
      console.error('Lỗi tạo chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const program = await Program.findOne({ program_id: id});
      res.json(program);
    } catch (error) {
      console.error('Lỗi tìm kiếm chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedProgram = await Program.update(data , { where: { program_id: id } });
      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Program.destroy({ where: { program_id: id } });
      res.json({ message: 'Xóa chương trình thành công' });
    } catch (error) {
      console.error('Lỗi xóa chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const program = await Program.findAll({ where: { isDelete: true } });

      if (!program) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      
      res.json(program);
    } catch (error) {
      console.error('Lỗi tìm kiếm program:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async(req, res) => {
    try {
      const program = await Program.findAll({ where: { isDelete: false } });
      if (!program) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      res.json(program);
    } catch (error) {
      console.error('Lỗi tìm kiếm program:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const program = await Program.findOne({ where: { program_id: id } });

      if (!program) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      const updatedIsDeleted = !program.isDelete;
      console.log(updatedIsDeleted);
      Program.update({ isDelete: updatedIsDeleted }, { where: { program_id: id } })
        .then(programs => {
          console.log(programs);
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

module.exports = programController;
