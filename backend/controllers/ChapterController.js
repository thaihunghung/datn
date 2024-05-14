const ChapterModel = require('../models/ChapterModel');

const ChapterController = {
  // Get all chapters
  index: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll();
      res.json(chapters);
    } catch (error) {
      console.error('Error getting all chapters:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new chapter
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newChapter = await ChapterModel.create(data);
      res.json(newChapter);
    } catch (error) {
      console.error('Error creating chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get chapter by ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.json(chapter);
    } catch (error) {
      console.error('Error finding chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  GetChapterBySubjectId: async (req, res) => {
    try {

      const { subject_id } = req.params;
      const chapter = await ChapterModel.findAll({ where: { subject_id: subject_id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.json(chapter);
    } catch (error) {
      console.error('Error finding chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }, 
  // Update chapter
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedChapter = await ChapterModel.update(data, { where: { chapter_id: id } });
      res.json({ message: `Successfully updated chapter with ID: ${id}` });
    } catch (error) {
      console.error('Error updating chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Delete chapter
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await ChapterModel.destroy({ where: { chapter_id: id } });
      res.json({ message: 'Successfully deleted chapter' });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get chapters with isDelete = true
  isDeleteTotrue: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll({ where: { isDelete: true } });
      if (!chapters) {
        return res.status(404).json({ message: 'No chapters found' });
      }
      res.json(chapters);
    } catch (error) {
      console.error('Error finding chapters with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get chapters with isDelete = false
  isDeleteTofalse: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll({ where: { isDelete: false } });
      if (!chapters) {
        return res.status(404).json({ message: 'No chapters found' });
      }
      res.json(chapters);
    } catch (error) {
      console.error('Error finding chapters with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Toggle isDelete status of a chapter
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedIsDeleted = !chapter.isDelete;
      await ChapterModel.update({ isDelete: updatedIsDeleted }, { where: { chapter_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = ChapterController;
