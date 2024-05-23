const CloChapterModel = require('../models/CloChapterModel'); 
const ChapterModel = require('../models/ChapterModel'); 

const Clo_ChapterController = {

  // Get all PoPlo
  getAll: async (req, res) => {
    try {
      const PoPlo = await CloChapterModel.findAll();
      res.json(PoPlo);
    } catch (error) {
      console.error('Error getting all CloChapter:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  GetChapterCloByCloId: async (req, res) => {
    try {
      const {clo_id} = req.params
      const CloChap = await CloChapterModel.findAll({
        where: {clo_id: clo_id},
      });
      const chap_ids = CloChap.map((item) => item.chapter_id)

      const Chapter = await ChapterModel.findAll({
        where: {chapter_id: chap_ids},
      });
      res.json(Chapter);
    } catch (error) {
      console.error('Error getting all CloChap:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  GetChapterCloByCloIds: async (req, res) => {
    try {
      const { data } = req.body;
      const { id_Chapters } = data;

      const CloChaps = await CloChapterModel.findAll({
        where: {
          chapter_id: id_Chapters
        }
      });

      if (CloChaps.length === 0) {
        return res.status(404).json({ message: 'No CHAPTER-CLOs found for the given CHAPTER IDs' });
      }

      res.status(200).json(CloChaps);
    } catch (error) {
      console.error('Error fetching CHAPTER-CLOs by CHAPTER IDs:', error);
      res.status(500).json({ message: 'An error occurred while fetching CHAPTER-CLOs' });
    }
  },

  SaveCloChapter: async (req, res) => {
    try {
      const { dataSave } = req.body;
      if (dataSave && dataSave.length > 0) {
          await CloChapterModel.bulkCreate(dataSave);
      }
      res.json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error SaveOrDelete:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  DeleteCloChapter: async (req, res) => {
    try {
      const { dataDelete } = req.body;

      console.log(dataDelete);
      if (dataDelete && dataDelete.length > 0) {
          await CloChapterModel.destroy({ where: { id_clo_chapter : dataDelete.map(item => item.id_clo_chapter ) } });
      }

      res.json({ message: 'Data deleted successfully' });
    } catch (error) {
      console.error('Error SaveOrDelete:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  
  
};

module.exports = Clo_ChapterController;
