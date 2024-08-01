const express = require('express');
const router = express.Router();
const forgotpwController = require('../../app/controllers/Forgotpw');

router.get('/', forgotpwController.index);
router.post('/sendcode', forgotpwController.sendcode);
router.get('/changepass', forgotpwController.changepass);
router.post('/verifycode', forgotpwController.verifycode);
router.post('/savepw', forgotpwController.savepw);

module.exports = router;