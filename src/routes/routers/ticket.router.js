const express = require('express');
const router = express.Router();

const ticketController = require('../../app/controllers/Ticket');

router.get('/', ticketController.index);

module.exports = router;