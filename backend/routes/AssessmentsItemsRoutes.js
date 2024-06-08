const express = require('express');
const router = express.Router();
const assessmentItemsController = require('../controllers/AssessmentItemsController');


router.post('/assessment-item', assessmentItemsController.create);


module.exports = router;