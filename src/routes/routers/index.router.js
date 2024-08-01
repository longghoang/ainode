const express = require('express');
const router = express.Router();
const indexController = require('../../app/controllers/Index');

router.get('/', indexController.index);


module.exports = router;