const express = require('express');
const ChartController = require('../controllers/ChartController');
const router = express.Router();


router.get('/courses/assessment-scores', ChartController.getCourseAssessmentScores);
router.get('/subject/average/subject', ChartController.averageScoresPerSubject);
router.get('/students/performance/:student_id', ChartController.getStudentPerformanceByCourse);
router.post('/course/arg-score', ChartController.getAverageCourseScores);


module.exports = router;