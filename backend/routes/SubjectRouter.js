const express = require('express');
const SubjectController = require('../controllers/SubjectController');
const router = express.Router();


// Định nghĩa các route cho chương trình
router.get('/subject', SubjectController.index);
router.post('/subject', SubjectController.create);
router.get('/subject/:id', SubjectController.getByID);
router.get('/subject/:id/clo-ids', SubjectController.getArrayIDCloBySubjectId);

router.put('/subject/:id', SubjectController.update);
router.delete('/subject/:id', SubjectController.delete);

router.get('/subject/isDelete/true', SubjectController.isDeleteTotrue);
router.get('/subject/isDelete/false', SubjectController.isDeleteTofalse);


router.put('/subject/isDelete/:id', SubjectController.isDelete);
module.exports = router;