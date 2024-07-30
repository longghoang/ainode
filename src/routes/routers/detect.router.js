const express = require('express');
const router = express.Router();

const detectController = require('../../app/controllers/Detect');

router.get('/', detectController.index);

module.exports = router;