const express = require('express');
const router = express.Router();
const PLO = require('../controllers/PloController');

router.get('/plo', PLO.index);
router.post('/plo', PLO.create);
router.get('/plo/:id', PLO.getByID);
router.put('/plo/:id', PLO.update);
router.delete('/plo/:id', PLO.delete);
router.delete('/plo/delete/multiple', PLO.deleteMultiple);



router.get('/plo/isDelete/true', PLO.isDeleteTotrue);
router.get('/plo/isDelete/false', PLO.isDeleteTofalse);


router.put('/plo/listId/soft-delete-multiple', PLO.softDeleteMultiple);

router.put('/plo/:id/toggle-soft-delete', PLO.toggleSoftDeleteById);


router.get('/plo/templates/post', PLO.getFormPost);
router.post('/plo/templates/update', PLO.getFormUpdate);

module.exports = router;
