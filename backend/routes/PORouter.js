const express = require('express');
const router = express.Router();
const PO = require('../controllers/PoController');

router.get('/po', PO.index);
router.post('/po', PO.create);
router.get('/po/:id', PO.getByID);
router.put('/po/:id', PO.update);
router.delete('/po/:id', PO.delete);

router.get('/po/isDelete/true', PO.isDeleteToTrue);
router.get('/po/isDelete/false', PO.isDeleteToFalse);
router.put('/po/listId/soft-delete-multiple', PO.softDeleteMultiple);
router.put('/po/:id/toggle-soft-delete', PO.toggleSoftDeleteById);

router.get('/po/templates/post', PO.getFormPost);
router.post('/po/templates/update', PO.getFormUpdate);

module.exports = router;

