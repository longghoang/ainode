const express = require('express');
const router = express.Router();

const ticketController = require('../../app/controllers/Ticket');

router.get('/', ticketController.index);
router.post('/register', ticketController.register);
router.get('/managment', ticketController.managment);

module.exports = router;