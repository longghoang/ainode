const axios = require('axios');
const errorFlow = require('../utils/errorFlow.util');

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
            .cookie('exp', response.data.expires, {maxAge: 120000})
            .redirect('/auth/verify');
        } catch (error) {
            errorFlow(error, next);
        }
    }

    verifyIndex (req, res, next) {
        const status = req.cookies.status;
        const exp = new Date(req.cookies.exp);
        if(!exp || exp == 'Invalid Date') return res.render('verify', { isVerify: true, status });
        const currentTime = new Date();
        const timeDifference = exp - currentTime;
        const time = Math.floor(timeDifference / 1000);
        return res.render('verify', { isVerify: true, status, time });
    }

    async verify (req, res, next) {
        const id = req.signedCookies.uid;
        if (!id) return res.redirect('auth');
        try {
            const data = { uid: id, code: req.body.code };
            const response = await axios.post(`${process.env.AUTH_SERVER}/verify`, data);
            const {uid, accessToken} = response.data;
            const cookieOptions = { signed: true, maxAge: 3600000 };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .cookie('status', 'verify-success', {maxAge: 2000})
            .redirect('/');
        } catch (error) {
            errorFlow(error, next);
        }
    }

    async getcode (req, res, next) {
        const id = req.signedCookies.uid;
        if (!id) return res.redirect('auth');
        try {
            const response = await axios.post(`${process.env.AUTH_SERVER}/getcode`, { id });
            return res.cookie('status', 'getcode-success', {maxAge: 2000})
            .cookie('exp', response.data.expires, {maxAge: 120000})
            .redirect('/auth/verify');
        } catch (error) {
            errorFlow(error, next);
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
            const cookieOptions = { signed: true, maxAge: 3600000 };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .redirect('/');
        } catch (error) {
            errorFlow(error, next);
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
            const cookieOptions = { signed: true, maxAge: 3600000 };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .redirect('/');
                       
        } catch (error) {
            errorFlow(error, next);

        }
    }

    async login(req, res, next) {
        const userData = req.body;
        if(!userData.email || !userData.password) return res.status(400).json({ message: 'Invalid request data' });
        try {
            const response = await axios.post(`${process.env.AUTH_SERVER}/login`, userData);
            const {uid, accessToken} = response.data;
            const cookieOptions = { signed: true, maxAge: 3600000 };
            return res.cookie('act', accessToken, cookieOptions)
            .cookie('uid', uid, cookieOptions)
            .redirect('/');
        } catch (error) {
            errorFlow(error, next);

        }
    }
    async logout(req, res, next) {
        const act = req.signedCookies.act;
        if(!act) res.redirect('/auth');  
        try {
            await axios.delete(`${process.env.AUTH_SERVER}/logout`, { headers: { 'Authorization': `Bearer ${act}` } })
            res.clearCookie('act');
            res.clearCookie('uid');
            return res.redirect('/auth');
        } catch (error) {
            errorFlow(error, next);
        }
    }
}

module.exports = new Auth();
