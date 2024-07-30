const express = require('express');
const router = express.Router();

const helpController = require('../../app/controllers/Help');

router.get('/', helpController.index);

module.exports = router;