const express = require('express');
const ChartController = require('../controllers/ChartController');
const router = express.Router();


router.get('/achieved-rate/clo/percentage', ChartController.getCloPercentage);
router.get('/achieved-rate/plo/percentage', ChartController.getPloPercentage);
router.get('/subject/average/subject', ChartController.averageScoresPerSubject);
router.get('/students/performance/:student_id', ChartController.getStudentPerformanceByCourse);
router.post('/course/arg-score', ChartController.getAverageCourseScores);


module.exports = router;