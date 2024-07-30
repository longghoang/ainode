const express = require('express');
const router = express.Router();

const employController = require('../../app/controllers/Employ');

router.get('/', employController.index);
router.post('/register', employController.register);

module.exports = router;