const express = require('express');
const router = express.Router();
const programRoutes = require('./PRORoutes');
const ploRoutes = require('./PLORouter');
const poRoutes = require('./PORouter');
const poPloRoutes = require('./Po_PloRouter');
const pdfRouters = require('./PdfRouter');
const csvRouters = require('./CSVRouter');
const csvSaveRouters = require('./SaveCSVRouter');

router.use('/api/admin', programRoutes);
router.use('/api/admin', ploRoutes);
router.use('/api/admin', poRoutes);
router.use('/api/admin', poPloRoutes);
router.use('/api/admin', pdfRouters);
router.use('/api/admin/csv',csvRouters);
router.use('/api/admin/csv-save',csvSaveRouters);

module.exports = router;
