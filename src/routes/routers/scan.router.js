const express = require('express');
const router = express.Router();
const scanController = require('../../app/controllers/Scan');

router.get('/', scanController.captureface);
router.post('/scanCar', scanController.scan);
router.post('/compare', scanController.compare);

module.exports = router;