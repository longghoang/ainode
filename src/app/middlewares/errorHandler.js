const axios = require('axios');

const getNewAccessToken = require('../utils/getNewAccessToken.util');

const getData = require('../utils/getData.util');

module.exports = async function errorHandler (err, req, res, next) {
    console.log(req.url);
    switch (err.status) {
        case 401:
            console.log('Is errorHandle 401');
            switch (req.url) {
                case '/auth/verify':
                    return res.cookie('status', 'verify-error', {maxAge: 2000})
                    .redirect('/auth/verify');
                default:
                    return res.cookie('status', 'fail', { maxAge: 2000 })
                    .redirect('/auth');
            }
        case 403:
            console.log('Is errorHandle 403');
            const cookieOptions = { signed: true, maxAge: 3600000 };
            const uid = req.signedCookies.uid;
            const act = req.signedCookies.act;
            let user, newAccessToken;
            try {
                if(req.url==='/' || req.url==='/me' || req.url==='/employ/register') {
                    if(!uid || !act) return res.redirect('/auth');
                    newAccessToken = await getNewAccessToken(uid);
                    user = await getData(newAccessToken);
                }
                switch (req.url) {
                    case '/':
                        return res.cookie('act', newAccessToken, cookieOptions).render('index', { user });
                    case '/me':
                        return res.cookie('act', newAccessToken, cookieOptions).render('me', { user });
                    case '/employ/register':
                        const email = user.email;
                        const userData = { email, ...req.body }
                        await axios.post(`${process.env.AUTH_SERVER}/register-employ`, userData);
                        return res.redirect('/');
                    case '/auth/login':
                        return res.cookie('status', 'verify-warning', {maxAge: 2000})
                        .redirect('/auth/verify');
                    case '/auth/logout':
                        return res.redirect('/auth');
                    default: 
                        return res.render('index');
                }
            } catch (error) {
                return res.status(500).json({ message: 'Failed to get new access token!' });
            }
        case 404:
            return res.send('404');
        case 409:
            return res.cookie('status', 'conflict', { maxAge: 2000 })
            .redirect('/auth');
        case 500:
            return res.send('500');
        default:
            console.log(err);
            return res.send('Error');
    }
}
