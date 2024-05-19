const SubjectModel = require("../models/SubjectModel");
const CloModel = require("../models/CloModel");
const ChapterModel = require("../models/ChapterModel");

const SubjectController = {
  index: async (req, res) => {
    try {
      const subjects = await SubjectModel.findAll();
      res.status(200).json(subjects);
    } catch (error) {
      console.error('Error fetching all subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newSubject = await SubjectModel.create(data);
      res.status(201).json(newSubject);
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      res.status(200).json(subject);
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getArrayIDCloBySubjectId: async (req, res) => {
    try {
      const { id } = req.params;
      const clos = await CloModel.findAll({
        where: { subject_id: id },
        attributes: ['clo_id']
      });

      if (clos.length === 0) {
        return res.status(404).json({ message: 'No CLOs found for the given subject ID' });
      }

      const cloIds = clos.map(clo => clo.clo_id);
      res.status(200).json(cloIds);
    } catch (error) {
      console.error('Error fetching CLOs by subject ID:', error);
      res.status(500).json({ message: 'An error occurred while fetching CLOs' });
    }
  },
  
  getArrayIDChapterBySubjectId: async (req, res) => {
    try {
      const { id } = req.params;
      const Chapters = await ChapterModel.findAll({
        where: { subject_id: id },
        attributes: ['chapter_id']
      });

      if (Chapters.length === 0) {
        return res.status(404).json({ message: 'No Chapters found for the given subject ID' });
      }
      const ChapterIds = Chapters.map(Chapter => Chapter.chapter_id);
      res.status(200).json(ChapterIds);
    } catch (error) {
      console.error('Error fetching Chapters by subject ID:', error);
      res.status(500).json({ message: 'An error occurred while fetching Chapters' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      await SubjectModel.update(data, { where: { subject_id: id } });
      res.status(200).json({ message: `Successfully updated subject with ID: ${id}` });
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      await SubjectModel.destroy({ where: { subject_id: id } });
      res.status(200).json({ message: 'Successfully deleted subject' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const deletedSubjects = await SubjectModel.findAll({ where: { isDelete: true } });
      res.status(200).json(deletedSubjects);
    } catch (error) {
      console.error('Error fetching deleted subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const activeSubjects = await SubjectModel.findAll({
        where: { isDelete: false }
      });
      const subjectIds = activeSubjects.map(subject => subject.subject_id);
      const Clos = await CloModel.findAll({ where: { subject_id: subjectIds } });
      const Chapter = await ChapterModel.findAll({ where: { subject_id: subjectIds } });


      for (const subject of activeSubjects) {
        const closForSubject = Clos.filter(clos => clos.subject_id === subject.subject_id);
        const ChapterForSubject = Chapter.filter(Chapter => Chapter.subject_id === subject.subject_id);
        subject.dataValues.CLO = closForSubject;
        subject.dataValues.CHAPTER = ChapterForSubject;
      }

      //activeSubjects.dataValues.CLO = Clos;
      //activeSubjects.dataValues.CHAPTER = Chapter;

      res.status(200).json(activeSubjects);
    } catch (error) {
      console.error('Error fetching active subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      const updatedIsDeleted = !subject.isDelete;
      await SubjectModel.update({ isDelete: updatedIsDeleted }, { where: { subject_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling isDelete status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = SubjectController;
