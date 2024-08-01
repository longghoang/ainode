const express = require('express');
const router = express.Router();
const revenueController = require('../../app/controllers/Revenue');

router.get('/', revenueController.revenue);

module.exports = router;