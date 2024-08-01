const axios = require('axios');
const createError = require('http-errors');

const admin = require('../configs/firebase/index.firebase');
class Auth {
    index (req, res) {
        const status = req.cookies.status;
        return res.render('auth', { isAuth: true, status });
    }
    async register(req, res, next) {
        const userData = req.body;
        if(!userData.email || !userData.password) return res.status(400).json({ message: 'Invalid request data' });
        try {
            const response = await axios.post(`${process.env.AUTH_SERVER}/register`, userData);
            return res.cookie('status', 'register-success', {maxAge: 2000})
            .cookie('uid', response.data.uid, { signed: true })
            .redirect('/auth/verify');
        } catch (error) {
            console.log(error);
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }

    verifyIndex (req, res, next) {
        const status = req.cookies.status;
        return res.render('verify', { isVerify: true, status });
    }

    async verify (req, res, next) {
        const id = req.signedCookies.uid;
        if (!id) return res.redirect('auth');
        try {
            const data = { uid: id, code: req.body.code };
            const response = await axios.post(`${process.env.AUTH_SERVER}/verify`, data);
            const {uid, accessToken} = response.data;
            const cookieOptions = {
                signed: true,
                maxAge: 3600000
            };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .cookie('status', 'verify-success', {maxAge: 2000})
            .redirect('/');
        } catch (error) {
            console.log(error);
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }

    async firebaseRegister(req, res, next) {
        try {
            const email = req.body.email;
            const userRecord = (await admin.auth().getUserByEmail(email)).providerData[0];
            if(!userRecord.email || !userRecord.displayName) return res.status(400).json({ message: 'Invalid request data' });
            const userData = {
                email: `${userRecord.providerId},${userRecord.email}`,
                password: '123456',
                name: userRecord.displayName,
                method: userRecord.providerId,
            }
            const response = await axios.post(`${process.env.AUTH_SERVER}/register-firebase`, userData);
            const {uid, accessToken} = response.data;
            const cookieOptions = {
                signed: true,
                maxAge: 3600000
            };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .redirect('/');
                       
        } catch (error) {
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }

    async firebaseLogin(req, res, next) {
        try {
            const email = req.body.email;
            const userRecord = (await admin.auth().getUserByEmail(email)).providerData[0];
            if(!userRecord.email || !userRecord.displayName) return res.status(400).json({ message: 'Invalid request data' });
            const userData = {
                email: `${userRecord.providerId},${userRecord.email}`,
                method: userRecord.providerId,
            }
            const response = await axios.post(`${process.env.AUTH_SERVER}/login-firebase`, userData);
            const {uid, accessToken} = response.data;
            const cookieOptions = {
                signed: true,
                maxAge: 3600000
            };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .redirect('/');
                       
        } catch (error) {
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }

    async login(req, res, next) {
        const userData = req.body;
        if(!userData.email || !userData.password) return res.status(400).json({ message: 'Invalid request data' });
        try {
            const response = await axios.post(`${process.env.AUTH_SERVER}/login`, userData);
            const {uid, accessToken} = response.data;
            const cookieOptions = {
                signed: true,
                maxAge: 3600000
            };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .redirect('/');
        } catch (error) {
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }
    async logout(req, res, next) {
        const act = req.signedCookies.act;
        if(!act) res.redirect('/auth');  
        try {
            await axios.delete(`${process.env.AUTH_SERVER}/logout`, { headers: { 'Authorization': `Bearer ${act}` } })
            return res.clearCookie('act')
            .clearCookie('uid')
            .redirect('/auth');
        } catch (error) {
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }
}

module.exports = new Auth();