const express = require('express');
const router = express.Router();
const PLO = require('../controllers/PloController');

router.get('/plos', PLO.index);
router.post('/plo', PLO.create);
router.get('/plo/:plo_id', PLO.getByID);
router.put('/plo/:plo_id', PLO.update);
router.delete('/plo/:plo_id', PLO.delete);
router.delete('/plos/delete/multiple', PLO.deleteMultiple);

router.get('/plos/isDelete/true', PLO.isDeleteTotrue);
router.get('/plos/isDelete/false', PLO.isDeleteTofalse);

router.put('/plos/soft-delete-multiple', PLO.softDeleteMultiple);
router.put('/plo/:plo_id/soft-delete', PLO.toggleSoftDeleteById);

router.get('/plo/templates/post', PLO.getFormPost);
router.post('/plo/templates/update', PLO.getFormUpdate);

module.exports = router;
