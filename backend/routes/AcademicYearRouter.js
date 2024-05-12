const express = require('express');
const AcademicYearController = require('../controllers/AcademicYearController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/academic-year', AcademicYearController.index);
router.post('/academic-year', AcademicYearController.create);
router.get('/academic-year/:id', AcademicYearController.getByID);

router.put('/academic-year/:id', AcademicYearController.update);
router.delete('/academic-year/:id', AcademicYearController.delete);

router.get('/academic-year/isDelete/true', AcademicYearController.isDeleteTotrue);
router.get('/academic-year/isDelete/false', AcademicYearController.isDeleteTofalse);

router.put('/academic-year/isDelete/:id', AcademicYearController.IsDelete);
module.exports = router;