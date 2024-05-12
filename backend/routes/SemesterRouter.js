const express = require('express');
const SemesterController = require('../controllers/SemesterController');
const router = express.Router();


// Định nghĩa các route cho chương trình
router.get('/semester', SemesterController.index);
router.post('/semester', SemesterController.create);
router.get('/semester/:id', SemesterController.getByID);

router.put('/semester/:id', SemesterController.update);
router.delete('/semester/:id', SemesterController.delete);

router.get('/semester/isDelete/true', SemesterController.isDeleteTotrue);
router.get('/semester/isDelete/false', SemesterController.isDeleteTofalse);
router.put('/semester/isDelete/:id', SemesterController.isDelete);
module.exports = router;