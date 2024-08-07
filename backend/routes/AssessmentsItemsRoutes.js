const express = require('express');
const router = express.Router();
const assessmentItemsController = require('../controllers/AssessmentItemsController');


router.post('/assessment-item', assessmentItemsController.create);
router.put('/assessment-item/:assessmentItem_id', assessmentItemsController.update);




module.exports = router;