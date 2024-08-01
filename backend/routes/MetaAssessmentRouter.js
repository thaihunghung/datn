const express = require('express');
const MetaAssessmentController = require('../controllers/MetaAssessmentController');
const router = express.Router();


router.get('/meta-assessments', MetaAssessmentController.index);
router.post('/meta-assessments', MetaAssessmentController.create);
router.get('/meta-assessments/:id', MetaAssessmentController.show);
router.put('/meta-assessments/:id', MetaAssessmentController.update);
router.delete('/meta-assessments/:id', MetaAssessmentController.delete);

// Các route khác có thể thêm vào ở đây nếu cần
// Ví dụ, các route để thay đổi trạng thái isDelete, nếu cần
// router.get('/meta-assessments/isDelete/true', MetaAssessmentController.isDeleteToTrue);
// router.get('/meta-assessments/isDelete/false', MetaAssessmentController.isDeleteToFalse);
// router.put('/meta-assessments/isDelete/:id', MetaAssessmentController.IsDelete);

module.exports = router;
