const express = require('express');
const router = express.Router();
const emptyController = require('../../app/controllers/Empty');

router.get('/', emptyController.empty);


module.exports = router;