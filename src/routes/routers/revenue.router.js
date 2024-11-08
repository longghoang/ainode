const express = require('express');
const router = express.Router();
const revenueController = require('../../app/controllers/Revenue');


router.get('/', revenueController.revenue);
router.get('/report-revenue', revenueController.selectDate);
router.get('/report-revenues', revenueController.reportRevenues);
router.get('/payment', revenueController.payment);
router.post('/payments', revenueController.payments);



module.exports = router;