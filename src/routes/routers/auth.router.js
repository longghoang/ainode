const express = require('express');
const router = express.Router();

const authController = require('../../app/controllers/Auth.js');

router.get('/', authController.index);
router.post('/register', authController.register);
router.post('/register-firebase', authController.firebaseRegister);
router.post('/login-firebase', authController.firebaseLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/verify', authController.verifyIndex);
router.post('/verify', authController.verify);

module.exports = router;