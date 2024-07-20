const express = require('express');
const router = express.Router();
const PLO = require('../controllers/PloController');

router.get('/plos', PLO.index);
router.post('/plo', PLO.create);
router.get('/plo/:id', PLO.getByID);
router.put('/plo/:id', PLO.update);
router.delete('/plo/:id', PLO.delete);
router.delete('/plos/multiple', PLO.deleteMultiple);
router.get('/plos/isDelete/true', PLO.isDeleteTotrue);
router.get('/plos/isDelete/false', PLO.isDeleteTofalse);
router.put('/plos/softDelete', PLO.softDeleteMultiple);
router.put('/plo/:id/softDelete', PLO.toggleSoftDeleteById);
router.get('/plo/templates/post', PLO.getFormPost);
router.post('/plo/templates/update', PLO.getFormUpdate);

module.exports = router;
