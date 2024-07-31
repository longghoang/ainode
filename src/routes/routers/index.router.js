const express = require('express');
const router = express.Router();
const indexController = require('../../app/controllers/Index');
const scanController = require('../../app/controllers/Scan');

router.get('/', indexController.index);
router.get('/captureface', scanController.captureface);
router.post('/compare', scanController.compare);
router.post('/scan', scanController.scan);

module.exports = router;