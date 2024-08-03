const express = require('express');
const router = express.Router();

const authController = require('../../app/controllers/Auth');

router.get('/', authController.index);
router.post('/register', authController.register);
router.get('/verify', authController.verifyIndex);
router.post('/verify', authController.verify);
router.get('/getcode', authController.getcode);
router.post('/register-firebase', authController.firebaseRegister);
router.post('/login-firebase', authController.firebaseLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
